// Map Configuration and Functions
let map;
let userMarker = null;
let markerCluster = {};
const markers = {};

// Initialize Map
function initializeMap() {
  // Create map centered on India (default)
  map = L.map('map').setView([20.5937, 78.9629], 5);

  // Add OpenStreetMap tiles
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 19,
  }).addTo(map);

  // Add user location marker on load
  getUserLocation();

  // Map click event
  map.on('click', (e) => {
    console.log(`Lat: ${e.latlng.lat}, Lng: ${e.latlng.lng}`);
  });
}

// Get User Location
function getUserLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation(latitude, longitude);
      },
      (error) => {
        console.log('Location access denied or unavailable', error);
        setUserLocation(20.5937, 78.9629); // Default to India center
      }
    );
  }
}

// Set User Location on Map
function setUserLocation(lat, lng) {
  // Remove old marker if exists
  if (userMarker) {
    map.removeLayer(userMarker);
  }

  // Add new user marker
  userMarker = L.circleMarker([lat, lng], {
    radius: 8,
    fillColor: '#4285F4',
    color: '#1f73e7',
    weight: 3,
    opacity: 1,
    fillOpacity: 0.8,
  })
    .addTo(map)
    .bindPopup(`
      <div style="text-align: center; padding: 10px;">
        <strong>📍 Your Location</strong><br>
        Lat: ${lat.toFixed(4)}<br>
        Lng: ${lng.toFixed(4)}
      </div>
    `)
    .openPopup();

  // Center map on user
  map.setView([lat, lng], 13);

  // Load nearby places
  loadNearbyPlaces(lat, lng);
}

// Add Marker to Map
function addMarkerToMap(location) {
  if (markers[location._id]) {
    map.removeLayer(markers[location._id]);
  }

  const icon = getMarkerIcon(location.category);

  const marker = L.marker([location.latitude, location.longitude], {
    icon: icon,
  })
    .addTo(map)
    .on('click', () => {
      showMarkerInfo(location);
    });

  markers[location._id] = marker;

  return marker;
}

// Get Marker Icon by Category
function getMarkerIcon(category) {
  const categoryIcons = {
    restaurant: '🍽️',
    hotel: '🏨',
    landmark: '🏛️',
    park: '🌳',
    hospital: '🏥',
    gym: '💪',
  };

  const icon = categoryIcons[category] || '📍';

  return L.divIcon({
    html: `<div style="font-size: 32px; line-height: 32px;">${icon}</div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
}

// Show Marker Information
function showMarkerInfo(location) {
  const markerInfo = document.getElementById('markerInfo');
  document.getElementById('markerTitle').textContent = location.name;
  document.getElementById('markerAddress').textContent = location.address || 'N/A';
  document.getElementById('markerCategory').textContent =
    `📁 ${location.category || 'Uncategorized'}`;
  document.getElementById('markerRating').textContent =
    location.rating ? `⭐ ${location.rating} / 5` : '⭐ No rating';

  markerInfo.classList.remove('hidden');

  // Set button actions
  document.getElementById('saveMarkerBtn').onclick = () => saveMarker(location);
  document.getElementById('deleteMarkerBtn').onclick = () => deleteMarker(location._id);
  document.getElementById('closeMarkerInfo').onclick = () => {
    markerInfo.classList.add('hidden');
  };
}

// Load Nearby Places
async function loadNearbyPlaces(lat, lng) {
  try {
    const locations = await API.getNearbyLocations(lat, lng, 10);
    
    // Ensure locations is an array
    if (!Array.isArray(locations)) {
      console.error('Invalid response from nearby locations:', locations);
      return;
    }

    locations.forEach((location) => {
      addMarkerToMap(location);
    });
  } catch (error) {
    console.error('Error loading nearby places:', error);
  }
}

// Clear All Markers
function clearMarkers() {
  Object.values(markers).forEach((marker) => {
    map.removeLayer(marker);
  });
  Object.keys(markers).forEach((key) => {
    delete markers[key];
  });
}

// Add Custom Marker
function addCustomMarker(lat, lng, name, address, category) {
  const newMarker = L.marker([lat, lng])
    .addTo(map)
    .bindPopup(`<strong>${name}</strong><br>${address}`);

  return newMarker;
}

// Fly To Location
function flyToLocation(lat, lng, zoom = 15) {
  map.flyTo([lat, lng], zoom, {
    duration: 1.5,
  });
}

// Calculate Distance
function calculateDistance(lat1, lng1, lat2, lng2) {
  const R = 6371; // Earth radius in km
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
}

// Get Current Map Center
function getMapCenter() {
  const center = map.getCenter();
  return { lat: center.lat, lng: center.lng };
}
