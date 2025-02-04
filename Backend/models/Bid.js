const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const Auction = require('./Auction');
const Product = require('./Product');

const Bid = sequelize.define('Bid', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    // references: {
    //   model: User,
    //   key: 'id',
    // },
  },
  auctionId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    // references: {
    //   model: Auction,
    //   key: 'id',
    // },
  },
  productId:{
    type: DataTypes.INTEGER,
    references: {
      model: Product,
      key: 'id',
    },
   
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  bidTime: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },

});

Product.hasMany(Bid, { foreignKey: 'productId' });
Bid.belongsTo(Product, { foreignKey: 'productId' });

Auction.hasMany(Bid, { foreignKey: "auctionId" });
Bid.belongsTo(Auction, { foreignKey: "auctionId" });



module.exports = Bid;
