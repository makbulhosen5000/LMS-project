import React from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaLinkedinIn, FaYoutube, FaGithubAlt } from "react-icons/fa6";

export const Footer = () => {
  const linkedin = "https://www.linkedin.com/in/md-makbul-hosen-5620b1158/";
  const facebook = "https://www.facebook.com/mhakash5000";
  const youtube = "https://www.youtube.com/channel/UCcRI2NfB56P2gvt9jdJ-MSA";
  const github = "https://github.com/makbulhosen5000";

  return (
    <footer className="bg-gray-900 text-gray-300 border-t border-gray-700">
      <div className="max-w-7xl mx-auto px-6 py-8 md:py-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          {/* Left section */}
          <div className="mb-6 md:mb-0">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-white">MAK</span>
              <span className="text-2xl font-bold text-yellow-400">Fashion</span>
            </Link>
            <p className="text-sm mt-2 text-gray-400">
              © 2025 MAK Fashion. All rights reserved.
            </p>
          </div>

          {/* Right section */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-8">
            {/* Quick Links */}
            <ul className="flex flex-wrap items-center mb-4 sm:mb-0 text-sm font-medium space-x-6">
              <li>
                <Link to="/" className="hover:text-yellow-400 transition">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/skill" className="hover:text-yellow-400 transition">
                  Skills
                </Link>
              </li>
              <li>
                <Link to="/projects" className="hover:text-yellow-400 transition">
                  Projects
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-yellow-400 transition">
                  Contact
                </Link>
              </li>
            </ul>

            {/* Social Icons */}
            <div className="flex space-x-4">
              <Link to={github} target="_blank" rel="noreferrer">
                <FaGithubAlt className="h-8 w-8 p-1 rounded-full bg-yellow-400 text-gray-900 hover:scale-110 transition transform" />
              </Link>
              <Link to={linkedin} target="_blank" rel="noreferrer">
                <FaLinkedinIn className="h-8 w-8 p-1 rounded-full bg-yellow-400 text-gray-900 hover:scale-110 transition transform" />
              </Link>
              <Link to={facebook} target="_blank" rel="noreferrer">
                <FaFacebookF className="h-8 w-8 p-1 rounded-full bg-yellow-400 text-gray-900 hover:scale-110 transition transform" />
              </Link>
              <Link to={youtube} target="_blank" rel="noreferrer">
                <FaYoutube className="h-8 w-8 p-1 rounded-full bg-yellow-400 text-gray-900 hover:scale-110 transition transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
