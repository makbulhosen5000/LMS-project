import React from "react";
import { Star, Users, Layers, Clock, PlayCircle } from "lucide-react";

const CourseDetails = () => {
  const course = {
    title: "Learn Python Programming – Beginner to Master",
    image: "https://picsum.photos/800/400?random=10",
    description:
      "This comprehensive Python course will guide you from beginner to advanced level. Learn the fundamentals, object-oriented programming, and real-world projects to become job ready.",
    level: "Expert",
    students: 320,
    rating: 4.5,
    duration: "42h 15m",
    lectures: 120,
    price: 40,
    oldPrice: 50,
    instructor: {
      name: "John Doe",
      role: "Senior Software Engineer",
      avatar: "https://i.pravatar.cc/100?img=12",
    },
    curriculum: [
      { id: 1, title: "Introduction to Python", duration: "45m" },
      { id: 2, title: "Data Types & Variables", duration: "1h 20m" },
      { id: 3, title: "Functions & Modules", duration: "2h 10m" },
      { id: 4, title: "Object-Oriented Programming", duration: "3h 30m" },
      { id: 5, title: "Final Project", duration: "5h" },
    ],
    reviews: [
      {
        id: 1,
        name: "Alice Johnson",
        avatar: "https://i.pravatar.cc/100?img=5",
        rating: 5,
        comment:
          "Amazing course! The instructor explained everything clearly and the projects helped me practice a lot.",
      },
      {
        id: 2,
        name: "Michael Smith",
        avatar: "https://i.pravatar.cc/100?img=8",
        rating: 4,
        comment:
          "Very detailed and helpful. I wish there were more exercises, but overall it’s a solid course.",
      },
      {
        id: 3,
        name: "Sophia Lee",
        avatar: "https://i.pravatar.cc/100?img=9",
        rating: 5,
        comment:
          "Best Python course I’ve taken so far! Highly recommend for beginners and intermediates.",
      },
    ],
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 grid lg:grid-cols-3 gap-8">
      {/* Left: Course Content */}
      <div className="lg:col-span-2">
        {/* Course Image */}
        <img
          src={course.image}
          alt={course.title}
          className="w-full rounded-2xl shadow-md mb-6"
        />

        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          {course.title}
        </h1>

        {/* Info */}
        <div className="flex items-center text-sm text-gray-600 gap-6 mb-6">
          <span className="flex items-center gap-1">
            <Layers size={16} /> {course.level}
          </span>
          <span className="flex items-center gap-1">
            <Users size={16} /> {course.students} Students
          </span>
          <span className="flex items-center gap-1">
            <Star className="text-yellow-500" size={16} /> {course.rating}
          </span>
          <span className="flex items-center gap-1">
            <Clock size={16} /> {course.duration}
          </span>
        </div>

        {/* Description */}
        <p className="text-gray-700 leading-relaxed mb-8">
          {course.description}
        </p>

        {/* Instructor */}
        <div className="flex items-center gap-4 mb-8">
          <img
            src={course.instructor.avatar}
            alt={course.instructor.name}
            className="w-14 h-14 rounded-full"
          />
          <div>
            <h3 className="font-bold text-gray-800">{course.instructor.name}</h3>
            <p className="text-gray-600 text-sm">{course.instructor.role}</p>
          </div>
        </div>

        {/* Curriculum */}
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Curriculum</h2>
        <ul className="space-y-3 mb-10">
          {course.curriculum.map((lesson) => (
            <li
              key={lesson.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg shadow-sm"
            >
              <span className="flex items-center gap-2">
                <PlayCircle size={18} className="text-emerald-600" />
                {lesson.title}
              </span>
              <span className="text-sm text-gray-500">{lesson.duration}</span>
            </li>
          ))}
        </ul>

        {/* Reviews Section */}
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Student Reviews
        </h2>
        <div className="space-y-6">
          {course.reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white p-5 rounded-xl shadow-sm border border-gray-100"
            >
              <div className="flex items-center gap-4 mb-3">
                <img
                  src={review.avatar}
                  alt={review.name}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <h4 className="font-bold text-gray-800">{review.name}</h4>
                  <div className="flex text-yellow-500">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Star key={i} size={16} fill="currentColor" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-700">{review.comment}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right: Sidebar */}
      <div className="bg-white rounded-2xl shadow-lg p-6 h-fit">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Course Price</h3>
        <div className="flex items-center gap-3 mb-6">
          <span className="text-3xl font-bold text-gray-800">
            ${course.price}
          </span>
          {course.oldPrice > course.price && (
            <span className="text-lg text-gray-400 line-through">
              ${course.oldPrice}
            </span>
          )}
        </div>
        <button className="w-full bg-emerald-500 text-white py-3 rounded-lg font-semibold hover:bg-emerald-600 transition">
          Enroll Now
        </button>
        <button className="w-full mt-3 border border-emerald-500 text-emerald-600 py-3 rounded-lg font-semibold hover:bg-emerald-50 transition">
          Add to Wishlist
        </button>
      </div>
    </div>
  );
};

export default CourseDetails;
