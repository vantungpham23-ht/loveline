import React, { useState, useEffect } from 'react'
import { Card, CardContent } from './ui/Card'

const LoveCounter = ({ startDate }) => {
  const [timeDiff, setTimeDiff] = useState({})

  useEffect(() => {
    const interval = setInterval(() => {
      // Lấy thời gian hiện tại theo múi giờ Việt Nam
      const now = new Date()
      const vietnamTime = new Date(now.toLocaleString("en-US", {timeZone: "Asia/Ho_Chi_Minh"}))
      
      // Tạo ngày bắt đầu theo múi giờ Việt Nam với giờ cụ thể
      const startDateObj = new Date(startDate)
      const startDateVietnam = new Date(startDateObj.toLocaleString("en-US", {timeZone: "Asia/Ho_Chi_Minh"}))
      
      // Tính chênh lệch thời gian từ thời điểm cụ thể
      const diffTime = vietnamTime - startDateVietnam
      
      // Tính toán ngày, giờ, phút, giây
      const days = Math.floor(diffTime / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diffTime % (1000 * 60)) / 1000)
      
      setTimeDiff({
        days: Math.max(0, days),
        hours: Math.max(0, hours),
        minutes: Math.max(0, minutes),
        seconds: Math.max(0, seconds)
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [startDate])

  return (
    <Card className="bg-gradient-to-br from-pink-500 via-rose-500 to-pink-600 border-0 shadow-2xl overflow-hidden glow float">
      <CardContent className="p-6 text-center relative z-10 space-y-4">
        {/* Title */}
        <h3 className="text-xl font-bold text-white animate-fade-in">
          Thời gian yêu nhau
        </h3>

        {/* Love Counter Display */}
        <div className="flex justify-center items-center space-x-2 md:space-x-4">
          <div className="flex flex-col items-center bg-white/20 backdrop-blur-sm rounded-xl p-3 md:p-4 min-w-[60px] md:min-w-[80px] hover:bg-white/30 transition-all duration-300 hover:scale-105 glow">
            <div className="text-2xl md:text-3xl font-bold text-white animate-slide-up">
              {timeDiff.days || 0}
            </div>
            <div className="text-xs font-medium text-white/90 uppercase tracking-wider">
              Ngày
            </div>
          </div>
          <span className="text-2xl md:text-3xl font-bold text-white pulse-slow">:</span>
          <div className="flex flex-col items-center bg-white/20 backdrop-blur-sm rounded-xl p-3 md:p-4 min-w-[60px] md:min-w-[80px] hover:bg-white/30 transition-all duration-300 hover:scale-105 glow">
            <div className="text-2xl md:text-3xl font-bold text-white animate-slide-up">
              {String(timeDiff.hours || 0).padStart(2, '0')}
            </div>
            <div className="text-xs font-medium text-white/90 uppercase tracking-wider">
              Giờ
            </div>
          </div>
          <span className="text-2xl md:text-3xl font-bold text-white pulse-slow">:</span>
          <div className="flex flex-col items-center bg-white/20 backdrop-blur-sm rounded-xl p-3 md:p-4 min-w-[60px] md:min-w-[80px] hover:bg-white/30 transition-all duration-300 hover:scale-105 glow">
            <div className="text-2xl md:text-3xl font-bold text-white animate-slide-up">
              {String(timeDiff.minutes || 0).padStart(2, '0')}
            </div>
            <div className="text-xs font-medium text-white/90 uppercase tracking-wider">
              Phút
            </div>
          </div>
          <span className="text-2xl md:text-3xl font-bold text-white pulse-slow">:</span>
          <div className="flex flex-col items-center bg-white/20 backdrop-blur-sm rounded-xl p-3 md:p-4 min-w-[60px] md:min-w-[80px] hover:bg-white/30 transition-all duration-300 hover:scale-105 glow">
            <div className="text-2xl md:text-3xl font-bold text-white animate-slide-up">
              {String(timeDiff.seconds || 0).padStart(2, '0')}
            </div>
            <div className="text-xs font-medium text-white/90 uppercase tracking-wider">
              Giây
            </div>
          </div>
        </div>

        {/* From Date */}
        <div className="text-sm text-white/80 font-medium mt-4 animate-fade-in">
          Từ {new Date(startDate).toLocaleDateString('vi-VN', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </div>
      </CardContent>
    </Card>
  )
}

export default LoveCounter