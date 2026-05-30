import React, {
  memo,
  useEffect,
  useState,
  lazy,
  Suspense,
} from "react";

import { MdEditSquare } from "react-icons/md";
import { RiDeleteBin7Fill } from "react-icons/ri";

import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const API = import.meta.env.VITE_API_URL;
// const API = "http://localhost:3001";

const Loading = lazy(() => import("../components/Loading"));

const CourseRow = memo(({ item, onDelete, onEdit }) => {
  return (
    <tr className="hover:bg-gray-50 transition duration-200">
   
      <td className="px-4 py-4 font-medium text-gray-700">
        {item.title}
      </td>

      
      <td className="px-4 py-4 flex justify-center">
        <img
          src={item.thumbnail}
          alt="course"
          className="w-16 h-16 object-cover rounded-xl border"
        />
      </td>

    
      <td className="px-4 py-4 text-sm text-gray-600 max-w-xs truncate">
        {item.descriptions}
      </td>

      
      <td className="px-4 py-4 text-center">
        {item.duration}
      </td>

     
      <td className="px-4 py-4 text-center">
        {item.enrollmentDeadline}
      </td>

      <td className="px-4 py-4 text-center font-semibold text-indigo-600">
        ₹ {item.fee}
      </td>

    
      <td className="px-4 py-4 text-center">
        <span className="px-3 py-1 text-xs bg-indigo-100 text-indigo-700 rounded-full">
          {item.level}
        </span>
      </td>

     
      <td className="px-4 py-4 text-center">
        <div className="flex justify-center gap-3">
          <button type="button">
            <MdEditSquare
              size={24}
              className="text-gray-500 hover:text-green-500 transition cursor-pointer"
              onClick={() => onEdit(item)}
            />
          </button>

          <button type="button">
            <RiDeleteBin7Fill
              size={24}
              className="text-gray-500 hover:text-red-500 transition cursor-pointer"
              onClick={() => onDelete(item._id)}
            />
          </button>
        </div>
      </td>
    </tr>
  );
});

const CourseManagement = () => {
  const [courses, setCourses] = useState([]);

  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();


  const deleteCourse = async (id) => {
    try {
      const res = await fetch(
        `${API}/api/v1/course/deleteCourse/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data = await res.json();

      if (res.ok) {
        toast.success(
          data?.message || "Course deleted successfully"
        );

        setCourses((prev) =>
          prev.filter((course) => course._id !== id)
        );
      } else {
        toast.error(
          data?.message || "Failed to delete course"
        );
      }
    } catch (error) {
      console.log(
        "Error occurred at deleteCourse",
        error
      );

      toast.error(
        "Network error while deleting course"
      );
    }
  };


  const handleEdit = (item) => {
    navigate(`/access/editCourse/${item._id}`, {
      state: item,
    });
  };


  const getAllCourses = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        `${API}/api/v1/course/getInstructorCourse`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const data = await res.json();

      if (res.ok) {
        setCourses(data?.data || []);
      } else {
        toast.error(
          data?.message || "Failed to fetch courses"
        );
      }
    } catch (error) {
      console.log(
        "Error occurred at getAllCourses",
        error
      );

      toast.error(
        "Network error while fetching courses"
      );
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
          <div className="min-h-screen flex items-center justify-center text-gray-500">
            Loading...
          </div>
        }
      >
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <Loading />
        </div>
      </Suspense>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Course Management
        </h1>

        <p className="text-gray-500 mt-1">
          Manage all instructor courses efficiently
        </p>
      </div>

      
      <div className="bg-white rounded-2xl shadow-lg p-6 overflow-hidden">
        {/* EMPTY STATE */}
        {courses.length === 0 ? (
          <div className="text-center py-14">
            <h2 className="text-xl font-semibold text-gray-700">
              No Courses Available
            </h2>

            <p className="text-gray-500 mt-2">
              You have not created any courses yet.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 rounded-xl overflow-hidden">
             
              <thead className="bg-gray-800 text-white">
                <tr>
                  <th className="px-4 py-4 text-left">
                    Title
                  </th>

                  <th className="px-4 py-4 text-center">
                    Image
                  </th>

                  <th className="px-4 py-4 text-center">
                    Description
                  </th>

                  <th className="px-4 py-4 text-center">
                    Duration
                  </th>

                  <th className="px-4 py-4 text-center">
                    Deadline
                  </th>

                  <th className="px-4 py-4 text-center">
                    Fee
                  </th>

                  <th className="px-4 py-4 text-center">
                    Level
                  </th>

                  <th className="px-4 py-4 text-center">
                    Action
                  </th>
                </tr>
              </thead>

          
              <tbody className="divide-y divide-gray-200">
                {courses.map((item) => (
                  <CourseRow
                    key={item._id}
                    item={item}
                    onDelete={deleteCourse}
                    onEdit={handleEdit}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseManagement;