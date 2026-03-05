const express = require('express');
const router = express.Router();
const Location = require('../models/Location');
const axios = require('axios');

// Search in database
router.get('/db', async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) {
      return res.status(400).json({ message: 'Search query required' });
    }

    const locations = await Location.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { address: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
      ],
    });

    res.json(locations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Search using Nominatim (OpenStreetMap)
router.get('/nominatim', async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) {
      return res.status(400).json({ message: 'Search query required' });
    }

    const response = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: {
        q: query,
        format: 'json',
        limit: 10,
      },
      headers: {
        'User-Agent': 'MapsApp/1.0',
      },
    });

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Global search - combines database + geocoding
router.get('/global', async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) {
      return res.status(400).json({ message: 'Search query required' });
    }

    let dbResults = [];
    let geoResults = [];

    // Search in database (best-effort)
    try {
      dbResults = await Location.find({
        $or: [
          { name: { $regex: query, $options: 'i' } },
          { address: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } },
        ],
      }).limit(5);
    } catch (dbError) {
      console.warn('Global search DB fallback:', dbError.message);
    }

    // Search globally using Nominatim (best-effort)
    try {
      const geoResponse = await axios.get('https://nominatim.openstreetmap.org/search', {
        params: {
          q: query,
          format: 'json',
          limit: 10,
          addressdetails: 1,
        },
        headers: {
          'User-Agent': 'MapsApp/1.0',
        },
        timeout: 10000,
      });
      geoResults = Array.isArray(geoResponse.data) ? geoResponse.data : [];
    } catch (geoError) {
      console.warn('Global search geocoder fallback:', geoError.message);
    }

    // Format database results
    const formattedDbResults = dbResults.map(loc => ({
      source: 'database',
      name: loc.name,
      address: loc.address,
      category: loc.category,
      rating: loc.rating,
      latitude: loc.latitude,
      longitude: loc.longitude,
      description: loc.description,
    }));

    // Format global search results
    const formattedGeoResults = geoResults.map(place => ({
      source: 'global',
      name: place.display_name.split(',')[0],
      address: place.display_name,
      category: place.type || 'place',
      latitude: parseFloat(place.lat),
      longitude: parseFloat(place.lon),
      osm_type: place.osm_type,
      importance: place.importance,
    }));

    // Combine results - database first, then global
    const combinedResults = [...formattedDbResults, ...formattedGeoResults];

    res.json(combinedResults);
  } catch (error) {
    console.error('Global search error:', error.message);
    res.json([]);
  }
});

module.exports = router;
