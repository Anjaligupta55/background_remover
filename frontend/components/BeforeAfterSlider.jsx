"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function BeforeAfterSlider({ before, after }) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

  const handleMove = (e) => {
    if (!isDragging && e.type !== "mousemove") return;
    
    const containerRect = containerRef.current.getBoundingClientRect();
    const x = e.type === "touchmove" ? e.touches[0].clientX : e.clientX;
    const position = ((x - containerRect.left) / containerRect.width) * 100;
    
    setSliderPosition(Math.max(0, Math.min(100, position)));
  };

  useEffect(() => {
    const handleUp = () => setIsDragging(false);
    window.addEventListener("mouseup", handleUp);
    window.addEventListener("touchend", handleUp);
    return () => {
      window.removeEventListener("mouseup", handleUp);
      window.removeEventListener("touchend", handleUp);
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-[400px] md:h-[500px] rounded-2xl overflow-hidden cursor-ew-resize select-none border border-white/10 shadow-2xl"
      onMouseMove={handleMove}
      onTouchMove={handleMove}
      onMouseDown={() => setIsDragging(true)}
      onTouchStart={() => setIsDragging(true)}
    >
      {/* Before Image (Background) */}
      <img 
        src={before} 
        alt="Before" 
        className="absolute inset-0 w-full h-full object-contain bg-gray-900"
      />

      {/* After Image (Overlay) */}
      <div 
        className="absolute inset-0 w-full h-full overflow-hidden"
        style={{ width: `${sliderPosition}%` }}
      >
        {/* Checkerboard background for transparency visibility */}
        <div className="absolute inset-0 w-[1000%] h-full bg-gray-800" style={{ backgroundImage: 'linear-gradient(45deg, #222 25%, transparent 25%, transparent 75%, #222 75%, #222), linear-gradient(45deg, #222 25%, transparent 25%, transparent 75%, #222 75%, #222)', backgroundSize: '20px 20px', backgroundPosition: '0 0, 10px 10px', opacity: 0.5 }}></div>
        <img 
          src={after} 
          alt="After" 
          className="absolute inset-0 w-full h-full object-contain"
          style={{ width: containerRef.current?.offsetWidth || '100vw' }}
        />
      </div>

      {/* Slider Line */}
      <div 
        className="absolute inset-y-0 w-1 bg-white shadow-[0_0_10px_rgba(0,0,0,0.5)] z-10"
        style={{ left: `${sliderPosition}%` }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-2xl border-4 border-primary/20">
          <div className="flex gap-0.5 text-primary">
            <ChevronLeft className="w-4 h-4" />
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Labels */}
      <div className="absolute top-4 left-4 z-20 px-3 py-1 rounded-full bg-black/50 backdrop-blur-md text-xs font-bold uppercase tracking-wider text-white border border-white/10">
        Original
      </div>
      <div className="absolute top-4 right-4 z-20 px-3 py-1 rounded-full bg-primary/50 backdrop-blur-md text-xs font-bold uppercase tracking-wider text-white border border-white/10">
        Processed
      </div>
    </div>
  );
}
