import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAppStore } from '../../store/appStore'
import { cn } from '../../lib/utils'

const Navbar = () => {
  const location = useLocation()
  const { user, profile, signOut } = useAppStore()
  
  const navItems = [
    {
      path: '/',
      label: 'Trang chủ',
      icon: '🏠',
      activeIcon: '🏡'
    },
    {
      path: '/albums',
      label: 'Album',
      icon: '📸',
      activeIcon: '📷'
    },
    {
      path: '/map',
      label: 'Bản đồ',
      icon: '🗺️',
      activeIcon: '📍'
    },
    {
      path: '/settings',
      label: 'Cài đặt',
      icon: '⚙️',
      activeIcon: '🔧'
    }
  ]
  
  const handleSignOut = async () => {
    await signOut()
  }
  
  if (!user) return null
  
  return (
    <>
          {/* Mobile Top Navigation */}
          <nav className="glass border-b border-gray-100 sticky top-0 z-50 md:hidden">
            <div className="px-4 py-3">
              <div className="flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl flex items-center justify-center shadow-lg glow pulse-slow">
                    <span className="text-white text-sm font-bold">💕</span>
                  </div>
                  <h1 className="text-lg font-bold gradient-text">
                    Loveline
                  </h1>
                </div>
            
            {/* User Info */}
            <div className="flex items-center space-x-2">
              <div className="text-right">
                <div className="text-xs font-medium text-gray-900">
                  {profile?.username || user.email?.split('@')[0]}
                </div>
              </div>
              <button
                onClick={handleSignOut}
                className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                Đăng xuất
              </button>
            </div>
          </div>
          
          {/* Navigation Links */}
          <div className="flex items-center justify-around mt-3 pt-3 border-t border-gray-100">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex flex-col items-center justify-center py-2 px-3 rounded-xl transition-all duration-200 flex-1",
                    isActive 
                      ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg" 
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  )}
                >
                  <span className="text-lg mb-1">
                    {isActive ? item.activeIcon : item.icon}
                  </span>
                  <span className="text-xs font-medium">
                    {item.label}
                  </span>
                </Link>
              )
            })}
          </div>
        </div>
      </nav>
      
          {/* Desktop Top Navigation */}
          <nav className="hidden md:block glass border-b border-gray-100 sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-4 py-4">
              <div className="flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl flex items-center justify-center shadow-lg glow pulse-slow">
                    <span className="text-white text-lg font-bold">💕</span>
                  </div>
                  <h1 className="text-2xl font-bold gradient-text">
                    Loveline
                  </h1>
                </div>
            
            {/* Navigation Links */}
            <div className="flex items-center space-x-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      "flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200",
                      isActive 
                        ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg" 
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    )}
                  >
                    <span className="text-lg">
                      {isActive ? item.activeIcon : item.icon}
                    </span>
                    <span className="font-medium">{item.label}</span>
                  </Link>
                )
              })}
            </div>
            
            {/* User Info */}
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">
                  {profile?.username || user.email?.split('@')[0]}
                </div>
                <div className="text-xs text-gray-500">
                  {user.email}
                </div>
              </div>
              <button
                onClick={handleSignOut}
                className="text-sm text-gray-500 hover:text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      </nav>
    </>
  )
}

export default Navbar
