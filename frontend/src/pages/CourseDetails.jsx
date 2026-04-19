import React from "react";
import { useLocation } from "react-router-dom";

const CourseDetails = () => {
  const { state } = useLocation();

 
    const enrolledCourse = async (courseId) => {
      try {
        let res = await fetch(
          `http://localhost:3001/api/v1/course/enrolledCourse/${courseId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          },
        );
  
        if (res.ok) {
          res = await res.json();
          alert("Enrolled Successfully");
        }
      } catch (error) {
        console.log("Error occured at enrolledCourse", error);
      }
    };

  return (
    <div className="flex p-10 justify-center gap-20 items-center shadow-2xl mt-6 mb-8 w-300 rounded-2xl m-auto ">
      {/* left */}
      <div className="space-y-2 p-8 rounded-2xl">
        <h1 className="font-semibold text-3xl"> {state.title}</h1>
        <p>{state.descriptions}</p>
        <div className="flex justify-center items-center gap-9">
          <div>
            {" "}
            <p className="font-bold">EnrollmentDeadline :{state.enrollmentDeadline}</p>
          </div>
          <div>
            {" "}
            <h1 className="font-bold text-green-500">Price :{state.fee}</h1>
          </div>
        </div>
        <h1>{state.level}</h1>
        <h1>{state.prerequisities}</h1>

         <button onClick={()=> enrolledCourse(state._id)}  className="mt-3 bg-blue-600 text-white py-2 px-10 rounded-lg hover:bg-blue-700 transition">
              Enroll Now 
            </button>
      </div>
      {/* right  */}
      <div>
        <img
          className="rounded-2xl w-70 h-50"
          src={`http://localhost:3001/image/${state.courseImage}`}
        />
      </div>
    </div>
  );
};

export default CourseDetails;
