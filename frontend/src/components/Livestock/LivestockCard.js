'use client'
import { useState } from 'react'

export default function LivestockCard({ animal, onViewDetails, onDelete }) {
  const [confirmDelete, setConfirmDelete] = useState(false)

  const getStatusColor = () => {
    switch (animal.status) {
      case 'Active':
        return 'bg-green-100 text-green-800'
      case 'Solid':
        return 'bg-yellow-100 text-yellow-800'
      case 'Deceased':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getAnimalIcon = () => {
    switch (animal.type.toLowerCase()) {
      case 'cow':
        return '🐄'
      case 'chicken':
        return '🐔'
      case 'goat':
        return '🐐'
      case 'sheep':
        return '🐑'
      case 'pig':
        return '🐖'
      default:
        return '🐾'
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            <span className="text-3xl mr-3">{getAnimalIcon()}</span>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{animal.name}</h3>
              <p className="text-sm text-gray-500">{animal.type}{animal.breed ? ` • ${animal.breed}` : ''}</p>
            </div>
          </div>
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor()}`}>
            {animal.status}
          </span>
        </div>

        <div className="mt-4 space-y-2">
          {animal.age && (
            <div className="flex items-center text-sm text-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Age: {animal.age} years
            </div>
          )}
          {animal.weight && (
            <div className="flex items-center text-sm text-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
              </svg>
              Weight: {animal.weight} kg
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end space-x-2">
          <button
            onClick={onViewDetails}
            className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Details
          </button>
          {confirmDelete ? (
            <button
              onClick={() => {
                onDelete()
                setConfirmDelete(false)
              }}
              className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Confirm
            </button>
          ) : (
            <button
              onClick={() => setConfirmDelete(true)}
              className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Delete
            </button>
          )}
          {confirmDelete && (
            <button
              onClick={() => setConfirmDelete(false)}
              className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  )
}