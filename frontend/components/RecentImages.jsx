"use client";

import { motion } from "framer-motion";
import { History, Download, Trash2 } from "lucide-react";

export default function RecentImages({ items, onClear }) {
  if (!items || items.length === 0) return null;

  return (
    <section className="py-12">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-primary" />
          <h3 className="text-xl font-bold">Recent Results</h3>
        </div>
        <button 
          onClick={onClear}
          className="text-xs text-gray-500 hover:text-red-400 transition-colors flex items-center gap-1"
        >
          <Trash2 className="w-3 h-3" /> Clear History
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {items.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="group relative glass-card rounded-2xl overflow-hidden aspect-square flex items-center justify-center bg-[url('https://transparenttextures.com/patterns/cubes.png')]"
          >
             <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(45deg, #222 25%, transparent 25%, transparent 75%, #222 75%, #222), linear-gradient(45deg, #222 25%, transparent 25%, transparent 75%, #222 75%, #222)', backgroundSize: '15px 15px', backgroundPosition: '0 0, 7.5px 7.5px', opacity: 0.3, zIndex: 0 }}></div>
            
            <img 
              src={item.url} 
              alt={`Recent ${index}`} 
              className="w-full h-full object-contain relative z-10 p-4 transition-transform group-hover:scale-110" 
            />
            
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity z-20 flex items-center justify-center gap-4 backdrop-blur-sm">
              <a 
                href={item.url} 
                download={`snapcut-${Date.now()}.png`}
                className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:scale-110 transition"
              >
                <Download className="w-5 h-5" />
              </a>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
