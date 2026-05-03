"use client";

import { motion } from "framer-motion";
import { ShieldCheck, CreditCard, Database, Activity, Globe, MessageSquare, Share2, Camera, Cpu, Layers } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="pt-32 pb-16 relative border-t border-white/5">
      {/* SaaS Trust Section */}
      <div className="container mx-auto px-4 mb-32">
        <div className="text-center mb-12">
          <p className="text-gray-500 font-bold uppercase tracking-[0.3em] text-xs">Built on Modern Infrastructure</p>
        </div>
        <div className="flex flex-wrap justify-center gap-8 md:gap-20 items-center opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700">
          <div className="flex items-center gap-3">
            <Cpu className="w-6 h-6" />
            <span className="font-black text-sm tracking-tight">NVIDIA H100 GPU</span>
          </div>
          <div className="flex items-center gap-3">
            <Layers className="w-6 h-6" />
            <span className="font-black text-sm tracking-tight">NEXT.JS 16</span>
          </div>
          <div className="flex items-center gap-3">
            <Database className="w-6 h-6" />
            <span className="font-black text-sm tracking-tight">MONGODB</span>
          </div>
          <div className="flex items-center gap-3">
            <Activity className="w-6 h-6" />
            <span className="font-black text-sm tracking-tight">VERCEL EDGE</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 mb-24">
          <div className="md:col-span-5">
            <div className="text-3xl font-black mb-8 flex items-center gap-3">
              <div className="w-10 h-10 bg-linear-to-br from-primary to-secondary rounded-xl flex items-center justify-center text-white text-xs shadow-2xl">SC</div>
              SnapCut <span className="text-primary">AI</span>
            </div>
            <p className="text-gray-400 max-w-md mb-10 leading-relaxed text-lg">
              The world&apos;s most advanced background removal engine. 
              Helping creators and developers focus on building, not masking.
            </p>
            <div className="flex gap-4">
              {[
                { icon: Globe, link: "#" },
                { icon: MessageSquare, link: "#" },
                { icon: Share2, link: "#" },
                { icon: Camera, link: "#" }
              ].map((social, i) => (
                <motion.a 
                  key={i}
                  href={social.link}
                  whileHover={{ y: -5, scale: 1.1 }}
                  className="w-12 h-12 rounded-2xl glass flex items-center justify-center hover:bg-white/10 transition border border-white/5 shadow-xl"
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </div>

          <div className="md:col-span-2">
            <h4 className="font-black mb-8 text-white uppercase tracking-widest text-xs">Technology</h4>
            <ul className="space-y-5 text-gray-500 text-sm font-bold">
              <li><a href="#" className="hover:text-primary transition">API Access</a></li>
              <li><a href="#" className="hover:text-primary transition">Cloud Engines</a></li>
              <li><a href="#" className="hover:text-primary transition">Integrations</a></li>
              <li><a href="#" className="hover:text-primary transition">System Status</a></li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="font-black mb-8 text-white uppercase tracking-widest text-xs">Resources</h4>
            <ul className="space-y-5 text-gray-500 text-sm font-bold">
              <li><a href="#" className="hover:text-primary transition">Documentation</a></li>
              <li><a href="#" className="hover:text-primary transition">Case Studies</a></li>
              <li><a href="#" className="hover:text-primary transition">Developer Blog</a></li>
              <li><a href="#" className="hover:text-primary transition">GitHub Repo</a></li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <h4 className="font-black mb-8 text-white uppercase tracking-widest text-xs">Newsletter</h4>
            <div className="relative group">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="w-full px-6 py-4 glass rounded-2xl border border-white/5 focus:border-primary/50 outline-none transition font-medium"
              />
              <button className="absolute right-2 top-2 bottom-2 px-4 bg-white text-black rounded-xl font-bold text-xs hover:bg-primary hover:text-white transition group-hover:shadow-2xl">
                Join
              </button>
            </div>
            <p className="mt-4 text-[10px] text-gray-600 font-bold uppercase tracking-widest">Join 50,000+ creators.</p>
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-gray-500 text-xs font-bold tracking-widest uppercase">
            SnapCut AI &copy; {currentYear}. Engineered in California.
          </div>
          <div className="flex gap-8 text-xs font-bold text-gray-500 uppercase tracking-widest">
            <a href="#" className="hover:text-white transition">Privacy</a>
            <a href="#" className="hover:text-white transition">Terms</a>
            <a href="#" className="hover:text-white transition">Cookies</a>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
            <span className="text-[10px] font-black text-white uppercase tracking-widest">All Systems Operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
