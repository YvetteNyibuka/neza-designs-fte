import Link from "next/link";

export default function TermsPage() {
  return (
    <main className="flex flex-col flex-1 w-full bg-white pt-36 pb-24">
      <section className="container mx-auto px-4 md:px-8 max-w-4xl">
        <h1 className="font-heading text-4xl md:text-5xl font-bold text-neutral-900 mb-6">Terms of Service</h1>
        <p className="text-neutral-600 leading-relaxed mb-6">
          By using NEEZA websites and services, you agree to use our content and communication channels lawfully and respectfully.
        </p>
        <p className="text-neutral-600 leading-relaxed mb-6">
          Project timelines, fees, and deliverables are governed by signed contracts. Website content is informational and may be updated
          as services evolve.
        </p>
        <p className="text-neutral-600 leading-relaxed mb-10">
          For commercial engagements or legal clarification, please reach out to our team.
        </p>
        <Link href="/contact" className="text-primary font-medium hover:text-primary-dark transition-colors">
          Contact us about terms
        </Link>
      </section>
    </main>
  );
}
