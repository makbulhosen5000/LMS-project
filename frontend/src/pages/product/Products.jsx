import React, { useEffect, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { apiUrl } from '../../components/Http';
import Loader from '../../components/common/loader/Loader';

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
    <section  className="bg-gray-200 mt-5">
        <div className="container mx-auto">
          <div className='flex sm:flex-auto gap-3 justify-between items-center p-4 bg-white shadow-md rounded-lg'>
            <div>
                <h1 className='font-bold text-3xl text-red-600'>Categories</h1>
                <div className='p-1 flex flex-auto gap-2'>
                    {
                        categories && categories.map((category) => (
                            <div key={category?.id}>
                                <input type="checkbox" 
                                defaultChecked = {
                                          searchParams.get('category')
                                          ?
                                          searchParams.get('category').includes(category?.id)
                                          :false
                                          }

                                value={category?.id}
                                onClick={handleCategory}
                                />  
                                <label> {category?.name}</label>
                            </div>
                        ))
                    }
                </div>
            </div>
            <div>
                <h1 className='font-bold text-3xl text-red-600'>Brands</h1>
                <div className='p-1 flex flex-auto gap-2'>
                {
                    brands && brands.map((brand) => (
                        <div key={brand?.id}>
                            <input type="checkbox"
                            defaultChecked = {
                              searchParams.get('brand')
                              ?
                              searchParams.get('brand').includes(brand?.id)
                              :false
                              }
                            value={brand?.id}
                            onClick={handleBrand}
                            />  
                            <label> {brand?.name}</label>
                        </div>
                    ))
                }
                </div>
            </div>
            
          </div>
            {/* Product section */}
            <div className="py-5">
                    <h2 className="text-2xl md:text-2xl font-bold mb-4 text-red-600">Shop</h2>
                    <div className='grid grid-1 sm:grid-col-1 md:grid-cols-4 lg:grid-cols-5 gap-3'>
                     {
                        loading ?
                        <Loader/>
                        :
                        products && products.map((product) => (
                            <div className=" max-w-sm mx-auto bg-white/70 backdrop-blur-md border border-black  rounded-2xl shadow-2xl overflow-hidden transition transform hover:scale-105 duration-300" key={product?.id}>
                                <div className="relative">
                                    <img className="w-full h-64 object-cover" src={product?.image_url} alt="Product image"/>
                                </div>
                                <div className="p-5">
                                    <h3 className="text-lg text-gray-800">{product?.title}</h3>
                                    {/* <p className="text-sm text-gray-600 mt-1">
                                    {product?.short_description?.slice(0, 100)}
                                    </p> */}
                                    <div className="mt-4 flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        {      
                                            product?.discount_price && 
                                            <span className="text-lg font-semibold text-gray-800">${product?.discount_price}</span>
                                        }
                                            <span className="text-sm line-through text-gray-400">${product?.price}</span>
                                    </div>
                                    <Link to={`/product/${product.id}`}> 
                                    <button className="bg-black text-white px-4 py-2 rounded-xl hover:bg-gray-800 transition duration-200">
                                        Buy Now
                                    </button>
                                    </Link> 
                                    </div>
                                </div>
                            </div>
                        ))
                      }
                    </div>
            </div>
             
            {/* latest product section */}
            <div className='mb-4'>             
                <h2 className="text-2xl md:text-2xl font-bold mb-4 text-red-600">Latest Product</h2>
                <div className='grid sm:grid-col-1 md:grid-cols-5 lg:grid-cols-5 gap-4'>
                {
                    latestProducts && latestProducts.map((latestProduct) => (
                        <div className=" max-w-sm mx-auto bg-white/70 backdrop-blur-md border border-black  rounded-2xl shadow-2xl overflow-hidden transition transform hover:scale-105 duration-300" key={latestProduct.id}>
                            <div className="relative">
                                <img className="w-full h-64 object-fit" src={latestProduct?.image_url} alt="Product image"/>
                            </div>
                            <div className="p-5">
                                <h3 className="text-lg text-gray-800">{latestProduct?.title}</h3>
                                <div className="mt-4 flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    {      
                                        latestProduct?.discount_price && 
                                        <span className="text-lg font-semibold text-gray-800">${latestProduct?.discount_price}</span>
                                    }
                                        <span className="text-sm line-through text-gray-400">${latestProduct?.price}</span>
                                </div>
                                <Link to={`/product/${latestProduct.id}`}> 
                                <button className="bg-black text-white px-4 py-2 rounded-xl hover:bg-gray-800 transition duration-200">
                                    Buy Now
                                </button>
                                </Link> 
                                </div>
                            </div>
                        </div>
                    ))
                  }
                </div>
            </div>
             {/* featured product section */}
            <div className=" mb-4 ">
                <h2 className="text-2xl md:text-2xl font-bold mb-4 text-red-600">Feature Product</h2>
                <div className='grid grid-1 sm:grid-col-1 md:grid-cols-4 lg:grid-cols-5 gap-4'>
                {
                    featuredProducts && featuredProducts.map((featuredProduct) => (
                        <div className=" max-w-sm mx-auto bg-white/70 backdrop-blur-md border border-black  rounded-2xl shadow-2xl overflow-hidden transition transform hover:scale-105 duration-300" key={featuredProduct.id}>
                            <div className="relative">
                                <img className="w-full h-64 object-fit" src={featuredProduct?.image_url} alt="Product image"/>
                            </div>
                            <div className="p-5">
                                <h3 className="text-lg text-gray-800">{featuredProduct?.title}</h3>
                                <div className="mt-4 flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    {      
                                        featuredProduct?.discount_price && 
                                        <span className="text-lg font-semibold text-gray-800">${featuredProduct?.discount_price}</span>
                                    }
                                        <span className="text-sm line-through text-gray-400">${featuredProduct?.price}</span>
                                </div>
                                <Link to={`/product/${featuredProduct.id}`}> 
                                <button className="bg-black text-white px-4 py-2 rounded-xl hover:bg-gray-800 transition duration-200">
                                    Buy Now
                                </button>
                                </Link> 
                                </div>
                            </div>
                        </div>
                    ))
                  }
                </div>
            </div>
        </div>
    </section>
    
     </>
  )
}
