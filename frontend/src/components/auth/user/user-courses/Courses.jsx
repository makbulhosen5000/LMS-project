import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MdDelete } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import {apiUrl, userTokenLms } from '../../../common/Config';
import Loader from '../../../common/Loader';
import RecordNotFound from '../../../common/RecordNotFound';
import { toast } from 'react-toastify';
import UserSidebar from '../user-dashboard/UserSidebar';
import UserTopbar from '../user-dashboard/UserTopBar';


function Courses() {
  const [Course, setCourse] = useState([]);
  
  const fetchCourses = async () => {
    try {
      const response = await fetch(`${apiUrl}/courses`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${userTokenLms()}`,
        },
      });

      const result = await response.json();
      setCourse(result.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCourses();
    }, 1000);

    return () => clearTimeout(timer);
  }, []);



  return (
    <div className="bg-gray-100 font-sans">
      <div className="min-h-screen flex">
        <UserSidebar/>
        <main className="flex-1 pl-4">
           {/* <!-- Topbar --> */}
          <UserTopbar/>
          <div className="max-w-6xl mx-auto p-4 my-4 bg-white shadow-lg rounded-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">My Courses</h2>
              <Link to="/account/user/create-course" className="inline-flex items-center bg-green-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
                <i className="fa-solid fa-plus mr-2"></i> Create Courses
              </Link>
            </div>

            <div className="overflow-x-auto">
              
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Courses;
