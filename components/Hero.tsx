// components/Hero.tsx
"use client";

import { motion } from "framer-motion";
import { ArrowDown, Zap, Brain, Server, Package } from "lucide-react";

const highlights = [
  { icon: Server, text: "Scalable backend & distributed systems", color: "from-blue-500 to-cyan-500" },
  { icon: Brain, text: "AI-assisted debugging & automation", color: "from-purple-500 to-pink-500" },
  { icon: Zap, text: "FastAPI, React, Docker, CI/CD", color: "from-orange-500 to-yellow-500" },
  { icon: Package, text: "Production-grade ownership mindset", color: "from-green-500 to-emerald-500" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.3 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function Hero() {
  return (
    <section className="relative min-h-[80vh] flex flex-col justify-center">
      {/* Animated background gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 dark:from-indigo-500/10 dark:to-purple-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -50, 0],
            y: [0, 100, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 dark:from-cyan-500/10 dark:to-blue-500/10 rounded-full blur-3xl"
        />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative grid lg:grid-cols-2 gap-12 items-center"
      >
        {/* LEFT */}
        <div>
          <motion.div variants={itemVariants} className="mb-4">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-sm font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              Available for opportunities
            </span>
          </motion.div>

          <motion.h1 
            variants={itemVariants}
            className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6"
          >
            <span className="text-black dark:text-white">Senior Software</span>
            <br />
            <span className="text-gradient">Engineer</span>
            <span className="text-black/50 dark:text-white/50 text-4xl md:text-5xl ml-2">(SDE-3)</span>
          </motion.h1>

          <motion.p 
            variants={itemVariants}
            className="text-lg md:text-xl text-black/60 dark:text-white/60 mb-8 max-w-xl leading-relaxed"
          >
            I design and build <span className="text-black dark:text-white font-medium">scalable backend systems</span>, 
            full-stack platforms, and <span className="text-black dark:text-white font-medium">AI-assisted tools</span> with 
            real production ownership.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-wrap gap-4">
            <motion.a
              href="https://github.com/vamsi-1234"
              target="_blank"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="group px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all duration-300"
            >
              <span className="flex items-center gap-2">
                View GitHub
                <motion.span
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  →
                </motion.span>
              </span>
            </motion.a>

            <motion.a
              href="https://www.linkedin.com/in/vamsi-krishna-vissapragada-801602171"
              target="_blank"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 border-2 border-black/20 dark:border-white/20 text-black dark:text-white rounded-xl font-medium hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-300"
            >
              Connect on LinkedIn
            </motion.a>
          </motion.div>
        </div>

        {/* RIGHT - Feature Cards */}
        <motion.div variants={itemVariants} className="relative">
          <div className="grid grid-cols-2 gap-4 auto-rows-fr">
            {highlights.map((item, i) => (
              <motion.div
                key={item.text}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ 
                  delay: 0.5 + i * 0.1,
                  type: "spring",
                  stiffness: 100
                }}
                whileHover={{ 
                  scale: 1.03, 
                  y: -4,
                  transition: { duration: 0.3, ease: "easeOut" }
                }}
                className="card-glow p-5 rounded-2xl border border-black/10 dark:border-white/10 bg-white/80 dark:bg-white/5 backdrop-blur-sm h-full"
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-3`}>
                  <item.icon className="w-5 h-5 text-white" />
                </div>
                <p className="text-sm text-black/70 dark:text-white/70 leading-relaxed">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.a
        href="#experience"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 cursor-pointer"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          whileHover={{ scale: 1.1 }}
          className="flex flex-col items-center gap-2 text-black/40 dark:text-white/40 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors"
        >
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <ArrowDown className="w-4 h-4" />
        </motion.div>
      </motion.a>
    </section>
  );
}
