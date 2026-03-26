import React from 'react'
import { FaBookOpen } from "react-icons/fa";
import { FaCode } from "react-icons/fa";
import { FaHome } from "react-icons/fa";
import { FaRocket } from "react-icons/fa6";
const HomeHeroSection2 = () => {
  return (
     <section className="flex flex-col space-y-10">
       
        <div className="mt-17"> <h1 className="text-4xl font-bold text-blue-600 text-center">
          Why Chooses Our Institution for Learning
        </h1></div>{" "}
        <div className="flex flex-col lg:flex-row justify-center items-center gap-10 p-14 space-y-4">
          <div className="space-y-5  p-7 rounded-xl shadow-2xl">
            <h1>
              <FaBookOpen size={36} />
            </h1>
            <h1 className="font-bold text-xl">Job-Oriented Curriculum</h1>
            <p>
              Every course is built around what Nepal's top tech companies
              actually hire for — not outdated textbook content
            </p>
          </div>
          <div className="space-y-5 p-7 rounded-xl shadow-2xl">
            <h1>
              <FaCode size={36} />
            </h1>
            <h1 className="font-bold text-xl">Real-world Projects</h1>
            <p>
              Build a portfolio with live projects that solve real problems —
              the kind employers in Kathmandu want to see.
            </p>
          </div>
          <div className="space-y-5 p-7 rounded-xl shadow-2xl">
            <h1>
              <FaHome size={36} />
            </h1>
            <h1 className="font-bold text-xl">Internship placement</h1>
            <p>
              Get matched with an internship in your field within weeks of
              starting. Gain experience that makes your CV stand out.
            </p>
          </div>

          <div className="space-y-5 p-7 rounded-xl shadow-2xl">
            <h1>
              <FaRocket size={36} />
            </h1>
            <h1 className="font-bold text-xl">Job placement support</h1>
            <p>
              Resume reviews, mock interviews, LinkedIn optimization, and direct
              referrals to our 50+ hiring partners in Nepal.
            </p>
          </div>
        </div>
      </section>
  )
}

export default HomeHeroSection2