'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import LivestockForm from '../../components/Livestock/LivestockForm'
import LivestockCard from '../../components/Livestock/LivestockCard'
import LivestockDetailModal from '../../components/Livestock/LivestockDetailModal'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function LivestockPage() {
  const [livestock, setLivestock] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [selectedLivestock, setSelectedLivestock] = useState(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetchLivestock()
  }, [])

  const fetchLivestock = async () => {
    try {
      setLoading(true)
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/livestock`, {
        credentials: 'include'
      })
      
      if (!res.ok) {
        throw new Error('Failed to fetch livestock')
      }

      const data = await res.json()
      setLivestock(data)
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleAddLivestock = async (livestockData) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/livestock`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(livestockData),
        credentials: 'include'
      })

      if (!res.ok) {
        throw new Error('Failed to add livestock')
      }

      const response = await res.json()
      if (response.success && response.livestock) {
        setLivestock([...livestock, response.livestock])
        setShowForm(false)
        toast.success(response.message || 'Livestock added successfully!')
      } else {
        throw new Error(response.message || 'Invalid response format')
      }
    } catch (err) {
      toast.error(err.message)
    }
  }
  
   const handleDeleteLivestock = async (id) => {
        try {
            console.log('Attempting to delete livestock:', id);
            
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/livestock/${id}`, {
            method: 'DELETE',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
            });
        
            const data = await res.json();
            console.log('Delete response:', data);

            if (!res.ok) {
            throw new Error(data.error || `HTTP error! status: ${res.status}`);
            }

            setLivestock(prev => prev.filter(animal => animal._id !== id));
            toast.success(data.message || 'Livestock deleted successfully!');
        } catch (err) {
            console.error('Delete failed:', err);
            toast.error(`Deletion failed: ${err.message}`);
        }
};

  const handleAddFeedingLog = async (id, logData) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/livestock/${id}/feeding`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(logData),
        credentials: 'include'
      })

      if (!res.ok) {
        throw new Error('Failed to add feeding log')
      }

      const updatedLivestock = await res.json()
      setLivestock(livestock.map(animal => 
        animal._id === id ? updatedLivestock : animal
      ))
      toast.success('Feeding log added successfully!')
    } catch (err) {
      toast.error(err.message)
    }
  }
  const handleAddVetLog = async (id, logData) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/livestock/${id}/vet`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(logData),
      credentials: 'include'
    })

    if (!res.ok) {
      throw new Error('Failed to add vet log')
    }

    const updatedLivestock = await res.json()
    setLivestock(prev => prev.map(animal => 
      animal._id === id ? updatedLivestock : animal
    ))
    toast.success('Vet log added successfully!')
  } catch (err) {
    toast.error(err.message)
  }
}

const handleAddVaccination = async (id, vaccineData) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/livestock/${id}/vaccinations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(vaccineData),
      credentials: 'include'
    })

    if (!res.ok) {
      throw new Error('Failed to add vaccination')
    }

    const response = await res.json()
    if (response.success && response.livestock) {
      setLivestock(prev => prev.map(animal => 
        animal._id === id ? response.livestock : animal
      ))
      toast.success(response.message || 'Vaccination added successfully!')
    } else {
      throw new Error(response.message || 'Invalid response format')
    }
  } catch (err) {
    toast.error(err.message)
  }
}

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Your Livestock</h1>
        <button
          onClick={() => {
            setSelectedLivestock(null)
            setShowForm(true)
          }}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Add Livestock
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {selectedLivestock ? 'Edit Livestock' : 'Add New Livestock'}
              </h2>
              <button 
                onClick={() => {
                  setShowForm(false)
                  setSelectedLivestock(null)
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <LivestockForm 
              initialData={selectedLivestock}
              onSubmit={selectedLivestock ? 
                (data) => handleUpdateLivestock(selectedLivestock._id, data) : 
                handleAddLivestock
              }
            />
          </div>
        </div>
      )}

      {showDetailModal && selectedLivestock && (
        <LivestockDetailModal
          livestock={selectedLivestock}
          onClose={() => setShowDetailModal(false)}
          onAddFeeding={handleAddFeedingLog}
          onAddVetLog={handleAddVetLog}
          onAddVaccination={handleAddVaccination}
        />
      )}

      {livestock.length === 0 ? (
        <div className="text-center py-12">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">No livestock found</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by adding your first animal.</p>
          <button
            onClick={() => setShowForm(true)}
            className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Add Livestock
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {livestock.map(animal => (
            <LivestockCard
              key={animal._id.toString()}
              animal={animal}
              onViewDetails={() => {
                setSelectedLivestock(animal)
                setShowDetailModal(true)
              }}
              onDelete={() => handleDeleteLivestock(animal._id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}