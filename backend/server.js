const path = require('path');
require('dotenv').config();

const express = require('express');
const cors = require('cors');

const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const authRoutes = require('./routes/authRoutes');
const recordingRoutes = require('./routes/recordingRoutes');

// Connect to MongoDB
connectDB();

const app = express();
require('dotenv').config();

// ----- Middleware -----
app.use(
  cors({
    origin: process.env.CLIENT_URL || '*',
    credentials: true,
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ----- Health Check -----
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Consultation Recording Manager API is running',
    timestamp: new Date().toISOString(),
  });
});

// ----- Routes -----
app.use('/api/auth', authRoutes);
app.use('/api/recordings', recordingRoutes);

// ----- Error Handling -----
app.use(notFound);
app.use(errorHandler);

// ----- Start Server -----
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// ----- Handle unhandled promise rejections -----
process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Rejection: ${err.message}`);
});