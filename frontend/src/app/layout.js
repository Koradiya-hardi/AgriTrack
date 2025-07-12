'use client'
import { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Navbar from '../components/Navbar'
import './globals.css'

export default function RootLayout({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Check if user data exists in localStorage
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    } else if (!pathname.startsWith('/auth')) {
      router.push('/auth/login')
    }
    setLoading(false)
  }, [pathname, router])

  if (loading) {
    return (
      <html lang="en">
        <body className="flex items-center justify-center min-h-screen">
          <div>Loading...</div>
        </body>
      </html>
    )
  }

  return (
    <html lang="en">
      <body>
        {!pathname.startsWith('/auth') && <Navbar user={user} />}
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
      </body>
    </html>
  )
}