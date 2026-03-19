"use client";

import { motion } from "framer-motion";
import { Github, Linkedin, Mail, Heart, ArrowUp } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const UpworkIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true" fill="currentColor">
    <path d="M18.561 13.158c-1.102 0-2.135-.467-3.074-1.227l.228-1.076.008-.042c.207-1.143.849-3.06 2.839-3.06 1.492 0 2.703 1.212 2.703 2.703-.001 1.489-1.212 2.702-2.704 2.702zm0-8.14c-2.539 0-4.51 1.649-5.31 4.366-1.22-1.834-2.148-4.036-2.687-5.892H7.828v7.112c-.002 1.406-1.141 2.546-2.547 2.548-1.405-.002-2.543-1.143-2.545-2.548V3.492H0v7.112c0 2.914 2.37 5.303 5.281 5.303 2.913 0 5.283-2.389 5.283-5.303v-1.19c.529 1.107 1.182 2.229 1.974 3.221l-1.673 7.873h2.797l1.213-5.71c1.063.679 2.285 1.109 3.686 1.109 3 0 5.439-2.452 5.439-5.45 0-3-2.439-5.439-5.439-5.439z" />
  </svg>
);

const socialLinks = [
  {
    name: "GitHub",
    url: "https://github.com/dev-hub85",
    icon: <Github className="w-5 h-5" />,
    color: "#181717",
  },
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/in/abdul-rehman-3b9213319",
    icon: <Linkedin className="w-5 h-5" />,
    color: "#0A66C2",
  },
  {
    name: "Upwork",
    url: "https://www.upwork.com/freelancers/~011f507cf8249982d9?mp_source=share",
    icon: <UpworkIcon />,
    color: "#6FDA44",
  },
  {
    name: "Email",
    url: "mailto:arehman652786@gmail.com",
    icon: <Mail className="w-5 h-5" />,
    color: "#EA4335",
  },
];

const navLinks = [
  { name: "Home", href: "#" },
  { name: "About", href: "#about" },
  { name: "Skills", href: "#skills" },
  { name: "Projects", href: "#projects" },
  { name: "GitHub Stats", href: "#github-stats" },
  { name: "Contact", href: "#contact" },
];

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="relative w-full py-12 border-t border-white/10"
      style={{
        background:
          "linear-gradient(180deg, rgba(15, 23, 42, 0.95) 0%, rgba(10, 15, 30, 1) 100%)",
      }}
    >
      <div className="w-full max-w-6xl mx-auto px-4">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <h3
              className="text-2xl font-bold text-white"
              style={{
                textShadow:
                  "0 0 20px rgba(255,255,255,0.3), 0 0 40px rgba(59,130,246,0.2)",
              }}
            >
              <Link href="/" className="flex items-center">
                <Image
                  src="/logo.png"
                  alt="Abdul Rehman"
                  width={100}
                  height={30}
                  className="h-auto w-24"
                  priority
                />
              </Link>
            </h3>
            <p className="text-white/60 text-sm leading-relaxed">
              Full-Stack Developer passionate about building innovative web
              applications and exploring cutting-edge technologies.
            </p>
            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:scale-110 transition-all duration-300 shadow-md"
                  aria-label={social.name}
                  style={{ color: social.color }}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <h4 className="text-lg font-semibold text-white">Quick Links</h4>
            <nav className="grid grid-cols-2 gap-2">
              {navLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="text-white/60 hover:text-white text-sm transition-colors duration-300"
                >
                  {link.name}
                </a>
              ))}
            </nav>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <h4 className="text-lg font-semibold text-white">Get In Touch</h4>
            <div className="space-y-2">
              <p className="text-white/60 text-sm">
                <span className="text-white/80">Email:</span>{" "}
                arehman652786@gmail.com
              </p>
              <p className="text-white/60 text-sm">
                <span className="text-white/80">Location:</span> Pakistan
              </p>
              <p className="text-white/60 text-sm">
                <span className="text-white/80">Availability:</span> Open for
                Opportunities
              </p>
            </div>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-6" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true }}
            className="text-white/50 text-sm flex items-center gap-1"
          >
            © {currentYear} Abdul Rehman. Built with{" "}
            <Heart className="w-4 h-4 text-red-400 fill-red-400" /> using
            Next.js & Tailwind CSS
          </motion.p>

          {/* Back to Top Button */}
          <motion.button
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true }}
            onClick={scrollToTop}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white text-sm font-medium transition-all duration-300 shadow-lg hover:shadow-purple-500/25"
          >
            Back to Top
            <ArrowUp className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </footer>
  );
}
