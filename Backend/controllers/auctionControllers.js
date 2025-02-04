const cron = require("node-cron");
const Auction = require("../models/Auction");
const Product = require("../models/Product");
const Bid = require("../models/Bid");
const { Op } = require("sequelize");
const User = require("../models/User");
const nodemailer = require("nodemailer");

const moment = require("moment-timezone");
// Create a new auction //

exports.createAuction = async (req, res) => {
  const { productId, auctionStart, auctionEnd } = req.body;

  try {
    const product = await Product.findByPk(productId);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    const existingAuction = await Auction.findOne({
      where: {
        productId: product.id,
        status: { [Op.in]: ["upcoming", "ongoing", "completed"] },
      },
    });

    if (existingAuction) {
      return res
        .status(400)
        .json({ error: "This product is already in an auction." });
    }

    const startTime = moment.tz(auctionStart, "Asia/Kolkata").toDate();
    const endTime = moment.tz(auctionEnd, "Asia/Kolkata").toDate();
    const now = moment().tz("Asia/Kolkata").toDate();

    if (startTime >= endTime || startTime <= now) {
      return res.status(400).json({ error: "Invalid auction dates provided." });
    }

    let status = "upcoming";
    if (startTime <= now && now < endTime) {
      status = "ongoing";
    } else if (now >= endTime) {
      status = "completed";
    }

    console.log(status,"status")
    const auction = await Auction.create({
      productId,
      auctionStart: startTime,
      auctionEnd: endTime,
      status,
    });

  
    

    await product.update({ status: "processing " });

    // Construct the cron expression based on endTime
    const cronExpression = `${endTime.getSeconds()} ${endTime.getMinutes()} ${endTime.getHours()} ${endTime.getDate()} ${endTime.getMonth() + 1} *`;

    // Schedule the auction end job
    cron.schedule(cronExpression, async () => {
      console.log(`Auction ${auction.id} is ending...`);
      
      // Find the highest bid for this auction
      const highestBid = await Bid.findOne({
        where: { auctionId: auction.id },
        order: [["amount", "DESC"]],
      });

      if (highestBid) {
        // Assign the product to the highest bidder
        const winner = await User.findByPk(highestBid.userId);
        if (winner) {
          await product.update({ status: "sold", ownerId: winner.id });
          console.log(
            `Product ${product.id} assigned to User ${winner.username}`
          );
        }
      }

      console.log("Completed");

      // Mark the auction as completed
      await auction.update({ status: "completed" });
    });

    res.status(201).json({ message: "Auction created successfully", auction });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};




exports.getAuctions = async (req, res) => {
  try {
    const auctions = await Auction.findAll({
      include: [{ model: Product
      ,attributes: ["name", "status","imageUrls", "description", "startingPrice"]
       }],
    });
   
    res.status(200).json({ auctions });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Auction by ID //
exports.getAuctionById = async (req, res) => {
  const { auctionId } = req.params;

  try {
    const auction = await Auction.findByPk(auctionId, {
      include: [{ model: Product,
        attributes:["status","imageUrls", "description", "startingPrice"]

       }],
    });

    if (!auction) {
      return res.status(404).json({ error: "Auction not found" });
    }

    res.status(200).json({ auction });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Auction Status //
exports.updateAuctionStatuses = async () => {
  const now = moment().tz("Asia/Kolkata").toDate();

  await Auction.update(
    { status: "ongoing" },
    {
      where: {
        auctionStart: { [Op.lte]: now },
        auctionEnd: { [Op.gt]: now },
        status: "upcoming",
      },
    }
  );

  await Auction.update(
    { status: "completed" },
    {
      where: {
        auctionEnd: { [Op.lte]: now },
        status: "ongoing",
      },
    }
  );
};
cron.schedule("* * * * *", exports.updateAuctionStatuses);

// End Auction //
// exports.endAuction = async (req, res) => {
//   try {
//     const { auctionId } = req.params;

//     const auction = await Auction.findByPk(auctionId);
//     if (!auction) {
//       return res.status(404).json({ error: "Auction not found" });
//     }

//     // Find all bids for the given auctionId
//     const bids = await Bid.findAll({
//       where: { auctionId },
//       include: [{ model: User, attributes: ["id", "username", "email"] }],
//       order: [["amount", "DESC"]],
//     });

//     const product = await Product.findByPk(auction.productId);

//     if (!product) {
//       return res.status(404).json({ error: "Product not found" });
//     }

//     if (bids.length > 0) {
//       const winningBid = bids[0];

//       product.soldTo = winningBid.User.id;
//       product.status = "sold";
//       await product.save();

//       await Bid.destroy({
//         where: {
//           auctionId,
//           id: { [Op.ne]: winningBid.id },
//         },
//       });

//       const transporter = nodemailer.createTransport({
//         service: "Gmail",
//         auth: {
//           user: "manojprajapat928@gmail.com",
//           pass: "egou npff eckk aqqe",
//         },
//       });

//       const mailOptions = {
//         from: "manojprajapat928@gmail.com",
//         to: winningBid.User.email,
//         subject: "🎉 Congratulations! You won the auction 🎉",
//         html: `
//           <div>
//             <h2>Congratulations, ${winningBid.User.username}!</h2>
//             <p>You have won the auction for the product: ${product.name}</p>
//             <p>Winning Bid: $${winningBid.amount}</p>
//           </div>
//         `,
//       };

//       await transporter.sendMail(mailOptions);

//       const loggedInUserId = req.user.userId;

//       if (loggedInUserId === winningBid.User.id) {
//         res.status(200).json({
//           message: "Auction ended successfully..............................",
//           product: {
//             id: product.id,
//             name: product.name,
//             soldPrice: winningBid.amount,
//           },
//           winnerDetails: {
//             id: winningBid.User.id,
//             username: winningBid.User.username,
//             email: winningBid.User.email,
//             // ABC:"abc"
//           },
//         });
//       } else {
//         res.status(200).json({
//           message: "Auction ended successfully",
//           product: {
//             id: product.id,
//             name: product.name,
//             soldPrice: winningBid.amount,
//           },
//           winner: {
//             username: winningBid.User.username,
//           },
//         });
//       }
//     } else {
//       product.status = "unsold";
//       await product.save();
//       res.status(404).json({ message: "No bids placed. Product unsold." });
//     }
//   } catch (error) {
//     console.error("Error ending auction:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

// Delete Auction //
exports.deleteAuction = async (req, res) => {
  const { auctionId } = req.params;

  try {
    const auction = await Auction.findByPk(auctionId);

    if (!auction) {
      return res.status(404).json({ error: "Auction not found" });
    }

    await auction.destroy();
    res.status(200).json({ message: "Auction deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Ended Auctions //
// exports.getEndedAuctions = async (req, res) => {
//   try {
//     const { auctionId } = req.params;

//     const auction = await Auction.findByPk(auctionId);
//     if (!auction) {
//       return res.status(404).json({ error: "Auction not found" });
//     }

//     console.log(auctionId,"Auction Id")

//     const endedAuction = await Auction.findOne({
//       where: { id: auctionId, status: "completed" },
//       include: [
//         {
//           model: Product,
//           include: [
//             {
//               model: Bid,
//               order: [["amount", "DESC"]],
//               limit: 1,
//               include: [
//                 {
//                   model: User,
//                   attributes: ["id", "username", "email"],
//                 },
//               ],
//             },
//           ],
//         },
//       ],
//     });

//     if (!endedAuction) {
//       return res.status(404).json({ message: "No ended auction found" });
//     }

//     const winningBid = endedAuction.Product?.Bids[0];
//     const response = {
//       auctionId: endedAuction.id,
//       product: {
//         id: endedAuction.Product.id,
//         name: endedAuction.Product.name,
//         imageUrl: endedAuction.Product.imageUrl,
//         description: endedAuction.Product.description,
//       },
//       winningBid: winningBid
//         ? {
//             amount: winningBid.amount,
//             user: {
//               id: winningBid.User.id,
//               username: winningBid.User.username,
//               email: winningBid.User.email,
//             },
//           }
//         : null,
//     };

//     res.status(200).json({ endedAuction: response });
//   } catch (error) {
//     console.error("Error fetching ended auction:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

exports.getEndedAuctions = async (req, res) => {
  try {
    const { auctionId } = req.params;

    // Find the auction by its ID
    const auction = await Auction.findByPk(auctionId);
    if (!auction) {
      return res.status(404).json({ error: "Auction not found" });
    }

    // Find the product associated with the auction
    const product = await Product.findByPk(auction.productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Fetch all bids for the auction, ordered by the highest bid
    const bids = await Bid.findAll({
      where: { auctionId },
      include: [{ model: User, attributes: ["id", "username", "email"] }],
      order: [["amount", "DESC"]],
    });

    // If there are bids, set the winning bid
    let winningBid = null;
    if (bids.length > 0) {
      winningBid = bids[0];
      product.soldTo = winningBid.User.id;
      product.status = "sold";
      await product.save();

      // Remove other bids
      await Bid.destroy({
        where: {
          auctionId,
          id: { [Op.ne]: winningBid.id },
        },
      });

      // Send the email notification to the winning bidder
      // const transporter = nodemailer.createTransport({
      //   service: "Gmail",
      //   auth: {
      //     user: "manojprajapat928@gmail.com",
      //     pass: "egou npff eckk aqqe",
      //   },
      // });

      // const mailOptions = {
      //   from: "manojprajapat928@gmail.com",
      //   to: winningBid.User.email,
      //   subject: "🎉 Congratulations! You won the auction 🎉",
      //   html: `
      //     <div>
      //       <h2>Congratulations, ${winningBid.User.username}!</h2>
      //       <p>You have won the auction for the product: ${product.name}</p>
      //       <p>Winning Bid: $${winningBid.amount}</p>
      //     </div>
      //   `,
      // };

      // await transporter.sendMail(mailOptions);

      const loggedInUserId = req.user.userId;

      if (loggedInUserId === winningBid.User.id) {
        res.status(200).json({ isUserWinner :true,
          message: "Auction ended successfully..............................",
          product: {
            id: product.id,
            name: product.name,
            imageUrls: product.imageUrls,
            description: product.description,
            startingPrice: product.startingPrice,
            soldPrice: winningBid.amount,
            auctionEnd: auction.auctionEnd,
            status: auction.status,
          },
          winnerDetails: {
            id: winningBid.User.id,
            username: winningBid.User.username,
            email: winningBid.User.email,
            // ABC:"abc"
          },
        });
      } else {
        res.status(200).json({ isUserWinner :false,
          message: "Auction ended successfully",
          product: {
            name: product.name,
            imageUrls: product.imageUrls,
            description: product.description,
            startingPrice: product.startingPrice,
            soldPrice: winningBid.amount,
            startTime: auction.startTime,
          },
          winner: {
            username: winningBid.User.username,
          },
        });
      }
    } else {
      product.status = "unsold";
      await product.save();
      res.status(404).json({ message: "No bids placed. Product unsold." });
    }
  } catch (error) {
    console.error("Error ending auction:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.getAuctionStatusDetails = async (req, res) => {


 
    try {
      const ongoingAuctions = await Auction.findAll({
        where: { status: "ongoing" },
        include: [
          {
            model: Product,
            attributes: ["name", "imageUrl", "description"],
          },
        ],
      });

      const completedAuctions = await Auction.findAll({
        where: { status: "completed" },
        include: [
          {
            model: Product,
            attributes: ["name", "imageUrl", "description"],
          },
        ],
      });

      const pendingAuctions = await Auction.findAll({
        where: { status: "upcoming" },
        include: [
          {
            model: Product,
            attributes: ["name", "imageUrl", "description"],
          },
        ],
      });

      

      res.status(200).json([
        { status: "ongoing", auctions: ongoingAuctions },
        { status: "completed", auctions: completedAuctions },
        { status: "upcoming", auctions: pendingAuctions }
      ]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

