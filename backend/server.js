const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.ALLOWED_ORIGINS?.split(',') || true
    : ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/maps-db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.log('❌ MongoDB connection error:', err));

// Routes
app.use('/api/locations', require('./routes/locations'));
app.use('/api/search', require('./routes/search'));
app.use('/api/ai', require('./routes/ai'));
app.use('/api/chat', require('./routes/chat'));
app.use('/api/weather', require('./routes/weather'));

// Serve React build output from backend/public
const staticDir = path.join(__dirname, 'public');
app.use(express.static(staticDir));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend running! 🚀', timestamp: new Date().toISOString() });
});

// Base route for App Service URL checks
app.get('/', (req, res) => {
  res.sendFile(path.join(staticDir, 'index.html'));
});

// SPA fallback for client-side routes (excluding API routes)
app.get(/^\/(?!api\/).*/, (req, res) => {
  res.sendFile(path.join(staticDir, 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({ 
    error: process.env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message 
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🗺️  Maps Backend Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});
