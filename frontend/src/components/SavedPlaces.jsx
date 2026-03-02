import { useState, useEffect } from 'react'
import './Places.css'

export default function SavedPlaces({ onSelectPlace }) {
  const [saved, setSaved] = useState([])

  useEffect(() => {
    loadSaved()
  }, [])

  const loadSaved = () => {
    const savedPlaces = JSON.parse(localStorage.getItem('savedPlaces')) || []
    setSaved(savedPlaces)
  }

  const handleRemove = (id) => {
    setSaved(saved.filter((p) => p.id !== id))
    const updated = saved.filter((p) => p.id !== id)
    localStorage.setItem('savedPlaces', JSON.stringify(updated))
  }

  return (
    <div className="places-list">
      {saved.length === 0 ? (
        <p className="empty-message">No saved places</p>
      ) : (
        saved.map((place) => (
          <div key={place.id} className="place-item">
            <div className="place-item-name">{place.placeName}</div>
            <div className="place-item-address">{place.address || 'N/A'}</div>
            <div className="place-item-category">📁 {place.placeType}</div>
            <button
              className="delete-marker-btn"
              style={{ width: '100%', marginTop: '8px' }}
              onClick={() => handleRemove(place.id)}
            >
              🗑️ Remove
            </button>
          </div>
        ))
      )}
    </div>
  )
}
