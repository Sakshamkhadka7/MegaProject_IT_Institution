import React, { useState } from "react";

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

  const handleSubmit=async(e)=>{
   
   e.preventDefault();
   console.log(courses);
  
   const data=new FormData();
   data.append("title",courses.title);
   data.append("descriptions",courses.descriptions);
   data.append("syllabus",courses.syllabus);
   data.append("duration",courses.duration);
   data.append("fee",courses.fee);
   data.append("level",courses.level);
   data.append("enrollmentDeadline",courses.enrollment);
   data.append("courseImage",courses.courseImage);
   data.append("prerequisities",courses.prerequisities);

   try {
    let res=await fetch("http://localhost:3001/api/v1/course/createCourse",{
     method:"POST",
      body:data,
      credentials:"include"
    });
 
    if(res.ok){
     res=await res.json();
     alert("Courses added successfully");
    }
   } catch (error) {
    console.log("Error occured at a handleSubmit of courses",error);
   }


  }

  return (
    <div>
      <h1 className="text-center text-2xl font-bold">Add Courses</h1>

      <div className="p-6  rounded-2xl shadow-2xl">
        <form className="flex flex-col justify-center  gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col justify-center space-y-3">
            <label className="text-xl font-semibold">Title</label>
            <input
              onChange={handleChange}
              name="title"
              className="border p-2"
              type="text"
              placeholder="Enter course title"
            />
          </div>
          <div className="flex flex-col justify-center space-y-3">
            <label className="text-xl font-semibold">Descriptions</label>
            <input
              onChange={handleChange}
              name="descriptions"
              className="border p-2"
              type="text"
              placeholder="Enter descriptions "
            />
          </div>
          <div className="flex flex-col justify-center space-y-3">
            <label className="text-xl font-semibold">Syllabus</label>
            <input
              onChange={handleChange}
              name="syllabus"
              className="border p-2"
              type="text"
              placeholder="Enter syllabus"
            />
          </div>

          <div className="flex flex-col justify-center space-y-3">
            <label className="text-xl font-semibold">Duration</label>
            <input
              onChange={handleChange}
              name="duration"
              className="border p-2"
              type="text"
              placeholder="Enter Duration"
            />
          </div>

          <div className="flex flex-col justify-center space-y-3">
            <label className="text-xl font-semibold">Enter Price</label>
            <input
              onChange={handleChange}
              name="fee"
              className="border p-2"
              type="number"
              placeholder="Enter Price"
            />
          </div>

          <div className="flex flex-col justify-center space-y-3">
            <label className="text-xl font-semibold">Level</label>
            <input
              onChange={handleChange}
              name="level"
              className="border p-2"
              type="text"
              placeholder="Enter Level"
            />
          </div>

          <div className="flex flex-col justify-center space-y-3">
            <label className="text-xl font-semibold">Course Image</label>
            <input
              onChange={handleChange}
              name="courseImage"
              className="border p-2"
              type="file"
              placeholder="Enter Level"
            />
          </div>

          <div className="flex flex-col justify-center space-y-3">
            <label className="text-xl font-semibold">Enrollment deadline</label>
            <input
              onChange={handleChange}
              name="enrollment"
              className="border p-2"
              type="text"
              placeholder="Enter enrollment deadline"
            />
          </div>

          <div className="flex flex-col justify-center space-y-3">
            <label className="text-xl font-semibold">
              Enter prerequisities{" "}
            </label>
            <input
              onChange={handleChange}
              name="prerequisities"
              className="border p-2"
              type="text"
              placeholder="Enter prerequisities"
            />
          </div>

          <div className="m-auto">
            <button
              type="submit"
              className="text-xl border px-49 py-2 font-semibold bg-indigo-400 text-white hover:bg-indigo-700 hover:cursor-pointer"
            >
              Add Courses
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCourses;
