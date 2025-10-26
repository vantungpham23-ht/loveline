import React, { useEffect, useState } from 'react'

const MapTest = () => {
  const [location, setLocation] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy
          })
          setLoading(false)
        },
        (error) => {
          setError(error.message)
          setLoading(false)
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000
        }
      )
    } else {
      setError('Trình duyệt không hỗ trợ định vị')
      setLoading(false)
    }
  }, [])

  if (loading) {
    return (
      <div className="p-4 text-center">
        <div className="w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
        <p>Đang lấy vị trí...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 text-center">
        <div className="text-red-500 mb-2">❌ Lỗi: {error}</div>
        <p className="text-sm text-gray-600">Không thể lấy vị trí hiện tại</p>
      </div>
    )
  }

  return (
    <div className="p-4 text-center">
      <div className="text-green-500 mb-2">✅ Thành công!</div>
      <div className="text-sm text-gray-600 mb-2">
        <strong>Vĩ độ:</strong> {location.lat.toFixed(6)}
      </div>
      <div className="text-sm text-gray-600 mb-2">
        <strong>Kinh độ:</strong> {location.lng.toFixed(6)}
      </div>
      <div className="text-sm text-gray-600">
        <strong>Độ chính xác:</strong> {location.accuracy.toFixed(0)}m
      </div>
    </div>
  )
}

export default MapTest
