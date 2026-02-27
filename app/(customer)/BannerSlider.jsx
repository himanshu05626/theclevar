"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const slides = [
  { image: "/images/banner/banner1.jpg" },
  { image: "/images/banner/b11.png" },
];

export default function BannerSlider() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const intervalRef = useRef(null);

  // 👉 AUTO SLIDE CONTROL
  const startAuto = () => {
    stopAuto();
    intervalRef.current = setInterval(() => {
      nextSlide();
    }, 4000);
  };

  const stopAuto = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  useEffect(() => {
    startAuto();
    return () => stopAuto();
  }, [index]);

  // 👉 NAVIGATION
  const nextSlide = () => {
    setDirection(1);
    setIndex((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setDirection(-1);
    setIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  // 👉 ANIMATION (NO FLICKER)
  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? "100%" : "-100%",
    }),
    center: {
      x: 0,
    },
    exit: (direction) => ({
      x: direction > 0 ? "-100%" : "100%",
    }),
  };

  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl bg-black
      h-[180px] sm:h-[220px] md:h-[320px]"
      
      // 👉 Pause on interaction (important UX)
      onMouseEnter={stopAuto}
      onMouseLeave={startAuto}
      onTouchStart={stopAuto}
      onTouchEnd={startAuto}
    >
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={index}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.45 }}
          className="absolute inset-0"
        >
          {/* IMAGE */}
          <motion.img
            src={slides[index].image}
            className="absolute inset-0 w-full h-full object-cover"
            
            // 👉 SWIPE ENABLED
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.9}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = offset.x + velocity.x * 80;

              if (swipe < -120) nextSlide();
              else if (swipe > 120) prevSlide();
            }}
          />

          {/* DARK OVERLAY (PREMIUM LOOK) */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* DOTS */}
      <div className="absolute bottom-2 w-full flex justify-center gap-2">
        {slides.map((_, i) => (
          <div
            key={i}
            onClick={() => {
              setDirection(i > index ? 1 : -1);
              setIndex(i);
            }}
            className={`h-2 rounded-full cursor-pointer transition-all duration-300 ${
              i === index
                ? "w-5 bg-white"
                : "w-2 bg-white/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
}