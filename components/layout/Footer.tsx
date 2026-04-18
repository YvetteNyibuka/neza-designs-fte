"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mail, MapPin, Phone } from "lucide-react";

export function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;

  return (
    <footer className="bg-[#150F0B] text-neutral-300 py-16">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Brand Col */}
          <div className="space-y-6">
            <div className="flex flex-col">
              <span className="font-heading font-bold text-3xl tracking-tighter leading-none text-primary">
                NEEZA
              </span>
              <span className="text-xs font-bold tracking-widest uppercase text-neutral-400 mt-1">
                Designs Ltd.
              </span>
            </div>
            <p className="text-sm leading-relaxed max-w-xs text-neutral-400">
              East Africa's premier architecture and engineering consultancy. Designing the skyline of tomorrow, today.
            </p>
          </div>

          {/* Company Col */}
          <div>
            <h4 className="text-white font-medium mb-6">Company</h4>
            <ul className="space-y-4 text-sm">
              <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/careers" className="hover:text-primary transition-colors">Careers</Link></li>
              <li><Link href="/blog" className="hover:text-primary transition-colors">News & Media</Link></li>
              <li><Link href="/sustainability" className="hover:text-primary transition-colors">Sustainability Report</Link></li>
            </ul>
          </div>

          {/* Services Col */}
          <div>
            <h4 className="text-white font-medium mb-6">Services</h4>
            <ul className="space-y-4 text-sm">
              <li><Link href="/services#architecture" className="hover:text-primary transition-colors">Architecture Design</Link></li>
              <li><Link href="/services#civil" className="hover:text-primary transition-colors">Civil Engineering</Link></li>
              <li><Link href="/services#urban" className="hover:text-primary transition-colors">Urban Planning</Link></li>
              <li><Link href="/services#interior" className="hover:text-primary transition-colors">Interior Design</Link></li>
            </ul>
          </div>

          {/* Contact Col */}
          <div>
            <h4 className="text-white font-medium mb-6">Contact</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <span>+250 788 548 567</span>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <span>info.neeza@gmail.com</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                <span className="leading-snug">Trinity Plaza | Second floor,<br/>KG 19 Ave, Kibagabaga, RWANDA</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-neutral-800 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-neutral-500">
          <p>&copy; {new Date().getFullYear()} NEEZA Designs Ltd. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
