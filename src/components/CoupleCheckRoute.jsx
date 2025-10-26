import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAppStore } from '../store/appStore'

const CoupleCheckRoute = ({ children }) => {
  const { couple, loading, profile } = useAppStore()
  
  // Debug logging
  console.log('CoupleCheckRoute - Debug:', {
    loading,
    couple: couple ? 'Has couple' : 'No couple',
    profile: profile ? 'Has profile' : 'No profile',
    coupleId: couple?.id
  })
  
  // Nếu đang loading, hiển thị loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-white to-rose-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Đang kiểm tra...</p>
        </div>
      </div>
    )
  }
  
  // Nếu chưa có cặp đôi, điều hướng đến trang ghép đôi
  if (!couple) {
    console.log('CoupleCheckRoute - Redirecting to /pairing because no couple')
    return <Navigate to="/pairing" replace />
  }
  
  // Nếu đã có cặp đôi, hiển thị children (HomePage)
  console.log('CoupleCheckRoute - Showing HomePage because couple exists')
  return children
}

export default CoupleCheckRoute
