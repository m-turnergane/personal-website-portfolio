"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/lib/site-config";

export function SiteHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const isHomepage = pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 120);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Check if a nav item is active (exact match or starts with path)
  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname?.startsWith(href);
  };

  // On homepage, never show the header
  if (isHomepage) {
    return null;
  }

  return (
    <header
      className={`
        fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out
        glass border-b border-white/5 py-3
      `}
    >
      <div className="max-w-4xl mx-auto px-6">
        <div className="flex items-center justify-between">
          {/* Logo / Avatar Section */}
          <Link
            href="/"
            className="flex items-center gap-3 group transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/20 focus:ring-offset-2 focus:ring-offset-neutral-900 rounded-lg"
            aria-label="Go to homepage"
          >
            <div className="relative overflow-hidden rounded-full bg-gradient-to-br from-white/10 to-white/5 w-10 h-10 transition-all duration-300 ease-in-out">
              <Image
                src="/profile.png"
                alt="Muhammad Gane"
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            </div>

            {isHomepage ? (
              // Homepage scrolled: just name
              <h1 className="font-heading font-bold text-lg">
                {siteConfig.name}
              </h1>
            ) : (
              // Other pages: name + tagline
              <div className="hidden sm:block">
                <h1 className="font-heading font-bold text-lg leading-tight">
                  {siteConfig.name}
                </h1>
                <p className="text-xs text-zinc-400">{siteConfig.tagline}</p>
              </div>
            )}
          </Link>

          {/* Navigation - only show on non-home pages */}
          {!isHomepage && (
            <nav
              className="hidden md:flex items-center gap-1"
              role="navigation"
              aria-label="Main navigation"
            >
              {siteConfig.nav.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`px-4 py-2 text-sm transition-all duration-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20 focus:ring-offset-2 focus:ring-offset-neutral-900 ${
                    isActive(item.href)
                      ? "text-white bg-white/5 border-b-2 border-white/20 font-medium"
                      : "text-zinc-400 hover:text-white hover:bg-white/[0.03]"
                  }`}
                  aria-current={isActive(item.href) ? "page" : undefined}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          )}

          {/* Mobile menu button - only on non-home pages */}
          {!isHomepage && (
            <button
              className="md:hidden text-zinc-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white/20 focus:ring-offset-2 focus:ring-offset-neutral-900 rounded p-1"
              aria-label="Toggle navigation menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
