const express = require('express');
const router = express.Router();
const axios = require('axios');
const limiter = require('../middleware/rateLimit');
const logger = require('../middleware/logger');
const Location = require('../models/Location');
require('dotenv').config();

// In-memory cache object
const cache = {};

router.use(logger);

// Get weather forecast for a specific location
router.get('/weather/:location_id', async (req, res) => {
    const { location_id } = req.params;
    // // Check if data is cached
    if (cache[location_id] && cache[location_id].expiry > Date.now()) {
        console.log("in catche");
        return res.json(cache[location_id].data);
    }
    // Retrieve the location from the database by ID
    try {
        const location = await Location.findById(location_id);
        if (!location) {
            return res.status(404).json({ message: 'Location not found' });
        }
        
        // Log the weather forecast request
        console.log(`Logging: Fetching weather forecast for location ${location.name}`);
        
        // Fetch weather data from the external API using location's latitude and longitude
        const weatherResponse = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${location.latitude}&lon=${location.longitude}&appid=${process.env.OPENWEATHERMAP_API_KEY}`);
        const weatherData = weatherResponse.data;
        // Extract relevant weather information
        const weatherForecast = {
            temperature: weatherData.main.temp,
            humidity: weatherData.main.humidity,
            wind_speed: weatherData.wind.speed,
        };

        // Cache the data with a 5-minute expiry time
        cache[location_id] = {
            data: weatherForecast,
            expiry: Date.now() + 5 * 60 * 1000 // 5 minutes
        };
        res.json(weatherForecast);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
