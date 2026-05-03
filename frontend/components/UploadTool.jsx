"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, Wand2, Download, AlertCircle, Loader2, Zap, Sparkles, RefreshCcw } from "lucide-react";
import axios from "axios";
import dynamic from 'next/dynamic';

const BeforeAfterSlider = dynamic(() => import('./BeforeAfterSlider'), { ssr: false });
const RecentImages = dynamic(() => import('./RecentImages'), { ssr: false });

export default function UploadTool() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [processedUrl, setProcessedUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [credits, setCredits] = useState(0);
  const [user, setUser] = useState(null);
  const [recentImages, setRecentImages] = useState([]);
  
  const fileInputRef = useRef(null);
  const BACKEND_URL = useMemo(() => process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000", []);

  // Cleanup effect for Blob URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      if (processedUrl) URL.revokeObjectURL(processedUrl);
    };
  }, [previewUrl, processedUrl]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setCredits(parsedUser.credits);
    }
    const savedRecent = localStorage.getItem("snapcut_recent");
    if (savedRecent) setRecentImages(JSON.parse(savedRecent));
  }, []);

  const handleFile = (file) => {
    if (!file) return;
    setError(null);
    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB.");
      return;
    }
    
    // Revoke old URL before creating new one
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    
    setSelectedImage(file);
    setPreviewUrl(URL.createObjectURL(file));
    setProcessedUrl(null);
  };

  const removeBackground = async () => {
    const token = localStorage.getItem("token");
    if (!token) return setError("Please login first.");
    if (!selectedImage || credits <= 0) return setError("Not enough credits.");

    setIsLoading(true);
    setError(null);
    setProgress(10);

    const formData = new FormData();
    formData.append("image", selectedImage);

    try {
      const response = await axios.post(`${BACKEND_URL}/api/remove-bg`, formData, {
        responseType: 'blob',
        headers: { 'Authorization': `Bearer ${token}` },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress(percentCompleted * 0.5); // Use half progress for upload
        }
      });

      setProgress(90);
      const processedBlobUrl = URL.createObjectURL(response.data);
      setProcessedUrl(processedBlobUrl);
      
      const creditsLeft = response.headers['x-credits-left'];
      if (creditsLeft) {
        setCredits(parseInt(creditsLeft));
        const updatedUser = { ...user, credits: parseInt(creditsLeft) };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      
      const newRecent = [{ url: processedBlobUrl, timestamp: Date.now() }, ...recentImages].slice(0, 3);
      setRecentImages(newRecent);
      setProgress(100);
    } catch (err) {
      setError("Processing failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetTool = useCallback(() => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (processedUrl) URL.revokeObjectURL(processedUrl);
    setSelectedImage(null);
    setPreviewUrl(null);
    setProcessedUrl(null);
    setError(null);
  }, [previewUrl, processedUrl]);

  return (
    <section id="upload-section" className="py-20 relative">
        <AnimatePresence>
          {success && (
            <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }} className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 bg-green-500 text-white rounded-full font-black uppercase text-[10px] tracking-widest flex items-center gap-3 shadow-2xl">
              <Sparkles size={14} /> Image saved to history
            </motion.div>
          )}
        </AnimatePresence>

        <div className="container mx-auto px-4">
        <div className="flex justify-center mb-10">
          <div className="glass flex items-center gap-4 px-6 py-2 rounded-full border border-primary/30">
            <div className="flex items-center gap-2 text-primary font-bold">
              <Zap className="w-4 h-4 fill-primary" />
              <span>Credits: {credits}</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 glass-card rounded-[2rem] p-4 md:p-8 overflow-hidden">
          {!processedUrl ? (
            <div className="flex flex-col space-y-8">
              {!previewUrl ? (
                <div
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFile(e.dataTransfer.files[0]); }}
                  className={`border-2 border-dashed rounded-3xl p-12 flex flex-col items-center justify-center min-h-[400px] transition-all ${isDragging ? "border-primary bg-primary/10" : "border-white/10 hover:border-primary/40"}`}
                >
                  <div className="w-20 h-20 bg-linear-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mb-6 shadow-2xl"><UploadCloud className="w-10 h-10 text-white" /></div>
                  <h3 className="text-2xl font-bold mb-3">Upload Image</h3>
                  <button onClick={() => fileInputRef.current?.click()} className="px-10 py-4 bg-white text-black rounded-full font-bold transition hover:scale-105 active:scale-95 shadow-2xl mt-4">Browse Device</button>
                  <input type="file" ref={fileInputRef} onChange={(e) => handleFile(e.target.files[0])} className="hidden" accept="image/*" />
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="relative rounded-3xl overflow-hidden glass h-[400px] flex items-center justify-center border border-white/20">
                    {isLoading ? (
                      <div className="flex flex-col items-center gap-4">
                        <Loader2 className="w-10 h-10 animate-spin text-primary" />
                        <p className="text-sm font-black uppercase tracking-widest animate-pulse text-gray-400">Removing Background... {Math.round(progress)}%</p>
                      </div>
                    ) : (
                      <img src={previewUrl} alt="Selected" className="max-w-full max-h-full object-contain p-4" />
                    )}
                    <button onClick={resetTool} className="absolute top-4 right-4 p-2 bg-red-500/20 hover:bg-red-500 text-white rounded-lg transition-all backdrop-blur-md"><RefreshCcw className="w-4 h-4" /></button>
                  </div>
                  <button onClick={removeBackground} disabled={isLoading || credits <= 0} className={`w-full py-5 rounded-2xl font-black text-xl flex items-center justify-center gap-3 transition-all ${credits <= 0 ? "opacity-50 cursor-not-allowed bg-gray-800" : "bg-linear-to-r from-primary to-secondary text-white hover:scale-[1.02]"}`}>
                    {isLoading ? "AI is working..." : credits <= 0 ? "No Credits" : "Start Magic"}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-8">
              <BeforeAfterSlider before={previewUrl} after={processedUrl} />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button onClick={() => { const a = document.createElement("a"); a.href = processedUrl; a.download = "snapcut.png"; a.click(); }} className="flex-1 py-4 bg-white text-black rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:scale-105 transition shadow-2xl"><Download size={20} /> Download</button>
                <button onClick={resetTool} className="flex-1 py-4 glass rounded-2xl font-bold text-lg flex items-center justify-center gap-3 hover:bg-white/10 transition">Start New</button>
              </div>
            </div>
          )}
        </div>

        {error && <div className="mt-6 flex justify-center"><div className="flex items-center gap-3 bg-red-500/10 border border-red-500/30 text-red-500 px-6 py-3 rounded-xl shadow-2xl"><AlertCircle size={18} /><span className="font-bold text-sm">{error}</span></div></div>}

        <RecentImages items={recentImages} onClear={() => { setRecentImages([]); localStorage.removeItem("snapcut_recent"); }} />
      </div>
    </section>
  );
}
