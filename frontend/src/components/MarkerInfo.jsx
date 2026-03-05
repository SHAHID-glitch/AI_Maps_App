import { useEffect, useState } from 'react'
import { API_BASE_URL } from '../config'
import './MarkerInfo.css'

export default function MarkerInfo({
  marker,
  userLocation,
  onDelete,
  onClose,
  routeData,
  onRequestRoute,
  onClearRoute,
}) {
  const [etaInfo, setEtaInfo] = useState({ status: 'idle' })

  useEffect(() => {
    const fetchEta = async () => {
      if (!userLocation?.lat || !userLocation?.lng || !marker?.latitude || !marker?.longitude) {
        return
      }

      setEtaInfo({ status: 'loading' })
      try {
        const params = new URLSearchParams({
          originLat: userLocation.lat,
          originLng: userLocation.lng,
          destLat: marker.latitude,
          destLng: marker.longitude,
        })
        const response = await fetch(
          `${API_BASE_URL}/api/ai/travel-time?${params.toString()}`
        )
        const data = await response.json()
        if (data?.etaMinutes) {
          setEtaInfo({ status: 'ready', data })
        } else {
          setEtaInfo({ status: 'error' })
        }
      } catch (error) {
        setEtaInfo({ status: 'error' })
      }
    }

    fetchEta()
  }, [marker, userLocation])

  const isRouteActive = routeData?.destinationId === marker._id
  const handleSave = () => {
    const savedPlace = {
      id: Date.now().toString(),
      placeName: marker.name,
      latitude: marker.latitude,
      longitude: marker.longitude,
      address: marker.address,
      placeType: marker.category,
    }

    const saved = JSON.parse(localStorage.getItem('savedPlaces')) || []
    saved.push(savedPlace)
    localStorage.setItem('savedPlaces', JSON.stringify(saved))
    alert('✅ Place saved!')
    onClose()
  }

  return (
    <div className="marker-info">
      <button className="close-btn" onClick={onClose}>
        &times;
      </button>
      <h3>{marker.name}</h3>
      <p>{marker.address}</p>
      <p>📁 {marker.category}</p>
      <p>⭐ {marker.rating ? `${marker.rating}/5` : 'No rating'}</p>
      <p>
        🕒 ETA:{' '}
        {etaInfo.status === 'loading' && 'Calculating...'}
        {etaInfo.status === 'error' && 'Unavailable'}
        {etaInfo.status === 'ready' &&
          `${etaInfo.data.etaMinutes} min (${etaInfo.data.trafficLevel} traffic)`}
      </p>
      {isRouteActive && (
        <div className="route-summary">
          <p>
            🛣️ Route: {routeData.distanceKm} km • {routeData.durationMin} min
          </p>
          <p>🤖 AI ETA: {routeData.aiEtaMin} min ({routeData.trafficLevel} traffic)</p>
        </div>
      )}
      {marker.description && <p>{marker.description}</p>}

      <button className="save-marker-btn" onClick={handleSave}>
        💾 Save
      </button>
      <button className="delete-marker-btn" onClick={() => onDelete(marker._id)}>
        🗑️ Delete
      </button>
      <button className="route-btn" onClick={() => onRequestRoute(marker)}>
        🛣️ Route
      </button>
      {isRouteActive && (
        <button className="route-clear-btn" onClick={onClearRoute}>
          ✖ Clear
        </button>
      )}
    </div>
  )
}
