import React from 'react'

function Categories() {
  return (
    <section  className="bg-gray-200">
        <div className="container mx-auto">
          {/* Category section */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-8 text-center">
              Explore Categories
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden transform hover:scale-105 transition duration-300">
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Web Development
                  </h3>
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden transform hover:scale-105 transition duration-300">
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Web Development
                  </h3>
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden transform hover:scale-105 transition duration-300">
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Web Development
                  </h3>
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden transform hover:scale-105 transition duration-300">
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Web Development
                  </h3>
                </div>
              </div>

            </div>
          </div>   
        </div>
    </section>
  )
}

export default Categories