// // routes/userRoutes.js
// const express = require('express');
// const { getCurrentUser, getAllUsers } = require('../controllers/userController');
// const { isAuthenticated, isAdmin } = require('../middleware/auth');

// const router = express.Router();




// router.get('/me', getCurrentUser);

// // Admin-only route to get all users
// router.get('/users', isAuthenticated, isAdmin, getAllUsers);

// module.exports = router;