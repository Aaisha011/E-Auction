const express = require('express');
const { placeBid, getAllBids, deleteBid,  } = require('../controllers/bidController');
const { isAuthenticated, isAdmin } = require('../middleware/auth');

const router = express.Router();

router.post('/placeBid', isAuthenticated, placeBid);

router.get('/allBids/:auctionId', getAllBids);


// Admin: Delete a bid
router.delete('/deleteBid/:bidId', isAuthenticated, isAdmin, deleteBid);

module.exports = router;
