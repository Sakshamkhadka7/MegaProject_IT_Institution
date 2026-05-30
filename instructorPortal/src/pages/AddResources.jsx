import React, {
  lazy,
  Suspense,
  useEffect,
  useState,
} from "react";

import { toast } from "react-toastify";

const API = import.meta.env.VITE_API_URL;
// const API = "http://localhost:3001";

const Loading = lazy(() =>
  import("../components/Loading")
);

const INITIAL_FORM_STATE = {
  courseId: "",
  title: "",
  file: null,
  link: "",
};

const AddResources = () => {
  const [courses, setCourses] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [submitting, setSubmitting] =
    useState(false);

  const [formData, setFormData] =
    useState(INITIAL_FORM_STATE);


  const [formKey, setFormKey] = useState(
    Date.now()
  );

  useEffect(() => {
    const controller = new AbortController();

    const getCourses = async () => {
      try {
        setLoading(true);

        const res = await fetch(
          `${API}/api/v1/course/getInstructorCourse`,
          {
            method: "GET",
            credentials: "include",
            signal: controller.signal,
          }
        );

        const data = await res
          .json()
          .catch(() => null);

        if (res.ok) {
          setCourses(data?.data || []);
        } else {
          toast.error(
            data?.message ||
              "Failed to fetch courses"
          );
        }
      } catch (error) {
        if (error.name !== "AbortError") {
          console.log(
            "Error fetching courses",
            error
          );

          toast.error(
            "Error occurred while fetching courses"
          );
        }
      } finally {
        setLoading(false);
      }
    };

    getCourses();

    return () => controller.abort();
  }, []);


  const validateForm = () => {
    const {
      courseId,
      title,
      file,
      link,
    } = formData;

    if (!courseId) {
      toast.error("Please select a course");
      return false;
    }

    if (!title.trim()) {
      toast.error("Title is required");
      return false;
    }

    if (title.trim().length < 3) {
      toast.error(
        "Title must be at least 3 characters"
      );
      return false;
    }

    if (!file && !link.trim()) {
      toast.error(
        "Please provide either a file or a link"
      );
      return false;
    }

    return true;
  };


  const handleChange = (e) => {
    const { name, value, files } =
      e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: files?.[0] ?? value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm() || submitting)
      return;

    try {
      setSubmitting(true);

      const payload = new FormData();

      payload.append(
        "coursesId",
        formData.courseId
      );

      payload.append(
        "title",
        formData.title.trim()
      );

      payload.append(
        "link",
        formData.link.trim()
      );

      if (formData.file) {
        payload.append(
          "fileUrl",
          formData.file
        );
      }

      const response = await fetch(
        `${API}/api/v1/resources/createResource`,
        {
          method: "POST",
          credentials: "include",
          body: payload,
        }
      );

      const result = await response.json();

      if (response.ok) {
        toast.success(
          "Resource added successfully"
        );

    
        setFormData(INITIAL_FORM_STATE);

      
        setFormKey(Date.now());
      } else {
        toast.error(
          result.message ||
            "Failed to add resource"
        );
      }
    } catch (error) {
      console.log(
        "Error adding resource",
        error
      );

      toast.error(
        "An error occurred while adding resource"
      );
    } finally {
      setSubmitting(false);
    }
  };

  
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
        <Suspense
          fallback={
            <div className="text-lg text-gray-500">
              Loading...
            </div>
          }
        >
          <Loading />
        </Suspense>

        <p className="mt-4 text-gray-500 text-lg">
          Loading courses...
        </p>
      </div>
    );
  }

  if (submitting) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
        <Suspense
          fallback={
            <div className="text-lg text-gray-500">
              Uploading...
            </div>
          }
        >
          <Loading />
        </Suspense>

        <h2 className="mt-6 text-2xl font-bold text-gray-800">
          Uploading Resource...
        </h2>

        <p className="text-gray-500 mt-2">
          Please wait while we upload your
          learning resource
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto bg-white shadow-2xl rounded-3xl p-8 border border-gray-100">
      
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Add Learning Resource
          </h1>

          <p className="text-gray-500 mt-2">
            Upload files or share useful
            resource links for students
          </p>
        </div>

       
        <form
          key={formKey}
          onSubmit={handleSubmit}
          className="space-y-6"
        >
        
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Select Course
            </label>

            <select
              name="courseId"
              value={formData.courseId}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">
                -- Choose Course --
              </option>

              {courses.map((course) => (
                <option
                  key={course._id}
                  value={course._id}
                >
                  {course.title}
                </option>
              ))}
            </select>
          </div>

        
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Resource Title
            </label>

            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter resource title"
              className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

         
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Upload File (Optional)
            </label>

            <input
              type="file"
              name="file"
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl p-3 bg-white"
            />
          </div>

     
          <div className="flex items-center gap-4">
            <div className="flex-1 h-[1px] bg-gray-300"></div>

            <span className="text-gray-400 text-sm">
              OR
            </span>

            <div className="flex-1 h-[1px] bg-gray-300"></div>
          </div>

       
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Resource Link
            </label>

            <input
              type="url"
              name="link"
              value={formData.link}
              onChange={handleChange}
              placeholder="https://example.com"
              className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition duration-300 disabled:bg-blue-400 disabled:cursor-not-allowed"
          >
            Add Resource
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddResources;