"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { UploadCloud, X, ImageIcon } from "lucide-react";
import { uploadImage } from "@/lib/api/upload";

interface ImageUploadProps {
  label: string;
  value: string;
  folder?: string;
  onChange: (url: string) => void;
}

export function ImageUpload({ label, value, folder = "general", onChange }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    setUploading(true);
    try {
      const result = await uploadImage(file, folder);
      onChange(result.url);
    } catch {
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div>
      <label className="block text-sm font-medium text-neutral-700 mb-1">{label}</label>
      <div className="border border-neutral-200 rounded-lg overflow-hidden">
        {value ? (
          <div className="relative w-full h-44 bg-neutral-100">
            <Image src={value} alt="preview" fill style={{ objectFit: "cover" }} unoptimized />
            <button
              type="button"
              onClick={() => onChange("")}
              className="absolute top-2 right-2 w-7 h-7 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div
            onClick={() => inputRef.current?.click()}
            className="w-full h-32 bg-neutral-50 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-neutral-100 transition-colors"
          >
            <ImageIcon className="w-8 h-8 text-neutral-300" />
            <span className="text-xs text-neutral-400">Click to upload an image</span>
          </div>
        )}
        <div className="p-3 flex items-center gap-3 border-t border-neutral-100 bg-white">
          <button
            type="button"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 rounded-lg text-sm font-medium text-neutral-700 transition-colors disabled:opacity-50"
          >
            <UploadCloud className="w-4 h-4" />
            {uploading ? "Uploading…" : value ? "Replace Image" : "Choose Image"}
          </button>
          {uploading && (
            <span className="text-xs text-primary animate-pulse">Uploading to Cloudinary…</span>
          )}
        </div>
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFile}
      />
    </div>
  );
}
