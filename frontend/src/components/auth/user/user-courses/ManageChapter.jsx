import React, { useEffect, useReducer, useState } from "react";
import { apiUrl, userTokenLms } from "../../../common/Config";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Loader from "../../../common/Loader";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import CreateLesson from "./CreateLesson";

export default function ManageChapter({ course, id }) {
  const [disable, setDisable] = useState(false);
  const [loading, setLoading] = useState(false); 
  const [openModal, setOpenModal] = useState(false); 
  const [editChapter, setEditChapter] = useState(null); // 👈 store chapter for editing

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

  // store or update chapter
  const onSubmit = async (data) => {
    setDisable(true);
    const fromData = { ...data, course_id: id };

    try {
      let response, result;

      if (editChapter) {
        // Update
        response = await fetch(`${apiUrl}/chapters/${editChapter.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${userTokenLms()}`,
          },
          body: JSON.stringify(fromData),
        });
      } else {
        // Add new
        response = await fetch(`${apiUrl}/chapters`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${userTokenLms()}`,
          },
          body: JSON.stringify(fromData),
        });
      }

      result = await response.json();

      if (result.status === 200) {
        if (editChapter) {
          setChapters({ type: "UPDATE_CHAPTER", payload: result.data });
          toast.success(result.message || "Chapter updated successfully");
        } else {
          setChapters({ type: "ADD_CHAPTER", payload: result.data });
          toast.success(result.message || "Chapter created successfully");
        }

        reset();
        setEditChapter(null);
        setOpenModal(false);
      } else if (result.errors) {
        Object.keys(result.errors).forEach((field) => {
          setError(field, { message: result.errors[field][0] });
        });
      }
    } catch (error) {
      console.error("Error saving chapter:", error);
      toast.error("An error occurred while saving the chapter.");
    } finally {
      setDisable(false);
    }
  };

  // Delete chapter
  const handleDelete = async (chapterId) => {
    if (!window.confirm("Are you sure you want to delete this chapter?")) return;

    try {
      const response = await fetch(`${apiUrl}/chapters/${chapterId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${userTokenLms()}`,
        },
      });
      const result = await response.json();

      if (result.status === 200 || response.status === 204) {
        setChapters({ type: "DELETE_CHAPTER", payload: chapterId });
        toast.success(result.message || "Chapter deleted successfully");
      } else {
        toast.error(result.message || "Failed to delete chapter");
      }
    } catch (error) {
      console.error("Error deleting chapter:", error);
      toast.error("An error occurred while deleting the chapter.");
    }
  };

  // open modal with prefilled data for edit
  const handleEdit = (chapter) => {
    setEditChapter(chapter);
    reset({ chapter: chapter.title });
    setOpenModal(true);
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
      <CreateLesson course={course}/>

      {/* Modal */}
      {openModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
            <button
              onClick={() => setOpenModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              ✖
            </button>

            <h3 className="text-xl font-semibold mb-4">
              {editChapter ? "Edit Chapter" : "Add New Chapter"}
            </h3>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  placeholder="Enter course chapter"
                  {...register("chapter", {
                    required: "Chapter title is required",
                  })}
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

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={disable}
                  className="w-full bg-green-600 text-white font-semibold px-6 py-3 rounded-lg shadow hover:bg-green-700 transition disabled:opacity-50"
                >
                  {disable ? "Saving..." : editChapter ? "Update Chapter" : "Save Chapter"}
                </button>
              </div>
            </form>
            
          </div>
        </div>
      )}

      {/* Accordion Section */}
      <div className="mt-8 space-y-4">
        {/* chapter save by onSubmit */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  placeholder="Enter course chapter"
                  {...register("chapter", {
                    required: "Chapter title is required",
                  })}
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

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={disable}
                  className="w-32 bg-green-600 text-white font-semibold px-6 py-3 rounded-lg shadow hover:bg-green-700 transition disabled:opacity-50"
                >
                  {disable ? "Saving...":"Save"}
                </button>
              </div>
          </form>
        {loading ? (
          <Loader />
        ) : chapters.length > 0 ? (
          chapters.map((chapter, index) => (
            <div key={chapter.id} className="border rounded-lg overflow-hidden">
              <div className="flex justify-between items-center px-4 py-3 bg-gray-100 hover:bg-gray-200">
                <span>
                  {/* 📂 Chapter {index + 1}: {chapter.title} */}
                  {chapter.title}
                </span>
                <div className="space-x-2">
                  <button
                    onClick={() => handleEdit(chapter)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                  <FiEdit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(chapter.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    
                  <FiTrash2 size={18}/>
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No chapters available yet.</p>
        )}
      </div>
    </>
  );
}
