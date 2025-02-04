// routes/categoryRoutes.js
const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

// Create a new category
router.post('/categories', categoryController.createCategory);

// Get all categories
router.get('/getCategories', categoryController.getAllCategories);

// Update a category by ID
router.put('/categories/:categoryId', categoryController.updateCategory);

// Delete a category by ID
router.delete('/categories/:categoryId', categoryController.deleteCategory);

module.exports = router;
