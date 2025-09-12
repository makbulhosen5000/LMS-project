import React, { useEffect, useState,useRef, useMemo } from 'react'
import Sidebar from '../dashboard/Sidebar'
import { Link, useNavigate } from 'react-router-dom'
import { adminToken, apiUrl } from '../../../common/Http';
import { set, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import JoditEditor from 'jodit-react';
import Topbar from '../dashboard/Topbar';
import Footer from '../dashboard/Footer';

function CreateProduct({ placeholder }) {

  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [sizesChecked, setSizesChecked] = useState([]); 
  const [disable, setDisable] = useState(false); 
  // to store id with product for temporary images by setGallery
  const [gallery,setGallery] = useState([]);
  const [galleryImages,setGalleryImages] = useState([]);

  // JoditEditor configuration
  const editor = useRef(null);
	const [content, setContent] = useState('');
  const config = useMemo(() => ({
    readonly: false, // all options from https://xdsoft.net/jodit/docs/,
    placeholder: placeholder || 'Type Description...'
  }),
  [placeholder]
);

  const navigate = useNavigate();
  // form handling by useForm hook
  const {
  register,
  handleSubmit,
  setError,
  watch,
  formState: { errors },
    } = useForm();

  // save product function
  const saveProduct = async(data) => {
  // Combine form data with content from JoditEditor
  // This assumes that the JoditEditor is used for the 'description' field
  // If you have a different field name, adjust accordingly
  const formData = {...data, "description": content,"gallery":gallery};
  setDisable(true);

  try {
      const response = await fetch(`${apiUrl}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${adminToken()}`,
        },
        body: JSON.stringify(formData),
      });
  
      const result = await response.json();
      setDisable(false);
      if (result.status === 200) {
        toast.success(result.message);
        // Redirect to the products list page
        navigate('/admin/products');
      } else {
       // toast.error(result.message);
        //Set errors for each field
        const formErrors = result.errors || {};
        Object.keys(formErrors).forEach((field) => {
          setError(field, { message: formErrors[field][0] });
        });
      }
  
    } catch (error) {
      console.error("Error fetching products:", error);
      setDisable(false);
    }
  }
    //category fetch function
  const fetchCategories = async () => {
    try {
      const response = await fetch(`${apiUrl}/categories`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${adminToken()}`,
        },
      });
      const result = await response.json();
      setCategories(result.data); 
    } catch (error) {
      console.error("Error fetching categories:", error);
      return [];
    }
  };
  //brand fetch function
  const fetchBrands = async () => {
    try {
      const response = await fetch(`${apiUrl}/brands`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${adminToken()}`,
        },
      });
      const result = await response.json();
      setBrands(result.data); 
    } catch (error) {
      console.error("Error fetching brands:", error);
      return [];
    }
  };
  //sizes fetch function
  const fetchSizes = async () => {
  try {
    const response = await fetch(`${apiUrl}/sizes`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${adminToken()}`,
      },
    });
    const result = await response.json();
    setSizes(result.data); 
  } catch (error) {
    console.error("Error fetching sizes:", error);
    return [];
  }
  };
    
  
  // handle file function -> this function store image in temporary location 
  const handleFile = async (e) => { 
    const formData = new FormData();
    const file = e.target.files[0];
    formData.append('image', file);
    setDisable(true);
    try {
    const response = await fetch(`${apiUrl}/temp-images`, {
      method: 'POST',
      headers: {
        // 'Content-Type': 'application/json' is not set here because we are using FormData for image
        'Accept': 'application/json',
        'Authorization': `Bearer ${adminToken()}`,
      },
      body:formData
    });
    const result = await response.json();
    console.log("result", result);
    // push id in gallery array's index with saveProduct function (fromData)
    gallery.push(result.data.id);
    setGallery(gallery);
    galleryImages.push(result.data.image_url);
    setGalleryImages(galleryImages);
    setDisable(false);
    // Clear the file input after successful upload
    e.target.value = ''; 
  } catch (error) {
    console.error("Error fetching product:", error);
    return [];
  }
  }
  

  // delete gallery image function
  const deleteGalleryImage = (galleryImage) => {
    const newGallery = galleryImages.filter( gallery => gallery !== galleryImage);
    setGalleryImages(newGallery);
  }

  // useEffect to fetch categories on component mount
  useEffect(() => {
    setTimeout(()=>{
      fetchCategories();
      fetchBrands();
      fetchSizes();
    },1000)
  }, []);
 
 
  
  return (
    
     <div className="bg-gray-100 font-sans">
          <div className="min-h-screen flex">
          <Sidebar/>
          {/* <!-- Main Content --> */}
          <main className="flex-1 pl-4">
            {/* <!-- Topbar --> */}
            <Topbar/>  
            {/* <!-- Cards --> */}
            <div className="max-w-6xl mx-auto p-4 my-4 bg-white shadow-lg rounded-lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-gray-800"> Product / Create</h2>
                <Link
                  to="/admin/products"
                  className="inline-flex items-center bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                >
                  <i className="fa-solid fa-list mr-2"></i> Product List
                </Link>
              </div>

              <div className="bg-gray-100 flex items-center justify-center p-6 rounded-lg">
                <form
                  onSubmit={handleSubmit(saveProduct)}
                  className="bg-white p-8 rounded-2xl shadow-md w-full max-w-2xl space-y-6"
                >
                  <h1 className='font-bold'>Title</h1>
                  {/* Product Title */}
                  <div>
                    <label className="block text-gray-700 font-medium mb-1">Product Title</label>
                    <input
                      {...register("title", {
                        required: "The title field is required",
                      })}
                      type="text"
                      className={`w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.title && "border-red-500"
                      }`}
                      placeholder="Enter Product Title"
                    />
                    {errors.title && (
                      <span className="text-red-500 text-sm">{errors.title.message}</span>
                    )}
                  </div>
                  <h1 className='font-bold'>PRICING</h1>
                  {/* price & compare price (Side by Side) */}
                  <div className="flex gap-6">
                    {/* Price */}
                    <div className="w-1/2">
                    <label className="block text-gray-700 font-medium mb-1">Price</label>
                    <input
                      {...register("price", {
                        required: "The price field is required",
                      })}
                      type="number"
                      className={`w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.price && "border-red-500"
                      }`}
                      placeholder="Enter Price"
                    />
                    {errors.price && (
                      <span className="text-red-500 text-sm">{errors.price.message}</span>
                    )}
                    </div>

                    {/* Discount Price */}
                    <div className="w-1/2">
                    <label className="block text-gray-700 font-medium mb-1">Discount Price</label>
                    <input
                      {...register("discount_price", {
                        required: "The discount_price field is required",
                      })}
                      type="number"
                      className={`w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.discount_price && "border-red-500"
                      }`}
                      placeholder="Enter Discount Price"
                    />
                    {errors.discount_price && (
                      <span className="text-red-500 text-sm">{errors.discount_price.message}</span>
                    )}
                    </div>
                  </div>
                   <h1 className='font-bold'>INVENTORY</h1>
                   {/* sku & barcode (Side by Side) */}
                   <div className="flex gap-6">
                    {/* Sku */}
                    <div className="w-1/2">
                    <label className="block text-gray-700 font-medium mb-1">Sku</label>
                    <input
                      {...register("sku", {
                        required: "The sku field is required",
                      })}
                      type="text"
                      className={`w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.sku && "border-red-500"
                      }`}
                      placeholder="Enter Sku"
                    />
                    {errors.sku && (
                      <span className="text-red-500 text-sm">{errors.sku.message}</span>
                    )}
                    </div>

                    {/* BarCode */}
                    <div className="w-1/2">
                    <label className="block text-gray-700 font-medium mb-1">BarCode</label>
                    <input
                      {...register("barcode", {
                        required: "The barcode field is required",
                      })}
                      type="text"
                      className={`w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.barcode && "border-red-500"
                      }`}
                      placeholder="Enter BarCode"
                    />
                    {errors.barcode && (
                      <span className="text-red-500 text-sm">{errors.barcode.message}</span>
                    )}
                    </div>
                  </div>
                  

                  {/* Category & Brand (Side by Side) */}
                  <div className="flex gap-6">
                    {/* Category */}
                    <div className="w-1/2">
                      <label className="block text-gray-700 font-medium mb-1">Category</label>
                      <select
                      {...register('category', {
                        required: "Please select a category",
                      })}
                      id="category"
                      className={`w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.category ? 'is-invalid' : ''}`}
                      defaultValue=""
                    >
                      <option value="" disabled>
                        Select Status
                      </option>
                      {
                          categories && categories.map((category) => (
                            <option key={category.id} value={category.id}>
                              {category?.name}
                            </option>
                          ))
                        }
                      </select>
                     { errors.category && <span className="text-red-500 text-sm">{errors.category.message}</span>}

                    </div>

                    {/* Brand */}
                    <div className="w-1/2">
                      <label className="block text-gray-700 font-medium mb-1">Brand</label>
                      <select
                      {...register('brand', {
                        //required: "Please select a brand",
                      })}
                      id="brand"
                      className={`w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.category ? 'is-invalid' : ''}`}
                      defaultValue=""
                    >
                      <option value="" disabled>
                        Select Status
                      </option>
                      {
                          brands && brands.map((brand) => (
                            <option key={brand.id} value={brand.id}>
                              {brand?.name}
                            </option>
                          ))
                        }
                      </select>
                     { errors.brand && <span className="text-red-500 text-sm">{errors.brand.message}</span>}

                    </div>
                  </div>
                   {/* qty & status (Side by Side) */}
                   <div className="flex gap-6">
                    {/* Qty */}
                    <div className="w-1/2">
                    <label className="block text-gray-700 font-medium mb-1">Qty</label>
                    <input
                      {...register("qty", {
                        required: "The qty field is required",
                      })}
                      type="number"
                      className={`w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.qty && "border-red-500"
                      }`}
                      placeholder="Enter Qty"
                    />
                    {errors.qty && (
                      <span className="text-red-500 text-sm">{errors.qty.message}</span>
                    )}
                    </div>

                    {/* Status */}
                     <div className="w-1/2">
                      <label className="block text-gray-700 font-medium mb-1">Status</label>
                      <select
                      {...register('status', {
                        required: "Please select the status",
                      })}
                      id="status"
                      className={`w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.status ? 'is-invalid' : ''}`}
                      defaultValue=""
                    >
                      <option value="" disabled>
                        Select Status
                      </option>
                      <option value="1">Active</option>
                      <option value="0">Inactive</option>
                    </select>
                    {errors.status && <span className="text-red-500 text-sm">{errors.status.message}</span>}
                    </div>
                  </div>
                  {/* Short Description */}
                  <div>
                    <label className="block text-gray-700 font-medium mb-1">Short Description</label>
                    <textarea
                      {...register("short_description", {
                        required: "The short description is required",
                      })}
                      rows="4"
                      className={`w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.description && "border-red-500"
                      }`}
                      placeholder="Enter product short description"
                    ></textarea>
                    {errors.short_description && (
                      <span className="text-red-500 text-sm">{errors.short_description.message}</span>
                    )}
                  </div>
                  {/*  Description */}
                  <div>
                    <label className="block text-gray-700 font-medium mb-1">Description</label>
                    <JoditEditor
                      ref={editor}
                      value={content}
                      config={config}
                      tabIndex={1} // tabIndex of textarea
                      onBlur={newContent => setContent(newContent)} // preferred to use only this option to update the content for performance reasons
                      onChange={newContent => {}}
                    />
                  </div>
                  {/* Is Featured */}
                  <div >
                      <label className="block text-gray-700 font-medium mb-1">Featured</label>
                      <select
                      {...register('is_featured', {
                        required: "Please select the featured status",
                      })}
                      id="is_featured"
                      className={`w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.status ? 'is-invalid' : ''}`}
                      defaultValue=""
                    >
                      <option value="" disabled>
                        Select Featured
                      </option>
                      <option value="1">Yes</option>
                      <option value="0">No</option>
                    </select>
                    {errors.is_featured && <span className="text-red-500 text-sm">{errors.is_featured.message}</span>}
                  </div>
                  {/* Sizes */}
                  <h1 className='font-bold'>SIZES</h1>
                  <div>         
                      <div className="flex flex-wrap gap-4">
                      {sizes && sizes.map((size) => (
                        <div key={`psize-${size.id}`} className="flex items-center mb-2">
                          <input
                           value={size.id}
                           id={`size-${size.id}`}
                          {
                            ...register("sizes", {
                              required: "Please select at least one size",
                            } )
                          }
                            type="checkbox"
                            checked={sizesChecked?.includes(size.id)}
                            onChange={(e) => {
                              if(e.target.checked) {
                                setSizesChecked([...sizesChecked, size.id]);
                              } else {
                                setSizesChecked(sizesChecked?.filter(sid =>  size.id != sid));
                              }
                              }
                            }
                           
                            className="mr-2"
                          />
                          <label htmlFor={`size-${size.id}`}>{size.name}</label>
                        </div>
                      ))}
                      </div>
                      
                    {errors.is_featured && <span className="text-red-500 text-sm">{errors.is_featured.message}</span>}
                  </div>
                  <h1 className='font-bold'>GALLERY</h1>
                  <div>
                    <label className=" block text-gray-700 font-medium mb-1">Product Image</label>
                    <div className="flex flex-wrap gap-4 mt-2">
                          {galleryImages && galleryImages.map((galleryImage, index) => (
                            <div key={index} className="flex flex-col items-center mb-4">
                              <img
                                src={galleryImage}
                                alt={`Gallery ${index}`}
                                className="w-32 h-32 object-cover rounded-lg mb-2"
                              />
                              <button
                                type="button"
                                onClick={()=> deleteGalleryImage(galleryImage)}
                                className="text-red-600 hover:text-white border border-red-600 hover:bg-red-600 px-3 py-1 rounded transition"
                              >
                                X
                              </button>
                            </div>
                          ))}
                     </div>
                    <input
                      onChange={handleFile}
                      accept="image/*"
                      name="image"
                      id="image"
                      //no need to register this field with react-hook-form
                      // {...register("image", {
                      //   required: "The product Image field is required",
                      // })}
                      type="file"
                      className={`w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.image && "border-red-500"
                      }`}
                    />
                    {errors.image && (
                      <span className="text-red-500 text-sm">{errors.image.message}</span>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={disable}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition duration-300"
                  >
                    Submit
                  </button>
                </form>
              </div>
            </div>
             {/* <!-- Footer --> */}
             <Footer/>  
          </main>
          </div>
        </div>
  )
}

export default CreateProduct
