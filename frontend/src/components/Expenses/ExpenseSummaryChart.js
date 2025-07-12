'use client'
import { Pie } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

const getCategoryColor = (category) => {
  const colors = {
    feed: '#3b82f6',
    medicine: '#10b981',
    equipment: '#f59e0b',
    labor: '#8b5cf6',
    transport: '#ef4444',
    other: '#6b7280'
  }
  return colors[category] || '#6b7280'
}

export default function ExpenseSummaryChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">No expense data available</p>
      </div>
    )
  }

  const chartData = {
    labels: data.map(item => item._id.charAt(0).toUpperCase() + item._id.slice(1)),
    datasets: [
      {
        data: data.map(item => item.total),
        backgroundColor: data.map(item => getCategoryColor(item._id)),
        borderWidth: 1
      }
    ]
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          padding: 20,
          boxWidth: 12
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || ''
            const value = context.raw || 0
            const total = context.dataset.data.reduce((a, b) => a + b, 0)
            const percentage = Math.round((value / total) * 100)
            return `${label}: $${value.toFixed(2)} (${percentage}%)`
          }
        }
      }
    }
  }

  return <Pie data={chartData} options={options} />
}