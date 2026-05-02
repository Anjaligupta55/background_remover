"use client";

import Hero from "@/components/Hero";
import UploadTool from "@/components/UploadTool";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import Pricing from "@/components/Pricing";
import Footer from "@/components/Footer";
import { motion, useScroll, useSpring } from "framer-motion";

export default function Home() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <main className="relative flex min-h-screen flex-col">
      {/* Scroll progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-secondary z-[100] origin-left"
        style={{ scaleX }}
      />

      {/* Navigation (Sticky blur) */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/50 backdrop-blur-md">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <div className="text-xl font-black flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center text-white text-[10px]">SC</div>
            <span>SnapCut <span className="text-primary">AI</span></span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
            <a href="#features-section" className="hover:text-white transition">Features</a>
            <a href="#upload-section" className="hover:text-white transition">Try Now</a>
            <a href="#pricing-section" className="hover:text-white transition">Pricing</a>
          </div>

          <button 
            onClick={() => document.getElementById("upload-section")?.scrollIntoView({ behavior: "smooth" })}
            className="px-5 py-2.5 bg-white text-black text-sm font-bold rounded-full hover:scale-105 transition active:scale-95"
          >
            Launch App
          </button>
        </div>
      </nav>

      <Hero />
      <UploadTool />
      <HowItWorks />
      <Features />
      <Pricing />
      <Footer />
    </main>
  );
}
