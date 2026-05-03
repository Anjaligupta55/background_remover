"use client";

import { motion } from "framer-motion";
import { Zap, Brain, FileJson, Gauge, Shield, Layout, Target, MousePointer2 } from "lucide-react";

const features = [
  {
    title: "Surgical Edge Detection",
    description: "Our AI distinguishes individual strands of hair from complex backgrounds with 99.9% accuracy.",
    icon: Target,
    color: "text-yellow-400",
    bg: "bg-yellow-400/10",
  },
  {
    title: "Neural Engine 3.0",
    description: "Powered by the latest deep learning models optimized for high-resolution photography.",
    icon: Brain,
    color: "text-purple-400",
    bg: "bg-purple-400/10",
  },
  {
    title: "Batch Processing",
    description: "Remove backgrounds from hundreds of images simultaneously using our high-speed queue.",
    icon: Zap,
    color: "text-blue-400",
    bg: "bg-blue-400/10",
  },
  {
    title: "Real-time Previews",
    description: "Adjust settings and see the results instantly before committing to a download.",
    icon: MousePointer2,
    color: "text-cyan-400",
    bg: "bg-cyan-400/10",
  },
  {
    title: "Enterprise Security",
    description: "Bank-grade encryption and automatic deletion protocols ensure your data remains yours.",
    icon: Shield,
    color: "text-green-400",
    bg: "bg-green-400/10",
  },
  {
    title: "Lossless Exports",
    description: "Export in ultra-high resolution PNG or WebP formats without any quality degradation.",
    icon: FileJson,
    color: "text-pink-400",
    bg: "bg-pink-400/10",
  },
];

export default function Features() {
  return (
    <section id="features-section" className="py-32 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-24">
          <motion.span 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-primary font-bold text-sm uppercase tracking-[0.3em] mb-4 block"
          >
            Core Technology
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-black mb-6"
          >
            Engineered for <span className="text-gradient">Perfection</span>
          </motion.h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Stop wasting hours on manual masking. Let our neural networks handle the complex work for you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="glass-card p-10 rounded-[2.5rem] border border-white/5 hover:border-primary/30 transition-all duration-500 group"
            >
              <div className={`w-16 h-16 rounded-2xl ${feature.bg} flex items-center justify-center mb-8 group-hover:rotate-6 transition-transform shadow-2xl`}>
                <feature.icon className={`w-8 h-8 ${feature.color}`} />
              </div>
              <h3 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed text-lg">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
