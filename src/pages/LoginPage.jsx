import React, { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { useAppStore } from '../store/appStore'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  
  const { signIn, isAuthenticated, loading, error } = useAppStore()
  
  useEffect(() => {
    // This effect doesn't need to return anything
    // The redirect is handled in the render method below
  }, [isAuthenticated])
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    await signIn(formData.email, formData.password)
  }
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }
  
  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }
  
  return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50 flex items-center justify-center p-4 relative">
          <div className="w-full max-w-md space-y-8 animate-fade-in relative z-10">
            {/* Logo Section */}
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-pink-500 to-rose-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg animate-bounce-gentle glow float">
                <span className="text-white text-3xl font-bold">💕</span>
              </div>
              <h1 className="text-4xl font-bold gradient-text mb-2">
                Loveline
              </h1>
              <p className="text-gray-600 text-lg">
                Cùng nhau tạo kỷ niệm đẹp
              </p>
            </div>
        
        {/* Login Card */}
        <Card className="backdrop-blur-sm bg-white/90 shadow-xl border-0">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-semibold text-gray-900">
              Đăng nhập
            </CardTitle>
            <p className="text-gray-600 mt-2">
              Nhập thông tin tài khoản để tiếp tục
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm animate-slide-up">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Email
                </label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Nhập email của bạn"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Mật khẩu
                </label>
                <Input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Nhập mật khẩu"
                  required
                />
              </div>
              
              <Button
                type="submit"
                className="w-full h-12 text-lg font-semibold"
                loading={loading}
                disabled={loading}
              >
                Đăng nhập
              </Button>
            </form>
            
            <div className="text-center pt-4 border-t border-gray-100">
              <p className="text-gray-500 text-sm">
                Chưa có tài khoản? Liên hệ quản trị viên để được cấp tài khoản.
              </p>
            </div>
          </CardContent>
        </Card>
        
        {/* Footer */}
        <div className="text-center text-gray-500 text-sm">
          <p>Bằng cách tiếp tục, bạn đồng ý với</p>
          <p>
            <span className="text-pink-600 hover:text-pink-700 cursor-pointer">Điều khoản sử dụng</span>
            {' '}và{' '}
            <span className="text-pink-600 hover:text-pink-700 cursor-pointer">Chính sách bảo mật</span>
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage