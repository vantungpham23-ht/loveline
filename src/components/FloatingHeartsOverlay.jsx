import React, { useEffect, useState } from 'react'

const FloatingHeartsOverlay = ({ count = 8, className = '' }) => {
  const [hearts, setHearts] = useState([])

  useEffect(() => {
    const generateHearts = () => {
      const newHearts = []
      for (let i = 0; i < count; i++) {
        newHearts.push({
          id: i,
          left: Math.random() * 100,
          top: Math.random() * 100,
          delay: Math.random() * 15,
          size: Math.random() * 8 + 12,
          emoji: Math.random() > 0.5 ? '💕' : '💖',
          opacity: Math.random() * 0.3 + 0.1 // 0.1 to 0.4 opacity
        })
      }
      setHearts(newHearts)
    }

    generateHearts()
  }, [count])

  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      {hearts.map((heart) => (
        <div
          key={heart.id}
          className="absolute animate-float"
          style={{
            left: `${heart.left}%`,
            top: `${heart.top}%`,
            animationDelay: `${heart.delay}s`,
            fontSize: `${heart.size}px`,
            opacity: heart.opacity,
            animationDuration: `${20 + Math.random() * 10}s`
          }}
        >
          {heart.emoji}
        </div>
      ))}
    </div>
  )
}

export default FloatingHeartsOverlay
