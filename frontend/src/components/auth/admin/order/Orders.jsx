import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../dashboard/Sidebar';
import Topbar from '../dashboard/Topbar';
import Loader from '../../../common/Loader';
import Footer from '../dashboard/Footer';
import { adminToken, apiUrl } from '../../../common/Http';



function Order() {
    
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = orders?.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(orders.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const fetchOrders = async () => {
    try {
      const response = await fetch(`${apiUrl}/order`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${adminToken()}`,
        },
      });

      const result = await response.json();
      setOrders(result.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };
  


  useEffect(() => {
    const timer = setTimeout(() => {
      fetchOrders();
    }, 1000);

    return () => clearTimeout(timer);
  }, []);
  


  return (
    <div className="bg-gray-100 font-sans">
      <div className="min-h-screen flex">
        <Sidebar />
        <main className="flex-1 pl-4">
          <Topbar/>
          <div className="max-w-6xl mx-auto p-4 my-4 bg-white shadow-lg rounded-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">order List</h2>
              
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-center text-sm text-gray-700">
                <thead className="bg-gray-100 text-gray-700 uppercase text-sm">
                  <tr>
                    <th className="px-6 py-3">ID</th>
                    <th className="px-6 py-3">Name</th>
                    <th className="px-6 py-3">Email</th>
                    <th className="px-6 py-3">Grand Total</th>
                    <th className="px-6 py-3">Date</th>
                    <th className="px-6 py-3">Payment Status</th>
                    <th className="px-6 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={8}>
                        <div>
                          <Loader />
                        </div>
                      </td>
                    </tr>
                  ) : orders?.length === 0 ? (
                    <tr>
                      <td colSpan={8}>
                        <div className="flex justify-center items-center h-32 text-gray-600 font-semibold">
                          <h1>Order Not Found</h1>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    currentItems.map((order, index) => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                         <Link to={`/admin/order-details/${order.id}`}>
                          { order.id}
                          </Link>
                        </td>
                        <td className="px-6 py-4">{order?.name}</td>
                        <td className="px-6 py-4">${order?.email}</td>
                        <td className="px-6 py-4">${order?.grand_total}</td>
                        <td className="px-6 py-4">{order?.created_at}</td>
                  
                        <td className="px-6 py-4">
                           <span className={`inline-block ${order.payment_status === "paid" ? 'bg-green-600' : 'bg-red-600'} text-white text-xs font-semibold px-2.5 py-0.5 rounded`}>
                            {order.payment_status === 'paid' ? 'Paid' : 'Not Paid'}
                           </span>
                        </td>
                        <td className="px-6 py-4"> 
                            {order.status === "pending" && (
                            <span className="px-3 py-1 text-sm bg-yellow-300 text-yellow-900 rounded-full">
                                Pending
                            </span>
                            )}
                            {order.status === "shipped" && (
                            <span className="px-3 py-1 text-sm bg-green-500 text-green-900 rounded-full">
                                Shipped
                            </span>
                            )}
                            {order.status === "delivered" && (
                            <span className="px-3 py-1 text-sm bg-green-600 text-green-900 rounded-full">
                                Delivered
                            </span>
                            )}
                            {order.status === "cancelled" && (
                            <span className="px-3 py-1 text-sm bg-red-600 text-red-900 rounded-full">
                                Cancelled
                            </span>
                            )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

              {totalPages > 1 && (
                <div className="flex justify-center mt-4 space-x-2">
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => paginate(i + 1)}
                      className={`px-4 py-2 border rounded ${currentPage === i + 1 ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          {/* <!-- Footer --> */}
          <Footer/>
        </main>
      </div>
    </div>
  );
}

export default Order;
