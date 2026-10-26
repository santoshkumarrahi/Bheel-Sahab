import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '../data');
const DB_FILE = path.join(DATA_DIR, 'database.json');
const UPLOADS_DIR = path.join(__dirname, '../public/uploads');

// Ensure directories exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

export interface User {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  name: string;
  role: 'admin' | 'editor';
  createdAt: string;
}

export interface SiteSettings {
  name: string;
  title: string;
  bio: string;
  shortBio: string;
  philosophy: string;
  devApproach: string;
  yearsExperience: string;
  completedProjects: string;
  clientSatisfaction: string;
  currentAvailability: string;
  resumeUrl: string;
  contactEmail: string;
  contactPhone: string;
  whatsappNumber: string;
  location: string;
  accentColor: string;
  heroHeadline: string;
  heroSubtext: string;
  roles: string[];
  profileImage: string;
  socialLinks: {
    github: string;
    linkedin: string;
    behance: string;
    dribbble: string;
    instagram: string;
    twitter: string;
    whatsapp: string;
    email: string;
  };
  meetingSettings: {
    workingDays: string[]; // e.g. ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
    startHour: number; // 9
    endHour: number; // 18
    meetingDurationOptions: number[]; // [15, 30, 60]
    bufferMinutes: number; // 15
    googleMeetEnabled: boolean;
    whatsappCallEnabled: boolean;
    customMeetingUrl: string;
  };
}

export interface Service {
  id: string;
  category: 'Graphic Design' | 'Frontend Development' | 'Backend Development' | 'Full-Stack Development';
  title: string;
  slug: string;
  iconName: string;
  shortDesc: string;
  features: string[];
  startingPrice: string;
  deliveryTime: string;
  orderIndex: number;
  published: boolean;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  category: 'Graphic Design' | 'Branding and Logos' | 'Social Media Design' | 'UI/UX Design' | 'Frontend Development' | 'Backend Development' | 'Full-Stack Websites';
  coverImage: string;
  gallery: string[];
  beforeAfter?: {
    beforeImage: string;
    afterImage: string;
    beforeLabel: string;
    afterLabel: string;
  };
  description: string;
  technologies: string[];
  date: string;
  client: string;
  liveUrl?: string;
  githubUrl?: string;
  caseStudy: {
    overview: string;
    challenge: string;
    solution: string;
    results: string;
  };
  featured: boolean;
  published: boolean;
  orderIndex: number;
}

export interface Skill {
  id: string;
  category: 'Design' | 'Frontend' | 'Backend' | 'Workflow & Tools';
  name: string;
  level: string; // e.g. "Expert", "Advanced", "Proficient"
  percentage: number; // e.g. 95
  experienceYears: string;
  iconName: string;
  orderIndex: number;
  published: boolean;
}

export interface WorkStep {
  id: string;
  stepNumber: number;
  title: string;
  description: string;
  iconName: string;
  orderIndex: number;
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string;
  type: 'experience' | 'education' | 'certification';
  skills: string[];
  orderIndex: number;
}

export interface Testimonial {
  id: string;
  clientName: string;
  clientRole: string;
  company: string;
  avatarUrl: string;
  content: string;
  rating: number;
  projectType: string;
  published: boolean;
  orderIndex: number;
}

export interface ContactInquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  service: string;
  budget?: string;
  deadline?: string;
  message: string;
  attachmentUrl?: string;
  status: 'new' | 'read' | 'replied' | 'archived';
  createdAt: string;
}

export interface MeetingBooking {
  id: string;
  clientName: string;
  clientEmail: string;
  meetingType: string;
  date: string; // YYYY-MM-DD
  timeSlot: string; // e.g. "14:00"
  durationMinutes: number;
  communicationMethod: 'Google Meet' | 'WhatsApp' | 'Custom Link';
  meetingUrl: string;
  projectDetails: string;
  status: 'confirmed' | 'rescheduled' | 'cancelled';
  createdAt: string;
}

export interface MediaAsset {
  id: string;
  filename: string;
  url: string;
  altText: string;
  caption?: string;
  fileType: string;
  fileSize: number;
  uploadedAt: string;
}

export interface AuditLog {
  id: string;
  action: string;
  details: string;
  username: string;
  timestamp: string;
}

export interface DatabaseSchema {
  users: User[];
  settings: SiteSettings;
  services: Service[];
  projects: Project[];
  skills: Skill[];
  workSteps: WorkStep[];
  experience: ExperienceItem[];
  testimonials: Testimonial[];
  inquiries: ContactInquiry[];
  bookings: MeetingBooking[];
  media: MediaAsset[];
  auditLogs: AuditLog[];
}

function getInitialDatabase(): DatabaseSchema {
  // Salt and hash default password "admin12345" or from env
  const defaultSalt = bcrypt.genSaltSync(10);
  const defaultHash = bcrypt.hashSync(process.env.ADMIN_DEFAULT_PASSWORD || 'admin12345', defaultSalt);

  return {
    users: [
      {
        id: 'usr_santosh_admin',
        username: 'admin',
        email: process.env.ADMIN_EMAIL || 'rahisantoshkumar843@gmail.com',
        passwordHash: defaultHash,
        name: 'Santosh Kumar Bheel',
        role: 'admin',
        createdAt: new Date().toISOString(),
      },
    ],
    settings: {
      name: 'Santosh Kumar Bheel',
      title: 'Graphic Designer | Frontend Developer | Backend Developer',
      bio: "I am a multi-disciplinary designer and full-stack software engineer with an obsession for refined visual balance, robust systems architecture, and fluid digital experiences. From brand identities and design systems to high-concurrency Node.js microservices and pixel-precise React applications, I translate ambitious concepts into reliable, production-ready software.",
      shortBio: "Combining creative visual craftsmanship with robust full-stack engineering to build high-impact digital experiences.",
      philosophy: "Design is not superficial decoration; it is functional clarity, intent, and respectful communication with the user. Every curve, typographic pairing, and spacing decision should serve the product's ultimate purpose.",
      devApproach: "Strongly typed architecture, scalable component structures, zero-fluff performance, and security by design. I craft code that teams can maintain and users love to experience.",
      yearsExperience: '6+',
      completedProjects: '45+',
      clientSatisfaction: '99%',
      currentAvailability: 'Available for Selected Contracts & Projects',
      resumeUrl: '/Santosh_Kumar_Bheel_Resume.pdf',
      contactEmail: 'rahisantoshkumar843@gmail.com',
      contactPhone: '+92 300 0000000',
      whatsappNumber: '923000000000',
      location: 'Karachi, PK / Remote Worldwide',
      accentColor: '#f59e0b',
      heroHeadline: 'Designing Digital Experiences. Building Powerful Websites.',
      heroSubtext: "I'm Santosh Kumar Bheel, a graphic designer and full-stack web developer who combines creative design with practical development to build meaningful digital experiences for businesses and individuals.",
      roles: [
        'Graphic Designer',
        'Frontend Developer',
        'Backend Developer',
        'UI/UX Craftsman',
        'Full-Stack Engineer',
      ],
      profileImage: '/assets/aistudio/Santosh_Profile_Image_814470b2.png',
      socialLinks: {
        github: 'https://github.com/santoshkumarbheel',
        linkedin: 'https://linkedin.com/in/santoshkumarbheel',
        behance: 'https://behance.net/santoshkumarbheel',
        dribbble: 'https://dribbble.com/santoshkumarbheel',
        instagram: 'https://instagram.com/santoshkumarbheel',
        twitter: 'https://twitter.com/santosh_bheel',
        whatsapp: 'https://wa.me/923000000000',
        email: 'mailto:rahisantoshkumar843@gmail.com',
      },
      meetingSettings: {
        workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        startHour: 9,
        endHour: 18,
        meetingDurationOptions: [15, 30, 60],
        bufferMinutes: 15,
        googleMeetEnabled: true,
        whatsappCallEnabled: true,
        customMeetingUrl: 'https://meet.google.com/new',
      },
    },
    services: [
      {
        id: 'srv_1',
        category: 'Graphic Design',
        title: 'Brand Identity & Visual Design',
        slug: 'brand-identity',
        iconName: 'Palette',
        shortDesc: 'End-to-end visual identity systems, vector logos, brand manuals, and marketing collateral.',
        features: [
          'Brand identity & logo design',
          'Social media creatives & ad suites',
          'Marketing banners, flyers & posters',
          'Business cards & brand style guidelines',
          'UI design & high-resolution vector assets',
        ],
        startingPrice: '$450',
        deliveryTime: '4–7 Days',
        orderIndex: 1,
        published: true,
      },
      {
        id: 'srv_2',
        category: 'Frontend Development',
        title: 'High-Performance Frontend Systems',
        slug: 'frontend-development',
        iconName: 'Layout',
        shortDesc: 'Responsive, accessible, fluid web applications built with modern React, TypeScript, and motion graphics.',
        features: [
          'Responsive website development',
          'High-converting landing pages',
          'Interactive user interfaces with React',
          'Fluid micro-interactions & animations',
          'WCAG AA accessibility & core web vitals optimization',
        ],
        startingPrice: '$800',
        deliveryTime: '1–2 Weeks',
        orderIndex: 2,
        published: true,
      },
      {
        id: 'srv_3',
        category: 'Backend Development',
        title: 'Robust REST APIs & Server Architectures',
        slug: 'backend-development',
        iconName: 'Server',
        shortDesc: 'Secure, scalable server-side systems, relational databases, authentication engines, and administrative backbones.',
        features: [
          'RESTful API architecture & documentation',
          'Database modeling & relational design',
          'JWT, OAuth & Role-Based Access Control (RBAC)',
          'Admin dashboard backend services',
          'Third-party APIs & payment gateway hooks',
        ],
        startingPrice: '$950',
        deliveryTime: '1–3 Weeks',
        orderIndex: 3,
        published: true,
      },
      {
        id: 'srv_4',
        category: 'Full-Stack Development',
        title: 'Complete Custom Web Applications',
        slug: 'fullstack-development',
        iconName: 'Layers',
        shortDesc: 'From visual blueprint to production deployment: comprehensive, turnkey platforms tailored to business objectives.',
        features: [
          'Full-cycle architecture (Design to Production)',
          'Frontend and backend seamless integration',
          'Custom business portals & CMS engines',
          'Portfolio websites & client booking portals',
          'Deployment, monitoring & ongoing maintenance',
        ],
        startingPrice: '$1,600',
        deliveryTime: '2–4 Weeks',
        orderIndex: 4,
        published: true,
      },
    ],
    projects: [
      {
        id: 'proj_1',
        title: 'Lumina Creative Studio',
        slug: 'lumina-creative-studio',
        category: 'Full-Stack Websites',
        coverImage: '/assets/projects/lumina_cover.svg',
        gallery: [
          '/assets/projects/lumina_cover.svg',
          '/assets/projects/lumina_gallery_1.svg',
          '/assets/projects/lumina_gallery_2.svg',
        ],
        beforeAfter: {
          beforeImage: '/assets/projects/comparison_legacy.svg',
          afterImage: '/assets/projects/comparison_modern.svg',
          beforeLabel: 'Legacy 2021 Identity',
          afterLabel: 'Santosh 2026 Redesign',
        },
        description: 'A bespoke brand identity and dynamic agency platform engineered with React, Tailwind, and an administrative booking system.',
        technologies: ['React 19', 'TypeScript', 'Tailwind CSS', 'Node.js', 'Express', 'Motion'],
        date: '2026',
        client: 'Lumina Media Group',
        liveUrl: 'https://lumina-studio-demo.com',
        githubUrl: 'https://github.com/santoshkumarbheel/lumina-studio',
        caseStudy: {
          overview: 'Lumina sought a transformative digital presence capable of showcasing high-end commercial visual art while capturing inbound enterprise client inquiries seamlessly.',
          challenge: 'The existing platform suffered from sluggish image render cycles, lack of mobile responsiveness, and high bounce rates on inquiry submissions.',
          solution: 'Architected an editorial masonry portfolio with lightweight lazy-loading, custom interactive cursor dynamics, and a frictionless booking workflow.',
          results: '140% boost in mobile engagement time, 42% increase in qualified consultation bookings, and sub-second Lighthouse scores.',
        },
        featured: true,
        published: true,
        orderIndex: 1,
      },
      {
        id: 'proj_2',
        title: 'Apex Financial Data Core',
        slug: 'apex-financial-core',
        category: 'Backend Development',
        coverImage: '/assets/projects/apex_cover.svg',
        gallery: [
          '/assets/projects/apex_cover.svg',
          '/assets/projects/apex_gallery_1.svg',
        ],
        description: 'Scalable REST API gateway handling real-time telemetry, transaction auditing, and JWT-authenticated administrative dashboards.',
        technologies: ['Node.js', 'Express', 'PostgreSQL', 'JWT', 'REST API', 'Redis'],
        date: '2025',
        client: 'Apex Capital Partners',
        liveUrl: 'https://apex-core-demo.com',
        githubUrl: 'https://github.com/santoshkumarbheel/apex-financial-core',
        caseStudy: {
          overview: 'Mission-critical transactional service handling multi-tenant account records and reconciliation feeds.',
          challenge: 'Needed strict RBAC access controls, low latency under concurrent query loads, and audit-compliant log traces.',
          solution: 'Implemented indexed relational schemas, bcrypt-secured token sessions, rate-limited endpoints, and automated data backups.',
          results: 'Zero downtime during stress trials of 15,000 req/min and total visibility across all system interactions.',
        },
        featured: true,
        published: true,
        orderIndex: 2,
      },
      {
        id: 'proj_3',
        title: 'Aura Organic Botanical Identity',
        slug: 'aura-botanicals-brand',
        category: 'Branding and Logos',
        coverImage: '/assets/projects/aura_cover.svg',
        gallery: [
          '/assets/projects/aura_cover.svg',
          '/assets/projects/aura_gallery_1.svg',
        ],
        beforeAfter: {
          beforeImage: '/assets/projects/aura_before.svg',
          afterImage: '/assets/projects/aura_after.svg',
          beforeLabel: 'Initial Concept',
          afterLabel: 'Refined Brand System',
        },
        description: 'Complete brand guidelines, custom serif logomark, sustainable packaging mockups, and vector stationery.',
        technologies: ['Adobe Illustrator', 'Photoshop', 'Figma', 'Brand Guidelines', 'Typography'],
        date: '2025',
        client: 'Aura Botanicals Ltd.',
        liveUrl: 'https://aurabotanicals.com',
        caseStudy: {
          overview: 'Luxury skincare startup requiring an authentic, earthy yet refined aesthetic to command premium shelf space.',
          challenge: 'Differentiating from oversaturated minimalist pastel tropes without sacrificing readability on compact cosmetic bottles.',
          solution: 'Created an organic custom serif monogram paired with deep forest tones and warm gold foil guidelines.',
          results: 'Featured in Dieline editorial and secured nationwide luxury retail distribution in first quarter.',
        },
        featured: true,
        published: true,
        orderIndex: 3,
      },
      {
        id: 'proj_4',
        title: 'Horizon Cloud Dashboard',
        slug: 'horizon-cloud-ui',
        category: 'Frontend Development',
        coverImage: '/assets/projects/horizon_cover.svg',
        gallery: ['/assets/projects/horizon_cover.svg'],
        description: 'High-density developer dashboard featuring custom SVG telemetry charts, dark-mode ergonomics, and keyboard command palettes.',
        technologies: ['React 19', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'WebSockets'],
        date: '2025',
        client: 'Horizon Systems',
        liveUrl: 'https://horizon-cloud.io',
        githubUrl: 'https://github.com/santoshkumarbheel/horizon-dashboard',
        caseStudy: {
          overview: 'Complex multi-cluster node monitor designed for DevOps engineers needing rapid incident assessment.',
          challenge: 'Displaying 50+ real-time node states without cognitive overload or browser thread stutter.',
          solution: 'Built virtualized data tables, zero-pill clean typographic status indicators, and keyboard shortcut navigation.',
          results: 'Reduced average incident triage time by 34% among beta engineering teams.',
        },
        featured: true,
        published: true,
        orderIndex: 4,
      },
      {
        id: 'proj_5',
        title: 'Velox Kinetic Brand Campaign',
        slug: 'velox-kinetic-social',
        category: 'Social Media Design',
        coverImage: '/assets/projects/velox_cover.svg',
        gallery: ['/assets/projects/velox_cover.svg'],
        description: 'High-impact motion graphics, animated social promo kits, and high-conversion Instagram and LinkedIn carousels.',
        technologies: ['Adobe After Effects', 'Photoshop', 'Illustrator', 'Motion Design'],
        date: '2025',
        client: 'Velox Athletics',
        liveUrl: 'https://behance.net/gallery/velox-campaign',
        caseStudy: {
          overview: 'Global product launch campaign for next-generation performance footwear.',
          challenge: 'Generating viral thumb-stopping retention across mobile feeds with short attention spans.',
          solution: 'Produced 12 modular dynamic motion reels, typographic transition kits, and story templates.',
          results: '3.2M impressions across social platforms with a 4.8% organic click-through rate.',
        },
        featured: false,
        published: true,
        orderIndex: 5,
      },
      {
        id: 'proj_6',
        title: 'Veritas Telehealth Portal',
        slug: 'veritas-telehealth',
        category: 'Full-Stack Websites',
        coverImage: '/assets/projects/veritas_cover.svg',
        gallery: ['/assets/projects/veritas_cover.svg'],
        description: 'HIPAA-compliant client intake, secure calendar booking, and interactive video consultation room integration.',
        technologies: ['React', 'Node.js', 'Express', 'WebRTC', 'PostgreSQL', 'Tailwind CSS'],
        date: '2024',
        client: 'Veritas Medical Network',
        liveUrl: 'https://veritas-telehealth.org',
        caseStudy: {
          overview: 'Private patient consultation system enabling doctors and specialists to run video appointments securely.',
          challenge: 'Balancing stringent data confidentiality with non-technical patient usability across all age groups.',
          solution: 'Engineered a one-click passwordless appointment flow, instant video room generator, and encrypted notes.',
          results: 'Over 12,000 successful sessions completed with 99.4% positive patient feedback.',
        },
        featured: false,
        published: true,
        orderIndex: 6,
      },
    ],
    skills: [
      {
        id: 'sk_1',
        category: 'Design',
        name: 'Figma & UI Prototyping',
        level: 'Expert',
        percentage: 95,
        experienceYears: '6 yrs',
        iconName: 'Figma',
        orderIndex: 1,
        published: true,
      },
      {
        id: 'sk_2',
        category: 'Design',
        name: 'Adobe Photoshop',
        level: 'Expert',
        percentage: 94,
        experienceYears: '6 yrs',
        iconName: 'Image',
        orderIndex: 2,
        published: true,
      },
      {
        id: 'sk_3',
        category: 'Design',
        name: 'Adobe Illustrator',
        level: 'Expert',
        percentage: 92,
        experienceYears: '5 yrs',
        iconName: 'PenTool',
        orderIndex: 3,
        published: true,
      },
      {
        id: 'sk_4',
        category: 'Design',
        name: 'Brand Systems & Guidelines',
        level: 'Expert',
        percentage: 90,
        experienceYears: '5 yrs',
        iconName: 'BookOpen',
        orderIndex: 4,
        published: true,
      },
      {
        id: 'sk_5',
        category: 'Frontend',
        name: 'React 19 & Next.js Ecosystem',
        level: 'Expert',
        percentage: 96,
        experienceYears: '5 yrs',
        iconName: 'Code',
        orderIndex: 5,
        published: true,
      },
      {
        id: 'sk_6',
        category: 'Frontend',
        name: 'TypeScript & JavaScript (ESNext)',
        level: 'Expert',
        percentage: 93,
        experienceYears: '5 yrs',
        iconName: 'FileCode',
        orderIndex: 6,
        published: true,
      },
      {
        id: 'sk_7',
        category: 'Frontend',
        name: 'Tailwind CSS & Responsive Layouts',
        level: 'Expert',
        percentage: 98,
        experienceYears: '5 yrs',
        iconName: 'Sliders',
        orderIndex: 7,
        published: true,
      },
      {
        id: 'sk_8',
        category: 'Frontend',
        name: 'Framer Motion & Web Animations',
        level: 'Advanced',
        percentage: 90,
        experienceYears: '4 yrs',
        iconName: 'Sparkles',
        orderIndex: 8,
        published: true,
      },
      {
        id: 'sk_9',
        category: 'Backend',
        name: 'Node.js & Express.js',
        level: 'Expert',
        percentage: 92,
        experienceYears: '5 yrs',
        iconName: 'Server',
        orderIndex: 9,
        published: true,
      },
      {
        id: 'sk_10',
        category: 'Backend',
        name: 'RESTful API Architecture',
        level: 'Expert',
        percentage: 94,
        experienceYears: '5 yrs',
        iconName: 'Globe',
        orderIndex: 10,
        published: true,
      },
      {
        id: 'sk_11',
        category: 'Backend',
        name: 'PostgreSQL & Database Modeling',
        level: 'Advanced',
        percentage: 88,
        experienceYears: '4 yrs',
        iconName: 'Database',
        orderIndex: 11,
        published: true,
      },
      {
        id: 'sk_12',
        category: 'Backend',
        name: 'Authentication & Security (JWT, OAuth)',
        level: 'Advanced',
        percentage: 90,
        experienceYears: '4 yrs',
        iconName: 'ShieldCheck',
        orderIndex: 12,
        published: true,
      },
      {
        id: 'sk_13',
        category: 'Workflow & Tools',
        name: 'Git, GitHub & Version Control',
        level: 'Expert',
        percentage: 95,
        experienceYears: '6 yrs',
        iconName: 'GitBranch',
        orderIndex: 13,
        published: true,
      },
      {
        id: 'sk_14',
        category: 'Workflow & Tools',
        name: 'Vite, Webpack & Build Tooling',
        level: 'Expert',
        percentage: 91,
        experienceYears: '4 yrs',
        iconName: 'Cpu',
        orderIndex: 14,
        published: true,
      },
    ],
    workSteps: [
      {
        id: 'stp_1',
        stepNumber: 1,
        title: 'Discovery & Requirements',
        description: 'Comprehensive analysis of project scope, business objectives, audience archetypes, and functional requirements.',
        iconName: 'Compass',
        orderIndex: 1,
      },
      {
        id: 'stp_2',
        stepNumber: 2,
        title: 'Planning & Direction',
        description: 'Establishing technical architecture, data structures, design moodboards, and detailed milestone roadmaps.',
        iconName: 'DraftingCompass',
        orderIndex: 2,
      },
      {
        id: 'stp_3',
        stepNumber: 3,
        title: 'Design & Prototyping',
        description: 'Crafting pixel-perfect layouts, interactive prototypes, typography systems, and responsive wireframes.',
        iconName: 'Layers',
        orderIndex: 3,
      },
      {
        id: 'stp_4',
        stepNumber: 4,
        title: 'Development & Integration',
        description: 'Writing clean, typed TypeScript, structured components, secure REST endpoints, and database models.',
        iconName: 'Code2',
        orderIndex: 4,
      },
      {
        id: 'stp_5',
        stepNumber: 5,
        title: 'Testing & Revisions',
        description: 'Cross-browser validation, mobile touch responsiveness, performance audits, and collaborative review rounds.',
        iconName: 'CheckCircle2',
        orderIndex: 5,
      },
      {
        id: 'stp_6',
        stepNumber: 6,
        title: 'Deployment & Final Delivery',
        description: 'Production deployment with SSL certificates, DNS setup, complete source code handover, and post-launch support.',
        iconName: 'Rocket',
        orderIndex: 6,
      },
    ],
    experience: [
      {
        id: 'exp_1',
        role: 'Senior Graphic & Full-Stack Developer',
        company: 'Creative Studio / Independent Contractor',
        period: '2023 - Present',
        description: 'Leading digital product design and full-stack development for high-growth tech ventures, agencies, and businesses across international markets.',
        type: 'experience',
        skills: ['React', 'TypeScript', 'Node.js', 'Express', 'Tailwind CSS', 'Figma', 'Brand Systems'],
        orderIndex: 1,
      },
      {
        id: 'exp_2',
        role: 'Frontend & UI/UX Specialist',
        company: 'Digital Solutions Agency',
        period: '2021 - 2023',
        description: 'Designed and implemented interactive web portals, responsive design systems, and client dashboards with rigorous performance benchmarks.',
        type: 'experience',
        skills: ['JavaScript', 'React', 'HTML5/CSS3', 'REST APIs', 'Adobe Suite'],
        orderIndex: 2,
      },
      {
        id: 'exp_3',
        role: 'Graphic Designer & Web Developer',
        company: 'Creative Media House',
        period: '2019 - 2021',
        description: 'Created brand identities, vector marketing collateral, print assets, and custom corporate websites for regional clients.',
        type: 'experience',
        skills: ['Photoshop', 'Illustrator', 'Web Design', 'Typography', 'PHP/WordPress'],
        orderIndex: 3,
      },
      {
        id: 'exp_4',
        role: 'Bachelor of Computer Science / Software Engineering',
        company: 'University of Sindh',
        period: 'Completed',
        description: 'Comprehensive foundation in software engineering, algorithms, database systems, object-oriented programming, and computer networks.',
        type: 'education',
        skills: ['Computer Science', 'Databases', 'Algorithms', 'Software Engineering'],
        orderIndex: 4,
      },
      {
        id: 'exp_5',
        role: 'Certified Full-Stack Web Developer & UI Designer',
        company: 'Professional Accreditations',
        period: 'Verified',
        description: 'Specialized certifications in modern web development architectures, responsive interface engineering, and visual communication.',
        type: 'certification',
        skills: ['Full-Stack Development', 'UI/UX Design', 'API Engineering'],
        orderIndex: 5,
      },
    ],
    testimonials: [
      {
        id: 'test_1',
        clientName: 'Alexander Vance',
        clientRole: 'Founder & CEO',
        company: 'Vance Design Group',
        avatarUrl: '/assets/avatars/avatar_1.svg',
        content: "Working with Santosh was an extraordinary experience. Having someone who can both design a world-class visual brand and then directly code the full-stack web application is exceptionally rare. He delivered ahead of schedule with immaculate attention to detail.",
        rating: 5,
        projectType: 'Brand Identity & Full-Stack Portal',
        published: true,
        orderIndex: 1,
      },
      {
        id: 'test_2',
        clientName: 'Sarah Jenkins',
        clientRole: 'Product Director',
        company: 'CloudScale Technologies',
        avatarUrl: '/assets/avatars/avatar_2.svg',
        content: "Santosh transformed our clunky enterprise interface into a sleek, lightning-fast dashboard that our customers genuinely enjoy using. His backend architectural knowledge made the API integration smooth and worry-free.",
        rating: 5,
        projectType: 'Frontend & API Engineering',
        published: true,
        orderIndex: 2,
      },
      {
        id: 'test_3',
        clientName: 'Hamza Tariq',
        clientRole: 'Managing Partner',
        company: 'Nexus Ventures',
        avatarUrl: '/assets/avatars/avatar_3.svg',
        content: "Santosh's graphic design capabilities brought our brand to life with stunning logos and investor presentations, while his web development made our online presence stand out from the competition. Highly recommended!",
        rating: 5,
        projectType: 'Graphic Design & Portfolio Site',
        published: true,
        orderIndex: 3,
      },
    ],
    inquiries: [
      {
        id: 'inq_sample_1',
        name: 'David Miller',
        email: 'david@millermedia.com',
        phone: '+1 (555) 234-5678',
        company: 'Miller Media Lab',
        service: 'Full-Stack Development',
        budget: '$3,000 - $5,000',
        deadline: 'Within 1 Month',
        message: 'Looking for a complete redesign and web application build for our creative studio. We love your visual aesthetic and need meeting scheduling built in.',
        status: 'new',
        createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
      },
    ],
    bookings: [
      {
        id: 'bk_sample_1',
        clientName: 'Elena Rostova',
        clientEmail: 'elena@rostovacreative.com',
        meetingType: '30-min Project Scoping',
        date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
        timeSlot: '15:00',
        durationMinutes: 30,
        communicationMethod: 'Google Meet',
        meetingUrl: 'https://meet.google.com/abc-defg-hij',
        projectDetails: 'Discussing new branding identity guidelines and custom React frontend for an upcoming product launch.',
        status: 'confirmed',
        createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
      },
    ],
    media: [
      {
        id: 'med_profile',
        filename: 'Santosh_Profile_Image_814470b2.png',
        url: '/assets/aistudio/Santosh_Profile_Image_814470b2.png',
        altText: 'Santosh Kumar Bheel - Professional Portrait',
        caption: 'Lead Graphic Designer & Full-Stack Developer',
        fileType: 'image/png',
        fileSize: 450000,
        uploadedAt: new Date().toISOString(),
      },
    ],
    auditLogs: [
      {
        id: 'log_init',
        action: 'System Initialized',
        details: 'Initial database created with complete seed configuration',
        username: 'system',
        timestamp: new Date().toISOString(),
      },
    ],
  };
}

class Database {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.load();
  }

  private load(): DatabaseSchema {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (e) {
      console.error('Error reading database file, recreating fresh data:', e);
    }
    const initial = getInitialDatabase();
    this.save(initial);
    return initial;
  }

  public save(dataToSave?: DatabaseSchema) {
    if (dataToSave) {
      this.data = dataToSave;
    }
    try {
      const tempFile = `${DB_FILE}.tmp.${Date.now()}`;
      fs.writeFileSync(tempFile, JSON.stringify(this.data, null, 2), 'utf-8');
      fs.renameSync(tempFile, DB_FILE);
    } catch (e) {
      console.error('Failed to atomically write database file:', e);
    }
  }

  // Getters
  public getData(): DatabaseSchema {
    return this.data;
  }

  public getSettings(): SiteSettings {
    return this.data.settings;
  }

  public updateSettings(newSettings: Partial<SiteSettings>, username: string = 'admin'): SiteSettings {
    this.data.settings = { ...this.data.settings, ...newSettings };
    this.logAction('Settings Updated', `Updated site configuration`, username);
    this.save();
    return this.data.settings;
  }

  public getServices(publishedOnly = false): Service[] {
    const list = this.data.services.sort((a, b) => a.orderIndex - b.orderIndex);
    return publishedOnly ? list.filter((s) => s.published) : list;
  }

  public getProjects(publishedOnly = false): Project[] {
    const list = this.data.projects.sort((a, b) => a.orderIndex - b.orderIndex);
    return publishedOnly ? list.filter((p) => p.published) : list;
  }

  public getSkills(publishedOnly = false): Skill[] {
    const list = this.data.skills.sort((a, b) => a.orderIndex - b.orderIndex);
    return publishedOnly ? list.filter((s) => s.published) : list;
  }

  public getWorkSteps(): WorkStep[] {
    return this.data.workSteps.sort((a, b) => a.orderIndex - b.orderIndex);
  }

  public getExperience(): ExperienceItem[] {
    return this.data.experience.sort((a, b) => a.orderIndex - b.orderIndex);
  }

  public getTestimonials(publishedOnly = false): Testimonial[] {
    const list = this.data.testimonials.sort((a, b) => a.orderIndex - b.orderIndex);
    return publishedOnly ? list.filter((t) => t.published) : list;
  }

  public getInquiries(): ContactInquiry[] {
    return this.data.inquiries.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  public getBookings(): MeetingBooking[] {
    return this.data.bookings.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  public getMedia(): MediaAsset[] {
    return this.data.media.sort(
      (a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
    );
  }

  public getAuditLogs(): AuditLog[] {
    return this.data.auditLogs.slice(-100).reverse();
  }

  public logAction(action: string, details: string, username: string) {
    this.data.auditLogs.push({
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      action,
      details,
      username,
      timestamp: new Date().toISOString(),
    });
  }

  // Mutators
  public addInquiry(inquiryData: Omit<ContactInquiry, 'id' | 'status' | 'createdAt'>): ContactInquiry {
    const newInquiry: ContactInquiry = {
      ...inquiryData,
      id: `inq_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      status: 'new',
      createdAt: new Date().toISOString(),
    };
    this.data.inquiries.unshift(newInquiry);
    this.save();
    return newInquiry;
  }

  public updateInquiryStatus(id: string, status: ContactInquiry['status'], username = 'admin'): boolean {
    const index = this.data.inquiries.findIndex((i) => i.id === id);
    if (index === -1) return false;
    this.data.inquiries[index].status = status;
    this.logAction('Inquiry Status Updated', `Inquiry ${id} set to ${status}`, username);
    this.save();
    return true;
  }

  public deleteInquiry(id: string, username = 'admin'): boolean {
    const prevLen = this.data.inquiries.length;
    this.data.inquiries = this.data.inquiries.filter((i) => i.id !== id);
    if (this.data.inquiries.length !== prevLen) {
      this.logAction('Inquiry Deleted', `Inquiry ${id} removed`, username);
      this.save();
      return true;
    }
    return false;
  }

  public addBooking(bookingData: Omit<MeetingBooking, 'id' | 'status' | 'createdAt' | 'meetingUrl'>): MeetingBooking {
    // Generate meeting URL based on method
    let meetingUrl = '';
    if (bookingData.communicationMethod === 'Google Meet') {
      // Generated secure meeting room reference or fallback to configured
      meetingUrl = this.data.settings.meetingSettings.customMeetingUrl || `https://meet.google.com/bheel-${Date.now().toString(36)}`;
    } else if (bookingData.communicationMethod === 'WhatsApp') {
      const cleanPhone = this.data.settings.whatsappNumber.replace(/[^0-9]/g, '');
      const msg = encodeURIComponent(`Hello Santosh, I have booked a meeting for ${bookingData.date} at ${bookingData.timeSlot}. Looking forward to discussing: ${bookingData.projectDetails.slice(0, 100)}`);
      meetingUrl = `https://wa.me/${cleanPhone}?text=${msg}`;
    } else {
      meetingUrl = this.data.settings.meetingSettings.customMeetingUrl || 'https://meet.google.com/new';
    }

    const newBooking: MeetingBooking = {
      ...bookingData,
      id: `bk_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      meetingUrl,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    };
    this.data.bookings.unshift(newBooking);
    this.save();
    return newBooking;
  }

  public updateBookingStatus(id: string, status: MeetingBooking['status'], username = 'admin'): boolean {
    const index = this.data.bookings.findIndex((b) => b.id === id);
    if (index === -1) return false;
    this.data.bookings[index].status = status;
    this.logAction('Booking Status Updated', `Booking ${id} set to ${status}`, username);
    this.save();
    return true;
  }

  public deleteBooking(id: string, username = 'admin'): boolean {
    const prevLen = this.data.bookings.length;
    this.data.bookings = this.data.bookings.filter((b) => b.id !== id);
    if (this.data.bookings.length !== prevLen) {
      this.logAction('Booking Deleted', `Booking ${id} removed`, username);
      this.save();
      return true;
    }
    return false;
  }

  // Projects CRUD
  public saveProject(project: Project, username = 'admin'): Project {
    const existingIndex = this.data.projects.findIndex((p) => p.id === project.id);
    if (existingIndex >= 0) {
      this.data.projects[existingIndex] = project;
      this.logAction('Project Updated', `Project "${project.title}" updated`, username);
    } else {
      project.id = project.id || `proj_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      project.orderIndex = project.orderIndex || this.data.projects.length + 1;
      this.data.projects.push(project);
      this.logAction('Project Created', `Project "${project.title}" created`, username);
    }
    this.save();
    return project;
  }

  public deleteProject(id: string, username = 'admin'): boolean {
    const proj = this.data.projects.find((p) => p.id === id);
    if (!proj) return false;
    this.data.projects = this.data.projects.filter((p) => p.id !== id);
    this.logAction('Project Deleted', `Project "${proj.title}" deleted`, username);
    this.save();
    return true;
  }

  // Services CRUD
  public saveService(service: Service, username = 'admin'): Service {
    const index = this.data.services.findIndex((s) => s.id === service.id);
    if (index >= 0) {
      this.data.services[index] = service;
      this.logAction('Service Updated', `Service "${service.title}" updated`, username);
    } else {
      service.id = service.id || `srv_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      service.orderIndex = service.orderIndex || this.data.services.length + 1;
      this.data.services.push(service);
      this.logAction('Service Created', `Service "${service.title}" created`, username);
    }
    this.save();
    return service;
  }

  public deleteService(id: string, username = 'admin'): boolean {
    const item = this.data.services.find((s) => s.id === id);
    if (!item) return false;
    this.data.services = this.data.services.filter((s) => s.id !== id);
    this.logAction('Service Deleted', `Service "${item.title}" deleted`, username);
    this.save();
    return true;
  }

  // Skills CRUD
  public saveSkill(skill: Skill, username = 'admin'): Skill {
    const index = this.data.skills.findIndex((s) => s.id === skill.id);
    if (index >= 0) {
      this.data.skills[index] = skill;
      this.logAction('Skill Updated', `Skill "${skill.name}" updated`, username);
    } else {
      skill.id = skill.id || `sk_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      skill.orderIndex = skill.orderIndex || this.data.skills.length + 1;
      this.data.skills.push(skill);
      this.logAction('Skill Created', `Skill "${skill.name}" created`, username);
    }
    this.save();
    return skill;
  }

  public deleteSkill(id: string, username = 'admin'): boolean {
    const item = this.data.skills.find((s) => s.id === id);
    if (!item) return false;
    this.data.skills = this.data.skills.filter((s) => s.id !== id);
    this.logAction('Skill Deleted', `Skill "${item.name}" deleted`, username);
    this.save();
    return true;
  }

  // Testimonials CRUD
  public saveTestimonial(testimonial: Testimonial, username = 'admin'): Testimonial {
    const index = this.data.testimonials.findIndex((t) => t.id === testimonial.id);
    if (index >= 0) {
      this.data.testimonials[index] = testimonial;
      this.logAction('Testimonial Updated', `Testimonial from "${testimonial.clientName}" updated`, username);
    } else {
      testimonial.id = testimonial.id || `test_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      testimonial.orderIndex = testimonial.orderIndex || this.data.testimonials.length + 1;
      this.data.testimonials.push(testimonial);
      this.logAction('Testimonial Created', `Testimonial from "${testimonial.clientName}" created`, username);
    }
    this.save();
    return testimonial;
  }

  public deleteTestimonial(id: string, username = 'admin'): boolean {
    const item = this.data.testimonials.find((t) => t.id === id);
    if (!item) return false;
    this.data.testimonials = this.data.testimonials.filter((t) => t.id !== id);
    this.logAction('Testimonial Deleted', `Testimonial from "${item.clientName}" deleted`, username);
    this.save();
    return true;
  }

  // Media Library
  public addMedia(media: MediaAsset, username = 'admin'): MediaAsset {
    this.data.media.unshift(media);
    this.logAction('Media Uploaded', `File ${media.filename} uploaded`, username);
    this.save();
    return media;
  }

  public deleteMedia(id: string, username = 'admin'): boolean {
    const item = this.data.media.find((m) => m.id === id);
    if (!item) return false;
    this.data.media = this.data.media.filter((m) => m.id !== id);
    this.logAction('Media Deleted', `Media ${item.filename} deleted`, username);
    this.save();
    return true;
  }

  // Auth User
  public findUserByUsernameOrEmail(identifier: string): User | undefined {
    return this.data.users.find(
      (u) => u.username.toLowerCase() === identifier.toLowerCase() || u.email.toLowerCase() === identifier.toLowerCase()
    );
  }

  public updateUserPassword(userId: string, newHash: string, username: string): boolean {
    const user = this.data.users.find((u) => u.id === userId);
    if (!user) return false;
    user.passwordHash = newHash;
    this.logAction('Password Changed', `User ${user.username} updated password`, username);
    this.save();
    return true;
  }
}

export const db = new Database();
