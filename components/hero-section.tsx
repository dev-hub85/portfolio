"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";

const socialLinks = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/abdul-rehman-3b9213319",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
        <path
          d="M4.98 3.5C4.98 4.88 3.87 6 2.49 6A2.5 2.5 0 0 1 0 3.5C0 2.12 1.11 1 2.49 1a2.5 2.5 0 0 1 2.49 2.5ZM.5 8h4V24h-4V8Zm7 0h3.83v2.19h.05c.53-1.01 1.84-2.19 3.79-2.19C19.22 8 24 10.66 24 16.14V24h-4v-6.98c0-1.66-.03-3.8-2.31-3.8-2.31 0-2.67 1.8-2.67 3.68V24h-4V8Z"
          fill="#0077B5"
        />
      </svg>
    ),
  },
  {
    label: "Upwork",
    href: "https://www.upwork.com/freelancers/~011f507cf8249982d9?mp_source=share",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
        <path
          d="M18.561 13.158c-1.102 0-2.135-.467-3.074-1.227l.228-1.076.008-.042c.207-1.143.849-3.06 2.839-3.06 1.492 0 2.703 1.212 2.703 2.703-.001 1.489-1.212 2.702-2.704 2.702zm0-8.14c-2.539 0-4.51 1.649-5.31 4.366-1.22-1.834-2.148-4.036-2.687-5.892H7.828v7.112c-.002 1.406-1.141 2.546-2.547 2.548-1.405-.002-2.543-1.143-2.545-2.548V3.492H0v7.112c0 2.914 2.37 5.303 5.281 5.303 2.913 0 5.283-2.389 5.283-5.303v-1.19c.529 1.107 1.182 2.229 1.974 3.221l-1.673 7.873h2.797l1.213-5.71c1.063.679 2.285 1.109 3.686 1.109 3 0 5.439-2.452 5.439-5.45 0-3-2.439-5.439-5.439-5.439z"
          fill="#6FDA44"
        />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/arehman615?igsh=bHB0dHQzYmhlZmln",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
        <path
          d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm0 1.8A3.95 3.95 0 0 0 3.8 7.75v8.5a3.95 3.95 0 0 0 3.95 3.95h8.5a3.95 3.95 0 0 0 3.95-3.95v-8.5a3.95 3.95 0 0 0-3.95-3.95h-8.5Zm9.6 1.35a1.1 1.1 0 1 1 0 2.2 1.1 1.1 0 0 1 0-2.2ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 1.8a3.2 3.2 0 1 0 0 6.4 3.2 3.2 0 0 0 0-6.4Z"
          fill="#E4405F"
        />
      </svg>
    ),
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/abdul.rehman.109166",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
        <path
          d="M24 12a12 12 0 1 0-13.88 11.85v-8.39H7.08V12h3.04V9.36c0-3 1.79-4.66 4.53-4.66 1.31 0 2.68.23 2.68.23v2.95h-1.51c-1.49 0-1.95.93-1.95 1.88V12h3.33l-.53 3.46h-2.8v8.39A12 12 0 0 0 24 12Z"
          fill="#1877F2"
        />
      </svg>
    ),
  },
  {
    label: "GitHub",
    href: "https://github.com/dev-hub85",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
        <path
          d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v 3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
          fill="#181717"
        />
      </svg>
    ),
  },
];

export default function HeroSection() {
  const [isClicked, setIsClicked] = useState<null | "work" | "contact">(null);

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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 150,
        damping: 18,
      },
    },
  };

  const floatVariants = {
    initial: { y: 0 },
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut" as const,
      },
    },
  };

  const buttonHover = {
    scale: 1.05,
    transition: { duration: 0.3 },
  };

  const buttonTap = {
    scale: 0.95,
  };

  return (
    <section className="min-h-screen w-full flex items-center justify-center px-4">
      <motion.div
        className="w-full max-w-3xl text-center"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <motion.p
          variants={itemVariants}
          className="text-blue-400 text-xs md:text-sm tracking-widest font-medium mb-6"
          style={{
            textShadow:
              "0 0 10px rgba(255, 255, 255, 0.3), 0 0 20px rgba(59, 130, 246, 0.3)",
          }}
        >
          Hi, there
        </motion.p>

        <motion.h1
          variants={floatVariants}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="text-5xl md:text-7xl font-bold text-white mb-4 leading-tight md:whitespace-nowrap"
          style={{
            textShadow:
              "0 0 20px rgba(255, 255, 255, 0.4), 0 0 40px rgba(59, 130, 246, 0.3), 0 0 60px rgba(107, 84, 188, 0.2)",
          }}
        >
          I am Abdul Rehman
        </motion.h1>

        <motion.h2
          variants={itemVariants}
          className="text-2xl md:text-4xl font-bold text-blue-400 mb-6"
          style={{
            textShadow:
              "0 0 15px rgba(255, 255, 255, 0.3), 0 0 30px rgba(59, 130, 246, 0.3)",
          }}
        >
          Software Engineer
        </motion.h2>

        <motion.p
          variants={itemVariants}
          className="mt-6 text-white/85 text-base md:text-lg max-w-2xl mx-auto leading-relaxed font-medium"
          style={{
            textShadow:
              "0 0 10px rgba(255, 255, 255, 0.2), 0 0 20px rgba(59, 130, 246, 0.1)",
          }}
        >
          I craft scalable web applications, automation workflows, and
          AI-powered tools focused on solving real-world problems.
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="mt-8 flex items-center justify-center gap-3 flex-wrap"
        >
          {socialLinks.map((item) => (
            <motion.div
              key={item.label}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Link
                href={item.href}
                target="_blank"
                className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-white text-sm hover:opacity-90 transition"
                style={{
                  boxShadow:
                    "0 0 10px rgba(255, 255, 255, 0.3), 0 0 20px rgba(59, 130, 246, 0.2)",
                }}
              >
                {item.icon}
              </Link>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="mt-10 flex items-center justify-center gap-4 flex-wrap"
        >
          <motion.div
            onHoverStart={() => setIsClicked("work")}
            onHoverEnd={() => setIsClicked(null)}
            whileTap={buttonTap}
          >
            <Link
              href="#projects"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold transition"
              style={{
                background: "linear-gradient(135deg, #3b82f6 0%, #6b54bc 100%)",
                boxShadow: "none",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "translateY(-3px)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "translateY(0)")
              }
            >
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4 fill-white"
                aria-hidden="true"
              >
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
              </svg>
              View My Work
            </Link>
          </motion.div>

          <motion.div
            onHoverStart={() => setIsClicked("contact")}
            onHoverEnd={() => setIsClicked(null)}
            whileTap={buttonTap}
          >
            <Link
              href="#contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold transition"
              style={{
                background: "linear-gradient(135deg, #3b82f6 0%, #6b54bc 100%)",
                boxShadow: "none",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "translateY(-3px)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "translateY(0)")
              }
            >
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4 fill-white"
                aria-hidden="true"
              >
                <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
              </svg>
              Get in Touch
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
