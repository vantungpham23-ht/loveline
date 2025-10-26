import React from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent } from './ui/Card'
import FloatingHeartsOverlay from './FloatingHeartsOverlay'
import { cn } from '../lib/utils'

const AlbumTimelineItem = ({ album, index }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('vi-VN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  // Determine if this item should be on the left or right
  const isLeft = index % 2 === 0

  return (
    <div className="relative flex items-start mb-6">
      {/* Timeline Line - Only show on desktop */}
      <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-gradient-to-b from-pink-300 to-rose-300"></div>
      
      {/* Timeline Dot - Only show on desktop */}
      <div className="hidden md:block absolute left-1/2 top-4 transform -translate-x-1/2 w-3 h-3 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full border-2 border-white shadow-lg z-10"></div>
      
      {/* Content */}
      <div className={cn(
        "w-full flex",
        isLeft ? "md:justify-start md:pr-8" : "md:justify-end md:pl-8"
      )}>
        <div className={cn(
          "w-full",
          "md:max-w-xs"
        )}>
          {/* Date Badge */}
          <div className={cn(
            "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white mb-2",
            "bg-gradient-to-r from-pink-500 to-rose-500 shadow-md"
          )}>
            <span className="mr-1">📅</span>
            {formatDate(album.created_at)}
          </div>
          
          {/* Album Card */}
          <Link to={`/albums/${album.id}`} className="block group">
            <Card className="hover:shadow-lg transition-all duration-500 hover:scale-[1.02] border-0 bg-white/95 backdrop-blur-sm overflow-hidden card-hover glow">
              <FloatingHeartsOverlay count={4} className="opacity-20" />
              <CardContent className="p-3">
                {/* Layout: Title/Description on left, Image on right */}
                <div className="flex items-start gap-3">
                  {/* Left side: Title and Description */}
                  <div className="flex-1 min-w-0">
                    {/* Title */}
                    <h3 className="text-sm md:text-base font-semibold text-gray-900 group-hover:text-pink-600 transition-colors duration-200 line-clamp-2 mb-1">
                      {album.title}
                    </h3>
                    
                    {/* Description */}
                    {album.description && (
                      <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed mb-2">
                        {album.description}
                      </p>
                    )}
                    
                    {/* Meta Info */}
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <div className="flex items-center space-x-1">
                        <span className="text-green-400">📷</span>
                        <span>{album.photos_count || 0} ảnh</span>
                      </div>
                      
                      <div className="flex items-center space-x-1 text-pink-500 group-hover:text-pink-600 transition-colors duration-200">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  
                  {/* Right side: Album Cover - Small Box */}
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden bg-gradient-to-br from-pink-100 to-rose-100 shadow-sm">
                      {album.cover_photo_url ? (
                        <img
                          src={album.cover_photo_url}
                          alt={album.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-2xl md:text-3xl">📸</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default AlbumTimelineItem