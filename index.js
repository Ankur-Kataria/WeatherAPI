const express = require('express');
const mongoose = require('mongoose');
const locationRoutes = require('./src/routes/locationRoutes');
const weatherRoutes = require('./src/routes/weatherRoutes');
const historyRoutes = require('./src/routes/historyRoutes');
const rateLimitMiddleware = require('./src/middleware/rateLimit');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));

app.use(express.json());

// Apply rate limiting middleware to all routes starting with '/api'
app.use('/api', rateLimitMiddleware);

app.use('/api', locationRoutes);
app.use('/api', weatherRoutes);
app.use('/api', historyRoutes);

app.listen(port, () => console.log(`Server is running on port ${port}`));
