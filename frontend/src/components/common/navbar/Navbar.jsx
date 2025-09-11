import React, { useContext, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaCartPlus, FaRegUserCircle } from "react-icons/fa";
import { CartContext } from "../../provider/CartProvider";
import { UserAuthContext } from "../../provider/UserAuthProvider";

const Navbar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);

  const { getQty } = useContext(CartContext);
  const { user } = useContext(UserAuthContext);

  const navLinkClass = (path) =>
    `px-4 py-2 rounded-md text-sm font-semibold transition duration-300 ${
      location.pathname === path
        ? "text-yellow-400 border-b-2 border-yellow-400"
        : "text-gray-300 hover:text-white hover:border-b-2 hover:border-yellow-400"
    }`;

  const navItems = (
    <>
      <Link to="/" className={navLinkClass("/")}>
        Home
      </Link>
      <Link to="/shop" className={navLinkClass("/shop")}>
        Shop
      </Link>

      {user?.name ? (
        <Link
          to="/account/user/dashboard"
          className={navLinkClass("/account/user/dashboard")}
        >
          <FaRegUserCircle size={20} />
        </Link>
      ) : (
        <Link
          to="/account/user/login"
          className={navLinkClass("/account/user/login")}
        >
          <FaRegUserCircle size={20} />
        </Link>
      )}

      <Link to="/cart" className={navLinkClass("/cart")}>
        <div className="relative flex items-center">
          <FaCartPlus size={22} />
          {getQty() > 0 && (
            <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full shadow">
              {getQty()}
            </span>
          )}
        </div>
      </Link>
    </>
  );

  return (
    <nav className="backdrop-blur-md bg-gray-900/80 sticky top-0 z-50 shadow-lg border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center space-x-1">
              <span className="font-extrabold text-2xl text-white tracking-wide">
                MAK
              </span>
              <span className="font-extrabold text-yellow-400">Fashion</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              type="button"
              aria-label="Toggle menu"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-300 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              {!isOpen ? (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden px-4 pt-3 pb-4 space-y-2 bg-gray-900/95 shadow-inner border-t border-gray-700">
          {navItems}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
