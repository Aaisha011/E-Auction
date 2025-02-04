const express = require('express');

const { isAuthenticated, isAdmin } = require('../middleware/auth');
const { getChartAuctionDetails, getChartProductDetails } = require('../controllers/chartController');

const router = express.Router();


router.get('/chart/auction/status',isAuthenticated, isAdmin, getChartAuctionDetails);
router.get('/chart/product/status',isAuthenticated, isAdmin, getChartProductDetails);




module.exports = router;
