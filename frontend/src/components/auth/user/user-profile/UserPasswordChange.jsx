import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { apiUrl, userToken } from '../../../Http';
import UserSidebar from '../user-dashboard/UserSidebar';
import UserTopbar from '../user-dashboard/UserTopBar';
import { Eye, EyeOff } from "lucide-react";

export default function UserPasswordChange() {
  const [disable, setDisable] = useState(false);
  const [showPassword, setShowPassword] = useState({
    old: false,
    new: false,
    confirm: false,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const changeUserPassword = async (data) => {
    setDisable(true);
    try {
      const response = await fetch(`${apiUrl}/change-user-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${userToken()}`,
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (result.status === 200) {
        setDisable(false);
        toast.success(result.message);
        reset();
      } else {
        toast.error(result.message || "Something went wrong");
      }
    } catch (error) {
      setDisable(false);
      console.error("Error creating password:", error);
      toast.error("An error occurred while creating the password.");
    }
  };

  return (
    <div className="bg-gray-100 font-sans">
      <div className="min-h-screen flex">
        <UserSidebar />
        <main className="flex-1 pl-4">
          <UserTopbar />
          <div className="max-w-6xl mx-auto p-4 my-4 bg-white shadow-lg rounded-lg">
            <div className=" mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Change Password
              </h2>
            </div>

            <div className="overflow-x-auto">
              <div className="bg-gray-100 flex items-center justify-center p-6">
                <form
                  onSubmit={handleSubmit(changeUserPassword)}
                  className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md space-y-6"
                >
                  {/* Old Password */}
                  <div>
                    <label className="block text-gray-700 font-medium mb-1">
                      Old Password
                    </label>
                    <div className="relative">
                      <input
                        {...register('old_password', {
                          required: "The old password field is required",
                        })}
                        type={showPassword.old ? "text" : "password"}
                        id="old_password"
                        className={`w-full border border-gray-300 rounded-xl p-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.old_password ? 'is-invalid' : ''
                        }`}
                        placeholder="Enter your old password"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword({ ...showPassword, old: !showPassword.old })
                        }
                        className="absolute right-3 top-3 text-gray-500"
                      >
                        {showPassword.old ? <EyeOff /> : <Eye />}
                      </button>
                    </div>
                    {errors.old_password && (
                      <span className="text-red-500 text-sm">
                        {errors.old_password.message}
                      </span>
                    )}
                  </div>

                  {/* New Password */}
                  <div>
                    <label className="block text-gray-700 font-medium mb-1">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        {...register('new_password', {
                          required: "The new password field is required",
                        })}
                        type={showPassword.new ? "text" : "password"}
                        id="new_password"
                        className={`w-full border border-gray-300 rounded-xl p-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.new_password ? 'is-invalid' : ''
                        }`}
                        placeholder="Enter your new password"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword({ ...showPassword, new: !showPassword.new })
                        }
                        className="absolute right-3 top-3 text-gray-500"
                      >
                        {showPassword.new ? <EyeOff /> : <Eye />}
                      </button>
                    </div>
                    {errors.new_password && (
                      <span className="text-red-500 text-sm">
                        {errors.new_password.message}
                      </span>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-gray-700 font-medium mb-1">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        {...register('confirm_password', {
                          required: "The confirm password field is required",
                        })}
                        type={showPassword.confirm ? "text" : "password"}
                        id="confirm_password"
                        className={`w-full border border-gray-300 rounded-xl p-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.confirm_password ? 'is-invalid' : ''
                        }`}
                        placeholder="Re-enter your password"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword({ ...showPassword, confirm: !showPassword.confirm })
                        }
                        className="absolute right-3 top-3 text-gray-500"
                      >
                        {showPassword.confirm ? <EyeOff /> : <Eye />}
                      </button>
                    </div>
                    {errors.confirm_password && (
                      <span className="text-red-500 text-sm">
                        {errors.confirm_password.message}
                      </span>
                    )}
                  </div>

                  <button
                    disabled={disable}
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition duration-300"
                  >
                    {disable ? 'Submitting...' : 'Update Password'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
