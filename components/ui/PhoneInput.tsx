"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { getCountries, getCountryCallingCode, type CountryCode } from "libphonenumber-js";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

/* ---------------------------------------------------------- */
/* Types                                                       */
/* ---------------------------------------------------------- */
interface PhoneInputProps {
  label?: string;
  value: string;           // formatted full phone: "+250 788..."
  onChange: (full: string) => void;
  required?: boolean;
  error?: string;
  placeholder?: string;
  className?: string;
}

/* ---------------------------------------------------------- */
/* Country data                                               */
/* ---------------------------------------------------------- */
interface CountryEntry {
  code: CountryCode;
  dial: string;
  name: string;
  flag: string;
}

function flagEmoji(countryCode: string): string {
  return countryCode
    .toUpperCase()
    .split("")
    .map((c) => String.fromCodePoint(c.charCodeAt(0) - 65 + 0x1f1e6))
    .join("");
}

// Stable reference — built once
const ALL_COUNTRIES: CountryEntry[] = getCountries()
  .map((code) => {
    try {
      const dial = getCountryCallingCode(code);
      const name = new Intl.DisplayNames(["en"], { type: "region" }).of(code) ?? code;
      return { code, dial: `+${dial}`, name, flag: flagEmoji(code) };
    } catch {
      return null;
    }
  })
  .filter(Boolean)
  .sort((a, b) => a!.name.localeCompare(b!.name)) as CountryEntry[];

// Default dial code shown
const DEFAULT_CODE = ALL_COUNTRIES.find((c) => c.code === "RW") ?? ALL_COUNTRIES[0];

/* ---------------------------------------------------------- */
/* Component                                                  */
/* ---------------------------------------------------------- */
export function PhoneInput({
  label,
  value,
  onChange,
  required,
  error,
  placeholder = "7XX XXX XXX",
  className,
}: PhoneInputProps) {
  // Try to parse current dial from value
  const parseDialFromValue = (): CountryEntry => {
    for (const c of ALL_COUNTRIES) {
      if (value.startsWith(c.dial + " ") || value.startsWith(c.dial)) {
        return c;
      }
    }
    return DEFAULT_CODE;
  };

  const [selected, setSelected] = useState<CountryEntry>(parseDialFromValue);
  const [localNumber, setLocalNumber] = useState(
    value.startsWith(selected.dial) ? value.slice(selected.dial.length).trim() : value
  );
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  // Close on outside click
  useEffect(() => {
    function onOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onOutside);
    return () => document.removeEventListener("mousedown", onOutside);
  }, []);

  useEffect(() => {
    if (open) setTimeout(() => searchRef.current?.focus(), 50);
  }, [open]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return ALL_COUNTRIES;
    return ALL_COUNTRIES.filter((c) => c.name.toLowerCase().includes(q) || c.dial.includes(q) || c.code.toLowerCase().includes(q));
  }, [search]);

  function selectCountry(c: CountryEntry) {
    setSelected(c);
    setOpen(false);
    setSearch("");
    onChange(`${c.dial} ${localNumber}`.trim());
  }

  function handleNumber(e: React.ChangeEvent<HTMLInputElement>) {
    const num = e.target.value.replace(/[^\d\s\-()]/g, "");
    setLocalNumber(num);
    onChange(`${selected.dial} ${num}`.trim());
  }

  const inputBase = cn(
    "flex w-full rounded-md border bg-white px-3 py-2 text-sm placeholder:text-neutral-400 transition-colors",
    error
      ? "border-red-400 focus-visible:ring-red-300"
      : "border-neutral-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
  );

  return (
    <div className={cn("w-full", className)}>
      {label && (
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      <div className="flex gap-0 relative" ref={dropdownRef}>
        {/* Flag + dial-code picker */}
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className={cn(
            "flex items-center gap-1.5 px-3 py-2 bg-white border rounded-l-md border-r-0 text-sm font-medium whitespace-nowrap shrink-0 transition-colors hover:bg-neutral-50",
            error ? "border-red-400" : "border-neutral-300"
          )}
        >
          <span className="text-lg leading-none">{selected.flag}</span>
          <span className="text-neutral-600">{selected.dial}</span>
          <ChevronDown className={cn("w-3.5 h-3.5 text-neutral-400 transition-transform", open && "rotate-180")} />
        </button>

        {/* Number input */}
        <input
          type="tel"
          value={localNumber}
          onChange={handleNumber}
          placeholder={placeholder}
          required={required}
          className={cn(inputBase, "rounded-l-none flex-1")}
        />

        {/* Dropdown */}
        {open && (
          <div className="absolute left-0 top-full mt-1 z-50 w-72 bg-white border border-neutral-200 rounded-xl shadow-xl overflow-hidden">
            <div className="p-2 border-b border-neutral-100">
              <input
                ref={searchRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search country..."
                className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <ul className="max-h-56 overflow-y-auto">
              {filtered.length === 0 && (
                <li className="px-4 py-3 text-sm text-neutral-400 text-center">No results</li>
              )}
              {filtered.map((c) => (
                <li key={c.code}>
                  <button
                    type="button"
                    onClick={() => selectCountry(c)}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left hover:bg-neutral-50 transition-colors",
                      selected.code === c.code && "bg-primary/5 font-medium text-primary"
                    )}
                  >
                    <span className="text-base shrink-0">{c.flag}</span>
                    <span className="flex-1 truncate">{c.name}</span>
                    <span className="text-neutral-400 shrink-0 text-xs">{c.dial}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      {error && <p className="mt-1.5 text-xs text-red-500 font-medium">{error}</p>}
    </div>
  );
}
