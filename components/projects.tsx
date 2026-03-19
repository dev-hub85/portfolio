"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

// ── Icon path mapping (from skills.tsx) ─────────────────────────────────────

const iconMap: { [key: string]: string } = {
  JavaScript: "/icons/javascript.svg",
  TypeScript: "/icons/typescript.svg",
  Python: "/icons/python.svg",
  "C#": "/icons/c_sharp.svg",
  C: "/icons/c.svg",
  "C++": "/icons/c.svg",
  Dart: "/icons/dart.svg",
  React: "/icons/react.svg",
  "Next.js": "/icons/next.svg",
  Angular: "/icons/angular.svg",
  "Vue.js": "/icons/vue.svg",
  "Tailwind CSS": "/icons/tailwind-css.svg",
  Flutter: "/icons/flutter.svg",
  "Framer Motion": "/icons/framer-motion.svg",
  Bootstrap: "/icons/bootstrap.svg",
  jQuery: "/icons/jquery.svg",
  Redux: "/icons/redux.svg",
  CSS: "/icons/css.svg",
  Sass: "/icons/saas.svg",
  "Node.js": "/icons/nodejs.svg",
  "Express.js": "/icons/expressjs.svg",
  FastAPI: "/icons/fastapi.svg",
  ".NET": "/icons/dotnet.svg",
  "REST API": "/icons/rest-api.svg",
  JWT: "/icons/jwt.svg",
  MongoDB: "/icons/mongodb.svg",
  PostgreSQL: "/icons/postgresql.svg",
  MySQL: "/icons/mysql.svg",
  SQLite: "/icons/sqlite.svg",
  Firebase: "/icons/firebase.svg",
  Supabase: "/icons/supabase.svg",
  "SQL Server": "/icons/sql.svg",
  BeautifulSoup: "/icons/beautifulsoup.svg",
  Scrapy: "/icons/scrapy.svg",
  Selenium: "/icons/selenium.svg",
  Axios: "/icons/axios.svg",
  NumPy: "/icons/numpy.svg",
  Pandas: "/icons/pandas.svg",
  "Scikit-Learn": "/icons/scikit-learn.svg",
  Matplotlib: "/icons/matplotlib.svg",
  "OpenAI API": "/icons/openai.svg",
  Vercel: "/icons/vercel.svg",
  "GitHub Actions": "/icons/github-action.svg",
  Git: "/icons/git.svg",
  Linux: "/icons/linux.svg",
  Postman: "/icons/postman.svg",
  "VS Code": "/icons/vs-code.svg",
  GitHub: "/icons/github.svg",
  Figma: "/icons/figma.svg",
  HTML5: "/icons/html.svg",
  YOLOv5: "/icons/python.svg",
  PyTorch: "/icons/pytorch.svg",
  TensorFlow: "/icons/tensorflow.svg",
  "Windows Forms": "/icons/dotnet.svg",
  KNN: "/icons/scikit-learn.svg",
  CodeT5: "/icons/python.svg",
  PyPI: "/icons/python.svg",
};

// ── Color mapping for tech badges ───────────────────────────────────────────

const colorMap: { [key: string]: { bg: string; accent: string } } = {
  JavaScript: { bg: "rgba(247, 223, 30, 0.15)", accent: "#F7DF1E" },
  TypeScript: { bg: "rgba(49, 120, 198, 0.2)", accent: "#3178C6" },
  Python: { bg: "rgba(55, 118, 171, 0.2)", accent: "#3776AB" },
  "C#": { bg: "rgba(104, 33, 122, 0.2)", accent: "#68217A" },
  React: { bg: "rgba(97, 218, 251, 0.15)", accent: "#61DAFB" },
  "Next.js": { bg: "rgba(255, 255, 255, 0.1)", accent: "#FFFFFF" },
  Angular: { bg: "rgba(221, 0, 49, 0.15)", accent: "#DD0031" },
  "Vue.js": { bg: "rgba(65, 184, 131, 0.15)", accent: "#41B883" },
  "Tailwind CSS": { bg: "rgba(56, 189, 248, 0.15)", accent: "#38BDF8" },
  Firebase: { bg: "rgba(255, 196, 0, 0.15)", accent: "#FFC400" },
  Supabase: { bg: "rgba(62, 207, 142, 0.15)", accent: "#3ECF8E" },
  "Node.js": { bg: "rgba(131, 205, 41, 0.15)", accent: "#83CD29" },
  "Express.js": { bg: "rgba(255, 255, 255, 0.1)", accent: "#FFFFFF" },
  MongoDB: { bg: "rgba(0, 237, 100, 0.12)", accent: "#00ED64" },
  Scrapy: { bg: "rgba(96, 205, 24, 0.15)", accent: "#60CD18" },
  Selenium: { bg: "rgba(67, 176, 42, 0.2)", accent: "#43B02A" },
  BeautifulSoup: { bg: "rgba(59, 89, 152, 0.2)", accent: "#3B5998" },
  "Scikit-Learn": { bg: "rgba(247, 147, 30, 0.15)", accent: "#F7931E" },
  YOLOv5: { bg: "rgba(55, 118, 171, 0.2)", accent: "#3776AB" },
  PyTorch: { bg: "rgba(238, 76, 44, 0.15)", accent: "#EE4C2C" },
  ".NET": { bg: "rgba(81, 43, 212, 0.2)", accent: "#512BD4" },
  "Windows Forms": { bg: "rgba(81, 43, 212, 0.2)", accent: "#512BD4" },
  HTML5: { bg: "rgba(227, 79, 38, 0.15)", accent: "#E34F26" },
  CSS: { bg: "rgba(21, 114, 182, 0.2)", accent: "#1572B6" },
  Bootstrap: { bg: "rgba(121, 82, 179, 0.2)", accent: "#7952B3" },
  MySQL: { bg: "rgba(0, 97, 138, 0.2)", accent: "#00618A" },
  "SQL Server": { bg: "rgba(204, 41, 39, 0.15)", accent: "#CC2927" },
  KNN: { bg: "rgba(247, 147, 30, 0.15)", accent: "#F7931E" },
  Pandas: { bg: "rgba(21, 4, 88, 0.3)", accent: "#150458" },
  NumPy: { bg: "rgba(77, 171, 207, 0.2)", accent: "#4DABCF" },
  CodeT5: { bg: "rgba(55, 118, 171, 0.2)", accent: "#3776AB" },
  PyPI: { bg: "rgba(55, 118, 171, 0.2)", accent: "#3776AB" },
  "REST API": { bg: "rgba(79, 195, 247, 0.15)", accent: "#4FC3F7" },
  Vercel: { bg: "rgba(255, 255, 255, 0.1)", accent: "#FFFFFF" },
};

// ── Project Data ────────────────────────────────────────────────────────────

interface Project {
  id: number;
  title: string;
  description: string;
  longDescription: string;
  technologies: string[];
  features: string[];
  category: string;
  liveLink?: string;
  githubLink?: string;
  image?: string;
}

const projectsData: Project[] = [
  {
    id: 1,
    title: "Vulnerability Benchmark System",
    description:
      "A comprehensive platform for benchmarking and analyzing security vulnerabilities with real-time tracking and detailed reporting.",
    longDescription:
      "This full-stack application provides security researchers and developers with a robust platform to benchmark, track, and analyze vulnerabilities. It features real-time data synchronization, comprehensive dashboards, user authentication, and detailed vulnerability reporting with severity scoring. The system integrates multiple data sources and provides actionable insights for security improvements.",
    technologies: [
      "Next.js",
      "TypeScript",
      "Firebase",
      "Tailwind CSS",
      "REST API",
    ],
    features: [
      "Real-time vulnerability tracking dashboard",
      "Severity scoring and risk assessment",
      "User authentication and role-based access",
      "Detailed vulnerability reports with CVE integration",
      "Data visualization and analytics",
      "Export functionality for reports",
    ],
    category: "Security",
  },
  {
    id: 2,
    title: "Stock Media E-commerce Platform",
    description:
      "A feature-rich digital marketplace for stock photos, videos, and media assets with integrated payment processing.",
    longDescription:
      "A complete e-commerce solution for digital media assets featuring a modern UI, advanced search capabilities, shopping cart functionality, secure payment processing, and content creator dashboards. The platform supports multiple media types including photos, videos, and audio files with preview capabilities and licensing management.",
    technologies: [
      "Next.js",
      "TypeScript",
      "Firebase",
      "Tailwind CSS",
      "REST API",
    ],
    features: [
      "Advanced media search and filtering",
      "Shopping cart and wishlist functionality",
      "Secure payment gateway integration",
      "Content creator dashboard",
      "License management system",
      "Media preview and download system",
    ],
    category: "E-commerce",
  },
  {
    id: 3,
    title: "NeoGames - HTML5 Games Portal",
    description:
      "An engaging HTML5 games website featuring a collection of browser-based games with user profiles and leaderboards.",
    longDescription:
      "A modern gaming portal built with Next.js that hosts a variety of HTML5 games playable directly in the browser. Features include user authentication, game progress saving, global leaderboards, achievements system, and social sharing capabilities. The responsive design ensures optimal gaming experience across all devices.",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Firebase"],
    features: [
      "Collection of HTML5 browser games",
      "User profiles and authentication",
      "Global leaderboards and rankings",
      "Achievement and badge system",
      "Game progress auto-save",
      "Responsive design for all devices",
    ],
    category: "Gaming",
    liveLink: "https://neogames.space/",
  },
  {
    id: 4,
    title: "Daniels Believe E-commerce Platform",
    description:
      "A modern e-commerce solution with separate customer frontend and admin panel for comprehensive store management.",
    longDescription:
      "A complete e-commerce ecosystem featuring a Next.js customer-facing storefront and a Vue.js admin panel. The platform includes product management, inventory tracking, order processing, customer management, analytics dashboard, and promotional tools. Real-time synchronization ensures data consistency across both applications.",
    technologies: [
      "Next.js",
      "Vue.js",
      "TypeScript",
      "Firebase",
      "REST API",
      "Tailwind CSS",
    ],
    features: [
      "Customer storefront with cart functionality",
      "Separate admin panel for management",
      "Product and inventory management",
      "Order processing and tracking",
      "Customer analytics and insights",
      "Promotional campaigns and discounts",
    ],
    category: "E-commerce",
    liveLink: "https://danielsbelieve.de/",
  },
  {
    id: 5,
    title: "HR & Fleet Management System",
    description:
      "An integrated system for managing human resources and vehicle fleet operations with comprehensive tracking features.",
    longDescription:
      "A dual-purpose management system that handles both HR operations and fleet management. HR features include employee records, attendance tracking, leave management, and payroll processing. Fleet management covers vehicle tracking, maintenance scheduling, fuel consumption monitoring, and driver assignment. Real-time dashboards provide operational insights.",
    technologies: [
      "Next.js",
      "TypeScript",
      "Firebase",
      "Tailwind CSS",
      "REST API",
    ],
    features: [
      "Employee records and profiles",
      "Attendance and leave management",
      "Vehicle tracking and assignment",
      "Maintenance scheduling system",
      "Fuel consumption monitoring",
      "Reporting and analytics dashboard",
    ],
    category: "Management",
  },
  {
    id: 6,
    title: "NAS Creative - Construction Portfolio",
    description:
      "A professional portfolio website for a construction company showcasing projects, services, and company information.",
    longDescription:
      "A visually stunning portfolio website designed for NAS Creative construction company. Features include project galleries with before/after comparisons, service descriptions, team member profiles, client testimonials, and a contact system. The site emphasizes visual impact with smooth animations and responsive design.",
    technologies: [
      "Next.js",
      "TypeScript",
      "Supabase",
      "Tailwind CSS",
      "Framer Motion",
    ],
    features: [
      "Project showcase with galleries",
      "Before/after project comparisons",
      "Service and expertise listings",
      "Team member profiles",
      "Client testimonials section",
      "Contact form with notifications",
    ],
    category: "Portfolio",
    liveLink: "https://construction-site-psi-two.vercel.app/",
  },
  {
    id: 7,
    title: "Object Detection System (YOLOv5)",
    description:
      "A complete object detection solution using YOLOv5 with both frontend interface and backend processing pipeline.",
    longDescription:
      "An end-to-end object detection system leveraging the YOLOv5 deep learning model. The system includes a user-friendly frontend for image/video upload, a FastAPI backend for model inference, real-time detection visualization, and batch processing capabilities. Supports custom model training and multiple object classes.",
    technologies: [
      "Python",
      "YOLOv5",
      "PyTorch",
      "React",
      "FastAPI",
      "REST API",
    ],
    features: [
      "Real-time object detection",
      "Image and video processing",
      "Custom model training support",
      "Detection confidence visualization",
      "Batch processing capability",
      "REST API for integration",
    ],
    category: "AI/ML",
  },
  {
    id: 8,
    title: "Vulnerability Detection (CodeT5)",
    description:
      "Fine-tuned CodeT5 model for detecting security vulnerabilities in source code with high accuracy.",
    longDescription:
      "A machine learning project focused on fine-tuning the CodeT5 transformer model for vulnerability detection in source code. The system can identify various vulnerability patterns including SQL injection, XSS, buffer overflows, and more. Includes training pipeline, evaluation metrics, and inference API.",
    technologies: ["Python", "CodeT5", "PyTorch", "Pandas", "NumPy"],
    features: [
      "Fine-tuned CodeT5 transformer model",
      "Multiple vulnerability type detection",
      "Training and evaluation pipeline",
      "High accuracy predictions",
      "Inference API for integration",
      "Detailed vulnerability reports",
    ],
    category: "AI/ML",
  },
  {
    id: 9,
    title: "Daraz Product Crawler",
    description:
      "An automated web scraper for extracting product data from Daraz e-commerce platform with data analysis capabilities.",
    longDescription:
      "A sophisticated web scraping solution designed to extract product information from Daraz marketplace. Features include multi-page crawling, data cleaning and normalization, price tracking over time, category-wise analysis, and export to multiple formats. Built with anti-detection measures and rate limiting.",
    technologies: ["Python", "Scrapy", "Selenium", "Pandas", "MongoDB"],
    features: [
      "Automated multi-page crawling",
      "Product data extraction and cleaning",
      "Price history tracking",
      "Category-wise data analysis",
      "Export to CSV/JSON/Database",
      "Anti-detection measures",
    ],
    category: "Web Scraping",
  },
  {
    id: 10,
    title: "CVE Data Crawler",
    description:
      "A comprehensive crawler for collecting and analyzing CVE (Common Vulnerabilities and Exposures) data.",
    longDescription:
      "An automated system for crawling and collecting CVE data from multiple security databases. The crawler extracts vulnerability details, severity scores, affected products, and remediation information. Data is processed and stored for analysis, with features for tracking new vulnerabilities and generating alerts.",
    technologies: ["Python", "Scrapy", "Selenium", "MongoDB", "Pandas"],
    features: [
      "Multi-source CVE data collection",
      "Severity score extraction",
      "Affected product tracking",
      "Automated daily updates",
      "Data analysis and reporting",
      "Alert system for critical CVEs",
    ],
    category: "Security",
  },
  {
    id: 11,
    title: "Code Smell Detection Tool",
    description:
      "A JavaScript-based tool for detecting and reporting code smells and anti-patterns in codebases.",
    longDescription:
      "A static analysis tool built in JavaScript that scans codebases to identify code smells, anti-patterns, and potential issues. Detects problems like long methods, duplicate code, complex conditionals, and naming convention violations. Generates detailed reports with suggestions for improvement.",
    technologies: ["JavaScript", "Node.js", "REST API"],
    features: [
      "Multiple code smell detection",
      "Anti-pattern identification",
      "Detailed analysis reports",
      "Improvement suggestions",
      "CI/CD integration support",
      "Configurable rule sets",
    ],
    category: "Developer Tools",
  },
  {
    id: 12,
    title: "File Difference Analyzer",
    description:
      "A Python package for analyzing and visualizing differences between files with detailed comparison reports.",
    longDescription:
      "A published Python package (PyPI) that provides comprehensive file comparison and difference analysis. Supports multiple file formats, generates visual diff reports, tracks changes over time, and integrates with version control systems. Includes CLI and programmatic API for flexibility.",
    technologies: ["Python", "PyPI"],
    features: [
      "Multi-format file comparison",
      "Visual diff generation",
      "Change tracking history",
      "CLI and API interfaces",
      "VCS integration",
      "Published on PyPI",
    ],
    category: "Developer Tools",
  },
  {
    id: 13,
    title: "Lung Cancer Prediction System",
    description:
      "A machine learning application using KNN algorithm for early lung cancer prediction based on patient data.",
    longDescription:
      "A medical prediction system that uses the K-Nearest Neighbors algorithm to predict lung cancer probability based on patient symptoms and medical history. Features include data preprocessing, model training, prediction interface, and result visualization. Designed to assist medical professionals in early detection.",
    technologies: ["Python", "Scikit-Learn", "KNN", "Pandas", "NumPy"],
    features: [
      "KNN-based prediction model",
      "Patient data preprocessing",
      "Probability score output",
      "Result visualization",
      "Model accuracy metrics",
      "Medical report generation",
    ],
    category: "AI/ML",
  },
  {
    id: 14,
    title: "Hotel Management System",
    description:
      "A comprehensive system for managing hotel operations including reservations, rooms, and guest services.",
    longDescription:
      "A complete hotel management solution covering all aspects of hotel operations. Features include room booking and management, guest check-in/check-out, billing system, housekeeping management, and reporting. The system streamlines daily operations and improves guest experience.",
    technologies: ["Python", "MySQL", "REST API"],
    features: [
      "Room booking and management",
      "Guest check-in/check-out system",
      "Billing and payment processing",
      "Housekeeping task management",
      "Occupancy reports and analytics",
      "Guest history tracking",
    ],
    category: "Management",
  },
  {
    id: 15,
    title: "Recipe Website",
    description:
      "A React-based recipe sharing platform with search, categories, and user-submitted recipes.",
    longDescription:
      "A feature-rich recipe website built with React that allows users to browse, search, and share recipes. Includes category filtering, ingredient-based search, step-by-step cooking instructions, nutrition information, and user ratings. Responsive design ensures great experience on all devices.",
    technologies: ["React", "JavaScript", "CSS", "REST API"],
    features: [
      "Recipe browsing and search",
      "Category-based filtering",
      "Step-by-step instructions",
      "Nutrition information",
      "User ratings and reviews",
      "Responsive recipe cards",
    ],
    category: "Web Application",
  },
  {
    id: 16,
    title: "Books Data Crawler",
    description:
      "A web scraper for collecting book information from online sources with data analysis features.",
    longDescription:
      "An automated web scraping tool designed to collect book data from various online sources. Extracts information including titles, authors, prices, ratings, and descriptions. Features data cleaning, duplicate detection, and export capabilities for further analysis or database population.",
    technologies: ["Python", "BeautifulSoup", "Scrapy", "Pandas"],
    features: [
      "Multi-source book data extraction",
      "Author and price tracking",
      "Rating aggregation",
      "Data cleaning and normalization",
      "Duplicate detection",
      "Multiple export formats",
    ],
    category: "Web Scraping",
  },
  {
    id: 17,
    title: "Books E-commerce Frontend",
    description:
      "An Angular-based frontend for a book e-commerce platform with modern UI and shopping features.",
    longDescription:
      "A sleek and modern Angular frontend for an online bookstore. Features include book catalog with filtering, detailed book pages, shopping cart functionality, user authentication, wishlist, and checkout process. Built with responsive design and smooth animations.",
    technologies: ["Angular", "TypeScript", "CSS", "Bootstrap"],
    features: [
      "Book catalog with search",
      "Advanced filtering options",
      "Shopping cart functionality",
      "User authentication",
      "Wishlist feature",
      "Responsive checkout flow",
    ],
    category: "E-commerce",
  },
  {
    id: 18,
    title: "Hospital Management System",
    description:
      "A desktop application for hospital administration built with C# and Windows Forms.",
    longDescription:
      "A comprehensive desktop application for managing hospital operations. Built with C# and Windows Forms, it handles patient records, doctor schedules, appointments, billing, pharmacy inventory, and reporting. Features role-based access control and data backup capabilities.",
    technologies: ["C#", ".NET", "Windows Forms", "SQL Server"],
    features: [
      "Patient records management",
      "Doctor scheduling system",
      "Appointment booking",
      "Billing and invoicing",
      "Pharmacy inventory",
      "Role-based access control",
    ],
    category: "Management",
    liveLink: "https://hotel-management-system-two-murex.vercel.app/",
  },
];

// ── Category Color Mapping ───────────────────────────────────────────────────

const categoryColorMap: {
  [key: string]: { bg: string; text: string; border: string };
} = {
  Security: { bg: "rgba(239, 68, 68, 0.2)", text: "#F87171", border: "rgba(239, 68, 68, 0.4)" },
  "E-commerce": { bg: "rgba(34, 197, 94, 0.2)", text: "#4ADE80", border: "rgba(34, 197, 94, 0.4)" },
  Gaming: { bg: "rgba(168, 85, 247, 0.2)", text: "#C084FC", border: "rgba(168, 85, 247, 0.4)" },
  Management: { bg: "rgba(59, 130, 246, 0.2)", text: "#60A5FA", border: "rgba(59, 130, 246, 0.4)" },
  Portfolio: { bg: "rgba(236, 72, 153, 0.2)", text: "#F472B6", border: "rgba(236, 72, 153, 0.4)" },
  "AI/ML": { bg: "rgba(251, 146, 60, 0.2)", text: "#FB923C", border: "rgba(251, 146, 60, 0.4)" },
  "Web Scraping": { bg: "rgba(20, 184, 166, 0.2)", text: "#2DD4BF", border: "rgba(20, 184, 166, 0.4)" },
  "Developer Tools": { bg: "rgba(139, 92, 246, 0.2)", text: "#A78BFA", border: "rgba(139, 92, 246, 0.4)" },
  "Web Application": { bg: "rgba(14, 165, 233, 0.2)", text: "#38BDF8", border: "rgba(14, 165, 233, 0.4)" },
};

// ── Tech Badge Component ────────────────────────────────────────────────────

function TechBadge({ tech }: { tech: string }) {
  const iconPath = iconMap[tech];
  const colors = colorMap[tech] || {
    bg: "rgba(59, 130, 246, 0.15)",
    accent: "#3B82F6",
  };

  return (
    <div
      className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all duration-300 hover:scale-105"
      style={{
        background: colors.bg,
        border: `1px solid ${colors.accent}40`,
        color: colors.accent,
      }}
    >
      {iconPath && <img src={iconPath} alt={tech} className="w-3.5 h-3.5" />}
      <span>{tech}</span>
    </div>
  );
}

// ── Project Card Component ──────────────────────────────────────────────────

function ProjectCard({
  project,
  index,
  onViewDetails,
}: {
  project: Project;
  index: number;
  onViewDetails: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
      viewport={{ once: true, amount: 0.2 }}
      className="group relative rounded-2xl backdrop-blur-xl border border-white/10 hover:border-purple-500/60 transition-all duration-500 overflow-hidden h-full flex flex-col"
      style={{
        background:
          "linear-gradient(145deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)",
      }}
    >
      {/* Glow effect on hover */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(147, 51, 234, 0.15) 0%, transparent 70%)",
        }}
      />

      {/* Card Content */}
      <div className="relative z-10 p-6 flex flex-col h-full">
        {/* Category Badge */}
        <div className="flex items-center justify-between mb-4">
          {(() => {
            const catColors = categoryColorMap[project.category] || {
              bg: "rgba(59, 130, 246, 0.2)",
              text: "#60A5FA",
              border: "rgba(59, 130, 246, 0.4)",
            };
            return (
              <span
                className="px-3 py-1 rounded-full text-xs font-medium"
                style={{
                  backgroundColor: catColors.bg,
                  color: catColors.text,
                  border: `1px solid ${catColors.border}`,
                }}
              >
                {project.category}
              </span>
            );
          })()}
          {project.liveLink && (
            <a
              href={project.liveLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 transition-colors font-medium"
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
              Live
            </a>
          )}
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors duration-300">
          {project.title}
        </h3>

        {/* Description */}
        <p className="text-white/70 text-sm leading-relaxed mb-4 line-clamp-3">
          {project.description}
        </p>

        {/* Technologies */}
        <div className="flex flex-wrap gap-2 mb-6">
          {project.technologies.slice(0, 4).map((tech) => (
            <TechBadge key={tech} tech={tech} />
          ))}
          {project.technologies.length > 4 && (
            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-white/10 text-white/60">
              +{project.technologies.length - 4} more
            </span>
          )}
        </div>

        {/* View Details Button */}
        <button
          onClick={onViewDetails}
          className="w-full py-2.5 rounded-full text-sm font-medium bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-purple-500/25 mt-auto"
        >
          View Details
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </motion.div>
  );
}

// ── Project Modal Component ─────────────────────────────────────────────────

function ProjectModal({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  // Close modal on Escape key press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="relative w-full max-w-3xl max-h-[70vh] overflow-y-auto rounded-2xl border border-white/20 mt-20 scrollbar-hide"
        style={{
          background:
            "linear-gradient(145deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.98) 100%)",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors z-10"
        >
          <svg
            className="w-5 h-5 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Modal Content */}
        <div className="p-8">
          {/* Header */}
          <div className="mb-6">
            {(() => {
              const catColors = categoryColorMap[project.category] || {
                bg: "rgba(59, 130, 246, 0.2)",
                text: "#60A5FA",
                border: "rgba(59, 130, 246, 0.4)",
              };
              return (
                <span
                  className="px-3 py-1 rounded-full text-xs font-medium"
                  style={{
                    backgroundColor: catColors.bg,
                    color: catColors.text,
                    border: `1px solid ${catColors.border}`,
                  }}
                >
                  {project.category}
                </span>
              );
            })()}
            <div className="flex items-center gap-3 mt-4 mb-2">
              <h2 className="text-3xl font-bold text-white">
                {project.title}
              </h2>
              {project.liveLink && (
                <a
                  href={project.liveLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-sm text-red-400 hover:text-red-300 transition-colors font-medium"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                  Live
                </a>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="mb-8">
            <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <svg
                className="w-5 h-5 text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              About This Project
            </h4>
            <p className="text-white/80 leading-relaxed">
              {project.longDescription}
            </p>
          </div>

          {/* Features */}
          <div className="mb-8">
            <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <svg
                className="w-5 h-5 text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Key Features
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {project.features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2 p-3 rounded-xl bg-white/5 border border-white/10"
                >
                  <svg
                    className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="text-white/70 text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Technologies */}
          <div className="mb-8">
            <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <svg
                className="w-5 h-5 text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                />
              </svg>
              Technologies Used
            </h4>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <TechBadge key={tech} tech={tech} />
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Main Projects Component ─────────────────────────────────────────────────

export default function Projects() {
  const [showAll, setShowAll] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const displayedProjects = showAll ? projectsData : projectsData.slice(0, 6);

  return (
    <section
      id="projects"
      className="relative w-full flex items-center justify-center py-24 overflow-hidden"
    >
      <div className="w-full max-w-6xl px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          viewport={{ once: true, amount: 0.3 }}
          className="text-center mb-16"
        >
          <p
            className="text-blue-400 text-xs md:text-sm tracking-widest font-medium mb-4"
            style={{
              textShadow:
                "0 0 10px rgba(255,255,255,0.3), 0 0 20px rgba(59,130,246,0.3)",
            }}
          >
            Portfolio Showcase
          </p>

          <h2
            className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight"
            style={{
              textShadow:
                "0 0 20px rgba(255,255,255,0.4), 0 0 40px rgba(59,130,246,0.3), 0 0 60px rgba(107,84,188,0.2)",
            }}
          >
            Featured Projects
          </h2>

          <p
            className="mt-4 text-white/80 text-base md:text-lg max-w-3xl mx-auto leading-relaxed"
            style={{
              textShadow:
                "0 0 10px rgba(255,255,255,0.2), 0 0 20px rgba(59,130,246,0.1)",
            }}
          >
            A collection of projects showcasing my expertise in full-stack
            development, machine learning, web scraping, and security research.
            Each project demonstrates problem-solving abilities and technical
            proficiency across various domains.
          </p>
        </motion.div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <AnimatePresence mode="popLayout">
            {displayedProjects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={index}
                onViewDetails={() => setSelectedProject(project)}
              />
            ))}
          </AnimatePresence>
        </div>

        {/* Show All / Show Less Button */}
        {projectsData.length > 6 && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            viewport={{ once: true }}
            className="flex justify-center"
          >
            <button
              onClick={() => setShowAll(!showAll)}
              className="px-8 py-3 rounded-full text-sm font-medium bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-blue-500/25"
            >
              {showAll ? (
                <>
                  Show Less
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 15l7-7 7 7"
                    />
                  </svg>
                </>
              ) : (
                <>
                  Show All Projects ({projectsData.length})
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </>
              )}
            </button>
          </motion.div>
        )}

        {/* Project Modal */}
        <AnimatePresence>
          {selectedProject && (
            <ProjectModal
              project={selectedProject}
              onClose={() => setSelectedProject(null)}
            />
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
