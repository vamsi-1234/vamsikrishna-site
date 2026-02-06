// components/Navbar.tsx
"use client";

import { Github, Linkedin, Moon, Sun, Sparkles } from "lucide-react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export default function Navbar() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled 
          ? "backdrop-blur-xl bg-white/70 dark:bg-black/70 shadow-lg shadow-black/5 dark:shadow-white/5" 
          : "backdrop-blur-sm bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <motion.div 
          className="flex items-center gap-2"
          whileHover={{ scale: 1.02 }}
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            <Sparkles className="w-5 h-5 text-indigo-500" />
          </motion.div>
          <span className="font-bold text-lg bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
            Vamsi Krishna Vissapragada
          </span>
        </motion.div>

        <div className="flex items-center gap-1">
          {[
            { href: "https://github.com/vamsi-1234", icon: Github, label: "GitHub" },
            { href: "https://www.linkedin.com/in/vamsi-krishna-vissapragada-801602171", icon: Linkedin, label: "LinkedIn" }
          ].map((link, i) => (
            <motion.a
              key={link.label}
              href={link.href}
              target="_blank"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-xl hover:bg-indigo-500/10 transition-colors"
            >
              <link.icon size={20} className="text-black/70 dark:text-white/70" />
            </motion.a>
          ))}

          <motion.button
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.1, rotate: 15 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            className="p-2 rounded-xl hover:bg-indigo-500/10 transition-colors relative overflow-hidden"
          >
            <AnimatePresence mode="wait">
              {mounted && (
                <motion.div
                  key={resolvedTheme}
                  initial={{ y: -20, opacity: 0, rotate: -90 }}
                  animate={{ y: 0, opacity: 1, rotate: 0 }}
                  exit={{ y: 20, opacity: 0, rotate: 90 }}
                  transition={{ duration: 0.2 }}
                >
                  {resolvedTheme === "dark" ? (
                    <Sun size={20} className="text-yellow-400" />
                  ) : (
                    <Moon size={20} className="text-indigo-600" />
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>
    </motion.nav>
  );
}
