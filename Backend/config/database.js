
const { Sequelize } = require('sequelize');

require('dotenv').config();



const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST || 'localhost',
  dialect: 'mysql',
  logging: false, 
  // port: 3306, 
  timezone: process.env.DB_TIMEZONE,
});

// sequelize.sync({ alter:true})

module.exports = sequelize;



