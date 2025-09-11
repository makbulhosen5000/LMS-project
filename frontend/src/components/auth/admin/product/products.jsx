import React, { useEffect, useState } from 'react';
import Sidebar from '../dashboard/Sidebar';
import { Link } from 'react-router-dom';
import { MdDelete } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import { adminToken, apiUrl } from '../../../Http';
import Loader from '../../../common/loader/Loader';
import RecordNotFound from '../../../common/RecordNotFound';
import { toast } from 'react-toastify';
import Topbar from '../dashboard/Topbar';
import Footer from '../dashboard/Footer';

function Product() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = products.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(products.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${apiUrl}/products`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${adminToken()}`,
        },
      });

      const result = await response.json();
      setProducts(result.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };
  
  // delete product function
  const deleteProduct = async (id) => {
    if (window.confirm("Are you sure you want to delete this Product?")) {
      try {
        const response = await fetch(`${apiUrl}/products/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${adminToken()}`,
          },
        });

        const result = await response.json();

        if (result.status === 200) {
          const productDelete = products.filter((product) => product.id !== id);
          setProducts(productDelete);
          setCurrentPage(1); // Reset to page 1 after delete
          toast.success(result.message);
        } else {
          toast.error(result.message || "Failed to delete Product.");
        }
      } catch (error) {
        console.error("Error deleting Product:", error);
        toast.error("Something went wrong.");
      }
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts();
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
              <h2 className="text-2xl font-bold text-gray-800">Product List</h2>
              <Link to="/admin/products/create" className="inline-flex items-center bg-green-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
                <i className="fa-solid fa-plus mr-2"></i> Add Product
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-center text-sm text-gray-700">
                <thead className="bg-gray-100 text-gray-700 uppercase text-sm">
                  <tr>
                    <th className="px-6 py-3">ID</th>
                    <th className="px-6 py-3">Image</th>
                    <th className="px-6 py-3">Title</th>
                    <th className="px-6 py-3">Price</th>
                    <th className="px-6 py-3">Qty</th>
                    <th className="px-6 py-3">Sku</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Action</th>
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
                  ) : products.length === 0 ? (
                    <tr>
                      <td colSpan={8}>
                        <div className="flex justify-center items-center h-32 text-gray-600 font-semibold">
                          <RecordNotFound recordTitle="Product Not Found" />
                        </div>
                      </td>
                    </tr>
                  ) : (
                    currentItems.map((product, index) => (
                      <tr key={product.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">{indexOfFirstItem + index + 1}</td>
                        <td className="px-6 py-4">
                          {
                            product?.image_url ? 
                              <img src={product?.image_url} alt="Product Image" width={70} />
                             : 
                              <img src="https://placehold.co/70X70"  />
                            
                          }
                        </td>
                        <td className="px-6 py-4">{product?.title}</td>
                        <td className="px-6 py-4">${product?.price}</td>
                        <td className="px-6 py-4">{product?.qty}</td>
                        <td className="px-6 py-4">{product?.sku}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-block ${Product.status === 1 ? 'bg-green-600' : 'bg-red-600'} text-white text-xs font-semibold px-2.5 py-0.5 rounded`}>
                            {product.status === 1 ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-2 py-3 space-x-2">
                          <Link to={`/admin/products/edit/${product.id}`} className="inline-flex items-center bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 transition">
                            <FaRegEdit />
                          </Link>
                          <button onClick={() => deleteProduct(product.id)} className="inline-flex items-center bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700 transition">
                            <MdDelete />
                          </button>
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

export default Product;
