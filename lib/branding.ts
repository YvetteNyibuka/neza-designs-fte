import type { SiteSettings } from "@/lib/api/settings";

export interface BrandingConfig {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  logoLight: string;
  logoDark: string;
  favicon: string;
  font: string;
}

export const DEFAULT_BRANDING: BrandingConfig = {
  primaryColor: "#B75E1A",
  secondaryColor: "#231F1C",
  accentColor: "#DAA119",
  logoLight: "/logos/BprimaryLogo.png",
  logoDark: "/logos/WprimaryLogo.png",
  favicon: "/logos/BprimaryLogo.png",
  font: "Playfair Display",
};

export const FONT_STACKS: Record<string, { sans: string; heading: string }> = {
  Inter: {
    sans: "var(--font-inter), ui-sans-serif, system-ui, sans-serif",
    heading: "var(--font-inter), ui-sans-serif, system-ui, sans-serif",
  },
  "Playfair Display": {
    sans: "var(--font-playfair), ui-serif, Georgia, serif",
    heading: "var(--font-playfair), ui-serif, Georgia, serif",
  },
  "DM Sans": {
    sans: '"DM Sans", var(--font-inter), ui-sans-serif, system-ui, sans-serif',
    heading: '"DM Sans", var(--font-inter), ui-sans-serif, system-ui, sans-serif',
  },
  Sora: {
    sans: '"Sora", var(--font-inter), ui-sans-serif, system-ui, sans-serif',
    heading: '"Sora", var(--font-inter), ui-sans-serif, system-ui, sans-serif',
  },
  Outfit: {
    sans: '"Outfit", var(--font-inter), ui-sans-serif, system-ui, sans-serif',
    heading: '"Outfit", var(--font-inter), ui-sans-serif, system-ui, sans-serif',
  },
};

const HEX_COLOR_RE = /^#(?:[0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;

function isValidHexColor(value: unknown): value is string {
  return typeof value === "string" && HEX_COLOR_RE.test(value);
}

function isValidAssetUrl(value: unknown): value is string {
  if (typeof value !== "string") return false;
  if (value.startsWith("/")) return true;

  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

function normalizeSettingsPayload(input: unknown): Partial<SiteSettings> {
  if (!input || typeof input !== "object") return {};
  const container = input as { data?: unknown };
  const candidate = (container.data && typeof container.data === "object") ? container.data : input;
  return candidate as Partial<SiteSettings>;
}

export function mergeBrandingSettings(input: unknown): BrandingConfig {
  const settings = normalizeSettingsPayload(input);

  return {
    primaryColor: isValidHexColor(settings.primaryColor) ? settings.primaryColor : DEFAULT_BRANDING.primaryColor,
    secondaryColor: isValidHexColor(settings.secondaryColor) ? settings.secondaryColor : DEFAULT_BRANDING.secondaryColor,
    accentColor: isValidHexColor(settings.accentColor) ? settings.accentColor : DEFAULT_BRANDING.accentColor,
    logoLight: isValidAssetUrl(settings.logoLight) ? settings.logoLight : DEFAULT_BRANDING.logoLight,
    logoDark: isValidAssetUrl(settings.logoDark) ? settings.logoDark : DEFAULT_BRANDING.logoDark,
    favicon: isValidAssetUrl(settings.favicon) ? settings.favicon : DEFAULT_BRANDING.favicon,
    font: typeof settings.font === "string" && settings.font in FONT_STACKS ? settings.font : DEFAULT_BRANDING.font,
  };
}

function parseHexColor(hex: string): { r: number; g: number; b: number } {
  const raw = hex.replace("#", "");
  const full = raw.length === 3 ? raw.split("").map((c) => c + c).join("") : raw;
  return {
    r: Number.parseInt(full.slice(0, 2), 16),
    g: Number.parseInt(full.slice(2, 4), 16),
    b: Number.parseInt(full.slice(4, 6), 16),
  };
}

function toHexColor(value: number): string {
  return Math.max(0, Math.min(255, value)).toString(16).padStart(2, "0");
}

export function darkenHexColor(hex: string, ratio = 0.18): string {
  if (!isValidHexColor(hex)) return DEFAULT_BRANDING.primaryColor;
  const { r, g, b } = parseHexColor(hex);
  const scale = 1 - Math.max(0, Math.min(1, ratio));
  return `#${toHexColor(Math.round(r * scale))}${toHexColor(Math.round(g * scale))}${toHexColor(Math.round(b * scale))}`;
}

export async function getServerBrandingSettings(): Promise<BrandingConfig> {
  const baseUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api/v1").replace(/\/$/, "");

  try {
    const response = await fetch(`${baseUrl}/settings`, {
      cache: "no-store",
      next: { revalidate: 0 },
    });

    if (!response.ok) {
      return DEFAULT_BRANDING;
    }

    const payload = await response.json();
    return mergeBrandingSettings(payload);
  } catch {
    return DEFAULT_BRANDING;
  }
}
