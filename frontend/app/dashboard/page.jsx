"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Background3D from "@/components/Background3D";
import Pricing from "@/components/Pricing";
import { User, Zap, History, LogOut, Image as ImageIcon, Download, ShoppingBag, Trash2, ChevronDown } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [showPricing, setShowPricing] = useState(false);
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);
  const router = useRouter();

  const BACKEND_URL = useMemo(() => process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000", []);

  const loadScript = useCallback((src) => {
    return new Promise((resolve) => {
      if (document.querySelector(`script[src="${src}"]`)) return resolve(true);
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }, []);

  const fetchHistory = useCallback(async (pageNum = 1, append = false) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    setHistoryLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/history?limit=6&page=${pageNum}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setHistory(prev => append ? [...prev, ...data.history] : data.history);
        setHasMore(data.hasMore);
      }
    } catch (err) {
      console.error("Failed to fetch history:", err);
    } finally {
      setHistoryLoading(false);
    }
  }, [BACKEND_URL]);

  const handlePayment = async (plan) => {
    setIsPaymentLoading(true);
    const resScript = await loadScript("https://checkout.razorpay.com/v1/checkout.js");

    if (!resScript) {
      alert("Razorpay SDK failed to load.");
      setIsPaymentLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const orderRes = await fetch(`${BACKEND_URL}/api/payment/create-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ plan }),
      });

      const orderData = await orderRes.json();
      if (!orderData.success) throw new Error(orderData.message);

      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "SnapCut AI",
        description: `${plan.toUpperCase()} Plan Purchase`,
        order_id: orderData.orderId,
        handler: async function (response) {
          const verifyRes = await fetch(`${BACKEND_URL}/api/payment/verify`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ ...response, plan }),
          });

          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            alert("Payment Successful!");
            localStorage.setItem("user", JSON.stringify(verifyData.user));
            setUser(verifyData.user);
            setShowPricing(false);
          }
        },
        prefill: { name: user?.name, email: user?.email },
        theme: { color: "#7c3aed" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      alert(err.message || "Payment failed");
    } finally {
      setIsPaymentLoading(false);
    }
  };

  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/");
  }, [router]);

  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem("token");
      if (!token) return router.push("/login");

      try {
        const userRes = await fetch(`${BACKEND_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const userData = await userRes.json();
        if (userData.success) {
          setUser(userData.user);
          fetchHistory(1);
        } else {
          handleLogout();
        }
      } catch (err) {
        console.error("Init failed:", err);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [BACKEND_URL, handleLogout, router, fetchHistory]);

  const handleDeleteItem = async (id) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${BACKEND_URL}/api/history/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) setHistory(prev => prev.filter(item => item._id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const handleClearHistory = async () => {
    if (!confirm("Are you sure?")) return;
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${BACKEND_URL}/api/history`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) setHistory([]);
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
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-black mb-2">User <span className="text-gradient">Dashboard</span></h1>
            <p className="text-gray-400">Manage your account and history.</p>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={() => setShowPricing(!showPricing)}
              className={`px-6 py-3 rounded-xl border border-white/5 transition-all text-xs font-black uppercase tracking-widest flex items-center gap-2 ${showPricing ? 'bg-primary text-white' : 'glass hover:bg-white/5'}`}
            >
              <ShoppingBag size={18} />
              {showPricing ? 'View History' : 'Buy Credits'}
            </button>
            <Link href="/" className="px-6 py-3 glass rounded-xl border-white/5 hover:bg-white/5 transition-all text-xs font-black uppercase tracking-widest flex items-center">
              Back to Tool
            </Link>
            <button 
              onClick={handleLogout}
              className="p-3 glass-card rounded-xl hover:bg-red-500/10 hover:text-red-500 transition-all border-white/5"
            >
              <LogOut size={18} />
            </button>
          </div>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-8 rounded-[2.5rem] border border-white/5 md:col-span-1">
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-linear-to-br from-primary to-secondary rounded-3xl flex items-center justify-center text-white mb-6 shadow-2xl">
                <User size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-1">{user.name}</h3>
              <p className="text-gray-400 text-sm">{user.email}</p>
              <div className="w-full pt-6 mt-6 border-t border-white/5 flex justify-between items-center">
                <span className="text-xs font-bold uppercase tracking-widest text-gray-500">Plan</span>
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${user.plan === 'free' ? 'bg-white/10 text-white' : 'bg-primary/20 text-primary'}`}>
                  {user.plan}
                </span>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-8 rounded-[2.5rem] border border-white/5 bg-linear-to-br from-primary/10 to-transparent flex flex-col justify-between">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 bg-primary/20 rounded-2xl flex items-center justify-center text-primary"><Zap size={20} /></div>
              <h3 className="text-xl font-bold">Credits</h3>
            </div>
            <div className="text-5xl font-black mb-4">{user.credits}</div>
            <button onClick={() => setShowPricing(true)} className="w-full py-3 bg-primary text-white text-xs font-black uppercase tracking-widest rounded-xl hover:scale-105 transition-all shadow-2xl">Upgrade</button>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-8 rounded-[2.5rem] border border-white/5 flex flex-col justify-between">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 bg-secondary/20 rounded-2xl flex items-center justify-center text-secondary"><History size={20} /></div>
              <h3 className="text-xl font-bold">Processed</h3>
            </div>
            <div className="text-5xl font-black mb-4">{history.length}</div>
            <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest">In this session</p>
          </motion.div>
        </section>

        {showPricing ? (
          <Pricing onBuy={handlePayment} isLoading={isPaymentLoading} />
        ) : (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-black">History</h2>
              {history.length > 0 && <button onClick={handleClearHistory} className="text-xs font-bold uppercase tracking-widest text-red-500 hover:text-red-400">Clear All</button>}
            </div>

            {history.length === 0 && !historyLoading ? (
              <div className="py-20 glass-card rounded-[3rem] border border-dashed border-white/10 text-center">
                <h3 className="text-2xl font-bold mb-2">No history</h3>
                <Link href="/" className="px-8 py-4 bg-white text-black font-black uppercase tracking-widest rounded-2xl hover:scale-110 transition shadow-2xl inline-block mt-4">Start Now</Link>
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
            
            {hasMore && (
              <div className="flex justify-center pt-8">
                <button 
                  onClick={() => { setPage(p => p + 1); fetchHistory(page + 1, true); }}
                  disabled={historyLoading}
                  className="px-8 py-3 glass rounded-xl border border-white/5 hover:bg-white/5 transition flex items-center gap-2 text-xs font-black uppercase tracking-widest"
                >
                  {historyLoading ? <Loader2 className="animate-spin" size={16} /> : <ChevronDown size={16} />}
                  Load More
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

function HistoryCard({ item, index, onDelete, backendUrl }) {
  const [showOriginal, setShowOriginal] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: (index % 6) * 0.05 }}
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
          loading="lazy"
          className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest text-white border border-white/10">
          {showOriginal ? 'Original' : 'Processed'}
        </div>
      </div>

      <div className="p-6 space-y-4">
        <div className="flex justify-between items-start">
          <div className="max-w-[70%]">
            <h4 className="font-bold truncate text-sm">{item.fileName}</h4>
            <p className="text-[10px] text-gray-500 uppercase font-black tracking-tighter">
              {(item.fileSize / 1024 / 1024).toFixed(1)} MB
            </p>
          </div>
          <button 
            onClick={() => onDelete(item._id)}
            className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100"
          >
            <Trash2 size={14} />
          </button>
        </div>

        <div className="flex gap-3">
          <a 
            href={`${backendUrl}${item.processedImage}`}
            download={item.fileName}
            className="flex-1 py-3 bg-white text-black rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-gray-200 transition"
          >
            <Download size={14} /> Download
          </a>
        </div>
      </div>
    </motion.div>
  );
}

const Loader2 = ({ className, size }) => (
  <svg className={`${className} animate-spin`} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);
