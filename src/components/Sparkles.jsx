import React from 'react'

const Sparkles = ({ count = 5, className = '' }) => {
  const sparkles = Array.from({ length: count }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    top: Math.random() * 100,
    delay: Math.random() * 2,
    size: Math.random() * 3 + 2
  }))

  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`}>
      {sparkles.map((sparkle) => (
        <div
          key={sparkle.id}
          className="sparkle"
          style={{
            left: `${sparkle.left}%`,
            top: `${sparkle.top}%`,
            animationDelay: `${sparkle.delay}s`,
            width: `${sparkle.size}px`,
            height: `${sparkle.size}px`
          }}
        />
      ))}
    </div>
  )
}

export default Sparkles
