// Content extracted from the original section components.

export const iconMap: { [key: string]: string } = {
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

export interface Project {
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

export const projectsData: Project[] = [
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
    liveLink: "https://vulnersbench.com/",
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
    liveLink: "https://archvio.com/",
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
    liveLink: "https://nas-crt.com/",
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

export const skillsData = [
  {
    category: "Languages",
    skills: [
      { name: "JavaScript", level: "Advanced" },
      { name: "TypeScript", level: "Advanced" },
      { name: "Python", level: "Advanced" },
      { name: "C#", level: "Intermediate" },
      { name: "C", level: "Intermediate" },
      { name: "C++", level: "Intermediate" },
      { name: "Dart", level: "Intermediate" },
    ],
  },
  {
    category: "Frontend",
    skills: [
      { name: "React", level: "Advanced" },
      { name: "Next.js", level: "Advanced" },
      { name: "Angular", level: "Intermediate" },
      { name: "Tailwind CSS", level: "Advanced" },
      { name: "Flutter", level: "Intermediate" },
      { name: "Framer Motion", level: "Advanced" },
      { name: "Bootstrap", level: "Advanced" },
      { name: "jQuery", level: "Advanced" },
      { name: "Redux", level: "Advanced" },
      { name: "CSS", level: "Advanced" },
      { name: "Sass", level: "Intermediate" },
    ],
  },
  {
    category: "Backend",
    skills: [
      { name: "Node.js", level: "Advanced" },
      { name: "Express.js", level: "Advanced" },
      { name: "FastAPI", level: "Intermediate" },
      { name: ".NET", level: "Intermediate" },
      { name: "REST API", level: "Advanced" },
      { name: "JWT", level: "Intermediate" },
    ],
  },
  {
    category: "Databases",
    skills: [
      { name: "MongoDB", level: "Advanced" },
      { name: "PostgreSQL", level: "Advanced" },
      { name: "MySQL", level: "Advanced" },
      { name: "SQLite", level: "Intermediate" },
      { name: "Firebase", level: "Intermediate" },
      { name: "SQL Server", level: "Intermediate" },
    ],
  },
  {
    category: "Web Scraping",
    skills: [
      { name: "BeautifulSoup", level: "Advanced" },
      { name: "Scrapy", level: "Advanced" },
      { name: "Selenium", level: "Intermediate" },
      { name: "Axios", level: "Advanced" },
    ],
  },
  {
    category: "AI & ML",
    skills: [
      { name: "NumPy", level: "Intermediate" },
      { name: "Pandas", level: "Intermediate" },
      { name: "Scikit-Learn", level: "Intermediate" },
      { name: "Matplotlib", level: "Intermediate" },
      { name: "OpenAI API", level: "Intermediate" },
    ],
  },
  {
    category: "DevOps & Cloud",
    skills: [
      { name: "Vercel", level: "Advanced" },
      { name: "Firebase", level: "Intermediate" },
      { name: "GitHub Actions", level: "Intermediate" },
      { name: "Git", level: "Advanced" },
      { name: "Linux", level: "Intermediate" },
    ],
  },
  {
    category: "Tools & Others",
    skills: [
      { name: "Postman", level: "Advanced" },
      { name: "VS Code", level: "Advanced" },
      { name: "GitHub", level: "Advanced" },
      { name: "Figma", level: "Intermediate" },
    ],
  },
];
