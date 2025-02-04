const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Product = require('../models/Product');
const Bid = require('./Bid');

const Auction = sequelize.define('Auction', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  }, 
  productId: {
    type: DataTypes.INTEGER,
    references: {
      model: Product,
      key: 'id',
    },
    allowNull: false,
  },
  auctionStart: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  auctionEnd: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('upcoming', 'ongoing', 'completed'),
    allowNull: false,
    defaultValue: 'upcoming',
  },
});






Auction.belongsTo(Product, { foreignKey: 'productId'  });
Product.hasOne(Auction, { foreignKey: 'productId'});




module.exports = Auction;
