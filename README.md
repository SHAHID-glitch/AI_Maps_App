# 🗺️ MAPS - Full Stack Geospatial Application

A complete Google Maps-like application built with **React**, **Leaflet**, **Node.js**, and **MongoDB**. Perfect for student portfolios and hackathons! 🚀

## 🎯 Features

✅ **Interactive Map** - Built with Leaflet.js & OpenStreetMap  
✅ **Real-time User Location** - Geolocation API integration  
✅ **Smart Search** - Search in database + Nominatim (OpenStreetMap)  
✅ **Add Custom Places** - Create and store locations  
✅ **Nearby Places** - Find places around you  
✅ **Save Favorites** - Save places locally  
✅ **Category Support** - Restaurants, Hotels, Landmarks, Parks, Hospitals, Gyms  
✅ **Responsive Design** - Works on desktop & mobile  
✅ **Full-Stack** - Frontend + Backend + Database

## 🛠️ Tech Stack

### Frontend
- **HTML5 / CSS3 / Vanilla JavaScript**
- **Leaflet.js** - Interactive maps
- **OpenStreetMap** - Free tile layer
- **Responsive Design** - Mobile-friendly

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **Axios** - HTTP client
- **CORS** - Cross-origin support

### APIs Used
- **Nominatim API** - OpenStreetMap search (FREE)
- **Geolocation API** - User location
- **RESTful API** - Backend endpoints

## 📋 Project Structure

```
MAPS/
├── frontend/
│   ├── index.html       # Main HTML file
│   ├── styles.css       # Styling
│   ├── app.js          # Application logic
│   ├── map.js          # Map functions
│   └── api.js          # API communication
├── backend/
│   ├── server.js       # Express server
│   ├── package.json    # Dependencies
│   ├── .env            # Environment variables
│   ├── config/
│   │   └── db.js       # MongoDB connection
│   ├── models/
│   │   ├── Location.js # Location schema
│   │   └── SavedPlace.js # SavedPlace schema
│   └── routes/
│       ├── locations.js # Location endpoints
│       └── search.js    # Search endpoints
└── README.md           # This file
```

## 🚀 Quick Start

### 1️⃣ Prerequisites
- **Node.js** (v14 or higher) - [Download](https://nodejs.org)
- **MongoDB** (Local or Cloud) - [Download](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://cloud.mongodb.com)

### 2️⃣ Backend Setup

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Copy .env file
copy .env.example .env

# Edit .env with your MongoDB URI
# MONGODB_URI=mongodb://localhost:27017/maps-db
# PORT=5000

# Start the backend
npm start
```

✅ Backend runs on `http://localhost:5000`

### 3️⃣ Frontend Setup

Open the frontend `index.html` file directly in your browser:

```bash
# Option 1: Use Live Server extension in VS Code
# Right-click index.html → Open with Live Server

# Option 2: Use Python
cd frontend
python -m http.server 8000

# Then visit: http://localhost:8000
```

✅ Frontend runs on `http://localhost:8000`

## 📡 API Endpoints

### Locations

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/locations` | Get all locations |
| GET | `/api/locations/:id` | Get single location |
| POST | `/api/locations` | Create location |
| PUT | `/api/locations/:id` | Update location |
| DELETE | `/api/locations/:id` | Delete location |
| GET | `/api/locations/nearby/:lat/:lng` | Get nearby locations |

### Search

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/search/db?q=query` | Search in database |
| GET | `/api/search/nominatim?q=query` | Search using OpenStreetMap |

### Example Requests

**Create a Location:**
```bash
curl -X POST http://localhost:5000/api/locations \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Coffee Shop",
    "address": "123 Main St",
    "latitude": 28.6139,
    "longitude": 77.2090,
    "category": "restaurant",
    "rating": 4.5,
    "description": "Great coffee place"
  }'
```

**Get Nearby Locations:**
```bash
curl http://localhost:5000/api/locations/nearby/28.6139/77.2090?radius=5
```

## 🎮 Usage Guide

### 1. **View Map**
- The map loads with your current location (if permission granted)
- Zoom in/out to explore different areas

### 2. **Search Places**
- Type in search box → Press Enter or click Search button
- Results show from database first, then Nominatim

### 3. **View Nearby Places**
- Click "Nearby" tab to see places around map center
- Places sorted by distance
- Click a place to fly to it

### 4. **Add New Place**
- Click "Add Place" tab
- Fill the form (centered on current map view)
- Click to add marker on map
- New places sync to database

### 5. **Save Favorites**
- Click any place marker → Click "💾 Save"
- View in "Saved" tab
- Saved locally in browser

## 🗄️ Database Schema

### Location Document
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  latitude: Number,
  longitude: Number,
  address: String,
  category: String,
  rating: Number (0-5),
  tags: [String],
  createdAt: Date,
  updatedAt: Date
}
```

### SavedPlace Document
```javascript
{
  _id: ObjectId,
  userId: String,
  placeName: String,
  latitude: Number,
  longitude: Number,
  address: String,
  placeType: String,
  category: String,
  savedAt: Date
}
```

## 🚀 Advanced Features (Next Steps)

### 1. **User Authentication**
```javascript
// Add JWT authentication
npm install jsonwebtoken bcryptjs
```

### 2. **User Model**
```javascript
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String, // Hashed
  savedPlaces: [ObjectId],
  createdAt: Date
});
```

### 3. **Route Optimization**
- Use OSRM (Open Source Routing Machine)
- Implement turn-by-turn directions

### 4. **Real-time GPS Tracking**
- Use Socket.io for live tracking
- Display moving markers

### 5. **AI Features**
- Place recommendations
- Traffic prediction
- Route optimization with ML

### 6. **Reviews & Ratings**
```javascript
const reviewSchema = new mongoose.Schema({
  locationId: ObjectId,
  userId: String,
  rating: Number,
  comment: String,
  createdAt: Date
});
```

## 🐛 Troubleshooting

### ❌ "Cannot connect to MongoDB"
- Make sure MongoDB is running
- Check connection string in `.env`
- Use MongoDB Atlas for cloud database

### ❌ "Map not loading"
- Check browser console for errors (F12)
- Verify Leaflet CDN is accessible
- Ensure internet connection

### ❌ "CORS errors"
- Backend CORS middleware is enabled
- Check backend is running on `http://localhost:5000`
- Clear browser cache

### ❌ "Geolocation not working"
- Must use HTTPS in production
- Grant location permission when prompted
- Check browser geolocation settings

## 📱 Mobile Optimization

The app is fully responsive! However, for better mobile UX:

```css
/* Add touch gestures support */
@media (max-width: 768px) {
  .sidebar {
    height: auto;
    max-height: 40vh;
  }
  
  .map-container {
    height: 60vh;
  }
}
```

## 📊 Sample Data

To test with sample data, add this to MongoDB:

```javascript
db.locations.insertMany([
  {
    name: "Taj Mahal",
    address: "Dharmapuri, Forest Colony, Tajganj, Agra, Uttar Pradesh",
    latitude: 27.1751,
    longitude: 78.0421,
    category: "landmark",
    rating: 4.8,
    description: "Iconic monument and UNESCO World Heritage Site"
  },
  {
    name: "India Gate",
    address: "Rajpath, New Delhi, 110001",
    latitude: 28.6129,
    longitude: 77.2295,
    category: "landmark",
    rating: 4.5,
    description: "War memorial and iconic Delhi landmark"
  }
]);
```

## 🎓 Learning Resources

- [Leaflet Documentation](https://leafletjs.com/)
- [OpenStreetMap Wiki](https://wiki.openstreetmap.org/)
- [Express.js Guide](https://expressjs.com/)
- [Mongoose Docs](https://mongoosejs.com/)
- [RESTful API Design](https://restfulapi.net/)

## 🤝 Contributing

Want to contribute? Check the [issues](https://github.com/yourusername/maps) page!

## 📄 License

MIT License - Feel free to use this project for learning!

## 🔥 Resume Impact

**Before:** "Built a maps application"

**After:** "Developed a full-stack geospatial web application with real-time location tracking, OpenStreetMap integration, and MongoDB database. Implemented RESTful APIs with Node.js/Express, interactive map features with Leaflet.js, and responsive UI with 50+ km search radius capability."

---

## 📞 Support

Have questions? 
- Check the [troubleshooting section](#-troubleshooting)
- Review API endpoints documentation
- Test with Postman/Insomnia

---

**Built with ❤️ for students and developers** 🚀

Made with Leaflet, OpenStreetMap, Node.js, and MongoDB

