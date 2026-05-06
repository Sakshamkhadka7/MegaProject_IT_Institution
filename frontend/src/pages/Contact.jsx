import React, { useState } from "react";
import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";
import { toast } from "react-toastify";

const API = import.meta.env.VITE_API_URL;


const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    purpose: "Course Inquiry",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(
        `${API}/api/v1/contact/createContact`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to send message");
      }

      toast.success("Message sent successfully!");

      setFormData({
        name: "",
        email: "",
        purpose: "Course Inquiry",
        message: "",
      });
    } catch (error) {
      console.error("Contact Error:", error);
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10">

        
        <div className="bg-white p-8 rounded-2xl shadow-xl">
          <h2 className="text-3xl font-bold mb-6">Contact Us</h2>

          <form onSubmit={handleSubmit} className="space-y-5">

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Name"
              className="w-full border p-3 rounded-lg"
              required
            />

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full border p-3 rounded-lg"
              required
            />

            <select
              name="purpose"
              value={formData.purpose}
              onChange={handleChange}
              className="w-full border p-3 rounded-lg"
            >
              <option>Course Inquiry</option>
              <option>Technical Support</option>
              <option>General Question</option>
            </select>

            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Message"
              rows="5"
              className="w-full border p-3 rounded-lg"
              required
            />

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
            >
              Send Message
            </button>
          </form>
        </div>

       
        <div className="space-y-6">

       
          <div className="bg-white p-6 rounded-2xl shadow-xl">
            <h3 className="text-2xl font-bold mb-4">Location</h3>
            <p>📍 Kathmandu, Nepal</p>
            <p>📞 +977-9800000000</p>
            <p>📧 support@yourplatform.com</p>
          </div>

          {/* Map */}
          <div className="bg-white p-4 rounded-2xl shadow-xl">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7066.99928973088!2d85.33583165674843!3d27.670948254416224!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb19e58a6d1331%3A0x18ad0afdf12f826f!2sBalkumari%2C%20Lalitpur%2044600!5e0!3m2!1sen!2snp!4v1777906204568!5m2!1sen!2snp"
              width="100%"
              height="450"
              style={{ border: "0" }}
              loading="lazy"
            ></iframe>
          </div>

         
          <div className="bg-white p-6 rounded-2xl shadow-xl">
            <h3 className="text-xl font-bold mb-4">Follow Us</h3>

            <div className="flex gap-6 text-3xl">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
              >
                <FaFacebook />
              </a>

              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
              >
                <FaInstagram className="text-pink-500" />
              </a>

              <a
                href="https://linkedin.com/in/saksham-khadka-9981a4328"
                target="_blank"
                rel="noreferrer"
              >
                <FaLinkedin className="text-blue-700" />
              </a>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ContactUs;