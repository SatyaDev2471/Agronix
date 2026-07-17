const express = require('express');
const router = express.Router();
const marketController = require('../controllers/marketController');

// Routes
router.get('/dashboard', marketController.getMarketDashboard);
router.get('/vendors', marketController.getVendorsAndMandis);
router.get('/global', marketController.getGlobalMarket);

// Get market news
router.get('/news', marketController.getMarketNews);

// Get Government MSP data
router.get('/msp', marketController.getGovernmentMSP);

module.exports = router;
