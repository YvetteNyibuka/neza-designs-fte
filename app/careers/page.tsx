"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { getCareers } from "@/lib/api/careers";
import { applyForCareer } from "@/lib/api/applications";
import { toast } from "sonner";
import { toastApiErrors, parseApiFieldErrors } from "@/lib/apiErrorToast";
import { cn } from "@/lib/utils";
import type { Career } from "@/types";
import { PhoneInput } from "@/components/ui/PhoneInput";
import { FileUpload } from "@/components/ui/FileUpload";

type ApplyForm = {
  applicantName: string;
  email: string;
  phone: string;
  linkedIn: string;
  coverLetterUrl: string;
  resumeUrl: string;
};

const emptyForm: ApplyForm = {
  applicantName: "",
  email: "",
  phone: "",
  linkedIn: "",
  coverLetterUrl: "",
  resumeUrl: "",
};

export default function CareersPage() {
  const [careers, setCareers] = useState<Career[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<Career | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<ApplyForm>(emptyForm);
  const [applyFieldErrors, setApplyFieldErrors] = useState<Record<string, string>>({});
  const [filterDept, setFilterDept] = useState("All");
  const [filterType, setFilterType] = useState<Career["employmentType"] | "All">("All");

  useEffect(() => {
    getCareers({ limit: 100, status: "Open" })
      .then((res) => setCareers(res.data?.data ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const grouped = useMemo(() => {
    const filtered = careers.filter((c) => {
      if (filterDept !== "All" && c.department !== filterDept) return false;
      if (filterType !== "All" && c.employmentType !== filterType) return false;
      return true;
    });
    return filtered.reduce<Record<string, Career[]>>((acc, item) => {
      const key = item.department || "General";
      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
      return acc;
    }, {});
  }, [careers, filterDept, filterType]);

  const departments = useMemo(() => ["All", ...Array.from(new Set(careers.map((c) => c.department).filter(Boolean)))], [careers]);
  const employmentTypes: Array<Career["employmentType"] | "All"> = ["All", "Full-time", "Part-time", "Contract", "Internship"];

  function openApply(job: Career) {
    setSelectedJob(job);
    setForm(emptyForm);
    setApplyFieldErrors({});
    setModalOpen(true);
  }

  async function handleSubmit() {
    if (!selectedJob) return;
    if (!form.applicantName.trim() || !form.email.trim()) {
      toast.error("Name and email are required");
      return;
    }
    if (!form.resumeUrl) {
      toast.error("CV / Resume upload is required");
      return;
    }
    if (!form.coverLetterUrl) {
      toast.error("Cover letter upload is required");
      return;
    }
    setSubmitting(true);
    try {
      await applyForCareer(selectedJob.slug, {
        applicantName: form.applicantName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || undefined,
        linkedIn: form.linkedIn.trim() || undefined,
        resumeUrl: form.resumeUrl,
        coverLetter: form.coverLetterUrl,
      });
      toast.success("Application submitted! We will be in touch.");
      setModalOpen(false);
    } catch (err: unknown) {
      setApplyFieldErrors(parseApiFieldErrors(err));
      toastApiErrors(err, "Failed to submit application. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function field(key: keyof ApplyForm, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <div className="flex flex-col flex-1 w-full bg-neutral-50">
      {/* Hero */}
      <section className="relative w-full h-screen flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop"
            alt="Careers background"
            fill
            sizes="100vw"
            style={{ objectFit: "cover" }}
            priority
          />
          <div className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm" />
        </div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <p className="text-accent text-xs font-bold tracking-widest uppercase mb-4">Join Our Team</p>
          <h1 className="font-heading text-4xl md:text-6xl font-bold text-white mb-6">
            Build Your Career at NEEZA
          </h1>
          <p className="text-lg text-white/80 font-light mb-8 max-w-2xl mx-auto">
            Join our team of architects, engineers, and strategists shaping resilient cities across Africa.
          </p>
          <Button size="lg" className="h-14 px-8 text-base" onClick={() => document.getElementById("opportunities")?.scrollIntoView({ behavior: "smooth" })}>
            View Open Roles
          </Button>
        </div>
      </section>

      {/* Filters + Jobs */}
      <section id="opportunities" className="py-16">
        <div className="container mx-auto px-4 md:px-8 max-w-7xl">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-10">
            <div className="flex-1">
              <label className="block text-xs font-bold tracking-widest uppercase text-neutral-500 mb-2">Department</label>
              <select
                value={filterDept}
                onChange={(e) => setFilterDept(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-white text-sm font-medium text-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary/30 cursor-pointer"
              >
                {departments.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-xs font-bold tracking-widest uppercase text-neutral-500 mb-2">Employment Type</label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as Career["employmentType"] | "All")}
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-white text-sm font-medium text-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary/30 cursor-pointer"
              >
                {employmentTypes.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-10">
            {loading ? <p className="text-neutral-500">Loading opportunities...</p> : null}
            {!loading && Object.keys(grouped).length === 0 ? (
              <div className="bg-white border border-neutral-200 rounded-xl p-8 text-neutral-600">
                No open opportunities match your filters. You can still send your CV to <a href="mailto:info.neeza@gmail.com" className="text-primary underline">info.neeza@gmail.com</a>.
              </div>
            ) : null}

            {Object.entries(grouped).map(([department, jobs]) => (
              <div key={department}>
                <h2 className="font-heading text-2xl font-bold text-neutral-900 mb-4">{department}</h2>
                <div className="space-y-4">
                  {jobs.map((job) => (
                    <article key={job._id} className="bg-white border border-neutral-200 rounded-xl p-6">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-xl text-neutral-900">{job.title}</h3>
                          <p className="text-sm text-neutral-500 mt-1">
                            {job.location} · {job.employmentType} · {job.experienceLevel}
                          </p>
                          <p className="text-neutral-600 mt-3 leading-relaxed">{job.description}</p>
                          {job.requirements.length > 0 && (
                            <ul className="mt-4 space-y-1 list-disc list-inside text-sm text-neutral-600">
                              {job.requirements.slice(0, 3).map((r, i) => (
                                <li key={i}>{r}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                        <div className="flex gap-2 shrink-0">
                          <Button onClick={() => openApply(job)}>Apply Now</Button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Apply Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={selectedJob ? `Apply - ${selectedJob.title}` : "Apply"}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Input
                label="Full Name *"
                placeholder="Your full name"
                value={form.applicantName}
                onChange={(e) => field("applicantName", e.target.value)}
              />
              {applyFieldErrors.applicantName && <p className="text-red-500 text-xs mt-1">{applyFieldErrors.applicantName}</p>}
            </div>
            <div>
              <Input
                label="Email Address *"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => field("email", e.target.value)}
              />
              {applyFieldErrors.email && <p className="text-red-500 text-xs mt-1">{applyFieldErrors.email}</p>}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <PhoneInput
              label="Phone (optional)"
              value={form.phone}
              onChange={(v) => field("phone", v)}
            />
            <Input
              label="LinkedIn Profile (optional)"
              placeholder="https://linkedin.com/in/..."
              value={form.linkedIn}
              onChange={(e) => field("linkedIn", e.target.value)}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FileUpload
              label="CV / Resume"
              required
              accept=".pdf,.doc,.docx"
              folder="resumes"
              value={form.resumeUrl}
              onChange={(url) => field("resumeUrl", url)}
              error={applyFieldErrors.resumeUrl}
            />
            <FileUpload
              label="Cover Letter"
              required
              accept=".pdf,.doc,.docx"
              folder="cover-letters"
              value={form.coverLetterUrl}
              onChange={(url) => field("coverLetterUrl", url)}
              error={applyFieldErrors.coverLetter}
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setModalOpen(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={submitting}>
              {submitting ? "Submitting..." : "Submit Application"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
