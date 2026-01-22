"use client";

import Image from "next/image";
import Link from "next/link";
import { SocialLinks } from "./components/social-links";
import { useScrollReveal } from "./hooks/useScrollReveal";
import { useProgressiveFade } from "./hooks/useProgressiveFade";
import { ArrowRight } from "lucide-react";

function Hero() {
  return (
    <section className="min-h-[80vh] flex flex-col items-center justify-center text-center -mt-32 pt-32">
      {/* Avatar */}
      <div className="mb-8 relative">
        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-white/10 shadow-lg shadow-white/5 bg-gradient-to-br from-zinc-800 to-zinc-900">
          <Image
            src="/profile.png"
            alt="Muhammad Gane"
            width={160}
            height={160}
            priority
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Name - solid zinc/white, no gradient */}
      <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-4 text-white">
        Muhammad Gane
      </h1>

      {/* Tagline */}
      <p className="text-lg md:text-xl text-zinc-400 mb-8 max-w-2xl px-4">
        Automation • Agentic Tools • Experiments • Writing
      </p>

      {/* Social Icons */}
      <div className="mb-8">
        <SocialLinks />
      </div>

      {/* Scroll indicator - more subtle */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-zinc-700 rounded-full p-1">
          <div className="w-1.5 h-3 bg-zinc-600 rounded-full mx-auto animate-pulse"></div>
        </div>
      </div>
    </section>
  );
}

function AboutSection() {
  const { ref, style } = useProgressiveFade();

  return (
    <section ref={ref} style={style} className="max-w-3xl mx-auto py-20">
      <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center text-white">
        About
      </h2>
      <div className="space-y-6 text-lg text-zinc-300 leading-relaxed">
        <p>
          In life, we all move through our own wayward journeys in search of
          fulfillment—suitability in a craft, happiness (no matter how
          abstract), and a sense of belonging. That indefinite pursuit of
          vocation is what has driven me forward, anchored in a simple
          philosophy: I can be better than I was yesterday. All I have to do is
          keep returning to the kind of work I genuinely love—the kind that
          feels like play to me, even if it looks like work to everyone else. I
          built this website as a culmination of my body of work so far, and
          whatever is still to come.
        </p>
        <p>
          Before I can even remember, as a child I’d spend hours with language:
          reading science fiction and fantasy, writing poems and short stories,
          taking pieces of my reality and feeding them into the inner machinery
          of my mind. I’d get lost in the idea that something as simple as a
          sequence of words could ignite imagination—so that, when you closed
          your eyes, those words could feel more real than the world around you.
          I could see the worlds J.R.R. Tolkien, Patrick Rothfuss, and Frank
          Herbert created somehow, despite them existing only in prose.
        </p>
        <p>
          As I got older, I found myself pulled more and more toward
          programming. It felt like the same kind of magic—another language you
          could learn, another way to bring something into existence that wasn’t
          there before. The more I built, the more I realized software could be
          its own form of world-making: creative freedom with structure,
          imagination with constraints, ideas turned into realities that other
          people (and I) could disappear into for hours. A sense of escapism, a
          sense of wonder, and a sense of discovery—qualities I used to
          associate only with the best fiction.
        </p>
        <p>
          This site is meant to be a living document: a digital footprint I get
          to leave behind, refine over time, and share. I hope what you find
          here gives you even a small uptick in happiness, efficiency, or
          usefulness. To close, a quote that feels fitting—for my journey, and
          for all of ours:
        </p>
        <p className="italic">
          "Our vanity, our passions, our spirit of imitation, our abstract
          intelligence, our habits have long been at work, and it is the task of
          art to undo this work of theirs, making us travel back in the
          direction from which we have come to the depths where what has really
          existed lies unknown within us." - Marcel Proust (1871 - 1922)"
        </p>
      </div>
    </section>
  );
}

interface CategoryCardProps {
  title: string;
  description: string;
  href: string;
  imageSrc: string;
  comingSoon?: boolean;
  delay?: number;
}

function CategoryCard({
  title,
  description,
  href,
  imageSrc,
  comingSoon,
  delay = 0,
}: CategoryCardProps) {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.1 });

  return (
    <div
      ref={ref}
      className={`
        transition-all duration-500
        ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}
      `}
      style={{
        transitionDelay: isVisible ? `${delay}ms` : "0ms",
      }}
    >
      <Link
        href={href}
        className="group relative block p-6 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/20 transition-all duration-300 overflow-hidden min-h-[240px] flex flex-col"
      >
        {/* Decorative background image */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Gradient overlay for fade effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent z-10" />

          {/* Image with increased opacity and reduced grayscale */}
          <div className="absolute -right-8 top-1/2 -translate-y-1/2 w-64 h-64 opacity-30 saturate-0 group-hover:opacity-40 group-hover:saturate-50 transition-all duration-300">
            <Image
              src={imageSrc}
              alt=""
              fill
              className="object-contain"
              sizes="256px"
            />
          </div>
        </div>

        {/* Card content */}
        <div className="relative z-20 flex flex-col flex-grow">
          {comingSoon && (
            <span className="absolute -top-2 -right-2 text-xs px-3 py-1 rounded-full bg-white/10 text-zinc-300 border border-white/20">
              Coming Soon
            </span>
          )}

          <h3 className="text-xl font-bold mb-2 text-white group-hover:text-zinc-100 transition-colors">
            {title}
          </h3>

          <p className="text-zinc-400 text-sm leading-relaxed mb-4 flex-grow">
            {description}
          </p>

          <div className="flex items-center text-sm text-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity mt-auto">
            Learn more
            <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </Link>
    </div>
  );
}

function CategoryGrid() {
  const categories = [
    {
      title: "Trading Lab",
      description:
        "Quantitative trading experiments and market analysis tools. Exploring algorithmic strategies and data-driven insights.",
      href: "/trading-lab",
      imageSrc: "/images/categories/trading.png",
      delay: 0,
    },
    {
      title: "Deployed Projects",
      description:
        "Production-ready applications and tools. From web apps to APIs, showcasing real-world implementations.",
      href: "/projects",
      imageSrc: "/images/categories/projects.png",
      delay: 100,
    },
    {
      title: "Automation & Agents",
      description:
        "Intelligent automation systems and agentic tools. Building software that works autonomously and thinks ahead.",
      href: "/automation",
      imageSrc: "/images/categories/automation.png",
      delay: 200,
    },
    {
      title: "Writing",
      description:
        "Short stories, poetry, and personal reflections. Other worlds, built from prose.",
      href: "/writing",
      imageSrc: "/images/categories/writing.png",
      delay: 300,
    },
  ];

  return (
    <section className="py-20">
      <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-white">
        Vault
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map((category) => (
          <CategoryCard key={category.title} {...category} />
        ))}
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <div className="relative">
      <Hero />
      <AboutSection />
      <CategoryGrid />
    </div>
  );
}
