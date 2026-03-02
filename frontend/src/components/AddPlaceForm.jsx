import { useState } from 'react'
import './AddPlaceForm.css'

export default function AddPlaceForm({ onAddPlace }) {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    category: '',
    description: '',
    rating: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!formData.name || !formData.address) {
      alert('Please fill in name and address')
      return
    }

    // Use default location (Delhi)
    const newPlace = {
      ...formData,
      latitude: 28.6139,
      longitude: 77.2090,
      rating: formData.rating ? parseFloat(formData.rating) : null,
    }

    onAddPlace(newPlace)
    setFormData({
      name: '',
      address: '',
      category: '',
      description: '',
      rating: '',
    })
  }

  return (
    <form className="add-place-form" onSubmit={handleSubmit}>
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Place Name"
        required
      />
      <input
        type="text"
        name="address"
        value={formData.address}
        onChange={handleChange}
        placeholder="Address"
        required
      />
      <select name="category" value={formData.category} onChange={handleChange}>
        <option value="">Select Category</option>
        <option value="restaurant">🍽️ Restaurant</option>
        <option value="hotel">🏨 Hotel</option>
        <option value="landmark">🏛️ Landmark</option>
        <option value="park">🌳 Park</option>
        <option value="hospital">🏥 Hospital</option>
        <option value="gym">💪 Gym</option>
      </select>
      <textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Description"
      />
      <input
        type="number"
        name="rating"
        value={formData.rating}
        onChange={handleChange}
        min="0"
        max="5"
        step="0.5"
        placeholder="Rating (0-5)"
      />
      <button type="submit" className="submit-btn">
        ➕ Add Place
      </button>
    </form>
  )
}
