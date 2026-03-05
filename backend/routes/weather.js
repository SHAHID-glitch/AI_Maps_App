const express = require('express');
const axios = require('axios');

const router = express.Router();

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const OPEN_METEO_BASE_URL = 'https://api.open-meteo.com/v1/forecast';

const WEATHER_CODE_MAP = {
  0: { condition: 'Clear', description: 'clear sky' },
  1: { condition: 'Clouds', description: 'mainly clear' },
  2: { condition: 'Clouds', description: 'partly cloudy' },
  3: { condition: 'Clouds', description: 'overcast' },
  45: { condition: 'Mist', description: 'fog' },
  48: { condition: 'Mist', description: 'depositing rime fog' },
  51: { condition: 'Drizzle', description: 'light drizzle' },
  53: { condition: 'Drizzle', description: 'moderate drizzle' },
  55: { condition: 'Drizzle', description: 'dense drizzle' },
  61: { condition: 'Rain', description: 'slight rain' },
  63: { condition: 'Rain', description: 'moderate rain' },
  65: { condition: 'Rain', description: 'heavy rain' },
  71: { condition: 'Snow', description: 'slight snow' },
  73: { condition: 'Snow', description: 'moderate snow' },
  75: { condition: 'Snow', description: 'heavy snow' },
  80: { condition: 'Rain', description: 'rain showers' },
  81: { condition: 'Rain', description: 'moderate rain showers' },
  82: { condition: 'Rain', description: 'violent rain showers' },
  95: { condition: 'Thunderstorm', description: 'thunderstorm' },
};

const mapWeatherCode = (code) => WEATHER_CODE_MAP[code] || { condition: 'Clouds', description: 'partly cloudy' };

const reverseGeocodeNominatim = async (lat, lng) => {
  try {
    const response = await axios.get('https://nominatim.openstreetmap.org/reverse', {
      params: {
        format: 'jsonv2',
        lat,
        lon: lng,
        addressdetails: 1,
      },
      headers: { 'User-Agent': 'MapsApp/1.0' },
      timeout: 10000,
    });

    const address = response.data?.address || {};
    return {
      city: address.city || address.town || address.village || address.county || 'Selected location',
      country: address.country_code?.toUpperCase() || '',
    };
  } catch (error) {
    return { city: 'Selected location', country: '' };
  }
};

// Validate API key exists
if (!OPENWEATHER_API_KEY) {
  console.warn('⚠️ WARNING: OPENWEATHER_API_KEY is not set in .env file');
}

// Get current weather for a location
router.get('/current/:lat/:lng', async (req, res) => {
  try {
    const { lat, lng } = req.params;

    // Primary: OpenWeather (if key configured)
    if (OPENWEATHER_API_KEY) {
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

      return res.json({
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
    }

    // Fallback: Open-Meteo + Nominatim (no API key required)
    const [meteoResponse, place] = await Promise.all([
      axios.get(OPEN_METEO_BASE_URL, {
        params: {
          latitude: lat,
          longitude: lng,
          current: 'temperature_2m,apparent_temperature,relative_humidity_2m,surface_pressure,cloud_cover,wind_speed_10m,weather_code',
          daily: 'sunrise,sunset',
          timezone: 'auto',
        },
        timeout: 10000,
      }),
      reverseGeocodeNominatim(lat, lng),
    ]);

    const current = meteoResponse.data?.current || {};
    const daily = meteoResponse.data?.daily || {};
    const weather = mapWeatherCode(current.weather_code);

    res.json({
      city: place.city,
      country: place.country,
      temp: current.temperature_2m,
      feels_like: current.apparent_temperature,
      condition: weather.condition,
      description: weather.description,
      icon: null,
      humidity: current.relative_humidity_2m,
      pressure: current.surface_pressure,
      wind_speed: current.wind_speed_10m,
      cloudiness: current.cloud_cover,
      sunrise: daily.sunrise?.[0] ? Math.floor(new Date(daily.sunrise[0]).getTime() / 1000) : null,
      sunset: daily.sunset?.[0] ? Math.floor(new Date(daily.sunset[0]).getTime() / 1000) : null,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Weather API error:', error.message);
    res.status(502).json({ message: 'Failed to fetch weather data' });
  }
});

// Get 5-day forecast
router.get('/forecast/:lat/:lng', async (req, res) => {
  try {
    const { lat, lng } = req.params;

    if (OPENWEATHER_API_KEY) {
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
            condition: forecast.weather[0].main,
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

      const forecasts = Object.values(dailyForecasts).map((day) => ({
        ...day,
        temp_avg: (day.temps.reduce((a, b) => a + b, 0) / day.temps.length).toFixed(1),
        temp_min: Math.min(...day.temps),
        temp_max: Math.max(...day.temps),
      }));

      return res.json({
        city: city.name,
        country: city.country,
        forecasts: forecasts.slice(0, 7),
      });
    }

    const [meteoResponse, place] = await Promise.all([
      axios.get(OPEN_METEO_BASE_URL, {
        params: {
          latitude: lat,
          longitude: lng,
          daily: 'weather_code,temperature_2m_max,temperature_2m_min',
          timezone: 'auto',
          forecast_days: 7,
        },
        timeout: 10000,
      }),
      reverseGeocodeNominatim(lat, lng),
    ]);

    const daily = meteoResponse.data?.daily || {};
    const forecasts = (daily.time || []).map((date, idx) => {
      const weather = mapWeatherCode(daily.weather_code?.[idx]);
      return {
        date,
        condition: weather.condition,
        description: weather.description,
        icon: null,
        temp_min: daily.temperature_2m_min?.[idx],
        temp_max: daily.temperature_2m_max?.[idx],
      };
    });

    res.json({
      city: place.city,
      country: place.country,
      forecasts,
    });
  } catch (error) {
    console.error('Forecast API error:', error.message);
    res.status(502).json({ message: 'Failed to fetch forecast data' });
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
          if (OPENWEATHER_API_KEY) {
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
          }

          const response = await axios.get(OPEN_METEO_BASE_URL, {
            params: {
              latitude: point.lat,
              longitude: point.lng,
              current: 'temperature_2m,weather_code',
              timezone: 'auto',
            },
            timeout: 10000,
          });

          const current = response.data?.current || {};
          const weather = mapWeatherCode(current.weather_code);
          return {
            lat: point.lat,
            lng: point.lng,
            temp: current.temperature_2m,
            condition: weather.condition,
            icon: null,
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
    
    const response = OPENWEATHER_API_KEY
      ? await axios.get(
          `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=${limit}&appid=${OPENWEATHER_API_KEY}`
        )
      : await axios.get('https://nominatim.openstreetmap.org/search', {
          params: {
            q: query,
            format: 'jsonv2',
            limit,
            addressdetails: 1,
          },
          headers: { 'User-Agent': 'MapsApp/1.0' },
          timeout: 10000,
        });

    if (!response.data || response.data.length === 0) {
      return res.status(404).json({ message: 'Location not found' });
    }

    const locations = response.data.map((loc) => {
      if (OPENWEATHER_API_KEY) {
        return {
          name: loc.name,
          country: loc.country,
          state: loc.state,
          lat: loc.lat,
          lng: loc.lon,
          display_name: `${loc.name}${loc.state ? ', ' + loc.state : ''}, ${loc.country}`,
        };
      }

      const address = loc.address || {};
      const name = address.city || address.town || address.village || loc.display_name?.split(',')[0] || 'Unknown';
      const country = address.country_code?.toUpperCase() || '';
      const state = address.state || '';
      return {
        name,
        country,
        state,
        lat: parseFloat(loc.lat),
        lng: parseFloat(loc.lon),
        display_name: loc.display_name,
      };
    });

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
    const geoResponse = OPENWEATHER_API_KEY
      ? await axios.get(
          `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(cityName)}&limit=1&appid=${OPENWEATHER_API_KEY}`
        )
      : await axios.get('https://nominatim.openstreetmap.org/search', {
          params: {
            q: cityName,
            format: 'jsonv2',
            limit: 1,
            addressdetails: 1,
          },
          headers: { 'User-Agent': 'MapsApp/1.0' },
          timeout: 10000,
        });

    if (!geoResponse.data || geoResponse.data.length === 0) {
      return res.status(404).json({ message: 'City not found' });
    }

    const location = geoResponse.data[0];
    const lat = OPENWEATHER_API_KEY ? location.lat : parseFloat(location.lat);
    const lng = OPENWEATHER_API_KEY ? location.lon : parseFloat(location.lon);
    const name = OPENWEATHER_API_KEY
      ? location.name
      : (location.address?.city || location.address?.town || location.address?.village || location.display_name?.split(',')[0]);
    const country = OPENWEATHER_API_KEY
      ? location.country
      : (location.address?.country_code?.toUpperCase() || '');
    const state = OPENWEATHER_API_KEY ? location.state : (location.address?.state || '');

    let weather;
    if (OPENWEATHER_API_KEY) {
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

      weather = {
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
      };
    } else {
      const meteoResponse = await axios.get(OPEN_METEO_BASE_URL, {
        params: {
          latitude: lat,
          longitude: lng,
          current: 'temperature_2m,apparent_temperature,relative_humidity_2m,surface_pressure,cloud_cover,wind_speed_10m,weather_code',
          daily: 'sunrise,sunset',
          timezone: 'auto',
        },
        timeout: 10000,
      });

      const current = meteoResponse.data?.current || {};
      const daily = meteoResponse.data?.daily || {};
      const mapped = mapWeatherCode(current.weather_code);

      weather = {
        temp: current.temperature_2m,
        feels_like: current.apparent_temperature,
        condition: mapped.condition,
        description: mapped.description,
        icon: null,
        humidity: current.relative_humidity_2m,
        pressure: current.surface_pressure,
        wind_speed: current.wind_speed_10m,
        cloudiness: current.cloud_cover,
        sunrise: daily.sunrise?.[0] ? Math.floor(new Date(daily.sunrise[0]).getTime() / 1000) : null,
        sunset: daily.sunset?.[0] ? Math.floor(new Date(daily.sunset[0]).getTime() / 1000) : null,
        timestamp: new Date().toISOString(),
      };
    }

    res.json({
      location: {
        name,
        country,
        state,
        lat,
        lng,
        display_name: `${name}${state ? ', ' + state : ''}, ${country}`,
      },
      weather,
    });
  } catch (error) {
    console.error('City weather API error:', error.message);
    res.status(502).json({ message: 'Failed to fetch city weather data' });
  }
});

module.exports = router;
