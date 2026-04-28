export interface AuthUser {
  userId: string;
  email: string;
  role: string;
}

export type ProjectCategory = "Architecture" | "Civil Engineering" | "Project Management" | "Masterplanning" | "Interior";
export type ProjectStatus = "Completed" | "Ongoing" | "Handed Over" | "Consulted";

export interface Project {
  _id: string;
  id?: string;
  slug: string;
  title: string;
  category: ProjectCategory;
  status: ProjectStatus;
  description: string;
  imageUrl: string;
  location: string;
  completionYear?: number;
  client?: string;
}

export type BlogPostCategory = "Sustainability" | "Urbanization" | "Design Trends" | "Rwanda Projects" | "FEATURED INSIGHTS";

export interface BlogPost {
  _id: string;
  id?: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: BlogPostCategory;
  readTime: number;
  publishedAt: string;
  imageUrl: string;
  author: {
    name: string;
    role: string;
    avatarUrl?: string; // Optional for now
  }
}

export interface TeamMember {
  _id: string;
  id?: string;
  name: string;
  role: string;
  bio: string;
  imageUrl: string;
}

export interface Service {
  _id: string;
  id?: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  features: string[] | { name: string; meaning?: string; icon?: string }[];
  imageUrl: string;
  icon?: string;
  buttonTitle?: string;
}

export type CareerEmploymentType = "Full-time" | "Part-time" | "Contract" | "Internship";
export type CareerLevel = "Entry" | "Mid" | "Senior" | "Lead";
export type CareerStatus = "Open" | "Closed";

export interface Career {
  _id: string;
  slug: string;
  title: string;
  department: string;
  location: string;
  employmentType: CareerEmploymentType;
  experienceLevel: CareerLevel;
  description: string;
  requirements: string[];
  responsibilities: string[];
  applyEmail?: string;
  applyUrl?: string;
  deadline?: string;
  status: CareerStatus;
  featured: boolean;
  createdAt?: string;
}

export type PublicationType = "Report" | "Portfolio" | "Law" | "Policy" | "Guide" | "Other";
export interface Publication {
  _id: string;
  slug: string;
  title: string;
  summary: string;
  type: PublicationType;
  publishedAt: string;
  coverImage?: string;
  fileUrl?: string;
  externalUrl?: string;
  tags: string[];
  createdAt?: string;
}

export type ApplicationStatus = "New" | "Reviewing" | "Shortlisted" | "Rejected" | "Hired";

export interface JobApplication {
  _id: string;
  careerId: string;
  careerSlug: string;
  careerTitle: string;
  applicantName: string;
  email: string;
  phone?: string;
  linkedIn?: string;
  resumeUrl?: string;
  coverLetter?: string;
  status: ApplicationStatus;
  notes: string[];
  appliedAt: string;
  createdAt?: string;
}
