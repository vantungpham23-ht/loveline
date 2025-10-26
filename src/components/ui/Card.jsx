import React from 'react'
import { cn } from '../../lib/utils'
import Sparkles from '../Sparkles'
import FloatingHeartsOverlay from '../FloatingHeartsOverlay'

const Card = React.forwardRef(({ className, children, showHearts = true, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "glass rounded-2xl border-0 shadow-xl hover:shadow-2xl transition-all duration-500 card-hover relative overflow-hidden group",
      className
    )}
    {...props}
  >
    {showHearts && <FloatingHeartsOverlay count={6} className="opacity-30" />}
    <Sparkles count={3} className="opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    {children}
  </div>
))
Card.displayName = "Card"

const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6 pb-4", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef(({ className, children, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight gradient-text",
      className
    )}
    {...props}
  >
    {children}
  </h3>
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }