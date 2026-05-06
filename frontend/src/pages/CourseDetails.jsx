import React, { useContext } from "react";
import { FaArrowCircleRight } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { CartContext } from "../context/AddToCart";
import { toast } from "react-toastify";
const API = import.meta.env.VITE_API_URL;


const CourseDetails = () => {
  const { state } = useLocation();

  const {dispatch}=useContext(CartContext);
  

  const navigate=useNavigate();

  const enrolledCourse = async (courseId) => {
    try {
      let res = await fetch(
        `${API}/api/v1/course/enrolledCourse/${courseId}`,
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
        dispatch({type:"addToCart",payload:state})
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
            <p className="font-bold">
              EnrollmentDeadline :{state.enrollmentDeadline}
            </p>
          </div>
          <div>
            {" "}
            <h1 className="font-bold text-green-500">Price :{state.fee}</h1>
          </div>
        </div>
        <h1>{state.level}</h1>
        <h1>{state.prerequisities}</h1>

        <div className="flex justify-center gap-9 items-center ">
          <button
            onClick={() => enrolledCourse(state._id)}
            className="mt-3 bg-blue-600 text-white py-2 px-10 rounded-lg hover:bg-blue-700 transition"
          >
            Enroll Now
          </button>

          <div onClick={()=> navigate("/demo",{state:state}) } className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-xl cursor-pointer hover:bg-blue-700 transition mt-2">
            <span>Book a Demo </span>
            <FaArrowCircleRight />
          </div>
        </div>
      </div>
      {/* right  */}
      <div>
        <img
          className="rounded-2xl w-70 h-50"
          src={`${API}/image/${state.courseImage}`}
        />
      </div>
    </div>
  );
};

export default CourseDetails;
