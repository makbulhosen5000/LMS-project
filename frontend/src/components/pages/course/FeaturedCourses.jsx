import React from "react";
import { Star, Users, Layers } from "lucide-react";
import { Link } from "react-router-dom";

const courses = [
  {
    id: 1,
    title: "Corporate Finance Management – From Beginner to Advanced",
    level: "Beginner",
    students: 2,
    rating: 4.0,
    oldPrice: 120,
    newPrice: 100,
    image: "https://picsum.photos/400/250?random=1",
  },
  {
    id: 2,
    title: "Become a Product Manager | Learn Skill and Get Job",
    level: "Expert",
    students: 2,
    rating: 0.0,
    oldPrice: 10,
    newPrice: 10,
    image: "https://picsum.photos/400/250?random=2",
  },
  {
    id: 3,
    title: "Learn Python Programming – Beginner to Master",
    level: "Expert",
    students: 3,
    rating: 4.0,
    oldPrice: 50,
    newPrice: 40,
    image: "https://picsum.photos/400/250?random=3",
  },
  {
    id: 4,
    title: "Laravel From Scratch – Beginner to Master",
    level: "Intermediate",
    students: 2,
    rating: 0.0,
    oldPrice: 10,
    newPrice: 8,
    image: "https://picsum.photos/400/250?random=4",
  },
];

const CourseCard = ({ course }) => {
  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-4 flex flex-col">
      {/* Image */}
      <img
        src={course.image}
        alt={course.title}
        className="w-full h-40 object-cover rounded-xl mb-4"
      />

      {/* Title */}
      <h3 className="text-lg font-bold text-gray-800 mb-2">
        {course.title}
      </h3>

      {/* Info Row */}
      <div className="flex items-center text-sm text-gray-600 gap-4 mb-3">
        <span className="flex items-center gap-1">
          <Layers size={16} /> {course.level}
        </span>
        <span className="flex items-center gap-1">
          <Users size={16} /> {course.students}
        </span>
        <span className="flex items-center gap-1">
          <Star size={16} className="text-yellow-500" /> {course.rating}
        </span>
      </div>

      {/* Price */}
      <div className="flex items-center justify-between mt-auto">
        <div>
          <span className="text-lg font-bold text-gray-800">
            ${course.newPrice}
          </span>
          {course.oldPrice > course.newPrice && (
            <span className="text-sm text-gray-400 line-through ml-2">
              ${course.oldPrice}
            </span>
          )}
        </div>
        <Link to='course-details'>
        <button className="bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 transition">
          Read More
        </button>
        </Link>
      </div>
    </div>
  );
};

const FeaturedCourses = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <div className="text-center">
      <h2 className="text-3xl font-extrabold text-gray-900 mb-8">
              Featured Courses
        </h2>
      <p className="text-gray-600 mb-8">
        Discover courses designed to help you excel in your professional and personal growth.
      </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </section>
  );
};

export default FeaturedCourses;
