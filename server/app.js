const express = require('express');
const cors = require('cors');
const logRoutes = require('./routes/logRoutes');
const alertRoutes = require('./routes/alertRoutes');
const mlRoutes = require('./routes/mlRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // JSON payload handling [cite: 95]

// Route Registration [cite: 81]
app.use('/api/logs', logRoutes); // [cite: 84]
app.use('/api/alerts', alertRoutes); // [cite: 89]
app.use('/api/ml', mlRoutes); // ML Service integration

module.exports = app;