'use client'
import { useState } from 'react'
import FeedingLogForm from './FeedingLogForm'
import VetLogForm from './VetLogForm' // Make sure this is imported
import VaccinationForm from './VaccinationForm' // Make sure this is imported

export default function LivestockDetailModal({ livestock, onClose, onAddFeeding, onAddVetLog, onAddVaccination }) {
  const [activeTab, setActiveTab] = useState('feeding')
  const [showFeedingForm, setShowFeedingForm] = useState(false)
  const [showVetForm, setShowVetForm] = useState(false)
  const [showVaccinationForm, setShowVaccinationForm] = useState(false)

  const handleAddFeeding = (logData) => {
    onAddFeeding(livestock._id, logData)
    setShowFeedingForm(false)
  }

  const handleAddVetLog = (logData) => {
    onAddVetLog(livestock._id, logData)
    setShowVetForm(false)
  }

  const handleAddVaccination = (vaccineData) => {
    onAddVaccination(livestock._id, vaccineData)
    setShowVaccinationForm(false)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center border-b p-4">
          <h2 className="text-xl font-semibold">{livestock.name}'s Details</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div><h3 className="text-sm font-medium text-gray-500">Type</h3><p className="mt-1 text-sm text-gray-900">{livestock.type}</p></div>
            <div><h3 className="text-sm font-medium text-gray-500">Breed</h3><p className="mt-1 text-sm text-gray-900">{livestock.breed || '-'}</p></div>
            <div><h3 className="text-sm font-medium text-gray-500">Age</h3><p className="mt-1 text-sm text-gray-900">{livestock.age ? `${livestock.age} years` : '-'}</p></div>
            <div><h3 className="text-sm font-medium text-gray-500">Weight</h3><p className="mt-1 text-sm text-gray-900">{livestock.weight ? `${livestock.weight} kg` : '-'}</p></div>
            <div><h3 className="text-sm font-medium text-gray-500">Status</h3><p className="mt-1 text-sm text-gray-900 capitalize">{livestock.status}</p></div>
          </div>

          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button onClick={() => setActiveTab('feeding')} className={`${activeTab === 'feeding' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>Feeding Logs</button>
              <button onClick={() => setActiveTab('vet')} className={`${activeTab === 'vet' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>Vet Logs</button>
              <button onClick={() => setActiveTab('vaccinations')} className={`${activeTab === 'vaccinations' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>Vaccinations</button>
            </nav>
          </div>

          <div className="py-4">
            {/* Feeding Tab */}
            {activeTab === 'feeding' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Feeding History</h3>
                  <button onClick={() => setShowFeedingForm(true)} className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700">Add Feeding</button>
                </div>
                {showFeedingForm && (
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <FeedingLogForm onSubmit={handleAddFeeding} onCancel={() => setShowFeedingForm(false)} />
                  </div>
                )}
                {livestock.feedingLogs?.length > 0 ? (
                  <div className="space-y-4">
                    {livestock.feedingLogs.map((log, index) => (
                      <div key={index} className="p-3 border border-gray-200 rounded-lg">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">{new Date(log.date).toLocaleDateString()}</span>
                          <span className="text-sm font-medium">{log.foodType} - {log.amount}</span>
                        </div>
                        {log.notes && <p className="mt-1 text-sm text-gray-600">{log.notes}</p>}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No feeding logs recorded</p>
                )}
              </div>
            )}

            {/* Vet Tab */}
            {activeTab === 'vet' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Veterinary History</h3>
                  <button onClick={() => setShowVetForm(true)} className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700">Add Vet Log</button>
                </div>
                {showVetForm && (
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <VetLogForm onSubmit={handleAddVetLog} onCancel={() => setShowVetForm(false)} />
                  </div>
                )}
                {livestock.vetLogs?.length > 0 ? (
                  <div className="space-y-4">
                    {livestock.vetLogs.map((log, index) => (
                      <div key={index} className="p-3 border border-gray-200 rounded-lg">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">{new Date(log.date).toLocaleDateString()}</span>
                          <span className="text-sm font-medium">{log.vetName}</span>
                        </div>
                        <p className="mt-1 text-sm font-medium">{log.treatment}</p>
                        <p className="mt-1 text-sm text-gray-600">Cost: ${log.cost}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No vet logs recorded</p>
                )}
              </div>
            )}

            {/* Vaccinations Tab */}
            {activeTab === 'vaccinations' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Vaccination History</h3>
                  <button onClick={() => setShowVaccinationForm(true)} className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700">Add Vaccination</button>
                </div>
                {showVaccinationForm && (
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <VaccinationForm onSubmit={handleAddVaccination} onCancel={() => setShowVaccinationForm(false)} />
                  </div>
                )}
                {livestock.vaccinations?.length > 0 ? (
                  <div className="space-y-4">
                    {livestock.vaccinations.map((vaccine, index) => (
                      <div key={index} className="p-3 border border-gray-200 rounded-lg">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">{vaccine.name}</span>
                          <span className="text-sm font-medium">{new Date(vaccine.date).toLocaleDateString()}</span>
                        </div>
                        <div className="mt-1 text-sm text-gray-600">
                          <p>Administered by: {vaccine.administeredBy}</p>
                          {vaccine.nextDueDate && <p>Next due: {new Date(vaccine.nextDueDate).toLocaleDateString()}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No vaccinations recorded</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
