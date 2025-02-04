const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET;

// Register a new user//
exports.register = async (req, res) => {
  const {
    username,
    email,
    password,
    role,
    address,
    city,
    state,
    country,
    contactNo,
  } = req.body;
  console.log(req.body);

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const imageUrls = req.files.map(
      (file) => `${req.protocol}://${req.get("host")}/uploads/${file.filename}`
    );
   

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      role: role || "user",
      imageUrls,
      address,
      city,
      state,
      country,
      contactNo,
    });

    res.status(201).json({
      message: "User registered",
      user: { username: user.username, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Login user and admin //
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      console.error("User not found");
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.error("Invalid password");
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "1D" }
    );
    const role = user.role;

    res.status(200).json({ message: "Login successful", token, role });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get all users (admin only) //
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: [
        "id",
        "username",
        "email",
        "role",
        "imageUrls",
        "contactNo",
        "address",
        "city",
        "state",
        "country",
      ],
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete user (admin only) //
exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    await user.destroy();
    res.status(200).json({ message: "User deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// get user details by token //
exports.getUserDetails = async (req, res) => {

  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await User.findByPk(decoded.userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const userDetails = {
      username: user.username,
      email: user.email,
      contactNo: user.contactNo,
      imageUrls: user.imageUrls,
      address: user.address,
      city: user.city,
      state: user.state,
      country: user.country,
      // role: user.role,
    };

    res.status(200).json({ userDetails });
  } catch (error) {
    console.error("Error retrieving user details:", error);
    res.status(500).json({ error: "Failed to fetch user details" });
  }
};
