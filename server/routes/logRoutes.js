const express = require('express');
const router = express.Router();
// Controller se functions import karein
const { getLogs, analyzeLogs } = require('../controllers/logController');

/**
 * @route   GET /api/logs
 * @desc    Fetch all system logs from Elasticsearch [cite: 59, 83, 84]
 */
router.get('/', getLogs);

/**
 * @route   POST /api/analyze
 * @desc    Send logs to Python ML Service for anomaly detection [cite: 85, 86, 87]
 */
router.post('/analyze', analyzeLogs);

module.exports = router;