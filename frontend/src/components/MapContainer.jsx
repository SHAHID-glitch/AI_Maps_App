import { MapContainer, TileLayer, Marker, Popup, Circle, Polyline, CircleMarker, useMap } from 'react-leaflet'
import L from 'leaflet'
import { useEffect } from 'react'
import 'leaflet/dist/leaflet.css'
import './MapContainer.css'

// Fix marker icon issue
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

const getMarkerIcon = (category) => {
  const categoryIcons = {
    restaurant: '🍽️',
    hotel: '🏨',
    landmark: '🏛️',
    park: '🌳',
    hospital: '🏥',
    gym: '💪',
  }

  const icon = categoryIcons[category] || '📍'

  return new L.DivIcon({
    html: `<div style="font-size: 32px; line-height: 32px;">${icon}</div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  })
}

const trafficColor = (intensity) => {
  if (intensity >= 0.75) return '#ef4444'
  if (intensity >= 0.5) return '#f59e0b'
  return '#22c55e'
}

const weatherIcon = new L.DivIcon({
  html: `<div style="font-size: 40px; line-height: 40px; filter: drop-shadow(2px 2px 4px rgba(0,0,0,0.5));">🌤️</div>`,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
})

// Component to handle map center changes
function MapCenterControl({ center }) {
  const map = useMap()
  
  useEffect(() => {
    if (center) {
      map.flyTo([center.lat, center.lng], 13, {
        duration: 1.5,
      })
    }
  }, [center, map])
  
  return null
}

export default function MapContainerComponent({
  userLocation,
  locations,
  selectedMarker,
  onSelectMarker,
  trafficEnabled,
  trafficPoints = [],
  routeData,
  weatherLocation,
  mapCenter,
}) {
  if (!userLocation) return <div className="map-loading">Loading map...</div>

  return (
    <div className="map-wrapper">
      <MapContainer
        center={[userLocation.lat, userLocation.lng]}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='© OpenStreetMap contributors'
        />

        {/* Map Center Control */}
        <MapCenterControl center={mapCenter} />

        {/* User Location Circle */}
        <CircleMarker
          center={[userLocation.lat, userLocation.lng]}
          radius={8}
          pathOptions={{
            fillColor: '#4285F4',
            color: '#1f73e7',
            weight: 3,
            opacity: 1,
            fillOpacity: 0.8,
          }}
        >
          <Popup>
            <strong>📍 Your Location</strong>
            <br />
            Lat: {userLocation.lat.toFixed(4)}
            <br />
            Lng: {userLocation.lng.toFixed(4)}
          </Popup>
        </CircleMarker>

        {/* Place Markers */}
        {locations.map((location) => (
          <Marker
            key={location._id}
            position={[location.latitude, location.longitude]}
            icon={getMarkerIcon(location.category)}
            eventHandlers={{
              click: () => onSelectMarker(location),
            }}
          >
            <Popup>
              <div style={{ textAlign: 'center', padding: '10px' }}>
                <strong>{location.name}</strong>
                <br />
                {location.address}
                <br />
                📁 {location.category}
                <br />
                ⭐ {location.rating ? `${location.rating}/5` : 'No rating'}
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Weather Location Marker */}
        {weatherLocation && (
          <Marker
            position={[weatherLocation.lat, weatherLocation.lng]}
            icon={weatherIcon}
          >
            <Popup>
              <div style={{ textAlign: 'center', padding: '10px' }}>
                <strong>🌤️ {weatherLocation.name}</strong>
                <br />
                {weatherLocation.weather && (
                  <>
                    {weatherLocation.weather.temp}°C
                    <br />
                    {weatherLocation.weather.description}
                  </>
                )}
              </div>
            </Popup>
          </Marker>
        )}

        {/* Traffic Heatmap */}
        {trafficEnabled &&
          trafficPoints.map((point, idx) => (
            <Circle
              key={`${point.lat}-${point.lng}-${idx}`}
              center={[point.lat, point.lng]}
              radius={350}
              pathOptions={{
                color: trafficColor(point.intensity),
                fillColor: trafficColor(point.intensity),
                fillOpacity: 0.35,
                weight: 0,
              }}
            />
          ))}

        {/* Smart Route */}
        {routeData?.path && (
          <Polyline
            positions={routeData.path}
            pathOptions={{ color: '#2563eb', weight: 5, opacity: 0.85 }}
          />
        )}
      </MapContainer>
      {trafficEnabled && (
        <div className="traffic-legend">
          <div className="legend-title">Traffic</div>
          <div className="legend-row">
            <span className="legend-dot low" /> Low
          </div>
          <div className="legend-row">
            <span className="legend-dot med" /> Medium
          </div>
          <div className="legend-row">
            <span className="legend-dot high" /> High
          </div>
        </div>
      )}
    </div>
  )
}
