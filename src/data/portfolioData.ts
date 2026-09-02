import { Project, Service, ExperienceItem, TechSkill } from '../types';

export const HERO_DATA = {
  nameSans: "Gautam",
  nameSerif: "Prasad.",
  tagline: "Full-Stack Developer, bringing ideas to life, through code, detail and precision.",
  version: "V3.0",
  location: "Mumbai, Maharashtra, India",
  phone: "+91-8451977159",
  availability: "Available for full-time & high-impact projects",
  email: "gautamprasad24022004@gmail.com",
  portfolioUrl: "https://gautamprasad.dev",
  socials: [
    { name: "LINKEDIN", url: "https://www.linkedin.com/in/gautam-prasad-7b8b55216/" },
    { name: "GITHUB", url: "https://github.com/Gautamprasad24" },
    { name: "PORTFOLIO", url: "#" },
  ]
};

export const MANIFESTO_TEXT = {
  tag: "About",
  headline: "As a full-stack developer, I craft tailor-made web experiences, blending technical precision and emotion.",
  bio: "My name is Gautam. A passionate full-stack developer and computer science graduate based in Mumbai, I build scalable digital experiences, always seeking the symbiosis between engineering, performance, and seamless user interaction.",
  subtext: "Skilled in the MERN stack, Next.js, and modern cloud integrations. With a track record of delivering client-facing business websites, high-speed admin portals, payment gateways (CCAvenue), and logistics pipelines (Shiprocket).",
  stats: [
    { value: "08+", label: "Production Websites" },
    { value: "8.3", label: "B.Sc. IT CGPA" },
    { value: "100%", label: "Responsive & SEO Ready" },
    { value: "<1s", label: "Optimized Performance" },
  ]
};

export const PROJECTS: Project[] = [
  {
    id: "n-gandhi-group",
    number: "01",
    title: "N Gandhi Group",
    subtitle: "Corporate Enterprise Architecture & Showcase",
    category: "Corporate & Enterprise",
    year: "2025",
    role: "Full-Stack Web Developer",
    client: "NG & Gandhi Enterprises",
    description: "A responsive corporate web portal for NG & Gandhi Enterprises featuring structured layouts showcasing company services, intuitive multi-tier navigation, consistent branding, and cross-device accessibility with modern interactive elements.",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop",
    secondaryImages: [
      "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1000&auto=format&fit=crop"
    ],
    tags: ["Next.js", "React.js", "Tailwind CSS", "SEO Optimization"],
    link: "https://ngandhi.com",
    featured: true,
    accentColor: "#ff2a3b"
  },
  {
    id: "vidyatrade",
    number: "02",
    title: "VidyaTrade",
    subtitle: "High-Performance E-Commerce & Business Platform",
    category: "E-Commerce & Platform",
    year: "2025",
    role: "Lead Frontend Developer",
    client: "VidyaTrade International",
    description: "Built with React 19 and Vite, featuring smooth UI micro-animations via Framer Motion, an interactive Swiper.js content slider, fully responsive Tailwind CSS interface, client-side routing, and a serverless contact pipeline via EmailJS.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop",
    secondaryImages: [
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1000&auto=format&fit=crop"
    ],
    tags: ["React 19", "Vite", "Framer Motion", "Swiper.js", "EmailJS"],
    link: "https://www.vidyatrade.com",
    featured: true,
    accentColor: "#ff4d5a"
  },
  {
    id: "rw-sawant",
    number: "03",
    title: "RW Sawant Developer",
    subtitle: "Real Estate Portal with Dynamic Filtering",
    category: "Real Estate & Web App",
    year: "2025",
    role: "Full-Stack Developer",
    client: "RW Sawant Group (20+ Years Legacy)",
    description: "A full-stack corporate real estate platform for a premier Mumbai firm. Engineered dynamic property filtering algorithms, interactive lead inquiry forms, and production deployment with high-fidelity mobile responsiveness.",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop",
    secondaryImages: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1000&auto=format&fit=crop"
    ],
    tags: ["MERN Stack", "PHP/MySQL", "Tailwind CSS", "Lead Management"],
    link: "https://www.rwsawantgroup.com",
    featured: true,
    accentColor: "#e11d48"
  },
  {
    id: "naepl",
    number: "04",
    title: "NAEPL Corporate",
    subtitle: "Mobile-First Infrastructure & Service Hub",
    category: "Corporate & Next.js",
    year: "2025",
    role: "Web Developer",
    client: "NAEPL Engineering",
    description: "A mobile-first corporate web platform using Next.js and Tailwind CSS with modular reusable components, SEO-optimized semantic markup, next-gen image compression, and interactive service showcases.",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1200&auto=format&fit=crop",
    tags: ["Next.js", "React.js", "Tailwind CSS", "SEO Architecture"],
    link: "https://naepl.r5advertising.com",
    featured: true,
    accentColor: "#f43f5e"
  },
  {
    id: "namtpl",
    number: "05",
    title: "NAMTPL Industrial",
    subtitle: "Scalable Corporate Engine & Image Galleries",
    category: "Corporate & Next.js",
    year: "2025",
    role: "Web Developer",
    client: "NAMTPL Ltd",
    description: "Responsive corporate website engineered with reusable UI components, multi-category image galleries, and interactive service directories. Optimized performance through efficient component architecture.",
    image: "https://images.unsplash.com/photo-1504384764586-bb4cdc1707b0?q=80&w=1200&auto=format&fit=crop",
    tags: ["Next.js", "Tailwind CSS", "Performance SEO", "UI/UX"],
    link: "https://namtpl.r5advertising.com",
    featured: false,
    accentColor: "#e11d48"
  },
  {
    id: "ngc-co",
    number: "06",
    title: "NGC & Co",
    subtitle: "Scalable Financial & Corporate Advisory Portal",
    category: "Corporate & Enterprise",
    year: "2025",
    role: "Full-Stack Developer",
    client: "NGC & Co",
    description: "Scalable corporate website with modern styling, cross-browser compatibility, and intuitive navigation built using Next.js, React.js, and Tailwind CSS.",
    image: "https://images.unsplash.com/photo-1450133064473-71024230f91b?q=80&w=1200&auto=format&fit=crop",
    tags: ["Next.js", "React.js", "Tailwind CSS", "Cross-Browser"],
    link: "https://ngcco.r5advertising.com",
    featured: false,
    accentColor: "#be123c"
  },
  {
    id: "safety-projects",
    number: "07",
    title: "Safety Projects Pvt Ltd",
    subtitle: "Industrial Certifications & Products Showcase",
    category: "Corporate & Next.js",
    year: "2025",
    role: "Next.js Developer",
    client: "Safety Projects Pvt Ltd",
    description: "Mobile-first corporate website featuring interactive product catalogs, company profile, and safety certifications with optimized routing and SEO structures.",
    image: "https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?q=80&w=1200&auto=format&fit=crop",
    tags: ["Next.js", "Product Catalog", "Image Optimization", "SEO"],
    link: "https://safetyprojects.co.in",
    featured: false,
    accentColor: "#9f1239"
  },
  {
    id: "ramanand-tempo",
    number: "08",
    title: "Ramanand Tempo Service",
    subtitle: "Logistics Fleet & Real-Time Booking Enquiries",
    category: "Logistics & Business",
    year: "2025",
    role: "Web Developer",
    client: "Ramanand Logistics",
    description: "Responsive logistics website with structured fleet catalogues, customer testimonials, and direct customer enquiries integrated seamlessly with EmailJS.",
    image: "https://images.unsplash.com/photo-1519003722824-194d4455a60c?q=80&w=1200&auto=format&fit=crop",
    tags: ["React.js", "Next.js", "Tailwind CSS", "EmailJS"],
    link: "https://ramanandtempo.com",
    featured: false,
    accentColor: "#881337"
  },
  {
    id: "tadoba-jungle",
    number: "09",
    title: "Tadoba Jungle Bucketlist",
    subtitle: "Wildlife Tourism & Interactive Safari Booking Experience",
    category: "Travel & Tourism",
    year: "2024",
    role: "Frontend Developer",
    client: "Web Techneeq Client",
    description: "Designed and built the Tadoba Jungle Bucketlist website using HTML5, CSS3, and JavaScript, boosting user engagement by 30% with an immersive wildlife travel interface.",
    image: "https://images.unsplash.com/photo-1534177616072-ef7dc120449d?q=80&w=1200&auto=format&fit=crop",
    tags: ["HTML5", "CSS3", "JavaScript", "UI/UX Design"],
    featured: false,
    accentColor: "#ff4d5a"
  },
  {
    id: "khareja",
    number: "10",
    title: "Khareja Publishing Hub",
    subtitle: "Dynamic MERN Stack Blog & Content Management",
    category: "Full-Stack MERN",
    year: "2024",
    role: "Full-Stack Contributor",
    client: "Khareja Digital",
    description: "Engineered and maintained dynamic blog publishing features, RESTful API endpoints, and MongoDB schemas on the full-stack MERN platform.",
    image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=1200&auto=format&fit=crop",
    tags: ["MERN Stack", "MongoDB", "Express.js", "REST APIs"],
    featured: false,
    accentColor: "#e11d48"
  }
];

export const GALLERY_CARDS = [
  {
    id: "g1",
    title: "VidyaTrade E-Commerce",
    tag: "01 2025",
    device: "laptop-pedestal",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop",
    setup: "White Sculptural Pedestal",
    initialPos: { x: -38, y: 110, scale: 0.85, rot: -8, z: 10 }
  },
  {
    id: "g2",
    title: "N Gandhi Group",
    tag: "06 2025",
    device: "laptop-chair",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop",
    setup: "Warm Studio Chair",
    initialPos: { x: 38, y: 130, scale: 0.9, rot: 6, z: 15 }
  },
  {
    id: "g3",
    title: "CyberDiag Web App",
    tag: "09 2025",
    device: "laptop-desk",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800&auto=format&fit=crop",
    setup: "Concrete Minimalist Desk",
    initialPos: { x: -44, y: 70, scale: 0.8, rot: 10, z: 5 }
  },
  {
    id: "g4",
    title: "Real-time Stock Heatmap",
    tag: "11 2025",
    device: "laptop-rock",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop",
    setup: "Obsidian Rock & Neon Violet",
    initialPos: { x: 42, y: 60, scale: 0.88, rot: -6, z: 12 }
  },
  {
    id: "g5",
    title: "RW Sawant Developer",
    tag: "02 2026",
    device: "studio-display",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop",
    setup: "Aluminum Studio Display",
    initialPos: { x: -48, y: 10, scale: 0.85, rot: -4, z: 20 }
  },
  {
    id: "g6",
    title: "NAEPL Engineering",
    tag: "03 2026",
    device: "laptop-sofa",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800&auto=format&fit=crop",
    setup: "Cobalt Studio Stage",
    initialPos: { x: 44, y: 15, scale: 0.92, rot: 8, z: 18 }
  },
  {
    id: "g7",
    title: "NAMTPL Marine Portal",
    tag: "04 2026",
    device: "desktop-monitor",
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800&auto=format&fit=crop",
    setup: "Architectural Concrete Display",
    initialPos: { x: -35, y: -45, scale: 0.82, rot: 5, z: 8 }
  },
  {
    id: "g8",
    title: "Tadoba Safari UI",
    tag: "11 2024",
    device: "tablet-screen",
    image: "https://images.unsplash.com/photo-1534177616072-ef7dc120449d?q=80&w=800&auto=format&fit=crop",
    setup: "Vertical Slate Easel",
    initialPos: { x: 40, y: -40, scale: 0.8, rot: -7, z: 14 }
  },
  {
    id: "g9",
    title: "Safety Projects Catalog",
    tag: "12 2025",
    device: "laptop-pedestal",
    image: "https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?q=80&w=800&auto=format&fit=crop",
    setup: "Floating Prismatic Stage",
    initialPos: { x: -10, y: 125, scale: 0.85, rot: 3, z: 16 }
  },
  {
    id: "g10",
    title: "Ramanand Tempo Service",
    tag: "01 2026",
    device: "laptop-rock",
    image: "https://images.unsplash.com/photo-1519003722824-194d4455a60c?q=80&w=800&auto=format&fit=crop",
    setup: "Metallic Minimal Rig",
    initialPos: { x: 12, y: -50, scale: 0.86, rot: -4, z: 22 }
  }
];

export const SKILL_ACCORDIONS = [
  {
    id: "frontend",
    title: "Frontend",
    skills: ["HTML5", "CSS3", "JavaScript (ES6+)", "TypeScript", "React.js", "Next.js", "Tailwind CSS", "Framer Motion", "Swiper.js", "React Router DOM", "Bootstrap"]
  },
  {
    id: "backend",
    title: "Backend & APIs",
    skills: ["Node.js", "Express.js", "PHP", "RESTful APIs", "Serverless Architecture", "EmailJS Integration"]
  },
  {
    id: "databases",
    title: "Databases",
    skills: ["MongoDB", "MySQL", "Mongoose ORM", "Relational Schema Design"]
  },
  {
    id: "integrations",
    title: "Integrations & Tools",
    skills: ["CCAvenue Payment Gateway", "Shiprocket Logistics API", "Admin Panel Development", "Stock Market Heatmaps", "Git / GitHub", "Vite", "SEO Optimization"]
  },
  {
    id: "education",
    title: "Education & Qualifications",
    skills: [
      "B.Sc. in Information Technology — Mumbai University (CGPA: 8.3 | 2022–2025)",
      "Diploma in Software Programming — Pride Computers (2023–2025)",
      "Core Concepts: Computer Networks, Responsive Design, High-Performance Web"
    ]
  }
];

export const EXPERIENCE_TIMELINE: ExperienceItem[] = [
  {
    year: "Dec 2025 – Present",
    role: "Web Developer",
    company: "R5 Advertising",
    location: "Mumbai, India",
    description: "Delivering responsive websites, dynamic features (Priyal Group, RW Sawant Developer, Pixstox, SPPL), CCAvenue payment gateway, Shiprocket logistics integrations, admin panels, and real-time stock market heatmaps using MERN, PHP/MySQL, Next.js."
  },
  {
    year: "Oct 2024 – Sep 2025",
    role: "Web Developer",
    company: "Web Techneeq",
    location: "Mumbai, India",
    description: "Developed and maintained full-stack applications with MERN stack, built Tadoba Jungle Bucketlist, contributed to Khareja content engine, boosting user engagement by 30% with mobile-first designs and RESTful APIs."
  },
  {
    year: "2022 – 2025",
    role: "B.Sc. in Information Technology (CGPA: 8.3)",
    company: "Abhinav College (Mumbai University)",
    location: "Maharashtra, India",
    description: "Graduated with 8.3 CGPA in Science and Technology (B.Sc. IT). Specialized in software engineering, database management, web development, and computer networks."
  },
  {
    year: "2023 – 2025",
    role: "Diploma in Software Programming",
    company: "Pride Computers",
    location: "Mumbai, India",
    description: "Advanced certification in full-stack architecture, algorithms, database optimization, and modern application development."
  }
];

export const SERVICES: Service[] = [
  {
    id: "fullstack-dev",
    number: "01",
    title: "Full-Stack Development",
    tagline: "Scalable MERN, Next.js, and PHP/MySQL applications.",
    description: "Architecting end-to-end web applications with performant React/Next.js frontends, resilient Node/Express/PHP backends, and optimized MongoDB/MySQL data layers.",
    deliverables: ["Full-Stack MERN Architecture", "Next.js SSR/SSG Applications", "RESTful API Integration", "Admin Panels & Lead Dashboards"],
    tools: ["React.js", "Next.js", "Node.js", "Express.js", "MongoDB", "MySQL", "PHP", "Tailwind CSS"]
  },
  {
    id: "fintech-logistics",
    number: "02",
    title: "Gateways & Integrations",
    tagline: "Secure payment gateways, logistics APIs, and live trackers.",
    description: "Specialized in seamless third-party integrations including CCAvenue payment gateways, Shiprocket logistics automation, EmailJS enquiry systems, and live stock market data heatmaps.",
    deliverables: ["CCAvenue Payment Workflows", "Shiprocket Order Tracking", "Interactive Data Heatmaps", "EmailJS Form Workflows"],
    tools: ["CCAvenue", "Shiprocket", "REST APIs", "Framer Motion", "Swiper.js"]
  },
  {
    id: "performance-seo",
    number: "03",
    title: "Frontend & SEO Performance",
    tagline: "High-speed, responsive, search-optimized interfaces.",
    description: "Designing mobile-first, pixel-perfect user interfaces with lightning-fast load times, semantic HTML5, robust accessibility, and technical SEO structure to boost customer conversion.",
    deliverables: ["Mobile-First Responsive Design", "Technical SEO & Schema", "Framer Motion Micro-Interactions", "Cross-Browser Compatibility"],
    tools: ["Tailwind CSS", "Vite", "Framer Motion", "HTML5/CSS3", "JavaScript ES6+"]
  }
];

export const TECH_SKILLS: TechSkill[] = [
  { name: "React.js & Next.js", category: "core", highlight: true },
  { name: "Node.js & Express.js", category: "core", highlight: true },
  { name: "MongoDB & MySQL", category: "core", highlight: true },
  { name: "JavaScript & TypeScript", category: "core", highlight: true },
  { name: "Tailwind CSS", category: "core", highlight: true },
  { name: "CCAvenue & Shiprocket", category: "tools", highlight: true },
  { name: "PHP & REST APIs", category: "core" },
  { name: "Framer Motion & Swiper.js", category: "creative", highlight: true },
  { name: "Vite & Webpack", category: "tools" },
  { name: "SEO Optimization", category: "tools" },
  { name: "Admin Panel Engineering", category: "core" },
  { name: "EmailJS & Contact Forms", category: "tools" },
];

export const PHILOSOPHY_PILLARS = [
  {
    index: "01",
    title: "Scalable Full-Stack Engineering",
    text: "Building robust MERN and Next.js applications engineered with clean code, secure RESTful APIs, and scalable MongoDB/MySQL schemas."
  },
  {
    index: "02",
    title: "Technical Precision & Integrations",
    text: "Seamless end-to-end integration of CCAvenue payment gateways, Shiprocket logistics automation, and high-frequency real-time stock heatmaps."
  },
  {
    index: "03",
    title: "High Performance & SEO",
    text: "Crafting blazing fast, responsive frontends using Tailwind CSS, Framer Motion, and semantic structures optimized for search engines."
  }
];
