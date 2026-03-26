import React from 'react'
import software from "../assets/software.jpg";
import { FaArrowCircleRight } from "react-icons/fa";

const HomeHeroSection = () => {
  return (
   <section className="flex flex-col md:flex-row p-9 justify-between items-center gap-9">
        <div className="space-y-5">
          <h1 className="text-blue-500 font-bold text-5xl">
            Building Digital Nepal{" "}
          </h1>
          <h1 className="text-black font-bold text-4xl">
            Professional Since 2025
          </h1>

          <h2 className="font-semibold text-xl">
            Best IT Learning Institution in Kathmandu
          </h2>
          <p className="text-xl">
            <span className="text-blue-700 text-3xl font-bold">SoftTraining</span> is a leading IT company and learning platform <br /> in a
            kathmandu offering a professional IT training and <br /> education through
            industry experts
          </p>
          <div className="flex items-center justify-center w-60 px-4 py-2 gap-2 border bg-blue-500 text-white rounded-2xl hover:cursor-pointer">
            <button> Browse Our Course</button>
            <FaArrowCircleRight />
          </div>
        </div>

        <div>
          <img src={software} alt="software image" />
        </div>
      </section>
  )
}

export default HomeHeroSection