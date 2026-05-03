"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Background3D from "@/components/Background3D";
import { User, Zap, Crown, History, LogOut, Image as ImageIcon, Download } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const router = useRouter();

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/");
    router.refresh();
  };

  useEffect(() => {
    const fetchUserAndHistory = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        // Fetch User
        const userRes = await fetch(`${BACKEND_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const userData = await userRes.json();
        if (userData.success) {
          setUser(userData.user);
        } else {
          handleLogout();
          return;
        }

        // Fetch History
        const historyRes = await fetch(`${BACKEND_URL}/api/history`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const historyData = await historyRes.json();
        if (historyData.success) {
          setHistory(historyData.history);
        }
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      } finally {
        setLoading(false);
        setHistoryLoading(false);
      }
    };

    fetchUserAndHistory();
  }, [router, BACKEND_URL]);

  const handleDeleteItem = async (id) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${BACKEND_URL}/api/history/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setHistory(history.filter(item => item._id !== id));
      }
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const handleClearHistory = async () => {
    if (!confirm("Are you sure you want to clear all history?")) return;
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${BACKEND_URL}/api/history`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setHistory([]);
      }
    } catch (err) {
      console.error("Clear failed:", err);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
    </div>
  );

  if (!user) return null;

  return (
    <main className="relative min-h-screen p-4 md:p-8">
      <Background3D />
      
      <div className="max-w-6xl mx-auto pt-24 pb-20">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-black mb-2">User <span className="text-gradient">Dashboard</span></h1>
            <p className="text-gray-400">Manage your account, credits and history.</p>
          </div>
          <div className="flex gap-4">
            <Link href="/" className="px-6 py-3 glass rounded-xl border-white/5 hover:bg-white/5 transition-all text-xs font-black uppercase tracking-widest flex items-center">
              Back to Tool
            </Link>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 px-6 py-3 glass-card rounded-xl hover:bg-red-500/10 hover:text-red-500 transition-all border-white/5"
            >
              <LogOut size={18} />
              <span className="text-xs font-bold uppercase tracking-widest">Logout</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {/* User Profile Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-8 rounded-[2.5rem] border border-white/5 md:col-span-1"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-linear-to-br from-primary to-secondary rounded-3xl flex items-center justify-center text-white mb-6 shadow-2xl">
                <User size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-1">{user.name}</h3>
              <p className="text-gray-400 text-sm mb-6">{user.email}</p>
              
              <div className="w-full pt-6 border-t border-white/5">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-bold uppercase tracking-widest text-gray-500">Plan Status</span>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${user.plan === 'free' ? 'bg-white/10 text-white' : 'bg-primary/20 text-primary'}`}>
                    {user.plan}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Credits Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-8 rounded-[2.5rem] border border-white/5 bg-linear-to-br from-primary/10 to-transparent flex flex-col justify-between"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 bg-primary/20 rounded-2xl flex items-center justify-center text-primary">
                <Zap size={20} />
              </div>
              <h3 className="text-xl font-bold">Credits</h3>
            </div>
            <div className="text-5xl font-black mb-4">{user.credits}</div>
            <button className="w-full py-3 bg-primary text-white text-xs font-black uppercase tracking-widest rounded-xl hover:scale-105 transition-all shadow-2xl text-center">
              Get More
            </button>
          </motion.div>

          {/* Usage Stats */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-8 rounded-[2.5rem] border border-white/5 flex flex-col justify-between"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 bg-secondary/20 rounded-2xl flex items-center justify-center text-secondary">
                <History size={20} />
              </div>
              <h3 className="text-xl font-bold">Total Processed</h3>
            </div>
            <div className="text-5xl font-black mb-4">{history.length}</div>
            <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest">Lifetime Usage</p>
          </motion.div>
        </div>

        {/* History Section */}
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-black flex items-center gap-4">
              Your <span className="text-gradient">History</span>
              <span className="text-sm font-medium text-gray-500 bg-white/5 px-4 py-1 rounded-full">{history.length}</span>
            </h2>
            {history.length > 0 && (
              <button 
                onClick={handleClearHistory}
                className="text-xs font-bold uppercase tracking-widest text-red-500 hover:text-red-400 transition"
              >
                Clear All
              </button>
            )}
          </div>

          {historyLoading ? (
            <div className="py-20 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-500 uppercase text-[10px] font-black tracking-widest">Loading History...</p>
            </div>
          ) : history.length === 0 ? (
            <div className="py-20 glass-card rounded-[3rem] border border-dashed border-white/10 text-center">
              <History size={48} className="mx-auto text-gray-700 mb-6" />
              <h3 className="text-2xl font-bold mb-2">No history yet</h3>
              <p className="text-gray-500 mb-8 max-w-xs mx-auto">Start removing backgrounds to see your processed images here.</p>
              <Link href="/" className="px-8 py-4 bg-white text-black font-black uppercase tracking-widest rounded-2xl hover:scale-110 transition shadow-2xl inline-block">
                Start Magic
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {history.map((item, index) => (
                <HistoryCard 
                  key={item._id} 
                  item={item} 
                  index={index} 
                  onDelete={handleDeleteItem} 
                  backendUrl={BACKEND_URL}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

function HistoryCard({ item, index, onDelete, backendUrl }) {
  const [showOriginal, setShowOriginal] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="glass-card rounded-[2rem] overflow-hidden border border-white/5 group relative"
    >
      <div 
        className="aspect-square relative cursor-pointer overflow-hidden bg-grid-slate-900/[0.04]"
        onMouseEnter={() => setShowOriginal(true)}
        onMouseLeave={() => setShowOriginal(false)}
      >
        <img 
          src={`${backendUrl}${showOriginal ? item.originalImage : item.processedImage}`} 
          alt={item.fileName}
          className="w-full h-full object-contain p-4 transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute top-4 right-4 flex gap-2">
          <div className="px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-[8px] font-black uppercase tracking-widest text-white border border-white/10">
            {showOriginal ? 'Original' : 'Processed'}
          </div>
        </div>
      </div>

      <div className="p-6 space-y-4">
        <div className="flex justify-between items-start">
          <div className="max-w-[70%]">
            <h4 className="font-bold truncate text-sm">{item.fileName}</h4>
            <p className="text-[10px] text-gray-500 uppercase font-black tracking-tighter">
              {new Date(item.createdAt).toLocaleDateString()} • {(item.fileSize / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
          <button 
            onClick={() => onDelete(item._id)}
            className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100"
          >
            <LogOut size={14} className="rotate-180" />
          </button>
        </div>

        <div className="flex gap-3">
          <a 
            href={`${backendUrl}${item.processedImage}`}
            download={item.fileName}
            className="flex-1 py-3 bg-white text-black rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:scale-105 transition shadow-2xl"
          >
            <Download size={14} /> Download
          </a>
          <button 
            onClick={() => {
              const a = document.createElement("a");
              a.href = `${backendUrl}${item.originalImage}`;
              a.download = "original_" + item.fileName;
              a.click();
            }}
            className="p-3 glass rounded-xl border-white/5 hover:bg-white/5 transition"
          >
            <ImageIcon size={14} className="text-gray-400" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
