"use client";

import { motion } from "framer-motion";
import { Code2, Database, Smartphone, Zap, Cpu, Wrench } from "lucide-react";

const aboutItems = [
  {
    icon: Code2,
    title: "Frontend Development",
    desc: "Building responsive, interactive user interfaces with React, Next.js, and modern CSS frameworks. Specializing in creating pixel-perfect designs that translate Figma mockups into production-ready applications.",
    color: "from-blue-400 to-cyan-500",
  },
  {
    icon: Database,
    title: "Backend Development",
    desc: "Creating robust APIs and server-side applications using Node.js, Express, and FastAPI. Designing scalable database schemas with MongoDB, PostgreSQL, and MySQL for optimal performance and data integrity.",
    color: "from-pink-500 to-rose-500",
  },
  {
    icon: Smartphone,
    title: "Mobile-First Design",
    desc: "Ensuring applications work seamlessly across all devices with responsive design principles. Implementing mobile-optimized layouts and touch-friendly interfaces for superior user experience on smartphones and tablets.",
    color: "from-yellow-400 to-orange-500",
  },
  {
    icon: Zap,
    title: "Performance Optimization",
    desc: "Optimizing applications for speed, SEO, and user experience using lazy loading, code splitting, and caching strategies. Monitoring performance metrics and implementing improvements for faster load times and better Core Web Vitals.",
    color: "from-cyan-400 to-blue-500",
  },
  {
    icon: Cpu,
    title: "AI & Machine Learning",
    desc: "Integrating machine learning models and AI-powered features into applications. Working with TensorFlow, scikit-learn, and LLM APIs to build intelligent systems that solve complex problems and enhance user interactions.",
    color: "from-purple-400 to-pink-500",
  },
  {
    icon: Wrench,
    title: "DevOps & Deployment",
    desc: "Setting up CI/CD pipelines, cloud deployments, and production environments on Vercel, Firebase, and custom servers. Managing infrastructure, monitoring, and maintaining high-availability systems for reliable application delivery.",
    color: "from-green-400 to-emerald-500",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 150,
      damping: 18,
    },
  },
} as const;

export default function AboutMe() {
  return (
    <section
      className="relative w-full min-h-screen flex flex-col items-center justify-center px-8 py-10 sm:px-8 md:px-16 sm:py-16 md:py-24"
      id="about"
    >
      <motion.div
        className="w-full max-w-6xl text-center"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.05, margin: "0px 0px -50px 0px" }}
      >
        {/* About Me Section Header */}
        <motion.p
          variants={itemVariants}
          className="text-blue-400 text-xs md:text-sm tracking-widest font-medium mb-4"
          style={{
            textShadow:
              "0 0 10px rgba(255, 255, 255, 0.3), 0 0 20px rgba(59, 130, 246, 0.3)",
          }}
        >
          About Me
        </motion.p>

        <motion.h2
          variants={itemVariants}
          className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight"
          style={{
            textShadow:
              "0 0 20px rgba(255, 255, 255, 0.4), 0 0 40px rgba(59, 130, 246, 0.3), 0 0 60px rgba(107, 84, 188, 0.2)",
          }}
        >
          Professional Journey & Achievements
        </motion.h2>

        <motion.p
          variants={itemVariants}
          className="mt-4 text-white/80 text-base md:text-lg max-w-3xl mx-auto leading-relaxed"
          style={{
            textShadow:
              "0 0 10px rgba(255, 255, 255, 0.2), 0 0 20px rgba(59, 130, 246, 0.1)",
          }}
        >
          Over the years, I've had the privilege of working on diverse projects,
          collaborating with talented teams, and delivering solutions that make
          a real impact. Here's a snapshot of my professional achievements and
          the trust my clients place in me.
        </motion.p>

        {/* Stats Cards Section - Square Format */}
        <motion.div
          variants={itemVariants}
          className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6"
        >
          {[
            { number: "20+", label: "Projects Completed" },
            { number: "2+", label: "Years Experience" },
            { number: "10+", label: "Happy Clients" },
            { number: "24/7", label: "Support Available" },
          ].map((stat, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="relative rounded-xl border border-blue-400/40 backdrop-blur-xl p-5 sm:p-6 text-center group hover:border-purple-400/80 transition-all duration-300 flex flex-col items-center justify-center overflow-hidden min-h-[110px]"
              style={{
                background:
                  "linear-gradient(135deg, rgb(35, 47, 71) 0%, rgba(59, 130, 246, 0.15) 100%)",
              }}
            >
              {/* Hover background gradient */}
              <div
                className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(147, 51, 234, 0.3) 0%, rgba(59, 130, 246, 0.4) 100%)",
                }}
              />
              <div className="relative z-10">
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-cyan-400 mb-2">
                  {stat.number}
                </h3>
                <p className="text-white/70 text-xs sm:text-sm md:text-base font-medium">
                  {stat.label}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Expertise Section */}
        <motion.p
          variants={itemVariants}
          className="text-blue-400 text-xs md:text-sm tracking-widest font-medium mb-4 mt-20"
          style={{
            textShadow:
              "0 0 10px rgba(255, 255, 255, 0.3), 0 0 20px rgba(59, 130, 246, 0.3)",
          }}
        >
          My Expertise
        </motion.p>

        <motion.h2
          variants={itemVariants}
          className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight"
          style={{
            textShadow:
              "0 0 20px rgba(255, 255, 255, 0.4), 0 0 40px rgba(59, 130, 246, 0.3), 0 0 60px rgba(107, 84, 188, 0.2)",
          }}
        >
          What I Bring to the Table
        </motion.h2>

        <motion.p
          variants={itemVariants}
          className="mt-4 text-white/80 text-base md:text-lg max-w-3xl mx-auto leading-relaxed"
          style={{
            textShadow:
              "0 0 10px rgba(255, 255, 255, 0.2), 0 0 20px rgba(59, 130, 246, 0.1)",
          }}
        >
          Comprehensive technical expertise across the full technology stack,
          from frontend interfaces to backend systems, with a focus on
          performance, scalability, and user experience.
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {aboutItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={index}
                whileHover={{ y: -8 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="group"
              >
                {/* Card content with animated border only */}
                <div
                  className="relative rounded-xl backdrop-blur-2xl px-6 py-5 text-left h-full border-2 border-blue-400/40 group-hover:border-purple-400/80 transition-all duration-300 overflow-hidden"
                  style={{
                    background:
                      "linear-gradient(135deg, rgb(35, 47, 71) 0%, rgba(59, 130, 246, 0.12) 100%)",
                  }}
                >
                  {/* Hover background gradient */}
                  <div
                    className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(147, 51, 234, 0.25) 0%, rgba(59, 130, 246, 0.35) 100%)",
                    }}
                  />
                  <div className="relative z-10">
                    {/* Icon container */}
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 20,
                      }}
                      className={`inline-block p-2 rounded-md bg-gradient-to-r ${item.color} mb-3`}
                    >
                      <Icon className="w-6 h-6 text-white" strokeWidth={1.5} />
                    </motion.div>

                    {/* Text content */}
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-300 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-white/75 text-sm leading-relaxed font-medium">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.div>
    </section>
  );
}
