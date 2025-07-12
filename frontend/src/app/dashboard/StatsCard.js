import Link from 'next/link'

export default function StatsCard({ title, value, icon, link }) {
  return (
    <Link href={link}>
      <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow cursor-pointer">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500">{title}</p>
            <p className="text-2xl font-bold mt-2">{value}</p>
          </div>
          <span className="text-3xl">{icon}</span>
        </div>
      </div>
    </Link>
  )
}