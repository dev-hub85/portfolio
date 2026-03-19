"use client";

import { motion } from "framer-motion";

export default function GithubStats() {
  return (
    <section
      id="github-stats"
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
            Open Source Contributions
          </p>

          <h2
            className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight"
            style={{
              textShadow:
                "0 0 20px rgba(255,255,255,0.4), 0 0 40px rgba(59,130,246,0.3), 0 0 60px rgba(107,84,188,0.2)",
            }}
          >
            GitHub Statistics
          </h2>

          <p
            className="mt-4 text-white/80 text-base md:text-lg max-w-3xl mx-auto leading-relaxed"
            style={{
              textShadow:
                "0 0 10px rgba(255,255,255,0.2), 0 0 20px rgba(59,130,246,0.1)",
            }}
          >
            A snapshot of my coding journey and contributions. These stats
            reflect my commitment to continuous learning, consistent coding
            practice, and passion for building impactful software solutions.
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-8">
          {/* Top Languages Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            viewport={{ once: true, amount: 0.2 }}
            className="relative rounded-2xl backdrop-blur-xl border border-white/10 hover:border-purple-500/60 transition-all duration-500 overflow-hidden p-6"
            style={{
              background:
                "linear-gradient(145deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)",
            }}
          >
            {/* Glow effect on hover */}
            <div
              className="absolute inset-0 rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle at 50% 50%, rgba(147, 51, 234, 0.15) 0%, transparent 70%)",
              }}
            />

            <div className="relative z-10">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
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
                Most Used Languages
              </h3>
              <img
                src="https://github-readme-stats.vercel.app/api/top-langs/?username=dev-hub85&layout=compact&theme=tokyonight&hide_border=true&langs_count=8&bg_color=00000000"
                alt="Top Languages"
                className="w-full max-w-[350px] h-auto"
              />
            </div>
          </motion.div>

          {/* Streak Stats Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            viewport={{ once: true, amount: 0.2 }}
            className="relative rounded-2xl backdrop-blur-xl border border-white/10 hover:border-purple-500/60 transition-all duration-500 overflow-hidden p-6"
            style={{
              background:
                "linear-gradient(145deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)",
            }}
          >
            {/* Glow effect on hover */}
            <div
              className="absolute inset-0 rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle at 50% 50%, rgba(147, 51, 234, 0.15) 0%, transparent 70%)",
              }}
            />

            <div className="relative z-10">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-orange-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z"
                  />
                </svg>
                Contribution Streak
              </h3>
              <img
                src="https://nirzak-streak-stats.vercel.app/?user=dev-hub85&theme=tokyonight&hide_border=true&background=00000000"
                alt="GitHub Streak"
                className="w-full max-w-[450px] h-auto"
              />
            </div>
          </motion.div>
        </div>

        {/* GitHub Profile Link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          viewport={{ once: true }}
          className="flex justify-center mt-12"
        >
          <a
            href="https://github.com/dev-hub85"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-3 rounded-full text-sm font-medium bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-blue-500/25"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            View GitHub Profile
          </a>
        </motion.div>
      </div>
    </section>
  );
}
