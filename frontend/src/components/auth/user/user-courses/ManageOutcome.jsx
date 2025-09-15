import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useParams } from 'react-router-dom'
import { apiUrl, userTokenLms } from '../../../common/Config'
import { toast } from 'react-toastify'

export default function ManageOutcome() {
  const [disable, setDisable] = useState(false)
  const params = useParams()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm()

  const onSubmit = async (data) => {
    setDisable(true)
    const formData = { ...data, course_id: params.id }

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
      console.log(result)

      if (result.status === 200) {
        reset()
        toast.success(result.message || 'Outcome created successfully')
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

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">Outcome</h3>

      <form onSubmit={handleSubmit(onSubmit)} className="mb-4">
        <input
          type="text"
          placeholder="Add an outcome"
          className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:outline-none mb-2"
          {...register('outcome', { required: 'Outcome field is required' })}
          disabled={disable}
        />
        {errors.outcome && (
          <p className="text-red-500 text-sm">{errors.outcome.message}</p>
        )}

        <button
          type="submit"
          disabled={disable}
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
        >
          {disable ? 'Saving...' : 'Save'}
        </button>
      </form>

      {/* Example outcome list (replace with dynamic data later) */}
      <ul className="space-y-2 text-sm text-gray-700">
        <li className="bg-gray-100 px-3 py-2 rounded">
          Write and structure a basic HTML document
        </li>
        <li className="bg-gray-100 px-3 py-2 rounded">
          Understand how the web works from a developer&apos;s perspective
        </li>
      </ul>
    </div>
  )
}
