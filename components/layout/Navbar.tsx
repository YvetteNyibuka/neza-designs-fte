"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useScrolled } from "@/hooks/useScrolled";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { useBranding } from "@/components/layout/BrandingProvider";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "/about" },
  { name: "Services", href: "/services" },
  { name: "Projects", href: "/projects" },
  { name: "Publications", href: "/publications" },
  { name: "Careers", href: "/careers" },
  { name: "Blog", href: "/blog" },
  { name: "Contact", href: "/contact" },
];

export function Navbar() {
  const isScrolled = useScrolled(20);
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { branding } = useBranding();

  if (pathname?.startsWith("/admin")) return null;

  // Keep hero behavior by default and force solid only on legal/contact pages.
  const solidOnlyRoutes = ["/privacy", "/terms", "/contact"];
  const forceSolid = pathname
    ? solidOnlyRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`))
    : false;
  const isSolid = forceSolid || isScrolled;

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isSolid
          ? "bg-white/95 backdrop-blur-md shadow-sm py-4 text-neutral-900"
          : "bg-transparent py-6 text-white" // Assumes hero is dark. If not, we adjust.
      )}
    >
      <div className="container mx-auto px-4 md:px-8 max-w-7xl flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          {/* Logo placeholder - replace with actual SVG later */}
          <div className="flex flex-col">
           <Image 
             src={branding.logoLight}
             alt="NEEZA Logo" 
             width={100} 
             height={100} 
           />
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={cn(
                "text-base lg:text-lg font-medium transition-colors relative",
                pathname === link.href
                  ? (isSolid ? "text-primary" : "text-accent")
                  : (isSolid ? "text-neutral-700" : "text-white hover:text-accent")
              )}
            >
              {link.name}
              {pathname === link.href && (
                <span className={cn(
                  "absolute -bottom-1.5 left-0 w-full h-0.5 rounded-full transition-colors duration-300",
                  isSolid ? "bg-primary" : "bg-accent"
                )} />
              )}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          <Link href="/contact">
            <Button
              variant={isSolid ? "default" : "outline"}
              className={cn(
                "rounded-md",
                !isSolid && "text-white border-white hover:bg-white hover:text-neutral-900"
              )}
            >
              Send Inquiry
            </Button>
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className={cn("w-6 h-6", isSolid ? "text-neutral-900" : "text-white")} />
          ) : (
            <Menu className={cn("w-6 h-6", isSolid ? "text-neutral-900" : "text-white")} />
          )}
        </button>
      </div>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg border-t border-neutral-100 py-4 px-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={cn(
                "p-2 text-sm font-medium rounded-md",
                pathname === link.href
                  ? "bg-primary/5 text-primary"
                  : "text-neutral-700 hover:bg-neutral-50"
              )}
            >
              {link.name}
            </Link>
          ))}
          <Link href="/contact" onClick={() => setMobileMenuOpen(false)}>
            <Button className="w-full mt-4">Send Inquiry</Button>
          </Link>
        </div>
      )}
    </header>
  );
}
