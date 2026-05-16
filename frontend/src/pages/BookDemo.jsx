import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";

const API = import.meta.env.VITE_API_URL;


const BookDemo = () => {
  const { state } = useLocation();

  const [formData, setFormData] = useState({
    date: "",
    timeSlot: "", //  added
  });

  const [availableSlot, setAvailableSlot] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // handle input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // fetch available slots based on date
  const getAvailableSlot = async (selectedDate) => {
    try {
      let res = await fetch(
        `${API}/api/v1/demo/getAvailableSLot/${state._id}?date=${selectedDate}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (res.ok) {
        res = await res.json();
        setAvailableSlot(res.data); //  store slots
        console.log(res.data);
      }
    } catch (error) {
      console.log("Error occured at getAvailableSlot", error);
    }
  };

  // call API when date changes
  useEffect(() => {
    if (formData.date) {
      getAvailableSlot(formData.date);
    }
  }, [formData.date]);

  // booking API
  const bookDemo = async () => {
  try {
    setLoading(true);

    const res = await fetch(`${API}/api/v1/demo/bookDemo`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        courses: state?._id,
        ...formData, // includes timeSlot
      }),
    });

    const data = await res.json().catch(() => null);

    if (res.ok) {
      setSuccess(true);
      toast.success(data?.message || "Demo booked successfully");
    } else {
      toast.error(data?.message || "Failed to book demo");
    }
  } catch (error) {
    console.log("Error occurred at bookDemo:", error);
    toast.error("Network error while booking demo");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-md grid md:grid-cols-2 overflow-hidden">
        
        {/* Left Section */}
        <div className="bg-blue-600 text-white p-8">
          <h2 className="text-2xl font-bold mb-4">Book a Free Demo</h2>
          <div className="bg-blue-500 p-4 rounded-xl">
            <h3 className="font-semibold text-lg">
              {state?.title}
            </h3>
            <p className="text-sm mt-2">{state?.descriptions}</p>
          </div>
        </div>

        {/* Right Section */}
        <div className="p-8">
          {!success ? (
            <>
              <h2 className="text-xl font-semibold mb-6">
                Schedule Your Demo
              </h2>

              <div className="space-y-4">
                {/* Name */}
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border p-3 rounded-lg"
                />

                {/* Email */}
                <input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border p-3 rounded-lg"
                />

                {/* Date */}
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full border p-3 rounded-lg"
                />

                {/* Slots */}
                {availableSlot.length > 0 && (
                  <div>
                    <p className="text-sm mb-2">Available Slots:</p>

                    <div className="grid grid-cols-3 gap-2">
                      {availableSlot.map((slot, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() =>
                            setFormData({
                              ...formData,
                              timeSlot: slot,
                            })
                          }
                          className={`p-2 rounded-lg border text-sm ${
                            formData.timeSlot === slot
                              ? "bg-blue-600 text-white"
                              : "bg-gray-100"
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Button */}
                <button
                  onClick={bookDemo}
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg"
                >
                  {loading ? "Booking..." : "Book Demo"}
                </button>
              </div>
            </>
          ) : (
            <div className="text-center">
              <h2 className="text-2xl text-green-600">
                Demo Booked 🎉
              </h2>
              <p>We will contact you soon.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookDemo;