const express = require('express');
const axios = require('axios');

const router = express.Router();

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// Validate API key exists
if (!OPENWEATHER_API_KEY) {
  console.warn('⚠️ WARNING: OPENWEATHER_API_KEY is not set in .env file');
}

// Get current weather for a location
router.get('/current/:lat/:lng', async (req, res) => {
  try {
    const { lat, lng } = req.params;
    const response = await axios.get(
      `${BASE_URL}/weather?lat=${lat}&lon=${lng}&appid=${OPENWEATHER_API_KEY}&units=metric`
    );
    
    const {
      main: { temp, feels_like, humidity, pressure },
      weather: [{ main, description, icon }],
      wind: { speed },
      clouds: { all: cloudiness },
      sys: { sunrise, sunset, country },
      name,
    } = response.data;

    res.json({
      city: name,
      country,
      temp,
      feels_like,
      condition: main,
      description,
      icon,
      humidity,
      pressure,
      wind_speed: speed,
      cloudiness,
      sunrise,
      sunset,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Weather API error:', error.message);
    res.status(500).json({ message: 'Failed to fetch weather data' });
  }
});

// Get 5-day forecast
router.get('/forecast/:lat/:lng', async (req, res) => {
  try {
    const { lat, lng } = req.params;
    const response = await axios.get(
      `${BASE_URL}/forecast?lat=${lat}&lon=${lng}&appid=${OPENWEATHER_API_KEY}&units=metric&cnt=40`
    );

    const { list, city } = response.data;
    
    // Process forecast data - group by day
    const dailyForecasts = {};
    list.forEach((forecast) => {
      const date = new Date(forecast.dt * 1000).toLocaleDateString();
      if (!dailyForecasts[date]) {
        dailyForecasts[date] = {
          date,
          temps: [forecast.main.temp],
          conditions: forecast.weather[0].main,
          description: forecast.weather[0].description,
          icon: forecast.weather[0].icon,
          humidity: forecast.main.humidity,
          wind_speed: forecast.wind.speed,
          rain_chance: forecast.clouds.all,
        };
      } else {
        dailyForecasts[date].temps.push(forecast.main.temp);
      }
    });

    // Calculate daily averages
    const forecasts = Object.values(dailyForecasts).map((day) => ({
      ...day,
      temp_avg: (day.temps.reduce((a, b) => a + b, 0) / day.temps.length).toFixed(1),
      temp_min: Math.min(...day.temps),
      temp_max: Math.max(...day.temps),
    }));

    res.json({
      city: city.name,
      country: city.country,
      forecasts: forecasts.slice(0, 7), // 7-day forecast
    });
  } catch (error) {
    console.error('Forecast API error:', error.message);
    res.status(500).json({ message: 'Failed to fetch forecast data' });
  }
});

// Get weather heatmap data (multiple points)
router.post('/heatmap', async (req, res) => {
  try {
    const { points } = req.body; // Array of {lat, lng}
    
    if (!Array.isArray(points) || points.length === 0) {
      return res.status(400).json({ message: 'Invalid points array' });
    }

    const weatherData = await Promise.all(
      points.map(async (point) => {
        try {
          const response = await axios.get(
            `${BASE_URL}/weather?lat=${point.lat}&lon=${point.lng}&appid=${OPENWEATHER_API_KEY}&units=metric`
          );
          return {
            lat: point.lat,
            lng: point.lng,
            temp: response.data.main.temp,
            condition: response.data.weather[0].main,
            icon: response.data.weather[0].icon,
          };
        } catch (err) {
          return { lat: point.lat, lng: point.lng, temp: null, error: true };
        }
      })
    );

    res.json({ heatmap: weatherData });
  } catch (error) {
    console.error('Heatmap API error:', error.message);
    res.status(500).json({ message: 'Failed to fetch heatmap data' });
  }
});

// Geocode city/place name to coordinates
router.get('/geocode/:query', async (req, res) => {
  try {
    const { query } = req.params;
    const limit = req.query.limit || 5;
    
    const response = await axios.get(
      `http://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=${limit}&appid=${OPENWEATHER_API_KEY}`
    );

    if (!response.data || response.data.length === 0) {
      return res.status(404).json({ message: 'Location not found' });
    }

    const locations = response.data.map((loc) => ({
      name: loc.name,
      country: loc.country,
      state: loc.state,
      lat: loc.lat,
      lng: loc.lon,
      display_name: `${loc.name}${loc.state ? ', ' + loc.state : ''}, ${loc.country}`,
    }));

    res.json({ locations });
  } catch (error) {
    console.error('Geocoding API error:', error.message);
    res.status(500).json({ message: 'Failed to geocode location' });
  }
});

// Get weather by city name (combines geocoding + weather)
router.get('/city/:cityName', async (req, res) => {
  try {
    const { cityName } = req.params;
    
    // First, geocode the city name
    const geoResponse = await axios.get(
      `http://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(cityName)}&limit=1&appid=${OPENWEATHER_API_KEY}`
    );

    if (!geoResponse.data || geoResponse.data.length === 0) {
      return res.status(404).json({ message: 'City not found' });
    }

    const location = geoResponse.data[0];
    const { lat, lon: lng, name, country, state } = location;

    // Get current weather for that location
    const weatherResponse = await axios.get(
      `${BASE_URL}/weather?lat=${lat}&lon=${lng}&appid=${OPENWEATHER_API_KEY}&units=metric`
    );

    const {
      main: { temp, feels_like, humidity, pressure },
      weather: [{ main, description, icon }],
      wind: { speed },
      clouds: { all: cloudiness },
      sys: { sunrise, sunset },
    } = weatherResponse.data;

    res.json({
      location: {
        name,
        country,
        state,
        lat,
        lng,
        display_name: `${name}${state ? ', ' + state : ''}, ${country}`,
      },
      weather: {
        temp,
        feels_like,
        condition: main,
        description,
        icon,
        humidity,
        pressure,
        wind_speed: speed,
        cloudiness,
        sunrise,
        sunset,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('City weather API error:', error.message);
    res.status(500).json({ message: 'Failed to fetch city weather data' });
  }
});

module.exports = router;
