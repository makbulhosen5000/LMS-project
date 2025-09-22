import React, { useEffect, useState,useRef,useMemo } from "react";
import JoditEditor from 'jodit-react';
import UserSidebar from "../user-dashboard/UserSidebar";
import UserTopbar from "../user-dashboard/UserTopBar";
import { apiUrl, userTokenLms } from "../../../common/Config";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";



const EditLesson = ({ placeholder }) => {
  const [disable, setDisable] = useState(false);
  const [chapters, setChapters] = useState([]);
  const [setLesson, setLessons] = useState([]);
  //jodit editor
  const editor = useRef(null);
	const [content, setContent] = useState('');
	const config = useMemo(() => ({
			readonly: false, // all options from https://xdsoft.net/jodit/docs/,
			placeholder: placeholder || 'Start typings...'
		}),
		[placeholder]
	);
  const params = useParams();
   const {
      register,
      handleSubmit,
      reset,
      setError,
      formState: { errors },
    } = useForm();
    
    // store or update course
    const onSubmit = async (data) => {
      setDisable(true);
    }

    // it will return courses,language,category,level
    const fetchChapter = async () => {
      try {
        const response = await fetch(`${apiUrl}/chapters?course_id=${params.courseId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${userTokenLms()}`,
          },
        });
  
        const result = await response.json();
      
        if (result.status === 200) {
          setChapters(result.data);
        } else {
          toast.error(result.message || "Something went wrong");
        }
      } catch (error) {
        console.error("Error creating courses:", error);
        toast.error("An error occurred while creating the course.");
      }
    };
    const EditLessonData = async () => {
      try {
        const response = await fetch(`${apiUrl}/lessons/${params.id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${userTokenLms()}`,
          },
        });
  
        const result = await response.json();
      
        if (result.status === 200) {
          setLessons(result.data);
        } else {
          toast.error(result.message || "Something went wrong");
        }
      } catch (error) {
        console.error("Error creating courses:", error);
        toast.error("An error occurred while creating the course.");
      }
    };
    
  

  useEffect(() => {

      fetchChapter();
      EditLessonData();
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                  Chapter
                  </label>
                  <select
                    {...register("chapter", {
                      required: "Please select a chapter",
                    })}
                    className={`w-full border rounded-lg px-4 py-3 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                      errors.chapter ? "border-red-500" : "border-gray-300"
                    }`}
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Select Chapter
                    </option>
                    {chapters && chapters?.map((chapter) => (
                      <option key={chapter.id} value={chapter.id}>
                        {chapter.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Duration(Mins)
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
                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <JoditEditor
                      ref={editor}
                      value={content}
                      config={config}
                      tabIndex={1} // tabIndex of textarea
                      onBlur={newContent => setContent(newContent)} // preferred to use only this option to update the content for performance reasons
                      onChange={newContent => {}}
                    />
                    {errors.description && (
                      <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
                    )}
                  </div>
                  <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                  </label>
                    <select
                      {...register("chapter", {
                        required: "Please select a chapter",
                      })}
                      className={`w-full border rounded-lg px-4 py-3 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                        errors.chapter ? "border-red-500" : "border-gray-300"
                      }`}
                    >
                    <option value="" disabled>
                    Select Status
                    </option>
                      <option value="1">
                        Active
                      </option>
                      <option value="0">
                        Inactive
                      </option>
                      
                    </select>
                  </div>

                  <div>
                
                    <input
                      type="checkbox"
                      className="p-2"
                      />
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Free Lesson
                    </label>
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
              </div>

              {/* Right Section */}
              <div className="space-y-6">
                
              </div>
            </div>
          </div>
        </main>
      </div>
</div>

  );
};

export default EditLesson;










