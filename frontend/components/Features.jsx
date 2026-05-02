"use client";

import { motion } from "framer-motion";
import { Zap, Brain, FileJson, Gauge, Shield, Layout } from "lucide-react";

const features = [
  {
    title: "One-click removal",
    description: "Remove backgrounds instantly with a single click, saving you hours of manual work.",
    icon: Zap,
    color: "text-yellow-400",
  },
  {
    title: "AI-powered",
    description: "Our advanced neural networks detect subjects with surgical precision.",
    icon: Brain,
    color: "text-purple-400",
  },
  {
    title: "Transparent PNG",
    description: "High-quality transparent PNG output ready for any design project.",
    icon: FileJson,
    color: "text-blue-400",
  },
  {
    title: "Fast Preview",
    description: "Instant previews of your processed images before you download.",
    icon: Gauge,
    color: "text-cyan-400",
  },
  {
    title: "Secure Handling",
    description: "Your images are processed securely and deleted from our servers automatically.",
    icon: Shield,
    color: "text-green-400",
  },
  {
    title: "All Formats",
    description: "Full support for JPG, PNG, and WebP image formats.",
    icon: Layout,
    color: "text-pink-400",
  },
];

export default function Features() {
  return (
    <section id="features-section" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Powerful Features</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Experience the next generation of background removal powered by state-of-the-art AI.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass-card p-8 rounded-3xl hover:border-primary/50 transition-colors group"
            >
              <div className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <feature.icon className={`w-6 h-6 ${feature.color}`} />
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
