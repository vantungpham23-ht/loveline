import React from 'react'
import { cn } from '../../lib/utils'

const Button = React.forwardRef(({
  className,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  children,
  ...props
}, ref) => {
  const variants = {
    primary: "bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white shadow-lg hover:shadow-xl glow hover:scale-105 shimmer",
    secondary: "bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-200 hover:scale-105 hover:shadow-lg",
    ghost: "hover:bg-pink-50 text-pink-600 hover:text-pink-700 hover:scale-105",
    outline: "border-2 border-pink-200 text-pink-600 hover:bg-pink-50 hover:border-pink-300 hover:scale-105 hover:shadow-lg"
  }

  const sizes = {
    sm: "h-9 px-3 text-sm",
    md: "h-11 px-6 text-base",
    lg: "h-12 px-8 text-lg"
  }

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-xl font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group",
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || loading}
      ref={ref}
      {...props}
    >
      {loading ? (
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          <span>Loading...</span>
        </div>
      ) : (
        <>
          <span className="relative z-10">{children}</span>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
        </>
      )}
    </button>
  )
})

Button.displayName = "Button"

export { Button }