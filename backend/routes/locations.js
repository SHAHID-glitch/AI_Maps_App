const express = require('express');
const router = express.Router();
const Location = require('../models/Location');

// Get all locations
router.get('/', async (req, res) => {
  try {
    const locations = await Location.find();
    res.json(locations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get nearby locations (MUST be before /:id route)
router.get('/nearby/:lat/:lng', async (req, res) => {
  try {
    const lat = parseFloat(req.params.lat);
    const lng = parseFloat(req.params.lng);
    const radius = parseFloat(req.query.radius) || 5; // km

    if (isNaN(lat) || isNaN(lng)) {
      return res.status(400).json({ message: 'Invalid latitude/longitude' });
    }

    // Calculate bounding box using haversine approximation
    const latOffset = radius / 111; // 1 degree latitude = 111 km
    const lngOffset = radius / (111 * Math.cos((lat * Math.PI) / 180)); // Adjust for longitude

    const locations = await Location.find({
      latitude: {
        $gte: lat - latOffset,
        $lte: lat + latOffset,
      },
      longitude: {
        $gte: lng - lngOffset,
        $lte: lng + lngOffset,
      },
    });

    res.json(locations);
  } catch (error) {
    console.error('Nearby locations error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get single location (AFTER nearby route)
router.get('/:id', async (req, res) => {
  try {
    const location = await Location.findById(req.params.id);
    if (!location) return res.status(404).json({ message: 'Location not found' });
    res.json(location);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create location
router.post('/', async (req, res) => {
  const location = new Location({
    name: req.body.name,
    description: req.body.description,
    latitude: req.body.latitude,
    longitude: req.body.longitude,
    address: req.body.address,
    category: req.body.category,
    rating: req.body.rating,
    tags: req.body.tags,
  });

  try {
    const newLocation = await location.save();
    res.status(201).json(newLocation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update location
router.put('/:id', async (req, res) => {
  try {
    const location = await Location.findById(req.params.id);
    if (!location) return res.status(404).json({ message: 'Location not found' });

    Object.assign(location, req.body);
    location.updatedAt = Date.now();
    const updatedLocation = await location.save();
    res.json(updatedLocation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete location
router.delete('/:id', async (req, res) => {
  try {
    const location = await Location.findByIdAndDelete(req.params.id);
    if (!location) return res.status(404).json({ message: 'Location not found' });
    res.json({ message: 'Location deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
