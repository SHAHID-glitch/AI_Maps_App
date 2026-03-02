/**
 * Sample Data for MongoDB
 * Run this in MongoDB shell or MongoDB Compass
 */

db.locations.insertMany([
  {
    name: "Taj Mahal",
    address: "Dharmapuri, Forest Colony, Tajganj, Agra, Uttar Pradesh",
    latitude: 27.1751,
    longitude: 78.0421,
    category: "landmark",
    rating: 4.8,
    description: "The most beautiful monument in the world, UNESCO World Heritage Site",
    tags: ["monument", "historical", "architecture"],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "India Gate",
    address: "Rajpath, New Delhi, 110001",
    latitude: 28.6129,
    longitude: 77.2295,
    category: "landmark",
    rating: 4.5,
    description: "War memorial and iconic landmark of Delhi",
    tags: ["monument", "historical", "famous"],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Domino's Pizza - Khan Market",
    address: "Khan Market, New Delhi",
    latitude: 28.5675,
    longitude: 77.2395,
    category: "restaurant",
    rating: 4.2,
    description: "Fast food pizza restaurant in prime location",
    tags: ["pizza", "fastfood", "delivery"],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "ITC Maurya Hotel",
    address: "1 Sardar Patel Marg, New Delhi",
    latitude: 28.5921,
    longitude: 77.2064,
    category: "hotel",
    rating: 4.6,
    description: "5-star luxury hotel in heart of Delhi",
    tags: ["luxury", "accommodation", "restaurant"],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Lodhi Garden",
    address: "Lodhi Rd, New Delhi",
    latitude: 28.5933,
    longitude: 77.2199,
    category: "park",
    rating: 4.3,
    description: "Beautiful park with historical monuments and walking trails",
    tags: ["park", "nature", "historical"],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Apollo Hospital",
    address: "Sarita Vihar, New Delhi",
    latitude: 28.5244,
    longitude: 77.2499,
    category: "hospital",
    rating: 4.7,
    description: "Multi-specialty hospital with state-of-the-art facilities",
    tags: ["hospital", "healthcare", "emergency"],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Fittr Gym",
    address: "New Friends Colony, New Delhi",
    latitude: 28.5598,
    longitude: 77.2571,
    category: "gym",
    rating: 4.4,
    description: "Modern gym with world-class fitness equipment and trainers",
    tags: ["fitness", "gym", "health"],
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

console.log("✅ Sample data inserted successfully!");
