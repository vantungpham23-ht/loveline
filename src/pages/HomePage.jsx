import React, { useEffect, useState } from 'react'
import { useAppStore } from '../store/appStore'
import { supabase } from '../lib/supabaseClient'
import Layout from '../components/layout/Layout'
import Navbar from '../components/layout/Navbar'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import LoveCounter from '../components/LoveCounter'
import AlbumTimelineItem from '../components/AlbumTimelineItem'
import FloatingHeartsOverlay from '../components/FloatingHeartsOverlay'
import { Link } from 'react-router-dom'

const HomePage = () => {
  const { 
    user, 
    profile, 
    couple, 
    partner, 
    fetchCouple, 
    fetchAlbums,
    loading 
  } = useAppStore()
  
  const [partnerProfile, setPartnerProfile] = useState(null)
  const [albums, setAlbums] = useState([])
  
  useEffect(() => {
    fetchCouple()
  }, [])
  
  useEffect(() => {
    const fetchPartnerProfile = async () => {
      if (couple && profile) {
        const { user_a_id, user_b_id } = couple
        const partnerId = user_a_id === profile.id ? user_b_id : user_a_id
        
        const { data, error } = await supabase
          .from('profiles')
          .select('id, username, avatar_url')
          .eq('id', partnerId)
          .single()
        
        if (!error && data) {
          setPartnerProfile(data)
        }
      }
    }
    
    fetchPartnerProfile()
  }, [couple, profile])
  
  useEffect(() => {
    const fetchAlbums = async () => {
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
    
    fetchAlbums()
  }, [couple])
  
  useEffect(() => {
    if (!couple?.id) return
    
    const channel = supabase
      .channel('albums_realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'albums',
          filter: `couple_id=eq.${couple.id}`
        },
        async (payload) => {
          // Fetch the new album with photos_count
          const { data, error } = await supabase
            .from('albums')
            .select(`
              *,
              photos_count:photos(count)
            `)
            .eq('id', payload.new.id)
            .single()
          
          if (!error && data) {
            const albumWithCount = {
              ...data,
              photos_count: data.photos_count?.[0]?.count || 0
            }
            setAlbums((prevAlbums) => [albumWithCount, ...prevAlbums])
          }
        }
      )
      .subscribe()
    
    return () => {
      supabase.removeChannel(channel)
    }
  }, [couple?.id])
  
  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </Layout>
    )
  }
  
  return (
    <Layout>
      <Navbar />
      
      <div className="pt-20 p-6 space-y-4 animate-fade-in">
            {/* Welcome Section */}
            <Card className="bg-gradient-to-r from-pink-50 to-rose-50 border-0 shadow-lg float">
              <FloatingHeartsOverlay count={8} className="opacity-25" />
              <CardContent className="p-6 text-center relative z-10">
                {partnerProfile ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-center space-x-4">
                      <div className="w-16 h-16 rounded-full overflow-hidden border-3 border-white shadow-lg bg-gradient-to-r from-pink-500 to-rose-500 flex items-center justify-center glow hover:scale-110 transition-transform duration-300">
                        {profile?.avatar_url ? (
                          <img
                            src={profile.avatar_url}
                            alt="Avatar"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-white text-xl font-bold">
                            {profile?.username?.charAt(0)?.toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div className="text-3xl animate-bounce-gentle pulse-slow">💕</div>
                      <div className="w-16 h-16 rounded-full overflow-hidden border-3 border-white shadow-lg bg-gradient-to-r from-rose-500 to-pink-500 flex items-center justify-center glow hover:scale-110 transition-transform duration-300">
                        {partnerProfile.avatar_url ? (
                          <img
                            src={partnerProfile.avatar_url}
                            alt="Partner Avatar"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-white text-xl font-bold">
                            {partnerProfile.username?.charAt(0)?.toUpperCase()}
                          </span>
                        )}
                      </div>
                    </div>
                    <h2 className="text-xl font-bold gradient-text">
                      {profile?.username} & {partnerProfile.username}
                    </h2>
                    <p className="text-gray-600 text-sm">
                      Cùng nhau tạo những kỷ niệm đẹp
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="text-5xl animate-bounce-gentle pulse-slow">💕</div>
                    <h2 className="text-xl font-bold gradient-text">
                      Chào mừng đến với Loveline!
                    </h2>
                    <p className="text-gray-600 text-sm">
                      {couple ? 'Đang tải thông tin...' : 'Hãy ghép đôi để bắt đầu!'}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
        
        {/* Love Counter */}
        {couple && (
          <LoveCounter startDate={couple.start_date} />
        )}
        
        {/* Albums Timeline */}
        {couple && (
          <>
            {!loading && albums.length === 0 ? (
              <Card className="text-center border-0 shadow-lg bg-white/90 backdrop-blur-sm">
                <CardContent className="p-12">
                  <div className="text-8xl mb-6 animate-bounce-gentle">📸</div>
                  <CardTitle className="text-2xl font-bold text-gray-900 mb-4">
                    Chưa có kỷ niệm nào
                  </CardTitle>
                  <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                    Hãy tạo album đầu tiên để lưu giữ những khoảnh khắc đẹp của hai bạn!
                  </p>
                  <Link to="/albums">
                    <Button size="lg" className="px-8">
                      Tạo Album đầu tiên
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              albums.length > 0 && (
                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      Kỷ niệm của chúng ta
                    </h3>
                    <div className="w-16 h-1 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full mx-auto"></div>
                  </div>
                      <div className="relative">
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
              )
            )}
          </>
        )}
        
        {/* Quick Actions */}
        <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-bold text-gray-900 text-center">
              Thao tác nhanh
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="grid grid-cols-2 gap-2">
              <Link to="/albums">
                <Button 
                  variant="secondary" 
                  className="w-full h-16 flex flex-col items-center justify-center space-y-1 hover:scale-105 transition-transform duration-200"
                >
                  <span className="text-xl">📸</span>
                  <span className="font-semibold text-sm">Album</span>
                </Button>
              </Link>
              
              {!couple ? (
                <Link to="/pairing">
                  <Button 
                    className="w-full h-16 flex flex-col items-center justify-center space-y-1 hover:scale-105 transition-transform duration-200"
                  >
                    <span className="text-xl">💕</span>
                    <span className="font-semibold text-sm">Ghép đôi</span>
                  </Button>
                </Link>
              ) : (
                <Link to="/albums">
                  <Button 
                    className="w-full h-16 flex flex-col items-center justify-center space-y-1 hover:scale-105 transition-transform duration-200"
                  >
                    <span className="text-xl">➕</span>
                    <span className="font-semibold text-sm">Tạo album</span>
                  </Button>
                </Link>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}

export default HomePage
