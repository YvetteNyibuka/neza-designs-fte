"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  darkenHexColor,
  DEFAULT_BRANDING,
  FONT_STACKS,
  mergeBrandingSettings,
  type BrandingConfig,
} from "@/lib/branding";

interface BrandingContextValue {
  branding: BrandingConfig;
}

const BrandingContext = createContext<BrandingContextValue>({
  branding: DEFAULT_BRANDING,
});

function setOrCreateFavicon(rel: string, href: string) {
  const selector = `link[rel='${rel}']`;
  let link = document.head.querySelector<HTMLLinkElement>(selector);

  if (!link) {
    link = document.createElement("link");
    link.rel = rel;
    document.head.appendChild(link);
  }

  link.href = href;
}

function applyBrandingToRoot(branding: BrandingConfig) {
  const root = document.documentElement;
  const fontStack = FONT_STACKS[branding.font] ?? FONT_STACKS[DEFAULT_BRANDING.font];

  root.style.setProperty("--color-primary", branding.primaryColor);
  root.style.setProperty("--color-primary-dark", darkenHexColor(branding.primaryColor));
  root.style.setProperty("--color-secondary", branding.secondaryColor);
  root.style.setProperty("--color-accent", branding.accentColor);
  root.style.setProperty("--font-brand-sans", fontStack.sans);
  root.style.setProperty("--font-brand-heading", fontStack.heading);

  setOrCreateFavicon("icon", branding.favicon);
  setOrCreateFavicon("shortcut icon", branding.favicon);
  setOrCreateFavicon("apple-touch-icon", branding.favicon);
}

async function fetchBrandingSettings(): Promise<BrandingConfig> {
  const baseUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api/v1").replace(/\/$/, "");
  const response = await fetch(`${baseUrl}/settings`, { cache: "no-store" });

  if (!response.ok) {
    throw new Error("Failed to load branding settings");
  }

  const payload = await response.json();
  return mergeBrandingSettings(payload);
}

export function BrandingProvider({ children }: { children: React.ReactNode }) {
  const [branding, setBranding] = useState<BrandingConfig>(DEFAULT_BRANDING);

  useEffect(() => {
    applyBrandingToRoot(DEFAULT_BRANDING);

    let mounted = true;
    fetchBrandingSettings()
      .then((resolved) => {
        if (!mounted) return;
        setBranding(resolved);
        applyBrandingToRoot(resolved);
      })
      .catch(() => {
        if (!mounted) return;
        setBranding(DEFAULT_BRANDING);
        applyBrandingToRoot(DEFAULT_BRANDING);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const value = useMemo(() => ({ branding }), [branding]);

  return <BrandingContext.Provider value={value}>{children}</BrandingContext.Provider>;
}

export function useBranding() {
  return useContext(BrandingContext);
}
