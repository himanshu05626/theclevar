"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectCoverflow } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";

const slides = [
  { image: "/images/banner/banner1.jpg" },
  { image: "/images/banner/b11.png" },
  
];

export default function PremiumBanner() {
  return (
    <div className="w-full px-3 sm:px-6 mt-4">
      <Swiper
        modules={[Autoplay, Pagination, EffectCoverflow]}
        effect="coverflow"
        centeredSlides={true}
        slidesPerView={1.1}
        spaceBetween={20}
        loop={true}
        autoplay={{
          delay: 3500,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        coverflowEffect={{
          rotate: 0,
          stretch: 0,
          depth: 120,
          modifier: 2.5,
          slideShadows: false,
        }}
        className="!overflow-visible"
      >
        {slides.map((slide, i) => (
          <SwiperSlide key={i}>
            <div
              className="
                relative rounded-3xl overflow-hidden
                bg-[#0f0f0f]
                border border-white/10
                shadow-[0_0_40px_rgba(14,165,233,0.15)]
                transition-all duration-500
              "
            >
              {/* IMAGE */}
              <img
                src={slide.image}
                className="w-full h-[180px] sm:h-[260px] md:h-[340px] object-cover"
              />

              {/* GLASS OVERLAY */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/40" />

              {/* NEON GLOW EDGE */}
              <div className="absolute inset-0 rounded-3xl pointer-events-none
                shadow-[inset_0_0_30px_rgba(56,189,248,0.2)]" />

              {/* OPTIONAL TEXT */}
              <div className="absolute bottom-4 left-4">
                <h2 className="text-white text-lg sm:text-xl font-semibold">
                  CLEVAR DROP
                </h2>
                <p className="text-gray-300 text-xs sm:text-sm">
                  Premium Streetwear
                </p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* CUSTOM DOT STYLING */}
      <style jsx global>{`
        .swiper-pagination {
          margin-top: 10px;
        }

        .swiper-pagination-bullet {
          width: 8px;
          height: 8px;
          background: rgba(255,255,255,0.3);
          opacity: 1;
          border-radius: 999px;
          transition: all 0.3s ease;
        }

        .swiper-pagination-bullet-active {
          width: 22px;
          background: linear-gradient(90deg, #0ea5e9, #38bdf8);
          box-shadow: 0 0 12px rgba(56,189,248,0.8);
        }
      `}</style>
    </div>
  );
}