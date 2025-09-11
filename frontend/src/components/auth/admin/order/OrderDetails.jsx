import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

import { adminToken, apiUrl } from "../../../Http";
import Sidebar from "../dashboard/Sidebar";
import Topbar from "../dashboard/Topbar";
import Footer from "../dashboard/Footer";
import Loader from "../../../common/loader/Loader";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";


function OrderDetails() {
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
      const response = await fetch(`${apiUrl}/order/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${adminToken()}`,
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
  // update order status function
  const orderUpdateStatus = async (data) => {
    try {
      const response = await fetch(`${apiUrl}/order-update-status/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${adminToken()}`,
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      console.log("Order details fetched:", result.data);
      if(result.status == '200'){
        setOrder(result.data);
        setLoading(false);
        toast.success(result.message);
        navigate('/admin/orders');
        reset({
          payment_status: result.data.payment_status,
          status: result.data.status,
        });
      }
      else{
          setLoading(false);
          console.error("Failed to fetch order status update:", result.message);
          setOrder(null);
      }
    } catch (error) {
      console.error("Error fetching  order status update:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

 

  return (
    <div className="bg-gray-100 font-sans">
      <div className="min-h-screen flex">
        <Sidebar />
        <main className="flex-1 pl-4">
          <Topbar />
  
          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center min-h-[200px]">
                <Loader />
            </div>
          )}
  
       

          {/* Order Details */}
          {!loading && order && (
            <div className="max-w-7xl mx-auto p-8 my-8 bg-white shadow-md rounded-xl">
              <h2 className="text-3xl font-bold text-gray-800 border-b pb-4 mb-6">
                Order Details
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* LEFT SIDE */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Customer Info */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div>
                    <h3 className="font-semibold text-lg mb-3 text-gray-700">
                      Customer Info
                    </h3>
                    <p><span className="font-medium">Name:</span> {order?.name}</p>
                    <p><span className="font-medium">Email:</span> {order?.email}</p>
                    <p><span className="font-medium">Phone:</span> {order?.phone}</p>
                  </div>

                  {/* Payment Info */}
                  <div>
                    <h3 className="font-semibold text-lg mb-3 text-gray-700">
                      Payment Info
                    </h3>
                    <p><span className="font-medium">Shipping:</span> ${order?.shipping}</p>
                    <p className="font-semibold"><span className="font-medium">Grand Total:</span> ${order?.grand_total}</p>
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
                  <div>
                    <h3 className="font-semibold text-lg mb-3 text-gray-700">Order Info</h3>
                    <p><span className="font-medium">Order ID:</span> {order?.id}</p>
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
                  <div>
                    <h3 className="font-semibold text-lg mb-3 text-gray-700">Order Items</h3>
                    <div className="overflow-x-auto rounded-lg border">
                      <table className="min-w-full text-sm text-left">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="px-4 py-2">Product Name</th>
                            <th className="px-4 py-2">Image</th>
                            <th className="px-4 py-2">Quantity</th>
                            <th className="px-4 py-2">Size</th>
                            <th className="px-4 py-2">Price</th>
                          </tr>
                        </thead>
                        <tbody>
                          {order.items?.map((item) => (
                            <tr key={item.id} className="border-t">
                              <td className="px-4 py-2">{item?.name}</td>
                              <td className="px-4 py-2">
                                {item?.products?.image_url && (
                                  <img
                                    src={item?.products?.image_url}
                                    alt="Product"
                                    className="w-16 h-16 object-cover rounded"
                                  />
                                )}
                              </td>
                              <td className="px-4 py-2">{item?.qty}</td>
                              <td className="px-4 py-2">{item?.size}</td>
                              <td className="px-4 py-2">${item?.price}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Back Button */}
                  <div className="flex justify-start">
                    <Link
                      to="/admin/orders"
                      className="px-5 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition"
                    >
                      Back to Orders
                    </Link>
                  </div>
                </div>

                {/* RIGHT SIDE - FORM */}
                <div className="p-6 border rounded-lg shadow-md bg-gray-50 h-fit sticky top-6">
                  <h3 className="font-semibold text-xl mb-4 text-gray-800">
                    Update Status
                  </h3>
                  <form onSubmit={handleSubmit(orderUpdateStatus)} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-600">
                        Payment Status
                      </label>
                      <select
                        id="payment_status"
                        defaultValue={order?.payment_status}
                        {...register("payment_status", { required: true })}
                        className="w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="pending">Pending</option>
                        <option value="paid">Paid</option>
                        <option value="not paid">Not Paid</option>
                        <option value="failed">Failed</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-600">
                        Order Status
                      </label>
                      <select
                        id="status"
                        defaultValue={order?.status}
                        {...register("status", { required: true })}
                        className="w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-green-500"
                      >
                        <option value="pending">Pending</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>

                    <button
                      className="w-full px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                      Update Status
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}

  
          <Footer />
        </main>
      </div>
    </div>
  );
  
}

export default OrderDetails;
