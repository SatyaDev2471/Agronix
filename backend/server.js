const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const weatherRoutes = require('./routes/weatherRoutes');

// Load env vars
dotenv.config();

const app = express();

// Database Connection
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected successfully for Agronix'))
  .catch(err => console.error('MongoDB connection error:', err));

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors());

// Basic route
app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Agronix Backend is running!' });
});

// Mount routers
app.use('/api/weather', weatherRoutes);
const analyticsRoutes = require('./routes/analyticsRoutes');
app.use('/api/analytics', analyticsRoutes);
const marketRoutes = require('./routes/marketRoutes');
app.use('/api/market', marketRoutes);
const aiRoutes = require('./routes/aiRoutes');
app.use('/api/ai', aiRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Triggering nodemon restart... (ThingSpeak Key updated)
