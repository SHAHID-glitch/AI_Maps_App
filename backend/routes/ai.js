const express = require('express');
const axios = require('axios');
const router = express.Router();
const Location = require('../models/Location');

const toNumber = (value) => {
  const num = parseFloat(value);
  return Number.isFinite(num) ? num : null;
};

const haversineKm = (lat1, lng1, lat2, lng2) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const tokenize = (text) => {
  return String(text || '')
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);
};

const inferTrafficLevel = (hour) => {
  if (!Number.isFinite(hour)) return 'medium';
  if ((hour >= 7 && hour <= 10) || (hour >= 17 && hour <= 20)) return 'high';
  if (hour >= 11 && hour <= 16) return 'medium';
  return 'low';
};

const trafficMultiplier = (level) => {
  if (level === 'high') return 1.4;
  if (level === 'low') return 1.0;
  return 1.2;
};

const clamp01 = (value) => Math.max(0, Math.min(1, value));

const pseudoNoise = (lat, lng, hour) => {
  const seed = lat * 12.9898 + lng * 78.233 + hour * 37.719;
  return Math.abs(Math.sin(seed) * 43758.5453) % 1;
};

router.get('/recommendations', async (req, res) => {
  try {
    const query = String(req.query.q || '').trim();
    if (!query) {
      return res.status(400).json({ message: 'Search query required' });
    }

    const lat = toNumber(req.query.lat);
    const lng = toNumber(req.query.lng);

    const locations = await Location.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { address: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { category: { $regex: query, $options: 'i' } },
      ],
    });

    const queryTokens = tokenize(query);

    const ranked = locations
      .map((loc) => {
        const locObj = loc.toObject();
        const ratingScore = locObj.rating ? Math.min(locObj.rating / 5, 1) : 0.3;
        let distanceKm = null;
        let distanceScore = 0;

        if (lat !== null && lng !== null) {
          distanceKm = haversineKm(lat, lng, locObj.latitude, locObj.longitude);
          distanceScore = Math.max(0, 1 - distanceKm / 10);
        }

        const haystack = tokenize(`${locObj.name} ${locObj.category} ${locObj.description}`);
        const matchCount = queryTokens.filter((t) => haystack.includes(t)).length;
        const categoryBoost = matchCount > 0 ? 1 : 0;

        const score =
          0.5 * ratingScore +
          0.4 * distanceScore +
          0.1 * categoryBoost;

        const reasons = [];
        if (locObj.rating) reasons.push(`High rating (${locObj.rating}/5)`);
        if (distanceKm !== null) reasons.push(`Close (${distanceKm.toFixed(1)} km)`);
        if (categoryBoost) reasons.push('Matches your query');

        return {
          ...locObj,
          score: Number(score.toFixed(3)),
          distanceKm,
          reasons,
        };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 20);

    res.json(ranked);
  } catch (error) {
    console.error('AI recommendation error:', error);
    res.status(500).json({ message: error.message });
  }
});

router.get('/travel-time', async (req, res) => {
  try {
    const originLat = toNumber(req.query.originLat);
    const originLng = toNumber(req.query.originLng);
    const destLat = toNumber(req.query.destLat);
    const destLng = toNumber(req.query.destLng);
    const hourParam = toNumber(req.query.hour);

    if (originLat === null || originLng === null || destLat === null || destLng === null) {
      return res.status(400).json({ message: 'originLat, originLng, destLat, destLng required' });
    }

    const distanceKm = haversineKm(originLat, originLng, destLat, destLng);
    const hour = Number.isFinite(hourParam) ? hourParam : new Date().getHours();
    const trafficLevel = inferTrafficLevel(hour);

    const baseSpeedKmph = 35;
    const baseMinutes = (distanceKm / baseSpeedKmph) * 60;
    const etaMinutes = Math.max(1, Math.round((baseMinutes + 2) * trafficMultiplier(trafficLevel)));

    res.json({
      distanceKm: Number(distanceKm.toFixed(2)),
      trafficLevel,
      etaMinutes,
      hour,
    });
  } catch (error) {
    console.error('Travel time error:', error);
    res.status(500).json({ message: error.message });
  }
});

router.get('/traffic', async (req, res) => {
  try {
    const lat = toNumber(req.query.lat);
    const lng = toNumber(req.query.lng);
    const radiusKm = toNumber(req.query.radius) || 5;
    const hourParam = toNumber(req.query.hour);

    if (lat === null || lng === null) {
      return res.status(400).json({ message: 'lat and lng required' });
    }

    const hour = Number.isFinite(hourParam) ? hourParam : new Date().getHours();
    const baseLevel = inferTrafficLevel(hour);
    const baseIntensity = baseLevel === 'high' ? 0.85 : baseLevel === 'medium' ? 0.6 : 0.35;

    const stepKm = 1.2;
    const stepLat = stepKm / 111;
    const stepLng = stepKm / (111 * Math.cos((lat * Math.PI) / 180));

    const points = [];
    for (let dLat = -radiusKm / 111; dLat <= radiusKm / 111; dLat += stepLat) {
      for (let dLng = -radiusKm / (111 * Math.cos((lat * Math.PI) / 180));
           dLng <= radiusKm / (111 * Math.cos((lat * Math.PI) / 180));
           dLng += stepLng) {
        const pointLat = lat + dLat;
        const pointLng = lng + dLng;
        const distanceKm = haversineKm(lat, lng, pointLat, pointLng);
        if (distanceKm <= radiusKm) {
          const noise = pseudoNoise(pointLat, pointLng, hour);
          const intensity = clamp01(baseIntensity + (noise - 0.5) * 0.25);
          const level = intensity >= 0.75 ? 'high' : intensity >= 0.5 ? 'medium' : 'low';

          points.push({
            lat: Number(pointLat.toFixed(6)),
            lng: Number(pointLng.toFixed(6)),
            intensity: Number(intensity.toFixed(3)),
            level,
            hour,
          });
        }
      }
    }

    res.json({
      center: { lat, lng },
      radiusKm,
      points,
    });
  } catch (error) {
    console.error('Traffic prediction error:', error);
    res.status(500).json({ message: error.message });
  }
});

router.get('/route', async (req, res) => {
  try {
    const originLat = toNumber(req.query.originLat);
    const originLng = toNumber(req.query.originLng);
    const destLat = toNumber(req.query.destLat);
    const destLng = toNumber(req.query.destLng);
    const hourParam = toNumber(req.query.hour);

    if (originLat === null || originLng === null || destLat === null || destLng === null) {
      return res.status(400).json({ message: 'originLat, originLng, destLat, destLng required' });
    }

    const osrmUrl = `http://router.project-osrm.org/route/v1/driving/${originLng},${originLat};${destLng},${destLat}`;
    const osrmResponse = await axios.get(osrmUrl, {
      params: {
        overview: 'full',
        geometries: 'geojson',
        steps: false,
      },
    });

    const route = osrmResponse.data?.routes?.[0];
    if (!route) {
      return res.status(502).json({ message: 'No route found' });
    }

    const distanceKm = route.distance / 1000;
    const durationMin = route.duration / 60;
    const hour = Number.isFinite(hourParam) ? hourParam : new Date().getHours();
    const trafficLevel = inferTrafficLevel(hour);
    const aiEtaMin = Math.round(durationMin * trafficMultiplier(trafficLevel));

    const path = route.geometry.coordinates.map(([lng, lat]) => [lat, lng]);

    res.json({
      origin: { lat: originLat, lng: originLng },
      destination: { lat: destLat, lng: destLng },
      distanceKm: Number(distanceKm.toFixed(2)),
      durationMin: Number(durationMin.toFixed(1)),
      aiEtaMin,
      trafficLevel,
      path,
    });
  } catch (error) {
    console.error('Route error:', error?.response?.data || error.message);
    res.status(500).json({ message: 'Failed to fetch route' });
  }
});

module.exports = router;
