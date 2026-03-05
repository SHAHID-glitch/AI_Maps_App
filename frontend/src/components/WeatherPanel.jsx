import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';
import './WeatherPanel.css';

const WeatherPanel = ({ userLocation, weatherLocation, weatherEnabled, onClose }) => {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);

  // Use weatherLocation if provided, otherwise use userLocation
  const activeLocation = weatherLocation || userLocation;

  useEffect(() => {
    if (!weatherEnabled || !activeLocation) return;
    
    // If weatherLocation has weather data already, use it
    if (weatherLocation?.weather) {
      setWeather(weatherLocation.weather);
      fetchForecast();
    } else {
      fetchWeather();
    }
  }, [activeLocation, weatherEnabled]);

  const fetchWeather = async () => {
    if (!activeLocation) return;
    setLoading(true);
    try {
      const [currentRes, forecastRes] = await Promise.all([
        fetch(
          `${API_BASE_URL}/api/weather/current/${activeLocation.lat}/${activeLocation.lng}`
        ),
        fetch(
          `${API_BASE_URL}/api/weather/forecast/${activeLocation.lat}/${activeLocation.lng}`
        ),
      ]);

      const currentData = await currentRes.json();
      const forecastData = await forecastRes.json();

      setWeather(currentData);
      setForecast(forecastData);
    } catch (error) {
      console.error('Weather fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchForecast = async () => {
    if (!activeLocation) return;
    try {
      const forecastRes = await fetch(
        `${API_BASE_URL}/api/weather/forecast/${activeLocation.lat}/${activeLocation.lng}`
      );
      const forecastData = await forecastRes.json();
      setForecast(forecastData);
    } catch (error) {
      console.error('Forecast fetch error:', error);
    }
  };

  const getWeatherIcon = (condition) => {
    const conditionMap = {
      Clear: '☀️',
      Clouds: '☁️',
      Rain: '🌧️',
      Drizzle: '🌦️',
      Thunderstorm: '⛈️',
      Snow: '❄️',
      Mist: '🌫️',
      Smoke: '💨',
      Haze: '🌫️',
      Dust: '🌪️',
      Fog: '🌫️',
      Sand: '🌪️',
      Ash: '💨',
      Squall: '💨',
      Tornado: '🌪️',
    };
    return conditionMap[condition] || '🌤️';
  };

  if (!weatherEnabled) {
    return null;
  }

  return (
    <div className="weather-panel">
      <div className="weather-header">
        <h3>🌤️ Weather</h3>
        <button onClick={onClose} className="weather-close">
          ✕
        </button>
      </div>

      {loading ? (
        <div className="weather-loading">Loading weather...</div>
      ) : weather ? (
        <>
          <div className="weather-current">
            <div className="weather-icon-large">
              {getWeatherIcon(weather.condition)}
            </div>
            <div className="weather-info">
              <div className="weather-temp">{weather.temp}°C</div>
              <div className="weather-location">
                {weatherLocation?.name || `${weather.city}, ${weather.country}`}
              </div>
              <div className="weather-description">{weather.description}</div>
            </div>
          </div>

          <div className="weather-details">
            <div className="weather-detail-item">
              <span>💨 Wind</span>
              <span>{weather.wind_speed} m/s</span>
            </div>
            <div className="weather-detail-item">
              <span>💧 Humidity</span>
              <span>{weather.humidity}%</span>
            </div>
            <div className="weather-detail-item">
              <span>☁️ Clouds</span>
              <span>{weather.cloudiness}%</span>
            </div>
            <div className="weather-detail-item">
              <span>🔽 Pressure</span>
              <span>{weather.pressure} hPa</span>
            </div>
          </div>

          {forecast && forecast.forecasts && (
            <div className="weather-forecast">
              <h4>📅 5-Day Forecast</h4>
              <div className="forecast-items">
                {forecast.forecasts.map((day, idx) => (
                  <div key={idx} className="forecast-item">
                    <div className="forecast-date">{day.date}</div>
                    <div className="forecast-icon">
                      {getWeatherIcon(day.condition)}
                    </div>
                    <div className="forecast-temps">
                      <div className="forecast-max">{day.temp_max}°</div>
                      <div className="forecast-min">{day.temp_min}°</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="weather-error">Unable to load weather data</div>
      )}

      <button onClick={fetchWeather} className="weather-refresh-btn">
        🔄 Refresh
      </button>
    </div>
  );
};

export default WeatherPanel;
