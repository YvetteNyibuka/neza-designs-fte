"use client";

import { use, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { dummyPosts } from "@/lib/data";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatDate } from "@/lib/utils";
import { Icon } from "@iconify/react";
import { ArrowLeft, ArrowRight, Clock, Calendar } from "lucide-react";

/* ─── Reading progress bar ─────────────────────────────────── */
function ReadingProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className="fixed top-0 left-0 z-[100] h-0.5 bg-primary transition-[width] duration-75 ease-linear"
      style={{ width: `${progress}%` }}
    />
  );
}

/* ─── Page ──────────────────────────────────────────────────── */
export default function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const [copied, setCopied] = useState(false);

  const post = dummyPosts.find((p) => p.slug === slug);
  if (!post) notFound();

  const relatedPosts = dummyPosts.filter((p) => p.id !== post.id).slice(0, 3);
  const initials = post.author.name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("");

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <>
      <ReadingProgressBar />

      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative w-full h-[80vh] min-h-[560px] flex items-end">
        <div className="absolute inset-0 z-0">
          <Image
            src={post.imageUrl}
            alt={post.title}
            fill
            sizes="100vw"
            style={{ objectFit: "cover" }}
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/95 via-neutral-900/55 to-neutral-900/20" />
        </div>

        <div className="relative z-10 container mx-auto px-4 md:px-8 max-w-5xl pb-16 pt-32">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-white/50 text-xs mb-6">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-white transition-colors">
              Insights
            </Link>
            <span>/</span>
            <span className="text-white/80">{post.category}</span>
          </nav>

          <Badge className="bg-primary/20 text-primary border border-primary/40 backdrop-blur-sm text-[0.6rem] tracking-[0.15em] uppercase px-3 py-1 mb-5">
            {post.category}
          </Badge>

          <h1 className="font-heading text-3xl md:text-5xl lg:text-[3.25rem] font-bold text-white leading-tight mb-8 max-w-4xl">
            {post.title}
          </h1>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-5 text-sm text-white/70">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center font-heading font-bold text-white text-sm shrink-0">
                {initials}
              </div>
              <div>
                <div className="font-semibold text-white leading-snug">
                  {post.author.name}
                </div>
                <div className="text-xs text-white/55">{post.author.role}</div>
              </div>
            </div>

            <div className="w-px h-8 bg-white/20 hidden sm:block" />

            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-primary/70" />
              {formatDate(post.publishedAt)}
            </div>

            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-primary/70" />
              {post.readTime}
            </div>
          </div>
        </div>
      </section>

      {/* ── Article body ─────────────────────────────────── */}
      <div className="bg-neutral-50">
        <div className="container mx-auto px-4 md:px-8 max-w-6xl py-16">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-16">

            {/* Main content */}
            <article>
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-primary text-sm font-semibold mb-10 hover:gap-3 transition-all duration-200"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Insights
              </Link>

              {/* Lead */}
              <p className="text-xl text-neutral-700 leading-relaxed mb-10 font-light border-l-4 border-primary pl-6 italic">
                {post.excerpt}
              </p>

              {/* Section 1 */}
              <h2 className="font-heading text-2xl md:text-3xl font-bold text-neutral-900 mb-4 mt-12">
                Reimagining Urban Landscapes
              </h2>
              <p className="text-neutral-600 leading-relaxed mb-5">
                The rapid urbanisation of African cities demands a radical rethink
                of how we design and construct the built environment. At NEEZA
                Designs, our approach fuses the principles of biophilic design
                with the cultural narratives embedded in East African heritage —
                creating spaces that breathe, live, and connect communities to
                their roots.
              </p>
              <p className="text-neutral-600 leading-relaxed mb-5">
                Over the past decade, projects such as the Kigali Heights Complex
                have demonstrated that sustainability and luxury are not opposing
                forces. By integrating passive ventilation systems, vertical
                gardens, and locally sourced volcanic stone, we achieve structures
                that maintain thermal comfort without mechanical dependency —
                reducing energy consumption by up to 40%.
              </p>

              {/* Pull quote */}
              <blockquote className="my-12 p-8 bg-primary/5 border-l-4 border-primary rounded-r-2xl">
                <p className="font-heading text-xl md:text-2xl text-neutral-800 font-medium leading-relaxed italic">
                  &ldquo;The future of African architecture is not found in
                  mimicking Western models — it lies in amplifying what is
                  uniquely ours: community, land, and legacy.&rdquo;
                </p>
                <footer className="mt-4 text-sm text-primary font-bold">
                  — {post.author.name}, {post.author.role}
                </footer>
              </blockquote>

              {/* Section 2 */}
              <h2 className="font-heading text-2xl md:text-3xl font-bold text-neutral-900 mb-4 mt-12">
                The Engineering Behind the Vision
              </h2>
              <p className="text-neutral-600 leading-relaxed mb-5">
                Translating architectural ambition into structural reality requires
                an integrated engineering methodology. Our civil and structural
                teams work in tandem from the earliest concept stages, employing
                advanced finite element analysis and BIM to simulate load
                distribution, seismic response, and material behaviour before a
                single foundation is poured.
              </p>

              {/* In-article image */}
              <div className="relative h-72 md:h-96 w-full rounded-2xl overflow-hidden my-10">
                <Image
                  src="https://images.unsplash.com/photo-1541888086425-d81bb19240f5?q=80&w=2070&auto=format&fit=crop"
                  alt="Construction site"
                  fill
                  sizes="(max-width: 1024px) 100vw, 680px"
                  style={{ objectFit: "cover" }}
                />
                <div className="absolute inset-0 bg-neutral-900/20" />
                <span className="absolute bottom-4 left-4 text-xs text-white/80 bg-neutral-900/50 px-3 py-1.5 rounded-full backdrop-blur-sm">
                  Urban Bridge Initiative — Musanze, Rwanda
                </span>
              </div>

              <p className="text-neutral-600 leading-relaxed mb-5">
                This collaborative model has proven transformative on complex
                mixed-use developments. When structural constraints meet spatial
                ambition, early coordination allows teams to adapt without costly
                revisions — keeping timelines intact and budgets predictable.
              </p>

              {/* Section 3 */}
              <h2 className="font-heading text-2xl md:text-3xl font-bold text-neutral-900 mb-4 mt-12">
                Sustainable Futures Are Built Today
              </h2>
              <p className="text-neutral-600 leading-relaxed mb-5">
                As East Africa&apos;s urban population is projected to double by
                2050, the decisions made in design studios today will define the
                livability of cities for generations. At NEEZA, we treat every
                project as a contribution to that future — not merely a building,
                but a piece of urban fabric that should endure, evolve, and
                inspire.
              </p>
              <p className="text-neutral-600 leading-relaxed mb-5">
                Our commitment extends beyond project handover. We engage
                communities during planning, incorporate local artisans in
                construction, and design for adaptability — ensuring that what we
                build can flex with the changing needs of the people who inhabit
                it.
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mt-12 pt-8 border-t border-neutral-200">
                {[
                  "Sustainability",
                  "Urban Design",
                  "East Africa",
                  "Architecture",
                  "Engineering",
                ].map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1.5 bg-white border border-neutral-200 rounded-full text-xs font-medium text-neutral-500 hover:border-primary/30 hover:text-primary transition-colors cursor-pointer"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </article>

            {/* ── Sticky sidebar ───────────────────────────── */}
            <aside className="hidden lg:block">
              <div className="sticky top-28 space-y-6">

                {/* Share */}
                <div className="bg-white rounded-2xl border border-neutral-100 p-6 shadow-sm">
                  <h4 className="text-[0.6rem] font-bold tracking-[0.15em] uppercase text-neutral-400 mb-4">
                    Share Article
                  </h4>
                  <div className="space-y-2">
                    <a
                      href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                        "https://neeza.rw/blog/" + post.slug
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-xl bg-neutral-50 hover:bg-[#0A66C2]/5 border border-transparent hover:border-[#0A66C2]/15 transition-all group"
                    >
                      <Icon
                        icon="mdi:linkedin"
                        width={19}
                        className="text-[#0A66C2] shrink-0"
                      />
                      <span className="text-sm font-medium text-neutral-600 group-hover:text-[#0A66C2] transition-colors">
                        Share on LinkedIn
                      </span>
                    </a>
                    <a
                      href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                        "https://neeza.rw/blog/" + post.slug
                      )}&text=${encodeURIComponent(post.title)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-xl bg-neutral-50 hover:bg-neutral-900/5 border border-transparent hover:border-neutral-300 transition-all group"
                    >
                      <Icon
                        icon="ri:twitter-x-fill"
                        width={17}
                        className="text-neutral-800 shrink-0"
                      />
                      <span className="text-sm font-medium text-neutral-600 group-hover:text-neutral-900 transition-colors">
                        Share on X
                      </span>
                    </a>
                    <button
                      onClick={handleCopy}
                      className="w-full flex items-center gap-3 p-3 rounded-xl bg-neutral-50 hover:bg-primary/5 border border-transparent hover:border-primary/20 transition-all group"
                    >
                      <Icon
                        icon={
                          copied ? "mdi:check-circle" : "mdi:link-variant"
                        }
                        width={19}
                        className={
                          copied ? "text-green-500 shrink-0" : "text-primary shrink-0"
                        }
                      />
                      <span
                        className={`text-sm font-medium transition-colors ${
                          copied
                            ? "text-green-600"
                            : "text-neutral-600 group-hover:text-primary"
                        }`}
                      >
                        {copied ? "Copied!" : "Copy Link"}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Related mini-cards */}
                <div className="bg-white rounded-2xl border border-neutral-100 p-6 shadow-sm">
                  <h4 className="text-[0.6rem] font-bold tracking-[0.15em] uppercase text-neutral-400 mb-4">
                    Related Articles
                  </h4>
                  <div className="space-y-4">
                    {relatedPosts.slice(0, 2).map((related) => (
                      <Link
                        key={related.id}
                        href={`/blog/${related.slug}`}
                        className="flex gap-3 group"
                      >
                        <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0">
                          <Image
                            src={related.imageUrl}
                            alt={related.title}
                            fill
                            sizes="64px"
                            style={{ objectFit: "cover" }}
                            className="group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-[0.6rem] text-primary font-bold tracking-widest uppercase mb-1">
                            {related.category}
                          </div>
                          <h5 className="text-sm font-semibold text-neutral-800 line-clamp-2 group-hover:text-primary transition-colors leading-snug">
                            {related.title}
                          </h5>
                          <div className="text-[0.6rem] text-neutral-400 mt-1">
                            {related.readTime}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

              </div>
            </aside>
          </div>
        </div>
      </div>

      {/* ── Author card ───────────────────────────────────── */}
      <section className="bg-white border-y border-neutral-100">
        <div className="container mx-auto px-4 md:px-8 max-w-5xl py-14">
          <div className="flex flex-col sm:flex-row items-start gap-8 p-8 md:p-10 bg-primary/5 rounded-3xl border border-primary/10">
            <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center font-heading font-bold text-white text-2xl shrink-0">
              {initials}
            </div>
            <div className="flex-1">
              <div className="text-[0.6rem] text-primary font-bold tracking-[0.15em] uppercase mb-1">
                Written by
              </div>
              <h3 className="font-heading text-2xl font-bold text-neutral-900 mb-1">
                {post.author.name}
              </h3>
              <div className="text-sm text-primary font-semibold mb-3">
                {post.author.role} — NEEZA Designs
              </div>
              <p className="text-neutral-500 text-sm leading-relaxed max-w-xl">
                A thought leader in sustainable architecture and urban development
                across East Africa. With over a decade of hands-on experience,{" "}
                {post.author.name.split(" ")[0]} combines technical precision with
                a deep respect for African heritage in every project undertaken.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── More Insights ─────────────────────────────────── */}
      <section className="bg-neutral-50 py-20">
        <div className="container mx-auto px-4 md:px-8 max-w-6xl">
          <div className="flex justify-between items-center mb-10">
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-neutral-900">
              More Insights
            </h2>
            <Link
              href="/blog"
              className="text-primary text-sm font-semibold hover:text-primary-dark flex items-center gap-1 transition-colors"
            >
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {relatedPosts.map((related) => (
              <Link
                key={related.id}
                href={`/blog/${related.slug}`}
                className="bg-white rounded-2xl overflow-hidden border border-neutral-100 shadow-sm hover:shadow-md hover:border-primary/15 transition-all duration-200 group flex flex-col"
              >
                <div className="relative h-52 w-full overflow-hidden">
                  <Image
                    src={related.imageUrl}
                    alt={related.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    style={{ objectFit: "cover" }}
                    className="group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center justify-between mb-3">
                    <Badge
                      variant="outline"
                      className="text-[0.6rem] text-primary border-primary/20 bg-primary/5 tracking-widest uppercase"
                    >
                      {related.category}
                    </Badge>
                    <span className="text-[0.6rem] text-neutral-400 font-medium">
                      {related.readTime}
                    </span>
                  </div>
                  <h3 className="font-heading text-lg font-bold text-neutral-900 group-hover:text-primary transition-colors line-clamp-2 mb-2 leading-snug">
                    {related.title}
                  </h3>
                  <p className="text-sm text-neutral-500 line-clamp-2 flex-1 mb-4">
                    {related.excerpt}
                  </p>
                  <div className="flex items-center gap-2 pt-4 border-t border-neutral-100">
                    <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-[0.6rem] font-bold text-primary shrink-0">
                      {related.author.name
                        .split(" ")
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join("")}
                    </div>
                    <span className="text-xs text-neutral-600 font-medium">
                      {related.author.name}
                    </span>
                    <span className="text-neutral-300 mx-0.5">·</span>
                    <span className="text-xs text-neutral-400">
                      {formatDate(related.publishedAt)}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────── */}
      <section className="bg-primary py-20 text-center">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="w-14 h-14 rounded-full bg-white/10 border border-white/20 flex items-center justify-center mx-auto mb-6">
            <Icon icon="mdi:rocket-launch-outline" width={26} className="text-white" />
          </div>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-4">
            Have a Project in Mind?
          </h2>
          <p className="text-white/75 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
            Let&apos;s transform your vision into an architectural masterpiece.
            Speak to our team today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-primary hover:bg-neutral-100 h-14 px-8 font-bold"
            >
              Start a Project
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white/10 h-14 px-8"
            >
              Explore Services
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
