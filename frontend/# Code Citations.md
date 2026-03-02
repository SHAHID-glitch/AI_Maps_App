# Code Citations

## License: unknown
https://github.com/samipevekar/corona-map/blob/d5beebdfbf9d9cfb51d2ea4595a276eb811dbab5/index.js

```
Let me check and fix the location button. I'll update the MapContainer to properly detect and zoom to your current location:

```javascript
// filepath: frontend/src/components/MapContainer.jsx
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useEffect, useState } from 'react';
import './MapContainer.css';

// Custom hook to handle map operations
function MapController({ userLocation, onLocationUpdate }) {
  const map = useMap();

  const handleLocateUser = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log('User location:', latitude, longitude);
          
          // Update state
          onLocationUpdate({ lat: latitude, lng: longitude });
          
          // Zoom to user location
          map.setView([latitude, longitude], 13);
          
          // Add a marker for current location
          L.marker([latitude, longitude], {
            icon: L.icon({
              iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              popupAnchor: [1,
```


## License: unknown
https://github.com/miteva-h/dreamescape-frontend/blob/d0a5e0478a7c44319f4d191ab6a3c6c9af3c218d/src/components/Reviews/ReviewList/reviews.js

```
Let me check and fix the location button. I'll update the MapContainer to properly detect and zoom to your current location:

```javascript
// filepath: frontend/src/components/MapContainer.jsx
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useEffect, useState } from 'react';
import './MapContainer.css';

// Custom hook to handle map operations
function MapController({ userLocation, onLocationUpdate }) {
  const map = useMap();

  const handleLocateUser = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log('User location:', latitude, longitude);
          
          // Update state
          onLocationUpdate({ lat: latitude, lng: longitude });
          
          // Zoom to user location
          map.setView([latitude, longitude], 13);
          
          // Add a marker for current location
          L.marker([latitude, longitude], {
            icon: L.icon({
              iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              popupAnchor: [1, -34]
            })
          }).addTo
```


## License: unknown
https://github.com/samipevekar/corona-map/blob/d5beebdfbf9d9cfb51d2ea4595a276eb811dbab5/index.js

```
Let me check and fix the location button. I'll update the MapContainer to properly detect and zoom to your current location:

```javascript
// filepath: frontend/src/components/MapContainer.jsx
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useEffect, useState } from 'react';
import './MapContainer.css';

// Custom hook to handle map operations
function MapController({ userLocation, onLocationUpdate }) {
  const map = useMap();

  const handleLocateUser = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log('User location:', latitude, longitude);
          
          // Update state
          onLocationUpdate({ lat: latitude, lng: longitude });
          
          // Zoom to user location
          map.setView([latitude, longitude], 13);
          
          // Add a marker for current location
          L.marker([latitude, longitude], {
            icon: L.icon({
              iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              popupAnchor: [1,
```


## License: unknown
https://github.com/miteva-h/dreamescape-frontend/blob/d0a5e0478a7c44319f4d191ab6a3c6c9af3c218d/src/components/Reviews/ReviewList/reviews.js

```
Let me check and fix the location button. I'll update the MapContainer to properly detect and zoom to your current location:

```javascript
// filepath: frontend/src/components/MapContainer.jsx
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useEffect, useState } from 'react';
import './MapContainer.css';

// Custom hook to handle map operations
function MapController({ userLocation, onLocationUpdate }) {
  const map = useMap();

  const handleLocateUser = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log('User location:', latitude, longitude);
          
          // Update state
          onLocationUpdate({ lat: latitude, lng: longitude });
          
          // Zoom to user location
          map.setView([latitude, longitude], 13);
          
          // Add a marker for current location
          L.marker([latitude, longitude], {
            icon: L.icon({
              iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              popupAnchor: [1, -34]
            })
          }).addTo
```


## License: unknown
https://github.com/samipevekar/corona-map/blob/d5beebdfbf9d9cfb51d2ea4595a276eb811dbab5/index.js

```
Let me check and fix the location button. I'll update the MapContainer to properly detect and zoom to your current location:

```javascript
// filepath: frontend/src/components/MapContainer.jsx
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useEffect, useState } from 'react';
import './MapContainer.css';

// Custom hook to handle map operations
function MapController({ userLocation, onLocationUpdate }) {
  const map = useMap();

  const handleLocateUser = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log('User location:', latitude, longitude);
          
          // Update state
          onLocationUpdate({ lat: latitude, lng: longitude });
          
          // Zoom to user location
          map.setView([latitude, longitude], 13);
          
          // Add a marker for current location
          L.marker([latitude, longitude], {
            icon: L.icon({
              iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              popupAnchor: [1,
```


## License: unknown
https://github.com/miteva-h/dreamescape-frontend/blob/d0a5e0478a7c44319f4d191ab6a3c6c9af3c218d/src/components/Reviews/ReviewList/reviews.js

```
Let me check and fix the location button. I'll update the MapContainer to properly detect and zoom to your current location:

```javascript
// filepath: frontend/src/components/MapContainer.jsx
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useEffect, useState } from 'react';
import './MapContainer.css';

// Custom hook to handle map operations
function MapController({ userLocation, onLocationUpdate }) {
  const map = useMap();

  const handleLocateUser = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log('User location:', latitude, longitude);
          
          // Update state
          onLocationUpdate({ lat: latitude, lng: longitude });
          
          // Zoom to user location
          map.setView([latitude, longitude], 13);
          
          // Add a marker for current location
          L.marker([latitude, longitude], {
            icon: L.icon({
              iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              popupAnchor: [1, -34]
            })
          }).addTo
```


## License: unknown
https://github.com/samipevekar/corona-map/blob/d5beebdfbf9d9cfb51d2ea4595a276eb811dbab5/index.js

```
Let me check and fix the location button. I'll update the MapContainer to properly detect and zoom to your current location:

```javascript
// filepath: frontend/src/components/MapContainer.jsx
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useEffect, useState } from 'react';
import './MapContainer.css';

// Custom hook to handle map operations
function MapController({ userLocation, onLocationUpdate }) {
  const map = useMap();

  const handleLocateUser = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log('User location:', latitude, longitude);
          
          // Update state
          onLocationUpdate({ lat: latitude, lng: longitude });
          
          // Zoom to user location
          map.setView([latitude, longitude], 13);
          
          // Add a marker for current location
          L.marker([latitude, longitude], {
            icon: L.icon({
              iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              popupAnchor: [1,
```


## License: unknown
https://github.com/miteva-h/dreamescape-frontend/blob/d0a5e0478a7c44319f4d191ab6a3c6c9af3c218d/src/components/Reviews/ReviewList/reviews.js

```
Let me check and fix the location button. I'll update the MapContainer to properly detect and zoom to your current location:

```javascript
// filepath: frontend/src/components/MapContainer.jsx
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useEffect, useState } from 'react';
import './MapContainer.css';

// Custom hook to handle map operations
function MapController({ userLocation, onLocationUpdate }) {
  const map = useMap();

  const handleLocateUser = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log('User location:', latitude, longitude);
          
          // Update state
          onLocationUpdate({ lat: latitude, lng: longitude });
          
          // Zoom to user location
          map.setView([latitude, longitude], 13);
          
          // Add a marker for current location
          L.marker([latitude, longitude], {
            icon: L.icon({
              iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              popupAnchor: [1, -34]
            })
          }).addTo
```


## License: unknown
https://github.com/samipevekar/corona-map/blob/d5beebdfbf9d9cfb51d2ea4595a276eb811dbab5/index.js

```
Let me check and fix the location button. I'll update the MapContainer to properly detect and zoom to your current location:

```javascript
// filepath: frontend/src/components/MapContainer.jsx
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useEffect, useState } from 'react';
import './MapContainer.css';

// Custom hook to handle map operations
function MapController({ userLocation, onLocationUpdate }) {
  const map = useMap();

  const handleLocateUser = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log('User location:', latitude, longitude);
          
          // Update state
          onLocationUpdate({ lat: latitude, lng: longitude });
          
          // Zoom to user location
          map.setView([latitude, longitude], 13);
          
          // Add a marker for current location
          L.marker([latitude, longitude], {
            icon: L.icon({
              iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              popupAnchor: [1,
```


## License: unknown
https://github.com/miteva-h/dreamescape-frontend/blob/d0a5e0478a7c44319f4d191ab6a3c6c9af3c218d/src/components/Reviews/ReviewList/reviews.js

```
Let me check and fix the location button. I'll update the MapContainer to properly detect and zoom to your current location:

```javascript
// filepath: frontend/src/components/MapContainer.jsx
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useEffect, useState } from 'react';
import './MapContainer.css';

// Custom hook to handle map operations
function MapController({ userLocation, onLocationUpdate }) {
  const map = useMap();

  const handleLocateUser = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log('User location:', latitude, longitude);
          
          // Update state
          onLocationUpdate({ lat: latitude, lng: longitude });
          
          // Zoom to user location
          map.setView([latitude, longitude], 13);
          
          // Add a marker for current location
          L.marker([latitude, longitude], {
            icon: L.icon({
              iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              popupAnchor: [1, -34]
            })
          }).addTo
```


## License: unknown
https://github.com/samipevekar/corona-map/blob/d5beebdfbf9d9cfb51d2ea4595a276eb811dbab5/index.js

```
Let me check and fix the location button. I'll update the MapContainer to properly detect and zoom to your current location:

```javascript
// filepath: frontend/src/components/MapContainer.jsx
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useEffect, useState } from 'react';
import './MapContainer.css';

// Custom hook to handle map operations
function MapController({ userLocation, onLocationUpdate }) {
  const map = useMap();

  const handleLocateUser = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log('User location:', latitude, longitude);
          
          // Update state
          onLocationUpdate({ lat: latitude, lng: longitude });
          
          // Zoom to user location
          map.setView([latitude, longitude], 13);
          
          // Add a marker for current location
          L.marker([latitude, longitude], {
            icon: L.icon({
              iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              popupAnchor: [1,
```


## License: unknown
https://github.com/miteva-h/dreamescape-frontend/blob/d0a5e0478a7c44319f4d191ab6a3c6c9af3c218d/src/components/Reviews/ReviewList/reviews.js

```
Let me check and fix the location button. I'll update the MapContainer to properly detect and zoom to your current location:

```javascript
// filepath: frontend/src/components/MapContainer.jsx
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useEffect, useState } from 'react';
import './MapContainer.css';

// Custom hook to handle map operations
function MapController({ userLocation, onLocationUpdate }) {
  const map = useMap();

  const handleLocateUser = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log('User location:', latitude, longitude);
          
          // Update state
          onLocationUpdate({ lat: latitude, lng: longitude });
          
          // Zoom to user location
          map.setView([latitude, longitude], 13);
          
          // Add a marker for current location
          L.marker([latitude, longitude], {
            icon: L.icon({
              iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              popupAnchor: [1, -34]
            })
          }).addTo
```


## License: unknown
https://github.com/samipevekar/corona-map/blob/d5beebdfbf9d9cfb51d2ea4595a276eb811dbab5/index.js

```
Let me check and fix the location button. I'll update the MapContainer to properly detect and zoom to your current location:

```javascript
// filepath: frontend/src/components/MapContainer.jsx
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useEffect, useState } from 'react';
import './MapContainer.css';

// Custom hook to handle map operations
function MapController({ userLocation, onLocationUpdate }) {
  const map = useMap();

  const handleLocateUser = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log('User location:', latitude, longitude);
          
          // Update state
          onLocationUpdate({ lat: latitude, lng: longitude });
          
          // Zoom to user location
          map.setView([latitude, longitude], 13);
          
          // Add a marker for current location
          L.marker([latitude, longitude], {
            icon: L.icon({
              iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              popupAnchor: [1,
```


## License: unknown
https://github.com/miteva-h/dreamescape-frontend/blob/d0a5e0478a7c44319f4d191ab6a3c6c9af3c218d/src/components/Reviews/ReviewList/reviews.js

```
Let me check and fix the location button. I'll update the MapContainer to properly detect and zoom to your current location:

```javascript
// filepath: frontend/src/components/MapContainer.jsx
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useEffect, useState } from 'react';
import './MapContainer.css';

// Custom hook to handle map operations
function MapController({ userLocation, onLocationUpdate }) {
  const map = useMap();

  const handleLocateUser = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log('User location:', latitude, longitude);
          
          // Update state
          onLocationUpdate({ lat: latitude, lng: longitude });
          
          // Zoom to user location
          map.setView([latitude, longitude], 13);
          
          // Add a marker for current location
          L.marker([latitude, longitude], {
            icon: L.icon({
              iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              popupAnchor: [1, -34]
            })
          }).addTo
```


## License: unknown
https://github.com/miteva-h/dreamescape-frontend/blob/d0a5e0478a7c44319f4d191ab6a3c6c9af3c218d/src/components/Reviews/ReviewList/reviews.js

```
Let me check and fix the location button. I'll update the MapContainer to properly detect and zoom to your current location:

```javascript
// filepath: frontend/src/components/MapContainer.jsx
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useEffect, useState } from 'react';
import './MapContainer.css';

// Custom hook to handle map operations
function MapController({ userLocation, onLocationUpdate }) {
  const map = useMap();

  const handleLocateUser = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log('User location:', latitude, longitude);
          
          // Update state
          onLocationUpdate({ lat: latitude, lng: longitude });
          
          // Zoom to user location
          map.setView([latitude, longitude], 13);
          
          // Add a marker for current location
          L.marker([latitude, longitude], {
            icon: L.icon({
              iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              popupAnchor: [1, -34]
            })
          }).addTo
```


## License: unknown
https://github.com/samipevekar/corona-map/blob/d5beebdfbf9d9cfb51d2ea4595a276eb811dbab5/index.js

```
Let me check and fix the location button. I'll update the MapContainer to properly detect and zoom to your current location:

```javascript
// filepath: frontend/src/components/MapContainer.jsx
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useEffect, useState } from 'react';
import './MapContainer.css';

// Custom hook to handle map operations
function MapController({ userLocation, onLocationUpdate }) {
  const map = useMap();

  const handleLocateUser = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log('User location:', latitude, longitude);
          
          // Update state
          onLocationUpdate({ lat: latitude, lng: longitude });
          
          // Zoom to user location
          map.setView([latitude, longitude], 13);
          
          // Add a marker for current location
          L.marker([latitude, longitude], {
            icon: L.icon({
              iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              popupAnchor: [1, -34]
            })
          }).addTo
```

