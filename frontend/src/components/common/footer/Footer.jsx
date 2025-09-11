import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF } from "react-icons/fa6";
import { FaLinkedinIn } from "react-icons/fa6";
import { FaYoutube } from "react-icons/fa6";
import { FaGithubAlt } from "react-icons/fa6";

export const Footer = () => {

    const linkedin = "https://www.linkedin.com/in/md-makbul-hosen-5620b1158/"
    const facebook = "https://www.facebook.com/mhakash5000"
    const youtube = "https://www.youtube.com/channel/UCcRI2NfB56P2gvt9jdJ-MSA"
    const github = "https://github.com/makbulhosen5000"
    return (
        <footer className="bg-green-600  shadow dark:bg-green-600">
            <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
                <div className="sm:flex sm:items-center sm:justify-between">
                    <div className="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse">
                       <Link to={github} target='_blank'>
                       <FaGithubAlt className='bg-yellow-300 h-8 w-8 rounded p-1' />
                       </Link>
                       <Link to={linkedin} target='_blank'>
                       <FaLinkedinIn className='bg-yellow-300 h-8 w-8 rounded p-1' />
                       </Link>
                       <Link to={facebook} target='_blank'>
                       <FaFacebookF className='bg-yellow-300 h-8 w-8 rounded p-1' />
                       </Link>
                       <Link to={youtube} target='_blank'>
                       <FaYoutube className='bg-yellow-300 h-8 w-8 rounded p-1' />
                       </Link>
                    </div>
                    
                    <ul className="flex flex-wrap items-center mb-6 text-sm font-medium text-white sm:mb-0 dark:text-white">
                        <li>
                            <Link to="/" className="hover:underline me-4 md:me-6">Home</Link>
                        </li>
                        <li>
                            <Link to="/skill" className="hover:underline me-4 md:me-6">Skills</Link>
                        </li>
                        <li>
                            <Link to="/skill" className="hover:underline me-4 md:me-6">Projects</Link>
                        </li>
                        <li>
                            <Link to="/contact" className="hover:underline me-4 md:me-6">Contact</Link>
                        </li>
                    </ul>
                </div>
                <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
                <span className="block text-sm text-white sm:text-center dark:white">© 2025 All Rights Reserved.</span>
            </div>
        </footer>
    );
};
