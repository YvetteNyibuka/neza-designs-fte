import api from "@/lib/axios";

export interface SiteSettings {
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  canonicalUrl?: string;
  ogImage?: string;
  indexingEnabled?: boolean;
  sitemapEnabled?: boolean;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  logoLight?: string;
  logoDark?: string;
  favicon?: string;
  font?: string;
}

export async function getSettings() {
  const { data } = await api.get("/settings");
  return data;
}

export async function updateSettings(payload: Partial<SiteSettings>) {
  const { data } = await api.patch("/settings", payload);
  return data;
}
