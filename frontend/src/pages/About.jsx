import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, GraduationCap, Globe, Briefcase } from "lucide-react";
import { NavLink } from "react-router-dom";
import { toast } from "react-toastify";

const partners = ["Microsoft", "Cisco", "AWS", "Google Cloud"];

const API = import.meta.env.VITE_API_URL;

const stats = [
  { icon: Users, value: "15K+", label: "Students" },
  { icon: GraduationCap, value: "120+", label: "Courses" },
  { icon: Globe, value: "25+", label: "Countries" },
  { icon: Briefcase, value: "95%", label: "Placement Rate" },
];

const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1 },
};

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0 },
};

const containerStagger = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const About = () => {
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);

  const getInstructors = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${API}/api/v1/student/getInstructor`, {
        method: "GET",
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok) {
        setInstructors(data?.data || []);
        console.log(data.data);
      } else {
        toast.error(data?.message || "Failed to fetch instructors");
      }
    } catch (error) {
      console.log(error);
      toast.error("Network error while fetching instructors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getInstructors();
  }, []);

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={fadeIn}
      className="bg-[#0B1120] text-white overflow-hidden"
    >
      <section className="relative py-28 px-6">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/30 via-purple-500/20 to-cyan-500/20 blur-3xl" />

        <div className="relative max-w-7xl mx-auto grid lg:grid-cols-2 gap-14 items-center">
          <motion.div variants={fadeUp}>
            <p className="text-indigo-400 font-medium mb-4">
              ABOUT OUR PLATFORM
            </p>

            <h1 className="text-5xl md:text-6xl font-black leading-tight mb-6">
              Learn Future Skills
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
                From Industry Experts
              </span>
            </h1>

            <p className="text-gray-400 text-lg mb-8">
              We help students build real-world skills with project-based
              learning.
            </p>

            <div className="flex gap-4">
              <NavLink className="px-7 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 transition">
                Explore Courses
              </NavLink>

              <NavLink className="px-7 py-3 rounded-xl border border-gray-700 hover:border-indigo-500 transition">
                Learn More
              </NavLink>
            </div>
          </motion.div>

          <motion.div
            variants={containerStagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-8"
          >
            <div className="grid grid-cols-2 gap-5">
              {stats.map((item, index) => (
                <motion.div
                  key={index}
                  variants={fadeUp}
                  whileHover={{ scale: 1.05 }}
                  className="bg-white/5 rounded-2xl p-6 border border-white/10"
                >
                  <item.icon className="w-10 h-10 text-indigo-400 mb-4" />
                  <h2 className="text-3xl font-bold">{item.value}</h2>
                  <p className="text-gray-400">{item.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-10">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          whileHover={{ scale: 1.02 }}
          className="bg-white/5 border border-white/10 rounded-3xl p-10"
        >
          <h2 className="text-3xl font-bold mb-5">🎯 Mission</h2>
          <p className="text-gray-400">
            Deliver practical industry-focused education.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          whileHover={{ scale: 1.02 }}
          className="bg-white/5 border border-white/10 rounded-3xl p-10"
        >
          <h2 className="text-3xl font-bold mb-5">🚀 Vision</h2>
          <p className="text-gray-400">
            Build global skill-based learning ecosystem.
          </p>
        </motion.div>
      </section>

      
      <section className="py-24 bg-white/[0.03]">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16">Our Journey</h2>

          <div className="space-y-12 border-l border-indigo-500 pl-10">
            {[
              { year: "2022", text: "Started learning platform." },
              { year: "2023", text: "1000+ students joined." },
              { year: "2025", text: "Global expansion." },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <h3 className="text-2xl font-bold">{item.year}</h3>
                <p className="text-gray-400">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-24">
        <h2 className="text-4xl font-bold text-center mb-16">
          Meet Our Instructors
        </h2>

        {loading ? (
          <p className="text-center text-gray-400">Loading...</p>
        ) : (
          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerStagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            {instructors.map((inst) => (
              <motion.div
                key={inst._id}
                variants={fadeUp}
                whileHover={{ scale: 1.05 }}
                className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden"
              >
                <img src={inst.avatar} className="w-full h-72 object-cover" />

                <div className="p-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl hover:scale-[1.02] transition-all duration-300">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-2xl font-bold text-white shadow-lg">
                      {inst.fullName?.charAt(0)}
                    </div>

                    <div>
                      <h3 className="text-2xl font-bold text-white tracking-wide">
                        {inst.fullName}
                      </h3>

                      <span className="inline-block mt-1 px-3 py-1 text-sm font-medium bg-indigo-500/20 text-indigo-300 rounded-full border border-indigo-400/20">
                        {inst.role}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <p className="text-gray-400 text-sm">Qualification</p>
                      <p className="text-amber-300 font-medium">
                        {inst.qualification}
                      </p>
                    </div>

                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <p className="text-gray-400 text-sm">Email</p>
                      <p className="text-emerald-400 font-medium break-all">
                        {inst.email}
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <p className="text-gray-400 text-sm">Phone</p>
                      <p className="text-indigo-300 font-medium">
                        {inst.phone}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>

      
      <section className="py-24 bg-white/[0.03] text-center">
        <h2 className="text-4xl font-bold mb-14">
          Trusted By Industry Leaders
        </h2>

        <motion.div
          className="flex flex-wrap justify-center gap-6"
          variants={containerStagger}
          initial="hidden"
          whileInView="show"
        >
          {partners.map((p, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              whileHover={{ scale: 1.1 }}
              className="px-10 py-5 bg-white/5 border border-white/10 rounded-2xl"
            >
              {p}
            </motion.div>
          ))}
        </motion.div>
      </section>

     
      <section className="py-28 px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="max-w-5xl mx-auto text-center bg-gradient-to-r from-indigo-600 to-cyan-500 rounded-[40px] p-16"
        >
          <h2 className="text-5xl font-black mb-6">Start Learning Today</h2>

          <button
            whileHover={{ scale: 1.08 }}
            className="bg-white text-indigo-600 px-8 py-4 rounded-2xl font-bold"
          >
            Explore Courses
          </button>
        </motion.div>
      </section>
    </motion.div>
  );
};

export default About;
