import { useState, useEffect } from 'react'
import MapContainer from './components/MapContainer'
import Sidebar from './components/Sidebar'
import ChatWidget from './components/ChatWidget'
import WeatherPanel from './components/WeatherPanel'
import './App.css'

function App() {
  const [userLocation, setUserLocation] = useState(null)
  const [allLocations, setAllLocations] = useState([])
  const [selectedMarker, setSelectedMarker] = useState(null)
  const [activeTab, setActiveTab] = useState('nearby')
  const [trafficEnabled, setTrafficEnabled] = useState(false)
  const [trafficPoints, setTrafficPoints] = useState([])
  const [routeData, setRouteData] = useState(null)
  const [weatherEnabled, setWeatherEnabled] = useState(false)
  const [weatherLocation, setWeatherLocation] = useState(null)
  const [mapCenter, setMapCenter] = useState(null)

  // Get user location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
        },
        () => {
          // Fallback to India center
          setUserLocation({ lat: 20.5937, lng: 78.9629 })
        }
      )
    }
  }, [])

  // Load all locations
  useEffect(() => {
    fetchAllLocations()
  }, [])

  useEffect(() => {
    if (!trafficEnabled || !userLocation) return
    fetchTrafficPrediction()
  }, [trafficEnabled, userLocation])

  const fetchAllLocations = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/locations')
      const data = await response.json()
      setAllLocations(data)
    } catch (error) {
      console.error('Error fetching locations:', error)
    }
  }

  const handleAddPlace = async (placeData) => {
    try {
      const response = await fetch('http://localhost:5000/api/locations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(placeData),
      })
      const newLocation = await response.json()
      setAllLocations([...allLocations, newLocation])
      alert('✅ Place added successfully!')
    } catch (error) {
      console.error('Error adding place:', error)
      alert('❌ Error adding place')
    }
  }

  const handleDeletePlace = async (locationId) => {
    if (!confirm('Are you sure?')) return

    try {
      await fetch(`http://localhost:5000/api/locations/${locationId}`, {
        method: 'DELETE',
      })
      setAllLocations(allLocations.filter((loc) => loc._id !== locationId))
      setSelectedMarker(null)
      alert('✅ Place deleted!')
    } catch (error) {
      console.error('Error deleting:', error)
    }
  }

  const fetchTrafficPrediction = async () => {
    try {
      const params = new URLSearchParams({
        lat: userLocation.lat,
        lng: userLocation.lng,
        radius: 5,
      })
      const response = await fetch(
        `http://localhost:5000/api/ai/traffic?${params.toString()}`
      )
      const data = await response.json()
      setTrafficPoints(Array.isArray(data?.points) ? data.points : [])
    } catch (error) {
      console.error('Traffic prediction error:', error)
      setTrafficPoints([])
    }
  }

  const handleRequestRoute = async (destination) => {
    if (!userLocation || !destination) return

    try {
      const params = new URLSearchParams({
        originLat: userLocation.lat,
        originLng: userLocation.lng,
        destLat: destination.latitude,
        destLng: destination.longitude,
      })
      const response = await fetch(
        `http://localhost:5000/api/ai/route?${params.toString()}`
      )
      const data = await response.json()
      if (Array.isArray(data?.path)) {
        setRouteData({
          ...data,
          destinationId: destination._id,
          destinationName: destination.name,
        })
      } else {
        alert('❌ Route not available')
      }
    } catch (error) {
      console.error('Route fetch error:', error)
      alert('❌ Failed to fetch route')
    }
  }

  const handleClearRoute = () => {
    setRouteData(null)
  }

  const handleWeatherSearch = (locationData) => {
    setWeatherLocation(locationData)
    setWeatherEnabled(true)
    setMapCenter({ lat: locationData.lat, lng: locationData.lng })
  }

  const handleUpdateUserLocation = (lat, lng) => {
    setUserLocation({ lat, lng })
    setMapCenter({ lat, lng })
  }

  const handleSelectMarker = (marker) => {
    setSelectedMarker(marker)
    // Zoom to selected marker location
    if (marker) {
      const lat = marker.latitude ?? marker.lat
      const lng = marker.longitude ?? marker.lng
      if (lat && lng) {
        setMapCenter({ lat, lng })
      }
    }
  }

  return (
    <div className="app-container">
      {userLocation && (
        <>
          <Sidebar
            userLocation={userLocation}
            allLocations={allLocations}
            selectedMarker={selectedMarker}
            onAddPlace={handleAddPlace}
            onDeletePlace={handleDeletePlace}
            onSelectMarker={handleSelectMarker}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            trafficEnabled={trafficEnabled}
            onToggleTraffic={() => setTrafficEnabled((prev) => !prev)}
            routeData={routeData}
            onRequestRoute={handleRequestRoute}
            onClearRoute={handleClearRoute}
            weatherEnabled={weatherEnabled}
            onToggleWeather={() => setWeatherEnabled((prev) => !prev)}
            onWeatherSearch={handleWeatherSearch}
            onLocationSearch={(lat, lng) => setMapCenter({ lat, lng })}
            onUpdateUserLocation={handleUpdateUserLocation}
          />
          <MapContainer
            userLocation={userLocation}
            locations={allLocations}
            selectedMarker={selectedMarker}
            onSelectMarker={handleSelectMarker}
            trafficEnabled={trafficEnabled}
            trafficPoints={trafficPoints}
            routeData={routeData}
            weatherLocation={weatherLocation}
            mapCenter={mapCenter}
          />
          <ChatWidget
            userLocation={userLocation}
            trafficEnabled={trafficEnabled}
            weatherEnabled={weatherEnabled}
            onWeatherToggle={setWeatherEnabled}
          />
          {weatherEnabled && (
            <div className="weather-panel-container">
              <WeatherPanel
                userLocation={userLocation}
                weatherLocation={weatherLocation}
                weatherEnabled={weatherEnabled}
                onClose={() => {
                  setWeatherEnabled(false)
                  setWeatherLocation(null)
                }}
              />
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default App
