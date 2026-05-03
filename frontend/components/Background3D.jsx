"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function Background3D() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="fixed inset-0 z-[-50] bg-black"></div>;

  return (
    <div className="fixed inset-0 z-[-50] overflow-hidden pointer-events-none bg-black">
      {/* Dynamic Gradient Mesh - Much Lighter than WebGL or 50+ Particles */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-secondary/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Subtle Animated Mesh Overlay */}
      <div className="absolute inset-0 bg-mesh opacity-[0.03]"></div>

      {/* Static Grid - Lightweight alternative to the 3D rotating grid */}
      <div 
        className="absolute inset-0 opacity-[0.15]" 
        style={{ 
          backgroundImage: `linear-gradient(rgba(139, 92, 246, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(139, 92, 246, 0.2) 1px, transparent 1px)`,
          backgroundSize: '100px 100px',
          maskImage: 'radial-gradient(ellipse at center, black, transparent 80%)'
        }}
      ></div>

      {/* Distant Glows */}
      <motion.div 
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-[20%] left-[30%] w-64 h-64 bg-primary/10 rounded-full blur-[80px]"
      />
    </div>
  );
}

// Optimized TiltCard using only simple transforms
export function TiltCard({ children, className }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
