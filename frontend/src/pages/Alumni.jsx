import React, { useEffect, useState } from "react";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { MdOutlineStarRate } from "react-icons/md";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

const API = import.meta.env.VITE_API_URL;


const Alumni = () => {
  const [review, setReview] = useState([]);

  const getReview = async () => {
    try {
      let res = await fetch(
        `${API}/api/v1/review/getAllReview`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (res.ok) {
        res = await res.json();
        setReview(res.data);
        console.log(res.data);
      }
    } catch (error) {
      console.log("Error occured at getReview", error);
    }
  };

  useEffect(() => {
    getReview();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-4">
      <Swiper
        modules={[Navigation, Pagination, Scrollbar, A11y]}
        spaceBetween={20}
        slidesPerView={3}
        navigation
        pagination={{ clickable: true }}
        scrollbar={{ draggable: true }}
      >
        {review.map((rev, idx) => (
          <SwiperSlide key={idx}>
            
            <div className="relative w-full h-56 rounded-xl overflow-hidden shadow-md group">

             
              <img
                src={`${API}/image/${rev.photo}`}
                alt="review"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-black/50 flex items-center justify-center p-4
                              opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 
                              transition-all duration-300">

               <div className="flex flex-col items-center justify-center">
                 <p className="text-white text-sm text-center leading-relaxed">
                  Comment:{rev.comment}

                </p>

               <div className="flex justify-between items-center">

                <MdOutlineStarRate className="text-white" size={20}/>
                 <h1 className="text-white text-sm text-center leading-relaxed">
                    Rate  : {rev.rating}
                    
                    </h1>
               </div>
               </div>
              </div>

            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Alumni;