import {
  Code2,
  Smartphone,
  Cloud,
  Wrench,
  Gamepad2,
  Brain,
  PenTool,
  Search,
} from "lucide-react";
import type { ServiceDetail } from "./ServiceDetailsModal";

export const SERVICES: ServiceDetail[] = [
  {
    id: "01",
    title: "Web Development",
    icon: Code2,
    colorHex: "rgba(70,130,255,1)",
    colorGlow: "rgba(70,130,255,.28)",
    description:
      "Modern responsive websites with premium UI and scalable architecture built to perform.",
    longDescription:
      "Custom-built websites — from single landing pages to full multi-page business sites — with clean code, fast load times, and a design that actually represents your brand instead of a generic template. Every project starts with a short discovery call to understand your goals, moves through a design pass, then development in React, Next.js, TypeScript, and Tailwind CSS — the same stack powering my client projects — before final testing and handover.",
    points: ["Next.js & React", "TypeScript & Tailwind", "SEO Optimized"],
    deliverables: [
      "Responsive design (mobile to desktop)",
      "SEO-ready structure & metadata",
      "Fast load times & optimized images",
      "Basic analytics setup (Google Analytics + Search Console)",
      "Contact form with email notifications",
      "Cross-browser & cross-device testing",
      "1 round of revisions included",
      "Source code handover",
      "30 days of post-launch bug support",
    ],
    pricingTiers: [
      {
        label: "Landing Page",
        price: "₹2,000",
        note: "Single page, 3–5 sections — hero, about, services/features, testimonials, and a contact form",
      },
      {
        label: "Portfolio Website",
        price: "₹4,500 – ₹7,500",
        note: "Multi-page site — home, about, project gallery, and a contact page",
      },
      {
        label: "Business Website",
        price: "₹9,000 – ₹15,000",
        note: "5+ pages with a lightweight CMS — service pages, blog setup, and lead-capture forms",
      },
      {
        label: "E-commerce Website",
        price: "₹17,500+",
        note: "Product catalog, cart, and checkout — includes payment gateway integration and order management",
      },
    ],
    timeline: "1 – 3 weeks",
  },
  {
    id: "02",
    title: "App Development",
    icon: Smartphone,
    colorHex: "rgba(140,80,255,1)",
    colorGlow: "rgba(140,80,255,.28)",
    description:
      "Cross-platform mobile apps with smooth animations, realtime systems, and clean architecture.",
    longDescription:
      "Flutter-based apps that run on both iOS and Android from a single codebase, with realtime data, clean navigation, and the kind of polish that makes an app feel finished, not just functional. Built with Flutter, Dart, and Firebase — the exact stack behind my shipped apps — covering everything from screen flow planning to a store-ready build.",
    points: ["Flutter & Dart", "Firebase Integration", "Realtime Features"],
    deliverables: [
      "Cross-platform build (iOS + Android)",
      "Firebase backend integration",
      "Realtime data sync",
      "User authentication (email / Google / phone)",
      "Push notifications setup",
      "State management architecture",
      "App store submission support",
      "Source code handover",
      "14 days of post-launch bug support",
    ],
    pricingTiers: [
      {
        label: "MVP App",
        price: "₹17,500 – ₹30,000",
        note: "Core features, single flow — 1 main user flow, basic auth, and a Firebase backend",
      },
      {
        label: "Standard App",
        price: "₹30,000 – ₹50,000",
        note: "Multiple screens, auth, backend — 5–8 screens, full authentication, and a working database",
      },
      {
        label: "Advanced App",
        price: "₹50,000+",
        note: "Realtime, payments, complex logic — realtime sync, payment gateway, and custom backend logic",
      },
    ],
    timeline: "3 – 8 weeks",
  },
  {
    id: "03",
    title: "Cloud Hosting",
    icon: Cloud,
    colorHex: "rgba(80,200,255,1)",
    colorGlow: "rgba(80,200,255,.28)",
    description:
      "Fast cloud deployments with scalable infrastructure, CI/CD pipelines and zero-downtime setups.",
    longDescription:
      "Getting your project live shouldn't be the hard part. I set up production-ready hosting with proper CI/CD, domain configuration, and monitoring so deployments are boring — in the best way. Deployed on Vercel with Firebase or Node.js backends, with monitoring in place so you find out about issues before your users do.",
    points: ["Vercel Deploy", "Firebase & Node.js Setup", "CI/CD Pipelines"],
    deliverables: [
      "Production deployment setup",
      "Custom domain & SSL configuration",
      "CI/CD pipeline (auto-deploy on push)",
      "Environment variable management",
      "Staging environment (Standard tier and up)",
      "Basic uptime monitoring",
      "Error & log tracking setup",
      "Deployment documentation",
      "Rollback strategy",
    ],
    pricingTiers: [
      {
        label: "Basic Setup",
        price: "₹2,500 – ₹4,000",
        note: "Single project, one environment — domain + SSL setup and a single deploy pipeline",
      },
      {
        label: "Standard Setup",
        price: "₹4,000 – ₹7,500",
        note: "Staging + production, CI/CD — auto-deploy on push, staging environment, and env management",
      },
      {
        label: "Managed Hosting",
        price: "₹1,750/mo",
        note: "Ongoing monitoring & support — uptime checks, monthly health report, priority fixes",
      },
    ],
    timeline: "2 – 5 days",
  },
  {
    id: "04",
    title: "AI & ML Integration",
    icon: Brain,
    colorHex: "rgba(255,80,140,1)",
    colorGlow: "rgba(255,80,140,.28)",
    description:
      "Embed intelligent features — chatbots, recommendations, and automation — into any product.",
    longDescription:
      "Adding AI to a product only matters if it solves a real problem. I integrate LLM-powered chatbots, recommendation logic, or automation pipelines into your existing app or website, wired cleanly into your React/Next.js or Node.js stack, with attention to cost, latency, and failure handling — not just a demo that works once.",
    points: ["LLM Integration", "Node.js Pipelines", "API Wrappers"],
    deliverables: [
      "LLM API integration (OpenAI / Claude / etc.)",
      "Custom prompt engineering",
      "Chat or automation interface",
      "Rate limiting & error handling",
      "Conversation/context memory setup",
      "Basic usage analytics",
      "Cost monitoring guidance",
      "Documentation & handover",
      "14 days of post-launch support",
    ],
    pricingTiers: [
      {
        label: "Simple Integration",
        price: "₹6,000 – ₹10,000",
        note: "Chatbot or single AI feature — one LLM-powered feature with tuned prompts",
      },
      {
        label: "Custom Pipeline",
        price: "₹12,500 – ₹22,500",
        note: "Multi-step automation, custom logic — a full workflow with error handling built in",
      },
      {
        label: "Full AI Product",
        price: "₹22,500+",
        note: "End-to-end AI-powered feature set — multiple integrated AI features with analytics and scaling considerations",
      },
    ],
    timeline: "1 – 4 weeks",
  },
  {
    id: "05",
    title: "Game Development",
    icon: Gamepad2,
    colorHex: "rgba(52,211,153,1)",
    colorGlow: "rgba(52,211,153,.28)",
    description:
      "Interactive gameplay systems with multiplayer logic, physics, and optimised render performance.",
    longDescription:
      "Browser or mobile games with real gameplay logic — physics, multiplayer sync, scoring systems — built to run smoothly rather than just look like a tech demo, using Flutter or React on the front end and Firebase for realtime sync where multiplayer is involved.",
    points: ["Flutter / React Logic", "Firebase Multiplayer", "Optimized Engine"],
    deliverables: [
      "Core gameplay mechanics",
      "Realtime/multiplayer logic (if needed)",
      "Score & progress tracking",
      "Responsive controls (touch + desktop)",
      "Sound effects & basic audio",
      "Performance optimization",
      "Source code handover",
      "Playtesting & bug-fix round",
    ],
    pricingTiers: [
      {
        label: "Simple Game",
        price: "₹7,500 – ₹12,500",
        note: "Single-player, core mechanics — core game loop, 1–3 levels, basic UI",
      },
      {
        label: "Standard Game",
        price: "₹12,500 – ₹22,500",
        note: "Multiple levels, scoring, polish — 5+ levels, full scoring system, and a polish pass",
      },
      {
        label: "Multiplayer Game",
        price: "₹22,500+",
        note: "Realtime sync, matchmaking — realtime multiplayer with matchmaking and backend sync",
      },
    ],
    timeline: "2 – 6 weeks",
  },
  {
    id: "06",
    title: "UI/UX Design",
    icon: PenTool,
    colorHex: "rgba(244,63,94,1)",
    colorGlow: "rgba(244,63,94,.28)",
    description:
      "User-centered interface design and interactive prototypes that make your product intuitive and premium.",
    longDescription:
      "From wireframes to high-fidelity Figma prototypes, I design interfaces that are clean, on-brand, and easy to navigate — validated before a single line of code is written, then handed off in a format that's ready for a developer (mine or yours) to build directly from.",
    points: ["Figma Prototypes", "Wireframing", "Design Systems"],
    deliverables: [
      "User flow & wireframes",
      "High-fidelity Figma designs",
      "Interactive clickable prototype",
      "Mobile & desktop layouts",
      "Design system / style guide",
      "Icon & asset preparation",
      "Developer handoff files (Figma specs)",
      "1 round of revisions included",
    ],
    pricingTiers: [
      {
        label: "Landing Page Design",
        price: "₹1,500 – ₹3,000",
        note: "3–5 sections, single page — wireframe plus one high-fidelity design, with a mobile version",
      },
      {
        label: "Website UI Kit",
        price: "₹4,000 – ₹7,500",
        note: "Multi-page, full design system — 5+ page designs plus a reusable component library",
      },
      {
        label: "App UI/UX",
        price: "₹7,500 – ₹15,000",
        note: "Full app flow, prototype — complete screen flow, interactive prototype, and design system",
      },
    ],
    timeline: "3 – 10 days",
  },
  {
    id: "07",
    title: "SEO Optimization",
    icon: Search,
    colorHex: "rgba(163,230,53,1)",
    colorGlow: "rgba(163,230,53,.28)",
    description:
      "On-page SEO, performance tuning, and technical fixes that help your site actually get found on Google.",
    longDescription:
      "Speed, structure, and search visibility — I audit and optimize metadata, page speed, and site structure so your website ranks better and loads faster, working on top of the same Next.js foundation I build sites with (or your existing stack).",
    points: ["On-Page SEO", "Core Web Vitals", "Technical Audit"],
    deliverables: [
      "Full technical SEO audit",
      "Metadata & schema markup",
      "Page speed optimization",
      "Sitemap & robots.txt setup",
      "Basic keyword research",
      "Google Search Console setup",
      "Google Analytics setup",
      "Monthly ranking report (Ongoing tier)",
    ],
    pricingTiers: [
      {
        label: "SEO Audit",
        price: "₹1,500 – ₹2,500",
        note: "One-time technical audit — full site crawl, issue report, and a prioritized fix list",
      },
      {
        label: "On-Page SEO",
        price: "₹3,000 – ₹6,000",
        note: "Full site optimization — metadata, schema markup, speed fixes, and sitemap setup",
      },
      {
        label: "Ongoing SEO",
        price: "₹2,000/mo",
        note: "Monthly optimization & reporting — recurring audits, content suggestions, and a ranking report",
      },
    ],
    timeline: "3 – 7 days",
  },
  {
    id: "08",
    title: "Maintenance & Support",
    icon: Wrench,
    colorHex: "rgba(245,158,11,1)",
    colorGlow: "rgba(245,158,11,.28)",
    description:
      "Long-term support, upgrades, bug fixes, and continuous performance improvements post-launch.",
    longDescription:
      "Launch day isn't the finish line. Ongoing support covers bug fixes, dependency updates, security patches, and small feature additions so your product stays reliable long after it ships — with a clear monthly summary so you always know what was done.",
    points: ["Bug Fixes", "Security Updates", "Feature Upgrades"],
    deliverables: [
      "Monthly bug fix allowance",
      "Dependency & security updates",
      "Performance monitoring",
      "Small feature requests",
      "Uptime checks",
      "Priority response time",
      "Monthly status summary",
      "Emergency fix availability (Priority tier)",
    ],
    pricingTiers: [
      {
        label: "Basic Plan",
        price: "₹1,500/mo",
        note: "Bug fixes & security updates — up to 2 hrs/month, security patches included",
      },
      {
        label: "Standard Plan",
        price: "₹3,000/mo",
        note: "+ small features, faster response — up to 5 hrs/month plus small feature additions",
      },
      {
        label: "Priority Plan",
        price: "₹6,000/mo",
        note: "Dedicated support, same-day response — up to 10 hrs/month with same-day turnaround on urgent fixes",
      },
    ],
    timeline: "Ongoing",
  },
];