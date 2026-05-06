import React, { useEffect, useState } from "react";

const partners = [
  "Microsoft",
  "Cisco",
  "AWS",
  "Google Cloud",
];

const API = import.meta.env.VITE_API_URL;


const About = () => {
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔥 Fetch instructors from backend
  const getInstructors = async () => {
    try {
      let res = await fetch(
        `${API}/api/v1/student/getInstructor`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (res.ok) {
        res = await res.json();
        setInstructors(res.data);
      }
    } catch (error) {
      console.log("Error fetching instructors", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getInstructors();
  }, []);

  return (
    <div className="bg-gray-50">

    

      
      <section className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-10">
        <div className="bg-white p-6 rounded-xl shadow-sm ">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">
            🎯 Mission
          </h2>
          <p className="text-gray-600">
            Deliver practical, industry-level skills that help students get real jobs.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">
            🚀 Vision
          </h2>
          <p className="text-gray-600">
            Become the #1 platform for skill-based education globally.
          </p>
        </div>
      </section>

     
      <section className="bg-white py-16">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">
            Our Journey
          </h2>

          <div className="space-y-6 border-l-4 border-blue-600 pl-6">
            <div>
              <h3 className="font-semibold text-gray-800">2022</h3>
              <p className="text-gray-600">
                Started with a vision to simplify tech learning.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-800">2023</h3>
              <p className="text-gray-600">
                Reached 1000+ students and launched core courses.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-800">2025</h3>
              <p className="text-gray-600">
                Expanded globally and partnered with tech companies.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-10">
          Meet Our Instructors
        </h2>

        {loading ? (
          <p className="text-center text-gray-500">Loading instructors...</p>
        ) : instructors.length === 0 ? (
          <p className="text-center text-gray-500">No instructors found</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {instructors.map((inst) => (
              <div
                key={inst._id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition duration-300"
              >
                {/* Avatar */}
                <img
                  src={`${API}/image/${inst.avatar}`}
                  alt={inst.fullName}
                  className="w-full h-56 object-cover"
                />

                <div className="p-4 space-y-2">
                  <h3 className="font-semibold text-gray-800">
                    {inst.fullName}
                  </h3>

                  <p className="text-sm text-blue-600">
                    Instructor
                  </p>

                  <p className="text-xs text-gray-500">
                    📧 {inst.email}
                  </p>

                  <p className="text-xs text-gray-500">
                    📞 {inst.phone}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

    
      <section className="bg-gray-100 py-16">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-8">
            Our Partners & Affiliations
          </h2>

          <div className="flex flex-wrap justify-center gap-6">
            {partners.map((partner, idx) => (
              <div
                key={idx}
                className="px-6 py-3 bg-white rounded-xl shadow-sm border text-gray-700 font-medium hover:shadow-md transition"
              >
                {partner}
              </div>
            ))}
          </div>
        </div>
      </section>

  
      <section className="bg-indigo-600 text-white py-16 text-center px-6">
        <h2 className="text-3xl font-bold mb-4">
          Start Your Learning Journey Today
        </h2>
        <p className="text-indigo-100 mb-6">
          Learn from real industry experts and build real projects.
        </p>

        <button className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition">
          Explore Courses
        </button>
      </section>

    </div>
  );
};

export default About;