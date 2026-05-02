"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "0",
    features: [
      "5 images per day",
      "Standard quality",
      "Personal use",
      "Community support"
    ],
    cta: "Get Started",
    popular: false
  },
  {
    name: "Basic",
    price: "99",
    features: [
      "50 images per month",
      "HD quality output",
      "Commercial use",
      "Priority support",
      "No watermarks"
    ],
    cta: "Get Started",
    popular: true
  },
  {
    name: "Pro",
    price: "299",
    features: [
      "Unlimited images",
      "Ultra HD quality",
      "API access",
      "Batch processing",
      "Dedicated account manager",
      "SLA guarantee"
    ],
    cta: "Get Started",
    popular: false
  }
];

export default function Pricing() {
  return (
    <section id="pricing-section" className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Simple Pricing</h2>
          <p className="text-gray-400">Choose the perfect plan for your needs.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`relative rounded-3xl p-8 flex flex-col ${
                plan.popular 
                ? "bg-gradient-to-b from-primary/20 to-secondary/10 border-2 border-primary shadow-[0_0_40px_rgba(139,92,246,0.2)]" 
                : "glass-card"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Most Popular
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold">₹{plan.price}</span>
                  <span className="text-gray-400">/month</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8 flex-1">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-gray-300">
                    <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-primary" />
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>

              <button className={`w-full py-4 rounded-xl font-bold transition-all ${
                plan.popular
                ? "bg-primary hover:bg-primary-dark text-white shadow-lg shadow-primary/25"
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
