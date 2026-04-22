import React from "react";
import { FaArrowCircleRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";


const HomeHeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative h-screen w-full overflow-hidden">
      
      <video
        className="absolute top-0 left-0 w-full h-full object-cover"
        src="/video2.mp4"
        autoPlay
        loop
        muted
      />

  
      <div className="absolute top-0 left-0 w-full h-full bg-black/50"></div>


      <div className="relative z-10 flex flex-col justify-center items-start h-full px-10 md:px-20 text-white space-y-5">
        
        <h1 className="text-blue-400 font-bold text-5xl">
          Building Digital Nepal
        </h1>
  <h1 className='text-green-500 font-bold text-xl text-center'>Get 10% off on first enroll</h1>
        <h1 className="font-bold text-4xl">
          Professional Since 2025
        </h1>

        <h2 className="font-semibold text-xl">
          Best IT Learning Institution in Kathmandu
        </h2>

        <p className="text-lg max-w-xl">
          <span className="text-blue-300 text-2xl font-bold">
            SoftTraining
          </span>{" "}
          is a leading IT company and learning platform in Kathmandu offering
          professional IT training and education through industry experts.
        </p>

        <div
          onClick={() => navigate("/courses")}
          className="flex items-center gap-2 px-6 py-3 bg-blue-500 rounded-xl cursor-pointer hover:bg-blue-700 transition"
        >
          <span>Browse Our Course</span>
          <FaArrowCircleRight />
        </div>

      </div>
    </section>
  );
};

export default HomeHeroSection;