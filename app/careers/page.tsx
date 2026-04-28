"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { getCareers } from "@/lib/api/careers";
import { applyForCareer } from "@/lib/api/applications";
import { toast } from "sonner";
import { toastApiErrors, parseApiFieldErrors } from "@/lib/apiErrorToast";
import type { Career } from "@/types";

type ApplyForm = {
  applicantName: string;
  email: string;
  phone: string;
  linkedIn: string;
  coverLetter: string;
};

const emptyForm: ApplyForm = {
  applicantName: "",
  email: "",
  phone: "",
  linkedIn: "",
  coverLetter: "",
};

export default function CareersPage() {
  const [careers, setCareers] = useState<Career[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<Career | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<ApplyForm>(emptyForm);
  const [applyFieldErrors, setApplyFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    getCareers({ limit: 100, status: "Open" })
      .then((res) => setCareers(res.data?.data ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const grouped = useMemo(() => {
    return careers.reduce<Record<string, Career[]>>((acc, item) => {
      const key = item.department || "General";
      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
      return acc;
    }, {});
  }, [careers]);

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
    setSubmitting(true);
    try {
      await applyForCareer(selectedJob.slug, {
        applicantName: form.applicantName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || undefined,
        linkedIn: form.linkedIn.trim() || undefined,
        coverLetter: form.coverLetter.trim() || undefined,
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
      <section className="pt-40 pb-20 bg-white border-b border-neutral-200">
        <div className="container mx-auto px-4 md:px-8 max-w-7xl">
          <h1 className="font-heading text-4xl md:text-6xl font-bold text-neutral-900 mb-4">Careers at NEEZA</h1>
          <p className="text-neutral-600 text-lg max-w-3xl">
            Join our team of architects, engineers, and strategists shaping resilient cities across Africa.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4 md:px-8 max-w-7xl space-y-10">
          {loading ? <p className="text-neutral-500">Loading opportunities...</p> : null}
          {!loading && careers.length === 0 ? (
            <div className="bg-white border border-neutral-200 rounded-xl p-8 text-neutral-600">
              No open opportunities right now. You can still send your CV to info.neeza@gmail.com.
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
            <Input
              label="Phone (optional)"
              placeholder="+250 7XX XXX XXX"
              value={form.phone}
              onChange={(e) => field("phone", e.target.value)}
            />
            <Input
              label="LinkedIn Profile (optional)"
              placeholder="https://linkedin.com/in/..."
              value={form.linkedIn}
              onChange={(e) => field("linkedIn", e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Cover Letter (optional)</label>
            <textarea
              rows={5}
              placeholder="Tell us why you are a great fit for this role..."
              value={form.coverLetter}
              onChange={(e) => field("coverLetter", e.target.value)}
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
            />
          </div>
          <p className="text-xs text-neutral-400">
            You can also attach your CV by emailing{" "}
            <a href="mailto:careers@neeza.rw" className="text-primary underline">careers@neeza.rw</a>{" "}
            with the subject line &quot;{selectedJob?.title}&quot;.
          </p>
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
