const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Product = require("../models/Product");
const Bid = require("../models/Bid");
const bcrypt = require("bcrypt");


const User = sequelize.define("User", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM("admin", "user"),
    allowNull: false,
    defaultValue: "user",
  },
  imageUrls: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  city: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  state: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  country: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  contactNo: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      is: /^[0-9]{10,15}$/,
    },
  },
});

// User.addHook("afterSync", async () => {
//   try {
//     const processesCount = await User.count();
//     const salt = await bcrypt.genSalt(10);
//     const hashpass = await bcrypt. hash("Admin@123", salt);
//     const commonPass = await bcrypt. hash("Manoj@123", salt);
//     if (processesCount === 0) {
//       await User.bulkCreate([
//         { name: "Admin", email: "admin1@gmail.com", password: hashpass },
//         {
//           name: "Manoj",
//           email: "manoj@gmail.com",
//           password: commonPass,
//         },
//       ]);
//       console.log("Admin User created");
//     } else {
//       console.log("Admin User already exist");
//     }
//   } catch (error) {
//     console.error("Error creating Admin User:", error);
//   }
// });

User.hasMany(Product, {
  foreignKey: "adminId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Product.belongsTo(User, {
  foreignKey: "adminId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

User.hasMany(Bid, {
  foreignKey: "userId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Bid.belongsTo(User, {
  foreignKey: "userId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

module.exports = User;
