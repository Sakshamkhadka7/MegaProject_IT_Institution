import React, { useEffect, useState, memo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { MdOutlineStarRate } from "react-icons/md";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { toast } from "react-toastify";

const API = import.meta.env.VITE_API_URL;
// const API = "http://localhost:3001";


//  Memoized card to prevent unnecessary re-renders
const ReviewCard = memo(({ rev }) => {
  return (
    <div className="relative w-full h-56 rounded-xl overflow-hidden shadow-md group">

      <img
        src={rev.photo}
        alt="review"
        loading="lazy"
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
      />

      <div className="absolute inset-0 bg-black/50 flex items-center justify-center p-4
                      opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 
                      transition-all duration-300">

        <div className="flex flex-col items-center justify-center">

          <p className="text-white text-sm text-center">
            Comment: {rev.comment}
          </p>

          <div className="flex items-center gap-1 mt-2">
            <MdOutlineStarRate className="text-white" size={18} />
            <span className="text-white text-sm">
              {rev.rating}
            </span>
          </div>

        </div>
      </div>
    </div>
  );
});

const Alumni = () => {
  const [review, setReview] = useState([]);
  const [loading,setLoading]=useState(false);

 const getReview = async () => {
  try {
    setLoading(true);

    const res = await fetch(`${API}/api/v1/review/getAllReview`, {
      method: "GET",
      credentials: "include",
    });

    const data = await res.json()

    if (res.ok) {
      setReview(data?.data || []);
    } else {
      console.log("API Error:", data?.message);
      toast.error(data?.message || "Failed to fetch reviews");
    }
  } catch (error) {
    console.log("Error in getReview:", error);
    toast.error("Network error while fetching reviews");
  } finally {
    setLoading(false);
  }
};
  useEffect(() => {
    getReview();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-4">

      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={20}
        slidesPerView={3}
        navigation
        pagination={{ clickable: true }}
        breakpoints={{
          320: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
      >

        {review.map((rev, idx) => (
          <SwiperSlide key={rev._id || idx}>
            <ReviewCard rev={rev} />
          </SwiperSlide>
        ))}

      </Swiper>

    </div>
  );
};

export default Alumni;