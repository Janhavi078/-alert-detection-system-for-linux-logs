const express = require('express');
const router = express.Router();
// Controller se functions import karein
const { getAlerts, getStats } = require('../controllers/alertController');

/**
 * @route   GET /api/alerts
 * @desc    Retrieve list of detected anomalies [cite: 62, 88, 89]
 */
router.get('/', getAlerts);

/**
 * @route   GET /api/stats
 * @desc    Fetch dashboard summary (Total logs, anomaly count) [cite: 90, 91]
 */
router.get('/stats', getStats);

module.exports = router;