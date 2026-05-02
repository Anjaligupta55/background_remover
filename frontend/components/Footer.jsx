"use client";

import { motion } from "framer-motion";
import { ShieldCheck, CreditCard, Database, Activity, Globe, MessageSquare, Share2 } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="pt-20 pb-10 relative">
      {/* Tech/Trust Section */}
      <div className="container mx-auto px-4 mb-20">
        <div className="glass-card rounded-3xl p-8 flex flex-wrap justify-center gap-12 items-center opacity-60 grayscale hover:grayscale-0 transition-all">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5" />
            <span className="font-semibold text-sm tracking-tight uppercase">Secure Uploads</span>
          </div>
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            <span className="font-semibold text-sm tracking-tight uppercase">Razorpay Ready</span>
          </div>
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            <span className="font-semibold text-sm tracking-tight uppercase">MongoDB Powered</span>
          </div>
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            <span className="font-semibold text-sm tracking-tight uppercase">Sentry Monitored</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2">
            <div className="text-2xl font-black mb-6 flex items-center gap-2">
              <span className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center text-white text-xs">SC</span>
              SnapCut <span className="text-primary">AI</span>
            </div>
            <p className="text-gray-400 max-w-sm mb-6 leading-relaxed">
              Professional-grade background removal powered by artificial intelligence. 
              The future of image processing is here, and it&apos;s one click away.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-white/10 transition">
                <Globe className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-white/10 transition">
                <MessageSquare className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-white/10 transition">
                <Share2 className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-6">Product</h4>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li><a href="#" className="hover:text-white transition">Features</a></li>
              <li><a href="#" className="hover:text-white transition">Pricing</a></li>
              <li><a href="#" className="hover:text-white transition">API Docs</a></li>
              <li><a href="#" className="hover:text-white transition">Mobile App</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6">Company</h4>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition">Contact Us</a></li>
              <li><a href="#" className="hover:text-white transition">About</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:row justify-between items-center gap-4 text-gray-500 text-xs">
          <p>SnapCut AI © {currentYear}. All rights reserved.</p>
          <div className="flex gap-6">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500"></span> All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
