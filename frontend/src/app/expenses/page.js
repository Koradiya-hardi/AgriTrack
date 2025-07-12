'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import ExpenseForm from '../../components/Expenses/ExpenseForm'
import ExpenseList from '../../components/Expenses/ExpenseList'
import ExpenseSummaryChart from '../../components/Expenses/ExpenseSummaryChart'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState([])
  const [summary, setSummary] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingExpense, setEditingExpense] = useState(null)
  const [filters, setFilters] = useState({
    startDate: null,
    endDate: null,
    category: ''
  })

  const categories = [
    'feed', 'medicine', 'equipment', 
    'labor', 'transport', 'other'
  ]

  useEffect(() => {
    fetchExpenses()
    fetchSummary()
  }, [filters])

  const fetchExpenses = async () => {
    try {
      setLoading(true)
      let url = 'NEXT_PUBLIC_API_URL/expenses?'
      if (filters.startDate) url += `startDate=${filters.startDate.toISOString()}&`
      if (filters.endDate) url += `endDate=${filters.endDate.toISOString()}&`
      if (filters.category) url += `category=${filters.category}&`

      const res = await fetch(url, {
        credentials: 'include'
      })
      
      if (!res.ok) throw new Error('Failed to fetch expenses')

      const data = await res.json()
      setExpenses(data)
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchSummary = async () => {
    try {
      let url = 'NEXT_PUBLIC_API_URL/expenses/summary?'
      if (filters.startDate) url += `startDate=${filters.startDate.toISOString()}&`
      if (filters.endDate) url += `endDate=${filters.endDate.toISOString()}&`

      const res = await fetch(url, {
        credentials: 'include'
      })
      
      if (!res.ok) throw new Error('Failed to fetch expense summary')

      const data = await res.json()
      setSummary(data)
    } catch (err) {
      toast.error(err.message)
    }
  }

  const handleAddExpense = async (expenseData) => {
    try {
      const res = await fetch('NEXT_PUBLIC_API_URL/expenses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(expenseData),
        credentials: 'include'
      })

      if (!res.ok) throw new Error('Failed to add expense')

      const response = await res.json()
      setExpenses([response.expense, ...expenses])
      setShowForm(false)
      fetchSummary()
      toast.success(response.message || 'Expense added successfully!')
    } catch (err) {
      toast.error(err.message)
    }
  }

  const handleUpdateExpense = async (id, expenseData) => {
    try {
      const res = await fetch(`NEXT_PUBLIC_API_URL/expenses/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(expenseData),
        credentials: 'include'
      })

      if (!res.ok) throw new Error('Failed to update expense')

      const response = await res.json()
      setExpenses(expenses.map(exp => 
        exp._id === id ? response.expense : exp
      ))
      setEditingExpense(null)
      setShowForm(false)
      fetchSummary()
      toast.success(response.message || 'Expense updated successfully!')
    } catch (err) {
      toast.error(err.message)
    }
  }

  const handleDeleteExpense = async (id) => {
    try {
      const res = await fetch(`NEXT_PUBLIC_API_URL/expenses/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      })

      if (!res.ok) throw new Error('Failed to delete expense')

      setExpenses(expenses.filter(exp => exp._id !== id))
      fetchSummary()
      toast.success('Expense deleted successfully!')
    } catch (err) {
      toast.error(err.message)
    }
  }

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const resetFilters = () => {
    setFilters({
      startDate: null,
      endDate: null,
      category: ''
    })
  }

  if (loading && expenses.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Expense Management</h1>
        <button
          onClick={() => {
            setEditingExpense(null)
            setShowForm(true)
          }}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Add Expense
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {editingExpense ? 'Edit Expense' : 'Add New Expense'}
              </h2>
              <button 
                onClick={() => {
                  setShowForm(false)
                  setEditingExpense(null)
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <ExpenseForm 
              initialData={editingExpense}
              onSubmit={editingExpense ? 
                (data) => handleUpdateExpense(editingExpense._id, data) : 
                handleAddExpense
              }
              categories={categories}
            />
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Expense Summary</h2>
        <div className="h-64">
          <ExpenseSummaryChart data={summary} />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h2 className="text-xl font-semibold mb-4 md:mb-0">Expense Records</h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <DatePicker
                selected={filters.startDate}
                onChange={(date) => handleFilterChange('startDate', date)}
                selectsStart
                startDate={filters.startDate}
                endDate={filters.endDate}
                className="border border-gray-300 rounded-md px-3 py-2 w-full"
                placeholderText="Select start date"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <DatePicker
                selected={filters.endDate}
                onChange={(date) => handleFilterChange('endDate', date)}
                selectsEnd
                startDate={filters.startDate}
                endDate={filters.endDate}
                minDate={filters.startDate}
                className="border border-gray-300 rounded-md px-3 py-2 w-full"
                placeholderText="Select end date"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 w-full"
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                ))}
              </select>
            </div>
            <button
              onClick={resetFilters}
              className="self-end bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-2 rounded-md text-sm"
            >
              Reset
            </button>
          </div>
        </div>
        <ExpenseList 
          expenses={expenses} 
          onEdit={(expense) => {
            setEditingExpense(expense)
            setShowForm(true)
          }}
          onDelete={handleDeleteExpense}
        />
      </div>
    </div>
  )
}