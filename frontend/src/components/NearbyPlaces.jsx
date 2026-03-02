import { useMemo } from 'react'
import './Places.css'

const calculateDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

export default function NearbyPlaces({
  userLocation,
  allLocations,
  recommendedResults = [],
  onSelectPlace,
}) {
  const isRecommended = recommendedResults.length > 0

  const nearbyPlaces = useMemo(() => {
    if (isRecommended) {
      return recommendedResults.map((loc) => ({
        ...loc,
        distance: loc.distanceKm ?? null,
        _id: loc._id || `${loc.latitude}-${loc.longitude}`, // Generate ID if not present
      }))
    }

    return allLocations
      .map((loc) => ({
        ...loc,
        distance: calculateDistance(
          userLocation.lat,
          userLocation.lng,
          loc.latitude,
          loc.longitude
        ),
      }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 10)
  }, [userLocation, allLocations, isRecommended, recommendedResults])

  return (
    <div className="places-list">
      {nearbyPlaces.length === 0 ? (
        <p className="empty-message">No places found</p>
      ) : (
        nearbyPlaces.map((place) => (
          <div
            key={place._id}
            className="place-item"
            onClick={() => onSelectPlace(place)}
          >
            <div className="place-item-name">
              {place.name}
              {place.source === 'global' && <span className="global-badge">🌍</span>}
              {place.source === 'database' && isRecommended && <span className="ai-badge">AI</span>}
            </div>
            <div className="place-item-address">{place.address || 'N/A'}</div>
            <div className="place-item-category">📁 {place.category || 'Uncategorized'}</div>
            <div className="place-item-rating">
              ⭐ {place.rating ? place.rating + '/5' : 'No rating'} 
              {place.distance !== null && place.distance !== undefined && (
                <> • 📍 {place.distance.toFixed(1)} km</>
              )}
            </div>
            {place.source === 'database' && isRecommended && place.reasons && (
              <div className="place-item-reason">
                Score: {place.score} • {place.reasons?.[0] || 'AI ranked'}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  )
}
