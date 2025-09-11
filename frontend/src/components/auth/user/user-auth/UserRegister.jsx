import React, { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, UserPlus } from 'lucide-react'
import { toast } from 'react-toastify'
import { useForm } from 'react-hook-form'
import { apiUrl } from '../../../Http'


export default function UserRegister() {
  const registerImg = "https://i.ibb.co.com/vjhV4YZ/register.jpg"
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm()

  const handleShowPassword = () => setShowPassword((prev) => !prev)

  const userRegister = async (data) => {
    try {
      const response = await fetch(`${apiUrl}/user/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json", 
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (result.status === 200) {
        toast.success(result.message)
        navigate("/account/user/login")
      } else {
        const formErrors = result.errors || {}
        Object.keys(formErrors).forEach((field) => {
          setError(field, { message: formErrors[field][0] })
        })
      }
    } catch (error) {
      console.error("Error fetching Register:", error)
    }
  }

  return (
    <>
      <Helmet>
        <title>MAKFashion | User Register</title>
      </Helmet>

      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-50 via-gray-100 to-blue-100 p-6">
        <div className="flex w-full max-w-5xl bg-white shadow-xl rounded-2xl overflow-hidden">
          
          {/* Left: Form */}
          <div className="w-full md:w-1/2 p-10 flex flex-col justify-center">
            <h2 className="text-4xl font-extrabold mb-4 text-gray-800 tracking-tight">Create Account ✨</h2>
            <p className="text-gray-500 mb-8">Join MAKFashion today and start shopping!</p>

            <form onSubmit={handleSubmit(userRegister)} className="space-y-6">
              
              {/* Name */}
              <div>
                <label htmlFor="name" className="block mb-2 font-medium text-gray-700">Full Name</label>
                <input 
                  {...register('name',{ required: "Name is required" })}
                  type="text" id="name" placeholder="John Doe"
                  className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block mb-2 font-medium text-gray-700">Email</label>
                <input 
                  {...register('email',{
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address"
                    }
                  })}
                  type="email" id="email" placeholder="you@example.com"
                  className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block mb-2 font-medium text-gray-700">Password</label>
                <div className="relative">
                  <input
                    {...register("password", { required: "Password is required" })}
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    placeholder="********"
                    className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10 bg-gray-50"
                  />
                  <button
                    type="button"
                    onClick={handleShowPassword}
                    className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
              </div>

              {/* Register button */}
              <button className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-xl hover:bg-blue-700 transition font-medium">
                <UserPlus size={20} />
                <span>Register</span>
              </button>
            </form>

            {/* Already have account */}
            <p className="mt-6 text-sm text-gray-500 text-center">
              Already have an account?{' '}
              <Link to="/account/user/login" className="text-blue-600 font-medium hover:underline">
                Sign in
              </Link>
            </p>
          </div>

          {/* Right: Image */}
          <div className="hidden md:block w-1/2">
            <img src={registerImg} alt="Register" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>
    </>
  )
}
