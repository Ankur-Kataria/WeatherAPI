const express = require('express');
const router = express.Router();
const locationController = require('../controllers/locationController');
const limiter = require('../middleware/rateLimit');
const logger = require('../middleware/logger');

router.use(logger);

// Get all locations
router.get('/locations', limiter, locationController.getAllLocations);

// Add a new location
router.post('/locations', limiter, locationController.addLocation);

// Get location by ID
router.get('/locations/:id', limiter, locationController.getLocationById);

// Update location by ID
router.put('/locations/:id', limiter, locationController.updateLocationById);

// Delete location by ID
router.delete('/locations/:id', limiter, locationController.deleteLocationById);

module.exports = router;
