const Auction = require('../models/Auction');
const Product = require('../models/Product');


exports.getChartAuctionDetails = async (req, res) => {
  try {
    const auctionData = {
      total: await Auction.count(),
      completed: await Auction.count({ where: { status: "completed" } }),
      pending: await Auction.count({ where: { status: "pending" } }),
      ongoing: await Auction.count({ where: { status: "ongoing" } }),
    };
    res.status(200).json(auctionData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getChartProductDetails = async (req, res) => {
  try {
    const productData = {
      total: await Product.count(),
      sold: await Product.count({ where: { status: "sold" } }),
      unsold: await Product.count({ where: { status: "unsold" } }),
      pending: await Product.count({ where: { status: "pending" } }),
    };

    res.status(200).json(productData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

