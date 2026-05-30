import React, {
  lazy,
  Suspense,
  useEffect,
  useState,
} from "react";

import { MdEditSquare } from "react-icons/md";

import { RiDeleteBin7Fill } from "react-icons/ri";

import { useNavigate } from "react-router-dom";

import { toast } from "react-toastify";

const API = import.meta.env.VITE_API_URL;


const Loading = lazy(() =>
  import("../components/Loading")
);

const ContentManagement = () => {
  const [courses, setCourses] = useState([]);

  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const deleteCourse = async (id) => {
    try {
    
      setLoading(true);

      const res = await fetch(
        `${API}/api/v1/course/deleteCourse/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data = await res.json();

      if (!res.ok) {
        toast.warning(
          data.message ||
            "Failed to delete course"
        );

        return;
      }

      toast.success(
        data.message ||
          "Course has been deleted"
      );

      getAllCourses();
    } catch (error) {
      console.log(
        "Error has been occured at deleteCourses",
        error
      );

      toast.warning(
        "Network error or server not responding"
      );
    } finally {
     
      setLoading(false);
    }
  };

  const getAllCourses = async () => {
    try {
    
      setLoading(true);

      const res = await fetch(
        `${API}/api/v1/course/getAllCourses`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const data = await res.json();

      if (!res.ok) {
        toast.warning(
          data.message ||
            "Failed to fetch courses"
        );

        setCourses([]);

        return;
      }

      setCourses(data.data || []);
    } catch (error) {
      console.log(
        "Error occurred at getAllCourses",
        error
      );

      toast.warning(
        "Network error or server not responding"
      );

      setCourses([]);
    } finally {
    
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllCourses();
  }, []);


  if (loading) {
    return (
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center">
            Loading...
          </div>
        }
      >
        <Loading />
      </Suspense>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
   
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Course Management
      </h1>

      <div className="bg-white rounded-2xl shadow-lg p-6 overflow-hidden">
        {courses.length === 0 ? (
          <p className="text-center text-gray-500">
            No courses available
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 rounded-lg">
        
              <thead className="bg-gray-800 text-white">
                <tr>
                  <th className="px-4 py-3 text-left">
                    Title
                  </th>

                  <th className="px-4 py-3">
                    Image
                  </th>

                  <th className="px-4 py-3">
                    Description
                  </th>

                  <th className="px-4 py-3">
                    Duration
                  </th>

                  <th className="px-4 py-3">
                    Deadline
                  </th>

                  <th className="px-4 py-3">
                    Fee
                  </th>

                  <th className="px-4 py-3">
                    Level
                  </th>

                  <th className="px-4 py-3">
                    Action
                  </th>
                </tr>
              </thead>

             
              <tbody className="divide-y">
                {courses.map((item) => (
                  <tr
                    key={item._id}
                    className="hover:bg-gray-50 transition duration-200"
                  >
                    <td className="px-4 py-3 font-medium text-gray-700">
                      {item.title}
                    </td>

                    <td className="px-4 py-3 flex justify-center">
                      <img
                        src={item.thumbnail}
                        alt="course"
                        className="w-14 h-14 object-cover rounded-lg border"
                      />
                    </td>

                    <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">
                      {item.description}
                    </td>

                    <td className="px-4 py-3 text-center">
                      {item.duration}
                    </td>

                    <td className="px-4 py-3 text-center">
                      {
                        item.enrollmentDeadline
                      }
                    </td>

                    <td className="px-4 py-3 text-center font-semibold text-indigo-600">
                      ₹ {item.fee}
                    </td>

                    <td className="px-4 py-3 text-center">
                      <span className="px-2 py-1 text-xs bg-indigo-100 text-indigo-700 rounded-full">
                        {item.level}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-center flex justify-center gap-3">
                      <button>
                        <MdEditSquare
                          size={24}
                          className="hover:text-green-400 hover:cursor-pointer"
                          onClick={() => {
                            navigate(
                              `/access/editCourse/${item._id}`,
                              {
                                state: item,
                              }
                            );
                          }}
                        />
                      </button>

                      <button>
                        <RiDeleteBin7Fill
                          size={24}
                          className="hover:text-red-500 hover:cursor-pointer"
                          onClick={() => {
                            deleteCourse(
                              item._id
                            );
                          }}
                        />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentManagement;