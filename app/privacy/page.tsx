import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main className="flex flex-col flex-1 w-full bg-white pt-36 pb-24">
      <section className="container mx-auto px-4 md:px-8 max-w-4xl">
        <h1 className="font-heading text-4xl md:text-5xl font-bold text-neutral-900 mb-6">Privacy Policy</h1>
        <p className="text-neutral-600 leading-relaxed mb-6">
          NEEZA respects your privacy. We collect only the information needed to respond to inquiries, deliver project services,
          and share requested updates such as newsletters.
        </p>
        <p className="text-neutral-600 leading-relaxed mb-6">
          Personal data such as your name, email, phone number, and project details is used solely for communication, service delivery,
          and business operations. We do not sell your personal information.
        </p>
        <p className="text-neutral-600 leading-relaxed mb-10">
          To request data updates or deletion, please contact our team directly.
        </p>
        <Link href="/contact" className="text-primary font-medium hover:text-primary-dark transition-colors">
          Contact us about privacy matters
        </Link>
      </section>
    </main>
  );
}
