const express = require('express');
const router = express.Router();
const auctionController = require('../controllers/auctionControllers');
const { isAuthenticated } = require('../middleware/auth');
// const { AccessDeniedError } = require('sequelize');

// Auction routes
router.post('/auctions', auctionController.createAuction);
router.get('/auctions', auctionController.getAuctions);
router.get('/auctions/:auctionId', auctionController.getAuctionById);
router.put('/auctions/:auctionId', auctionController.updateAuctionStatuses);

// router.post('/endAuction/:auctionId',isAuthenticated, auctionController.endAuction);

router.delete('/delete/:auctionId', auctionController.deleteAuction);

router.get('/getEndAuction/:auctionId',isAuthenticated, auctionController.getEndedAuctions)

router.get('/getAuctionStatusDetails', auctionController.getAuctionStatusDetails);

module.exports = router;
