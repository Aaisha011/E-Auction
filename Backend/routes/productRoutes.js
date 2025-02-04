const express = require('express');
const { createProduct, getProducts, updateProduct, deleteProduct, getProductStatusDetails, getProductById } = require('../controllers/productController');
const { isAuthenticated, isAdmin } = require('../middleware/auth');
const { upload } = require('../utils/multer');

const router = express.Router();

// work all api done 

router.post('/createProduct', isAuthenticated, upload, isAdmin, createProduct);
router.get('/getProducts', getProducts);
router.put('/updateProduct/:id', isAuthenticated,upload, isAdmin, updateProduct);
router.delete('/deleteProduct/:id', isAuthenticated, isAdmin, deleteProduct);
router.get('/getProduct/:productId', getProductById);

router.get('/getProductStatusDetails',getProductStatusDetails)

module.exports = router;
