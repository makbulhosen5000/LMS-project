import React, { useEffect, useState } from 'react';
import Sidebar from '../dashboard/Sidebar';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { adminToken, apiUrl } from '../../../common/Http';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import Topbar from '../dashboard/Topbar';

function EditBrand() {
  const [disable, setDisable] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // Fetch existing brand data
  useEffect(() => {
    const fetchBrand = async () => {
      try {
        const response = await fetch(`${apiUrl}/brands/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${adminToken()}`,
          },
        });

        const result = await response.json();
        if (result.status === 200) {
          reset({
            name: result.data.name,
            status: result.data.status.toString(),
          });
        } else {
          console.error('Failed to load brand data');
        }
      } catch (error) {
        console.error('Error fetching brand:', error);
      }
    };

    fetchBrand();
  }, [id, reset]);

  //Submit form
  const updateBrand = async (data) => {
    setDisable(true);
    try {
      const response = await fetch(`${apiUrl}/brands/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${adminToken()}`,
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      setDisable(false);
      if (result.status === 200) {
        toast.success(result.message);
        navigate('/admin/brands');
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      setDisable(false);
      console.error('Error updating brand:', error);
      toast.error('An error occurred while updating the brand.');
    }
  };

  return (
    <div className="bg-gray-100 font-sans">
      <div className="min-h-screen flex">
        <Sidebar />
        <main className="flex-1 pl-4">
           {/* <!-- Topbar --> */}
            <Topbar/>  
          <div className="max-w-6xl mx-auto p-4 my-4 bg-white shadow-lg rounded-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Edit Brand</h2>
              <Link
                to="/admin/brands"
                className="inline-flex items-center bg-green-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                <i className="fa-solid fa-list mr-2"></i> Brand List
              </Link>
            </div>

            <div className="overflow-x-auto">
              <div className="bg-gray-100 flex items-center justify-center p-6">
                <form
                  onSubmit={handleSubmit(updateBrand)}
                  className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md space-y-6"
                >
                  <div>
                    <label className="block text-gray-700 font-medium mb-1" htmlFor="name">
                      Brand Name
                    </label>
                    <input
                      {...register('name', { required: 'The brand name is required' })}
                      type="text"
                      id="name"
                      className={`w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.name ? 'is-invalid' : ''
                      }`}
                      placeholder="Enter Brand Name"
                    />
                    {errors.name && <span className="text-red-500 text-sm">{errors.name.message}</span>}
                  </div>

                  <div>
                    <label className="block font-medium mb-1" htmlFor="status">
                      Status
                    </label>
                    <select
                      {...register('status', { required: 'The status field is required' })}
                      id="status"
                      className={`w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.status ? 'is-invalid' : ''
                      }`}
                      defaultValue=""
                    >
                      <option value="" disabled>
                        Select Status
                      </option>
                      <option value="1">Active</option>
                      <option value="0">Inactive</option>
                    </select>
                    {errors.status && <span className="text-red-500 text-sm">{errors.status.message}</span>}
                  </div>

                  <button
                    type="submit"
                    disabled={disable}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition duration-300"
                  >
                    {disable ? 'Updating...' : 'Update'}
                  </button>
                </form>
              </div>
            </div>
          </div>
          {/* <!-- Footer --> */}
             <Footer/>  
        </main>
      </div>
    </div>
  );
}

export default EditBrand;
