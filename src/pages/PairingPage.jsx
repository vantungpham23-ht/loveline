import React, { useState } from 'react'
import { useAppStore } from '../store/appStore'
import Layout from '../components/layout/Layout'
import Navbar from '../components/layout/Navbar'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { supabase } from '../lib/supabaseClient'

const PairingPage = () => {
  const [inviteCode, setInviteCode] = useState('')
  const [isCreatingInvite, setIsCreatingInvite] = useState(false)
  const [isJoiningInvite, setIsJoiningInvite] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  const { profile, fetchCouple } = useAppStore()
  
  const generateInviteCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase()
  }
  
  const handleCreateInvite = async () => {
    try {
      setIsCreatingInvite(true)
      setError('')
      setSuccess('')
      
      if (!profile || !profile.id) {
        throw new Error('Vui lòng đăng nhập để tạo mã mời')
      }
      
      const code = generateInviteCode()
      
      const { error: inviteError } = await supabase
        .from('invites')
        .insert({
          inviter_id: profile.id,
          invite_code: code,
          status: 'pending'
        })
      
      if (inviteError) throw inviteError
      
      setSuccess(`Mã mời của bạn: ${code}`)
    } catch (error) {
      setError(error.message)
    } finally {
      setIsCreatingInvite(false)
    }
  }
  
  const handleJoinInvite = async () => {
    try {
      setIsJoiningInvite(true)
      setError('')
      setSuccess('')
      
      if (!profile || !profile.id) {
        throw new Error('Vui lòng đăng nhập để ghép đôi')
      }
      
      // Find the invite
      const { data: invite, error: inviteError } = await supabase
        .from('invites')
        .select('*')
        .eq('invite_code', inviteCode.toUpperCase())
        .eq('status', 'pending')
        .single()
      
      if (inviteError || !invite) {
        throw new Error('Mã mời không hợp lệ hoặc đã hết hạn')
      }
      
      // Create couple - handle RLS policy
      const { error: coupleError } = await supabase
        .from('couples')
        .insert({
          user_a_id: invite.inviter_id,
          user_b_id: profile.id,
          start_date: new Date().toISOString()
        })
      
      if (coupleError) {
        console.error('Couple creation error:', coupleError)
        
        // If RLS policy error, provide helpful message
        if (coupleError.message.includes('row-level security policy')) {
          throw new Error('Lỗi bảo mật: Vui lòng liên hệ admin để cấu hình quyền truy cập.')
        }
        
        throw coupleError
      }
      
      // Update invite status
      const { error: updateError } = await supabase
        .from('invites')
        .update({ status: 'accepted' })
        .eq('id', invite.id)
      
      if (updateError) throw updateError
      
      setSuccess('Ghép đôi thành công! 🎉')
      
      // Refresh couple data
      setTimeout(() => {
        fetchCouple()
      }, 1000)
      
    } catch (error) {
      setError(error.message)
    } finally {
      setIsJoiningInvite(false)
    }
  }
  
  return (
    <Layout>
      <Navbar />
      
      <div className="p-4 space-y-6">
        <Card>
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">💕</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Ghép đôi
            </h2>
            <p className="text-gray-600">
              Tạo mã mời hoặc nhập mã để ghép đôi với người thương
            </p>
          </div>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}
          
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
              {success}
            </div>
          )}
          
          <div className="space-y-4">
            {/* Create Invite */}
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Tạo mã mời
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Tạo mã mời để người thương có thể ghép đôi với bạn
              </p>
              <Button
                onClick={handleCreateInvite}
                loading={isCreatingInvite}
                className="w-full"
              >
                Tạo mã mời
              </Button>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Hoặc</span>
              </div>
            </div>
            
            {/* Join Invite */}
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Nhập mã mời
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Nhập mã mời từ người thương để ghép đôi
              </p>
              
              <div className="space-y-3">
                <input
                  type="text"
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                  placeholder="Nhập mã mời"
                  className="input-field text-center text-lg font-mono tracking-widest"
                  maxLength={6}
                />
                <Button
                  onClick={handleJoinInvite}
                  loading={isJoiningInvite}
                  disabled={inviteCode.length !== 6}
                  className="w-full"
                >
                  Ghép đôi
                </Button>
              </div>
            </div>
          </div>
        </Card>
        
        {/* Instructions */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Hướng dẫn
          </h3>
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex items-start space-x-3">
              <span className="text-primary-500 font-bold">1.</span>
              <span>Một người tạo mã mời và chia sẻ với người kia</span>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-primary-500 font-bold">2.</span>
              <span>Người còn lại nhập mã mời để ghép đôi</span>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-primary-500 font-bold">3.</span>
              <span>Cùng nhau tạo những kỷ niệm đẹp!</span>
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  )
}

export default PairingPage
