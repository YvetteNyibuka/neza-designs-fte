"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, XCircle } from "lucide-react";
import api from "@/lib/axios";

type Status = "loading" | "success" | "error";

function UnsubscribePageContent() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<Status>("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const email = searchParams.get("email");
    if (!email) {
      setStatus("error");
      setMessage("No email address provided.");
      return;
    }

    api
      .post("/newsletter/unsubscribe", { email })
      .then(() => {
        setStatus("success");
        setMessage("You've been unsubscribed successfully. You won't receive any more emails from us.");
      })
      .catch(() => {
        setStatus("error");
        setMessage("Something went wrong. Please try again or contact us directly.");
      });
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
      <div className="bg-white rounded-3xl border border-neutral-100 shadow-sm p-12 max-w-md w-full text-center">
        {status === "loading" && (
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-full bg-neutral-100 animate-pulse mx-auto" />
            <p className="text-neutral-500 text-sm">Processing your request…</p>
          </div>
        )}
        {status === "success" && (
          <>
            <CheckCircle2 className="w-14 h-14 text-green-500 mx-auto mb-5" />
            <h1 className="font-heading text-2xl font-bold text-neutral-900 mb-3">Unsubscribed</h1>
            <p className="text-neutral-500 text-sm leading-relaxed mb-8">{message}</p>
            <Link
              href="/"
              className="inline-block bg-primary text-white px-8 py-3 rounded-full font-semibold text-sm hover:bg-primary/90 transition-colors"
            >
              Back to NEEZA
            </Link>
          </>
        )}
        {status === "error" && (
          <>
            <XCircle className="w-14 h-14 text-red-400 mx-auto mb-5" />
            <h1 className="font-heading text-2xl font-bold text-neutral-900 mb-3">Oops</h1>
            <p className="text-neutral-500 text-sm leading-relaxed mb-8">{message}</p>
            <Link
              href="/"
              className="inline-block bg-primary text-white px-8 py-3 rounded-full font-semibold text-sm hover:bg-primary/90 transition-colors"
            >
              Back to NEEZA
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default function UnsubscribePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4 text-sm text-neutral-500">Loading...</div>}>
      <UnsubscribePageContent />
    </Suspense>
  );
}
