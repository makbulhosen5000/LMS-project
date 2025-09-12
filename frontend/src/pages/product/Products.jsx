import React, { useEffect, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { apiUrl } from '../../components/Http';
import Loader from '../../components/pages/loader/Loader';

export default function Products() {
    // get ,category,brand, latest products,single product from the API
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [products, setProducts] = useState([]);
    const [latestProducts, setLatestProducts] = useState([]);
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    /* 
      * Initialize state for category and brand checkboxes
      * These states will be used to manage the selected filters
      * The `useSearchParams` hook is used to manage the URL search parameters
      * This allows the user to filter products by category and brand
      * when reloading the page, category,brand will keep the selected filters
    */
    const [searchParams, setSearchParams] = useSearchParams([]);
    const [catChecked, setCatChecked] = useState(()=>{
         const category = searchParams.get("category");
         return category ? category.split(",") : [];
    });
    const [brandChecked, setBrandChecked] = useState(()=>{
      const brand = searchParams.get("brand");
      return brand ? brand.split(",") : [];
    })

    // Get the product ID from the URL parameters
    const {id} = useParams();
    

    // Fetch all category data from the API
    const getCategories = async () => {
      try {
        const response = await fetch(`${apiUrl}/get-categories`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        });

        const result = await response.json(); 
          setCategories(result.data);  
          setLoading(false);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
   // Fetch all category data from the API
   const getBrands = async () => {
      try {
        const response = await fetch(`${apiUrl}/get-brands`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        });

        const result = await response.json(); 
          setBrands(result.data);  
          setLoading(false);
      } catch (error) {
        console.error("Error fetching brands:", error);
      }
   };
    // Fetch all products data from the API
    const getProducts = async () => {
       
        try {
           // If `catChecked` is an array of categories
           let search = [];
          let params = '';
          // for category
          if (catChecked.length > 0) {
            search.push(["category", catChecked]);
          }
           // for brand
           if (brandChecked.length > 0) {
            search.push(["brand", brandChecked]);
          }
          if (search.length > 0) {
            params = new URLSearchParams(search);
            setSearchParams(params);
          }else{
            setSearchParams([]);
          }
         

          console.log("Params:", params.toString());
            const response = await fetch(`${apiUrl}/get-products?${params}`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
              },
            });
    
            const result = await response.json(); 
              setProducts(result.data);
              setLoading(false);   
          } catch (error) {
            console.error("Error fetching products:", error);
          }
    };

    // Fetch latest product data from the API
    const getLatestProducts = async () => {
        try {
          const response = await fetch(`${apiUrl}/get-latest-product`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
          });
  
          const result = await response.json(); 
            setLatestProducts(result.data);  
            setLoading(false); 
        } catch (error) {
          console.error("Error fetching latest product:", error);
        }
    };
     // Fetch featured product data from the API
    const getFeaturedProducts = async () => {
      try {
        const response = await fetch(`${apiUrl}/get-featured-product`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        });

        const result = await response.json(); 
        setFeaturedProducts(result.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching latest product:", error);
      }
    };
    // Handle category filter
    const handleCategory = (e) => {
        const {checked,value}= e.target;
        if(checked){
            setCatChecked(prev=>[...prev,value]);
        }else{
            setCatChecked(catChecked.filter(id => id != value));
        }
    }
    // Handle brand filter
    const handleBrand = (e) =>{
      const {checked,value}= e.target;
        if(checked){
            setBrandChecked(prev=>[...prev,value]);
        }else{
            setBrandChecked(brandChecked.filter(id => id != value));
        }
    }
    useEffect(() => {
        setTimeout(() => {
            getLatestProducts();
            getFeaturedProducts();
            getCategories();
            getBrands();
            getProducts();
        },1000);
    }, [catChecked,brandChecked]);
 
  return (
    <>
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
          {/* Video Section */}
     
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-8 text-center">
              Explore Courses
            </h2>

            {/* Video Section */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {/* Video Card */}
                <div className="relative group rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition duration-300 cursor-pointer">
                  {/* Thumbnail */}
                  <img
                    src="https://images.unsplash.com/photo-1581091215364-9f86534f3480?q=80&w=400&auto=format&fit=crop"
                    alt="Video"
                    className="w-full h-48 object-cover transform group-hover:scale-105 transition duration-300"
                  />

                  {/* Duration Badge */}
                  <span className="absolute top-2 right-2 bg-black bg-opacity-70 text-white text-xs font-semibold px-2 py-1 rounded-lg">
                    12:34
                  </span>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-25 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300">
                    <span className="text-white font-bold px-3 py-1 bg-green-600 rounded-lg">Watch</span>
                  </div>

                  {/* Video Title & Description */}
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      React Tutorial for Beginners
                    </h3>
                    <p className="text-gray-500 text-sm">
                      Learn React basics step by step.
                    </p>
                  </div>
                </div>
                <div className="relative group rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition duration-300 cursor-pointer">
                  {/* Thumbnail */}
                  <img
                    src="https://images.unsplash.com/photo-1581091215364-9f86534f3480?q=80&w=400&auto=format&fit=crop"
                    alt="Video"
                    className="w-full h-48 object-cover transform group-hover:scale-105 transition duration-300"
                  />

                  {/* Duration Badge */}
                  <span className="absolute top-2 right-2 bg-black bg-opacity-70 text-white text-xs font-semibold px-2 py-1 rounded-lg">
                    12:34
                  </span>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-25 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300">
                    <span className="text-white font-bold px-3 py-1 bg-green-600 rounded-lg">Watch</span>
                  </div>

                  {/* Video Title & Description */}
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      React Tutorial for Beginners
                    </h3>
                    <p className="text-gray-500 text-sm">
                      Learn React basics step by step.
                    </p>
                  </div>
                </div>
                <div className="relative group rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition duration-300 cursor-pointer">
                  {/* Thumbnail */}
                  <img
                    src="https://images.unsplash.com/photo-1581091215364-9f86534f3480?q=80&w=400&auto=format&fit=crop"
                    alt="Video"
                    className="w-full h-48 object-cover transform group-hover:scale-105 transition duration-300"
                  />

                  {/* Duration Badge */}
                  <span className="absolute top-2 right-2 bg-black bg-opacity-70 text-white text-xs font-semibold px-2 py-1 rounded-lg">
                    12:34
                  </span>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-25 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300">
                    <span className="text-white font-bold px-3 py-1 bg-green-600 rounded-lg">Watch</span>
                  </div>

                  {/* Video Title & Description */}
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      React Tutorial for Beginners
                    </h3>
                    <p className="text-gray-500 text-sm">
                      Learn React basics step by step.
                    </p>
                  </div>
                </div>
                <div className="relative group rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition duration-300 cursor-pointer">
                  {/* Thumbnail */}
                  <img
                    src="https://images.unsplash.com/photo-1581091215364-9f86534f3480?q=80&w=400&auto=format&fit=crop"
                    alt="Video"
                    className="w-full h-48 object-cover transform group-hover:scale-105 transition duration-300"
                  />

                  {/* Duration Badge */}
                  <span className="absolute top-2 right-2 bg-black bg-opacity-70 text-white text-xs font-semibold px-2 py-1 rounded-lg">
                    12:34
                  </span>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-25 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300">
                    <span className="text-white font-bold px-3 py-1 bg-green-600 rounded-lg">Watch</span>
                  </div>

                  {/* Video Title & Description */}
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      React Tutorial for Beginners
                    </h3>
                    <p className="text-gray-500 text-sm">
                      Learn React basics step by step.
                    </p>
                  </div>
                </div>
              </div>
            

          </div>    
        </div>
    </section>
    
     </>
  )
}
