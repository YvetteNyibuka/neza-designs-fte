"use client";

import { AdminHeader } from "@/components/admin/Header";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Icon } from "@iconify/react";
import { useState, useRef } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";

/* ─── tiny toggle ────────────────────────────────────────────── */
function Toggle({
  enabled,
  onChange,
}: {
  enabled: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!enabled)}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none",
        enabled ? "bg-primary" : "bg-neutral-200"
      )}
    >
      <span
        className={cn(
          "pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform transition-transform duration-200",
          enabled ? "translate-x-5" : "translate-x-0"
        )}
      />
    </button>
  );
}

/* ─── reusable section card ──────────────────────────────────── */
function SectionCard({
  title,
  description,
  children,
  className,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("bg-white border border-neutral-100 rounded-2xl p-7 shadow-sm", className)}>
      {(title || description) && (
        <div className="mb-6 pb-5 border-b border-neutral-100">
          <h3 className="font-heading text-base font-bold text-neutral-900 mb-0.5">{title}</h3>
          {description && <p className="text-xs text-neutral-400">{description}</p>}
        </div>
      )}
      {children}
    </div>
  );
}

/* ─── SECURITY TAB ───────────────────────────────────────────── */
function SecurityTab() {
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [loginAlerts, setLoginAlerts] = useState(true);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [newPwd, setNewPwd] = useState("");

  const strength = !newPwd
    ? 0
    : newPwd.length < 6
    ? 1
    : newPwd.length < 10
    ? 2
    : /[A-Z]/.test(newPwd) && /[0-9]/.test(newPwd) && /[^A-Za-z0-9]/.test(newPwd)
    ? 4
    : 3;

  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][strength];
  const strengthColor = ["", "bg-red-400", "bg-orange-400", "bg-yellow-400", "bg-green-500"][strength];

  const sessions = [
    { device: "Chrome on Windows 11", location: "Kigali, Rwanda", time: "Active now", icon: "mdi:monitor", current: true },
    { device: "Safari on iPhone 15", location: "Nairobi, Kenya", time: "2 hours ago", icon: "mdi:cellphone", current: false },
    { device: "Firefox on macOS", location: "Kampala, Uganda", time: "Yesterday, 4:12 PM", icon: "mdi:laptop", current: false },
  ];

  return (
    <div className="space-y-6">

      {/* Change Password */}
      <SectionCard title="Change Password" description="Use a strong password with at least 8 characters, a number, and a symbol.">
        <div className="space-y-4">
          <div className="relative">
            <Input
              label="Current Password"
              type={showCurrent ? "text" : "password"}
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowCurrent((p) => !p)}
              className="absolute right-3 top-8 text-neutral-400 hover:text-neutral-600"
            >
              <Icon icon={showCurrent ? "mdi:eye-off-outline" : "mdi:eye-outline"} width={18} />
            </button>
          </div>

          <div className="relative">
            <Input
              label="New Password"
              type={showNew ? "text" : "password"}
              placeholder="••••••••"
              value={newPwd}
              onChange={(e) => setNewPwd((e.target as HTMLInputElement).value)}
            />
            <button
              type="button"
              onClick={() => setShowNew((p) => !p)}
              className="absolute right-3 top-8 text-neutral-400 hover:text-neutral-600"
            >
              <Icon icon={showNew ? "mdi:eye-off-outline" : "mdi:eye-outline"} width={18} />
            </button>
          </div>

          {/* Strength meter */}
          {newPwd && (
            <div>
              <div className="flex gap-1 mb-1">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={cn(
                      "h-1 flex-1 rounded-full transition-colors duration-300",
                      i <= strength ? strengthColor : "bg-neutral-100"
                    )}
                  />
                ))}
              </div>
              <p className={cn("text-xs font-medium", ["", "text-red-400", "text-orange-400", "text-yellow-500", "text-green-600"][strength])}>
                {strengthLabel} password
              </p>
            </div>
          )}

          <div className="relative">
            <Input
              label="Confirm New Password"
              type={showConfirm ? "text" : "password"}
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowConfirm((p) => !p)}
              className="absolute right-3 top-8 text-neutral-400 hover:text-neutral-600"
            >
              <Icon icon={showConfirm ? "mdi:eye-off-outline" : "mdi:eye-outline"} width={18} />
            </button>
          </div>

          <Button className="mt-2">Update Password</Button>
        </div>
      </SectionCard>

      {/* 2FA */}
      <SectionCard title="Two-Factor Authentication" description="Add a second layer of verification when signing in.">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors",
              twoFAEnabled ? "bg-primary/10" : "bg-neutral-100"
            )}>
              <Icon icon="mdi:shield-lock-outline" width={24} className={twoFAEnabled ? "text-primary" : "text-neutral-400"} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-sm text-neutral-900">Authenticator App</h4>
                {twoFAEnabled && (
                  <span className="text-[10px] bg-green-50 text-green-600 border border-green-200 px-2 py-0.5 rounded-full font-bold tracking-wide">
                    ENABLED
                  </span>
                )}
              </div>
              <p className="text-xs text-neutral-500 mt-0.5">
                {twoFAEnabled
                  ? "Your account is protected with 2FA."
                  : "Use an authenticator app like Google Authenticator."}
              </p>
            </div>
          </div>
          <Toggle enabled={twoFAEnabled} onChange={setTwoFAEnabled} />
        </div>

        {twoFAEnabled && (
          <div className="mt-5 p-4 bg-primary/5 border border-primary/10 rounded-xl">
            <p className="text-xs text-neutral-600 leading-relaxed">
              Scan the QR code in your authenticator app, then enter the 6-digit code to verify setup.
            </p>
            <div className="flex gap-3 mt-3">
              <Button size="sm" variant="outline" className="border-primary/20 text-primary bg-white hover:bg-primary/5">
                Show QR Code
              </Button>
              <Button size="sm" variant="ghost" className="text-neutral-500">
                View Recovery Codes
              </Button>
            </div>
          </div>
        )}
      </SectionCard>

      {/* Security Preferences */}
      <SectionCard title="Security Preferences">
        <div className="space-y-5">
          {[
            {
              icon: "mdi:bell-ring-outline",
              label: "Login Alerts",
              desc: "Get notified when a new device signs in.",
              state: loginAlerts,
              set: setLoginAlerts,
            },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-neutral-50 border border-neutral-100 flex items-center justify-center">
                  <Icon icon={item.icon} width={18} className="text-neutral-500" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-neutral-800">{item.label}</div>
                  <div className="text-xs text-neutral-400">{item.desc}</div>
                </div>
              </div>
              <Toggle enabled={item.state} onChange={item.set} />
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Active Sessions */}
      <SectionCard title="Active Sessions" description="Devices currently signed into your account.">
        <div className="space-y-3">
          {sessions.map((s, i) => (
            <div key={i} className={cn(
              "flex items-center justify-between p-4 rounded-xl border transition-colors",
              s.current ? "bg-primary/5 border-primary/15" : "bg-neutral-50 border-neutral-100"
            )}>
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                  s.current ? "bg-primary/10" : "bg-white border border-neutral-200"
                )}>
                  <Icon icon={s.icon} width={20} className={s.current ? "text-primary" : "text-neutral-400"} />
                </div>
                <div>
                  <div className="text-sm font-semibold text-neutral-800 flex items-center gap-2">
                    {s.device}
                    {s.current && (
                      <span className="text-[10px] bg-green-50 text-green-600 border border-green-200 px-2 py-0.5 rounded-full font-bold">
                        THIS DEVICE
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-neutral-400 mt-0.5 flex items-center gap-2">
                    <Icon icon="mdi:map-marker-outline" width={11} />
                    {s.location}
                    <span className="text-neutral-200">·</span>
                    {s.time}
                  </div>
                </div>
              </div>
              {!s.current && (
                <button className="text-xs font-semibold text-red-400 hover:text-red-600 transition-colors px-3 py-1.5 rounded-lg hover:bg-red-50">
                  Revoke
                </button>
              )}
            </div>
          ))}
        </div>
        <button className="mt-4 text-xs font-bold text-red-400 hover:text-red-600 transition-colors flex items-center gap-1.5">
          <Icon icon="mdi:logout-variant" width={14} />
          Sign out all other sessions
        </button>
      </SectionCard>

      {/* Danger Zone */}
      <SectionCard title="Danger Zone" className="border-red-100">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold text-neutral-900 mb-0.5">Delete Account</h4>
            <p className="text-xs text-neutral-400">Permanently remove your account and all associated data. This cannot be undone.</p>
          </div>
          <Button variant="destructive" size="sm" className="shrink-0 ml-6">
            Delete Account
          </Button>
        </div>
      </SectionCard>

    </div>
  );
}

/* ─── SEO TAB ────────────────────────────────────────────────── */
function SeoTab() {
  const [metaTitle, setMetaTitle] = useState("NEEZA Designs | African Architecture & Engineering");
  const [metaDesc, setMetaDesc] = useState(
    "East Africa's premier architecture and engineering consultancy, crafting sustainable, luxury built environments rooted in African heritage."
  );
  const [keywords, setKeywords] = useState("architecture, civil engineering, Rwanda, sustainable design, NEEZA");
  const [canonicalUrl, setCanonicalUrl] = useState("https://neeza.rw");
  const [indexing, setIndexing] = useState(true);
  const [sitemapEnabled, setSitemapEnabled] = useState(true);
  const [ogImage, setOgImage] = useState<string | null>(null);
  const ogInputRef = useRef<HTMLInputElement>(null);

  const handleOgImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setOgImage(URL.createObjectURL(file));
  };

  const titleLength = metaTitle.length;
  const descLength = metaDesc.length;

  return (
    <div className="space-y-6">

      {/* Basic Meta */}
      <SectionCard title="Page Meta Tags" description="Controls how your site appears in Google and other search engines.">
        <div className="space-y-5">
          <div>
            <Input
              label="Meta Title"
              value={metaTitle}
              onChange={(e) => setMetaTitle((e.target as HTMLInputElement).value)}
              maxLength={60}
            />
            <div className="flex justify-end mt-1">
              <span className={cn("text-xs font-medium", titleLength > 60 ? "text-red-400" : titleLength > 50 ? "text-orange-400" : "text-neutral-400")}>
                {titleLength}/60 characters
              </span>
            </div>
          </div>

          <div>
            <Input
              label="Meta Description"
              type="textarea"
              value={metaDesc}
              onChange={(e) => setMetaDesc((e.target as HTMLTextAreaElement).value)}
              className="min-h-[90px]"
              maxLength={160}
            />
            <div className="flex justify-end mt-1">
              <span className={cn("text-xs font-medium", descLength > 160 ? "text-red-400" : descLength > 140 ? "text-orange-400" : "text-neutral-400")}>
                {descLength}/160 characters
              </span>
            </div>
          </div>

          <Input
            label="Focus Keywords (comma-separated)"
            value={keywords}
            onChange={(e) => setKeywords((e.target as HTMLInputElement).value)}
          />
        </div>

        {/* Google preview */}
        <div className="mt-6 p-4 bg-neutral-50 rounded-xl border border-neutral-100">
          <p className="text-[10px] font-bold tracking-widest uppercase text-neutral-400 mb-3">Google Preview</p>
          <div className="text-xs text-neutral-400 mb-1 flex items-center gap-1.5">
            <div className="w-4 h-4 rounded-full bg-neutral-200 flex items-center justify-center">
              <Icon icon="mdi:web" width={10} />
            </div>
            neeza.rw
          </div>
          <div className="text-[#1a0dab] text-base font-medium leading-snug mb-1 line-clamp-1">
            {metaTitle || "Page Title"}
          </div>
          <div className="text-xs text-neutral-500 leading-relaxed line-clamp-2">
            {metaDesc || "Page description will appear here."}
          </div>
        </div>
      </SectionCard>

      {/* OG / Social */}
      <SectionCard title="Social Sharing" description="Customize how your site looks when shared on LinkedIn, Twitter, and Facebook.">
        <div className="space-y-5">
          <div>
            <label className="text-sm font-medium text-neutral-700 block mb-2">OG Image (1200×630px recommended)</label>
            <input ref={ogInputRef} type="file" accept="image/*" className="hidden" onChange={handleOgImageChange} />
            {ogImage ? (
              <div className="relative w-full h-44 rounded-xl overflow-hidden border border-neutral-200 group">
                <Image src={ogImage} alt="OG Preview" fill style={{ objectFit: "cover" }} sizes="600px" />
                <div className="absolute inset-0 bg-neutral-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    onClick={() => ogInputRef.current?.click()}
                    className="bg-white text-neutral-800 text-xs font-bold px-4 py-2 rounded-lg"
                  >
                    Replace Image
                  </button>
                </div>
              </div>
            ) : (
              <div
                onClick={() => ogInputRef.current?.click()}
                className="w-full h-36 border-2 border-dashed border-neutral-200 rounded-xl flex flex-col items-center justify-center bg-neutral-50 hover:bg-primary/5 hover:border-primary/30 transition-all cursor-pointer group"
              >
                <Icon icon="mdi:image-plus-outline" width={30} className="text-neutral-300 group-hover:text-primary mb-2 transition-colors" />
                <p className="text-sm font-medium text-neutral-400 group-hover:text-primary transition-colors">Upload OG Image</p>
                <p className="text-[10px] text-neutral-300 mt-1">PNG or JPG, 1200×630px</p>
              </div>
            )}
          </div>
        </div>

        {/* Social card preview */}
        <div className="mt-5 rounded-xl border border-neutral-200 overflow-hidden">
          <div className="h-28 bg-neutral-100 relative">
            {ogImage ? (
              <Image src={ogImage} alt="OG" fill style={{ objectFit: "cover" }} sizes="560px" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Icon icon="mdi:image-outline" width={36} className="text-neutral-300" />
              </div>
            )}
          </div>
          <div className="p-3 bg-white border-t border-neutral-100">
            <div className="text-[10px] uppercase text-neutral-400 tracking-wider mb-0.5">neeza.rw</div>
            <div className="text-sm font-semibold text-neutral-900 line-clamp-1">{metaTitle}</div>
            <div className="text-xs text-neutral-500 line-clamp-1 mt-0.5">{metaDesc}</div>
          </div>
        </div>
      </SectionCard>

      {/* Technical SEO */}
      <SectionCard title="Technical SEO">
        <div className="space-y-5">
          <Input
            label="Canonical URL"
            value={canonicalUrl}
            onChange={(e) => setCanonicalUrl((e.target as HTMLInputElement).value)}
            icon={<Icon icon="mdi:link-variant" width={16} className="text-neutral-400" />}
          />

          {[
            {
              icon: "mdi:robot-outline",
              label: "Allow Search Engine Indexing",
              desc: "Enables robots.txt to allow crawlers. Disable on staging environments.",
              state: indexing,
              set: setIndexing,
            },
            {
              icon: "mdi:sitemap-outline",
              label: "Auto-generate Sitemap",
              desc: "Automatically submit sitemap.xml to Google Search Console.",
              state: sitemapEnabled,
              set: setSitemapEnabled,
            },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between py-1">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-neutral-50 border border-neutral-100 flex items-center justify-center shrink-0">
                  <Icon icon={item.icon} width={18} className="text-neutral-500" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-neutral-800">{item.label}</div>
                  <div className="text-xs text-neutral-400">{item.desc}</div>
                </div>
              </div>
              <Toggle enabled={item.state} onChange={item.set} />
            </div>
          ))}
        </div>
      </SectionCard>

    </div>
  );
}

/* ─── BRANDING TAB ───────────────────────────────────────────── */
function BrandingTab() {
  const [primaryColor, setPrimaryColor] = useState("#B75E1A");
  const [secondaryColor, setSecondaryColor] = useState("#231F1C");
  const [accentColor, setAccentColor] = useState("#DAA119");
  const [logoLight, setLogoLight] = useState<string | null>(null);
  const [logoDark, setLogoDark] = useState<string | null>(null);
  const [favicon, setFavicon] = useState<string | null>(null);
  const [selectedFont, setSelectedFont] = useState("Inter");

  const logoLightRef = useRef<HTMLInputElement>(null);
  const logoDarkRef = useRef<HTMLInputElement>(null);
  const faviconRef = useRef<HTMLInputElement>(null);

  const handleImage = (setter: (s: string) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) setter(URL.createObjectURL(f));
  };

  const fonts = ["Inter", "Playfair Display", "DM Sans", "Sora", "Outfit"];

  const colorFields = [
    { label: "Primary", desc: "Buttons, links, accents", value: primaryColor, set: setPrimaryColor },
    { label: "Secondary", desc: "Dark surfaces & text", value: secondaryColor, set: setSecondaryColor },
    { label: "Accent / Gold", desc: "Highlights & badges", value: accentColor, set: setAccentColor },
  ];

  return (
    <div className="space-y-6">

      {/* Color Palette */}
      <SectionCard title="Brand Colors" description="Define your visual identity across the entire site.">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {colorFields.map((c) => (
            <div key={c.label}>
              <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider block mb-2">
                {c.label}
                <span className="font-normal normal-case tracking-normal text-neutral-400 ml-1">— {c.desc}</span>
              </label>
              <div className="flex items-center gap-3">
                <label
                  className="w-12 h-10 rounded-lg border-2 border-white shadow-md cursor-pointer shrink-0 ring-1 ring-neutral-200 hover:ring-primary/30 transition-all"
                  style={{ backgroundColor: c.value }}
                >
                  <input
                    type="color"
                    value={c.value}
                    onChange={(e) => c.set(e.target.value)}
                    className="sr-only"
                  />
                </label>
                <Input
                  value={c.value}
                  onChange={(e) => c.set((e.target as HTMLInputElement).value)}
                  className="font-mono text-sm"
                  maxLength={7}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Live palette preview */}
        <div className="mt-6 p-4 bg-neutral-50 rounded-xl border border-neutral-100">
          <p className="text-[10px] font-bold tracking-widest uppercase text-neutral-400 mb-3">Palette Preview</p>
          <div className="flex gap-2">
            {colorFields.map((c) => (
              <div key={c.label} className="flex-1 rounded-lg h-10" style={{ backgroundColor: c.value }} title={c.label} />
            ))}
            <div className="flex-1 rounded-lg h-10 bg-white border border-neutral-200" title="Background" />
            <div className="flex-1 rounded-lg h-10 bg-neutral-50 border border-neutral-200" title="Surface" />
          </div>
          <div className="flex gap-2 mt-2">
            {colorFields.map((c) => (
              <div key={c.label} className="flex-1 text-center text-[10px] text-neutral-400 font-medium">{c.label}</div>
            ))}
            <div className="flex-1 text-center text-[10px] text-neutral-400 font-medium">BG</div>
            <div className="flex-1 text-center text-[10px] text-neutral-400 font-medium">Surface</div>
          </div>
        </div>
      </SectionCard>

      {/* Logo */}
      <SectionCard title="Logo & Identity" description="Upload separate versions for light and dark backgrounds.">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
          {[
            { label: "Light Background Logo", ref: logoLightRef, value: logoLight, set: setLogoLight, bg: "bg-white" },
            { label: "Dark Background Logo", ref: logoDarkRef, value: logoDark, set: setLogoDark, bg: "bg-[#231F1C]" },
          ].map((item) => (
            <div key={item.label}>
              <input ref={item.ref} type="file" accept="image/*" className="hidden" onChange={handleImage(item.set)} />
              <label className="text-sm font-medium text-neutral-700 block mb-2">{item.label}</label>
              <div
                onClick={() => item.ref.current?.click()}
                className={cn(
                  "w-full h-28 rounded-xl border-2 flex items-center justify-center cursor-pointer transition-all group relative overflow-hidden",
                  item.value ? "border-neutral-200" : "border-dashed border-neutral-200 hover:border-primary/30",
                  item.bg
                )}
              >
                {item.value ? (
                  <>
                    <Image src={item.value} alt={item.label} fill style={{ objectFit: "contain" }} sizes="280px" className="p-4" />
                    <div className="absolute inset-0 bg-neutral-900/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white text-xs font-bold bg-neutral-900/60 px-3 py-1.5 rounded-lg">Replace</span>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center text-neutral-300 group-hover:text-primary/50 transition-colors">
                    <Icon icon="mdi:image-plus-outline" width={28} className="mb-1.5" />
                    <span className="text-xs font-medium">Upload Logo</span>
                    <span className="text-[10px] mt-0.5">SVG or PNG</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Favicon */}
        <div>
          <input ref={faviconRef} type="file" accept="image/*" className="hidden" onChange={handleImage(setFavicon)} />
          <label className="text-sm font-medium text-neutral-700 block mb-2">Favicon</label>
          <div className="flex items-center gap-4">
            <div
              onClick={() => faviconRef.current?.click()}
              className="w-16 h-16 rounded-xl border-2 border-dashed border-neutral-200 hover:border-primary/30 flex items-center justify-center cursor-pointer bg-neutral-50 hover:bg-primary/5 transition-all relative overflow-hidden shrink-0 group"
            >
              {favicon ? (
                <>
                  <Image src={favicon} alt="Favicon" fill style={{ objectFit: "contain" }} sizes="64px" className="p-1.5" />
                  <div className="absolute inset-0 bg-neutral-900/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Icon icon="mdi:pencil-outline" width={14} className="text-white" />
                  </div>
                </>
              ) : (
                <Icon icon="mdi:image-plus-outline" width={20} className="text-neutral-300 group-hover:text-primary transition-colors" />
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-700">Browser Tab Icon</p>
              <p className="text-xs text-neutral-400 mt-0.5">32×32px or 64×64px ICO, PNG, or SVG.</p>
            </div>
          </div>
        </div>
      </SectionCard>

      {/* Typography */}
      <SectionCard title="Typography" description="Set the primary typeface used across the site.">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {fonts.map((font) => (
            <button
              key={font}
              type="button"
              onClick={() => setSelectedFont(font)}
              className={cn(
                "p-3 rounded-xl border-2 text-left transition-all",
                selectedFont === font
                  ? "border-primary bg-primary/5"
                  : "border-neutral-100 bg-white hover:border-neutral-300"
              )}
            >
              <div className={cn("text-lg font-bold mb-0.5", selectedFont === font ? "text-primary" : "text-neutral-700")}>
                Aa
              </div>
              <div className="text-[10px] font-medium text-neutral-400 leading-snug">{font}</div>
              {selectedFont === font && (
                <div className="mt-1.5">
                  <Icon icon="mdi:check-circle" width={14} className="text-primary" />
                </div>
              )}
            </button>
          ))}
        </div>
      </SectionCard>

    </div>
  );
}

/* ─── PROFILE TAB ────────────────────────────────────────────── */
function ProfileTab() {
  return (
    <div className="space-y-6">
      <SectionCard title="Personal Information" description="Update your account details and public profile.">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
          <Input label="First Name" defaultValue="Alex" />
          <Input label="Last Name" defaultValue="Morgan" />
        </div>
        <Input label="Email Address" defaultValue="alex.morgan@neeza.com" className="mb-5" />
        <Input label="Phone Number" defaultValue="+250 788 000 000" />
      </SectionCard>
    </div>
  );
}

/* ─── MAIN PAGE ──────────────────────────────────────────────── */
export default function SettingsPage() {
  const tabs = [
    { id: "Profile Settings", icon: "mdi:account-outline" },
    { id: "Security", icon: "mdi:shield-lock-outline" },
    { id: "Site-wide SEO", icon: "mdi:magnify" },
    { id: "Branding", icon: "mdi:palette-outline" },
  ];
  const [activeTab, setActiveTab] = useState("Profile Settings");

  return (
    <>
      <AdminHeader title="Settings" />

      <div className="max-w-4xl mx-auto py-8 px-8 pb-32">
        {/* Tabs */}
        <div className="flex items-center gap-1 border-b border-neutral-200 mb-10 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "pb-3 pt-1 px-4 text-sm font-bold tracking-wide transition-colors relative whitespace-nowrap flex items-center gap-2",
                activeTab === tab.id ? "text-primary" : "text-neutral-400 hover:text-neutral-700"
              )}
            >
              <Icon icon={tab.icon} width={16} />
              {tab.id}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-full" />
              )}
            </button>
          ))}
        </div>

        {activeTab === "Profile Settings" && <ProfileTab />}
        {activeTab === "Security"         && <SecurityTab />}
        {activeTab === "Site-wide SEO"    && <SeoTab />}
        {activeTab === "Branding"         && <BrandingTab />}
      </div>

      {/* Sticky save bar */}
      <div className="fixed bottom-0 right-0 left-64 bg-white/80 backdrop-blur-md border-t border-neutral-100 p-4 z-20">
        <div className="max-w-4xl mx-auto w-full flex justify-end gap-4 px-8">
          <Button variant="ghost" className="text-neutral-500 hover:text-neutral-900 font-medium">
            Discard Changes
          </Button>
          <Button className="shadow-sm font-medium px-8">
            Save Changes
          </Button>
        </div>
      </div>
    </>
  );
}
