const mongoose = require('mongoose');

const savedPlaceSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  placeName: String,
  latitude: Number,
  longitude: Number,
  address: String,
  placeType: String, // home, work, favorite, etc.
  category: String,
  savedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('SavedPlace', savedPlaceSchema);
