"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { getPosts } from "@/lib/api/posts";
import { getCategories } from "@/lib/api/categories";
import { Badge } from "@/components/ui/Badge";
import { cn, formatDate } from "@/lib/utils";
import { getImageUrl } from "@/lib/imageUrl";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { NewsletterBanner } from "@/components/layout/NewsletterBanner";
import { EmptyState } from "@/components/ui/EmptyState";
import type { BlogPost } from "@/types";

export default function BlogPage() {
  const [activeCat, setActiveCat] = useState("All");
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    getCategories("blogs")
      .then((res) => setCategories(res.data.data.map((item) => item.name)))
      .catch(() => {});
  }, []);

  const categoryOptions = ["All", ...Array.from(new Set([...categories, ...posts.map((post) => post.category).filter(Boolean)]))];

  useEffect(() => {
    setLoading(true);
    const params: Record<string, string> = { limit: "50" };
    if (activeCat !== "All") params.category = activeCat;
    getPosts(params).then((res) => {
      setPosts(res.data?.data ?? []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [activeCat]);

  const filteredPosts = posts;

  const featuredPost = posts[0] ?? null;
  const gridPosts = activeCat === "All" && featuredPost ? filteredPosts.slice(1) : filteredPosts;

  return (
    <div className="flex flex-col flex-1 w-full bg-neutral-50 pb-24">
      {/* Hero Banner */}
      <section className="relative w-full min-h-[60vh] flex items-center justify-center overflow-hidden pt-24 pb-16">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/blogsHero.avif"
            alt="Insights background"
            fill
            style={{ objectFit: "cover" }}
            priority
          />
          <div className="absolute inset-0 bg-neutral-900/65" />
        </div>
        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
          <h1 className="font-heading text-4xl md:text-6xl font-bold text-white mb-6">
            Insights &amp; Innovation
          </h1>
          <p className="text-lg text-white/90 font-light mb-8">
            Exploring the future of sustainable urban development in Africa through a lens of luxury and heritage.
          </p>
          <Button size="lg" className="h-14 px-8 text-base rounded-full">
            Explore Latest
          </Button>
        </div>
      </section>

      {/* Tabs */}
      <section className="container mx-auto px-4 md:px-8 max-w-7xl -mt-8 relative z-20">
        <div className="bg-white rounded-full p-2 shadow-lg flex flex-wrap justify-center sm:justify-start gap-2 border border-neutral-100 max-w-fit mx-auto sm:mx-0">
          {categoryOptions.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCat(cat)}
              suppressHydrationWarning
              className={cn(
                "px-6 py-2 rounded-full text-xs font-bold tracking-widest uppercase transition-all",
                activeCat === cat
                  ? "bg-primary text-white"
                  : "bg-transparent text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      <div className="container bg-white mx-auto px-4 md:px-8 max-w-7xl mt-20">
        
        {/* Featured Post (only show if 'All' is selected for now) */}
        {activeCat === "All" && featuredPost && ( 
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-primary/5 rounded-2xl overflow-hidden border border-neutral-100 hover:border-primary/20 transition-colors transition-duration-300 mb-16 shadow-sm">
            <div className="relative h-64 md:h-full min-h-100 w-full">
              <Image src={getImageUrl(featuredPost.imageUrl)} alt={featuredPost.title} fill style={{ objectFit: "cover" }} unoptimized />
            </div>
            <div className="p-8 md:p-12">
              <div className="flex items-center gap-4 mb-4">
                <Badge variant="secondary" className="text-primary tracking-widest uppercase">{featuredPost.category}</Badge>
                {/* <span className="text-xs text-neutral-400 font-medium">{featuredPost.readTime}</span> */}
              </div>
              <h2 className="font-heading text-3xl font-normal text-neutral-900 mb-4 line-clamp-2">
                {featuredPost.title}
              </h2>
              <p className="text-neutral-600 mb-8 leading-relaxed">
                {featuredPost.excerpt}
              </p>
              
              <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-heading font-bold text-primary">
                    {featuredPost.author.name.split(" ").map((n: string) => n[0]).slice(0, 2).join("")}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-neutral-900">{featuredPost.author.name}</div>
                    <div className="text-xs text-neutral-500">{featuredPost.author.role}</div>
                  </div>
                </div>
                <Link href={`/blog/${featuredPost.slug}`} className="text-primary font-medium flex items-center gap-2 hover:text-primary-dark transition-colors">
                  Read Full Article <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
          </div>
        )}

        {/* Grid Posts */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
          {!loading && gridPosts.length === 0 && (
            <div className="col-span-full">
              <EmptyState
                icon="mdi:newspaper-variant-outline"
                title="No articles yet"
                description="We haven't published any articles in this category yet. Check back soon or explore another topic."
                action={{ label: "View All Posts", onClick: () => setActiveCat("All") }}
              />
            </div>
          )}
          {gridPosts.map((post) => (
            <div key={post._id} className="bg-white rounded-2xl border border-neutral-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col h-full">
              <div className="relative h-56 w-full overflow-hidden">
                <Image src={getImageUrl(post.imageUrl)} alt={post.title} fill style={{ objectFit: "cover" }} className="group-hover:scale-105 transition-transform duration-500" unoptimized />
              </div>
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center justify-between mb-4">
                  <Badge variant="outline" className="text-xs rounded-md bg-primary/20 text-primary uppercase  py-1">{post.category}</Badge>
                  <span className="text-xs text-neutral-400">{post.readTime} Minutes read</span>
                </div>
                <h3 className="font-heading text-xl font-bold text-neutral-900 mb-3 group-hover:text-primary transition-colors line-clamp-2">
                  <Link href={`/blog/${post.slug}`} className="before:absolute before:inset-0">
                    {post.title}
                  </Link>
                </h3>
                <p className="text-sm text-neutral-500 mb-6 line-clamp-3 flex-1">
                  {post.excerpt}
                </p>
                <div className="pt-4 border-t border-neutral-100 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center font-heading text-xs font-bold text-neutral-500 shrink-0">
                    {post.author.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                  </div>
                  <span className="text-xs font-medium text-neutral-700">{post.author.name}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Newsletter Banner */}
        <NewsletterBanner />

      </div>
    </div>
  );
}
