"use client";

import { motion } from "framer-motion";
import { useState } from "react";

// ── Icon path mapping ──────────────────────────────────────────────────────

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
};

// ── Brand color mapping ────────────────────────────────────────────────────

const colorMap: { [key: string]: { bg: string; accent: string } } = {
  JavaScript: { bg: "rgba(247, 223, 30, 0.15)", accent: "#F7DF1E" },
  TypeScript: { bg: "rgba(49, 120, 198, 0.2)", accent: "#3178C6" },
  Python: { bg: "rgba(55, 118, 171, 0.2)", accent: "#3776AB" },
  "C#": { bg: "rgba(104, 33, 122, 0.2)", accent: "#68217A" },
  C: { bg: "rgba(0, 89, 156, 0.2)", accent: "#00599C" },
  "C++": { bg: "rgba(0, 89, 156, 0.2)", accent: "#00599C" },
  Dart: { bg: "rgba(0, 180, 216, 0.15)", accent: "#00B4D8" },
  React: { bg: "rgba(97, 218, 251, 0.15)", accent: "#61DAFB" },
  "Next.js": { bg: "rgba(255, 255, 255, 0.1)", accent: "#FFFFFF" },
  Angular: { bg: "rgba(221, 0, 49, 0.15)", accent: "#DD0031" },
  "Tailwind CSS": { bg: "rgba(56, 189, 248, 0.15)", accent: "#38BDF8" },
  Flutter: { bg: "rgba(2, 119, 189, 0.2)", accent: "#02569B" },
  "Framer Motion": { bg: "rgba(187, 75, 255, 0.15)", accent: "#BB4BFF" },
  Bootstrap: { bg: "rgba(121, 82, 179, 0.2)", accent: "#7952B3" },
  jQuery: { bg: "rgba(7, 105, 173, 0.2)", accent: "#0769AD" },
  Redux: { bg: "rgba(118, 74, 188, 0.2)", accent: "#764ABC" },
  CSS: { bg: "rgba(21, 114, 182, 0.2)", accent: "#1572B6" },
  Sass: { bg: "rgba(204, 102, 153, 0.2)", accent: "#CC6699" },
  "Node.js": { bg: "rgba(131, 205, 41, 0.15)", accent: "#83CD29" },
  "Express.js": { bg: "rgba(255, 255, 255, 0.1)", accent: "#FFFFFF" },
  FastAPI: { bg: "rgba(0, 150, 136, 0.2)", accent: "#009688" },
  ".NET": { bg: "rgba(81, 43, 212, 0.2)", accent: "#512BD4" },
  "REST API": { bg: "rgba(79, 195, 247, 0.15)", accent: "#4FC3F7" },
  JWT: { bg: "rgba(251, 1, 91, 0.15)", accent: "#FB015B" },
  MongoDB: { bg: "rgba(0, 237, 100, 0.12)", accent: "#00ED64" },
  PostgreSQL: { bg: "rgba(51, 103, 145, 0.2)", accent: "#336791" },
  MySQL: { bg: "rgba(0, 97, 138, 0.2)", accent: "#00618A" },
  SQLite: { bg: "rgba(0, 58, 108, 0.2)", accent: "#003B6F" },
  Firebase: { bg: "rgba(255, 196, 0, 0.15)", accent: "#FFC400" },
  "SQL Server": { bg: "rgba(204, 41, 39, 0.15)", accent: "#CC2927" },
  BeautifulSoup: { bg: "rgba(59, 89, 152, 0.2)", accent: "#3B5998" },
  Scrapy: { bg: "rgba(96, 205, 24, 0.15)", accent: "#60CD18" },
  Selenium: { bg: "rgba(67, 176, 42, 0.2)", accent: "#43B02A" },
  Axios: { bg: "rgba(90, 41, 228, 0.2)", accent: "#5A29E4" },
  NumPy: { bg: "rgba(77, 171, 207, 0.2)", accent: "#4DABCF" },
  Pandas: { bg: "rgba(21, 4, 88, 0.3)", accent: "#150458" },
  "Scikit-Learn": { bg: "rgba(247, 147, 30, 0.15)", accent: "#F7931E" },
  Matplotlib: { bg: "rgba(17, 85, 124, 0.25)", accent: "#11557C" },
  "OpenAI API": { bg: "rgba(255, 255, 255, 0.1)", accent: "#FFFFFF" },
  Vercel: { bg: "rgba(255, 255, 255, 0.1)", accent: "#FFFFFF" },
  "GitHub Actions": { bg: "rgba(32, 136, 255, 0.2)", accent: "#2088FF" },
  Git: { bg: "rgba(243, 79, 41, 0.15)", accent: "#F34F29" },
  Linux: { bg: "rgba(255, 204, 51, 0.15)", accent: "#FFCC33" },
  Postman: { bg: "rgba(255, 108, 55, 0.15)", accent: "#FF6C37" },
  "VS Code": { bg: "rgba(0, 122, 204, 0.2)", accent: "#007ACC" },
  GitHub: { bg: "rgba(255, 255, 255, 0.1)", accent: "#FFFFFF" },
  Figma: { bg: "rgba(162, 89, 255, 0.15)", accent: "#A259FF" },
};

// ── Level to percentage mapping ────────────────────────────────────────────

const levelToPercent: { [key: string]: number } = {
  Beginner: 40,
  Intermediate: 70,
  Advanced: 90,
  Expert: 100,
};

// ── Skill data ──────────────────────────────────────────────────────────────

const skillsData = [
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

// ── Skill Card Component ───────────────────────────────────────────────────

function SkillCard({ skill }: { skill: { name: string; level: string } }) {
  const iconPath = iconMap[skill.name];
  const colors = colorMap[skill.name] || {
    bg: "rgba(59, 130, 246, 0.15)",
    accent: "#3B82F6",
  };
  const percent = levelToPercent[skill.level] || 70;

  return (
    <div
      className="relative rounded-xl backdrop-blur-2xl p-4 text-center border border-white/10 hover:border-white/30 transition-all duration-300 overflow-hidden flex flex-col items-center justify-center flex-shrink-0 mx-2"
      style={{
        background: `linear-gradient(145deg, ${colors.bg} 0%, rgba(15, 23, 42, 0.8) 100%)`,
        width: "160px",
        height: "180px",
        boxShadow: `0 4px 20px ${colors.bg}`,
      }}
    >
      {/* Glow effect */}
      <div
        className="absolute inset-0 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at center, ${colors.bg} 0%, transparent 70%)`,
        }}
      />

      <div className="relative z-10 flex flex-col items-center w-full">
        {/* Icon */}
        <div className="mb-3 w-10 h-10">
          {iconPath && (
            <img
              src={iconPath}
              alt={skill.name}
              width={40}
              height={40}
              className="w-10 h-10 mx-auto drop-shadow-lg"
            />
          )}
        </div>

        {/* Name */}
        <h4 className="text-sm font-bold text-white mb-3 text-center">
          {skill.name}
        </h4>

        {/* Skill Level Slider */}
        <div className="w-full px-2">
          <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full rounded-full"
              style={{
                backgroundColor: colors.accent,
                boxShadow: `0 0 10px ${colors.accent}`,
                width: `${percent}%`,
              }}
            />
          </div>
          <div className="flex justify-between mt-2">
            <span
              className="text-xs font-medium"
              style={{ color: colors.accent }}
            >
              {skill.level}
            </span>
            <span className="text-xs text-white/50">{percent}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Marquee Slider Component ───────────────────────────────────────────────

function MarqueeSlider({
  skills,
  direction,
  speed = 25,
}: {
  skills: { name: string; level: string }[];
  direction: "left" | "right";
  speed?: number;
}) {
  // Duplicate skills for seamless loop
  const duplicatedSkills = [...skills, ...skills, ...skills];

  return (
    <div className="relative overflow-hidden w-full">
      {/* Gradient masks for smooth edges */}
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-slate-900 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-slate-900 to-transparent z-10 pointer-events-none" />

      <motion.div
        className="flex"
        animate={{
          x: direction === "left" ? ["0%", "-33.333%"] : ["-33.333%", "0%"],
        }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: speed,
            ease: "linear",
          },
        }}
      >
        {duplicatedSkills.map((skill, index) => (
          <SkillCard key={`${skill.name}-${index}`} skill={skill} />
        ))}
      </motion.div>
    </div>
  );
}

// ── Category Section Component ─────────────────────────────────────────────

function CategorySection({
  category,
  skills,
  direction,
  index,
}: {
  category: string;
  skills: { name: string; level: string }[];
  direction: "left" | "right";
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
      viewport={{ once: true, amount: 0.2 }}
      className="mb-12"
    >
      {/* Category Title */}
      <div className="flex items-center gap-4 mb-6 px-4">
        <h3 className="text-xl md:text-2xl font-bold text-white whitespace-nowrap">
          {category}
        </h3>
        <div className="flex-1 h-px bg-gradient-to-r from-blue-500/50 to-transparent" />
        <span className="text-sm text-white/50">{skills.length} skills</span>
      </div>

      {/* Marquee Slider */}
      <MarqueeSlider
        skills={skills}
        direction={direction}
        speed={20 + skills.length * 2}
      />
    </motion.div>
  );
}

// ── Main Skills Component ──────────────────────────────────────────────────

export default function Skills() {
  // Randomize directions on initial render using lazy initializer
  const [directions] = useState<("left" | "right")[]>(() =>
    skillsData.map(() => (Math.random() > 0.5 ? "left" : "right")),
  );

  return (
    <section
      id="skills"
      className="relative w-full flex items-center justify-center py-24 overflow-hidden"
    >
      <div className="w-full max-w-7xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          viewport={{ once: true, amount: 0.3 }}
          className="text-center mb-16 px-4"
        >
          <p
            className="text-blue-400 text-xs md:text-sm tracking-widest font-medium mb-4"
            style={{
              textShadow:
                "0 0 10px rgba(255,255,255,0.3), 0 0 20px rgba(59,130,246,0.3)",
            }}
          >
            Technical Arsenal
          </p>

          <h2
            className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight"
            style={{
              textShadow:
                "0 0 20px rgba(255,255,255,0.4), 0 0 40px rgba(59,130,246,0.3), 0 0 60px rgba(107,84,188,0.2)",
            }}
          >
            Skills & Expertise
          </h2>

          <p
            className="mt-4 text-white/80 text-base md:text-lg max-w-3xl mx-auto leading-relaxed"
            style={{
              textShadow:
                "0 0 10px rgba(255,255,255,0.2), 0 0 20px rgba(59,130,246,0.1)",
            }}
          >
            A comprehensive toolkit spanning multiple programming languages,
            frameworks, and technologies. Proficient in full-stack development,
            cloud deployment, and data-driven solutions.
          </p>
        </motion.div>

        {/* Category Sections */}
        <div className="space-y-8">
          {skillsData.map((categoryData, index) => (
            <CategorySection
              key={categoryData.category}
              category={categoryData.category}
              skills={categoryData.skills}
              direction={directions[index] || "left"}
              index={index}
            />
          ))}
        </div>

        {/* Legend */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          viewport={{ once: true }}
          className="mt-16 flex flex-wrap justify-center gap-8 px-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-2 rounded-full bg-gradient-to-r from-cyan-400 to-cyan-500" />
            <span className="text-white/70 text-sm">Advanced (90%)</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-2 rounded-full bg-gradient-to-r from-blue-400 to-blue-500" />
            <span className="text-white/70 text-sm">Intermediate (70%)</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
