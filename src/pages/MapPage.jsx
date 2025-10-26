import React, { useEffect, useState } from 'react'
import { useAppStore } from '../store/appStore'
import { supabase } from '../lib/supabaseClient'
import Layout from '../components/layout/Layout'
import Navbar from '../components/layout/Navbar'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

// Custom marker for User A
const userAIcon = L.divIcon({
  className: 'custom-marker',
  html: '<div style="background: linear-gradient(135deg, #ec4899, #db2777); width: 40px; height: 40px; border-radius: 50%; border: 3px solid white; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"><span style="color: white; font-size: 18px;">📍</span></div>',
  iconSize: [40, 40],
  iconAnchor: [20, 20],
})

// Custom marker for User B
const userBIcon = L.divIcon({
  className: 'custom-marker',
  html: '<div style="background: linear-gradient(135deg, #f472b6, #ec4899); width: 40px; height: 40px; border-radius: 50%; border: 3px solid white; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"><span style="color: white; font-size: 18px;">💕</span></div>',
  iconSize: [40, 40],
  iconAnchor: [20, 20],
})

// Component to update map view when location changes
function ChangeView({ center, zoom }) {
  const map = useMap()
  map.setView(center, zoom)
  return null
}

const MapPage = () => {
  const [position, setPosition] = useState([21.0285, 105.8542]) // Default to Hanoi
  const [zoom, setZoom] = useState(13)
  const [userALocation, setUserALocation] = useState(null)
  const [userBLocation, setUserBLocation] = useState(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [viewingPartner, setViewingPartner] = useState(false)
  const [error, setError] = useState(null)
  
  const { couple, profile, partner } = useAppStore()
  
  // Determine if current user is A or B
  const isUserA = couple && profile && couple.user_a_id === profile.id
  
  // Get my location (current user)
  const myLocation = isUserA ? userALocation : userBLocation
  // Get partner location
  const partnerLocation = isUserA ? userBLocation : userALocation
  
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      setUpdating(true)
      setError(null)
      
      const successCallback = async (position) => {
        const { latitude, longitude } = position.coords
        const location = [latitude, longitude]
        
        // Set location based on current user
        if (isUserA) {
          setUserALocation(location)
        } else {
          setUserBLocation(location)
        }
        
        // Save location to database for partner to see
        try {
          await supabase
            .from('user_locations')
            .upsert({
              user_id: profile.id,
              latitude: latitude,
              longitude: longitude,
              updated_at: new Date().toISOString()
            })
        } catch (error) {
          console.error('Error saving location:', error)
        }
        
        // Update map center to current user's location
        setPosition(location)
        setZoom(15) // Zoom in when showing user's location
        setViewingPartner(false) // Reset to viewing own location
        setLoading(false)
        setUpdating(false)
      }
      
      const errorCallback = (error) => {
        // Silently handle error without logging repeatedly
        if (error.code === 1) {
          setError('Vui lòng cho phép truy cập vị trí trong cài đặt trình duyệt để xem vị trí của bạn.')
        } else if (error.code === 2) {
          setError('Không thể xác định vị trí của bạn.')
        } else if (error.code === 3) {
          setError('Đã quá thời gian lấy vị trí.')
        } else {
          setError('Không thể lấy vị trí hiện tại.')
        }
        
        setLoading(false)
        setUpdating(false)
      }
      
      navigator.geolocation.getCurrentPosition(
        successCallback,
        errorCallback,
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // Cache for 5 minutes to reduce API calls
        }
      )
    } else {
      setError('Trình duyệt không hỗ trợ định vị.')
      setLoading(false)
    }
  }
  
  const viewPartnerLocation = () => {
    if (partnerLocation) {
      setPosition(partnerLocation)
      setZoom(13)
      setViewingPartner(true)
    }
  }
  
  const viewMyLocation = () => {
    if (myLocation) {
      setPosition(myLocation)
      setZoom(15)
      setViewingPartner(false)
    }
  }
  
  // Fetch partner location from database
  const fetchPartnerLocation = async () => {
    if (!couple || !partner) return
    
    const { data, error } = await supabase
      .from('user_locations')
      .select('latitude, longitude')
      .eq('user_id', partner.id)
      .single()
    
    if (!error && data) {
      const location = [data.latitude, data.longitude]
      if (isUserA) {
        setUserBLocation(location)
      } else {
        setUserALocation(location)
      }
    }
  }
  
  useEffect(() => {
    // Get user's current location on mount
    getCurrentLocation()
    
    // Fetch partner location
    if (couple && partner) {
      fetchPartnerLocation()
      
      // Subscribe to partner location updates
      const channel = supabase
        .channel('partner_location_changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'user_locations',
            filter: `user_id=eq.${partner.id}`
          },
          (payload) => {
            if (payload.new) {
              const location = [payload.new.latitude, payload.new.longitude]
              if (isUserA) {
                setUserBLocation(location)
              } else {
                setUserALocation(location)
              }
            }
          }
        )
        .subscribe()
      
      return () => {
        supabase.removeChannel(channel)
      }
    }
    
    // Fallback: set loading to false after 2 seconds even if geolocation is slow
    const fallbackTimer = setTimeout(() => {
      setLoading(false)
      setUpdating(false)
    }, 2000)
    
    return () => clearTimeout(fallbackTimer)
  }, [couple, partner])
  
  if (loading && !position) {
    return (
      <Layout>
        <Navbar />
        <div className="pt-20 p-6 flex items-center justify-center min-h-[calc(100vh-5rem)]">
          <Card className="text-center border-0 shadow-lg bg-white/90 backdrop-blur-sm p-8">
            <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <CardTitle className="text-xl font-bold text-gray-900 mb-2">
              Đang tải bản đồ...
            </CardTitle>
            <p className="text-gray-600">
              Đang lấy vị trí hiện tại của bạn
            </p>
          </Card>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <Navbar />
      
      <div className="pt-20 p-6 space-y-4 animate-fade-in">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold gradient-text animate-fade-in">
            Bản đồ định vị
          </h1>
          <p className="text-gray-600 text-lg animate-slide-up">
            Chia sẻ vị trí và tạo kỷ niệm tại những nơi đặc biệt
          </p>
        </div>

        {/* Map Card */}
        <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0">
              <CardTitle className="text-xl font-bold text-gray-900 text-center md:text-left">
                Vị trí hiện tại
              </CardTitle>
              {/* Mobile: Full width buttons */}
              <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
                <Button
                  onClick={getCurrentLocation}
                  disabled={updating}
                  loading={updating}
                  size="sm"
                  variant="secondary"
                  className="w-full md:w-auto"
                >
                  {updating ? 'Đang cập nhật...' : '🔄 Cập nhật'}
                </Button>
                {myLocation && (
                  <Button
                    onClick={viewMyLocation}
                    size="sm"
                    variant={!viewingPartner ? "primary" : "ghost"}
                    className="w-full md:w-auto"
                  >
                    👤 Vị trí tôi
                  </Button>
                )}
                {partnerLocation && (
                  <Button
                    onClick={viewPartnerLocation}
                    size="sm"
                    variant={viewingPartner ? "primary" : "ghost"}
                    className="w-full md:w-auto"
                  >
                    💕 Vị trí người yêu
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            {error && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-4">
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">⚠️</span>
                  <div className="flex-1">
                    <p className="text-yellow-800 text-sm font-medium mb-1">
                      {error}
                    </p>
                    <p className="text-yellow-700 text-xs">
                      Bản đồ hiển thị vị trí mặc định: Hà Nội
                    </p>
                  </div>
                </div>
              </div>
            )}
            
              <div className="h-80 rounded-xl overflow-hidden border-2 border-pink-200 shadow-lg">
                <MapContainer
                  center={position}
                  zoom={zoom}
                  style={{ height: '100%', width: '100%' }}
                  className="z-0"
                  scrollWheelZoom={true}
                >
                  {/* Beautiful romantic map style - CartoDB Voyager */}
                  <TileLayer
                    attribution='&copy; <a href="https://www.carto.com/">CARTO</a> contributors'
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                    subdomains="abcd"
                    maxZoom={20}
                    className="romantic-map"
                  />
                  <ChangeView center={position} zoom={zoom} />
                
                {userALocation && (
                  <Marker position={userALocation} icon={userAIcon}>
                    <Popup>
                      <div className="text-center p-2">
                        <div className="font-bold text-pink-600 text-lg mb-1">{profile?.username || 'User A'}</div>
                        <div className="text-xs text-gray-500">
                          {userALocation[0].toFixed(4)}, {userALocation[1].toFixed(4)}
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                )}
                {userBLocation && (
                  <Marker position={userBLocation} icon={userBIcon}>
                    <Popup>
                      <div className="text-center p-2">
                        <div className="font-bold text-rose-600 text-lg mb-1">{partner?.username || 'User B'}</div>
                        <div className="text-xs text-gray-500">
                          {userBLocation[0].toFixed(4)}, {userBLocation[1].toFixed(4)}
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                )}
              </MapContainer>
            </div>
            
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                {error 
                  ? 'Bản đồ hiển thị vị trí mặc định (Hà Nội). Cho phép truy cập vị trí để xem vị trí của bạn.'
                  : 'Chia sẻ vị trí để cùng nhau tạo kỷ niệm tại những nơi đặc biệt'
                }
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Couple Info */}
        {couple && (
          <Card className="border-0 shadow-lg bg-gradient-to-r from-pink-50 to-rose-50">
            <CardContent className="p-6 text-center">
              <div className="space-y-4">
                <div className="text-4xl animate-bounce-gentle pulse-slow">💕</div>
                <h3 className="text-xl font-bold gradient-text">
                  {profile?.username} & {partner?.username}
                </h3>
                <p className="text-gray-600">
                  Cùng nhau khám phá những địa điểm mới và tạo kỷ niệm đẹp
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Features */}
        <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-bold text-gray-900 text-center">
              Tính năng bản đồ
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="text-center p-4 bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl">
                <div className="text-3xl mb-2">📍</div>
                <h4 className="font-semibold text-gray-900 mb-1">Định vị chính xác</h4>
                <p className="text-sm text-gray-600">Lấy vị trí hiện tại với độ chính xác cao</p>
              </div>
              <div className="text-center p-4 bg-gradient-to-r from-rose-50 to-pink-50 rounded-xl">
                <div className="text-3xl mb-2">🗺️</div>
                <h4 className="font-semibold text-gray-900 mb-1">Bản đồ tương tác</h4>
                <p className="text-sm text-gray-600">Zoom, pan và khám phá các địa điểm</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}

export default MapPage
