import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiUrl,userTokenLms } from '../../../common/Config';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import UserTopbar from '../user-dashboard/UserTopBar';
import UserSidebar from '../user-dashboard/UserSidebar';

function CreateCourse() {
  const [disable, setDisable] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const saveCourse = async (data) => {
    setDisable(true);
    try {
      const response = await fetch(`${apiUrl}/courses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${userTokenLms()}`,
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      setDisable(false);
      if (result.status === 200) {
        toast.success(result.message);
        navigate('/account/user/edit-course/'+result.data.id);
      } else {
        toast.error(result.message || "Something went wrong");
      }
    } catch (error) {
      setDisable(false);
      console.error("Error creating courses:", error);
      toast.error("An error occurred while creating the course.");
    }
  };

  return (
    <div className="bg-gray-100 font-sans">
      <div className="min-h-screen flex">
        <UserSidebar/>
        <main className="flex-1 pl-4">
          {/* <!-- Topbar --> */}
            <UserTopbar/>
          <div className="max-w-6xl mx-auto p-4 my-4 bg-white shadow-lg rounded-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Create Course</h2>
              <Link
                to="/account/user/my-courses"
                className="inline-flex items-center bg-green-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                <i className="fa-solid fa-plus mr-2"></i> Course List
              </Link>
            </div>

            <div className="overflow-x-auto">
              <div className="bg-gray-100 flex items-center justify-center p-6">
                <form
                  onSubmit={handleSubmit(saveCourse)}
                  className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md space-y-6"
                >
                  <div>
                    <label className="block text-gray-700 font-medium mb-1" htmlFor="name">
                      Course Name
                    </label>
                    <input
                      {...register('title', {
                        required: "The title field is required",
                      })}
                      type="text"
                      id="title"
                      className={`w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.name ? 'is-invalid' : ''}`}
                      placeholder="Enter Course Title"
                    />
                    {errors.title && <span className="text-red-500 text-sm">{errors.title.message}</span>}
                  </div>

                  {/* <div>
                    <label className="block font-medium mb-1" htmlFor="status">
                      Status
                    </label>
                    <select
                      {...register('status', {
                        required: "The status field is required",
                      })}
                      id="status"
                      className={`w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.status ? 'is-invalid' : ''}`}
                      defaultValue=""
                    >
                      <option value="" disabled>
                        Select Status
                      </option>
                      <option value="1">Active</option>
                      <option value="0">Inactive</option>
                    </select>
                    {errors.status && <span className="text-red-500 text-sm">{errors.status.message}</span>}
                  </div> */}

                  <button
                    disabled={disable}
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition duration-300"
                  >
                    {disable ? 'Submitting...' : 'Continue'}
                  </button>
                </form>
              </div>
            </div>
          </div>
          {/* <!-- Footer --> */}
          
        </main>
      </div>
    </div>
  );
}

export default CreateCourse;
