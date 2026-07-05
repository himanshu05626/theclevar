"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { 
  SparklesIcon, 
  ShoppingBagIcon, 
  EyeIcon, 
  CpuChipIcon, 
  TrophyIcon,
  ClockIcon,
  ChevronRightIcon,
  ShieldCheckIcon
} from "@heroicons/react/24/outline";

export default function AboutPage() {
  // Animation presets
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const timelineData = [
    {
      year: "2024",
      title: "The Conception",
      description: "Clevar was born from a simple thesis: streetwear should be a canvas for individuality, not corporate conformity. We set out to bridge the gap between bespoke tailoring and high-street ease.",
      tag: "The Spark",
      color: "from-cyan-500 to-blue-500"
    },
    {
      year: "2025",
      title: "The Custom Engine",
      description: "We launched our Custom Creator tool. By enabling creators to upload high-fidelity digital art directly onto premium fabric blocks with zero minimum order quantities, we democratized fashion design.",
      tag: "The Engine",
      color: "from-purple-500 to-fuchsia-500"
    },
    {
      year: "2026",
      title: "Immersive WebGL Integration",
      description: "Our current frontier: integrating full real-time 3D simulation. Customers can preview textile physics, light draping, and see exact graphic scaling on virtual fit models before ordering.",
      tag: "The Future",
      color: "from-fuchsia-500 to-pink-500"
    }
  ];

  const stats = [
    { value: "240-380", label: "Fabric GSM", desc: "Heavyweight Loopback Cotton" },
    { value: "0 MOQ", label: "Minimum Orders", desc: "Total Creative Freedom" },
    { value: "10K+", label: "Happy Customers", desc: "Across Pan India" },
    { value: "4.9★", label: "Average Rating", desc: "Quality & Fit Standard" }
  ];

  return (
    <div className="relative min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden font-sans">
      
      {/* Background Grid and Radial Gradient overlays */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        <div className="absolute top-[-5%] left-[-10%] w-[45%] h-[45%] rounded-full bg-cyan-500/10 blur-[140px] animate-pulse duration-[10s]" />
        <div className="absolute top-[40%] right-[-10%] w-[50%] h-[50%] rounded-full bg-fuchsia-500/10 blur-[160px] animate-pulse duration-[12s]" />
        <div className="absolute bottom-[5%] left-[10%] w-[45%] h-[45%] rounded-full bg-violet-500/10 blur-[130px]" />
      </div>

      {/* ================= HERO SECTION ================= */}
      <section className="relative z-10 min-h-[calc(100vh-80px)] flex items-center px-4 sm:px-6 md:px-8 py-16 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16 items-center w-full">
          
          {/* Left Column: Heading & Intro (Spans 2 columns) */}
          <motion.div 
            className="lg:col-span-2 space-y-8 text-left"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-950/20 text-[11px] tracking-widest text-cyan-400 uppercase font-bold">
              <SparklesIcon className="w-3.5 h-3.5 text-cyan-400 animate-pulse" /> The Clevar Story
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05]">
              We Don't Just Sell Clothes.<br />
              <span className="bg-gradient-to-r from-cyan-400 via-violet-400 to-fuchsia-500 bg-clip-text text-transparent">
                We Code Individuality.
              </span>
            </h1>

            <p className="max-w-xl text-base md:text-lg text-gray-400 leading-relaxed font-light">
              We merge modern tech with premium streetwear templates. Minimalist. Customizable. Bold statement pieces. Designed for a generation that refuses to fit into pre-defined boxes, choosing instead to design their own path.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                href="/shop"
                className="group relative inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-sm font-bold text-black transition-all hover:bg-neutral-200 hover:shadow-[0_0_30px_rgba(255,255,255,0.15)]"
              >
                Explore Drops
                <ShoppingBagIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/custom"
                className="group relative inline-flex items-center gap-2 rounded-xl border border-white/10 bg-neutral-950/40 backdrop-blur-md px-8 py-4 text-sm font-bold text-white transition-all hover:border-cyan-500/50 hover:bg-neutral-900 hover:shadow-[0_0_30px_rgba(6,182,212,0.1)]"
              >
                Custom Lab
                <ChevronRightIcon className="w-4 h-4 text-cyan-400 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </motion.div>

          {/* Right Column: Founder Portrait Card (Frameless, Spans 1 column) */}
          <motion.div 
            className="lg:col-span-1 flex justify-center lg:justify-end"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="relative group w-72 sm:w-85 aspect-[4/5] overflow-hidden rounded-[24px] bg-neutral-900 border border-white/10 shadow-2xl">
              <img
                src="/founder.jpeg"
                alt="Himanshu Sharma"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
              />
              
              {/* Premium Editorial Gradient Vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
              
              {/* Elegant diagonal shine sweep on hover */}
              <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-out bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />

              {/* Clean Info Overlay Content */}
              <div className="absolute bottom-6 inset-x-6 z-20 text-left">
                <span className="text-[10px] text-cyan-400 tracking-widest uppercase font-bold">Founder & Visionary</span>
                <h3 className="text-xl sm:text-2xl font-black text-white tracking-wide mt-1">Himanshu Sharma</h3>
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* ================= STATS SECTION ================= */}
      <section className="relative z-10 py-16 px-4 md:px-8 border-t border-white/5 bg-[#080808]/40">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={fadeIn}
                className="group relative rounded-2xl border border-white/5 bg-neutral-900/20 p-6 text-center hover:border-white/10 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300" />
                <p className="text-3xl md:text-4xl lg:text-5xl font-black bg-gradient-to-r from-white via-neutral-200 to-gray-400 bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300">
                  {stat.value}
                </p>
                <p className="text-xs uppercase tracking-widest font-bold text-cyan-400 mt-2">
                  {stat.label}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {stat.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ================= THE STORY / LETTER SECTION ================= */}
      <section className="relative z-10 py-24 px-4 md:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            className="space-y-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            
            {/* Tagline */}
            <motion.div className="text-center md:text-left space-y-3" variants={fadeIn}>
              <span className="text-xs tracking-widest text-fuchsia-400 uppercase font-extrabold">
                OUR VISION & PHILOSOPHY
              </span>
              <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
                Behind The Brand.
              </h2>
            </motion.div>

            {/* Letter Body */}
            <motion.div 
              className="relative border-l-2 border-cyan-500/40 pl-6 md:pl-8 space-y-6 text-gray-300"
              variants={fadeIn}
            >
              <p className="text-lg md:text-xl leading-relaxed text-white/90 font-medium italic">
                "Building The Clevar has been more than just launching a clothing brand—it's about engineering a platform where creativity meets individuality without barriers."
              </p>
              
              <p className="text-sm md:text-base leading-relaxed font-light">
                At The Clevar, we believe apparel should be an extension of your mind, not a mass-produced uniform. Our vision is to redefine online shopping by offering premium, custom-fit streetwear templates. We give you the raw design assets, the high-grade fabric canvases, and the custom tools, leaving the creative execution entirely in your hands. 
              </p>
              
              <p className="text-sm md:text-base leading-relaxed font-light">
                Every startup starts as a blueprint, but it gains life through execution, user feedback, and the trust of its early community. As we scale, our core promise remains unchanged: to never compromise on material luxury, and to continue pioneering interactive technologies that place design power in your browser.
              </p>

              <p className="text-sm md:text-base font-bold text-cyan-400 tracking-wide uppercase pt-2">
                Redefining the algorithm, one custom thread at a time.
              </p>
            </motion.div>

            {/* Signature & Author Info */}
            <motion.div className="pt-6 flex items-center gap-4" variants={fadeIn}>
              <div className="h-[1px] w-12 bg-neutral-800" />
              <div>
                <h4 className="text-base font-extrabold text-white">Himanshu Sharma</h4>
                <p className="text-xs text-gray-500 uppercase tracking-widest mt-0.5">Founder, The Clevar</p>
              </div>
            </motion.div>

          </motion.div>
        </div>
      </section>

      {/* ================= INTERACTIVE JOURNEY TIMELINE ================= */}
      <section className="relative z-10 py-24 px-4 md:px-8 border-t border-white/5 bg-[#080808]/20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-20 space-y-4">
            <span className="text-xs tracking-widest text-cyan-400 uppercase font-extrabold">MILESTONES & FUTURE</span>
            <h3 className="text-3xl md:text-5xl font-black text-white">
              The Evolution Path
            </h3>
            <p className="text-gray-400 text-sm max-w-md mx-auto font-light">
              How we scaled from a simple concept to a technology-driven apparel collective.
            </p>
          </div>

          <div className="relative border-l border-white/10 md:border-l-0 md:before:absolute md:before:left-1/2 md:before:top-0 md:before:h-full md:before:w-[1px] md:before:bg-white/10 space-y-12 md:space-y-24">
            {timelineData.map((item, index) => {
              const isEven = index % 2 === 0;
              return (
                <motion.div 
                  key={index}
                  className="relative pl-6 md:pl-0 md:grid md:grid-cols-12 md:gap-8 items-center"
                  initial={{ opacity: 0, x: isEven ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                >
                  {/* Timeline Point Bubble */}
                  <div className="absolute left-[-5px] top-1.5 md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 z-20 w-[11px] h-[11px] rounded-full bg-black border-2 border-cyan-400" />

                  {/* Year/Tag Block (Desktop: alternates sides, Mobile: always on top) */}
                  <div className={`md:col-span-5 ${isEven ? "md:text-right" : "md:order-last text-left"}`}>
                    <div className="space-y-2 mb-4 md:mb-0">
                      <span className={`text-5xl font-black bg-gradient-to-r ${item.color} bg-clip-text text-transparent`}>
                        {item.year}
                      </span>
                      <div className="text-xs font-black tracking-widest text-cyan-400/80 uppercase">
                        {item.tag}
                      </div>
                    </div>
                  </div>

                  {/* Spacer Column for center alignment on desktop */}
                  <div className="hidden md:block md:col-span-2 text-center" />

                  {/* Card Content Block */}
                  <div className={`md:col-span-5 ${isEven ? "md:order-last" : ""}`}>
                    <div className="p-6 md:p-8 rounded-2xl border border-white/5 bg-neutral-900/10 backdrop-blur-sm hover:border-white/10 transition-all duration-300">
                      <h4 className="text-lg font-bold text-white mb-2">{item.title}</h4>
                      <p className="text-xs md:text-sm text-gray-400 leading-relaxed font-light">
                        {item.description}
                      </p>
                    </div>
                  </div>

                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= THE VALUES & CORE PILLARS ================= */}
      <section className="relative z-10 py-24 px-4 md:px-8 max-w-7xl mx-auto border-t border-white/5">
        <div className="text-center mb-16 space-y-4">
          <span className="text-xs tracking-widest text-fuchsia-400 uppercase font-extrabold">WHY THE CLEVAR</span>
          <h3 className="text-3xl md:text-4xl font-black text-white">
            Built Different. <span className="bg-gradient-to-r from-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">Made For You.</span>
          </h3>
          <p className="text-gray-400 text-sm max-w-md mx-auto font-light">
            We merge premium apparel construction with browser-based technology to provide a new class of streetwear.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Card 1 */}
          <motion.div
            className="group relative rounded-2xl border border-white/5 bg-neutral-900/20 backdrop-blur-md p-8 hover:border-cyan-500/30 transition-all duration-300 overflow-hidden"
            whileHover={{ y: -6 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-cyan-500/5 to-transparent rounded-2xl" />
            
            <div className="p-3 bg-cyan-950/30 border border-cyan-500/25 text-cyan-400 w-fit rounded-xl mb-6">
              <TrophyIcon className="w-6 h-6" />
            </div>

            <h4 className="text-lg font-bold text-white mb-3">Premium Construction</h4>
            <p className="text-xs md:text-sm text-gray-400 leading-relaxed font-light">
              Every blank garment is custom woven from long-staple combed cotton, double-needle overlocked, and pre-shrunk to retain structure and heavy hand-feel across years.
            </p>
          </motion.div>

          {/* Card 2 */}
          <motion.div
            className="group relative rounded-2xl border border-white/5 bg-neutral-900/20 backdrop-blur-md p-8 hover:border-fuchsia-500/30 transition-all duration-300 overflow-hidden"
            whileHover={{ y: -6 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-fuchsia-500/5 to-transparent rounded-2xl" />

            <div className="p-3 bg-fuchsia-950/30 border border-fuchsia-500/25 text-fuchsia-400 w-fit rounded-xl mb-6">
              <CpuChipIcon className="w-6 h-6" />
            </div>

            <h4 className="text-lg font-bold text-white mb-3">Zero Minimum Custom Engine</h4>
            <p className="text-xs md:text-sm text-gray-400 leading-relaxed font-light">
              No setup fees, no bulk minimums. Simply design a single high-impact item using our workspace. We print using high-density direct-to-garment digital rigs and ship within 5-7 days.
            </p>
          </motion.div>

          {/* Card 3 */}
          <motion.div
            className="group relative rounded-2xl border border-white/5 bg-neutral-900/20 backdrop-blur-md p-8 hover:border-violet-500/30 transition-all duration-300 overflow-hidden"
            whileHover={{ y: -6 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-violet-500/5 to-transparent rounded-2xl" />

            <div className="p-3 bg-violet-950/30 border border-violet-500/25 text-violet-400 w-fit rounded-xl mb-6">
              <EyeIcon className="w-6 h-6" />
            </div>

            <h4 className="text-lg font-bold text-white mb-3">Immersive WebGL Simulation</h4>
            <p className="text-xs md:text-sm text-gray-400 leading-relaxed font-light">
              We eliminate design doubt. By implementing 3D visualization inside the browser, you get a clean, physical render of scale, seams, and fit before hitting production.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ================= CRAFTSMANSHIP DETAILS SHOWCASE ================= */}
      <section className="relative z-10 py-24 px-4 md:px-8 max-w-7xl mx-auto border-t border-white/5 bg-[#080808]/20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <div className="space-y-6">
            <span className="text-xs tracking-widest text-cyan-400 uppercase font-extrabold">MATERIAL LUXURY</span>
            <h3 className="text-3xl md:text-5xl font-black text-white leading-tight">
              Crafted To Last.<br />Thread By Thread.
            </h3>
            <p className="text-gray-400 text-sm md:text-base leading-relaxed font-light">
              We spent over 12 months sourcing, weaving, and testing our custom fabric blends. By designing our blanks from the yarn up, we maintain absolute quality control.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
              <div className="flex gap-3">
                <ShieldCheckIcon className="w-6 h-6 text-cyan-400 flex-shrink-0" />
                <div>
                  <h5 className="font-bold text-white text-sm">240 GSM Combed Cotton</h5>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">Soft, premium, and structured enough for a perfect oversized street drape.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <ShieldCheckIcon className="w-6 h-6 text-fuchsia-400 flex-shrink-0" />
                <div>
                  <h5 className="font-bold text-white text-sm">380 GSM Heavy Fleece</h5>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">Perfect weight hoodies that keep their silhouette, features, and warmth.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <ShieldCheckIcon className="w-6 h-6 text-purple-400 flex-shrink-0" />
                <div>
                  <h5 className="font-bold text-white text-sm">Double-Stitch Ribbing</h5>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">Ribbed collar and cuffs designed to resist stretching, keeping garments looking new.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <ShieldCheckIcon className="w-6 h-6 text-pink-400 flex-shrink-0" />
                <div>
                  <h5 className="font-bold text-white text-sm">Eco-Conscious Inks</h5>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">Water-based premium inks that cure deep in fibers, preventing crack or peel issues.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Graphic Visual of fabric macro structure or streetwear mockup */}
          <div className="relative h-[350px] md:h-[450px] rounded-3xl overflow-hidden border border-white/10 bg-neutral-950 p-3 shadow-2xl flex justify-center items-center">
            {/* Ambient background glow inside the frame */}
            <div className="absolute w-60 h-60 rounded-full bg-cyan-500/10 blur-[80px]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,#000_100%)] z-10" />
            
            {/* Visual representation card */}
            <div className="relative z-20 text-center space-y-4 max-w-sm px-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-fuchsia-500/30 bg-fuchsia-950/20 text-[10px] tracking-widest text-fuchsia-400 uppercase font-black">
                Technical Blueprint
              </span>
              <h4 className="text-xl font-extrabold text-white">Advanced Streetwear Engineering</h4>
              <p className="text-xs text-gray-400 leading-relaxed font-light">
                Our templates are tailor-engineered specifically for DTG digital creation. The weave tightness is optimized to capture high-density graphic print clarity and vibrant color representation.
              </p>
              
              <div className="flex justify-center gap-3 pt-2">
                <span className="px-2.5 py-1 rounded border border-white/5 bg-white/5 text-[10px] font-mono text-gray-300">COMPACT YARN</span>
                <span className="px-2.5 py-1 rounded border border-white/5 bg-white/5 text-[10px] font-mono text-gray-300">LOW-PILLING</span>
                <span className="px-2.5 py-1 rounded border border-white/5 bg-white/5 text-[10px] font-mono text-gray-300">PRE-SHRUNK</span>
              </div>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}