'use client';
import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { toast } from 'react-hot-toast';

export default function AddChemicalModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    cropId: '',
    type: 'fertilizer',
    name: '',
    quantityValue: '',
    quantityUnit: 'kg',
    date: new Date().toISOString().split('T')[0],
    remarks: '',
  });
  const [crops, setCrops] = useState([]);
  const [loadingCrops, setLoadingCrops] = useState(true);

  useEffect(() => {
    const fetchCrops = async () => {
      try {
        const response = await api.get('/api/crops');
        setCrops(response.data);
      } catch (error) {
        toast.error('Failed to load crops');
      } finally {
        setLoadingCrops(false);
      }
    };

    if (isOpen) fetchCrops();
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/chemicals', formData);
      toast.success('Chemical application recorded successfully!');
      onClose();
      // You might want to refresh the chemical list here
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Record Chemical Application</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Crop</label>
            <select
              name="cropId"
              value={formData.cropId}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              required
              disabled={loadingCrops}
            >
              <option value="">Select Crop</option>
              {crops.map(crop => (
                <option key={crop._id} value={crop._id}>{crop.name}</option>
              ))}
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Chemical Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              required
            >
              <option value="fertilizer">Fertilizer</option>
              <option value="pesticide">Pesticide</option>
              <option value="herbicide">Herbicide</option>
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Chemical Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 mb-2">Quantity</label>
              <input
                type="number"
                name="quantityValue"
                value={formData.quantityValue}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
                required
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Unit</label>
              <select
                name="quantityUnit"
                value={formData.quantityUnit}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
                required
              >
                <option value="kg">kg</option>
                <option value="g">g</option>
                <option value="lb">lb</option>
                <option value="litre">litre</option>
              </select>
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Remarks</label>
            <textarea
              name="remarks"
              value={formData.remarks}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              rows="3"
            />
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Record Application
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}