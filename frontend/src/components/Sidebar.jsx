import { useState } from 'react'
import SearchBar from './SearchBar'
import NearbyPlaces from './NearbyPlaces'
import SavedPlaces from './SavedPlaces'
import AddPlaceForm from './AddPlaceForm'
import MarkerInfo from './MarkerInfo'
import './Sidebar.css'

export default function Sidebar({
  userLocation,
  allLocations,
  selectedMarker,
  onAddPlace,
  onDeletePlace,
  onSelectMarker,
  activeTab,
  onTabChange,
  trafficEnabled,
  onToggleTraffic,
  routeData,
  onRequestRoute,
  onClearRoute,
  weatherEnabled,
  onToggleWeather,
  onWeatherSearch,
  onLocationSearch,
  onUpdateUserLocation,
}) {
  const [recommendedResults, setRecommendedResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [weatherSearch, setWeatherSearch] = useState('')
  const [isWeatherSearching, setIsWeatherSearching] = useState(false)

  const handleWeatherSearchSubmit = async (e) => {
    e.preventDefault()
    const cityName = weatherSearch.trim()

    if (!cityName) {
      alert('Please enter a city name')
      return
    }

    setIsWeatherSearching(true)
    try {
      const response = await fetch(
        `http://localhost:5000/api/weather/city/${encodeURIComponent(cityName)}`
      )
      if (response.ok) {
        const data = await response.json()
        onWeatherSearch({
          lat: data.location.lat,
          lng: data.location.lng,
          name: data.location.display_name,
          weather: data.weather,
        })
        setWeatherSearch('')
      } else {
        alert('❌ City not found. Please try another city.')
      }
    } catch (error) {
      console.error('Weather search error:', error)
      alert('❌ Weather search failed')
    }
    setIsWeatherSearching(false)
  }

  const handleSearch = async (query) => {
    if (!query.trim()) {
      setRecommendedResults([])
      return
    }

    // Search globally (database + worldwide locations)
    setIsSearching(true)
    try {
      const response = await fetch(
        `http://localhost:5000/api/search/global?q=${encodeURIComponent(query)}`
      )
      const data = await response.json()
      const results = Array.isArray(data) ? data : []
      setRecommendedResults(results)
      onTabChange('nearby')

      // Zoom to first result location
      if (results.length > 0) {
        const firstResult = results[0]
        const lat = firstResult.latitude ?? firstResult.lat
        const lng = firstResult.longitude ?? firstResult.lng
        
        if (lat && lng && onLocationSearch) {
          onLocationSearch(lat, lng)
        }
      }
    } catch (error) {
      console.error('Search error:', error)
      alert('Search failed. Please try again.')
    }
    setIsSearching(false)
  }

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude
          const lng = position.coords.longitude
          
          // Update user location and zoom map
          if (onUpdateUserLocation) {
            onUpdateUserLocation(lat, lng)
          }
          // Clear selected marker
          onSelectMarker(null)
        },
        (error) => {
          console.error('Geolocation error:', error)
          alert('Unable to get your location. Please enable location services.')
        }
      )
    } else {
      alert('Geolocation is not supported by your browser.')
    }
  }

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h1>🗺️ MAPS</h1>
      </div>

      <SearchBar onSearch={handleSearch} isLoading={isSearching} />

      <form onSubmit={handleWeatherSearchSubmit} className="weather-search-form">
        <input
          type="text"
          placeholder="🌤️ Search weather by city..."
          value={weatherSearch}
          onChange={(e) => setWeatherSearch(e.target.value)}
          className="weather-search-input"
          disabled={isWeatherSearching}
        />
        <button
          type="submit"
          className="weather-search-btn"
          disabled={isWeatherSearching}
        >
          {isWeatherSearching ? '⏳' : '🔍'}
        </button>
      </form>

      <div className="location-info">
        <button className="my-location-btn" onClick={handleGetLocation}>
          📍 My Location
        </button>
        <div className="ai-toggle">
          <span>Traffic Heatmap</span>
          <label className="switch">
            <input
              type="checkbox"
              checked={trafficEnabled}
              onChange={onToggleTraffic}
            />
            <span className="slider" />
          </label>
        </div>
        <div className="ai-toggle">
          <span>Weather</span>
          <label className="switch">
            <input
              type="checkbox"
              checked={weatherEnabled}
              onChange={onToggleWeather}
            />
            <span className="slider" />
          </label>
        </div>
      </div>

      <div className="tabs">
        <button
          className={`tab-btn ${activeTab === 'nearby' ? 'active' : ''}`}
          onClick={() => onTabChange('nearby')}
        >
          Nearby
        </button>
        <button
          className={`tab-btn ${activeTab === 'saved' ? 'active' : ''}`}
          onClick={() => onTabChange('saved')}
        >
          Saved
        </button>
        <button
          className={`tab-btn ${activeTab === 'add' ? 'active' : ''}`}
          onClick={() => onTabChange('add')}
        >
          Add Place
        </button>
      </div>

      <div className="tab-content-wrapper">
        {activeTab === 'nearby' && (
          <NearbyPlaces
            userLocation={userLocation}
            allLocations={allLocations}
            recommendedResults={recommendedResults}
            onSelectPlace={onSelectMarker}
          />
        )}
        {activeTab === 'saved' && <SavedPlaces onSelectPlace={onSelectMarker} />}
        {activeTab === 'add' && <AddPlaceForm onAddPlace={onAddPlace} />}
      </div>

      {selectedMarker && (
        <MarkerInfo
          marker={selectedMarker}
          userLocation={userLocation}
          onDelete={onDeletePlace}
          onClose={() => onSelectMarker(null)}
          routeData={routeData}
          onRequestRoute={onRequestRoute}
          onClearRoute={onClearRoute}
        />
      )}
    </div>
  )
}
