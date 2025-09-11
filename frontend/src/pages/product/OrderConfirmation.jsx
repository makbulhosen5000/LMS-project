import React, { useContext, useEffect, useState } from "react";
import { apiUrl, userToken } from "../../components/Http";
import { useParams, Link } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "../../components/common/loader/Loader";

export default function OrderConfirmation() {
  const [order, setOrder] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const { id } = useParams();

  const fetchOrder = async () => {
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
      if (result.status === 200 && result.data) {
        console.log(result.data);
        setOrder(result.data);
        setNotFound(false);

        toast.success(result.message);
      } else {
        setNotFound(true);
        toast.error(result.message || "Order not found!");
      }
    } catch (error) {
      console.error("Error fetching order:", error);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      fetchOrder();
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader/>
      </div>
    );
  }

  if (notFound || !order) {
    return (
      <div className="flex flex-col items-center justify-center h-80 text-center">
        <div className="bg-red-50 border border-red-200 px-10 py-6 rounded-2xl shadow-sm">
          <span className="text-4xl">❌</span>
          <h2 className="mt-3 text-xl font-semibold text-red-700">
            Order Not Found
          </h2>
          <p className="text-gray-600 mt-2">
            Sorry, we couldn’t find an order with ID: <b>{id}</b>.
          </p>
          <Link
            to="//admin/orders"
            className="mt-5 inline-block bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition"
          >
             ← Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow-xl rounded-2xl">
      {/* Success Message */}
      <div className="mb-8 text-center">
        <div className="inline-block px-10 py-5 bg-gradient-to-r from-green-100 to-green-50 border border-green-300 text-green-800 font-semibold rounded-2xl shadow-sm">
          <span className="text-3xl">✅</span>
          <p className="mt-2 text-lg">
            Thank you for your purchase! <br />
            <span className="text-green-700">
              We’ve received your order and it’s being processed.
            </span>
          </p>
        </div>
      </div>

      {/* Order Info */}
      <h2 className="text-2xl font-bold mb-4 border-b pb-2">Order Details</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-50 p-4 rounded-xl shadow-sm">
          <p className="text-gray-700">
            <span className="font-semibold">Order Date:</span>{" "}
            {order?.created_at}
          </p>
          <p className="text-gray-700">
            <span className="font-semibold">Order ID:</span> #{order.id}
          </p>
          <p className="text-gray-700 flex items-center gap-2">
          <span className="font-semibold">Payment_Status:</span>
            {order.status === "pending" && (
              <span className="px-3 py-1 text-sm bg-yellow-100 text-yellow-700 rounded-full">
                Pending
              </span>
            )}
            {order.status === "shipped" && (
              <span className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-full">
                Shipped
              </span>
            )}
            {order.status === "delivered" && (
              <span className="px-3 py-1 text-sm bg-yellow-100 text-yellow-800 rounded-full">
                Delivered
              </span>
            )}
            {order.status === "cancelled" && (
              <span className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-full">
                Cancelled
              </span>
            )}
          </p>
          <p className="text-gray-700">
            <span className="font-semibold">Payment Status:
            {order.payment_method === "stripe" ? 
              <span className="px-3 py-1 text-sm bg-red-100 text-red-400 rounded-full">
                Stripe
              </span>
              :
              <span className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-full">
                Case On Delivery
              </span>
              }
            </span>
          </p>
          <p className="text-gray-700">
            <span className="font-semibold">User ID:</span> {order.user_id}
          </p>
          <p className="text-gray-700">
            <span className="font-semibold">Customer Name:</span> {order?.name}
          </p>
          <p className="text-gray-700">
            <span className="font-semibold">Email:</span> {order?.email}
          </p>
        </div>

        <div className="bg-gray-50 p-4 rounded-xl shadow-sm">
          <p className="text-gray-700">
            <span className="font-semibold">Phone:</span> {order?.phone}
          </p>
          <p className="text-gray-700">
            <span className="font-semibold">Address:</span> {order?.address},{" "}
            {order?.city}, {order?.state}, {order?.zip}
          </p>
          <p className="text-gray-700">
            <span className="font-semibold">Discount:</span> ${order?.discount}
          </p>
          <p className="text-gray-700">
            <span className="font-semibold">Shipping:</span> ${order?.shipping}
          </p>
          <p className="text-gray-700 font-semibold text-lg">
            Grand Total:{" "}
            <span className="text-green-600">${order?.grand_total}</span>
          </p>
        </div>
      </div>

      {/* Products Table */}
      <h3 className="text-xl font-semibold mb-3">Ordered Products</h3>
      <div className="overflow-x-auto rounded-xl shadow-md">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-3 text-left">Product</th>
              <th className="px-4 py-3 text-left">Size</th>
              <th className="px-4 py-3 text-center">Qty</th>
              <th className="px-4 py-3 text-right">Unit Price</th>
              <th className="px-4 py-3 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {order.items?.map((item, idx) => (
              <tr
                key={item.id}
                className={`${
                  idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                } hover:bg-gray-100 transition`}
              >
                <td className="px-4 py-3">{item?.name}</td>
                <td className="px-4 py-3">{item?.size}</td>
                <td className="px-4 py-3 text-center">{item?.qty}</td>
                <td className="px-4 py-3 text-right">${item?.unit_price}</td>
                <td className="px-4 py-3 text-right font-medium text-gray-800">
                  ${item.price}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-6 flex justify-center gap-4">
          {/* Continue Shopping */}
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-6 py-3 text-white bg-blue-600 
                      rounded-xl shadow-md hover:from-green-600 hover:to-green-700 hover:bg-blue-900 hover:shadow-lg transition-all duration-300"
          >
            🛒 Continue Shopping
          </Link>

            {/* Back to Orders */}
            <Link
              to="/account/user/orders"
              className="inline-flex items-center gap-2 px-6 py-3 text-white  bg-blue-400  
                        rounded-xl shadow-md hover:bg-blue-600 hover:shadow-lg transition-all duration-300"
            >
                ← Back to Orders
            </Link>
        </div>
    </div>
  );
}
