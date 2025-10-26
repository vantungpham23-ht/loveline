import React, { useState, useEffect } from 'react'
import { useAppStore } from '../store/appStore'
import Layout from '../components/layout/Layout'
import Navbar from '../components/layout/Navbar'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import AlbumTimelineItem from '../components/AlbumTimelineItem'
import { supabase } from '../lib/supabaseClient'

const AlbumsPage = () => {
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newAlbum, setNewAlbum] = useState({
    title: '',
    description: '',
    created_date: new Date().toISOString().split('T')[0] // Default to today
  })
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  const { couple, albums, fetchAlbums, setAlbums } = useAppStore()
  
  useEffect(() => {
    const fetchAlbumsWithCount = async () => {
      if (couple?.id) {
        const { data, error } = await supabase
          .from('albums')
          .select(`
            *,
            photos_count:photos(count)
          `)
          .eq('couple_id', couple.id)
          .order('created_at', { ascending: false })
        
        if (!error && data) {
          // Transform the data to include photos_count as a number
          const albumsWithCount = data.map(album => ({
            ...album,
            photos_count: album.photos_count?.[0]?.count || 0
          }))
          setAlbums(albumsWithCount)
        }
      }
    }
    
    fetchAlbumsWithCount()
  }, [couple])
  
  const handleCreateAlbum = async (e) => {
    e.preventDefault()
    
    if (!couple) return
    
    try {
      setIsCreating(true)
      setError('')
      setSuccess('')
      
      // Combine date and time into ISO string
      const dateTimeString = `${newAlbum.created_date}T00:00:00.000Z`
      
      const { data, error } = await supabase
        .from('albums')
        .insert({
          couple_id: couple.id,
          title: newAlbum.title,
          description: newAlbum.description,
          created_at: dateTimeString
        })
        .select(`
          *,
          photos_count:photos(count)
        `)
        .single()
      
      if (error) throw error
      
      // Transform the data to include photos_count as a number
      const albumWithCount = {
        ...data,
        photos_count: data.photos_count?.[0]?.count || 0
      }
      
      // Add to local state
      setAlbums([albumWithCount, ...albums])
      
      // Reset form
      setNewAlbum({ 
        title: '', 
        description: '', 
        created_date: new Date().toISOString().split('T')[0] 
      })
      setShowCreateForm(false)
      setSuccess('Album đã được tạo thành công!')
      
    } catch (error) {
      console.error('Error creating album:', error)
      setError(error.message || 'Có lỗi xảy ra khi tạo album')
    } finally {
      setIsCreating(false)
    }
  }
  
  if (!couple) {
    return (
      <Layout>
        <Navbar />
        <div className="pt-20 p-6">
          <Card className="border-0 shadow-lg bg-gradient-to-r from-pink-50 to-rose-50 text-center">
            <CardContent className="p-12">
              <div className="text-8xl mb-6 animate-bounce-gentle">💕</div>
              <CardTitle className="text-2xl font-bold text-gray-900 mb-4">
                Chưa có người yêu
              </CardTitle>
              <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                Hãy ghép đôi trước khi tạo album để lưu giữ những kỷ niệm đẹp!
              </p>
              <Button 
                onClick={() => window.location.href = '/pairing'}
                size="lg"
                className="px-8"
              >
                <span className="mr-2">💕</span>
                Ghép đôi ngay
              </Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    )
  }
  
  return (
    <Layout>
      <Navbar />
      
      <div className="pt-20 p-6 space-y-8 animate-fade-in">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold gradient-text mb-2 animate-fade-in">
            Album ảnh
          </h1>
          <p className="text-gray-600 animate-slide-up">
            Tạo và quản lý album ảnh của hai bạn
          </p>
        </div>
        
        {/* Create Album Button */}
        <div className="flex justify-center">
          <Button
            onClick={() => setShowCreateForm(true)}
            size="lg"
            className="px-8 h-14 text-lg font-semibold shadow-lg hover:shadow-xl"
          >
            <span className="mr-3 text-xl">📸</span>
            Tạo album mới
          </Button>
        </div>
        
        {/* Create Album Form */}
        {showCreateForm && (
          <Card className="border-0 shadow-xl bg-gradient-to-r from-pink-50 to-rose-50">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl font-semibold text-gray-900 flex items-center justify-center">
                <span className="text-3xl mr-3">✨</span>
                Tạo album mới
              </CardTitle>
              <p className="text-gray-600">
                Tạo album để lưu giữ những khoảnh khắc đẹp
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateAlbum} className="space-y-6">
                {/* Error/Success Messages */}
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm animate-slide-up">
                    {error}
                  </div>
                )}
                
                {success && (
                  <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm animate-slide-up">
                    {success}
                  </div>
                )}
                
                {/* Album Title */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Tên album
                  </label>
                  <Input
                    type="text"
                    value={newAlbum.title}
                    onChange={(e) => setNewAlbum({ ...newAlbum, title: e.target.value })}
                    placeholder="Nhập tên album (ví dụ: Kỷ niệm ngày cưới)"
                    required
                  />
                </div>
                
                {/* Album Description */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Mô tả
                  </label>
                  <textarea
                    value={newAlbum.description}
                    onChange={(e) => setNewAlbum({ ...newAlbum, description: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 resize-none"
                    rows={4}
                    placeholder="Mô tả về album này (tùy chọn)"
                  />
                </div>
                
                {/* Album Date */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Ngày tạo album
                  </label>
                  <Input
                    type="date"
                    value={newAlbum.created_date}
                    onChange={(e) => setNewAlbum({ ...newAlbum, created_date: e.target.value })}
                    required
                  />
                  <p className="text-xs text-gray-500">
                    💡 Chọn ngày mà album này được tạo để sắp xếp timeline chính xác
                  </p>
                </div>
                
                {/* Action Buttons */}
                <div className="flex space-x-4">
                  <Button
                    type="submit"
                    loading={isCreating}
                    className="flex-1 h-12"
                  >
                    {isCreating ? 'Đang tạo...' : 'Tạo album'}
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      setShowCreateForm(false)
                      setNewAlbum({ 
                        title: '', 
                        description: '', 
                        created_date: new Date().toISOString().split('T')[0] 
                      })
                      setError('')
                      setSuccess('')
                    }}
                    className="flex-1 h-12"
                  >
                    Hủy
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
        
        {/* Albums List */}
        {albums.length === 0 ? (
          <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm text-center">
            <CardContent className="p-12">
              <div className="text-8xl mb-6 animate-bounce-gentle">📸</div>
              <CardTitle className="text-2xl font-bold text-gray-900 mb-4">
                Chưa có album nào
              </CardTitle>
              <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                Tạo album đầu tiên để lưu giữ những kỷ niệm đẹp của hai bạn!
              </p>
              <Button 
                onClick={() => setShowCreateForm(true)}
                size="lg"
                className="px-8"
              >
                <span className="mr-2">✨</span>
                Tạo album đầu tiên
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Albums Count */}
            <div className="text-center">
              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-pink-100 to-rose-100 rounded-full">
                <span className="text-pink-600 font-semibold">
                  {albums.length} album{albums.length > 1 ? 's' : ''}
                </span>
              </div>
            </div>
            
            {/* Albums Timeline */}
            <div className="space-y-4">
              {albums.map((album, index) => (
                <div
                  key={album.id}
                  className="animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <AlbumTimelineItem album={album} index={index} />
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Quick Stats */}
        {albums.length > 0 && (
          <Card className="border-0 shadow-lg bg-gradient-to-r from-pink-50 to-rose-50">
            <CardContent className="p-6">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-white/50 rounded-xl p-4">
                  <div className="text-2xl font-bold text-pink-600 mb-1">
                    {albums.length}
                  </div>
                  <div className="text-sm text-gray-600">
                    Album đã tạo
                  </div>
                </div>
                <div className="bg-white/50 rounded-xl p-4">
                  <div className="text-2xl font-bold text-rose-600 mb-1">
                    {albums.reduce((total, album) => total + (album.photos_count || 0), 0)}
                  </div>
                  <div className="text-sm text-gray-600">
                    Ảnh đã lưu
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  )
}

export default AlbumsPage