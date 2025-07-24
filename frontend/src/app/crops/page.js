'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import CropForm from '../../components/Crops/CropForm'
import CropCard from '../../components/Crops/CropCard'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function CropsPage(){
    const [crops, setCrops] = useState([]);
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [editingCrop, setEditingCrop] = useState(null)
    const router = useRouter()

    useEffect(() =>{
        fetchCrops()
    },[])

    const fetchCrops = async () => {
    try {
      setLoading(true)
      const res = await fetch(`https://agritrack-2.onrender.com/api/crops`, {
        credentials: 'include'
      })
      
      if (!res.ok) {
        throw new Error('Failed to fetch crops')
      }

      const data = await res.json()
      setCrops(data)
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }


  const handleAddCrop = async (cropData) => {
    try {
        const res = await fetch(`https://agritrack-2.onrender.com/api/crops`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(cropData),
        credentials: 'include'
        })

        if (!res.ok) {
        throw new Error('Failed to add crop')
        }

        const response = await res.json()
        if (response.success && response.crop) {
        setCrops([...crops, response.crop])
        setShowForm(false)
        toast.success(response.message || 'Crop added successfully!')
        } else {
        throw new Error(response.message || 'Invalid response format')
        }
    } catch (err) {
        toast.error(err.message)
    }
}
  const handleUpdateCrop = async (id, cropData) => {
  try {
    const res = await fetch(`https://agritrack-2.onrender.com/api/crops/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cropData),
      credentials: 'include'
    })

    if (!res.ok) {
      throw new Error('Failed to update crop')
    }
    const updatedCrop = await res.json()

    setCrops(prevCrops => prevCrops.map(crop =>
      crop._id === id ? updatedCrop : crop
    ))
    setEditingCrop(null)
    setShowForm(false)
    toast.success('Crop updated successfully!')
  } catch (err) {
    toast.error(err.message)
  }
}
  
  const handleDeleteCrop = async (id) => {
    try {
      const res = await fetch(`https://agritrack-2.onrender.com/api/crops/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      })

      if (!res.ok) {
        throw new Error('Failed to delete crop')
      }

      setCrops(crops.filter(crop => crop._id !== id))
      toast.success('Crop deleted successfully!')
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
        <h1 className="text-3xl font-bold text-gray-800 font-sans md:font-serif">Your Crops</h1>
        <button
          onClick={() => {
            setEditingCrop(null)
            setShowForm(true)
          }}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Add Crop
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {editingCrop ? 'Edit Crop' : 'Add New Crop'}
              </h2>
              <button 
                onClick={() => {
                  setShowForm(false)
                  setEditingCrop(null)
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <CropForm 
              initialData={editingCrop}
              onSubmit={editingCrop ? 
                (data) => handleUpdateCrop(editingCrop._id, data) : 
                handleAddCrop
              }
            />
          </div>
        </div>
      )}

      {crops.length === 0 ? (
        <div className="text-center py-12">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">No crops found</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by adding your first crop.</p>
          <button
            onClick={() => setShowForm(true)}
            className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Add Crop
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {crops.map(crop => (
            <CropCard
              key={crop._id}
              crop={crop}
              onEdit={() => {
                setEditingCrop(crop)
                setShowForm(true)
              }}
              onDelete={() => handleDeleteCrop(crop._id)}
            />
          ))}
        </div>
      )}
    </div>
  )
} 