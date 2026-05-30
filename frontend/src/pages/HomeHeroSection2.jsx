import React from "react";
import { motion } from "framer-motion";
import { FaBookOpen } from "react-icons/fa";
import { FaCode } from "react-icons/fa";
import { FaHome } from "react-icons/fa";
import { FaRocket } from "react-icons/fa6";

const HomeHeroSection2 = () => {
  
  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 80,
    },

    visible: (index) => ({
      opacity: 1,
      y: 0,

      transition: {
        duration: 0.7,
        delay: index * 0.2,
      },
    }),
  };

  return (
    <section className="flex flex-col space-y-10 overflow-hidden">
      
      {/* HEADING */}
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="mt-17"
      >
        <h1 className="text-4xl font-bold text-blue-600 text-center">
          Why Chooses Our Institution for Learning
        </h1>
      </motion.div>

      {/* CARDS */}
      <div className="flex flex-col lg:flex-row justify-center items-center gap-10 p-14 space-y-4 lg:space-y-0">
        
        {/* CARD 1 */}
        <motion.div
          custom={0}
          variants={cardVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          whileHover={{
            scale: 1.05,
            y: -10,
          }}
          className="space-y-5 p-7 rounded-xl shadow-2xl bg-white"
        >
          <motion.h1
            whileHover={{ rotate: 10, scale: 1.2 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <FaBookOpen size={36} className="text-blue-600" />
          </motion.h1>

          <h1 className="font-bold text-xl">
            Job-Oriented Curriculum
          </h1>

          <p>
            Every course is built around what Nepal's top tech companies
            actually hire for — not outdated textbook content
          </p>
        </motion.div>

        {/* CARD 2 */}
        <motion.div
          custom={1}
          variants={cardVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          whileHover={{
            scale: 1.05,
            y: -10,
          }}
          className="space-y-5 p-7 rounded-xl shadow-2xl bg-white"
        >
          <motion.h1
            whileHover={{ rotate: -10, scale: 1.2 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <FaCode size={36} className="text-green-600" />
          </motion.h1>

          <h1 className="font-bold text-xl">
            Real-world Projects
          </h1>

          <p>
            Build a portfolio with live projects that solve real problems —
            the kind employers in Kathmandu want to see.
          </p>
        </motion.div>

        {/* CARD 3 */}
        <motion.div
          custom={2}
          variants={cardVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          whileHover={{
            scale: 1.05,
            y: -10,
          }}
          className="space-y-5 p-7 rounded-xl shadow-2xl bg-white"
        >
          <motion.h1
            whileHover={{ rotate: 10, scale: 1.2 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <FaHome size={36} className="text-orange-500" />
          </motion.h1>

          <h1 className="font-bold text-xl">
            Internship placement
          </h1>

          <p>
            Get matched with an internship in your field within weeks of
            starting. Gain experience that makes your CV stand out.
          </p>
        </motion.div>

        {/* CARD 4 */}
        <motion.div
          custom={3}
          variants={cardVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          whileHover={{
            scale: 1.05,
            y: -10,
          }}
          className="space-y-5 p-7 rounded-xl shadow-2xl bg-white"
        >
          <motion.h1
            whileHover={{ rotate: -10, scale: 1.2 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <FaRocket size={36} className="text-red-500" />
          </motion.h1>

          <h1 className="font-bold text-xl">
            Job placement support
          </h1>

          <p>
            Resume reviews, mock interviews, LinkedIn optimization, and
            direct referrals to our 50+ hiring partners in Nepal.
          </p>
        </motion.div>

      </div>
    </section>
  );
};

export default HomeHeroSection2;