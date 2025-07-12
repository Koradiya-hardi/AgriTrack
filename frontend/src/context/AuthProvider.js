'use client'
import { createContext, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getCookie, deleteCookie } from 'cookies-next'
import api from '@/lib/api'

export const AuthContext = createContext()

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

   // Check auth state by attempting to decode the cookie
  const checkAuth = () => {
    // Since we can't read HTTP-only cookies, we'll:
    // 1. Assume authenticated if there's a user state
    // 2. Reset on page refresh (or implement localStorage for client-side persistence)
    setLoading(false)
  }

  useEffect(() => {
    checkAuth()
  }, [])

  
   const signup = async (name, email, password) => {
    try {
      const { data } = await api.post('/api/auth/signup', { name, email, password })
      setUser(data.user) // Set user from successful response
      router.push('/dashboard')
    } catch (error) {
      throw error.response?.data || { message: 'Signup failed' }
    }
  }

  const login = async (email, password) => {
    try {
      const { data } = await api.post('/api/auth/login', { email, password })
      setUser(data.user) // Set user from successful response
      router.push('/dashboard')
    } catch (error) {
      throw error.response?.data || { message: 'Login failed' }
    }
  }

   const logout = () => {
    // Since we can't clear HTTP-only cookies from frontend
    // we'll just reset the user state
    setUser(null)
    router.push('/auth/login')
  }


  return (
    <AuthContext.Provider value={{ 
     user, 
      loading, 
      login, 
      signup, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  )
}