import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Banner() {
  return (
    <header className="relative overflow-hidden bg-gray-900">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "linear-gradient(rgba(8,7,7,0.6), rgba(8,7,7,0.6)), url('https://images.unsplash.com/photo-1562813733-b31f71025d54?w=500&auto=format&fit=crop')",
        }}
      ></div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12 py-20 lg:py-28 grid lg:grid-cols-12 gap-10 items-center">
        {/* Left side text */}
        <motion.div
          className="lg:col-span-7 text-white"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.span
            className="inline-block bg-yellow-400 text-gray-900 font-semibold text-xs uppercase tracking-wide px-3 py-1 rounded-full shadow-sm mb-4"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
          >
            New Course
          </motion.span>

          <motion.h1
            className="text-4xl lg:text-5xl font-extrabold leading-tight"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            Learn Modern Web Development
          </motion.h1>

          <motion.p
            className="mt-4 text-lg text-gray-200 max-w-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            Master coding, build real projects, and boost your career in tech. 
            Learn at your own pace with interactive courses.
          </motion.p>

          <motion.div
            className="mt-8 flex flex-wrap gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            <Link
              to="/courses"
              className="px-6 py-3 rounded-lg bg-yellow-400 text-gray-900 font-semibold shadow hover:scale-105 transform transition"
            >
              Start Learning
            </Link>
            <Link
              to="/about"
              className="px-6 py-3 rounded-lg border border-yellow-400 text-yellow-400 font-medium hover:bg-yellow-500/10 transition"
            >
              Learn More
            </Link>
          </motion.div>
        </motion.div>

        {/* Right side student image */}
        <motion.div
          className="lg:col-span-5 flex justify-center lg:justify-end"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          <div className="w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl">
            <img
              src="https://media.istockphoto.com/id/2200018679/photo/two-male-software-developers-meeting-on-multiple-computer-screens-displaying-programming-code.webp?a=1&b=1&s=612x612&w=0&k=20&c=bzF9aDv8S_I5hCNNVTjVFhWR_0SE4PgU7nP2svFFa0Y="
              alt="Student learning on computer"
              className="w-full h-64 object-cover"
            />
            <div className="px-4 py-4 bg-white">
              <h3 className="text-lg font-bold text-gray-900">Interactive Coding</h3>
              <p className="text-gray-600 text-sm mt-1">
                Hands-on projects, real-world experience.
              </p>
              <div className="mt-4">
                <Link
                  to="/courses"
                  className="px-3 py-2 bg-green-700 text-white rounded-md text-sm font-medium hover:bg-green-800 transition"
                >
                  Explore
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </header>
  );
}
