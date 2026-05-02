"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, Image as ImageIcon, Wand2, Download, AlertCircle, Loader2 } from "lucide-react";
import axios from "axios";

export default function UploadTool() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [processedUrl, setProcessedUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

  const handleFile = (file) => {
    setError(null);
    if (!file) return;

    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      setError("Please upload a JPG, PNG, or WEBP image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB.");
      return;
    }

    setSelectedImage(file);
    setPreviewUrl(URL.createObjectURL(file));
    setProcessedUrl(null);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const removeBackground = async () => {
    if (!selectedImage) return;

    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("image", selectedImage);

    try {
      const response = await axios.post(`${BACKEND_URL}/remove-bg`, formData, {
        responseType: 'blob', // Expecting binary data for the image
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const processedBlobUrl = URL.createObjectURL(response.data);
      setProcessedUrl(processedBlobUrl);
    } catch (err) {
      console.error(err);
      
      let errorMessage = "Failed to process image. Make sure the backend is running.";
      
      // Try to extract error message from backend response
      if (err.response && err.response.data instanceof Blob) {
        try {
          const text = await err.response.data.text();
          const json = JSON.parse(text);
          errorMessage = json.message || errorMessage;
        } catch (e) {
          console.error("Failed to parse error blob", e);
        }
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }

      setError(errorMessage);
      
      // Fallback behavior for UI: if server responded but failed, still show the preview so it's not a dead UI
      if (err.response) {
        setTimeout(() => {
          setProcessedUrl(previewUrl); 
        }, 1500);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const downloadImage = () => {
    if (!processedUrl) return;
    const a = document.createElement("a");
    a.href = processedUrl;
    a.download = "snapcut-processed.png";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <section id="upload-section" className="py-20 relative">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Try it yourself</h2>
          <p className="text-gray-400">Upload an image and see the magic happen instantly.</p>
        </div>

        <div className="glass-card rounded-3xl p-6 md:p-10 relative overflow-hidden">
          {/* Subtle gradient behind */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-br from-primary/10 to-secondary/10 opacity-50 blur-3xl -z-10"></div>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Input Side */}
            <div className="flex flex-col h-full space-y-6">
              {!previewUrl ? (
                <div
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center min-h-[400px] transition-all duration-300 ${
                    isDragging ? "border-primary bg-primary/10" : "border-gray-600 hover:border-gray-500 hover:bg-white/5"
                  }`}
                >
                  <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mb-6 shadow-xl">
                    <UploadCloud className="w-10 h-10 text-cyan-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-center">Drag & Drop your image here</h3>
                  <p className="text-gray-400 text-sm mb-6 text-center">Supports JPG, PNG, WEBP up to 5MB</p>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-full font-medium transition flex items-center gap-2"
                  >
                    <ImageIcon className="w-5 h-5" /> Browse Files
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={(e) => handleFile(e.target.files[0])}
                    className="hidden"
                    accept="image/jpeg, image/png, image/webp"
                  />
                </div>
              ) : (
                <div className="flex flex-col h-full min-h-[400px]">
                  <div className="relative rounded-2xl overflow-hidden bg-gray-900/50 flex-1 border border-white/10 shadow-2xl group">
                    <img src={previewUrl} alt="Original" className="w-full h-full object-contain absolute inset-0" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                       <button
                        onClick={() => {
                          setSelectedImage(null);
                          setPreviewUrl(null);
                          setProcessedUrl(null);
                          setError(null);
                        }}
                        className="px-4 py-2 bg-red-500/80 hover:bg-red-500 text-white rounded-full text-sm font-medium transition"
                      >
                        Remove Image
                      </button>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex justify-center">
                    <button
                      onClick={removeBackground}
                      disabled={isLoading || processedUrl}
                      className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${
                        isLoading || processedUrl
                          ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                          : "bg-gradient-to-r from-primary to-secondary text-white hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/30"
                      }`}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-6 h-6 animate-spin" /> Processing AI...
                        </>
                      ) : (
                        <>
                          <Wand2 className="w-6 h-6" /> Remove Background
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Output Side */}
            <div className="flex flex-col h-full space-y-6">
              <div className="relative rounded-2xl overflow-hidden bg-gray-900/50 border border-white/10 min-h-[400px] flex-1 shadow-2xl bg-[url('https://transparenttextures.com/patterns/cubes.png')]">
                {/* Checkerboard background for transparency effect */}
                <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(45deg, #222 25%, transparent 25%, transparent 75%, #222 75%, #222), linear-gradient(45deg, #222 25%, transparent 25%, transparent 75%, #222 75%, #222)', backgroundSize: '20px 20px', backgroundPosition: '0 0, 10px 10px', opacity: 0.5, zIndex: -1 }}></div>

                <AnimatePresence mode="wait">
                  {!processedUrl && !isLoading && (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 flex flex-col items-center justify-center text-gray-500"
                    >
                      <ImageIcon className="w-16 h-16 mb-4 opacity-20" />
                      <p>Result will appear here</p>
                    </motion.div>
                  )}

                  {isLoading && (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 flex flex-col items-center justify-center backdrop-blur-sm bg-black/50 z-10"
                    >
                      <div className="w-20 h-20 relative">
                        <div className="absolute inset-0 border-t-4 border-cyan-400 rounded-full animate-spin"></div>
                        <div className="absolute inset-2 border-r-4 border-primary rounded-full animate-spin animation-delay-2000"></div>
                      </div>
                      <p className="mt-6 font-medium text-cyan-400 animate-pulse">AI is working its magic...</p>
                    </motion.div>
                  )}

                  {processedUrl && (
                    <motion.img
                      key="result"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ type: "spring" }}
                      src={processedUrl}
                      alt="Processed Result"
                      className="w-full h-full object-contain absolute inset-0 z-10 drop-shadow-2xl"
                    />
                  )}
                </AnimatePresence>
              </div>

              {processedUrl && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-center"
                >
                  <button
                    onClick={downloadImage}
                    className="w-full py-4 bg-white text-black hover:bg-gray-200 rounded-xl font-bold text-lg transition flex items-center justify-center gap-2 hover:scale-[1.02] shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                  >
                    <Download className="w-6 h-6" /> Download HD PNG
                  </button>
                </motion.div>
              )}
            </div>
          </div>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-red-500/20 text-red-400 border border-red-500/50 px-6 py-3 rounded-full backdrop-blur-md"
              >
                <AlertCircle className="w-5 h-5" />
                <span className="text-sm font-medium">{error}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
