import React from "react";
import { motion } from "framer-motion";
import {
  FaUserGraduate,
  FaBriefcase,
  FaStar,
} from "react-icons/fa";

const HomeHeroSection4 = () => {

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 80,
      scale: 0.8,
    },

    visible: (index) => ({
      opacity: 1,
      y: 0,
      scale: 1,

      transition: {
        duration: 0.7,
        delay: index * 0.2,
      },
    }),
  };

  return (
    <section className="bg-gray-50 py-16 px-6 md:px-20 overflow-hidden">
   
      <motion.div
        initial={{
          opacity: 0,
          y: -50,
        }}
        whileInView={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.8,
        }}
        viewport={{ once: true }}
        className="text-center mb-12 space-y-3"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
          Our Success Stories
        </h1>

        <p className="text-gray-600 max-w-2xl mx-auto">
          Proven results that show our impact in education and career growth.
        </p>
      </motion.div>

     
      <div className="grid md:grid-cols-3 gap-6 mb-12">

        {/* CARD 1 */}
        <motion.div
          custom={0}
          variants={cardVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          whileHover={{
            y: -12,
            scale: 1.05,
          }}
          className="bg-white shadow-lg rounded-3xl p-8 text-center hover:shadow-2xl transition relative overflow-hidden"
        >
        
          <div className="absolute top-0 left-0 w-full h-1 bg-indigo-600"></div>

          <motion.div
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 2,
            }}
          >
            <FaUserGraduate className="text-5xl text-indigo-600 mx-auto mb-4" />
          </motion.div>

          <motion.h2
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 120,
              delay: 0.3,
            }}
            className="text-4xl font-bold text-gray-800"
          >
            5,000+
          </motion.h2>

          <p className="text-gray-600 mt-2">
            Students Trained
          </p>
        </motion.div>

       
        <motion.div
          custom={1}
          variants={cardVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          whileHover={{
            y: -12,
            scale: 1.05,
          }}
          className="bg-white shadow-lg rounded-3xl p-8 text-center hover:shadow-2xl transition relative overflow-hidden"
        >
          
          <div className="absolute top-0 left-0 w-full h-1 bg-green-600"></div>

          <motion.div
            animate={{
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 3,
            }}
          >
            <FaBriefcase className="text-5xl text-green-600 mx-auto mb-4" />
          </motion.div>

          <motion.h2
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 120,
              delay: 0.5,
            }}
            className="text-4xl font-bold text-gray-800"
          >
            85%
          </motion.h2>

          <p className="text-gray-600 mt-2">
            Placement Rate
          </p>
        </motion.div>

        <motion.div
          custom={2}
          variants={cardVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          whileHover={{
            y: -12,
            scale: 1.05,
          }}
          className="bg-white shadow-lg rounded-3xl p-8 text-center hover:shadow-2xl transition relative overflow-hidden"
        >
          
          <div className="absolute top-0 left-0 w-full h-1 bg-yellow-500"></div>

          <motion.div
            animate={{
              scale: [1, 1.2, 1],
            }}
            transition={{
              repeat: Infinity,
              duration: 2,
            }}
          >
            <FaStar className="text-5xl text-yellow-500 mx-auto mb-4" />
          </motion.div>

          <motion.h2
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 120,
              delay: 0.7,
            }}
            className="text-4xl font-bold text-gray-800"
          >
            4.8/5
          </motion.h2>

          <p className="text-gray-600 mt-2">
            Student Rating
          </p>
        </motion.div>

      </div>

      <motion.div
        initial={{
          opacity: 0,
          scale: 0.9,
        }}
        whileInView={{
          opacity: 1,
          scale: 1,
        }}
        transition={{
          duration: 0.8,
        }}
        viewport={{ once: true }}
        whileHover={{
          scale: 1.02,
        }}
        className="bg-gradient-to-r from-indigo-600 to-blue-500 
        text-white rounded-3xl p-10 text-center shadow-2xl relative overflow-hidden"
      >

        <motion.div
          animate={{
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 6,
          }}
          className="absolute w-40 h-40 bg-white/10 rounded-full top-[-40px] left-[-40px]"
        />

        <motion.div
          animate={{
            x: [0, -20, 0],
            y: [0, 20, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 5,
          }}
          className="absolute w-32 h-32 bg-white/10 rounded-full bottom-[-20px] right-[-20px]"
        />

        <motion.p
          initial={{
            opacity: 0,
            y: 30,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.3,
            duration: 0.8,
          }}
          className="text-xl md:text-2xl font-medium max-w-3xl mx-auto relative z-10"
        >
          “Over{" "}
          <span className="font-bold">
            5,000+ students
          </span>{" "}
          successfully trained and placed in top companies through our
          professional IT programs.”
        </motion.p>

        <motion.div
          initial={{
            opacity: 0,
          }}
          whileInView={{
            opacity: 1,
          }}
          transition={{
            delay: 0.7,
          }}
          className="mt-6 relative z-10"
        >
          <p className="font-semibold text-lg">
            — SoftTraining Academy
          </p>
        </motion.div>

      </motion.div>
    </section>
  );
};

export default HomeHeroSection4;