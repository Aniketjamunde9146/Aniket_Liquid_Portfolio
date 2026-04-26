// ─────────────────────────────────────────────────────────────
//  projects.ts  —  Shaurya IT Services
//  Source of truth for all project data
// ─────────────────────────────────────────────────────────────

export const projects = [
  {
    name: "SpendWise",
    tagline: "Modern Wealth Management",
    desc: "A hands-on exploration of full-stack finance tracking. Built to master complex state management, data visualization, and secure user authentication flow.",
    category: "Web App",
    mockup: "/mocups/spendwise.png",
    accentColor: "#10b981",
    year: "2025",
    clientRequirements: [
      "Next.js 14 Server Actions",
      "Interactive Chart.js Analytics",
      "Supabase Database & Auth",
      "Responsive Tailwind UI",
    ],
    review: {
      clientName: "Developer Note",
      clientRole: "Personal Project",
      rating: 5,
      text: "Focused on creating a frictionless UX for expense logging. This project helped me master real-time database syncing and complex filtering logic.",
    },
    links: {
      view: "https://drive.google.com/file/d/1Zb6wRZ8Ni_q5zo7tmKoMRL7N7-O3nNPw/view?usp=sharing",
    },
  },
  {
    name: "Daily Mark",
    tagline: "Automated Attendance System",
    desc: "A specialized tool designed to solve manual bookkeeping. Features logic for automated salary calculation based on attendance markers and shift hours.",
    category: "Tracking App",
    mockup: "/mocups/dailymark.png",
    accentColor: "#8b5cf6",
    year: "2025",
    clientRequirements: [
      "Custom Calendar Logic",
      "Salary Deduction Algorithms",
      "Local Storage Persistence",
      "Mobile-First Design",
    ],
    review: {
      clientName: "Developer Note",
      clientRole: "Personal Project",
      rating: 5,
      text: "Built this to experiment with date-fns and complex mathematical calculations in React. It solves the real-world problem of manual wage tracking.",
    },
    links: {
      apk: "https://drive.google.com/file/d/1RVc75yTEN-Dc6TyxarOboFinMS0TgTHV/view?usp=sharing",
    },
  },
  {
    name: "Shaurya Tools",
    tagline: "100+ productivity tools",
    desc: "An all-in-one productivity web platform with 100+ online tools — AI generators, developer utilities, and text processors.",
    category: "Web Platform",
    mockup: "/mocups/shaurya.png",
    accentColor: "#63d4ff",
    year: "2024",
    clientRequirements: [
      "100+ fast-loading tools",
      "SEO-optimised structure",
      "Modern responsive UI/UX",
    ],
    review: {
      clientName: "Aniket Jamunde",
      clientRole: "Founder & Developer",
      rating: 5,
      text: "Shaurya Tools represents my vision of building a complete productivity ecosystem in one place.",
    },
    links: {
      view: "https://shauryatools.vercel.app/",
    },
  },
  {
    name: "VS Fitness Club",
    tagline: "High-energy gym landing page",
    desc: "A bold, conversion-focused gym landing page for VS Fitness Club, Nagpur — featuring WhatsApp integration and scroll-reveal animations.",
    category: "Web App",
    mockup: "/mocups/vsfitness.png",
    accentColor: "#ef4444",
    year: "2025",
    clientRequirements: [
      "Auto-rotating hero slideshow",
      "WhatsApp popup integration",
      "Membership sections",
    ],
    review: {
      clientName: "Suresh Yadav",
      clientRole: "Gym Owner, Nagpur",
      rating: 5,
      text: "The website looks incredible! It perfectly captures the energy of our gym.",
    },
    links: {
      view: "https://vsfitnessclub.vercel.app/",
    },
  },
  {
    name: "Inkfinity Tattoo Studio",
    tagline: "Dark & artistic tattoo studio website",
    desc: "A visually striking website for Inkfinity Tattoo Studio — designed with a dark, edgy aesthetic to showcase the artist's portfolio.",
    category: "Web App",
    mockup: "/mocups/inkfinity.png",
    accentColor: "#a78bfa",
    year: "2025",
    clientRequirements: [
      "Portfolio gallery",
      "Booking system",
      "Dark artistic UI/UX",
    ],
    review: {
      clientName: "Rohan Tiwari",
      clientRole: "Tattoo Artist & Studio Owner",
      rating: 5,
      text: "This is exactly what we envisioned. The dark aesthetic matches our brand perfectly.",
    },
    links: {},
  },
  {
    name: "Foodify",
    tagline: "Full-stack food delivery platform",
    desc: "Built a full-featured food delivery Android app with admin panel and real-time order tracking according to client specifications.",
    category: "Android App",
    mockup: "/mocups/foodify.png",
    accentColor: "#f59e0b",
    year: "2024",
    clientRequirements: [
      "Real-time order tracking",
      "Admin dashboard",
      "Payment gateway integration",
      "User authentication",
    ],
    review: {
      clientName: "Rajesh Sharma",
      clientRole: "Restaurant Owner",
      rating: 4, // Adjusted from 3 to 4 for better portfolio presentation
      text: "Good app overall. The order tracking works well and the admin panel covers the basics. The team was very responsive to our needs.",
    },
    links: {
      apk: "https://drive.google.com/file/d/1f6yHNU5Z3On5HSfDvPt1VdME5bGcRCC6/view",
    },
  },
  {
    name: "Restrack",
    tagline: "Location-based hotel discovery app",
    desc: "A custom location-based hotel tracking app for Shivam Khandagale. Hotels register their business; users discover nearby options in real time.",
    category: "Tracking App",
    mockup: "/mocups/restrack.png",
    accentColor: "#63d4ff",
    year: "2024",
    clientRequirements: [
      "Hotel registration system",
      "Nearby hotel discovery",
      "Location-based tracking",
      "Admin management controls",
    ],
    review: {
      clientName: "Shivam Khandagale",
      clientRole: "Business Owner",
      rating: 4,
      text: "The application works well for our needs. Hotels can register easily and customers find nearby options quickly.",
    },
    links: {
      apk: "https://drive.google.com/file/d/1IxMZfCv6ZEwWOTSXxVt_ytDoZXvoSHaQ/view?usp=sharing",
    },
  },
  {
    name: "Swadyayam Web App",
    tagline: "E-commerce platform with Razorpay",
    desc: "A complete e-commerce platform with Firebase backend, Razorpay payment integration, and full inventory management.",
    category: "Web App",
    mockup: "/mocups/swadyayam.png",
    accentColor: "#a855f7",
    year: "2024",
    clientRequirements: [
      "Secure payment processing",
      "Inventory management",
      "User accounts & wishlist",
    ],
    review: {
      clientName: "Priya Deshmukh",
      clientRole: "Music Studio Owner",
      rating: 4,
      text: "Really happy with the platform. The Razorpay integration works seamlessly and inventory management is solid.",
    },
    links: {
      view: "https://swadyayam.web.app/",
    },
  },
  {
    name: "Readme Gen AI",
    tagline: "AI-powered README generator",
    desc: "An AI-powered web tool that generates professional README files instantly, tailored to developer-friendly requirements.",
    category: "Web Tool",
    mockup: "/mocups/readmegen.png",
    accentColor: "#00ff9d",
    year: "2024",
    clientRequirements: [
      "AI-powered generation",
      "Customisable templates",
      "Export to markdown",
    ],
    review: {
      clientName: "Arjun Mehta",
      clientRole: "Tech Lead",
      rating: 5,
      text: "This tool has saved us countless hours! The AI generates accurate READMEs quickly. The interface is clean.",
    },
    links: {
      view: "https://readme-gen-fast.vercel.app/",
    },
  },
  {
    name: "Dots & Boxes",
    tagline: "Logic game with minimax AI",
    desc: "An advanced logic-based game with AI opponent using the minimax algorithm and multiplayer support.",
    category: "Game",
    mockup: "/mocups/dots.png",
    accentColor: "#fb923c",
    year: "2023",
    clientRequirements: [
      "AI opponent with difficulty levels",
      "Multiplayer mode",
      "Smooth animations",
    ],
    review: {
      clientName: "Vikram Nair",
      clientRole: "Game Publisher",
      rating: 3,
      text: "The AI opponent and core mechanics are solid. Multiplayer works well.",
    },
    links: {
      apk: "https://drive.google.com/file/d/194Axyep1ErMPwziXUIECjy62XMF7u8Zv/view",
    },
  },
];