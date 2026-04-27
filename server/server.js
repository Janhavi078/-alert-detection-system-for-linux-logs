const http = require('http');
const app = require('./app');
const { Server } = require('socket.io');
const { connectDB } = require('./config/db');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const server = http.createServer(app);

// Real-Time Socket.io Initialization 
const io = new Server(server, {
    cors: { 
        origin: process.env.CLIENT_URL || "*",
        methods: ["GET", "POST"]
    }
});

// Socket.io connection handler
io.on('connection', (socket) => {
    console.log('Client connected for real-time alerts:', socket.id);
    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

// Database and Server Start
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
    server.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
        console.log(`📊 WebSocket server is ready for connections`);
    });
}).catch(err => {
    console.error("Failed to connect to DB, server not started", err);
});

// Exporting io for use in controllers/services
module.exports = { io };