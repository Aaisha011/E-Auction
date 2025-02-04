const Bid = require("../models/Bid");
const Product = require("../models/Product");
const Auction = require("../models/Auction");
const User = require("../models/User");



// Place a bid by user //
exports.placeBid = async (req, res) => {
  try {
    const { auctionId, bidAmount } = req.body;

    const auction = await Auction.findByPk(auctionId);
    if (!auction) {
      return res.status(404).json({ error: "Auction not found" });
    }

    if (auction.status !== "ongoing") {
      return res.status(400).json({
        error: "Bids can only be placed during an ongoing auction.",
      });
    }

    const product = await Product.findByPk(auction.productId);
    if (!product) {
      return res.status(404).json({ error: "Associated product not found" });
    }

    if (bidAmount <= product.startingPrice) {
      return res.status(400).json({
        error: `Bid amount must be greater than or equal to the product price of ${product.startingPrice}`,
      });
    }

    const highestBid = await Bid.findOne({
      where: { auctionId },
      order: [["amount", "DESC"]],
    });

    if (highestBid && bidAmount <= highestBid.amount) {
      return res.status(400).json({
        error: `Your bid must be higher than the current highest bid of ${highestBid.amount}`,
      });
    }

    const bid = await Bid.create({
      userId: req.user.userId,
      auctionId,
      productId: product.id,
      amount: bidAmount,
    });

    const user = await User.findByPk(req.user.userId, {
      attributes: ["username", "email"],
    });

    res.status(201).json({
      message: "Bid placed",
      bid: {
        amount: bid.amount,
        username: user.username,
        auctionId: bid.auctionId,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log(error.message);
  }
};

// Get all bids for an auction //
exports.getAllBids = async (req, res) => {
  try {
    const bids = await Bid.findAll({
      where: { auctionId: req.params.auctionId },
      include: [
        { model: User, attributes: ["username"] },
        { model: Product, attributes: ["name"] },
      ],
      order: [["amount", "DESC"]],
    });

    const highestBid = bids.length > 0 ? bids[0] : null;

    res.status(200).json({ message: "All bids retrieved", bids, highestBid });
  } catch (error) {
    console.error("Error retrieving bids:", error);
    res.status(500).json({ error: error.message });
  }
};

// Delete a bid (Admin only) //////////////////////////////////
exports.deleteBid = async (req, res) => {
  const { bidId } = req.params;

  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Access denied" });
    }

    const bid = await Bid.findByPk(bidId);

    if (!bid) {
      return res.status(404).json({ error: "Bid not found" });
    }

    await bid.destroy();

    // io.emit('bidDeleted', { bidId });
    res.status(200).json({ message: "Bid deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
