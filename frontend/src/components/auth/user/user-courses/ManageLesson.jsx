import React, { useState } from "react";
import { apiUrl, userTokenLms } from "../../../common/Config";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Loader from "../../../common/Loader";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { FaBook } from "react-icons/fa";

export default function ManageLesson({ course }) {
  const [disable, setDisable] = useState(false);
  const [loading, setLoading] = useState(false); 
  const [openModal, setOpenModal] = useState(false); 
  const [editLesson, setEditLesson] = useState(null); // 👈 store chapter for editing
  const [lessons, setLessons] = useState([]); // 👈 store chapter for editing

 
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
    try {
      const response = await fetch(`${apiUrl}/lessons`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${userTokenLms()}`,
        },
        body: JSON.stringify(data),
      });
  
      const result = await response.json();
  
      if (result.status === 200) {
        reset(); // Reset form fields
        toast.success(result.message || "Lesson created successfully");
  
        // Update local lessons state to show new lesson
        setLessons((prevLessons) => [...prevLessons, result.data]);
  
        reset();          // Reset form
        setOpenModal(false); // Close modal
      } else if (result.errors) {
        Object.keys(result.errors).forEach((field) => {
          setError(field, { message: result.errors[field][0] });
        });
        toast.error("Please fix the errors.");
      } else {
        toast.error(result.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Error saving lesson:", error);
      toast.error("An error occurred while saving the lesson.");
    } finally {
      setDisable(false);
    }
  };
  

  
  


  return (
    <>
      <div className="flex items-center justify-between my-6">
      <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
      <FaBook className="text-blue-600" /> Lesson
      </h2>
        <button
          onClick={() => { setEditLesson(null); reset(); setOpenModal(true); }}
          className="bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700 transition"
        >
          ➕ Add Chapter
        </button>
      </div>

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
              {editLesson ? "Edit Lesson" : "Add New Lesson"}
            </h3>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Chapter
                  </label>
                  <select
                    {...register("chapter", { required: "Please select a chapter" })}
                    className={`w-full border rounded-lg px-4 py-3 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                      errors.chapter ? "border-red-500" : "border-gray-300"
                    }`}
                    defaultValue={editLesson ? editLesson.chapter : ""}
                  >
                    <option value="" disabled>
                      Select Chapter
                    </option>
                    {course?.chapters?.map((chapter) => (
                      <option key={chapter.id} value={chapter.id}>
                        {chapter.title}
                      </option>
                    ))}
                  </select>
                  {errors.chapter && (
                    <p className="text-red-500 text-sm mt-1">{errors.chapter.message}</p>
                  )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Lesson
                </label>
                <input
                  type="text"
                  placeholder="please select a lesson"
                  {...register("lesson", {
                    required: "Lesson field is required",
                  })}
                  className={`w-full border rounded-lg px-4 py-3 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                    errors.lesson ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.lesson && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.lesson.message}
                  </p>
                )}
              </div>
              <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    {...register("status", { required: "status is required" })}
                    className={`w-full border rounded-lg px-4 py-3 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                      errors.status ? "border-red-500" : "border-gray-300"
                    }`}
                   
                  >
                    <option value="" disabled>
                      Select Chapter
                    </option>
                    <option value="1">
                      Active
                    </option>
                    <option value="0">
                      Inactive
                    </option>
                    
                  </select>
                  {errors.status && (
                    <p className="text-red-500 text-sm mt-1">{errors.status.message}</p>
                  )}
              </div>


              <div className="pt-2">
                <button
                  type="submit"
                  disabled={disable}
                  className="w-full bg-green-600 text-white font-semibold px-6 py-3 rounded-lg shadow hover:bg-green-700 transition disabled:opacity-50"
                >
                  {disable ? "Saving..." : editLesson ? "Update Chapter" : "Save Chapter"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Accordion Section */}
      <div className="mt-8 space-y-4">
        {loading ? (
          <Loader />
        ) : lessons.length > 0 ? (
          lessons.map((chapter, index) => (
            <div key={chapter.id} className="border rounded-lg overflow-hidden">
              <div className="flex justify-between items-center px-4 py-3 bg-gray-100 hover:bg-gray-200">
                <span>
                  📂 Chapter {index + 1}: {chapter.title}
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
          <p className="text-gray-500">No lessons available yet.</p>
        )}
      </div>
    </>
  );
}
