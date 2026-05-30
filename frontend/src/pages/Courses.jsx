import React, {
  useEffect,
  useState,
  useMemo,
  useContext,
  lazy,
  Suspense,
} from "react";

import { useNavigate } from "react-router-dom";
import { BsFillCartFill } from "react-icons/bs";
import { FaArrowRightLong } from "react-icons/fa6";
import { motion } from "framer-motion";

import { CartContext } from "../context/AddToCart";
import { UserContext } from "../context/UserProvider";
import { toast } from "react-toastify";

const Loading = lazy(() => import("../components/Loading"));

// const API = "http://localhost:3001";
const API = import.meta.env.VITE_API_URL;


const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [level, setLevel] = useState("All");
  const [sort, setSort] = useState("newest");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { dispatch } = useContext(CartContext);
  const { user } = useContext(UserContext);

  const addToCart = (course) => {
    dispatch({ type: "addToCart", payload: course });
  };

  const getCourses = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${API}/api/v1/course/getAllCourses`, {
        method: "GET",
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok) {
        setCourses(data?.data || []);
      } else {
        toast.error(data?.message || "Failed to fetch courses");
      }
    } catch (error) {
      toast.error("Network error while fetching courses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCourses();
  }, []);

  const filteredCourses = useMemo(() => {
    let result = courses.filter((item) => {
      const matchSearch = item.title
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchLevel = level === "All" || item.level === level;

      return matchSearch && matchLevel;
    });

    if (sort === "priceLow") {
      result.sort((a, b) => a.fee - b.fee);
    } else if (sort === "priceHigh") {
      result.sort((a, b) => b.fee - a.fee);
    } else if (sort === "newest") {
      result.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    } else if (sort === "popular") {
      result.sort((a, b) => (b.students || 0) - (a.students || 0));
    }

    return result;
  }, [courses, search, level, sort]);

  const containerVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  };


  if (loading) {
    return (
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="w-14 h-14 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        }
      >
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
          <Loading />

          <p className="mt-4 text-lg font-medium text-gray-600">
            Loading Courses...
          </p>
        </div>
      </Suspense>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
    
      <motion.div
        className="flex flex-wrap justify-center items-center gap-4 p-6 bg-white shadow-sm sticky top-0 z-10"
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <input
          type="text"
          placeholder="Search courses..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-4 py-2 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <select
          value={level}
          onChange={(e) => setLevel(e.target.value)}
          className="border px-4 py-2 rounded-lg"
        >
          <option value="All">All Levels</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border px-4 py-2 rounded-lg"
        >
          <option value="newest">Newest First</option>
          <option value="popular">Popularity</option>
          <option value="priceLow">Price: Low → High</option>
          <option value="priceHigh">Price: High → Low</option>
        </select>
      </motion.div>

      
      <motion.div
        className="flex flex-wrap justify-center gap-8 p-6"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {filteredCourses.length > 0 ? (
          filteredCourses.map((item) => (
            <motion.div
              key={item._id}
              className="w-72 bg-white rounded-2xl shadow-md overflow-hidden"
              variants={cardVariants}
              whileHover={{
                scale: 1.05,
                y: -8,
                boxShadow: "0px 20px 40px rgba(0,0,0,0.15)",
              }}
              whileTap={{ scale: 0.98 }}
            >
              
              <motion.img
                src={item.thumbnail}
                alt={item.title}
                className="w-full h-44 object-cover"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.4 }}
              />

        
              <div className="p-4 flex flex-col gap-2">
                <h2 className="text-lg font-semibold text-gray-800">
                  {item.title}
                </h2>

                <span className="text-xs w-fit px-2 py-1 bg-gray-100 text-gray-600 rounded">
                  {item.level}
                </span>

                <div className="flex justify-between text-sm text-gray-500 mt-2">
                  <span>{item.duration}</span>

                  <span className="font-medium text-blue-600">
                    Rs. {item.fee}
                  </span>
                </div>

               
                <div
                  onClick={() =>
                    user ? addToCart(item) : navigate("/login")
                  }
                  className="flex hover:cursor-pointer justify-center items-center gap-4 bg-blue-600 rounded-xl px-4 py-3 mt-3"
                >
                  <motion.button
                    onClick={() =>
                      user ? addToCart(item) : navigate("/login")
                    }
                    className="text-white text-sm"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Add To Cart
                  </motion.button>

                  <motion.div
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <BsFillCartFill
                      onClick={() =>
                        user ? addToCart(item) : navigate("/login")
                      }
                      size={18}
                      className="text-white cursor-pointer"
                    />
                  </motion.div>
                </div>

                {/* DETAILS */}
                <motion.div
                  onClick={() =>
                    navigate("/courseDetail", { state: item })
                  }
                  className="flex justify-center items-center gap-2 mt-3 cursor-pointer"
                  whileHover={{ x: 6 }}
                >
                  <button className="text-sm">
                    More Details
                  </button>

                  <FaArrowRightLong
                    size={16}
                    className="text-blue-500"
                  />
                </motion.div>
              </div>
            </motion.div>
          ))
        ) : (
          <motion.div
            className="text-xl text-gray-500 mt-10"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            No courses found 😔
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Courses;