import React, { useEffect, useState, memo, useCallback, useMemo } from "react";
import { MdDeleteSweep } from "react-icons/md";
import { toast } from "react-toastify";

// const API = import.meta.env.VITE_API_URL;
const API = "http://localhost:3001";


const ResourceCard = memo(({ resource, onDelete }) => {
  return (
    <div className="bg-white rounded-xl shadow p-4 hover:shadow-lg transition">
      <h3 className="font-semibold text-gray-800">{resource.title}</h3>

      <p className="text-xs text-gray-400 mt-1">
        Uploaded: {new Date(resource.createdAt).toLocaleDateString()}
      </p>

      <div className="mt-4 flex flex-col gap-2">
        {resource.fileUrl && (
          <a
            href={`${API}/image/${resource.fileUrl}`}
            target="_blank"
            rel="noreferrer"
            className="text-blue-600 text-sm hover:underline"
          >
            📄 View File
          </a>
        )}

        {resource.link && (
          <div className="flex justify-between items-center">
            <a
              href={resource.link}
              target="_blank"
              rel="noreferrer"
              className="text-green-600 text-sm hover:underline"
            >
              🔗 Open Link
            </a>

            <MdDeleteSweep
              onClick={() => onDelete(resource._id)}
              size={26}
              className="hover:text-red-500 cursor-pointer"
            />
          </div>
        )}
      </div>
    </div>
  );
});

const ResourcesManagement = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);

const getCourses = useCallback(async () => {
  try {
    setLoading(true);

    const res = await fetch(`${API}/api/v1/course/getAllCourses`, {
      method: "GET",
      credentials: "include",
    });

    const data = await res.json().catch(() => null);

    if (res.ok) {
      setCourses(data?.data || []);
    } else {
      toast.error(data?.message || "Failed to fetch courses");
    }
  } catch (error) {
    console.log("Error fetching courses:", error);
    toast.error("Network error while fetching courses");
  } finally {
    setLoading(false);
  }
}, []);

 const getResources = useCallback(async (courseId) => { 
  if (!courseId) return;

  try {
    setLoading(true);

    const res = await fetch(
      `${API}/api/v1/resources/getResources/${courseId}`,
      {
        method: "GET",
        credentials: "include",
      }
    );

    const data = await res.json()

    if (res.ok) {
      setResources(data?.data || []);
    } else {
      console.log("API Error:", data?.message);
      toast.error(data?.message || "Failed to fetch resources");
      setResources([]);
    }
  } catch (error) {
    console.log("Error fetching resources:", error);
    toast.error("Network error while fetching resources");
    setResources([]);
  } finally {
    setLoading(false);
  }
}, []);

 const deleteResources = useCallback(async (id) => {
  try {
    const res = await fetch(
      `${API}/api/v1/resources/deleteResources/${id}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );

    const data = await res.json()

    if (res.ok) {
      toast.success(data?.message || "Resource deleted successfully");

      setResources((prev) =>
        prev.filter((r) => r._id !== id)
      );
    } else {
      toast.error(data?.message || "Failed to delete resource");
    }
  } catch (error) {
    console.log("Delete resource error:", error);
    toast.error("Network error while deleting resource");
  }
}, []);

  useEffect(() => {
    getCourses();
  }, [getCourses]);

  const handleCourseChange = useCallback(
    (e) => {
      const courseId = e.target.value;
      setSelectedCourse(courseId);

      setResources([]); // reset UI immediately

      if (courseId) {
        getResources(courseId);
      }
    },
    [getResources],
  );

  const resourceList = useMemo(() => {
    return resources.map((resource) => (
      <ResourceCard
        key={resource._id}
        resource={resource}
        onDelete={deleteResources}
      />
    ));
  }, [resources, deleteResources]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Course Resources
        </h2>

        <select
          value={selectedCourse}
          onChange={handleCourseChange}
          className="w-full md:w-1/2 border p-2 rounded-lg"
        >
          <option value="">-- Select Course --</option>
          {courses.map((course) => (
            <option key={course._id} value={course._id}>
              {course.title}
            </option>
          ))}
        </select>

        <p className="font-bold text-xl mt-10">
          Select a course to view resources
        </p>

        {loading && <p className="text-gray-500">Loading resources...</p>}

        {!loading && selectedCourse && resources.length === 0 && (
          <div className="bg-white p-6 rounded-xl shadow text-center text-gray-500">
            No resources available
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mt-4">
          {resourceList}
        </div>
      </div>
    </div>
  );
};

export default ResourcesManagement;
