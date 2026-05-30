import React, {
  lazy,
  Suspense,
  useEffect,
  useState,
} from "react";

import { toast } from "react-toastify";

// const API = "http://localhost:3001";
const API = import.meta.env.VITE_API_URL;


const Loading = lazy(() =>
  import("../components/Loading")
);

const INITIAL_FORM_STATE = {
  title: "",
  description: "",
  lectureOrder: "",
  isPreviewFree: false,
  video: null,
};

const AddLecture = () => {
  const [courses, setCourses] = useState([]);

  const [courseId, setCourseId] =
    useState("");

  const [form, setForm] = useState(
    INITIAL_FORM_STATE
  );

  const [videoPreview, setVideoPreview] =
    useState(null);

  const [loadingCourses, setLoadingCourses] =
    useState(true);

 
  const [submitting, setSubmitting] =
    useState(false);


  const [formKey, setFormKey] = useState(
    Date.now()
  );


  useEffect(() => {
    const controller = new AbortController();

    const fetchCourses = async () => {
      try {
        setLoadingCourses(true);

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
              "Failed to load courses"
          );
        }
      } catch (err) {
        if (err.name !== "AbortError") {
          console.log(
            "Error fetching courses",
            err
          );

          toast.error(
            "Network error while fetching courses"
          );
        }
      } finally {
        setLoadingCourses(false);
      }
    };

    fetchCourses();

    return () => controller.abort();
  }, []);

  
  const handleChange = (e) => {
    const {
      name,
      value,
      type,
      checked,
      files,
    } = e.target;

    if (type === "file") {
      const file = files?.[0];

      if (!file) return;

      setForm((prev) => ({
        ...prev,
        video: file,
      }));

      setVideoPreview(
        URL.createObjectURL(file)
      );
    } else {
      setForm((prev) => ({
        ...prev,
        [name]:
          type === "checkbox"
            ? checked
            : value,
      }));
    }
  };

  const validate = () => {
    if (!courseId) {
      toast.error("Please select course");
      return false;
    }

    if (!form.title.trim()) {
      toast.error("Title is required");
      return false;
    }

    if (!form.description.trim()) {
      toast.error(
        "Description is required"
      );
      return false;
    }

    if (!form.lectureOrder) {
      toast.error(
        "Lecture order is required"
      );
      return false;
    }

    if (!form.video) {
      toast.error("Video is required");
      return false;
    }

    return true;
  };

 
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate() || submitting)
      return;

    try {
      setSubmitting(true);

      const fd = new FormData();

      fd.append("title", form.title);
      fd.append(
        "description",
        form.description
      );
      fd.append(
        "lectureOrder",
        form.lectureOrder
      );
      fd.append(
        "isPreviewFree",
        form.isPreviewFree
      );
      fd.append("video", form.video);

      const res = await fetch(
        `${API}/api/v1/course/add-lecture/${courseId}`,
        {
          method: "POST",
          body: fd,
          credentials: "include",
        }
      );

      const data = await res.json();

      if (res.ok) {
        toast.success(
          "Lecture added successfully"
        );

     
        setForm(INITIAL_FORM_STATE);

        
        setVideoPreview(null);

     
        setFormKey(Date.now());
      } else {
        toast.error(
          data?.message ||
            "Failed to add lecture"
        );
      }
    } catch (err) {
      console.log(
        "Error uploading lecture",
        err
      );

      toast.error(
        "Server error while uploading lecture"
      );
    } finally {
      setSubmitting(false);
    }
  };


  if (loadingCourses) {
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

        <p className="mt-4 text-lg text-gray-500">
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
          Uploading Lecture...
        </h2>

        <p className="mt-2 text-gray-500">
          Please wait while your lecture
          video uploads
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
       
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            🎓 Add New Lecture
          </h1>

          <p className="text-gray-500 mt-2">
            Upload high-quality lectures
            for your students
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
              value={courseId}
              onChange={(e) =>
                setCourseId(e.target.value)
              }
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
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
              Lecture Title
            </label>

            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Enter lecture title"
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Lecture Description
            </label>

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={5}
              placeholder="Enter lecture description"
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none"
            />
          </div>

         
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Lecture Order
              </label>

              <input
                type="number"
                name="lectureOrder"
                value={form.lectureOrder}
                onChange={handleChange}
                placeholder="Enter order"
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Preview Access
              </label>

              <label className="flex items-center gap-3 border border-gray-300 rounded-xl p-3 h-[52px]">
                <input
                  type="checkbox"
                  name="isPreviewFree"
                  checked={
                    form.isPreviewFree
                  }
                  onChange={handleChange}
                />

                <span className="text-gray-700">
                  Free Preview
                </span>
              </label>
            </div>
          </div>

   
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Upload Video
            </label>

            <input
              type="file"
              name="video"
              accept="video/*"
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl p-3 bg-white"
            />
          </div>

        
          {videoPreview && (
            <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
              <video
                src={videoPreview}
                controls
                className="w-full max-h-[350px] object-cover"
              />
            </div>
          )}

      
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-black hover:bg-gray-800 text-white py-3 rounded-xl font-semibold transition duration-300 disabled:bg-gray-500 disabled:cursor-not-allowed"
          >
            Add Lecture
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddLecture;