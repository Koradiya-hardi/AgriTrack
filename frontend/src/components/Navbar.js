'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function Navbar({ user }) {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await fetch(`https://agritrack-2.onrender.com/auth/logout`, {
        method: 'POST',
        credentials: 'include'
      })
      // Clear user data
      localStorage.removeItem('user')
      router.push('/auth/login')
    } catch (err) {
      console.error('Logout failed:', err)
    }
  }

  return (
    <nav className="bg-green-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard" className="text-xl font-bold">AgriTrack</Link>
          {user && (
            <div className="hidden md:flex space-x-6">
              <Link href="/dashboard" className="hover:bg-green-700 px-3 py-2 rounded-md">Dashboard</Link>
              <Link href="/crops" className="hover:bg-green-700 px-3 py-2 rounded-md">Crops</Link>
              <Link href="/livestock" className="hover:bg-green-700 px-3 py-2 rounded-md">Livestock</Link>
              <Link href="/expenses" className="hover:bg-green-700 px-3 py-2 rounded-md">Expenses</Link>
               <Link href="/product" className="hover:bg-green-700 px-3 py-2 rounded-md">Products</Link>
            </div>
          )}
        </div>

        {user ? (
          <div className="flex items-center space-x-4">
            <span className="hidden md:inline">Hi, {user.name}</span>
            <button 
              onClick={handleLogout}
              className="bg-green-700 hover:bg-green-800 px-3 py-2 rounded-md"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex space-x-4">
            <Link href="/auth/login" className="hover:bg-green-700 px-3 py-2 rounded-md">Login</Link>
            <Link href="/auth/signup" className="bg-green-700 hover:bg-green-800 px-3 py-2 rounded-md">Sign Up</Link>
          </div>
        )}
      </div>
    </nav>
  )
}