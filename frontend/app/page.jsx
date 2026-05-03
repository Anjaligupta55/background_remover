"use client";

import Hero from "@/components/Hero";
import UploadTool from "@/components/UploadTool";
import Features from "@/components/Features";
import Pricing from "@/components/Pricing";
import Footer from "@/components/Footer";
import Background3D from "@/components/Background3D";
import { motion, useScroll, useSpring } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, LogOut, Zap } from "lucide-react";

export default function Home() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const [user, setUser] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    router.refresh();
  };

  return (
    <main className="relative flex min-h-screen flex-col overflow-hidden">
      {/* SaaS Ambient Background */}
      <Background3D />

      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-linear-to-r from-primary via-secondary to-accent z-[100] origin-left"
        style={{ scaleX }}
      />

      {/* Modern Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        isScrolled 
        ? "py-4 bg-black/60 backdrop-blur-xl border-b border-white/5" 
        : "py-8 bg-transparent"
      }`}>
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="text-2xl font-black flex items-center gap-3">
            <div className="w-8 h-8 bg-linear-to-br from-primary to-secondary rounded-lg flex items-center justify-center text-white text-[10px] shadow-2xl">SC</div>
            <span className="tracking-tighter">SnapCut <span className="text-primary">AI</span></span>
          </div>
          
          <div className="hidden md:flex items-center gap-10 text-xs font-black uppercase tracking-[0.2em] text-gray-500">
            <a href="#features-section" className="hover:text-white transition">Features</a>
            <a href="#pricing-section" className="hover:text-white transition">Pricing</a>
            <a href="#" className="hover:text-white transition">API</a>
          </div>

          <div className="flex items-center gap-6">
            {user ? (
              <div className="flex items-center gap-6">
                <div className="hidden lg:flex items-center gap-3 px-4 py-2 glass rounded-xl border-white/5">
                  <Zap size={14} className="text-primary" />
                  <span className="text-[10px] font-black uppercase tracking-widest">{user.credits} Credits</span>
                </div>
                
                <Link href="/dashboard" className="flex items-center gap-3 group">
                  <div className="w-10 h-10 bg-linear-to-br from-primary/20 to-secondary/20 rounded-xl flex items-center justify-center text-primary group-hover:scale-110 transition-all border border-white/5">
                    <User size={18} />
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-[10px] font-black uppercase tracking-widest leading-none mb-1">{user?.name?.split(' ')[0] || 'User'}</p>
                    <p className="text-[8px] font-bold text-gray-500 uppercase tracking-tighter leading-none">{user?.plan || 'Free'} Plan</p>
                  </div>
                </Link>

                <button 
                  onClick={handleLogout}
                  className="p-2 hover:bg-red-500/10 hover:text-red-500 rounded-lg transition-colors text-gray-500"
                  title="Logout"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <>
                <Link href="/login" className="hidden sm:block text-xs font-black uppercase tracking-widest text-white hover:text-primary transition">Log In</Link>
                <Link 
                  href="/signup"
                  className="px-6 py-3 bg-white text-black text-xs font-black uppercase tracking-widest rounded-xl hover:scale-110 active:scale-95 transition shadow-2xl"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <Hero />
      
      <div className="relative">
        {/* Glow behind tool */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[600px] bg-primary/10 rounded-full blur-[150px] -z-10"></div>
        <UploadTool />
      </div>

      <Features />
      <Pricing />
      <Footer />
    </main>
  );
}
