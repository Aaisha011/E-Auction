const Product = require("../models/Product");
const Category = require("../models/Category");
const Bid = require("../models/Bid");
const User = require("../models/User");
const Auction = require("../models/Auction");

// Create product (admin only)
exports.createProduct = async (req, res) => {
  const { id, name, description, startingPrice,categoryId } = req.body;
  console.log(id, name, description, startingPrice,categoryId,"created")

  try {
    //   const startTime = new Date(auctionStart);
    //   const endTime = new Date(auctionEnd);

    // if (startTime >= endTime) {
    //   return res
    //     .status(400)
    //     .json({ error: "Auction end time must be after start time." });
    // }


    // const category = await Category.findByPk(categoryId);
    // if (!category) {
    //   return res.status(404).json({ error: "Category not found" });
    // }
    const imageUrls = req.files.map(
      (file) => `${req.protocol}://${req.get("host")}/uploads/${file.filename}`
    );

    const product = await Product.create({
      id,
      name,
      description,
      startingPrice,
      // auctionStart: startTime,
      // auctionEnd: endTime,
      categoryId,
      imageUrls,
    });

    res.status(201).json({ success: true, message: "Product created successfully!", product });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get all products
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      include:{
        model: Category,
        attributes: ["id","name"]
      }
    });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update product (admin only)
exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, description, startingPrice, auctionStart, auctionEnd } =
    req.body;

  try {
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    const imageUrl = req.file
      ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`
      : product.imageUrl;

    await product.update({
      name,
      description,
      startingPrice,
      auctionStart,
      auctionEnd,
      imageUrl,
    });

    res.status(200).json({ message: "Product updated", product });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ error: error.message });
  }
};

// Delete product (admin only)
exports.deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    await product.destroy();
    res.status(200).json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProductStatusDetails = async (req, res) => {
  try {
    
    const soldProducts = await Product.findAll({
      where: { status: "sold" },  
      attributes: ["id", "name", "imageUrls", "description"],
    });

    const unsoldProducts = await Product.findAll({
      where: { status: "unsold" },
      attributes: ["id", "name", "imageUrls", "description"],
    });

    const processingProducts = await Product.findAll({
      where: { status: "processing" },
      attributes: ["id", "name", "imageUrls", "description"],
    });

    const pendingProducts = await Product.findAll({
      where: { status: "pending" },
      attributes: ["id", "name", "imageUrls", "description"],
    });

    res.status(200).json([
      { status: "sold", products: soldProducts},
      { status: "unsold", products: unsoldProducts },
      { status: "processing", products: processingProducts },
      { status: "pending", products: pendingProducts },
    ]);
  } catch (error) {
    res.status(500).json({ error: error.message });   
  }
};


// Get product by ID
// exports.getProductById = async (req, res) => {
//   const { productId } = req.params;

//   try {
//     const product = await Product.findByPk(productId);

//     if (!product) {
//       return res.status(404).json({ error: "Product not found" });
//     }

//     const category = await Category.findOne({
//       where: { id: product.categoryId },
//       attributes: ["id", "name"],
//     });

    

//     // Send the response with both product and category data
//     res.status(200).json({ product, category });
//   } catch (error) {
//     console.error("Error fetching product by ID:", error);
//     res.status(500).json({ error: "Failed to retrieve product details" });
//   }
// };

exports.getProductById = async (req, res) => {
  const { productId } = req.params;

  try {
    const product = await Product.findByPk(productId);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    const category = await Category.findOne({
      where: { id: product.categoryId },
      attributes: ["id", "name"],
    });

    const bids = await Bid.findAll({
      where: { productId },
      include: [
        {
          model: User,
          attributes: ["id", "username", "email"],
        },
      ],
      order: [["amount", "DESC"]],
    });

    const auction = await Auction.findOne({
      where: { productId },
      attributes: ["id", "auctionStart", "auctionEnd", "status"],
    });

    let winningBid = null;

    if (auction) {
      const currentTime = new Date();
      const auctionEndTime = new Date(auction.auctionEnd);

     
      if (currentTime > auctionEndTime && bids.length > 0) {
        winningBid = bids[0]; 
        product.status = "sold";
        product.soldTo = winningBid.User.id;
        await product.save();
      }
    }

    const response = {
      product: {
        id: product.id,
        name: product.name,
        description: product.description,
        imageUrls: product.imageUrls,
        startingPrice: product.startingPrice,
        status: product.status,
        category,
      },
      auction: auction
        ? {
            id: auction.id,
            startDate: auction.auctionStart,
            endDate: auction.auctionEnd,
            status: auction.status,
          }
        : null,
      winningBid: winningBid
        ? {
            amount: winningBid.amount,
            user: {
              id: winningBid.User.id,
              username: winningBid.User.username,
              email: winningBid.User.email,
            },
          }
        : null,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    res.status(500).json({ error: "Failed to retrieve product details" });
  }
};


