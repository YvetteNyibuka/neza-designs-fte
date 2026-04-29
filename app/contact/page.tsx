"use client";

import { useState } from "react";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PhoneInput } from "@/components/ui/PhoneInput";
import { submitContact } from "@/lib/api/contact";
import { toastApiErrors, toastValidationErrors } from "@/lib/apiErrorToast";
import { validateContactForm } from "@/lib/formValidation";
import { toast } from "sonner";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
};

export default function ContactPage() {
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const errors = validateContactForm(form);
    if (errors.length > 0) {
      toastValidationErrors(errors);
      return;
    }

    setSubmitting(true);
    try {
      await submitContact({
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim() || undefined,
        subject: form.subject.trim(),
        message: form.message.trim(),
      });
      toast.success("Your inquiry has been sent successfully.");
      setForm(initialForm);
    } catch (err: unknown) {
      toastApiErrors(err, "Failed to send inquiry");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col flex-1 w-full bg-neutral-50">
      <section className="relative pt-40 pb-24 bg-[#231F1C]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(183,94,26,0.35),transparent_40%),radial-gradient(circle_at_80%_0%,rgba(218,161,25,0.2),transparent_35%)]" />
        <div className="relative container mx-auto px-4 md:px-8 max-w-7xl text-center">
          <h1 className="font-heading text-4xl md:text-6xl font-bold text-white mb-6">Start Your Project Inquiry</h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Share your vision and our team will get back to you with a tailored roadmap for architecture, engineering, or project delivery.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 md:px-8 max-w-7xl grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2 bg-white border border-neutral-100 rounded-2xl p-8 shadow-sm">
            <h2 className="font-heading text-2xl font-bold text-neutral-900 mb-6">Contact Details</h2>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-bold tracking-widest uppercase text-neutral-400">Phone</p>
                  <p className="text-sm text-neutral-700 mt-1">+250 788 548 567</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-bold tracking-widest uppercase text-neutral-400">Email</p>
                  <p className="text-sm text-neutral-700 mt-1">info.neeza@gmail.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-bold tracking-widest uppercase text-neutral-400">Office</p>
                  <p className="text-sm text-neutral-700 mt-1 leading-relaxed">
                    Trinity Plaza | Second floor,
                    <br />
                    KG 19 Ave, Kibagabaga, Rwanda
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3 bg-white border border-neutral-100 rounded-2xl p-8 shadow-sm">
            <h2 className="font-heading text-2xl font-bold text-neutral-900 mb-6">Send an Inquiry</h2>

            <form className="space-y-4" onSubmit={onSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  value={form.name}
                  onChange={(e) => setForm((prev) => ({ ...prev, name: (e.target as HTMLInputElement).value }))}
                  placeholder="Your full name"
                />
                <Input
                  label="Email Address"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((prev) => ({ ...prev, email: (e.target as HTMLInputElement).value }))}
                  placeholder="you@example.com"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <PhoneInput
                  label="Phone (optional)"
                  value={form.phone}
                  onChange={(v) => setForm((prev) => ({ ...prev, phone: v }))}
                />
                <Input
                  label="Subject"
                  value={form.subject}
                  onChange={(e) => setForm((prev) => ({ ...prev, subject: (e.target as HTMLInputElement).value }))}
                  placeholder="What can we help you with?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Message</label>
                <textarea
                  rows={7}
                  value={form.message}
                  onChange={(e) => setForm((prev) => ({ ...prev, message: e.target.value }))}
                  placeholder="Tell us about your project goals, timelines, and requirements..."
                  className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                />
              </div>

              <Button type="submit" className="w-full md:w-auto" disabled={submitting}>
                <Send className="w-4 h-4 mr-2" />
                {submitting ? "Sending..." : "Submit Inquiry"}
              </Button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
