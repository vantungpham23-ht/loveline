import React, { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

const LocationMap = () => {
  const [position, setPosition] = useState([21.0285, 105.8542]) // Default to Hanoi
  const [userLocation, setUserLocation] = useState(null)
  
  useEffect(() => {
    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setUserLocation([latitude, longitude])
          setPosition([latitude, longitude])
        },
        (error) => {
          console.log('Error getting location:', error)
        }
      )
    }
  }, [])
  
  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Vị trí hiện tại
      </h3>
      
      <div className="h-64 rounded-lg overflow-hidden">
        <MapContainer
          center={position}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {userLocation && (
            <Marker position={userLocation}>
              <Popup>
                <div className="text-center">
                  <div className="text-lg mb-2">📍</div>
                  <div className="font-medium">Vị trí của bạn</div>
                  <div className="text-sm text-gray-600">
                    {userLocation[0].toFixed(4)}, {userLocation[1].toFixed(4)}
                  </div>
                </div>
              </Popup>
            </Marker>
          )}
        </MapContainer>
      </div>
      
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          Chia sẻ vị trí để cùng nhau tạo kỷ niệm tại những nơi đặc biệt
        </p>
      </div>
    </div>
  )
}

export default LocationMap
