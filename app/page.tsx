"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CyberneticGridShader from "@/components/cybernetic-grid-shader";
import HeroSection from "@/components/hero-section";
import AboutMe from "@/components/about-me";
import Skills from "@/components/skills";
import Projects from "@/components/projects";
import GithubStats from "@/components/github-stats";
import Contact from "@/components/contact";
import Footer from "@/components/footer";
import WhatsAppButton from "@/components/whatsapp-button";
import ChatBot from "@/components/chat-bot";
import SplashScreen from "@/components/splash-screen";
import NavBar from "@/components/navBar";

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);
  const [contentReady, setContentReady] = useState(false);

  const handleSplashComplete = () => {
    setShowSplash(false);
    setContentReady(true);
  };

  return (
    <>
      <AnimatePresence>
        {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: contentReady ? 1 : 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="app-container" style={{ position: "relative" }}>
          <CyberneticGridShader />

          <NavBar />
          <div
            className="overlay-content"
            style={{
              position: "relative",
              zIndex: 1,
              color: "#ffffff",
            }}
          >
            <HeroSection />
          </div>
        </div>

        <div className="app-container" style={{ position: "relative" }}>
          <CyberneticGridShader />

          <div
            className="overlay-content"
            style={{
              position: "relative",
              zIndex: 1,
              color: "#ffffff",
            }}
          >
            <AboutMe />
          </div>
        </div>

        <div className="app-container" style={{ position: "relative" }}>
          <CyberneticGridShader />

          <div
            className="overlay-content"
            style={{
              position: "relative",
              zIndex: 1,
              color: "#ffffff",
            }}
          >
            <Skills />
          </div>
        </div>

        <div className="app-container" style={{ position: "relative" }}>
          <CyberneticGridShader />

          <div
            className="overlay-content"
            style={{
              position: "relative",
              zIndex: 1,
              color: "#ffffff",
            }}
          >
            <Projects />
          </div>
        </div>

        <div className="app-container" style={{ position: "relative" }}>
          <CyberneticGridShader />

          <div
            className="overlay-content"
            style={{
              position: "relative",
              zIndex: 1,
              color: "#ffffff",
            }}
          >
            <GithubStats />
          </div>
        </div>

        <div className="app-container" style={{ position: "relative" }}>
          <CyberneticGridShader />

          <div
            className="overlay-content"
            style={{
              position: "relative",
              zIndex: 1,
              color: "#ffffff",
            }}
          >
            <Contact />
          </div>
        </div>

        <Footer />
        <WhatsAppButton />
        <ChatBot />
      </motion.div>
    </>
  );
}
