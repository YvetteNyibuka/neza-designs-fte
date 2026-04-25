export interface AuthUser {
  userId: string;
  email: string;
  role: string;
}

export type ProjectCategory = "Architecture" | "Civil Engineering" | "Project Management" | "Masterplanning" | "Interior";
export type ProjectStatus = "Completed" | "Ongoing";

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
