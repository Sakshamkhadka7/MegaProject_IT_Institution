import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BsFillCartFill } from "react-icons/bs";
import { useContext } from "react";
import { CartContext } from "../context/AddToCart";
import { FaArrowRightLong } from "react-icons/fa6";

const Courses = () => {
  const [course, setCourse] = useState([]);
  const navigate = useNavigate();
  const {state,dispatch}=useContext(CartContext);

  const addToCart=(courseId)=>{
    if(course.length >0){
       dispatch({type:"addToCart",payload:{
        id:courseId
       }})
    }
  }


  const getCourses = async () => {
    let res = await fetch("http://localhost:3001/api/v1/course/getAllCourses", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (res.ok) {
      res = await res.json();
      setCourse(res.data);
      console.log(res.data);
    }
  };

  useEffect(() => {
    getCourses();
  }, []);

  return (
    <div className="flex flex-wrap justify-center gap-8 p-2 mt-3">
      {course.length > 0 ?
        (course?.map((item) => (
        <div
         
          key={item._id}
          className="w-72 bg-white rounded-2xl shadow-md hover:shadow-xl hover:cursor-pointer transition duration-300 overflow-hidden"
        >
          {/* Image */}
          <img
            src={`http://localhost:3001/image/${item.courseImage}`}
            alt={item.title}
            className="w-full h-44 object-cover"
          />

          {/* Content */}
          <div className="p-4 flex flex-col gap-2">
            <h2 className="text-lg font-semibold text-gray-800">
              {item.title}
            </h2>

            {/* <p className="text-sm text-gray-600 line-clamp-2">
          {item.descriptions}
        </p> */}

            {/* Info Row */}
            <div className="flex justify-between text-sm text-gray-500 mt-2">
              <span>{item.duration}</span>
              <span className="font-medium text-blue-600">Rs. {item.fee}</span>
            </div>

            {/* Extra Info */}
            {/* <div className="text-xs text-gray-500 mt-1">
          <p><span className="font-medium">Level:</span> {item.level}</p>
          <p className="truncate">
            <span className="font-medium">Prerequisites:</span> {item.prerequisities}
          </p>
        </div> */}

            {/* Button */}
            <div className="flex justify-center items-center gap-5 bg-yellow-600 rounded-2xl px-9 py-3 ">
              <button onClick={()=> addToCart(item._id)} className="text-white rounded-lg hover:cursor-pointer transition">
                Add To Cart
              </button>
              <div>
                <BsFillCartFill onClick={()=> addToCart(item._id)} size={20} className="text-white " />
              </div>
            </div>
       
       <div  onClick={() => navigate("/courseDetail", { state: item })} className="flex justify-center items-center gap-4 mt-3 hover:cursor-pointer">
         <button className="hover:cursor-pointer">More Details</button>
         <FaArrowRightLong size={20} className="text-blue-500 hover:cursor-pointer" />
       </div> 

          </div>
        </div>
      )))
      :<div className="text-3xl p-8 font-bold "> Loading ......</div>}
    </div>
  );
};

export default Courses;
