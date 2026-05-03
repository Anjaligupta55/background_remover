"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Sparkles, ArrowRight, Zap, PlayCircle } from "lucide-react";
import { useRef } from "react";

export default function Hero() {
  const containerRef = useRef(null);
  const { scrollY } = useScroll();
  
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const y2 = useTransform(scrollY, [0, 500], [0, -150]);
  const rotate = useTransform(scrollY, [0, 500], [0, 45]);

  const scrollToUpload = () => {
    document.getElementById("upload-section")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section ref={containerRef} className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      {/* 3D Blobs & Particles */}
      <motion.div style={{ y: y1 }} className="absolute top-[10%] left-[5%] w-64 h-64 bg-primary/20 rounded-full blur-[100px] -z-10 animate-blob"></motion.div>
      <motion.div style={{ y: y2, rotate }} className="absolute bottom-[20%] right-[10%] w-96 h-96 bg-secondary/20 rounded-full blur-[120px] -z-10 animate-blob animation-delay-2000"></motion.div>
      <div className="absolute top-[40%] left-[45%] w-72 h-72 bg-accent/20 rounded-full blur-[90px] -z-10 animate-blob animation-delay-4000"></div>

      <div className="container mx-auto px-4 text-center z-10 relative">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 px-6 py-2 rounded-full glass border border-white/10 text-sm font-bold text-white mb-10 shadow-2xl"
        >
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
          <span className="bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">New Version 3.0 is here</span>
          <ArrowRight className="w-3 h-3 text-gray-500" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-6xl md:text-8xl font-black tracking-tighter mb-8 max-w-5xl mx-auto leading-[0.9]"
        >
          Erase Backgrounds with <br />
          <span className="text-gradient">Pure AI Intelligence.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed"
        >
          Professional studio-quality transparency in one click. Powered by advanced neural networks for surgically precise edge detection.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6"
        >
          <button
            onClick={scrollToUpload}
            className="group relative px-10 py-5 bg-white text-black rounded-2xl font-black text-xl hover:scale-110 transition-all duration-300 flex items-center gap-3 shadow-[0_20px_50px_rgba(255,255,255,0.2)]"
          >
            Start Creating Free
            <Zap className="w-5 h-5 fill-black" />
          </button>
          
          <button
            onClick={() => document.getElementById("pricing-section")?.scrollIntoView({ behavior: "smooth" })}
            className="group px-10 py-5 glass text-white rounded-2xl font-black text-xl hover:bg-white/5 transition-all duration-300 flex items-center gap-3"
          >
            <PlayCircle className="w-6 h-6 text-primary group-hover:text-white transition-colors" />
            Watch Demo
          </button>
        </motion.div>

        {/* Floating Stat Cards */}
        <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 max-w-4xl mx-auto">
          {[
            { label: "Accuracy", value: "99.9%" },
            { label: "Speed", value: "< 2s" },
            { label: "Downloads", value: "1M+" },
            { label: "Formats", value: "All" }
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + (i * 0.1) }}
              className="glass p-6 rounded-2xl border border-white/5"
            >
              <div className="text-2xl font-black text-white">{stat.value}</div>
              <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
