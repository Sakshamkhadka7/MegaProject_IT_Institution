import React, { useEffect, useState } from "react";
import { MdOutlineStarRate } from "react-icons/md";
import { toast } from "react-toastify";
const API = import.meta.env.VITE_API_URL;


const CreateReview = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");

  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");

  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(null);

  const [loading, setLoading] = useState(false);

  //  Fetch all courses
  const getCourses = async () => {
    try {
      let res = await fetch(
        `${API}/api/v1/course/getAllCourses`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (res.ok) {
        res = await res.json();
        setCourses(res.data);
      }
    } catch (error) {
      toast.error("Error fetching courses");
      console.log("Error fetching courses", error);
    }
  };

  useEffect(() => {
    getCourses();
  }, []);

  //  Image preview
  const handleImage = (e) => {
    const file = e.target.files[0];
    setPhoto(file);

    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  //  Submit Review
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedCourse || !rating || !comment || !photo) {
      toast.warning("All fields are required");
      return;
    }

    const formData = new FormData();
    formData.append("course", selectedCourse);
    formData.append("rating", rating);
    formData.append("comment", comment);
    formData.append("photo", photo);

    try {
      setLoading(true);

      let res = await fetch(
        `${API}/api/v1/review/createReview`,
        {
          method: "POST",
          body: formData,
          credentials: "include",
        }
      );

      if (res.ok) {
        toast.success("Review submitted successfully");
        // reset
        setSelectedCourse("");
        setRating(0);
        setComment("");
        setPhoto(null);
        setPreview(null);
      }
    } catch (error) {
      toast.error("Error submitting review")
      console.log("Error submitting review", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-md p-6">

     
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          Submit Your Review
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">

       
          <div>
            <label className="text-sm font-medium text-gray-700">
              Select Course
            </label>

            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="w-full mt-2 border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Select Course --</option>
              {courses.map((course) => (
                <option key={course._id} value={course._id}>
                  {course.title}
                </option>
              ))}
            </select>
          </div>

         
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">
              Rating
            </p>

            <div className="flex gap-2">
              {[...Array(10)].map((_, index) => {
                const value = index + 1;

                return (
                  <button
                    type="button"
                    key={index}
                    onClick={() => setRating(value)}
                    onMouseEnter={() => setHover(value)}
                    onMouseLeave={() => setHover(0)}
                    className={`text-2xl transition ${
                      value <= (hover || rating)
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                  >
                    <MdOutlineStarRate />
                  </button>
                );
              })}
            </div>

            <p className="text-xs text-gray-500 mt-1">
              Selected: {rating}/10
            </p>
          </div>

      
          <div>
            <label className="text-sm font-medium text-gray-700">
              Comment
            </label>

            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience..."
              className="w-full mt-2 border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Upload Photo
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={handleImage}
              className="w-full mt-2"
            />

            {preview && (
              <img
                src={preview}
                alt="preview"
                className="mt-3 w-28 h-28 object-cover rounded-lg border"
              />
            )}
          </div>

          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
          >
            {loading ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateReview;