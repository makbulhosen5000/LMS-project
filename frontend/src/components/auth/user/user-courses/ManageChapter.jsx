import React, { useEffect, useReducer, useState } from "react";
import { apiUrl, userTokenLms } from "../../../common/Config";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Loader from "../../../common/Loader";

export default function ManageChapter({ course, id }) {
  const [disable, setDisable] = useState(false);
  const [loading, setLoading] = useState(false); 

  const chapterReducer = (state, action) => {
    switch (action.type) {
      case "SET_CHAPTERS":
        return action.payload;
      case "ADD_CHAPTER":
        return [...state, action.payload];
      case "UPDATE_CHAPTER":
        return state.map((ch) =>
          ch.id === action.payload.id ? action.payload : ch
        );
      case "DELETE_CHAPTER":
        return state.filter((ch) => ch.id !== action.payload);
      default:
        return state;
    }
  };

  const [chapters, setChapters] = useReducer(chapterReducer, []);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm();

  // Store chapter
  const onSubmit = async (data) => {
    setDisable(true);
    
    const fromData = { ...data, course_id: id };

    try {
      const response = await fetch(`${apiUrl}/chapters`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${userTokenLms()}`,
        },
        body: JSON.stringify(fromData),
      });

      const result = await response.json();

      if (result.status === 200) {
        setChapters({ type: "ADD_CHAPTER", payload: result.data });
        toast.success(result.message || "Chapter created successfully");
        reset();
      } else if (result.errors) {
        Object.keys(result.errors).forEach((field) => {
          setError(field, { message: result.errors[field][0] });
        });
      }
    } catch (error) {
      console.error("Error creating chapter:", error);
      toast.error("An error occurred while creating the chapter.");
    } finally {
      setDisable(false);
      
    }
  };

  // Fetch chapters on load
  useEffect(() => {
    const fetchChapters = async () => {
      setLoading(true);
      try {
        if (course?.chapters) {
          setChapters({ type: "SET_CHAPTERS", payload: course.chapters });
        }
      } catch (err) {
        console.error("Error fetching chapters:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchChapters();
  }, [course]);

  return (
    <>
      <h2 className="text-2xl font-semibold text-gray-800 my-6">📘 Chapter</h2>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            type="text"
            placeholder="Enter course chapter"
            {...register("chapter", { required: "Chapter title is required" })}
            className={`w-full border rounded-lg px-4 py-3 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none ${
              errors.chapter ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.chapter && (
            <p className="text-red-500 text-sm mt-1">
              {errors.chapter.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={disable}
            className="w-full sm:w-auto bg-green-600 text-white font-semibold px-6 py-3 rounded-lg shadow hover:bg-blue-700 transition disabled:opacity-50"
          >
            {disable ? "Saving..." : "Save Chapter"}
          </button>
        </div>
      </form>

      {/* Accordion Section */}
      <div className="mt-8 space-y-4">
        {loading ? (
          <Loader /> // 👈 Loader only while fetching
        ) : chapters.length > 0 ? (
          chapters.map((chapter, index) => (
            <div key={chapter.id} className="border rounded-lg overflow-hidden">
              <button className="w-full flex justify-between items-center px-4 py-3 text-left text-gray-800 font-medium bg-gray-100 hover:bg-gray-200">
                <span>
                  📂 Chapter {index + 1}: {chapter.title}
                </span>
                <svg
                  className="w-5 h-5 text-gray-600 transform transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              <p className="px-4 py-2 text-gray-600">Chapter content...</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No chapters available yet.</p>
        )}
      </div>
    </>
  );
}
