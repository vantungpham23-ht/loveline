import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAppStore } from '../store/appStore'

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAppStore()
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  
  return children
}

export default ProtectedRoute
