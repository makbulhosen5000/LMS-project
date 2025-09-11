import { LogOut } from 'lucide-react'
import React, { useContext } from 'react'
import { Link, useLocation } from 'react-router-dom';
import { AdminAuthContext } from '../../../provider/AdminAuthProvider';

export default function Sidebar() {
    const { logOut } = useContext(AdminAuthContext);
    const location = useLocation(); // Get current path

    // Function to determine active class
    const getLinkClass = (path) => {
        return location.pathname === path
            ? "block px-4 py-2 rounded-lg bg-blue-600 text-white font-medium" // active
            : "block px-4 py-2 rounded-lg bg-blue-100 text-blue-700 font-medium"; // inactive
    }

    return (
        <aside className="w-64 bg-blue-950 p-6 shadow-lg">
            <Link to="/admin/dashboard">
            <h1 className="text-2xl font-bold text-white mb-8">Dashboard</h1>
            </Link>
            <nav className="space-y-3">
                <Link to="/admin/dashboard" className={getLinkClass("/admin/dashboard")}>Dashboard</Link>
                <Link to="/admin/categories" className={getLinkClass("/admin/categories")}>Categories</Link>
                <Link to="/admin/brands" className={getLinkClass("/admin/brands")}>Brand</Link>
                <Link to="/admin/products" className={getLinkClass("/admin/products")}>Products</Link>  
                <Link to="/admin/orders" className={getLinkClass("/admin/orders")}>Orders</Link>
                <Link to="/admin/create-shipping" className={getLinkClass("/admin/create-shipping")}>Shipping</Link>

                <button 
                    className="w-48 flex items-center justify-center gap-2  text-white px-4 py-2 rounded bg-red-600 hover:bg-red-800 transition" 
                    onClick={logOut}>
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </nav>
        </aside>
    )
}
