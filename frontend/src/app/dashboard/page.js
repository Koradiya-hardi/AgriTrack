'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import StatsCard from '../dashboard/StatsCard'

export default function Dashboard() {
  const [stats, setStats] = useState({
    crops: 0,
    livestock: 0,
    expenses: 0,
    recentActivities: []
  })
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Check if user is logged in
        const user = JSON.parse(localStorage.getItem('user'))
        if (!user) {
          router.push('/auth/login')
          return
        }

        // Fetch all data in parallel
        const [cropsRes, livestockRes, expensesRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/crops`, { credentials: 'include' }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/livestock`, { credentials: 'include' }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/expenses`, { credentials: 'include' })
        ])

        const crops = await cropsRes.json()
        const livestock = await livestockRes.json()
        const expenses = await expensesRes.json()

        setStats({
          crops: crops.length || 0,
          livestock: livestock.length || 0,
          expenses: expenses.reduce((sum, exp) => sum + exp.amount, 0) || 0,
          recentActivities: [
            ...(crops || []).slice(0, 3).map(crop => ({
              type: 'crop',
              name: crop.name,
              date: crop.plantingDate,
              status: crop.status
            })),
            ...(livestock || []).slice(0, 3).map(animal => ({
              type: 'livestock',
              name: animal.name,
              date: new Date(),
              status: animal.status
            }))
          ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5)
        })
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [router])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div>Loading dashboard...</div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatsCard 
          title="Total Crops" 
          value={stats.crops} 
          icon="🌱"
          link="/crops"
        />
        <StatsCard 
          title="Livestock Count" 
          value={stats.livestock} 
          icon="🐄"
          link="/livestock"
        />
        <StatsCard 
          title="Total Expenses" 
          value={`$${stats.expenses.toFixed(2)}`} 
          icon="💰"
          link="/expenses"
        />
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Activities</h2>
        <div className="space-y-4">
          {stats.recentActivities.length > 0 ? (
            stats.recentActivities.map((activity, index) => (
              <div key={index} className="flex items-center p-3 border-b border-gray-100">
                <div className="mr-4 text-2xl">
                  {activity.type === 'crop' ? '🌱' : '🐄'}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{activity.name}</p>
                  <p className="text-sm text-gray-500">
                    {activity.type} • {new Date(activity.date).toLocaleDateString()}
                  </p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  activity.status === 'Active' || activity.status === 'Planted' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {activity.status}
                </span>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No recent activities</p>
          )}
        </div>
      </div>
    </div>
  )
}