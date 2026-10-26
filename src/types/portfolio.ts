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
    workingDays: string[];
    startHour: number;
    endHour: number;
    meetingDurationOptions: number[];
    bufferMinutes: number;
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
  level: string;
  percentage: number;
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
  date: string;
  timeSlot: string;
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

export interface PortfolioData {
  settings: SiteSettings;
  services: Service[];
  projects: Project[];
  skills: Skill[];
  workSteps: WorkStep[];
  experience: ExperienceItem[];
  testimonials: Testimonial[];
}
