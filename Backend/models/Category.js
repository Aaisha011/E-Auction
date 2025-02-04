const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
// const Product = require('./Product');

const Category = sequelize.define('Category', {
  id:{
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,  
   
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

sequelize.sync();




module.exports = Category;
