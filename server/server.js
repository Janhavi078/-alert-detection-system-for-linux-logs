const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Placeholder for Routes [cite: 82]
// app.use('/api/logs', require('./routes/logRoutes'));
// app.use('/api/alerts', require('./routes/alertRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});