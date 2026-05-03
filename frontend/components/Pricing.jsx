"use client";

import { motion } from "framer-motion";
import { Zap, Crown, Check, Loader2 } from "lucide-react";

export default function Pricing({ onBuy = () => console.error("onBuy function not provided"), isLoading = false }) {
  const plans = [
    {
      id: "basic",
      name: "Basic Plan",
      price: "99",
      credits: "50 Credits",
      icon: <Zap size={24} />,
      color: "from-blue-500/20 to-transparent",
      features: ["50 HD Removals", "History Storage", "Basic Support"]
    },
    {
      id: "pro",
      name: "Pro Plan",
      price: "299",
      credits: "200 Credits",
      icon: <Crown size={24} />,
      color: "from-primary/20 to-transparent",
      features: ["200 HD Removals", "Priority Support", "Batch Processing (Soon)", "Commercial License"],
      popular: true
    }
  ];

  return (
    <div className="py-12">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-black mb-4">Choose Your <span className="text-gradient">Plan</span></h2>
        <p className="text-gray-400">Get more credits to continue your creative journey.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {plans.map((plan, index) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`glass-card p-8 rounded-[2.5rem] border ${plan.popular ? 'border-primary/50' : 'border-white/5'} relative overflow-hidden group`}
          >
            {plan.popular && (
              <div className="absolute top-0 right-0 px-4 py-1 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-bl-2xl">
                Most Popular
              </div>
            )}
            
            <div className={`w-14 h-14 bg-linear-to-br ${plan.color} rounded-2xl flex items-center justify-center mb-6 text-white group-hover:scale-110 transition-transform`}>
              {plan.icon}
            </div>

            <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-4xl font-black">₹{plan.price}</span>
              <span className="text-gray-500 text-sm font-bold">/ one-time</span>
            </div>

            <div className="p-4 bg-white/5 rounded-2xl mb-8 border border-white/5 text-center">
              <span className="text-primary font-black text-xl">{plan.credits}</span>
            </div>

            <ul className="space-y-4 mb-8">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-gray-400">
                  <div className="text-primary"><Check size={16} /></div>
                  {feature}
                </li>
              ))}
            </ul>

            <button
              onClick={() => onBuy(plan.id)}
              disabled={isLoading}
              className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-2xl flex items-center justify-center gap-2 ${plan.popular ? 'bg-primary text-white hover:scale-105' : 'bg-white text-black hover:bg-gray-200'} ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={16} />
                  Processing...
                </>
              ) : (
                'Buy Now'
              )}
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
