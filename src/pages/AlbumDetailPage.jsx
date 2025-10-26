import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAppStore } from '../store/appStore'
import Layout from '../components/layout/Layout'
import Navbar from '../components/layout/Navbar'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { supabase } from '../lib/supabaseClient'

const AlbumDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [album, setAlbum] = useState(null)
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(true)
  const [showUploadForm, setShowUploadForm] = useState(false)
  const [uploading, setUploading] = useState(false)
  
  const { couple } = useAppStore()
  
  useEffect(() => {
    fetchAlbumDetails()
  }, [id])
  
  const fetchAlbumDetails = async () => {
    try {
      setLoading(true)
      
      // Fetch album
      const { data: albumData, error: albumError } = await supabase
        .from('albums')
        .select('*')
        .eq('id', id)
        .single()
      
      if (albumError) throw albumError
      setAlbum(albumData)
      
      // Fetch photos
      const { data: photosData, error: photosError } = await supabase
        .from('photos')
        .select(`
          *,
          uploader:profiles!photos_uploader_id_fkey(username, avatar_url)
        `)
        .eq('album_id', id)
        .order('created_at', { ascending: false })
      
      if (photosError) throw photosError
      setPhotos(photosData || [])
      
    } catch (error) {
      console.error('Error fetching album details:', error)
    } finally {
      setLoading(false)
    }
  }
  
  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    
    try {
      setUploading(true)
      
      // Upload to Supabase Storage
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}.${fileExt}`
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('photos')
        .upload(fileName, file)
      
      if (uploadError) throw uploadError
      
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('photos')
        .getPublicUrl(fileName)
      
      // Save photo record
      const { data: photoData, error: photoError } = await supabase
        .from('photos')
        .insert({
          album_id: id,
          uploader_id: couple.user_a_id, // Assuming current user is user_a
          image_url: publicUrl,
          caption: ''
        })
        .select(`
          *,
          uploader:profiles!photos_uploader_id_fkey(username, avatar_url)
        `)
        .single()
      
      if (photoError) throw photoError
      
      // Add to local state
      setPhotos([photoData, ...photos])
      
      // Update album cover if it's the first photo
      if (photos.length === 0) {
        const { error: updateError } = await supabase
          .from('albums')
          .update({ cover_photo_url: publicUrl })
          .eq('id', id)
        
        if (!updateError) {
          setAlbum({ ...album, cover_photo_url: publicUrl })
        }
      }
      
    } catch (error) {
      console.error('Error uploading photo:', error)
    } finally {
      setUploading(false)
    }
  }
  
  if (loading) {
    return (
      <Layout>
        <Navbar />
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </Layout>
    )
  }
  
  if (!album) {
    return (
      <Layout>
        <Navbar />
        <div className="p-4">
          <Card className="text-center">
            <div className="text-6xl mb-4">❌</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Không tìm thấy album
            </h3>
            <Button onClick={() => navigate('/albums')}>
              Quay lại
            </Button>
          </Card>
        </div>
      </Layout>
    )
  }
  
  return (
    <Layout>
      <Navbar />
      
      <div className="pt-20 p-6 space-y-4 animate-fade-in">
        {/* Album Header */}
        <Card className="border-0 shadow-lg bg-gradient-to-r from-pink-50 to-rose-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/albums')}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 hover:bg-white/50 transition-all duration-200"
              >
                <span className="text-xl">←</span>
                <span className="font-medium">Quay lại</span>
              </Button>
            </div>
            
            <div className="text-center space-y-3">
              <h1 className="text-3xl font-bold gradient-text">
                {album.title}
              </h1>
              {album.description && (
                <p className="text-gray-600 text-lg">
                  {album.description}
                </p>
              )}
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                <span className="text-pink-400">📅</span>
                <span>Tạo ngày {new Date(album.created_at).toLocaleDateString('vi-VN')}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Upload Section */}
        <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-bold text-gray-900 text-center">
              Thêm ảnh mới
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 hover:border-pink-400 hover:bg-pink-50/50 transition-all duration-300 group">
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
                id="photo-upload"
                disabled={uploading}
              />
              <label
                htmlFor="photo-upload"
                className="cursor-pointer flex flex-col items-center space-y-3"
              >
                {uploading ? (
                  <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <div className="text-6xl group-hover:scale-110 transition-transform duration-300">
                    📸
                  </div>
                )}
                <span className="text-gray-600 font-medium">
                  {uploading ? 'Đang tải lên...' : 'Chọn ảnh để tải lên'}
                </span>
                <p className="text-sm text-gray-500 text-center">
                  Hỗ trợ JPG, PNG, GIF (tối đa 5MB)
                </p>
              </label>
            </div>
          </CardContent>
        </Card>
        
        {/* Photos Grid */}
        {photos.length === 0 ? (
          <Card className="text-center border-0 shadow-lg bg-white/90 backdrop-blur-sm">
            <CardContent className="p-12">
              <div className="text-8xl mb-6 animate-bounce-gentle">📸</div>
              <CardTitle className="text-2xl font-bold text-gray-900 mb-4">
                Chưa có ảnh nào
              </CardTitle>
              <p className="text-gray-600 text-lg leading-relaxed">
                Thêm ảnh đầu tiên vào album này để lưu giữ những khoảnh khắc đẹp!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Ảnh trong album
              </h3>
              <div className="w-16 h-1 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full mx-auto"></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {photos.map((photo, index) => (
                <Card key={photo.id} className="p-0 overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] card-hover glow">
                  <img
                    src={photo.image_url}
                    alt={photo.caption || 'Ảnh'}
                    className="w-full h-48 object-cover"
                  />
                  <CardContent className="p-3">
                    {photo.caption && (
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                        {photo.caption}
                      </p>
                    )}
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span className="font-medium">{photo.uploader?.username}</span>
                      <span>{new Date(photo.created_at).toLocaleDateString('vi-VN')}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}

export default AlbumDetailPage
