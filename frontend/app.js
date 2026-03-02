// Application Logic
let currentLocation = null;
let allLocations = [];

// Initialize on DOM Load
document.addEventListener('DOMContentLoaded', () => {
  initializeMap();
  setupEventListeners();
  loadAllLocations();
});

// Setup Event Listeners
function setupEventListeners() {
  // Search
  document.getElementById('searchBtn').addEventListener('click', performSearch);
  document.getElementById('searchInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') performSearch();
  });

  // My Location
  document.getElementById('myLocationBtn').addEventListener('click', () => {
    getUserLocation();
  });

  // Tab Navigation
  document.querySelectorAll('.tab-btn').forEach((btn) => {
    btn.addEventListener('click', switchTab);
  });

  // Add Place Form
  document.getElementById('addPlaceForm').addEventListener('submit', handleAddPlace);

  // Close Marker Info
  document.getElementById('closeMarkerInfo').addEventListener('click', () => {
    document.getElementById('markerInfo').classList.add('hidden');
  });
}

// Switch Tab
function switchTab(e) {
  const tabName = e.target.dataset.tab;

  // Remove active class from all tabs
  document.querySelectorAll('.tab-btn').forEach((btn) => {
    btn.classList.remove('active');
  });
  document.querySelectorAll('.tab-content').forEach((content) => {
    content.classList.remove('active');
  });

  // Add active class to clicked tab
  e.target.classList.add('active');
  document.getElementById(`${tabName}Tab`).classList.add('active');

  // Load tab content
  if (tabName === 'nearby') {
    loadNearbyPlacesUI();
  } else if (tabName === 'saved') {
    loadSavedPlacesUI();
  }
}

// Perform Search
async function performSearch() {
  const query = document.getElementById('searchInput').value.trim();
  if (!query) return;

  console.log('Searching for:', query);

  // Search in database first
  const dbResults = await API.searchDatabase(query);

  if (dbResults.length > 0) {
    clearMarkers();
    dbResults.forEach((location) => {
      addMarkerToMap(location);
    });

    // Center map on first result
    if (dbResults.length > 0) {
      flyToLocation(dbResults[0].latitude, dbResults[0].longitude);
    }
  } else {
    // Search using Nominatim if no database results
    const nominatimResults = await API.searchNominatim(query);
    if (nominatimResults.length > 0) {
      clearMarkers();
      nominatimResults.forEach((result) => {
        L.marker([result.lat, result.lon])
          .addTo(map)
          .bindPopup(`<strong>${result.display_name}</strong>`);
      });

      flyToLocation(nominatimResults[0].lat, nominatimResults[0].lon);
    } else {
      alert('No results found!');
    }
  }
}

// Load All Locations
async function loadAllLocations() {
  allLocations = await API.getAllLocations();
  console.log('Loaded locations:', allLocations);

  allLocations.forEach((location) => {
    addMarkerToMap(location);
  });
}

// Load Nearby Places in UI
function loadNearbyPlacesUI() {
  const center = getMapCenter();

  const nearby = allLocations
    .map((loc) => ({
      ...loc,
      distance: calculateDistance(center.lat, center.lng, loc.latitude, loc.longitude),
    }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 10);

  const list = document.getElementById('nearbyList');
  list.innerHTML = '';

  if (nearby.length === 0) {
    list.innerHTML = '<p style="text-align: center; color: #999;">No places nearby</p>';
    return;
  }

  nearby.forEach((location) => {
    const item = document.createElement('div');
    item.className = 'place-item';
    item.innerHTML = `
      <div class="place-item-name">${location.name}</div>
      <div class="place-item-address">${location.address || 'N/A'}</div>
      <div class="place-item-category">📁 ${location.category || 'Uncategorized'}</div>
      <div class="place-item-rating">
        ⭐ ${location.rating ? location.rating + '/5' : 'No rating'} • 
        📍 ${location.distance.toFixed(1)} km
      </div>
    `;
    item.addEventListener('click', () => {
      flyToLocation(location.latitude, location.longitude);
      showMarkerInfo(location);
    });
    list.appendChild(item);
  });
}

// Load Saved Places in UI
function loadSavedPlacesUI() {
  const saved = API.getSavedPlaces();
  const list = document.getElementById('savedList');
  list.innerHTML = '';

  if (saved.length === 0) {
    list.innerHTML = '<p style="text-align: center; color: #999;">No saved places</p>';
    return;
  }

  saved.forEach((place) => {
    const item = document.createElement('div');
    item.className = 'place-item';
    item.innerHTML = `
      <div class="place-item-name">${place.placeName}</div>
      <div class="place-item-address">${place.address || 'N/A'}</div>
      <div class="place-item-category">📁 ${place.placeType}</div>
      <button class="delete-marker-btn" style="width: 100%; margin-top: 8px;">
        🗑️ Remove
      </button>
    `;
    item.querySelector('.delete-marker-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      API.removeSavedPlace(place.id);
      loadSavedPlacesUI();
    });
    item.addEventListener('click', () => {
      flyToLocation(place.latitude, place.longitude);
    });
    list.appendChild(item);
  });
}

// Handle Add Place
async function handleAddPlace(e) {
  e.preventDefault();

  const name = document.getElementById('placeName').value;
  const address = document.getElementById('placeAddress').value;
  const category = document.getElementById('placeCategory').value;
  const description = document.getElementById('placeDescription').value;
  const rating = parseFloat(document.getElementById('placeRating').value) || null;

  // Get current map center as place location
  const center = getMapCenter();

  const locationData = {
    name,
    address,
    category,
    description,
    rating,
    latitude: center.lat,
    longitude: center.lng,
  };

  const result = await API.createLocation(locationData);

  if (result) {
    alert('✅ Place added successfully!');
    allLocations.push(result);
    addMarkerToMap(result);

    // Reset form
    document.getElementById('addPlaceForm').reset();

    // Reload nearby places
    loadNearbyPlacesUI();
  } else {
    alert('❌ Error adding place. Make sure backend is running!');
  }
}

// Save Marker to Saved Places
function saveMarker(location) {
  const savedPlace = {
    placeName: location.name,
    latitude: location.latitude,
    longitude: location.longitude,
    address: location.address,
    placeType: location.category,
  };

  API.savePlaceLocally(savedPlace);
  alert('✅ Place saved!');
  document.getElementById('markerInfo').classList.add('hidden');
}

// Delete Marker (Location)
async function deleteMarker(locationId) {
  if (confirm('Are you sure you want to delete this place?')) {
    const result = await API.deleteLocation(locationId);

    if (result) {
      alert('✅ Place deleted!');
      allLocations = allLocations.filter((loc) => loc._id !== locationId);
      if (markers[locationId]) {
        map.removeLayer(markers[locationId]);
        delete markers[locationId];
      }
      document.getElementById('markerInfo').classList.add('hidden');
      loadNearbyPlacesUI();
    } else {
      alert('❌ Error deleting place');
    }
  }
}

// Auto-refresh nearby places when map moves
map && map.on('moveend', () => {
  loadNearbyPlacesUI();
});
