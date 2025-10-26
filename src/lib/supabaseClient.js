import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://hszmtodzutnzpqpjhuxg.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhzem10b2R6dXRuenBxcGpodXhnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEzNzQ2MjUsImV4cCI6MjA3Njk1MDYyNX0.8taC5uxUh1b122KDjWMQtyPWi3-ujBpKBmB9SZas2m4'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database schema types
export const DB_TABLES = {
  PROFILES: 'profiles',
  COUPLES: 'couples',
  INVITES: 'invites',
  ALBUMS: 'albums',
  PHOTOS: 'photos'
}

// Storage bucket
export const STORAGE_BUCKET = 'photos'
