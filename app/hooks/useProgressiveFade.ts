"use client";

import { useEffect, useRef, useState } from "react";

export function useProgressiveFade() {
  const ref = useRef<HTMLDivElement>(null);
  const [opacity, setOpacity] = useState(0);
  const [translateY, setTranslateY] = useState(12);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      setOpacity(1);
      setTranslateY(0);
      return;
    }

    let rafId: number;

    const handleScroll = () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }

      rafId = requestAnimationFrame(() => {
        const rect = element.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        // Calculate how much of the element is in view
        // Start fading in when element is 80% from bottom of viewport
        const triggerPoint = windowHeight * 0.8;
        const elementTop = rect.top;

        if (elementTop < triggerPoint) {
          // Calculate progress (0 to 1)
          const progress = Math.min(
            1,
            Math.max(0, (triggerPoint - elementTop) / 200)
          );

          setOpacity(progress);
          setTranslateY(12 * (1 - progress));
        } else {
          setOpacity(0);
          setTranslateY(12);
        }
      });
    };

    // Initial check
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };
  }, []);

  return {
    ref,
    style: {
      opacity,
      transform: `translateY(${translateY}px)`,
      transition: "none", // We handle this with RAF for smoothness
    },
  };
}
