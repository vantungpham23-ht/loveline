import React, { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAppStore } from './store/appStore'

// Pages
import LoginPage from './pages/LoginPage'
import HomePage from './pages/HomePage'
import PairingPage from './pages/PairingPage'
import AlbumsPage from './pages/AlbumsPage'
import AlbumDetailPage from './pages/AlbumDetailPage'
import MapPage from './pages/MapPage'
import SettingsPage from './pages/SettingsPage'

// Components
import ProtectedRoute from './components/ProtectedRoute'
import CoupleCheckRoute from './components/CoupleCheckRoute'

function App() {
  const { initialize, loading } = useAppStore()
  
  useEffect(() => {
    initialize()
  }, [])
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="App">
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* Protected Routes */}
        <Route path="/" element={
          <ProtectedRoute>
            <CoupleCheckRoute>
              <HomePage />
            </CoupleCheckRoute>
          </ProtectedRoute>
        } />
        
        <Route path="/pairing" element={
          <ProtectedRoute>
            <PairingPage />
          </ProtectedRoute>
        } />
        
        <Route path="/albums" element={
          <ProtectedRoute>
            <AlbumsPage />
          </ProtectedRoute>
        } />
        
            <Route path="/albums/:id" element={
              <ProtectedRoute>
                <AlbumDetailPage />
              </ProtectedRoute>
            } />

            <Route path="/map" element={
              <ProtectedRoute>
                <MapPage />
              </ProtectedRoute>
            } />

            <Route path="/settings" element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            } />
        
        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

export default App
