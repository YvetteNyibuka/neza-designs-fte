const BLOG_CATEGORIES = [
  "Sustainability",
  "Urbanization",
  "Design Trends",
  "Rwanda Projects",
  "FEATURED INSIGHTS",
] as const;

const PROJECT_CATEGORIES = [
  "Architecture",
  "Construction",
  "Project Management",
  "Land Acquisition",
] as const;

const PROJECT_STATUSES = ["Completed", "Ongoing", "Handed Over", "Consulted"] as const;

const HEX_COLOR_REGEX = /^#[0-9A-Fa-f]{6}$/;
const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;

function isBlank(value: string | null | undefined): boolean {
  return !value || value.trim().length === 0;
}

function isValidUrl(value: string): boolean {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

export interface ServiceFeatureInput {
  name: string;
  meaning: string;
  icon: string;
}

export function validateProjectForm(form: {
  title: string;
  category: string;
  status: string;
  description: string;
  imageUrl?: string;
  completionYear?: string;
}): string[] {
  const errors: string[] = [];

  const title = form.title.trim();
  if (title.length < 2) errors.push("title: Must be at least 2 characters");
  if (title.length > 200) errors.push("title: Must be at most 200 characters");

  if (!PROJECT_CATEGORIES.includes(form.category as (typeof PROJECT_CATEGORIES)[number])) {
    errors.push("category: Invalid category");
  }

  if (!PROJECT_STATUSES.includes(form.status as (typeof PROJECT_STATUSES)[number])) {
    errors.push("status: Invalid status");
  }

  if (form.description.trim().length < 10) {
    errors.push("description: Must be at least 10 characters");
  }

  if (form.imageUrl && !isValidUrl(form.imageUrl)) {
    errors.push("imageUrl: Must be a valid URL");
  }

  if (!isBlank(form.completionYear)) {
    const year = Number(form.completionYear);
    if (!Number.isInteger(year)) {
      errors.push("completionYear: Must be an integer");
    } else if (year < 1900 || year > 2100) {
      errors.push("completionYear: Must be between 1900 and 2100");
    }
  }

  return errors;
}

export function validateServiceForm(form: {
  title: string;
  shortDescription: string;
  imageUrl?: string;
  features: ServiceFeatureInput[];
}): string[] {
  const errors: string[] = [];
  const title = form.title.trim();
  const shortDescription = form.shortDescription.trim();

  if (title.length < 2) errors.push("title: Must be at least 2 characters");
  if (title.length > 200) errors.push("title: Must be at most 200 characters");

  if (shortDescription.length < 10) errors.push("shortDescription: Must be at least 10 characters");
  if (shortDescription.length > 300) errors.push("shortDescription: Must be at most 300 characters");

  if (form.imageUrl && !isValidUrl(form.imageUrl)) {
    errors.push("imageUrl: Must be a valid URL");
  }

  if (!Array.isArray(form.features) || form.features.length < 1) {
    errors.push("features: At least one feature is required");
  }

  if (form.features.length > 20) {
    errors.push("features: Must be at most 20 items");
  }

  form.features.forEach((feature, index) => {
    if (feature.name.trim().length < 1) errors.push(`features.${index}.name: Required`);
    if (feature.meaning.trim().length < 1) errors.push(`features.${index}.meaning: Required`);
    if (feature.icon.trim().length < 1) errors.push(`features.${index}.icon: Required`);
  });

  return errors;
}

export function validateBlogForm(form: {
  title: string;
  excerpt: string;
  content: string;
  category: string;
  readTime: string;
  publishedAt?: string;
  imageUrl?: string;
  authorName: string;
  authorRole: string;
}): string[] {
  const errors: string[] = [];
  const title = form.title.trim();
  const excerpt = form.excerpt.trim();
  const plainContent = stripHtml(form.content);
  const readTime = Number(form.readTime);

  if (title.length < 5) errors.push("title: Must be at least 5 characters");
  if (title.length > 300) errors.push("title: Must be at most 300 characters");

  if (excerpt.length < 10) errors.push("excerpt: Must be at least 10 characters");
  if (excerpt.length > 500) errors.push("excerpt: Must be at most 500 characters");

  if (plainContent.length < 50) errors.push("content: Must be at least 50 characters");

  if (!BLOG_CATEGORIES.includes(form.category as (typeof BLOG_CATEGORIES)[number])) {
    errors.push("category: Invalid category");
  }

  if (!Number.isInteger(readTime) || readTime < 1 || readTime > 120) {
    errors.push("readTime: Must be an integer between 1 and 120");
  }

  if (form.publishedAt && Number.isNaN(new Date(form.publishedAt).getTime())) {
    errors.push("publishedAt: Invalid date");
  }

  if (form.imageUrl && !isValidUrl(form.imageUrl)) {
    errors.push("imageUrl: Must be a valid URL");
  }

  if (form.authorName.trim().length < 2) errors.push("author.name: Must be at least 2 characters");
  if (form.authorRole.trim().length < 2) errors.push("author.role: Must be at least 2 characters");

  return errors;
}

export function validateTeamForm(form: {
  name: string;
  role: string;
  bio: string;
  imageUrl?: string;
}): string[] {
  const errors: string[] = [];

  if (form.name.trim().length < 2) errors.push("name: Must be at least 2 characters");
  if (form.name.trim().length > 100) errors.push("name: Must be at most 100 characters");

  if (form.role.trim().length < 2) errors.push("role: Must be at least 2 characters");
  if (form.role.trim().length > 100) errors.push("role: Must be at most 100 characters");

  if (form.bio.trim().length < 10) errors.push("bio: Must be at least 10 characters");
  if (form.bio.trim().length > 1000) errors.push("bio: Must be at most 1000 characters");

  if (form.imageUrl && !isValidUrl(form.imageUrl)) {
    errors.push("imageUrl: Must be a valid URL");
  }

  return errors;
}

export function validateLoginForm(email: string, password: string): string[] {
  const errors: string[] = [];
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email.trim())) errors.push("email: Invalid email address");
  if (password.length < 1) errors.push("password: Password is required");
  return errors;
}

export function validateOtpInput(otp: string): string[] {
  const errors: string[] = [];
  if (!/^\d{6}$/.test(otp.trim())) errors.push("otp: OTP must be 6 digits");
  return errors;
}

export function validateChangePasswordForm(currentPassword: string, newPassword: string, confirmPassword: string): string[] {
  const errors: string[] = [];

  if (currentPassword.length < 1) errors.push("currentPassword: Current password is required");
  if (newPassword.length < 8) errors.push("newPassword: Password must be at least 8 characters");
  if (!PASSWORD_REGEX.test(newPassword)) {
    errors.push("newPassword: Password must contain uppercase, number, and special character");
  }
  if (confirmPassword.length < 1) errors.push("confirmPassword: Confirm password is required");
  if (newPassword !== confirmPassword) errors.push("confirmPassword: Passwords do not match");

  return errors;
}

export function validateSeoSettingsForm(form: {
  metaTitle: string;
  metaDescription: string;
  canonicalUrl: string;
  ogImage?: string | null;
}): string[] {
  const errors: string[] = [];

  const title = form.metaTitle.trim();
  const description = form.metaDescription.trim();

  if (title.length < 1) errors.push("metaTitle: Must be at least 1 character");
  if (title.length > 200) errors.push("metaTitle: Must be at most 200 characters");

  if (description.length > 500) errors.push("metaDescription: Must be at most 500 characters");

  if (form.canonicalUrl && !isValidUrl(form.canonicalUrl)) {
    errors.push("canonicalUrl: Must be a valid URL");
  }

  if (form.ogImage && !isValidUrl(form.ogImage)) {
    errors.push("ogImage: Must be a valid URL");
  }

  return errors;
}

export function validateBrandingSettingsForm(form: {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  logoLight?: string | null;
  logoDark?: string | null;
  favicon?: string | null;
}): string[] {
  const errors: string[] = [];

  if (!HEX_COLOR_REGEX.test(form.primaryColor)) errors.push("primaryColor: Must be a valid hex color (#RRGGBB)");
  if (!HEX_COLOR_REGEX.test(form.secondaryColor)) errors.push("secondaryColor: Must be a valid hex color (#RRGGBB)");
  if (!HEX_COLOR_REGEX.test(form.accentColor)) errors.push("accentColor: Must be a valid hex color (#RRGGBB)");

  if (form.logoLight && !isValidUrl(form.logoLight)) errors.push("logoLight: Must be a valid URL");
  if (form.logoDark && !isValidUrl(form.logoDark)) errors.push("logoDark: Must be a valid URL");
  if (form.favicon && !isValidUrl(form.favicon)) errors.push("favicon: Must be a valid URL");

  return errors;
}

export function validateContactForm(form: {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}): string[] {
  const errors: string[] = [];
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const name = form.name.trim();
  const email = form.email.trim();
  const subject = form.subject.trim();
  const message = form.message.trim();

  if (name.length < 2) errors.push("name: Must be at least 2 characters");
  if (name.length > 100) errors.push("name: Must be at most 100 characters");

  if (!emailPattern.test(email)) errors.push("email: Invalid email address");

  if (subject.length < 3) errors.push("subject: Must be at least 3 characters");
  if (subject.length > 200) errors.push("subject: Must be at most 200 characters");

  if (message.length < 10) errors.push("message: Must be at least 10 characters");
  if (message.length > 2000) errors.push("message: Must be at most 2000 characters");

  return errors;
}
