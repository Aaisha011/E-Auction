const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
// const Bid = require('./bid');
const Category = require("./Category");

const Product = sequelize.define("Product", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  startingPrice: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  categoryId:{
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "categories",
      key: 'id'
    }
  },
  // auctionStart: {
  //   type: DataTypes.DATE,
  //   allowNull: false,
  // },
  // auctionEnd: {
  //   type: DataTypes.DATE,
  //   allowNull: false,
  // },
  imageUrls: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM("pending", "sold", "unsold", "processing"),
    defaultValue: "pending",
  },
});

Category.hasMany(Product, { foreignKey: 'categoryId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
Product.belongsTo(Category, { foreignKey: 'categoryId' });

module.exports = Product;
