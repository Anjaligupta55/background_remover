"use client";

import { motion } from "framer-motion";
import { Check, Star, Zap, Crown } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: "0",
    icon: Star,
    color: "text-gray-400",
    features: [
      "5 images per day",
      "Standard resolution",
      "Community support",
      "Web-only access"
    ],
    cta: "Start Free",
    popular: false
  },
  {
    name: "Professional",
    price: "99",
    icon: Zap,
    color: "text-primary",
    features: [
      "100 images per month",
      "Ultra HD resolution",
      "Priority API access",
      "Commercial license",
      "Batch background removal"
    ],
    cta: "Go Pro",
    popular: true
  },
  {
    name: "Enterprise",
    price: "299",
    icon: Crown,
    color: "text-accent",
    features: [
      "Unlimited images",
      "Dedicated GPU instances",
      "Custom API integration",
      "24/7 Phone support",
      "Legal & SLA guarantees"
    ],
    cta: "Join Enterprise",
    popular: false
  }
];

export default function Pricing() {
  return (
    <section id="pricing-section" className="py-32 relative">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px] -z-10"></div>

      <div className="container mx-auto px-4">
        <div className="text-center mb-24">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-black mb-6"
          >
            Ready to <span className="text-gradient">Scale?</span>
          </motion.h2>
          <p className="text-gray-400 max-w-xl mx-auto text-lg">
            Choose the plan that fits your creative workflow. No hidden fees, cancel anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto items-end">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`relative rounded-[3rem] p-10 flex flex-col transition-all duration-500 hover:scale-[1.05] ${
                plan.popular 
                ? "bg-linear-to-b from-primary/10 to-secondary/5 border-2 border-primary/50 shadow-[0_0_80px_rgba(139,92,246,0.15)] h-[650px] z-10" 
                : "glass-card h-[580px] border-white/5"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-black px-6 py-2 rounded-full uppercase tracking-[0.2em] shadow-xl">
                  Best Value
                </div>
              )}

              <div className="mb-10 text-center">
                <plan.icon className={`w-12 h-12 mx-auto mb-6 ${plan.color}`} />
                <h3 className="text-3xl font-black mb-2 tracking-tight">{plan.name}</h3>
                <div className="flex items-baseline justify-center gap-1 mt-4">
                  <span className="text-gray-400 text-2xl">₹</span>
                  <span className="text-6xl font-black tracking-tighter">{plan.price}</span>
                  <span className="text-gray-500 font-bold ml-1">/mo</span>
                </div>
              </div>

              <ul className="space-y-5 mb-10 flex-1">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-4 text-gray-300 font-medium">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${plan.popular ? 'bg-primary/20' : 'bg-white/5'}`}>
                      <Check className={`w-3.5 h-3.5 ${plan.popular ? 'text-primary' : 'text-gray-500'}`} />
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>

              <button className={`w-full py-5 rounded-2xl font-black text-lg transition-all duration-300 ${
                plan.popular
                ? "bg-white text-black hover:bg-primary hover:text-white shadow-[0_20px_40px_rgba(255,255,255,0.1)]"
                : "bg-white/5 hover:bg-white/10 text-white border border-white/10"
              }`}>
                {plan.cta}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
