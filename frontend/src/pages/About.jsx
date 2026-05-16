import React, { useEffect, useState } from "react";
import {
  Users,
  GraduationCap,
  Globe,
  Briefcase,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { toast } from "react-toastify";

const partners = [
  "Microsoft",
  "Cisco",
  "AWS",
  "Google Cloud",
];

const API = import.meta.env.VITE_API_URL;

const stats = [
  {
    icon: Users,
    value: "15K+",
    label: "Students",
  },
  {
    icon: GraduationCap,
    value: "120+",
    label: "Courses",
  },
  {
    icon: Globe,
    value: "25+",
    label: "Countries",
  },
  {
    icon: Briefcase,
    value: "95%",
    label: "Placement Rate",
  },
];

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

    const data = await res.json()

    if (res.ok) {
      setInstructors(data?.data || []);
    } else {
      console.log("API Error:", data?.message);
      toast.error(data?.message || "Failed to fetch instructors");
    }
  } catch (error) {
    console.log("Error fetching instructors:", error);
    toast.error("Network error while fetching instructors");
  } finally {
    setLoading(false);
  }
};
  useEffect(() => {
    getInstructors();
  }, []);

  return (
    <div className="bg-[#0B1120] text-white overflow-hidden">

      {/* HERO SECTION */}
      <section className="relative py-28 px-6">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/30 via-purple-500/20 to-cyan-500/20 blur-3xl"></div>

        <div className="relative max-w-7xl mx-auto grid lg:grid-cols-2 gap-14 items-center">

          <div>
            <p className="text-indigo-400 font-medium mb-4">
              ABOUT OUR PLATFORM
            </p>

            <h1 className="text-5xl md:text-6xl font-black leading-tight mb-6">
              Learn Future Skills
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
                From Industry Experts
              </span>
            </h1>

            <p className="text-gray-400 text-lg leading-relaxed mb-8">
              We help students build real-world skills with
              project-based learning, expert mentorship,
              and industry-ready courses.
            </p>

            <div className="flex gap-4">
              <NavLink to="/courses" className="px-7 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 transition font-semibold">
                Explore Courses
              </NavLink>

              <NavLink to="/blogs" className="px-7 py-3 rounded-xl border border-gray-700 hover:border-indigo-500 transition">
                Learn More
              </NavLink>
            </div>
          </div>

          {/* HERO CARD */}
          <div className="relative">
            <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">

              <div className="grid grid-cols-2 gap-5">
                {stats.map((item, index) => (
                  <div
                    key={index}
                    className="bg-white/5 rounded-2xl p-6 border border-white/10 hover:scale-105 transition"
                  >
                    <item.icon className="w-10 h-10 text-indigo-400 mb-4" />

                    <h2 className="text-3xl font-bold">
                      {item.value}
                    </h2>

                    <p className="text-gray-400 mt-1">
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* MISSION + VISION */}
      <section className="max-w-7xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-10">

        <div className="bg-white/5 border border-white/10 rounded-3xl p-10 hover:border-indigo-500 transition">
          <h2 className="text-3xl font-bold mb-5">
            🎯 Our Mission
          </h2>

          <p className="text-gray-400 leading-relaxed">
            Deliver practical and industry-focused education
            that empowers students to build careers in tech.
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-10 hover:border-cyan-500 transition">
          <h2 className="text-3xl font-bold mb-5">
            🚀 Our Vision
          </h2>

          <p className="text-gray-400 leading-relaxed">
            Become the world’s leading skill-based learning
            ecosystem for developers and creators.
          </p>
        </div>

      </section>

      {/* JOURNEY */}
      <section className="py-24 bg-white/[0.03]">
        <div className="max-w-5xl mx-auto px-6">

          <h2 className="text-4xl font-bold text-center mb-16">
            Our Journey
          </h2>

          <div className="space-y-12 border-l border-indigo-500 pl-10">

            {[
              {
                year: "2022",
                text: "Started with a vision to simplify tech learning."
              },
              {
                year: "2023",
                text: "Reached 1000+ students and launched premium courses."
              },
              {
                year: "2025",
                text: "Expanded globally and partnered with leading companies."
              },
            ].map((item, index) => (
              <div key={index} className="relative">

                <div className="absolute -left-[46px] top-1 w-5 h-5 rounded-full bg-indigo-500"></div>

                <h3 className="text-2xl font-bold mb-2">
                  {item.year}
                </h3>

                <p className="text-gray-400">
                  {item.text}
                </p>

              </div>
            ))}

          </div>
        </div>
      </section>

      {/* INSTRUCTORS */}
      <section className="max-w-7xl mx-auto px-6 py-24">

        <h2 className="text-4xl font-bold text-center mb-16">
          Meet Our Instructors
        </h2>

        {loading ? (
          <p className="text-center text-gray-400">
            Loading instructors...
          </p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

            {instructors.map((inst) => (
              <div
                key={inst._id}
                className="group relative bg-white/5 border border-white/10 rounded-3xl overflow-hidden hover:border-indigo-500 transition duration-500"
              >

                <div className="overflow-hidden">
                  <img
                    src={`${API}/image/${inst.avatar}`}
                    alt={inst.fullName}
                    className="w-full h-72 object-cover group-hover:scale-110 transition duration-700"
                  />
                </div>

                <div className="p-6">

                  <h3 className="text-2xl font-bold mb-2">
                    {inst.fullName}
                  </h3>

                  <p className="text-indigo-400 mb-4">
                    {inst.role}
                  </p>

                  <div className="space-y-2 text-gray-400 text-sm">
                    <p className="text-sm">📧 Email : {inst.email}</p>
                    <p className="text-sm">📞 Phone : {inst.phone}</p>
                    <p className="text-sm">🎓 Qualification {inst.qualification}</p>
                  </div>

                </div>

              </div>
            ))}

          </div>
        )}
      </section>

      {/* PARTNERS */}
      <section className="py-24 bg-white/[0.03]">

        <div className="max-w-7xl mx-auto px-6 text-center">

          <h2 className="text-4xl font-bold mb-14">
            Trusted By Industry Leaders
          </h2>

          <div className="flex flex-wrap justify-center gap-6">

            {partners.map((partner, idx) => (
              <div
                key={idx}
                className="px-10 py-5 rounded-2xl bg-white/5 border border-white/10 text-lg font-semibold text-gray-300 hover:border-indigo-500 hover:text-white transition"
              >
                {partner}
              </div>
            ))}

          </div>

        </div>
      </section>

      {/* CTA */}
      <section className="py-28 px-6">

        <div className="max-w-5xl mx-auto text-center bg-gradient-to-r from-indigo-600 to-cyan-500 rounded-[40px] p-16 shadow-2xl">

          <h2 className="text-5xl font-black mb-6">
            Start Learning Today
          </h2>

          <p className="text-lg text-indigo-100 mb-8">
            Learn modern technologies from experts and
            build real-world projects.
          </p>

          <button className="bg-white text-indigo-600 px-8 py-4 rounded-2xl font-bold hover:scale-105 transition">
            Explore Courses
          </button>

        </div>

      </section>

    </div>
  );
};

export default About;