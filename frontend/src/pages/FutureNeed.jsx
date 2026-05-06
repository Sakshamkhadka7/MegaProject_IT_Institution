import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { BsFillCartFill } from "react-icons/bs";
import { FaArrowRightLong } from "react-icons/fa6";
import { useContext } from "react";
import { CartContext } from "../context/AddToCart";
import { UserContext } from "../context/UserProvider";


const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [level, setLevel] = useState("All");

  const navigate = useNavigate();
  const { dispatch } = useContext(CartContext);
  const { user } = useContext(UserContext);

  const addToCart = (course) => {
    dispatch({ type: "addToCart", payload: course });
  };

  const getCourses = async () => {
    try {
      let res = await fetch(
        "http://localhost:3001/api/v1/course/getAllCourses",
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
        setCourses(res.data);
      }
    } catch (error) {
      console.log("Error fetching courses", error);
    }
  };

  useEffect(() => {
    getCourses();
  }, []);

  const filteredCourses = useMemo(() => {
    return courses.filter((item) => {
      const matchSearch = item.title
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchLevel = level == "All" || item.level === level;

      return matchSearch && matchLevel;
    });
  }, [courses, search, level]);
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex flex-col md:flex-row justify-center items-center gap-4 p-6 bg-white shadow-sm sticky top-0 z-10">
        {/* Search */}
        <input
          type="text"
          placeholder="Search courses..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-4 py-2 rounded-lg w-72 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <select
          value={level}
          onChange={(e) => setLevel(e.target.value)}
          className="border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="All">All Levels</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>
      </div>

      <div className="flex flex-wrap justify-center gap-8 p-6">
        {filteredCourses.length > 0 ? (
          filteredCourses.map((item) => (
            <div
              key={item._id}
              className="w-72 bg-white rounded-2xl shadow-md hover:shadow-xl transition overflow-hidden"
            >
              <img
                src={`http://localhost:3001/image/${item.courseImage}`}
                alt={item.title}
                className="w-full h-44 object-cover"
              />

              <div className="p-4 flex flex-col gap-2">
                <h2 className="text-lg font-semibold text-gray-800">
                  {item.title}
                </h2>
                \
                <span className="text-xs w-fit px-2 py-1 bg-gray-100 text-gray-600 rounded">
                  {item.level}
                </span>
                <div className="flex justify-between text-sm text-gray-500 mt-2">
                  <span>{item.duration}</span>
                  <span className="font-medium text-blue-600">
                    Rs. {item.fee}
                  </span>
                </div>
                <div className="flex justify-center items-center gap-4 bg-blue-600 rounded-xl px-4 py-3 mt-3">
                  <button
                    onClick={() =>
                      user ? addToCart(item) : navigate("/login")
                    }
                    className="text-white text-sm"
                  >
                    Add To Cart
                  </button>

                  <BsFillCartFill
                    onClick={() =>
                      user ? addToCart(item) : navigate("/login")
                    }
                    size={18}
                    className="text-white cursor-pointer"
                  />
                </div>
                <div
                  onClick={() => navigate("/courseDetail", { state: item })}
                  className="flex justify-center items-center gap-2 mt-3 cursor-pointer"
                >
                  <button className="text-sm">More Details</button>
                  <FaArrowRightLong size={16} className="text-blue-500" />
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-xl text-gray-500 mt-10">No courses found 😔</div>
        )}
      </div>
    </div>
  );
};

export default Courses;
