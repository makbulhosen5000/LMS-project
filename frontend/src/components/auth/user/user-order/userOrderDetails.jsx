import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

import { toast } from "react-toastify";
import { apiUrl, userToken } from "../../../common/Http";
import UserSidebar from "../user-dashboard/UserSidebar";
import UserTopbar from "../user-dashboard/UserTopBar";
import Loader from "../../../common/Loader";


function UserOrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
   // form handling by useForm hook
    const {
    register,
    handleSubmit,
    setError,
    reset,
    watch,
    formState: { errors },
      } = useForm();
  
  // order details function
  const fetchOrderDetails = async () => {
    try {
      const response = await fetch(`${apiUrl}/get-order-details/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${userToken()}`,
        },
      });

      const result = await response.json();
      console.log("Order details fetched:", result.data);
      if(result.status == '200'){
        setOrder(result.data);
        setLoading(false);
        reset({
            payment_status: result.data.payment_status,
            status: result.data.status,
          });
        
      }
      else{
          setLoading(false);
          console.error("Failed to fetch order details:", result.message);
          setOrder(null);
      }
    } catch (error) {
      console.error("Error fetching order details:", error);
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

 

  return (
    <div className="bg-gray-100 font-sans">
      <div className="min-h-screen flex">
        <UserSidebar />
        <main className="flex-1 pl-4">
          <UserTopbar />
  
          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center min-h-[200px]">
                <Loader/>
            </div>
          )}
  
       

          {/* Order Details */}
          {!loading && order && (
            <div className="max-w-7xl mx-auto p-10 my-10 bg-white shadow-xl rounded-2xl">
            <h2 className="text-4xl font-extrabold text-gray-800 border-b-2 border-gray-200 pb-5 mb-8 text-center">
              Order Details
            </h2>
          
            <div className="lg:col-span-2 space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Customer Info */}
                <div className="bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition">
                  <h3 className="font-semibold text-xl mb-4 text-gray-700 border-b pb-2">
                    Customer Info
                  </h3>
                  <p><span className="font-medium">Name:</span> {order?.name}</p>
                  <p><span className="font-medium">Email:</span> {order?.email}</p>
                  <p><span className="font-medium">Phone:</span> {order?.phone}</p>
                </div>
          
                {/* Payment Info */}
                <div className="bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition">
                  <h3 className="font-semibold text-xl mb-4 text-gray-700 border-b pb-2">
                    Payment Info
                  </h3>
                  <p><span className="font-medium">Shipping:</span> ${order?.shipping}</p>
                  <p className="font-extrabold"><span>Grand Total:</span> ${order?.grand_total}</p>
                  <p>
                    Payment Status:
                    <span className={`inline-block ${order.payment_status === "paid" ? 'bg-green-600' : 'bg-red-600'} text-white text-xs font-semibold px-2.5 py-0.5 rounded`}>
                            {order.payment_status === 'paid' ? 'Paid' : 'Not Paid'}
                    </span>
                  </p>
                  <p>
                    Payment Method:
                    <span className={`inline-block ${order.payment_method === "stripe" ? 'bg-green-800' : 'bg-red-900'} text-white text-xs font-semibold px-2.5 py-0.5 rounded`}>
                            {order.payment_method === 'stripe' ? 'stripe' : 'case_on_delivery'}
                    </span>
                  </p>
                </div>
          
                {/* Order Info */}
                <div className="bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition">
                  <h3 className="font-semibold text-xl mb-4 text-gray-700 border-b pb-2">
                    Order Info
                  </h3>
                  <p className=" font-extrabold"><span >Order ID:</span> {order?.id}</p>
                  <p><span className="font-medium">Date:</span> {order?.created_at}</p>
                  <p>
                       { 
                       order.status === "pending" && (
                        <span className="px-3 py-1 text-sm bg-yellow-300 text-yellow-900 rounded-full">
                            Pending
                        </span>
                        )}
                        {
                        order.status === "shipped" && (
                        <span className="px-3 py-1 text-sm bg-green-500 text-green-900 rounded-full">
                            Shipped
                        </span>
                        )}
                        {
                        order.status === "delivered" && (
                        <span className="px-3 py-1 text-sm bg-green-600 text-green-900 rounded-full">
                            Delivered
                        </span>
                        )}
                        {
                        order.status === "cancelled" && (
                        <span className="px-3 py-1 text-sm bg-red-600 text-red-900 rounded-full">
                            Cancelled
                        </span>
                        )}
                    </p>
                </div>
              </div>
          
              {/* Order Items */}
              <div className="bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition">
                <h3 className="font-semibold text-xl mb-4 text-gray-700 border-b pb-2">
                  Order Items
                </h3>
                <div className="overflow-x-auto rounded-lg border">
                  <table className="min-w-full text-sm text-left border-collapse">
                    <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
                      <tr>
                        <th className="px-4 py-3">Product</th>
                        <th className="px-4 py-3">Image</th>
                        <th className="px-4 py-3">Quantity</th>
                        <th className="px-4 py-3">Size</th>
                        <th className="px-4 py-3">Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.items?.map((item) => (
                        <tr
                          key={item.id}
                          className="border-t hover:bg-gray-50 transition"
                        >
                          <td className="px-4 py-3">{item?.name}</td>
                          <td className="px-4 py-3">
                            {item?.products?.image_url && (
                              <img
                                src={item?.products?.image_url}
                                alt="Product"
                                className="w-16 h-16 object-cover rounded-lg border"
                              />
                            )}
                          </td>
                          <td className="px-4 py-3">{item?.qty}</td>
                          <td className="px-4 py-3">{item?.size}</td>
                          <td className="px-4 py-3 font-semibold">${item?.price}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
          
              {/* Back Button */}
              <div className="flex justify-center pt-6">
                <Link
                  to="/account/user/orders"
                  className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg shadow hover:bg-indigo-700 transition"
                >
                  Back to Orders
                </Link>
              </div>
            </div>
          </div>
          
          )}
        </main>
      </div>
    </div>
  );
  
}

export default UserOrderDetails;
