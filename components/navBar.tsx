"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "#about", label: "About" },
    { href: "#projects", label: "Projects" },
    { href: "#skills", label: "Skills" },
    { href: "#github-stats", label: "GitHub Stats" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 py-4 md:px-6 lg:px-12">
      <div className="flex items-center justify-between w-full">
        {/* Logo */}
        <Link href="/" className="flex items-center flex-shrink-0">
          <Image
            src="/logo.png"
            alt="Abdul Rehman"
            width={100}
            height={40}
            className="h-auto w-24"
            priority
          />
        </Link>

        {/* Desktop Navigation - Center */}
        <nav
          className="
            hidden md:block
            relative overflow-hidden
            rounded-full
            bg-white/[0.06]
            backdrop-blur-3xl backdrop-saturate-200
            border border-white/20
            ring-1 ring-white/10
            shadow-[0_10px_35px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.22)]
          "
        >
          {/* subtle blue gradient highlight at center */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="h-16 w-56 rounded-full bg-gradient-to-r from-transparent via-blue-400/20 to-transparent blur-xl" />
          </div>

          <div className="relative z-10 flex items-center gap-8 px-8 py-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-white/95 hover:text-cyan-300 transition-colors duration-200 relative group whitespace-nowrap"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-cyan-300/90 group-hover:w-full transition-all duration-300"></span>
              </Link>
            ))}
          </div>
        </nav>

        {/* Desktop Contact Button */}
        <Link
          href="#contact"
          className="hidden md:inline-flex px-6 py-2 rounded-full text-white text-sm font-medium
                     bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700
                     shadow-lg hover:shadow-purple-500/25
                     transition-all duration-300 flex-shrink-0"
        >
          Contact
        </Link>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          className="md:hidden p-2 rounded-lg bg-white/[0.06] backdrop-blur-xl border border-white/20 transition-colors duration-200"
          aria-label="Toggle menu"
        >
          {isOpen ? (
            <svg
              className="w-6 h-6 text-white"
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
          ) : (
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden mt-4 rounded-2xl bg-white/[0.06] backdrop-blur-3xl backdrop-saturate-200 border border-white/20 py-4 shadow-[0_8px_24px_rgba(0,0,0,0.30),inset_0_1px_0_rgba(255,255,255,0.18)]">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block mx-3 px-4 py-3 text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-colors duration-200 font-medium"
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="mx-3 mt-2 px-2">
            <Link
              href="#contact"
              className="block px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg transition-all duration-300 font-medium text-center shadow-lg"
              onClick={() => setIsOpen(false)}
            >
              Contact
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
