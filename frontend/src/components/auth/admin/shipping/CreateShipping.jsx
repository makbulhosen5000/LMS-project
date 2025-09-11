import React, { useState } from 'react';
import { Link} from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { adminToken, apiUrl } from '../../../Http';
import Topbar from '../dashboard/Topbar';
import Sidebar from '../dashboard/Sidebar';
import Footer from '../dashboard/Footer';


export default function CreateShipping() {
  const [disable, setDisable] = useState(false);


  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues:async()=>{
        try {
            const response = await fetch(`${apiUrl}/get-shipping`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${adminToken()}`,
              },
            });
      
            const result = await response.json();
            if (result.status === 200) {
              reset({
                shipping_charge: result.data.shipping_charge,
              })
            } else {
              toast.error(result.message || "Something went wrong");
            }
          } catch (error) {
            console.error("Error creating shipping:", error);
            toast.error("An error occurred while creating the category.");
          }
    }
  });

  const saveShipping = async (data) => {
    setDisable(true);
    try {
      const response = await fetch(`${apiUrl}/save-shipping`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${adminToken()}`,
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      setDisable(false);
      if (result.status === 200) {
        toast.success(result.message);
      } else {
        toast.error(result.message || "Something went wrong");
      }
    } catch (error) {
      setDisable(false);
      console.error("Error creating category:", error);
      toast.error("An error occurred while creating the category.");
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
            <div className=" mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Sipping Charge</h2>
                
            </div>

            <div className="overflow-x-auto">
              <div className="bg-gray-100 flex items-center justify-center p-6">
                <form
                  onSubmit={handleSubmit(saveShipping)}
                  className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md space-y-6"
                >
                  <div>
                    <label className="block text-gray-700 font-medium mb-1" htmlFor="name">
                      Shipping Charge
                    </label>
                    <input
                      {...register('shipping_charge', {
                        required: "The shipping charge field is required",
                      })}
                      type="text"
                      id="shipping charge"
                      className={`w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.name ? 'is-invalid' : ''}`}
                      placeholder="Enter shipping charge "
                    />
                    {errors.shipping_charge && <span className="text-red-500 text-sm">{errors.shipping_charge.message}</span>}
                  </div>

                  <button
                    disabled={disable}
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition duration-300"
                  >
                    {disable ? 'Submitting...' : 'Submit'}
                  </button>
                </form>
              </div>
            </div>
          </div>
          {/* <!-- Footer --> */}
          <Footer />
        </main>
      </div>
    </div>
  );
}


