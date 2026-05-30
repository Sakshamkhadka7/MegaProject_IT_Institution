import React from "react";
import { FaArrowCircleRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import { motion } from "framer-motion";

const HomeHeroSection = () => {
  const navigate = useNavigate();


  const container = {
    hidden: {},

    visible: {
      transition: {
        staggerChildren: 0.5,
      },
    },
  };

  const item = {
    hidden: {
      opacity: 0,
      y: 40,
    },

    visible: {
      opacity: 1,
      y: 0,

      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  return (
    <section className="relative h-screen w-full overflow-hidden">
     
      <video
        className="absolute top-0 left-0 w-full h-full object-cover"
        src="/lmsvideo.mp4"
        autoPlay
        loop
        muted
      />

     
      <div className="absolute top-0 left-0 w-full h-full bg-black/60"></div>

      
      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        className="relative z-10 flex flex-col justify-center items-start h-full px-6 md:px-20 text-white space-y-5"
      >
     
        <motion.h1
          variants={item}
          className="text-blue-400 font-extrabold text-3xl md:text-6xl leading-tight"
        >
          Building Digital Institution
        </motion.h1>

      
        <motion.h1
          variants={item}
          className="text-green-400 font-bold text-lg md:text-2xl"
        >
          Get 10% off on first enroll
        </motion.h1>

        
        <motion.h1
          variants={item}
          className="font-bold text-3xl md:text-5xl"
        >
          Professional Since 2025
        </motion.h1>

        <motion.h2
          variants={item}
          className="font-semibold text-lg md:text-2xl text-gray-200"
        >
          Best IT Learning Institution in Kathmandu
        </motion.h2>

     
        <motion.p
          variants={item}
          className="text-base md:text-lg max-w-2xl leading-relaxed text-gray-200"
        >
          <span className="text-blue-300 text-2xl font-bold">
            SoftTraining
          </span>{" "}
          is a leading IT company and learning platform in Kathmandu offering
          professional IT training and education through industry experts.
        </motion.p>

     
        <motion.div
          variants={item}
          className="flex justify-between items-center gap-5 pt-2"
        >
          <button
            onClick={() => navigate("/courses")}
            className="flex items-center gap-3 px-8 py-4 bg-blue-600 rounded-2xl cursor-pointer hover:bg-blue-700 transition-all duration-300 font-semibold shadow-lg hover:scale-105"
          >
            <span>Browse Our Course</span>

            <FaArrowCircleRight size={20} />
          </button>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HomeHeroSection;