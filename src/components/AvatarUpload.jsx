import React, { useState, useRef } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAppStore } from '../store/appStore'
import { Button } from './ui/Button'
import { Card, CardContent } from './ui/Card'

const AvatarUpload = ({ userId, currentAvatar, onAvatarUpdate, size = 'large' }) => {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState(null)
  const fileInputRef = useRef(null)
  const { setError } = useAppStore()

  const sizeClasses = {
    small: 'w-16 h-16',
    medium: 'w-20 h-20', 
    large: 'w-24 h-24',
    xlarge: 'w-32 h-32'
  }

  const handleFileSelect = (event) => {
    const file = event.target.files[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Vui lòng chọn file ảnh hợp lệ')
        return
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Kích thước file không được vượt quá 5MB')
        return
      }

      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreview(e.target.result)
      }
      reader.readAsDataURL(file)

      // Upload file
      uploadAvatar(file)
    }
  }

  const uploadAvatar = async (file) => {
    try {
      setUploading(true)
      setError(null)

      // Create unique filename
      const fileExt = file.name.split('.').pop()
      const fileName = `${userId}-${Date.now()}.${fileExt}`
      const filePath = `avatars/${fileName}`

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) throw uploadError

      // Get public URL
      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)

      // Update profile with new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: data.publicUrl })
        .eq('id', userId)

      if (updateError) throw updateError

      // Call callback to update parent component
      if (onAvatarUpdate) {
        onAvatarUpdate(data.publicUrl)
      }

      setPreview(null)
      
    } catch (error) {
      console.error('Error uploading avatar:', error)
      setError(error.message || 'Có lỗi xảy ra khi upload ảnh')
    } finally {
      setUploading(false)
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const displayAvatar = preview || currentAvatar

  return (
    <div className="flex flex-col items-center space-y-3">
      {/* Avatar Display */}
      <div className={`${sizeClasses[size]} relative group cursor-pointer`}>
        <div className={`${sizeClasses[size]} rounded-full overflow-hidden border-4 border-white shadow-lg bg-gradient-to-r from-pink-500 to-rose-500 flex items-center justify-center`}>
          {displayAvatar ? (
            <img
              src={displayAvatar}
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-white text-2xl font-bold">
              {userId?.charAt(0)?.toUpperCase() || '?'}
            </span>
          )}
        </div>
        
        {/* Upload Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <span className="text-white text-sm font-medium">📷</span>
        </div>
      </div>

      {/* Upload Button */}
      <Button
        onClick={handleClick}
        disabled={uploading}
        loading={uploading}
        variant="secondary"
        size="sm"
        className="px-4"
      >
        {uploading ? 'Đang upload...' : 'Thay đổi ảnh'}
      </Button>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  )
}

export default AvatarUpload
