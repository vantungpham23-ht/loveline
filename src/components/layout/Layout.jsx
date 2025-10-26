import React from 'react'
import FloatingHearts from '../FloatingHearts'

const Layout = ({ children, className = '' }) => {
  return (
    <div className={`min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50 relative ${className}`}>
      {/* Floating Hearts Background */}
      <FloatingHearts />
      
      {/* Mobile Layout */}
      <div className="md:hidden relative z-10">
        <div className="w-full bg-white/90 backdrop-blur-sm min-h-screen">
          {children}
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:block relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm min-h-screen shadow-xl">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Layout
