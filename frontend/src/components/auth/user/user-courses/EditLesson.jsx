import React, { useEffect, useState, useRef, useMemo } from "react";
import JoditEditor from 'jodit-react';
import UserSidebar from "../user-dashboard/UserSidebar";
import UserTopbar from "../user-dashboard/UserTopBar";
import { apiUrl, userTokenLms } from "../../../common/Config";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import Loader from "../../../common/Loader";
import LessonVideo from "./LessonVideo";

const EditLesson = ({ placeholder }) => {
  const [disable, setDisable] = useState(false);
  const [chapters, setChapters] = useState([]);
  const [lesson, setLesson] = useState([]);
  const [checked, setChecked] = useState(false);

  // Jodit editor
  const editor = useRef(null);
  const [content, setContent] = useState('');
  const config = useMemo(() => ({
      readonly: false, 
      placeholder: placeholder || 'Start typings...'
    }), [placeholder]
  );

  const params = useParams();
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm();

  // Submit handler
  const onSubmit = async (data) => {
    data.description = content;
    setDisable(true); // show loader
    try {
      const response = await fetch(`${apiUrl}/lessons/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${userTokenLms()}`,
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (result.status === 200) {
        toast.success(result.message);
      } else {
        toast.error(result.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Error updating lesson:", error);
      toast.error("An error occurred while updating the lesson.");
    } finally {
      setDisable(false); // hide loader
    }
  };

  // Fetch chapters
  const fetchChapter = async () => {
    try {
      const response = await fetch(`${apiUrl}/chapters?course_id=${params.courseId}`, {
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
      console.error("Error fetching chapters:", error);
      toast.error("An error occurred while fetching chapters.");
    }
  };

  // Fetch lesson data
  const EditLessonData = async () => {
    try {
      const response = await fetch(`${apiUrl}/lessons/${params.id}`, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${userTokenLms()}`,
        },
      });

      const result = await response.json();
      if (result.status === 200) {
        setLesson(result.data);
        reset({
          lesson: result.data.title,
          chapter: result.data.chapter_id,
          duration: result.data.duration,
          status: result.data.status,
        });
        setContent(result.data.description);
        setChecked(result.data.is_free_preview === 'yes');
      } else {
        toast.error(result.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Error fetching lesson data:", error);
      toast.error("An error occurred while fetching the lesson data.");
    }
  };

  useEffect(() => {
    fetchChapter();
    EditLessonData();
  }, [1000]);

  return (
    <div className="bg-gray-100 font-sans">
      <div className="min-h-screen flex">
        {/* Sidebar */}
        <UserSidebar />

        {/* Main Content */}
        <main className="flex-1 relative">

          {/* Full-page loader */}
          {disable && (
            <Loader/>
          )}

          {/* Topbar */}
          <UserTopbar />

          {/* Page Container */}
          <div className="max-w-7xl mx-auto px-3 py-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left Section - Course Form */}
              <div className="lg:col-span-2 bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                  ✏️ Edit Lesson
                </h2>

                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className={`space-y-6 ${disable ? 'opacity-50 pointer-events-none' : ''}`}
                >
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                      type="text"
                      placeholder="Enter lesson title"
                      {...register("lesson", { required: "Title is required" })}
                      className={`w-full border rounded-lg px-4 py-3 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                        errors.lesson ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.lesson && <p className="text-red-500 text-sm mt-1">{errors.lesson.message}</p>}
                  </div>

                  {/* Chapter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Chapter</label>
                    <select
                      {...register("chapter", { required: "Please select a chapter" })}
                      className={`w-full border rounded-lg px-4 py-3 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                        errors.chapter ? "border-red-500" : "border-gray-300"
                      }`}
                      defaultValue=""
                    >
                      <option value="" disabled>Select Chapter</option>
                      {chapters?.map(chapter => (
                        <option key={chapter.id} value={chapter.id}>{chapter.title}</option>
                      ))}
                    </select>
                  </div>

                  {/* Duration */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Duration(Mins)</label>
                    <input
                      type="text"
                      placeholder="Enter course duration"
                      {...register("duration", { required: "Duration is required" })}
                      className={`w-full border rounded-lg px-4 py-3 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                        errors.duration ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.duration && <p className="text-red-500 text-sm mt-1">{errors.duration.message}</p>}
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <JoditEditor
                      ref={editor}
                      value={content}
                      config={config}
                      tabIndex={1}
                      onBlur={newContent => setContent(newContent)}
                      onChange={() => {}}
                    />
                  </div>

                  {/* Status */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      {...register("status", { required: "Status is required" })}
                      className={`w-full border rounded-lg px-4 py-3 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                        errors.status ? "border-red-500" : "border-gray-300"
                      }`}
                    >
                      <option value="" disabled>Select Status</option>
                      <option value="1">Active</option>
                      <option value="0">Inactive</option>
                    </select>
                  </div>

                  {/* Free Lesson */}
                  <div className="flex gap-2 items-center">
                    <input
                      {...register("is_free_preview")}
                      type="checkbox"
                      checked={checked}
                      onChange={() => setChecked(!checked)}
                      className="p-2"
                    />
                    <label className="block text-sm font-medium text-gray-700 mb-1">Free Lesson</label>
                  </div>
                 
                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={disable}
                      className="w-full sm:w-auto bg-green-600 text-white font-semibold px-6 py-3 rounded-lg shadow hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {disable && (
                        <svg
                          className="animate-spin h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                          ></path>
                        </svg>
                      )}
                      {disable ? "Updating..." : "Update Lesson"}
                    </button>
                  </div>
                </form>
              </div>

              {/* Right Section */}
              <div className="space-y-6">
              <LessonVideo lesson={lesson}/>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default EditLesson;
