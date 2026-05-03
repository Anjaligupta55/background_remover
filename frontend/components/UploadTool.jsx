"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, Image as ImageIcon, Wand2, Download, AlertCircle, Loader2, Zap, Sparkles, RefreshCcw } from "lucide-react";
import axios from "axios";
import BeforeAfterSlider from "./BeforeAfterSlider";
import RecentImages from "./RecentImages";
import { TiltCard } from "./Background3D";
import Background3D from "./Background3D";

export default function UploadTool() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [processedUrl, setProcessedUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [credits, setCredits] = useState(0);
  const [user, setUser] = useState(null);
  const [recentImages, setRecentImages] = useState([]);
  
  const fileInputRef = useRef(null);
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

  // Load persistence data
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

  // Fake progress bar logic
  useEffect(() => {
    let interval;
    if (isLoading) {
      setProgress(0);
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 95) return prev;
          return prev + Math.random() * 10;
        });
      }, 300);
    } else {
      setProgress(0);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const validateFile = (file) => {
    if (!file) return false;
    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      setError("Only JPG, PNG and WEBP images are allowed.");
      return false;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB.");
      return false;
    }
    return true;
  };

  const handleFile = (file) => {
    setError(null);
    if (!validateFile(file)) return;

    setSelectedImage(file);
    setPreviewUrl(URL.createObjectURL(file));
    setProcessedUrl(null);
  };

  const removeBackground = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Please login to remove background");
      return;
    }

    if (!selectedImage || credits <= 0) {
      if (credits <= 0) setError("You have no credits left. Please upgrade.");
      return;
    }

    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("image", selectedImage);

    try {
      const response = await axios.post(`${BACKEND_URL}/api/remove-bg`, formData, {
        responseType: 'blob',
        headers: { 
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        },
      });

      const processedBlobUrl = URL.createObjectURL(response.data);
      setProcessedUrl(processedBlobUrl);
      
      // Update credits from header
      const creditsLeft = response.headers['x-credits-left'];
      if (creditsLeft !== undefined) {
        setCredits(parseInt(creditsLeft));
        if (user) {
          const updatedUser = { ...user, credits: parseInt(creditsLeft) };
          setUser(updatedUser);
          localStorage.setItem("user", JSON.stringify(updatedUser));
        }
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      
      // Update history
      const newRecent = [{ url: processedBlobUrl, timestamp: Date.now() }, ...recentImages].slice(0, 3);
      setRecentImages(newRecent);
      // Note: Blobs aren't persistent across refreshes in localStorage, 
      // in a real app we'd store the image in IndexedDB or a cloud URL.
      // For this demo, we'll just keep them in memory for current session.
    } catch (err) {
      console.error(err);
      let msg = "Failed to process image. Make sure the backend is running.";
      if (err.response && err.response.data instanceof Blob) {
        const text = await err.response.data.text();
        try { msg = JSON.parse(text).message || msg; } catch(e){}
      }
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const resetTool = () => {
    setSelectedImage(null);
    setPreviewUrl(null);
    setProcessedUrl(null);
    setError(null);
  };

  return (
    <section id="upload-section" className="py-20 relative">
        <AnimatePresence>
          {success && (
            <motion.div 
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.9 }}
              className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 bg-green-500 text-white rounded-full font-black uppercase text-[10px] tracking-widest shadow-2xl flex items-center gap-3"
            >
              <Sparkles size={14} />
              Image saved to history
            </motion.div>
          )}
        </AnimatePresence>

        <div className="container mx-auto px-4 relative">
        
        {/* Credits Status */}
        <div className="flex justify-center mb-10">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass flex items-center gap-4 px-6 py-2 rounded-full border border-primary/30"
          >
            <div className="flex items-center gap-2 text-primary font-bold">
              <Zap className="w-4 h-4 fill-primary" />
              <span>Credits left: {credits}/5</span>
            </div>
            <div className="w-px h-4 bg-white/10"></div>
            <button className="text-xs text-secondary hover:text-white transition font-medium">Get Unlimited</button>
          </motion.div>
        </div>

        <TiltCard className="relative z-10">
          <motion.div 
            className="glass-card rounded-[2rem] p-4 md:p-8 relative overflow-hidden"
          >
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-linear-to-br from-primary/5 via-secondary/5 to-accent/5 opacity-50 blur-3xl -z-10"></div>

            <div className="grid grid-cols-1 gap-8">
              {!processedUrl ? (
                <div className="flex flex-col space-y-8">
                  {/* Upload Box or Preview */}
                  {!previewUrl ? (
                    <div
                      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                      onDragLeave={() => setIsDragging(false)}
                      onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFile(e.dataTransfer.files[0]); }}
                      className={`border-2 border-dashed rounded-3xl p-12 flex flex-col items-center justify-center min-h-[400px] transition-all duration-500 ${
                        isDragging ? "border-primary bg-primary/10 scale-[1.02]" : "border-white/10 hover:border-primary/40 hover:bg-white/5"
                      }`}
                    >
                      <div className="w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-3xl flex items-center justify-center mb-8 shadow-2xl animate-float">
                        <UploadCloud className="w-12 h-12 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold mb-3 text-center">Ready to see magic?</h3>
                      <p className="text-gray-400 mb-8 text-center max-w-sm">Drag your image here or browse your files to remove background instantly.</p>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="px-10 py-4 bg-white text-black rounded-full font-bold transition hover:scale-110 active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                      >
                        Browse Device
                      </button>
                      <input type="file" ref={fileInputRef} onChange={(e) => handleFile(e.target.files[0])} className="hidden" accept="image/*" />
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="relative rounded-3xl overflow-hidden glass aspect-video md:aspect-auto md:h-[500px] flex items-center justify-center border border-white/20">
                        <img src={previewUrl} alt="Selected" className="max-w-full max-h-full object-contain" />
                        <button 
                          onClick={resetTool}
                          className="absolute top-6 right-6 p-3 bg-red-500/80 hover:bg-red-500 text-white rounded-full transition-all backdrop-blur-md"
                        >
                          <RefreshCcw className="w-5 h-5" />
                        </button>
                      </div>
                      
                      <button
                        onClick={removeBackground}
                        disabled={isLoading || credits <= 0}
                        className={`group relative w-full py-5 rounded-2xl font-black text-xl flex items-center justify-center gap-3 transition-all overflow-hidden ${
                          credits <= 0 ? "opacity-50 cursor-not-allowed bg-gray-800" : "bg-linear-to-r from-primary via-secondary to-accent text-white"
                        }`}
                      >
                        {isLoading ? (
                          <div className="flex items-center gap-4">
                            <Loader2 className="w-6 h-6 animate-spin" />
                            <div className="flex flex-col items-start">
                              <span>AI is working... {Math.round(progress)}%</span>
                              <div className="w-48 h-1 bg-white/20 rounded-full mt-1">
                                <motion.div 
                                  className="h-full bg-white rounded-full"
                                  initial={{ width: 0 }}
                                  animate={{ width: `${progress}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        ) : (
                          <>
                            <Wand2 className="w-6 h-6 group-hover:rotate-12 transition-transform" /> 
                            {credits <= 0 ? "No credits left" : "Start Magic"}
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-8"
                >
                  <BeforeAfterSlider before={previewUrl} after={processedUrl} />
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button
                      onClick={() => {
                        const a = document.createElement("a");
                        a.href = processedUrl;
                        a.download = "snapcut-ai.png";
                        a.click();
                      }}
                      className="flex-1 py-5 bg-white text-black rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:scale-105 transition shadow-2xl"
                    >
                      <Download className="w-6 h-6" /> Download HD PNG
                    </button>
                    <button
                      onClick={resetTool}
                      className="flex-1 py-5 glass rounded-2xl font-bold text-lg flex items-center justify-center gap-3 hover:bg-white/10 transition"
                    >
                      <RefreshCcw className="w-5 h-5" /> Start New
                    </button>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="absolute bottom-10 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-red-500 text-white px-8 py-4 rounded-2xl shadow-[0_20px_50px_rgba(239,68,68,0.4)]"
                >
                  <AlertCircle className="w-6 h-6" />
                  <span className="font-bold">{error}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </TiltCard>

        {/* History Section */}
        <RecentImages items={recentImages} onClear={() => { setRecentImages([]); localStorage.removeItem("snapcut_recent"); }} />
      </div>
    </section>
  );
}
