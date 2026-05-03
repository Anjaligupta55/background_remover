"use client";

import { motion, useMotionValue, useSpring, useTransform, useScroll } from "framer-motion";
import { useEffect, useState, useMemo } from "react";

export default function Background3D() {
  const [mounted, setMounted] = useState(false);
  const { scrollY } = useScroll();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });
  const springScroll = useSpring(scrollY, { stiffness: 50, damping: 20 });

  // ALL useTransform hooks must be defined here, at the top level
  const followerX = useTransform(springX, (val) => val - 400);
  const followerY = useTransform(springY, (val) => val - 400);
  const gridY = useTransform(springScroll, (val) => (val * -0.5) % 80);

  useEffect(() => {
    setMounted(true);
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 z-[-50] overflow-hidden pointer-events-none bg-black">
      {/* SaaS Mesh Gradient & Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.15),transparent_70%)]"></div>
      <div className="absolute inset-0 bg-mesh animate-mesh opacity-20"></div>

      {/* Mouse Follower Glow */}
      <motion.div 
        className="absolute w-[800px] h-[800px] rounded-full bg-primary/10 blur-[120px]"
        style={{ x: followerX, y: followerY }}
      />

      {/* 3D Wave System */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-full h-full relative" style={{ perspective: "1500px" }}>
          {[...Array(15)].map((_, i) => (
            <ThreeDWave key={i} index={i} springScroll={springScroll} />
          ))}
        </div>
      </div>

      {/* 3D Floating Cubes */}
      <div className="absolute top-[20%] right-[15%] perspective-[1000px]">
        <FloatingCube springX={springX} springY={springY} />
      </div>

      <div className="absolute bottom-[20%] left-[10%] perspective-[1000px]">
        <FloatingCube springX={springX} springY={springY} delay={2} size={60} />
      </div>

      {/* Floating 3D Particles */}
      <div className="absolute inset-0">
        {[...Array(30)].map((_, i) => (
          <Particle key={i} index={i} springX={springX} springY={springY} />
        ))}
      </div>

      {/* Floating 3D-like Shapes */}
      <FloatingShape color="bg-primary/20" size="w-[500px] h-[500px]" initialX="5%" initialY="10%" duration={25} />
      <FloatingShape color="bg-secondary/20" size="w-[600px] h-[600px]" initialX="65%" initialY="40%" duration={30} />
      
      {/* Enhanced Perspective Grid */}
      <div className="absolute inset-0 overflow-hidden" style={{ perspective: "1000px" }}>
        <motion.div 
          className="absolute inset-0 origin-top h-[300%] w-[200%] -left-[50%]"
          style={{ 
            backgroundImage: `
              linear-gradient(to right, rgba(139, 92, 246, 0.2) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(139, 92, 246, 0.2) 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px',
            rotateX: 70,
            y: gridY,
          }}
        >
          {/* Neon Glow Lines */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(139,92,246,0.2),transparent_70%)]"></div>
        </motion.div>
        
        {/* Distance Fade Mask */}
        <div className="absolute inset-0 bg-linear-to-b from-black via-transparent to-black pointer-events-none"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,transparent_0%,black_80%)] pointer-events-none"></div>
      </div>
    </div>
  );
}

function ThreeDWave({ index, springScroll }) {
  const y = useTransform(springScroll, (val) => Math.sin(val / 500 + index) * 100);
  const opacity = useTransform(springScroll, (val) => 0.1 + (Math.sin(val / 1000 + index) * 0.05));

  return (
    <motion.div
      className="absolute left-0 right-0 h-px bg-linear-to-r from-transparent via-primary/30 to-transparent"
      style={{ 
        top: `${index * 7}%`,
        y,
        opacity,
        translateZ: index * 50,
      }}
    />
  );
}

function FloatingCube({ springX, springY, delay = 0, size = 100 }) {
  const rotateX = useTransform(springY, (val) => (val / 10) + (delay * 20));
  const rotateY = useTransform(springX, (val) => (val / 10) + (delay * 30));

  return (
    <motion.div
      style={{ 
        width: size, 
        height: size, 
        rotateX, 
        rotateY, 
        transformStyle: "preserve-3d" 
      }}
      animate={{
        y: [0, -30, 0],
        rotateZ: [0, 15, 0]
      }}
      transition={{
        duration: 6,
        repeat: Infinity,
        delay,
        ease: "easeInOut"
      }}
      className="relative"
    >
      <CubeFace transform={`translateZ(${size/2}px)`} />
      <CubeFace transform={`translateZ(-${size/2}px) rotateY(180deg)`} />
      <CubeFace transform={`translateX(${size/2}px) rotateY(90deg)`} />
      <CubeFace transform={`translateX(-${size/2}px) rotateY(-90deg)`} />
      <CubeFace transform={`translateY(-${size/2}px) rotateX(90deg)`} />
      <CubeFace transform={`translateY(${size/2}px) rotateX(-90deg)`} />
    </motion.div>
  );
}

function CubeFace({ transform }) {
  return (
    <div 
      className="absolute inset-0 border border-white/30 bg-primary/5 backdrop-blur-md"
      style={{ transform }}
    ></div>
  );
}

function Particle({ index, springX, springY }) {
  const { initialX, initialY, size, depth } = useMemo(() => ({
    initialX: Math.random() * 100,
    initialY: Math.random() * 100,
    size: Math.random() * 4 + 2,
    depth: Math.random() * 100 + 20
  }), []);

  const x = useTransform(springX, (val) => (val / 40) * (index % 5 - 2) * (depth / 10));
  const y = useTransform(springY, (val) => (val / 40) * (index % 3 - 1) * (depth / 10));

  return (
    <motion.div
      className="absolute bg-white/30 rounded-full"
      style={{
        width: size,
        height: size,
        left: `${initialX}%`,
        top: `${initialY}%`,
        x,
        y,
        translateZ: depth,
        boxShadow: "0 0 15px rgba(255,255,255,0.4)",
      }}
      animate={{
        opacity: [0.1, 0.4, 0.1],
        scale: [1, 1.4, 1],
      }}
      transition={{
        duration: 4 + Math.random() * 5,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}

function FloatingShape({ color, size, initialX, initialY, duration }) {
  return (
    <motion.div
      className={`absolute rounded-full blur-[140px] ${color} ${size}`}
      style={{ left: initialX, top: initialY }}
      animate={{
        x: [0, 100, -50, 0],
        y: [0, -100, 50, 0],
        scale: [1, 1.15, 0.9, 1],
      }}
      transition={{
        duration: duration,
        repeat: Infinity,
        ease: "linear",
      }}
    />
  );
}

export function TiltCard({ children, className }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className={className}
    >
      <div style={{ transform: "translateZ(80px)" }}>
        {children}
      </div>
    </motion.div>
  );
}
