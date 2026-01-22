"use client";

import { useEffect, useRef } from "react";

interface Star {
  // Polar coordinates for orbital motion
  angle: number; // Current angle in radians
  radius: number; // Distance from center
  orbitSpeed: number; // How fast it orbits

  // Visual properties
  size: number;
  baseAlpha: number;

  // Twinkle properties
  twinklePhase: number;
  twinkleSpeed: number;
  twinkleIntensity: number; // How much it varies (0.3 = 30% variation)

  // Layer (affects rendering)
  layer: "deep" | "mid" | "near";
}

export function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const starsRef = useRef<Star[]>([]);
  const isVisibleRef = useRef(true);
  const globalRotationRef = useRef(0);

  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      return; // Don't mount the canvas if reduced motion is preferred
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    const dpr = window.devicePixelRatio || 1;

    // Star count based on screen size
    const isMobile = width < 768;
    const starCount = isMobile ? 100 : 180;

    // Calculate center and max radius
    let centerX = width / 2;
    let centerY = height / 2;
    let maxRadius = Math.sqrt(centerX * centerX + centerY * centerY) * 1.2;

    // Initialize canvas size
    const resizeCanvas = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      centerX = width / 2;
      centerY = height / 2;
      maxRadius = Math.sqrt(centerX * centerX + centerY * centerY) * 1.2;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
    };

    resizeCanvas();

    // Initialize stars
    const initStars = () => {
      starsRef.current = [];

      for (let i = 0; i < starCount; i++) {
        const layerRoll = Math.random();
        let layer: "deep" | "mid" | "near";

        if (layerRoll < 0.5) {
          layer = "deep";
        } else if (layerRoll < 0.8) {
          layer = "mid";
        } else {
          layer = "near";
        }

        // Distribute stars across the entire radius with some clustering
        const radius = Math.random() * maxRadius;
        const angle = Math.random() * Math.PI * 2;

        // Orbit speed varies by layer - deeper stars appear to move slower
        const baseOrbitSpeed =
          layer === "deep" ? 0.00004 : layer === "mid" ? 0.0000575 : 0.000092;
        const orbitSpeed = baseOrbitSpeed * (0.8 + Math.random() * 0.4);

        // Size varies by layer
        const size =
          layer === "deep"
            ? 0.5 + Math.random() * 0.8
            : layer === "mid"
            ? 0.8 + Math.random() * 1.2
            : 1.2 + Math.random() * 1.8;

        // Alpha varies by layer
        const baseAlpha =
          layer === "deep"
            ? 0.15 + Math.random() * 0.2
            : layer === "mid"
            ? 0.25 + Math.random() * 0.25
            : 0.35 + Math.random() * 0.25;

        // Twinkle properties - deeper stars twinkle more noticeably
        const twinkleSpeed =
          layer === "deep"
            ? 0.015 + Math.random() * 0.03
            : layer === "mid"
            ? 0.01 + Math.random() * 0.02
            : 0.005 + Math.random() * 0.015;

        const twinkleIntensity =
          layer === "deep"
            ? 0.4 + Math.random() * 0.4 // 40-80% variation
            : layer === "mid"
            ? 0.3 + Math.random() * 0.3 // 30-60% variation
            : 0.2 + Math.random() * 0.2; // 20-40% variation

        starsRef.current.push({
          angle,
          radius,
          orbitSpeed,
          size,
          baseAlpha,
          twinklePhase: Math.random() * Math.PI * 2,
          twinkleSpeed,
          twinkleIntensity,
          layer,
        });
      }
    };

    initStars();

    // Animation loop
    let lastTime = 0;
    const fps = 30;
    const frameInterval = 1000 / fps;

    const animate = (currentTime: number) => {
      if (!isVisibleRef.current) return;

      const deltaTime = currentTime - lastTime;

      if (deltaTime >= frameInterval) {
        lastTime = currentTime - (deltaTime % frameInterval);

        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        // Update global rotation (very slow)
        globalRotationRef.current += 0.000115;

        // Draw stars by layer (deep first, then mid, then near)
        const layers: ("deep" | "mid" | "near")[] = ["deep", "mid", "near"];

        for (const layer of layers) {
          starsRef.current.forEach((star) => {
            if (star.layer !== layer) return;

            // Update star's individual orbit
            star.angle += star.orbitSpeed;

            // Update twinkle
            star.twinklePhase += star.twinkleSpeed;

            // Twinkle calculation - smooth sine wave with intensity
            const twinkleFactor =
              1 -
              star.twinkleIntensity +
              star.twinkleIntensity * (0.5 + 0.5 * Math.sin(star.twinklePhase));

            // Calculate position with global rotation
            const totalAngle = star.angle + globalRotationRef.current;
            const x = centerX + Math.cos(totalAngle) * star.radius;
            const y = centerY + Math.sin(totalAngle) * star.radius;

            // Skip if off-screen
            if (x < -10 || x > width + 10 || y < -10 || y > height + 10) return;

            // Calculate final alpha
            const finalAlpha = star.baseAlpha * twinkleFactor;

            // Draw star with subtle glow for brighter ones
            if (
              star.layer === "near" ||
              (star.layer === "mid" && star.size > 1.5)
            ) {
              // Draw subtle glow
              const gradient = ctx.createRadialGradient(
                x,
                y,
                0,
                x,
                y,
                star.size * 3
              );
              gradient.addColorStop(
                0,
                `rgba(255, 255, 255, ${finalAlpha * 0.4})`
              );
              gradient.addColorStop(
                0.5,
                `rgba(255, 255, 255, ${finalAlpha * 0.1})`
              );
              gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
              ctx.fillStyle = gradient;
              ctx.beginPath();
              ctx.arc(x, y, star.size * 3, 0, Math.PI * 2);
              ctx.fill();
            }

            // Draw star core
            const coreColor =
              star.layer === "deep"
                ? `rgba(220, 225, 255, ${finalAlpha})` // Slight blue tint for distant stars
                : star.layer === "mid"
                ? `rgba(245, 245, 250, ${finalAlpha})` // Slight cool white
                : `rgba(255, 255, 255, ${finalAlpha})`; // Pure white for near

            ctx.fillStyle = coreColor;
            ctx.beginPath();
            ctx.arc(x, y, star.size, 0, Math.PI * 2);
            ctx.fill();

            // Draw subtle cross/sparkle for larger bright stars
            if (star.size > 1.5 && finalAlpha > 0.4) {
              ctx.strokeStyle = `rgba(255, 255, 255, ${finalAlpha * 0.3})`;
              ctx.lineWidth = 0.5;
              const sparkleSize = star.size * 2;

              // Horizontal line
              ctx.beginPath();
              ctx.moveTo(x - sparkleSize, y);
              ctx.lineTo(x + sparkleSize, y);
              ctx.stroke();

              // Vertical line
              ctx.beginPath();
              ctx.moveTo(x, y - sparkleSize);
              ctx.lineTo(x, y + sparkleSize);
              ctx.stroke();
            }
          });
        }
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    // Handle visibility change
    const handleVisibilityChange = () => {
      if (document.hidden) {
        isVisibleRef.current = false;
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      } else {
        isVisibleRef.current = true;
        lastTime = performance.now();
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    };

    // Handle window resize
    const handleResize = () => {
      resizeCanvas();
      initStars();
    };

    // Start animation
    animationFrameRef.current = requestAnimationFrame(animate);

    // Add event listeners
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: -1 }}
    />
  );
}
