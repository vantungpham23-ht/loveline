import React, { useState, useEffect } from 'react'
import { useAppStore } from '../store/appStore'
import Layout from '../components/layout/Layout'
import Navbar from '../components/layout/Navbar'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import AvatarUpload from '../components/AvatarUpload'
import { supabase } from '../lib/supabaseClient'

const SettingsPage = () => {
  const [isEditing, setIsEditing] = useState(false)
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  // States for start date feature
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('00:00')
  const [dateLoading, setDateLoading] = useState(false)
  
  const { profile, user, couple, signOut, fetchProfile, setCouple } = useAppStore()
  
  React.useEffect(() => {
    if (profile?.username) {
      setUsername(profile.username)
    }
  }, [profile])
  
  // Sync selectedDate and selectedTime with couple data
  useEffect(() => {
    if (couple?.start_date) {
      const startDateObj = new Date(couple.start_date)
      
      // Format date from TIMESTAMPTZ to YYYY-MM-DD
      const formattedDate = startDateObj.toISOString().split('T')[0]
      setSelectedDate(formattedDate)
      
      // Format time to HH:MM
      const formattedTime = startDateObj.toTimeString().split(' ')[0].substring(0, 5)
      setSelectedTime(formattedTime)
    }
  }, [couple])
  
  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    
    try {
      setLoading(true)
      setError('')
      setSuccess('')
      
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ username })
        .eq('id', user.id)
      
      if (updateError) throw updateError
      
      setSuccess('Cập nhật thành công!')
      setIsEditing(false)
      
      // Refresh profile
      await fetchProfile()
      
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }
  
  const handleSignOut = async () => {
    await signOut()
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      setDateLoading(true)
      
      // Combine date and time into ISO string
      const dateTimeString = `${selectedDate}T${selectedTime}:00.000Z`
      
      const { data, error } = await supabase
        .from('couples')
        .update({ start_date: dateTimeString })
        .eq('id', couple.id)
        .select()
        .single()
      
      if (error) {
        console.error('Error updating start date:', error)
        throw error
      }
      
      if (data) {
        setCouple(data)
        alert('Đã cập nhật ngày và giờ kỷ niệm!')
      }
      
    } catch (error) {
      console.error('Error:', error)
      alert('Có lỗi xảy ra khi cập nhật ngày kỷ niệm')
    } finally {
      setDateLoading(false)
    }
  }
  
  const handleAvatarUpdate = async (newAvatarUrl) => {
    // Refresh profile data
    await fetchProfile()
  }
  
  return (
    <Layout>
      <Navbar />
      
      <div className="pt-20 p-6 space-y-8 animate-fade-in">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold gradient-text mb-2 animate-fade-in">
            Cài đặt
          </h1>
          <p className="text-gray-600 animate-slide-up">
            Quản lý thông tin cá nhân và cài đặt ứng dụng
          </p>
        </div>
        
        {/* Avatar Section */}
        <Card className="border-0 shadow-lg bg-gradient-to-r from-pink-50 to-rose-50">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl font-semibold text-gray-900">
              Ảnh đại diện
            </CardTitle>
            <p className="text-gray-600 text-sm">
              Thay đổi ảnh đại diện của bạn
            </p>
          </CardHeader>
          <CardContent className="flex justify-center">
            <AvatarUpload
              userId={profile?.id}
              currentAvatar={profile?.avatar_url}
              onAvatarUpdate={handleAvatarUpdate}
              size="xlarge"
            />
          </CardContent>
        </Card>
        
        {/* Profile Settings */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-900 flex items-center">
              <span className="text-2xl mr-3">👤</span>
              Thông tin cá nhân
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
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
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <Input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="bg-gray-50"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Email không thể thay đổi
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tên người dùng
                </label>
                {isEditing ? (
                  <form onSubmit={handleUpdateProfile} className="space-y-4">
                    <Input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Nhập tên người dùng"
                      required
                    />
                    <div className="flex space-x-3">
                      <Button
                        type="submit"
                        loading={loading}
                        className="flex-1"
                      >
                        Lưu thay đổi
                      </Button>
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => {
                          setIsEditing(false)
                          setUsername(profile?.username || '')
                          setError('')
                          setSuccess('')
                        }}
                        className="flex-1"
                      >
                        Hủy
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <span className="text-gray-900 font-medium">{profile?.username || 'Chưa có'}</span>
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(true)}
                      size="sm"
                    >
                      Chỉnh sửa
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Start Date Settings */}
        {couple && (
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-900 flex items-center">
                <span className="text-2xl mr-3">💕</span>
                Ngày và giờ bắt đầu yêu
              </CardTitle>
              <p className="text-gray-600 text-sm">
                Cài đặt thời gian chính xác để tính toán thời gian yêu nhau
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="start-date" className="block text-sm font-medium text-gray-700 mb-2">
                      Ngày bắt đầu yêu
                    </label>
                    <Input
                      type="date"
                      id="start-date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="start-time" className="block text-sm font-medium text-gray-700 mb-2">
                      Giờ bắt đầu yêu
                    </label>
                    <Input
                      type="time"
                      id="start-time"
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <p className="text-blue-700 text-sm">
                    💡 <strong>Lưu ý:</strong> Thời gian này sẽ được sử dụng để tính toán chính xác thời gian yêu nhau trong LoveCounter.
                  </p>
                </div>
                
                <Button
                  type="submit"
                  loading={dateLoading}
                  disabled={dateLoading}
                  className="w-full h-12"
                >
                  {dateLoading ? 'Đang cập nhật...' : 'Lưu thay đổi'}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
        
        {/* Account Actions */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-900 flex items-center">
              <span className="text-2xl mr-3">⚙️</span>
              Tài khoản
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button
                variant="outline"
                onClick={handleSignOut}
                className="w-full h-12 justify-center text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
              >
                <span className="mr-2">🚪</span>
                Đăng xuất
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* App Info */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-900 flex items-center">
              <span className="text-2xl mr-3">ℹ️</span>
              Thông tin ứng dụng
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                <span className="font-medium text-gray-700">Phiên bản</span>
                <span className="text-gray-600">1.0.0</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                <span className="font-medium text-gray-700">Được phát triển bởi</span>
                <span className="text-gray-600">Loveline Team</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* About */}
        <Card className="border-0 shadow-lg bg-gradient-to-r from-pink-50 to-rose-50 text-center">
          <CardContent className="p-8">
            <div className="w-20 h-20 bg-gradient-to-r from-pink-500 to-rose-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <span className="text-white text-3xl font-bold">💕</span>
            </div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent mb-4">
              Loveline
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Ứng dụng dành cho các cặp đôi để cùng nhau tạo và lưu giữ những kỷ niệm đẹp. 
              Chia sẻ khoảnh khắc, tạo album ảnh và theo dõi hành trình yêu thương của bạn.
            </p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}

export default SettingsPage