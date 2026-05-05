import React, { useState } from "react";
import { toast } from "react-toastify";

const AddCourses = () => {
  const [courses, setCourses] = useState({
    title: "",
    descriptions: "",
    syllabus: "",
    duration: "",
    fee: "",
    level: "",
    courseImage: "",
    enrollment: "",
    prerequisities: "",
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setCourses({
      ...courses,
      [name]: files ? files[0] : value,
    });
  };


  const validateForm = () => {
    const {
      title,
      descriptions,
      syllabus,
      duration,
      fee,
      level,
      courseImage,
      enrollment,
      prerequisities,
    } = courses;

    if (!title.trim()) {
      toast.error("Title is required");
      return false;
    }

    if (!descriptions.trim()) {
      toast.error("Description is required");
      return false;
    }

    if (!syllabus.trim()) {
      toast.error("Syllabus is required");
      return false;
    }

    if (!duration.trim()) {
      toast.error("Duration is required");
      return false;
    }

    if (!fee || isNaN(fee) || Number(fee) <= 0) {
      toast.error("Fee must be a valid positive number");
      return false;
    }

    if (!level.trim()) {
      toast.error("Level is required");
      return false;
    }

    if (!courseImage) {
      toast.error("Course image is required");
      return false;
    }

 
    if (!enrollment.trim()) {
      toast.error("Enrollment deadline is required");
      return false;
    }

    if (!prerequisities.trim()) {
      toast.error("Prerequisites are required");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();


    if (!validateForm()) return;

    const data = new FormData();
    data.append("title", courses.title);
    data.append("descriptions", courses.descriptions);
    data.append("syllabus", courses.syllabus);
    data.append("duration", courses.duration);
    data.append("fee", courses.fee);
    data.append("level", courses.level);
    data.append("enrollmentDeadline", courses.enrollment);
    data.append("courseImage", courses.courseImage);
    data.append("prerequisities", courses.prerequisities);

    try {
      let res = await fetch(
        "http://localhost:3001/api/v1/course/createCourse",
        {
          method: "POST",
          body: data,
          credentials: "include",
        }
      );

      if (res.ok) {
        await res.json();
        toast.success("Course added successfully");

        //  Reset form
        setCourses({
          title: "",
          descriptions: "",
          syllabus: "",
          duration: "",
          fee: "",
          level: "",
          courseImage: "",
          enrollment: "",
          prerequisities: "",
        });
      } else {
        toast.error("Failed to add course");
      }
    } catch (error) {
      toast.error("Error occurred while adding course");
      console.log("Error:", error);
    }
  };

  return (
    <div>
      <h1 className="text-center text-2xl font-bold">Add Courses</h1>

      <div className="p-6 rounded-2xl shadow-2xl">
        <form
          className="flex flex-col justify-center gap-4"
          onSubmit={handleSubmit}
        >
          <input name="title" onChange={handleChange} className="border p-2" placeholder="Title" />
          <input name="descriptions" onChange={handleChange} className="border p-2" placeholder="Description" />
          <input name="syllabus" onChange={handleChange} className="border p-2" placeholder="Syllabus" />
          <input name="duration" onChange={handleChange} className="border p-2" placeholder="Duration" />
          <input name="fee" type="number" onChange={handleChange} className="border p-2" placeholder="Fee" />
          <input name="level" onChange={handleChange} className="border p-2" placeholder="Level" />
          <input name="courseImage" type="file" onChange={handleChange} className="border p-2" />
          <input name="enrollment" onChange={handleChange} className="border p-2" placeholder="Enrollment deadline" />
          <input name="prerequisities" onChange={handleChange} className="border p-2" placeholder="Prerequisites" />

          <button
            type="submit"
            className="text-xl border px-10 py-2 font-semibold bg-indigo-400 text-white hover:bg-indigo-700"
          >
            Add Course
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCourses;