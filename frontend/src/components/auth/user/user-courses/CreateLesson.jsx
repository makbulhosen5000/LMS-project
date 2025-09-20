import React, { useState, useEffect } from "react";
import { apiUrl, userTokenLms } from "../../../common/Config";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

export default function CreateLesson({ course }) {
  const [disable, setDisable] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm();

  // store lesson by onSubmit
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

      if (response.status == 200) {
        toast.success(result.message || "Lesson created successfully");
        setOpenModal(false);
        reset();
      } else {
        Object.keys(result.errors).forEach((field) => {
          setError(field, { message: result.errors[field][0] });
        });
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
      {/* Header */}
      <div className="flex items-center justify-between my-6">
        <h2 className="text-2xl font-semibold text-gray-800">📘 Lessons</h2>
        <button
          onClick={() => {
            reset();
            setOpenModal(true);
          }}
          className="bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700 transition"
        >
          ➕ Add Lesson
        </button>
      </div>
      {/* Modal for add lesson */}
      {openModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
            <button
              onClick={() => setOpenModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              ✖
            </button>

            <h3 className="text-xl font-semibold mb-4">Add New Lesson</h3>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Select Chapter */}
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
                  {course?.chapters && course?.chapters?.map((chapter) => (
                    <option key={chapter.id} value={chapter.id}>
                      {chapter.title}
                    </option>
                  ))}
                </select>
                {errors.chapter && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.chapter.message}
                  </p>
                )}
              </div>

              {/* Lesson Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Lesson
                </label>
                <input
                  type="text"
                  placeholder="Enter lesson title"
                  {...register("lesson", {
                    required: "Lesson title is required",
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

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  {...register("status", { required: "Status is required" })}
                  className={`w-full border rounded-lg px-4 py-3 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                    errors.status ? "border-red-500" : "border-gray-300"
                  }`}
                  defaultValue=""
                >
                  <option value="1" selected>Active</option>
                  <option value="0">Inactive</option>
                </select>
                {errors.status && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.status.message}
                  </p>
                )}
              </div>

              {/* Submit */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={disable}
                  className="w-full bg-green-600 text-white font-semibold px-6 py-3 rounded-lg shadow hover:bg-green-700 transition disabled:opacity-50"
                >
                  {disable ? "Saving..." : "Save Lesson"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
