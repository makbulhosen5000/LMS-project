import React, { useEffect, useState } from "react";
import UserSidebar from "../user-dashboard/UserSidebar";
import UserTopbar from "../user-dashboard/UserTopBar";
import { apiUrl, userTokenLms } from "../../../common/Config";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import ManageOutcome from "./ManageOutcome";
import ManageRequirement from "./ManageRequirement";

const CourseEdit = () => {
  const [categories, setCategories] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [levels, setLevels] = useState([]);
  const [disable, setDisable] = useState(false);
  const {id} = useParams();
   const {
      register,
      handleSubmit,
      reset,
      setError,
      formState: { errors },
    } = useForm({
      defaultValues:async()=>{
        try {
          const response = await fetch(`${apiUrl}/courses/${id}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'Authorization': `Bearer ${userTokenLms()}`,
            },
          });
    
          const result = await response.json();
          console.log(result);
          if (result.status === 200) {
           reset({
            title:result.data.title,
            category:result.data.category_id,
            level:result.data.level_id,
            language:result.data.language_id,
            description:result.data.description,
            price:result.data.price,
            cross_price:result.data.cross_price,
           });
          } else {
            toast.error(result.message);
          }
        } catch (error) {;
          console.error("Error creating courses:", error);
          toast.error("An error occurred while creating the course.");
        }
      }
    });
    
    // update courses function
    const onSubmit = async (data) => {
      setDisable(true);
      try {
        const response = await fetch(`${apiUrl}/courses/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${userTokenLms()}`,
          },
          body: JSON.stringify(data),
        });
    
        let result = {};
        try {
          result = await response.json(); // handle JSON parse errors safely
        } catch (e) {
          console.warn("No JSON response body");
        }
    
        if (response.ok) {
          toast.success(result.message || "Course updated successfully");
        } else {
          // Show validation errors if available
          if (result.errors) {
            Object.keys(result.errors).forEach((field) => {
              setError(field, { message: result.errors[field][0] });
            });
          }
          toast.error(result.message || "Failed to update course");
        }
      } catch (error) {
        console.error("Error updating course:", error);
        toast.error("An error occurred while updating the course.");
      } finally {
        setDisable(false);
      }
    };
    

    // it will return courses,language,category,level
    const courseMetaData = async () => {
      try {
        const response = await fetch(`${apiUrl}/courses/meta-data`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${userTokenLms()}`,
          },
        });
  
        const result = await response.json();
        console.log(result);
        if (result.status === 200) {
          setCategories(result.categories);
          setLanguages(result.languages);
          setLevels(result.levels);
        } else {
          toast.error(result.message || "Something went wrong");
        }
      } catch (error) {
        console.error("Error creating courses:", error);
        toast.error("An error occurred while creating the course.");
      }
    };
    
  

  useEffect(() => {
    const timer = setTimeout(() => {
      courseMetaData();
    }, 1000);

    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div className="bg-gray-100 font-sans">
      <div className="min-h-screen flex">
        {/* Sidebar */}
        <UserSidebar />

        {/* Main Content */}
        <main className="flex-1 pl-4">
          {/* Topbar */}
          <UserTopbar />

          {/* Page Container */}
          <div className="max-w-7xl mx-auto p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Section - Course Form */}
              <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow">
                <h2 className="text-xl font-bold mb-4">Course Edit</h2>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Title
                    </label>
                    <input
                      type="text"
                      placeholder="Enter course title"
                      {...register('title', { required: "Title field is required" })}
                      className="mt-1 w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                     {errors.title && <span className="text-red-500 text-sm">{errors.title.message}</span>}
                  </div>

                  {/* Category & Level */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Category
                      </label>
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
                      {categories.map((category) => (
                        <option key={category.id} value={String(category.id)}>
                          {category.name}
                        </option>
                      ))}
                      </select>
                     { errors.category && <span className="text-red-500 text-sm">{errors.category.message}</span>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Level
                      </label>
                      <select
                      {...register('level', {
                        required: "Please select a level",
                      })}
                      id="level"
                      className={`w-full border border-red-400 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-red-600 ${errors.category ? 'is-invalid' : ''}`}
                      defaultValue=""
                    >
                      <option value="" disabled>
                        Select Status
                      </option>
                          {levels.map((level) => (
                            <option key={level.id} value={String(level.id)}>
                              {level.name}
                            </option>
                          ))}
                        </select>
                      {errors.level && <span className="text-red-500 text-sm">{errors.level.message}</span>}

                    </div>
                  </div>

                  {/* Language */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Language
                    </label>
                    <select
                      {...register('language', {
                        required: "Please select a language",
                      })}
                      id="language"
                      className={`w-full border border-red-400 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-red-600 ${errors.category ? 'is-invalid' : ''}`}
                      defaultValue=""
                    >
                      <option value="" disabled>
                        Select Status
                      </option>
                      {languages.map((language) => (
                        <option key={language.id} value={String(language.id)}>
                          {language.name}
                        </option>
                      ))}
                      </select>
                    {errors.language && <span className="text-red-500 text-sm">{errors.language.message}</span>}
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <textarea
                      rows="4"
                      placeholder="Write about this course..."
                      {...register("description", { required: "Description is required" })}
                      className="mt-1 w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    ></textarea>
                    {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
                  </div>

                  {/* Pricing */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Sell Price
                      </label>
                      <input
                        type="number"
                        {...register("price", { required: true })}
                        className="mt-1 w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                      {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Cross Price
                      </label>
                      <input
                        type="number"
                        {...register("cross_price")}
                        className="mt-1 w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                      
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={disable}
                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                  >
                    {disable ? "Updating..." : "Update"}
                  </button>
                </form>
              </div>

              {/* Right Section */}
              <div className="space-y-6">
                {/* Outcome */}
                <ManageOutcome/>

                {/* Requirements */}
                <div className="bg-white p-6 rounded-xl shadow">
                  <ManageRequirement/>
                </div>

                {/* Cover Image */}
                <div className="bg-white p-6 rounded-xl shadow">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Cover Image
                  </h3>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center text-gray-500 cursor-pointer hover:bg-gray-50">
                    Drag & Drop your files or{" "}
                    <span className="text-blue-600 font-semibold">Browse</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CourseEdit;
