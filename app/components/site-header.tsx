"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/lib/site-config";
import { X, Menu } from "lucide-react";

export function SiteHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

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
    <>
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

              {/* Name + tagline - hidden on small mobile */}
              <div className="hidden sm:block">
                <h1 className="font-heading font-bold text-lg leading-tight">
                  {siteConfig.name}
                </h1>
                <p className="text-xs text-zinc-400">{siteConfig.tagline}</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
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

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-zinc-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white/20 focus:ring-offset-2 focus:ring-offset-neutral-900 rounded p-2"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={`
          fixed inset-0 z-40 md:hidden transition-all duration-300 ease-in-out
          ${isMobileMenuOpen ? "visible" : "invisible"}
        `}
      >
        {/* Backdrop */}
        <div
          className={`
            absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300
            ${isMobileMenuOpen ? "opacity-100" : "opacity-0"}
          `}
          onClick={() => setIsMobileMenuOpen(false)}
        />

        {/* Menu Panel */}
        <nav
          className={`
            absolute top-0 right-0 h-full w-72 max-w-[80vw] bg-neutral-900/95 backdrop-blur-xl 
            border-l border-white/10 shadow-2xl transform transition-transform duration-300 ease-out
            ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"}
          `}
          role="navigation"
          aria-label="Mobile navigation"
        >
          {/* Menu Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <span className="text-lg font-bold text-white">Menu</span>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-zinc-400 hover:text-white transition-colors p-1"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="p-4 space-y-1">
            {siteConfig.nav.map((item, index) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`
                  block px-4 py-3 rounded-lg text-base transition-all duration-200
                  ${
                    isActive(item.href)
                      ? "text-white bg-white/10 font-medium"
                      : "text-zinc-400 hover:text-white hover:bg-white/5"
                  }
                `}
                style={{
                  animationDelay: isMobileMenuOpen ? `${index * 50}ms` : "0ms",
                }}
                aria-current={isActive(item.href) ? "page" : undefined}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Footer */}
          <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-white/10">
            <p className="text-xs text-zinc-500 text-center">
              {siteConfig.tagline}
            </p>
          </div>
        </nav>
      </div>
    </>
  );
}
