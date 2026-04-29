import React, { useEffect, useState } from "react";
import { MdDeleteSweep } from "react-icons/md";

const ResourcesManagement = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);

  const deleteResources=async(id)=>{
 
  try {
      let res=await fetch(`http://localhost:3001/api/v1/resources/deleteResources/${id}`,{
        method:"DELETE",
        credentials:"include"
      })
     
      if(res.ok){
        alert("Resources successfully deleted");
        getCourses();
        getResources();
      }
  } catch (error) {
    console.log("Resources deleted successfully",error);
  }

  }

  // Fetch courses
  const getCourses = async () => {
    try {
      const res = await fetch(
        "http://localhost:3001/api/v1/course/getAllCourses",
        {
          credentials: "include",
        }
      );
      const data = await res.json();
      if (res.ok) {
        setCourses(data.data);
      }
    } catch (error) {
      console.log("Error fetching courses", error);
    }
  };

  // Fetch resources by course
  const getResources = async (courseId) => {
    try {
      setLoading(true);

      const res = await fetch(
        `http://localhost:3001/api/v1/resources/getResources/${courseId}`,
        {
          credentials: "include",
        }
      );

      const data = await res.json();

      if (res.ok) {
        setResources(data.data || []);
      } else {
        setResources([]);
      }
    } catch (error) {
      console.log("Error fetching resources", error);
      setResources([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCourses();
  }, []);

  // Handle course change
  const handleCourseChange = (e) => {
    const courseId = e.target.value;
    setSelectedCourse(courseId);

    if (courseId) {
      getResources(courseId);
    } else {
      setResources([]);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Course Resources
        </h2>

        {/* Course Dropdown */}
        <div className="mb-6">
          <select
            value={selectedCourse}
            onChange={handleCourseChange}
            className="w-full md:w-1/2 border p-2 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- Select Course --</option>
            {courses.map((course) => (
              <option key={course._id} value={course._id}>
                {course.title}
              </option>
            ))}
          </select>
          
          <h1 className="font-bold text-xl mt-10">Please select any courses to access resources of that resources</h1>

        </div>

        {/* Loading */}
        {loading && <p className="text-gray-500">Loading resources...</p>}

        {/* Empty State */}
        {!loading && resources.length === 0 && selectedCourse && (
          <div className="bg-white p-6 rounded-xl shadow text-center text-gray-500">
            No resources available for this course
          </div>
        )}

      

        {/* Resource Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {resources.map((resource) => (
            <div
              key={resource._id}
              className="bg-white rounded-xl shadow p-4 hover:shadow-lg transition"
            >
              <h3 className="font-semibold text-gray-800">
                {resource.title}
              </h3>

              <p className="text-xs text-gray-400 mt-1">
                Uploaded:{" "}
                {new Date(resource.createdAt).toLocaleDateString()}
              </p>

              <div className="mt-4 flex flex-col gap-2">
                
                {/* File */}
                {resource.fileUrl && (
                  <a
                    href={`http://localhost:3001/image/${resource.fileUrl}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 text-sm hover:underline"
                  >
                    📄 View File
                  </a>
                )}

                {/* Link */}
                {resource.link && (
                 <>
                 
               <div className="flex justify-between items-center">
                   <a
                    href={resource.link}
                    target="_blank"
                    rel="noreferrer"
                    className="text-green-600 text-sm hover:underline"
                  >
                    🔗 Open Link
                  </a>

                  <div>
                    <MdDeleteSweep onClick={()=> deleteResources(resource._id)}  size={29} className="hover:text-red-500 hover:cursor-pointer"/>
                  </div>
               </div>
                 </>

                  
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default ResourcesManagement;