const http = require('http');
const app = require('./app');
const { Server } = require('socket.io');
const { connectDB } = require('./config/db');

const server = http.createServer(app);

// Real-Time Socket.io Initialization 
const io = new Server(server, {
    cors: { origin: "*" }
});

io.on('connection', (socket) => {
    console.log('Client connected for real-time alerts');
    socket.on('disconnect', () => console.log('Client disconnected'));
});

// Database and Server Start
const PORT = process.env.PORT || 5000;
connectDB().then(() => {
    server.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});

// Exporting io for use in services
module.exports = { io };