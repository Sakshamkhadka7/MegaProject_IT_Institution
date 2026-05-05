import React, { useEffect, useState } from "react";
import { FaArrowAltCircleRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Course = () => {
  const [course, setCourse] = useState([]);
  const navigate = useNavigate();

  const getMyCourse = async () => {
    try {
      let res = await fetch(
        "http://localhost:3001/api/v1/course/getMyCourses",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        },
      );

      if (res.ok) {
        res = await res.json();
        setCourse(res.data);
      }
    } catch (error) {
      console.log("Error occured at getMyCourse Fetch", error);
      toast.error("Error occured at getMyCourse fetch");
    }
  };

  useEffect(() => {
    getMyCourse();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Heading */}
      <h1 className="text-2xl font-bold mb-6 text-gray-800">My Courses</h1>

      {/* Courses Grid */}
      {course.length > 0 ? (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {course.map((cours) => (
            <div
              key={cours._id}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden"
            >
              {/* Image */}
              <img
                src={`http://localhost:3001/image/${cours?.courseImage}`}
                alt=""
                className="w-full h-40 object-cover"
              />

              {/* Content */}
              <div className="p-4 space-y-2">
                <h2 className="font-semibold text-lg text-gray-800 line-clamp-1">
                  {cours.title}
                </h2>

                <p className="text-sm text-gray-500 line-clamp-2">
                  {cours.descriptions}
                </p>

                {/* Info */}
                <div className="text-sm text-gray-600 space-y-1">
                  <p>⏳ Duration: {cours.duration}</p>
                  <p>💰 Fee: Rs. {cours.fee}</p>
                  <p>📅 Deadline: {cours.enrollmentDeadline}</p>
                  <p>📊 Level: {cours.level}</p>
                </div>

                <div className="flex justify-between items-center">
                  <h1 className="text-xl font-bold text-green-600">
                    Assignment
                  </h1>
                  <FaArrowAltCircleRight
                    onClick={() =>
                      navigate(`/access/submission/${cours._id}`, {
                        state: cours,
                      })
                    }
                    size={20}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 mt-20">
          No course has been enrolled
        </div>
      )}
    </div>
  );
};

export default Course;
