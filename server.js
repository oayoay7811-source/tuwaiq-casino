// Tuwaiq Casino Game - Node.js Server
// Simple Express server to serve the casino game

const express = require('express');
const path = require('path');
const compression = require('compression');
const helmet = require('helmet');

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:", "https:"],
            fontSrc: ["'self'", "data:"],
            connectSrc: ["'self'"]
        }
    }
}));

// Compression middleware for better performance
app.use(compression());

// Serve static files from the current directory
app.use(express.static(path.join(__dirname), {
    maxAge: '1d', // Cache static files for 1 day
    etag: true
}));

// Route for the main game page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Health check endpoint (useful for deployment platforms)
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'healthy',
        message: 'Tuwaiq Casino Game Server is running!',
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    });
});

// API endpoint to get game stats (can be extended)
app.get('/api/stats', (req, res) => {
    res.json({
        totalGames: 11,
        games: [
            { name: 'Dice', icon: '🎲' },
            { name: 'Crash', icon: '🚀' },
            { name: 'Plinko', icon: '🎯' },
            { name: 'Slots', icon: '🎰' },
            { name: 'Mines', icon: '💣' },
            { name: 'Wheel', icon: '🎡' },
            { name: 'Limbo', icon: '📊' },
            { name: 'Tower', icon: '🗼' },
            { name: 'Coin Flip', icon: '🪙' },
            { name: 'Hi-Lo', icon: '🎴' },
            { name: 'Keno', icon: '🎱' }
        ]
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'index.html'));
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(500).json({
        error: 'Something went wrong!',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
});

// Start the server
app.listen(PORT, () => {
    console.log('╔════════════════════════════════════════╗');
    console.log('║   🎰 Tuwaiq Casino Game Server 🎰    ║');
    console.log('╚════════════════════════════════════════╝');
    console.log('');
    console.log(`✅ Server is running on port ${PORT}`);
    console.log('');
    console.log(`🌐 Local:    http://localhost:${PORT}`);
    console.log(`🌐 Network:  http://YOUR_IP:${PORT}`);
    console.log('');
    console.log('📊 Endpoints:');
    console.log(`   • Game:    http://localhost:${PORT}/`);
    console.log(`   • Health:  http://localhost:${PORT}/health`);
    console.log(`   • Stats:   http://localhost:${PORT}/api/stats`);
    console.log('');
    console.log('🎮 11 Games Available:');
    console.log('   🎲 Dice  |  🚀 Crash  |  🎯 Plinko  |  🎰 Slots');
    console.log('   💣 Mines |  🎡 Wheel  |  📊 Limbo   |  🗼 Tower');
    console.log('   🪙 Coin  |  🎴 Hi-Lo  |  🎱 Keno');
    console.log('');
    console.log('Press Ctrl+C to stop the server');
    console.log('════════════════════════════════════════');
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received. Closing server gracefully...');
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});

