import React, { useEffect, useState } from "react";
import UserSidebar from "../user-dashboard/UserSidebar";
import UserTopbar from "../user-dashboard/UserTopBar";
import { apiUrl, userTokenLms } from "../../../common/Config";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import ManageOutcome from "./ManageOutcome";
import ManageRequirement from "./ManageRequirement";
import EditCover from "./EditCover";
import ManageChapter from "./ManageChapter";
import ManageLesson from "./ManageLesson";

const CourseEdit = () => {
  const [categories, setCategories] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [levels, setLevels] = useState([]);
  const [course, setCourse] = useState([]);
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
           setCourse(result.data);
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
        <main className="flex-1">
          {/* Topbar */}
          <UserTopbar />

          {/* Page Container */}
          <div className="max-w-7xl mx-auto px-3 py-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left Section - Course Form */}
              <div className="lg:col-span-2 bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                  ✏️ Edit Course
                </h2>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      placeholder="Enter course title"
                      {...register("title", { required: "Title is required" })}
                      className={`w-full border rounded-lg px-4 py-3 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                        errors.title ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.title && (
                      <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
                    )}
                  </div>

                  {/* Category & Level */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category
                      </label>
                      <select
                        {...register("category", { required: "Select a category" })}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        defaultValue=""
                      >
                        <option value="" disabled>Select category</option>
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                      {errors.category && (
                        <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Level
                      </label>
                      <select
                        {...register("level", { required: "Select a level" })}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        defaultValue=""
                      >
                        <option value="" disabled>Select level</option>
                        {levels.map((l) => (
                          <option key={l.id} value={l.id}>{l.name}</option>
                        ))}
                      </select>
                      {errors.level && (
                        <p className="text-red-500 text-sm mt-1">{errors.level.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Language */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Language
                    </label>
                    <select
                      {...register("language", { required: "Select a language" })}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      defaultValue=""
                    >
                      <option value="" disabled>Select language</option>
                      {languages.map((lang) => (
                        <option key={lang.id} value={lang.id}>{lang.name}</option>
                      ))}
                    </select>
                    {errors.language && (
                      <p className="text-red-500 text-sm mt-1">{errors.language.message}</p>
                    )}
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      rows="4"
                      placeholder="Write about this course..."
                      {...register("description", { required: "Description is required" })}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    ></textarea>
                    {errors.description && (
                      <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
                    )}
                  </div>

                  {/* Pricing */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Sell Price
                      </label>
                      <input
                        type="number"
                        {...register("price", { required: "Price is required" })}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                      {errors.price && (
                        <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Cross Price
                      </label>
                      <input
                        type="number"
                        {...register("cross_price")}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={disable}
                      className="w-full sm:w-auto bg-green-600 text-white font-semibold px-6 py-3 rounded-lg shadow hover:bg-blue-700 transition disabled:opacity-50"
                    >
                      {disable ? "Updating..." : "Update Course"}
                    </button>
                  </div>
                </form>
                {/* manage chapter */}
                <ManageChapter course={course} id={id} />
                 {/* manage lesson */}
                <ManageLesson course={course}/>
              </div>

              {/* Right Section */}
              <div className="space-y-6">
                <ManageOutcome />
                <ManageRequirement />
                <EditCover course={course} setCourse={setCourse} />
              </div>
            </div>
          </div>
        </main>
      </div>
</div>

  );
};

export default CourseEdit;
