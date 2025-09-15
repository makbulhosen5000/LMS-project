import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useParams } from 'react-router-dom'
import { apiUrl, userTokenLms } from '../../../common/Config'
import { toast } from 'react-toastify'
import { FaEdit, FaTrash, FaCheckCircle } from 'react-icons/fa'

export default function ManageOutcome() {
  const [outcomes, setOutcomes] = useState([])
  const [disable, setDisable] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentOutcome, setCurrentOutcome] = useState(null)
  const [editValue, setEditValue] = useState('')
  const { id } = useParams()

  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  // --- fetch outcomes ---
  const fetchOutcome = async () => {
    try {
      const response = await fetch(`${apiUrl}/outcomes?course_id=${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${userTokenLms()}`,
        },
      })
      const result = await response.json()
      if (result.status === 200) {
        setOutcomes(result.data)
      } else {
        toast.error(result.message || 'Failed to fetch outcomes')
      }
    } catch (error) {
      console.error('Error fetching outcome:', error)
      toast.error('An error occurred while fetching the outcome.')
    }
  }

  useEffect(() => {
    fetchOutcome()
  }, [])

  // --- Add new outcome ---
  const onSubmit = async (data) => {
    setDisable(true)
    const formData = { ...data, course_id: id }
    try {
      const response = await fetch(`${apiUrl}/outcomes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${userTokenLms()}`,
        },
        body: JSON.stringify(formData),
      })
      const result = await response.json()
      if (result.status === 200) {
        toast.success(result.message || 'Outcome created successfully')
        setOutcomes((prev) => [...prev, result.data]) // add new outcome instantly
        reset()
      } else {
        toast.error(result.message || 'Failed to create outcome')
      }
    } catch (error) {
      console.error('Error creating outcome:', error)
      toast.error('An error occurred while creating the outcome.')
    } finally {
      setDisable(false)
    }
  }

  // --- Open edit modal ---
  const openEditModal = (outcome) => {
    setCurrentOutcome(outcome)
    setEditValue(outcome.text)
    setIsModalOpen(true)
  }

  // --- Update outcome ---
  const handleUpdate = async () => {
    if (!editValue.trim()) {
      toast.error('Outcome cannot be empty')
      return
    }

    try {
      const response = await fetch(`${apiUrl}/outcomes/${currentOutcome.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userTokenLms()}`,
        },
        body: JSON.stringify({ outcome: editValue, course_id: id }),
      })

      const result = await response.json()
      if (result.status === 200) {
        toast.success('Outcome updated successfully')
        setOutcomes((prev) =>
          prev.map((o) =>
            o.id === currentOutcome.id ? { ...o, text: editValue } : o
          )
        )
        setIsModalOpen(false)
        setCurrentOutcome(null)
        setEditValue('')
      } else {
        toast.error(result.message || 'Failed to update outcome')
      }
    } catch (error) {
      console.error('Error updating outcome:', error)
      toast.error('An error occurred while updating the outcome.')
    }
  }

  // --- Delete outcome ---
  const handleDelete = async (outcomeId) => {
    if (!window.confirm('Are you sure you want to delete this outcome?')) return

    try {
      const response = await fetch(`${apiUrl}/outcomes/${outcomeId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${userTokenLms()}`,
        },
      })
      const result = await response.json()
      if (result.status === 200) {
        toast.success('Outcome deleted successfully')
        setOutcomes((prev) => prev.filter((o) => o.id !== outcomeId))
      } else {
        toast.error(result.message || 'Failed to delete outcome')
      }
    } catch (error) {
      console.error('Error deleting outcome:', error)
      toast.error('An error occurred while deleting the outcome.')
    }
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">Outcome</h3>

      {/* Add outcome form */}
      <form onSubmit={handleSubmit(onSubmit)} className="mb-4">
        <input
          type="text"
          placeholder="Add an outcome"
          className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:outline-none mb-2"
          {...register('outcome', { required: 'Outcome field is required' })}
          disabled={disable}
        />
        {errors.outcome && <p className="text-red-500 text-sm">{errors.outcome.message}</p>}

        <button
          type="submit"
          disabled={disable}
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
        >
          {disable ? 'Saving...' : 'Save'}
        </button>
      </form>

      {/* Outcome list */}
      <ul className="space-y-2 text-sm text-gray-700">
        {outcomes.map((outcome) => (
          <li
            key={outcome.id}
            className="bg-gray-100 px-3 py-2 rounded flex justify-between items-center"
          >
            <span className="flex items-center space-x-2">
              <FaCheckCircle className="text-green-600" />
              <span>{outcome.text}</span>
            </span>
            <div className="flex space-x-3">
              <button
                onClick={() => openEditModal(outcome)}
                className="text-blue-600 hover:text-blue-800"
              >
                <FaEdit />
              </button>
              <button
                onClick={() => handleDelete(outcome.id)}
                className="text-red-600 hover:text-red-800"
              >
                <FaTrash />
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white w-96 p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Edit Outcome</h2>
            <input
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 mb-4 focus:ring-2 focus:ring-purple-500 focus:outline-none"
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
