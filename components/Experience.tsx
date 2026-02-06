// components/Experience.tsx
"use client";

import { motion } from "framer-motion";
import { Briefcase, Calendar, ChevronRight } from "lucide-react";

const experiences = [
  {
    company: "American Airlines",
    role: "Senior Software Engineer (SDE-3)",
    period: "2023 - Present",
    gradient: "from-sky-500 to-blue-600",
    points: [
      "Designing scalable backend and full-stack systems",
      "Building microservices and production-grade APIs",
      "Strong ownership of reliability and performance",
    ],
  },
  {
    company: "MaxLinear Technologies",
    role: "Software Development Engineer",
    period: "2021 - 2023",
    gradient: "from-violet-500 to-purple-600",
    points: [
      "Improved UI engagement by ~30% using React + TypeScript",
      "Built scalable FastAPI backend services",
      "Introduced AI-assisted log analysis, reducing debugging ~25%",
      "Reduced deployment time ~35% using Docker CI/CD",
    ],
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0 }
};

export default function Experience() {
  return (
    <section id="experience" className="mt-32 relative scroll-mt-24">
      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-16"
      >
        <motion.span 
          className="text-indigo-600 dark:text-indigo-400 font-medium mb-2 block"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          Career Journey
        </motion.span>
        <h2 className="text-4xl md:text-5xl font-bold text-black dark:text-white">
          Work Experience
        </h2>
      </motion.div>

      {/* Timeline */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="relative"
      >
        {/* Timeline line */}
        <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-indigo-500 via-purple-500 to-transparent hidden md:block" />

        <div className="space-y-8">
          {experiences.map((exp, i) => (
            <motion.div
              key={exp.company}
              variants={itemVariants}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              {/* Timeline dot */}
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, type: "spring" }}
                className="absolute left-6 top-8 w-5 h-5 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 border-4 border-white dark:border-black hidden md:block z-10"
              />

              <motion.div
                whileHover={{ scale: 1.02, x: 10 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="md:ml-20 card-glow rounded-2xl border border-black/10 dark:border-white/10 bg-white/80 dark:bg-white/5 backdrop-blur-sm overflow-hidden"
              >
                {/* Gradient top bar */}
                <div className={`h-1 bg-gradient-to-r ${exp.gradient}`} />
                
                <div className="p-6 md:p-8">
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <div className={`p-2 rounded-lg bg-gradient-to-br ${exp.gradient}`}>
                          <Briefcase className="w-4 h-4 text-white" />
                        </div>
                        <h3 className="text-xl md:text-2xl font-bold text-black dark:text-white">
                          {exp.company}
                        </h3>
                      </div>
                      <p className="text-black/60 dark:text-white/60 font-medium">{exp.role}</p>
                    </div>
                    <span className="flex items-center gap-1 text-sm text-black/50 dark:text-white/50 bg-black/5 dark:bg-white/10 px-3 py-1 rounded-full">
                      <Calendar className="w-3 h-3" />
                      {exp.period}
                    </span>
                  </div>

                  <ul className="space-y-3">
                    {exp.points.map((point, j) => (
                      <motion.li
                        key={point}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 * j }}
                        className="flex items-start gap-3 text-black/70 dark:text-white/70"
                      >
                        <ChevronRight className="w-4 h-4 mt-1 text-indigo-500 flex-shrink-0" />
                        <span>{point}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
