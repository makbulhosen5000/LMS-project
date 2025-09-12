import React, { useEffect, useState } from "react";
import { apiUrl, userToken } from "../../components/common/Config";
import { useParams } from "react-router-dom";

export default function OrderSummery () {
    const [order,setOrder] = useState([]);
    const [loading,setLoading] = useState(true);
    const {id} = useParams();

  if (!order) {
    return <p className="text-center text-gray-600">No order found</p>;
  }

  const fetchOrder = async (e) => {
      e.preventDefault();
      try {
        const response = await fetch(`${apiUrl}/get-order-details/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${userToken()}`,
          },
        });
  
        const result = await response.json();
        console.log(result.data);
        setOrder(result.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching order:", error);
      }
    };
  
 
   useEffect(() => {
       fetchOrder();
   },[]);
   
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-2xl">
      {/* order Info */}
      <h2 className="text-2xl font-bold mb-4">order Details</h2>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <p className="text-gray-600">
            <span className="font-semibold">order Date:</span> {order?.created_at}
          </p>
          <p className="text-gray-600">
            {
              order?.status == 'pending' && <span className="px-2 py-1 bg-blue-200 text-blue-800 rounded-full text-sm">Pending</span> 
            }
            {
              order?.status == 'shipped' && <span className="px-2 py-1 bg-green-200 text-green-800 rounded-full text-sm">Shipped</span>
            }
            {
              order?.status == 'delivered' && <span className="px-2 py-1 bg-purple-200 text-purple-800 rounded-full text-sm">Delivered</span>
            }
            {
              order?.status == 'cancelled' && <span className="px-2 py-1 bg-red-200 text-red-800 rounded-full text-sm">Cancelled</span>
            }


          </p>
          <p className="text-gray-600">
            <span className="font-semibold">Customer Name:</span> {order?.name}
          </p>
          <p className="text-gray-600">
            <span className="font-semibold">Email:</span> {order.email}
          </p>
        </div>
        <div>
          <p className="text-gray-600">
            <span className="font-semibold">Phone:</span> {order.phone}
          </p>
          <p className="text-gray-600">
            <span className="font-semibold">Address:</span> {order.address}, {order.city}, {order.state}, {order.zip}
          </p>
          <p className="text-gray-600">
            <span className="font-semibold">Total:</span> ${order.grand_total}
          </p>
        </div>
      </div>

      {/* Products Table */}
      <h3 className="text-xl font-semibold mb-3">ordered Products</h3>
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Product Name</th>
              <th className="px-4 py-2 text-left">Size</th>
              <th className="px-4 py-2 text-center">Qty</th>
              <th className="px-4 py-2 text-right">Unit Price</th>
              <th className="px-4 py-2 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {order.orderItems?.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="px-4 py-2">{item.name}</td>
                <td className="px-4 py-2">{item.size}</td>
                <td className="px-4 py-2 text-center">{item.qty}</td>
                <td className="px-4 py-2 text-right">${item.unit_price}</td>
                <td className="px-4 py-2 text-right">${item.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};


