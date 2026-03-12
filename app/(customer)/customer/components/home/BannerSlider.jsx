"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function BannerSlider() {
  return (
    <div className="mt-5">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={20}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000 }}
        loop
      >
        <SwiperSlide>
          <img
            src="/images/banner/Bnnernew2.jpeg"
            alt="banner"
            className="w-full rounded-lg"
          />
        </SwiperSlide>

        <SwiperSlide>
          <img
            src="/images/banner/Bannernew1.jpeg"
            alt="banner"
            className="w-full rounded-lg"
          />
        </SwiperSlide>
      </Swiper>
    </div>
  );
}