import React, { useEffect, useState } from 'react'

const FloatingHearts = () => {
  const [hearts, setHearts] = useState([])

  useEffect(() => {
    const generateHearts = () => {
      const newHearts = []
      for (let i = 0; i < 15; i++) {
        newHearts.push({
          id: i,
          left: Math.random() * 100,
          delay: Math.random() * 15,
          size: Math.random() * 10 + 15,
          emoji: Math.random() > 0.5 ? '💕' : '💖'
        })
      }
      setHearts(newHearts)
    }

    generateHearts()
  }, [])

  return (
    <div className="floating-hearts">
      {hearts.map((heart) => (
        <div
          key={heart.id}
          className="floating-heart"
          style={{
            left: `${heart.left}%`,
            animationDelay: `${heart.delay}s`,
            fontSize: `${heart.size}px`,
            animationDuration: `${15 + Math.random() * 10}s`
          }}
        >
          {heart.emoji}
        </div>
      ))}
    </div>
  )
}

export default FloatingHearts
