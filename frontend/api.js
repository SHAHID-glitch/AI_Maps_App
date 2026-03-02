// API Configuration
const API_BASE_URL = import.meta?.env?.VITE_API_URL || 'http://localhost:5000/api';

// API Functions
const API = {
  // Locations
  getAllLocations: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/locations`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching locations:', error);
      return [];
    }
  },

  getLocationById: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/locations/${id}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching location:', error);
      return null;
    }
  },

  createLocation: async (locationData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/locations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(locationData),
      });
      return await response.json();
    } catch (error) {
      console.error('Error creating location:', error);
      return null;
    }
  },

  updateLocation: async (id, locationData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/locations/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(locationData),
      });
      return await response.json();
    } catch (error) {
      console.error('Error updating location:', error);
      return null;
    }
  },

  deleteLocation: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/locations/${id}`, {
        method: 'DELETE',
      });
      return await response.json();
    } catch (error) {
      console.error('Error deleting location:', error);
      return null;
    }
  },

  // Nearby Locations
  getNearbyLocations: async (lat, lng, radius = 5) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/locations/nearby/${lat}/${lng}?radius=${radius}`
      );
      return await response.json();
    } catch (error) {
      console.error('Error fetching nearby locations:', error);
      return [];
    }
  },

  // Search
  searchDatabase: async (query) => {
    try {
      const response = await fetch(`${API_BASE_URL}/search/db?q=${query}`);
      return await response.json();
    } catch (error) {
      console.error('Error searching database:', error);
      return [];
    }
  },

  searchNominatim: async (query) => {
    try {
      const response = await fetch(`${API_BASE_URL}/search/nominatim?q=${query}`);
      return await response.json();
    } catch (error) {
      console.error('Error searching Nominatim:', error);
      return [];
    }
  },

  // Saved Places (localStorage)
  savePlaceLocally: (place) => {
    let saved = JSON.parse(localStorage.getItem('savedPlaces')) || [];
    place.id = Date.now().toString();
    saved.push(place);
    localStorage.setItem('savedPlaces', JSON.stringify(saved));
    return place;
  },

  getSavedPlaces: () => {
    return JSON.parse(localStorage.getItem('savedPlaces')) || [];
  },

  removeSavedPlace: (id) => {
    let saved = JSON.parse(localStorage.getItem('savedPlaces')) || [];
    saved = saved.filter(p => p.id !== id);
    localStorage.setItem('savedPlaces', JSON.stringify(saved));
  },
};
