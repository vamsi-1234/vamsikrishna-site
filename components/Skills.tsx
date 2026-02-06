// components/Skills.tsx
"use client";

import { motion } from "framer-motion";
import { Code2, Layout, Cloud, Cpu } from "lucide-react";

const skills = [
  {
    category: "Backend",
    icon: Code2,
    gradient: "from-emerald-500 to-green-600",
    items: ["Python", "FastAPI", "Django", "REST APIs"],
  },
  {
    category: "Frontend",
    icon: Layout,
    gradient: "from-blue-500 to-cyan-600",
    items: ["React", "Next.js", "TypeScript"],
  },
  {
    category: "DevOps",
    icon: Cloud,
    gradient: "from-orange-500 to-amber-600",
    items: ["Docker", "CI/CD", "AWS/Azure"],
  },
  {
    category: "AI / ML",
    icon: Cpu,
    gradient: "from-violet-500 to-purple-600",
    items: ["Applied ML", "Intelligent automation"],
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.9 },
  visible: { opacity: 1, y: 0, scale: 1 }
};

export default function Skills() {
  return (
    <section className="mt-32 relative">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-full blur-3xl" />
      </div>

      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-16 relative"
      >
        <motion.span 
          className="text-indigo-600 dark:text-indigo-400 font-medium mb-2 block"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          Tech Stack
        </motion.span>
        <h2 className="text-4xl md:text-5xl font-bold text-black dark:text-white">
          Skills & Expertise
        </h2>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 relative"
      >
        {skills.map((skill, i) => (
          <motion.div
            key={skill.category}
            variants={itemVariants}
            whileHover={{ 
              y: -10,
              transition: { type: "spring", stiffness: 300 }
            }}
            className="group relative"
          >
            <div className="card-glow h-full rounded-2xl border border-black/10 dark:border-white/10 bg-white/80 dark:bg-white/5 backdrop-blur-sm overflow-hidden">
              {/* Gradient hover effect */}
              <div className={`absolute inset-0 bg-gradient-to-br ${skill.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
              
              <div className="relative p-6">
                {/* Icon */}
                <motion.div
                  whileHover={{ rotate: 10, scale: 1.1 }}
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${skill.gradient} flex items-center justify-center mb-4 shadow-lg`}
                >
                  <skill.icon className="w-6 h-6 text-white" />
                </motion.div>

                <h3 className="font-bold text-lg text-black dark:text-white mb-4">
                  {skill.category}
                </h3>

                <ul className="space-y-2">
                  {skill.items.map((item, j) => (
                    <motion.li
                      key={item}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.1 * j }}
                      className="flex items-center gap-2 text-black/70 dark:text-white/70"
                    >
                      <span className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${skill.gradient}`} />
                      <span className="text-sm">{item}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* Bottom gradient line on hover */}
              <div className={`h-1 w-0 group-hover:w-full bg-gradient-to-r ${skill.gradient} transition-all duration-500`} />
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Decorative floating elements */}
      <motion.div
        animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 5, repeat: Infinity }}
        className="absolute -right-20 top-20 w-40 h-40 bg-gradient-to-br from-indigo-500/10 to-transparent rounded-full blur-2xl pointer-events-none"
      />
    </section>
  );
}
