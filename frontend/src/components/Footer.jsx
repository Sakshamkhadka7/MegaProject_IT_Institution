import React from 'react'
import { FaPhone } from "react-icons/fa";
import { AiFillFacebook } from "react-icons/ai";
import { FaInstagramSquare } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { IoLogoYoutube } from "react-icons/io";
import { MdAttachEmail } from "react-icons/md";
import { SiGooglemaps } from "react-icons/si";

const Footer = () => {
  return (
    <footer className='flex flex-col  lg:flex-row justify-center items-start gap-20 bg-blue-900 text-white p-9 '>
      <div className='space-y-2'>
       <h1 className='font-bold text-2xl'>SoftTraining</h1>
       <h2 className='font-mono text-yellow-300'>Empowering Careers through <br /> Technology Education</h2>

       <p>Nepal Leading IT comapny and traninig <br /> center in narephat-12 , kathmandu</p>
        <h1>kathmandu</h1>
      </div>

      <div className='space-y-2'>
     <h1 className='font-bold text-2xl'>Courses</h1>
     <h1>Full-Stack Development</h1>
     <h1>Mobile-App Development</h1>
     <h1>Data Science & analytics</h1>
     <h1>Digitak marketing</h1>
     <h1>Graphics design and UI/UX</h1>
     <h1>Cloud computing and devOps</h1>

      </div>

      <div className='space-y-2'>
    
    <h1 className='font-bold text-2xl'>Carrer</h1>
    <h1>Job oppurtunities</h1>
    <h1>Internships program</h1>
    <h1>Our gallery</h1>
    <h1>Carrer Network</h1>

      </div>

      <div className='flex flex-col justify-center items-start space-y-2'>
        <h1 className='font-bold text-2xl'>Contact</h1>
        <div className='flex justify-center items-center gap-4'>
          <FaPhone size={22}/>
          <h1>9807123818</h1>
        </div>

        <div className='flex justify-center items-center gap-4'>
          <MdAttachEmail size={22}/>
          <h1>sakshamcode12@gmail.com</h1>
        </div>

        <div className='flex justify-center items-center gap-4'>
          <SiGooglemaps size={22}/>
          <h1>View on Google maps</h1>
        </div>

        <h1>Follow us</h1>
        <div className='flex justify-center items-center gap-4'>
          <AiFillFacebook size={22}/>
          <FaLinkedin size={22} />
          <FaInstagramSquare size={22}/>
          <IoLogoYoutube size={22}/>
        </div>
      </div>
    </footer>
  )
}

export default Footer