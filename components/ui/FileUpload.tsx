"use client";

import { useRef, useState } from "react";
import { UploadCloud, X, FileText, Loader2 } from "lucide-react";
import { uploadFile } from "@/lib/api/upload";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  label: string;
  value: string;          // uploaded URL
  onChange: (url: string) => void;
  accept?: string;        // e.g. ".pdf,.doc,.docx"
  folder?: string;
  required?: boolean;
  error?: string;
}

export function FileUpload({
  label,
  value,
  onChange,
  accept = ".pdf,.doc,.docx",
  folder = "documents",
  required,
  error,
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [fileName, setFileName] = useState("");

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError("");
    setFileName(file.name);
    setUploading(true);
    try {
      const result = await uploadFile(file, folder);
      onChange(result.url);
    } catch {
      setUploadError("Upload failed. Please try again.");
      setFileName("");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function clear() {
    onChange("");
    setFileName("");
    setUploadError("");
  }

  const displayName = fileName || (value ? value.split("/").pop()?.split("?")[0] : "");

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-neutral-700 mb-1.5">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>

      {value ? (
        /* Uploaded state */
        <div className={cn(
          "flex items-center gap-3 p-3 border rounded-lg bg-green-50 border-green-200",
          error && "border-red-400 bg-red-50"
        )}>
          <FileText className="w-5 h-5 text-green-600 shrink-0" />
          <span className="flex-1 text-sm text-green-800 truncate font-medium">{displayName || "File uploaded"}</span>
          <button
            type="button"
            onClick={clear}
            className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-green-200 text-green-700 transition-colors shrink-0"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        /* Upload area */
        <div
          onClick={() => !uploading && inputRef.current?.click()}
          className={cn(
            "flex flex-col items-center justify-center gap-2 p-5 border-2 border-dashed rounded-lg cursor-pointer transition-colors",
            uploading ? "border-primary/40 bg-primary/5 cursor-wait" : "border-neutral-200 bg-neutral-50 hover:border-primary/40 hover:bg-primary/5",
            error && !uploading && "border-red-300 bg-red-50"
          )}
        >
          {uploading ? (
            <>
              <Loader2 className="w-7 h-7 text-primary animate-spin" />
              <span className="text-xs text-primary font-medium">Uploading…</span>
            </>
          ) : (
            <>
              <UploadCloud className="w-7 h-7 text-neutral-400" />
              <span className="text-xs text-neutral-600 font-medium">Click to upload</span>
              <span className="text-xs text-neutral-400">{accept.replace(/\./g, "").replace(/,/g, ", ").toUpperCase()}</span>
            </>
          )}
        </div>
      )}

      {(uploadError || error) && (
        <p className="mt-1 text-xs text-red-500">{uploadError || error}</p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={handleFile}
      />
    </div>
  );
}
