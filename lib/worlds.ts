// The six featured projects ("worlds"). Text is derived from the entries in
// lib/data.ts; the rest of the projects appear in the workshop grid.

import { projectsData, type Project } from "@/lib/data";

export type WorldIcon = "shield" | "cart" | "gamepad" | "scan" | "image" | "building";

export interface World {
  slug: string;
  projectId: number;
  name: string;
  accent: string;
  icon: WorldIcon;
  area: string;
  tagline: string;
  role: string;
  problem: string;
  build: { text: string; chips: string[] };
  result: { text: string; stat: { value: string; label: string } };
  live: { note: string; url?: string };
}

export const worlds: World[] = [
  {
    slug: "vulnerability-benchmark",
    projectId: 1,
    name: "Vulnerability Benchmark",
    accent: "#56d7ff",
    icon: "shield",
    area: "Security / Full stack",
    tagline: "Every threat, measured.",
    role: "Full-stack developer · Next.js + Firebase",
    problem:
      "Security researchers and developers need one place to benchmark, track and analyze vulnerabilities, instead of scattered notes and spreadsheets.",
    build: {
      text: "A Next.js platform with interactive CVE analytics, CVSS and EPSS scoring, patch-level links to GitHub and Linux-kernel fixes, and AI-powered detection on your own code.",
      chips: ["CVSS + EPSS scoring", "Patch intelligence", "AI detection"],
    },
    result: {
      text: "A reference dataset anyone can explore without signing up: slice every CVE by type, vendor, product, assigner, score or date.",
      stat: { value: "362K+", label: "CVEs analyzed across 22,801 vendors" },
    },
    live: { note: "Live in production.", url: "https://vulnersbench.com/" },
  },
  {
    slug: "daniels-believe",
    projectId: 4,
    name: "Daniels Believe",
    accent: "#ff7a8a",
    icon: "cart",
    area: "E-commerce / Full stack",
    tagline: "One store, two sides.",
    role: "Full-stack developer · Next.js + Vue.js",
    problem:
      "A growing store needed a storefront customers enjoy and a back office the team can run: products, inventory, orders and promotions.",
    build: {
      text: "A Next.js customer storefront and a separate Vue.js admin panel, kept consistent through real-time synchronization.",
      chips: ["Storefront", "Admin panel", "Real-time sync"],
    },
    result: {
      text: "Orders, stock and customer insights stay in step across both apps, with campaigns and discounts managed in one place.",
      stat: { value: "2", label: "apps sharing one live dataset" },
    },
    live: { note: "Live in production.", url: "https://danielsbelieve.de/" },
  },
  {
    slug: "neogames",
    projectId: 3,
    name: "NeoGames",
    accent: "#8b7bff",
    icon: "gamepad",
    area: "Gaming / Web platform",
    tagline: "Press start in the browser.",
    role: "Full-stack developer · Next.js + Firebase",
    problem:
      "Players wanted a single portal for HTML5 games that remembers their progress and gives them a reason to come back.",
    build: {
      text: "A Next.js portal with user profiles, auto-saved progress, global leaderboards and an achievement system, responsive on every device.",
      chips: ["Leaderboards", "Achievements", "Auto-save"],
    },
    result: {
      text: "Games load instantly in the browser, and profiles, rankings and badges keep players engaged.",
      stat: { value: "6", label: "player systems around every game" },
    },
    live: { note: "Live in production.", url: "https://neogames.space/" },
  },
  {
    slug: "object-detection",
    projectId: 7,
    name: "Object Detection",
    accent: "#7cffb2",
    icon: "scan",
    area: "AI / Computer vision",
    tagline: "Frames in, objects out.",
    role: "AI engineer · YOLOv5 + FastAPI + React",
    problem:
      "Detecting objects in images and video usually means notebooks and scripts; people needed an interface and an API they could actually use.",
    build: {
      text: "A YOLOv5 pipeline behind a FastAPI inference service, with a React frontend for uploads, batch jobs and custom model training.",
      chips: ["YOLOv5", "FastAPI", "Batch processing"],
    },
    result: {
      text: "Detections render in real time with confidence scores, and the REST API plugs into other systems.",
      stat: { value: "3", label: "layers: model, API and interface" },
    },
    live: { note: "Personal project. The charts illustrate the training and evaluation pipeline; they are not measured results." },
  },
  {
    slug: "stock-media",
    projectId: 2,
    name: "Archvio",
    accent: "#ff3355",
    icon: "image",
    area: "E-commerce / Marketplace",
    tagline: "Visuals and sound, licensed.",
    role: "Full-stack developer · Next.js + Firebase",
    problem:
      "Creators needed a marketplace to sell photos, videos and audio, and buyers needed to find, preview and license them safely.",
    build: {
      text: "Advanced search and filtering, cart and wishlist, secure payments, creator dashboards and license management in one Next.js app.",
      chips: ["Media search", "Secure payments", "Licensing"],
    },
    result: {
      text: "Buyers preview and download with the right license attached, and creators track their catalogue from a dashboard.",
      stat: { value: "4", label: "media types: video, music, photos and illustrations" },
    },
    live: { note: "Live in production.", url: "https://archvio.com/" },
  },
  {
    slug: "nas-creative",
    projectId: 6,
    name: "NAS Creative",
    accent: "#6f9bff",
    icon: "building",
    area: "Brand / Portfolio site",
    tagline: "Built work, beautifully shown.",
    role: "Frontend developer · Next.js + Supabase",
    problem:
      "A construction company needed a site that shows the quality of its work: projects, services, team and the trust of past clients.",
    build: {
      text: "Project galleries with before/after comparisons, service listings, team profiles and testimonials, with Framer Motion animation and a Supabase-backed contact form.",
      chips: ["Before / after", "English / Arabic", "Contact flow"],
    },
    result: {
      text: "Visitors see the work first, in English or Arabic, and enquiries arrive with notifications.",
      stat: { value: "2", label: "languages: English and Arabic" },
    },
    live: { note: "Live in production.", url: "https://nas-crt.com/" },
  },
];

export const worldProject = (w: World): Project =>
  projectsData.find((p) => p.id === w.projectId)!;

export const featuredIds = worlds.map((w) => w.projectId);
