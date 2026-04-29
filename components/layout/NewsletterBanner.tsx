"use client";

import { useState } from "react";
import { Send, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { subscribeNewsletter } from "@/lib/api/newsletter";

type Status = "idle" | "loading" | "success" | "error";

export function NewsletterBanner() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    try {
      const res = await subscribeNewsletter(email);
      setStatus("success");
      setMessage(res.message);
      setEmail("");
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "Something went wrong. Please try again.";
      setStatus("error");
      setMessage(msg);
    }
  }

  return (
    <div className="bg-white rounded-3xl p-12 md:p-20 text-center border border-neutral-100 shadow-sm max-w-4xl mx-auto">
      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
        <Send className="w-6 h-6" />
      </div>
      <h2 className="font-heading text-3xl font-bold text-neutral-900 mb-4">Stay Informed</h2>
      <p className="text-neutral-500 mb-8 max-w-md mx-auto">
        Subscribe to our monthly newsletter for exclusive architectural insights, project updates, and sustainability trends.
      </p>

      {status === "success" ? (
        <div className="flex flex-col items-center gap-3 text-primary">
          <CheckCircle2 className="w-10 h-10" />
          <p className="font-medium text-base">{message}</p>
        </div>
      ) : (
        <>
          <form
            className="max-w-md mx-auto relative flex items-center"
            onSubmit={handleSubmit}
          >
            <Input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (status === "error") setStatus("idle");
              }}
              required
              disabled={status === "loading"}
              className="h-14 pr-36 rounded-full border-neutral-200 bg-neutral-50 shadow-inner"
            />
            <Button
              type="submit"
              disabled={status === "loading"}
              className="absolute right-1 rounded-full h-12 px-6 shadow-md"
            >
              {status === "loading" ? "Subscribing…" : "Subscribe"}
            </Button>
          </form>
          {status === "error" && (
            <p className="text-red-500 text-sm mt-3">{message}</p>
          )}
        </>
      )}

      <p className="text-[10px] text-neutral-400 uppercase tracking-widest mt-4 text-center">
        Zero spam. Unsubscribe anytime.
      </p>
    </div>
  );
}
