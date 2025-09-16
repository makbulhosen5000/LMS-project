import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useParams } from 'react-router-dom'
import { apiUrl, userTokenLms } from '../../../common/Config'
import { toast } from 'react-toastify'
import { FaEdit, FaTrash, FaCheckCircle } from 'react-icons/fa'
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";


export default function ManageRequirement() {
  const [requirements, setRequirements] = useState([])
  const [disable, setDisable] = useState(false)
  // update modal state for outcomes
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentRequirement, setCurrentRequirement] = useState(null)
  const [editValue, setEditValue] = useState('')
  const { id } = useParams()

  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  // --- fetch requirement ---
  const fetchRequirement = async () => {
    try {
      const response = await fetch(`${apiUrl}/requirements?course_id=${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${userTokenLms()}`,
        },
      })
      const result = await response.json()
      if (result.status === 200) {
        setRequirements(result.data)
      } else {
        toast.error(result.message || 'Failed to fetch requirement')
      }
    } catch (error) {
      console.error('Error fetching requirement:', error)
      toast.error('An error occurred while fetching the requirement.')
    }
  }

  useEffect(() => {
    fetchRequirement()
  }, [])

  // --- Add new requirement ---
  const onSubmit = async (data) => {
    setDisable(true)
    const formData = { ...data, course_id: id }
    try {
      const response = await fetch(`${apiUrl}/requirements`, {
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
        toast.success(result.message || 'Requirement created successfully')
        setRequirements((prev) => [...prev, result.data]) // add new requirement instantly
        reset()
      } else {
        toast.error(result.message || 'Failed to create requirement')
      }
    } catch (error) {
      console.error('Error creating requirement:', error)
      toast.error('An error occurred while creating the requirement.')
    } finally {
      setDisable(false)
    }
  }

  // --- Open edit modal ---
  const openEditModal = (requirement) => {
    setCurrentRequirement(requirement)
    setEditValue(requirement.description)
    setIsModalOpen(true)
  }

  // --- Update requirement ---
  const handleUpdate = async () => {
    if (!editValue.trim()) {
      toast.error('Requirement cannot be empty')
      return
    }
  
    try {
      const response = await fetch(`${apiUrl}/requirements/${currentRequirement.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userTokenLms()}`,
        },
        body: JSON.stringify({ requirement: editValue, course_id: id }),
      })
  
      const result = await response.json()
      if (result.status === 200) {
        toast.success('Requirement updated successfully')
        setRequirements((prev) =>
          prev.map((o) =>
            o.id === currentRequirement.id ? { ...o, description: editValue } : o
          )
        )
        setIsModalOpen(false)
        setCurrentRequirement(null)
        setEditValue('')
      } else {
        toast.error(result.message || 'Failed to update requirement')
      }
    } catch (error) {
      console.error('Error updating requirement:', error)
      toast.error('An error occurred while updating the requirement.')
    }
  }
  
  // --- Delete requirement ---
  const handleDelete = async (requirementId) => {
    if (!window.confirm('Are you sure you want to delete this requirement?')) return

    try {
      const response = await fetch(`${apiUrl}/requirements/${requirementId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${userTokenLms()}`,
        },
      })
      const result = await response.json()
      if (result.status === 200) {
        toast.success('Requirement deleted successfully')
        setRequirements((prev) => prev.filter((o) => o.id !== requirementId))
      } else {
        toast.error(result.message || 'Failed to delete requirement')
      }
    } catch (error) {
      console.error('Error deleting requirement:', error)
      toast.error('An error occurred while deleting the requirement.')
    }
  }
  // handle drag and drop for outcome
  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const reorderedItems = Array.from(requirements);
    const [movedItem] = reorderedItems.splice(result.source.index, 1);
    reorderedItems.splice(result.destination.index, 0, movedItem);

    setRequirements(reorderedItems);
    saveOrder(reorderedItems);
  };
  // save new order to the backend
    const saveOrder = async (updatedRequirements) => {
    try {
      const response = await fetch(`${apiUrl}/sort-requirements`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${userTokenLms()}`,
        },
        body: JSON.stringify({requirements:updatedRequirements}),
      })
      const result = await response.json()
      if (result.status === 200) {
        toast.success(result.message)
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      console.error('Error creating outcome:', error)
      toast.error('An error occurred while creating the outcome.')
    } finally {
      setDisable(false)
    };
    }

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-800 mb-2">Requirement</h3>

      {/* Add Requirement form */}
      <form onSubmit={handleSubmit(onSubmit)} className="mb-4">
        <input
          type="text"
          placeholder="Add an Requirement"
          className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:outline-none mb-2"
          {...register('requirement', { required: 'requirement field is required' })}
          disabled={disable}
        />
        {errors.requirement && <p className="text-red-500 text-sm">{errors.requirement.message}</p>}

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
         <DragDropContext onDragEnd={handleDragEnd} >
                    <Droppable droppableId="list">
                        {(provided) => (
                            <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                                {
                                requirements.map((requirement, index) => (
                                        <Draggable key={requirement.id} draggableId={`${requirement.id}`} index={index}>
        
                                        {(provided) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                className="mt-2 border px-3 py-2 bg-white shadow-lg  rounded"
                                              >
                                                <li
                                                  key={requirement.id}
                                                  className="bg-gray-100 px-3 py-2 rounded flex justify-between items-center"
                                                >
                                                  <span className="flex items-center space-x-2">
                                                    <FaCheckCircle className="text-green-600" />
                                                    <span>{requirement.description}</span>
                                                  </span>
                                                  <div className="flex space-x-3">
                                                    <button
                                                      onClick={() => openEditModal(requirement)}
                                                      className="text-blue-600 hover:text-blue-800"
                                                    >
                                                      <FaEdit />
                                                    </button>
                                                    <button
                                                      onClick={() => handleDelete(requirement.id)}
                                                      className="text-red-600 hover:text-red-800"
                                                    >
                                                      <FaTrash />
                                                    </button>
                                                  </div>
                                                </li>
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext> 
        {/* {requirements && requirements.map((requirement) => (
          <li
            key={requirement.id}
            className="bg-gray-100 px-3 py-2 rounded flex justify-between items-center"
          >
            <span className="flex items-center space-x-2">
              <FaCheckCircle className="text-green-600" />
              <span>{requirement.description}</span>
            </span>
            <div className="flex space-x-3">
              <button
                onClick={() => openEditModal(requirement)}
                className="text-blue-600 hover:text-blue-800"
              >
                <FaEdit />
              </button>
              <button
                onClick={() => handleDelete(requirement.id)}
                className="text-red-600 hover:text-red-800"
              >
                <FaTrash />
              </button>
            </div>
          </li>
        ))} */}
      </ul>

      {/* Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white w-96 p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Edit Requirement</h2>
            <input
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 mb-4 focus:ring-2 focus:ring-purple-500 focus:outline-none"
            />
            {/* outcome update and cancel button */}
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
