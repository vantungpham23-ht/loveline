import { create } from 'zustand'
import { supabase } from '../lib/supabaseClient'

export const useAppStore = create((set, get) => ({
  // Auth state
  user: null,
  profile: null,
  isAuthenticated: false,
  
  // Couple state
  couple: null,
  partner: null,
  
  // Albums state
  albums: [],
  currentAlbum: null,
  
  // UI state
  loading: false,
  error: null,
  
  // Auth actions
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  
  setProfile: (profile) => set({ profile }),
  
  setCouple: (couple) => set({ couple }),
  
  setPartner: (partner) => set({ partner }),
  
  setAlbums: (albums) => set({ albums }),
  
  setCurrentAlbum: (album) => set({ currentAlbum: album }),
  
  setLoading: (loading) => set({ loading }),
  
  setError: (error) => set({ error }),
  
  // Auth methods
  signIn: async (email, password) => {
    try {
      set({ loading: true, error: null })
      console.log('signIn - Starting login process')
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (error) throw error
      
      console.log('signIn - Login successful, setting user')
      set({ user: data.user, isAuthenticated: true })
      
      // Fetch profile and couple data after successful login
      console.log('signIn - Fetching profile...')
      const profile = await get().fetchProfile()
      console.log('signIn - Profile fetched:', profile ? 'Success' : 'Failed')
      
      console.log('signIn - Fetching couple...')
      const couple = await get().fetchCouple()
      console.log('signIn - Couple fetched:', couple ? 'Success' : 'No couple found')
      
      set({ loading: false })
      return { success: true, user: data.user }
    } catch (error) {
      console.error('signIn - Error:', error)
      set({ error: error.message, loading: false })
      return { success: false, error: error.message }
    }
  },
  
  signUp: async (email, password, username) => {
    try {
      set({ loading: true, error: null })
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { username }
        }
      })
      
      if (error) throw error
      
      // Create profile
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            username: username
          })
        
        if (profileError) throw profileError
      }
      
      set({ user: data.user, isAuthenticated: true, loading: false })
      return { success: true, user: data.user }
    } catch (error) {
      set({ error: error.message, loading: false })
      return { success: false, error: error.message }
    }
  },
  
  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      
      set({ 
        user: null, 
        profile: null, 
        couple: null, 
        partner: null,
        albums: [],
        currentAlbum: null,
        isAuthenticated: false 
      })
      return { success: true }
    } catch (error) {
      set({ error: error.message })
      return { success: false, error: error.message }
    }
  },
  
  // Profile methods
  fetchProfile: async () => {
    try {
      const { user } = get()
      if (!user) {
        console.log('fetchProfile - No user found')
        return null
      }
      
      console.log('fetchProfile - Fetching profile for user:', user.id)
      
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('id, username, avatar_url')
        .eq('id', user.id)
        .single()
      
      if (error) {
        console.log('fetchProfile - Error:', error)
        // If profile doesn't exist, create a basic one
        if (error.code === 'PGRST116') {
          console.log('fetchProfile - Profile not found, creating new profile')
          const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .insert({
              id: user.id,
              username: user.email?.split('@')[0] || 'user'
            })
            .select()
            .single()
          
          if (createError) {
            console.error('fetchProfile - Error creating profile:', createError)
            throw createError
          }
          
          set({ profile: newProfile })
          return newProfile
        }
        throw error
      }
      
      console.log('fetchProfile - Profile found:', profile)
      set({ profile })
      return profile
    } catch (error) {
      console.error('fetchProfile - Error:', error)
      set({ error: error.message })
    }
  },
  
  // Couple methods
  fetchCouple: async () => {
    try {
      const { profile } = get()
      if (!profile) {
        console.log('fetchCouple - No profile found')
        set({ couple: null, partner: null })
        return null
      }
      
      console.log('fetchCouple - Fetching couple for profile:', profile.id)
      
      const { data: couple, error } = await supabase
        .from('couples')
        .select(`
          *,
          user_a:profiles!couples_user_a_id_fkey(*),
          user_b:profiles!couples_user_b_id_fkey(*)
        `)
        .or(`user_a_id.eq.${profile.id},user_b_id.eq.${profile.id}`)
        .single()
      
      if (error && error.code !== 'PGRST116') {
        console.error('fetchCouple - Error:', error)
        throw error
      }
      
      if (couple) {
        console.log('fetchCouple - Couple found:', couple.id)
        set({ couple })
        // Set partner
        const partner = couple.user_a_id === profile.id ? couple.user_b : couple.user_a
        set({ partner })
      } else {
        console.log('fetchCouple - No couple found')
        // Explicitly set to null if no couple found
        set({ couple: null, partner: null })
      }
      
      return couple
    } catch (error) {
      console.error('fetchCouple - Error:', error)
      set({ error: error.message, couple: null, partner: null })
    }
  },
  
  // Albums methods
  fetchAlbums: async () => {
    try {
      const { couple } = get()
      if (!couple) return
      
      const { data: albums, error } = await supabase
        .from('albums')
        .select(`
          *,
          photos_count:photos(count)
        `)
        .eq('couple_id', couple.id)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      
      // Transform the data to include photos_count as a number
      const albumsWithCount = albums.map(album => ({
        ...album,
        photos_count: album.photos_count?.[0]?.count || 0
      }))
      
      set({ albums: albumsWithCount })
      return albumsWithCount
    } catch (error) {
      set({ error: error.message })
    }
  },
  
  // Initialize app
  initialize: async () => {
    try {
      set({ loading: true })
      
      // Check for existing session
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session?.user) {
        set({ user: session.user, isAuthenticated: true })
        await get().fetchProfile()
        await get().fetchCouple()
        await get().fetchAlbums()
      }
      
      set({ loading: false })
    } catch (error) {
      set({ error: error.message, loading: false })
    }
  }
}))
