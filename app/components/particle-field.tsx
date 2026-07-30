"use client";

import { useEffect, useRef } from "react";

type Layer = "deep" | "mid" | "near";

interface Star {
  // Sidereal polar coords relative to the off-screen celestial pole
  angle: number;
  radius: number;
  orbitSpeed: number;

  // Screen-space fallback for reduced-motion static draw
  x: number;
  y: number;

  size: number;
  baseAlpha: number;
  r: number;
  g: number;
  b: number;

  // Layered atmospheric twinkle (2–3 incommensurate sines)
  twinklePhase1: number;
  twinklePhase2: number;
  twinklePhase3: number;
  twinkleSpeed1: number;
  twinkleSpeed2: number;
  twinkleSpeed3: number;
  twinkleIntensity: number;

  // Occasional scintillation glints on brighter stars
  canScintillate: boolean;
  scintillationTimer: number;
  scintillationActive: number; // 0..1 flash envelope

  layer: Layer;
  inMilkyWay: boolean;
}

interface Meteor {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number; // 0..1 remaining
  decay: number;
  length: number;
  width: number;
  alpha: number;
  bright: boolean;
}

/** Stellar color temperatures — subtle saturation for realism */
const STAR_COLORS: { r: number; g: number; b: number; weight: number }[] = [
  { r: 210, g: 225, b: 255, weight: 0.18 }, // blue-white (O/B)
  { r: 235, g: 240, b: 255, weight: 0.32 }, // cool white (A)
  { r: 255, g: 252, b: 245, weight: 0.28 }, // warm white (F/G)
  { r: 255, g: 235, b: 200, weight: 0.15 }, // yellow-orange (K)
  { r: 255, g: 200, b: 170, weight: 0.07 }, // orange-red (M)
];

function pickStarColor(): { r: number; g: number; b: number } {
  const roll = Math.random();
  let cumulative = 0;
  for (const color of STAR_COLORS) {
    cumulative += color.weight;
    if (roll <= cumulative) return { r: color.r, g: color.g, b: color.b };
  }
  return STAR_COLORS[2];
}

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

/** Content column is max-w-4xl (896px). Dim stars behind the reading zone. */
function contentAttenuation(x: number, width: number): number {
  const halfContent = Math.min(448, width * 0.42);
  const center = width / 2;
  const distFromCenter = Math.abs(x - center);
  // Full brightness outside content; ~45% behind the reading column
  return 0.45 + 0.55 * smoothstep(halfContent * 0.55, halfContent * 1.15, distFromCenter);
}

export function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const starsRef = useRef<Star[]>([]);
  const meteorsRef = useRef<Meteor[]>([]);
  const isVisibleRef = useRef(true);
  const siderealAngleRef = useRef(0);
  const nextMeteorAtRef = useRef(0);
  const milkyWayCacheRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const isMobile = width < 768;
    const starCount = isMobile ? 110 : 220;

    // Celestial pole off-screen (upper-right-ish) — slow sidereal drift pivots here
    let poleX = width * 1.15;
    let poleY = -height * 0.35;

    const resizeCanvas = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      poleX = width * 1.15;
      poleY = -height * 0.35;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      milkyWayCacheRef.current = null;
    };

    resizeCanvas();

    /** Soft diagonal Milky Way haze — cached once per size via rotated gradient */
    const ensureMilkyWayCache = () => {
      if (milkyWayCacheRef.current) return milkyWayCacheRef.current;

      const off = document.createElement("canvas");
      off.width = Math.max(1, Math.floor(width));
      off.height = Math.max(1, Math.floor(height));
      const octx = off.getContext("2d");
      if (!octx) return null;

      const cx = width * 0.45;
      const cy = height * 0.55;
      const bandHalfWidth = Math.min(width, height) * 0.22;
      const bandAngle = -0.55;

      octx.translate(cx, cy);
      octx.rotate(bandAngle);

      const gradient = octx.createLinearGradient(0, -bandHalfWidth * 2, 0, bandHalfWidth * 2);
      gradient.addColorStop(0, "rgba(140, 155, 200, 0)");
      gradient.addColorStop(0.35, "rgba(140, 155, 200, 0.045)");
      gradient.addColorStop(0.5, "rgba(160, 170, 210, 0.07)");
      gradient.addColorStop(0.65, "rgba(140, 155, 200, 0.045)");
      gradient.addColorStop(1, "rgba(140, 155, 200, 0)");

      const bandLen = Math.max(width, height) * 1.2;
      octx.fillStyle = gradient;
      octx.fillRect(-bandLen / 2, -bandHalfWidth * 2, bandLen, bandHalfWidth * 4);

      // Soft fade at band ends
      const endFade = octx.createLinearGradient(-bandLen / 2, 0, bandLen / 2, 0);
      endFade.addColorStop(0, "rgba(10, 10, 10, 1)");
      endFade.addColorStop(0.2, "rgba(10, 10, 10, 0)");
      endFade.addColorStop(0.8, "rgba(10, 10, 10, 0)");
      endFade.addColorStop(1, "rgba(10, 10, 10, 1)");
      octx.globalCompositeOperation = "destination-out";
      octx.fillStyle = endFade;
      octx.fillRect(-bandLen / 2, -bandHalfWidth * 2, bandLen, bandHalfWidth * 4);

      octx.setTransform(1, 0, 0, 1, 0, 0);
      milkyWayCacheRef.current = off;
      return off;
    };

    const isInMilkyWayBand = (x: number, y: number): boolean => {
      const bandAngle = -0.55;
      const cos = Math.cos(bandAngle);
      const sin = Math.sin(bandAngle);
      const cx = width * 0.45;
      const cy = height * 0.55;
      const bandHalfWidth = Math.min(width, height) * 0.18;
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.abs(-sin * dx + cos * dy);
      return dist < bandHalfWidth * 1.4;
    };

    const initStars = () => {
      starsRef.current = [];
      const milkyWayExtra = isMobile ? 25 : 55;

      const createStar = (opts: {
        x: number;
        y: number;
        forceFaint?: boolean;
        inMilkyWay?: boolean;
      }): Star => {
        const { x, y, forceFaint = false, inMilkyWay = false } = opts;

        // Power-law brightness: many faint, few bright
        const brightnessRoll = forceFaint
          ? Math.pow(Math.random(), 1.8) * 0.35
          : Math.pow(Math.random(), 2.4);

        let layer: Layer;
        if (brightnessRoll < 0.25) layer = "deep";
        else if (brightnessRoll < 0.65) layer = "mid";
        else layer = "near";

        const size = forceFaint
          ? 0.35 + Math.random() * 0.55
          : layer === "deep"
            ? 0.4 + brightnessRoll * 0.9
            : layer === "mid"
              ? 0.7 + brightnessRoll * 1.3
              : 1.0 + brightnessRoll * 2.2;

        const baseAlpha = forceFaint
          ? 0.08 + Math.random() * 0.12
          : layer === "deep"
            ? 0.12 + brightnessRoll * 0.25
            : layer === "mid"
              ? 0.2 + brightnessRoll * 0.35
              : 0.35 + brightnessRoll * 0.45;

        // Sidereal orbit speed — deeper = slower (parallax)
        const baseOrbit =
          layer === "deep" ? 0.000008 : layer === "mid" ? 0.000012 : 0.000018;
        const orbitSpeed = baseOrbit * (0.7 + Math.random() * 0.6);

        // Polar coords relative to celestial pole
        const dx = x - poleX;
        const dy = y - poleY;
        const radius = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx);

        // Bright stars twinkle less; faint ones shimmer more
        const twinkleIntensity = forceFaint
          ? 0.45 + Math.random() * 0.35
          : layer === "deep"
            ? 0.4 + Math.random() * 0.4
            : layer === "mid"
              ? 0.25 + Math.random() * 0.3
              : 0.12 + Math.random() * 0.2;

        const color = pickStarColor();

        return {
          angle,
          radius,
          orbitSpeed,
          x,
          y,
          size,
          baseAlpha,
          r: color.r,
          g: color.g,
          b: color.b,
          twinklePhase1: Math.random() * Math.PI * 2,
          twinklePhase2: Math.random() * Math.PI * 2,
          twinklePhase3: Math.random() * Math.PI * 2,
          twinkleSpeed1: 0.008 + Math.random() * 0.018,
          twinkleSpeed2: 0.021 + Math.random() * 0.028,
          twinkleSpeed3: 0.041 + Math.random() * 0.035,
          twinkleIntensity,
          canScintillate: !forceFaint && layer === "near" && size > 1.8 && Math.random() < 0.35,
          scintillationTimer: 2 + Math.random() * 8,
          scintillationActive: 0,
          layer,
          inMilkyWay: inMilkyWay || false,
        };
      };

      // Base field — scattered across viewport (with slight margin)
      for (let i = 0; i < starCount; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        starsRef.current.push(createStar({ x, y, inMilkyWay: isInMilkyWayBand(x, y) }));
      }

      // Extra faint micro-stars clustered in the Milky Way band
      for (let i = 0; i < milkyWayExtra; i++) {
        const bandAngle = -0.55;
        const cos = Math.cos(bandAngle);
        const sin = Math.sin(bandAngle);
        const cx = width * 0.45;
        const cy = height * 0.55;
        const bandHalfWidth = Math.min(width, height) * 0.18;
        const along = (Math.random() - 0.5) * Math.max(width, height) * 1.1;
        const across = (Math.random() - 0.5) * bandHalfWidth * 2;
        const x = cx + cos * along - sin * across;
        const y = cy + sin * along + cos * across;
        if (x < -20 || x > width + 20 || y < -20 || y > height + 20) continue;
        starsRef.current.push(createStar({ x, y, forceFaint: true, inMilkyWay: true }));
      }
    };

    initStars();
    ensureMilkyWayCache();

    const scheduleNextMeteor = (now: number) => {
      // Every 8–25 seconds
      nextMeteorAtRef.current = now + (8000 + Math.random() * 17000);
    };

    const spawnMeteor = () => {
      if (isMobile) return;

      const bright = Math.random() < 0.125; // ~1 in 8 longer/brighter
      const contentLeft = width / 2 - Math.min(448, width * 0.42);
      const contentRight = width / 2 + Math.min(448, width * 0.42);

      // Prefer trajectories along the sides / upper edges — avoid reading column
      const fromLeft = Math.random() < 0.5;
      let startX: number;
      let startY: number;
      let angle: number;

      if (fromLeft) {
        startX = -20 - Math.random() * 40;
        startY = Math.random() * height * 0.55;
        // Streak toward lower-right, but keep path mostly left of content or above it
        angle = 0.35 + Math.random() * 0.55;
        // If starting high, can cross more of the screen
        if (startY > height * 0.25) {
          // Bias endpoint left of content center
          angle = 0.2 + Math.random() * 0.4;
        }
      } else {
        startX = width + 20 + Math.random() * 40;
        startY = Math.random() * height * 0.5;
        angle = Math.PI - (0.35 + Math.random() * 0.55);
      }

      const speed = bright ? 12 + Math.random() * 8 : 8 + Math.random() * 7;
      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed;

      // Reject if midpoint would land deep in the content reading zone
      const midX = startX + vx * 20;
      const midY = startY + vy * 20;
      const inReadingZone =
        midX > contentLeft &&
        midX < contentRight &&
        midY > height * 0.15 &&
        midY < height * 0.7;
      if (inReadingZone && Math.random() > 0.15) {
        // Retry once with a higher, more peripheral path
        startY = Math.random() * height * 0.2;
      }

      meteorsRef.current.push({
        x: startX,
        y: startY,
        vx,
        vy,
        life: 1,
        decay: bright ? 0.018 + Math.random() * 0.01 : 0.028 + Math.random() * 0.018,
        length: bright ? 80 + Math.random() * 60 : 40 + Math.random() * 50,
        width: bright ? 1.4 + Math.random() * 0.6 : 0.8 + Math.random() * 0.6,
        alpha: bright ? 0.55 + Math.random() * 0.25 : 0.25 + Math.random() * 0.25,
        bright,
      });
    };

    const drawMilkyWay = () => {
      const cache = ensureMilkyWayCache();
      if (cache) {
        ctx.globalAlpha = 1;
        ctx.drawImage(cache, 0, 0, width, height);
      }
    };

    const drawStar = (star: Star, x: number, y: number, animate: boolean) => {
      if (x < -12 || x > width + 12 || y < -12 || y > height + 12) return;

      let twinkleFactor = 1;
      let scintillation = 0;

      if (animate) {
        // Layered sines at incommensurate frequencies
        const t1 = 0.5 + 0.5 * Math.sin(star.twinklePhase1);
        const t2 = 0.5 + 0.5 * Math.sin(star.twinklePhase2);
        const t3 = 0.5 + 0.5 * Math.sin(star.twinklePhase3);
        const combined = t1 * 0.5 + t2 * 0.3 + t3 * 0.2;
        twinkleFactor =
          1 - star.twinkleIntensity + star.twinkleIntensity * combined;

        if (star.canScintillate) {
          star.scintillationTimer -= 1 / 30;
          if (star.scintillationTimer <= 0) {
            star.scintillationActive = 1;
            star.scintillationTimer = 4 + Math.random() * 12;
          }
          if (star.scintillationActive > 0) {
            scintillation = star.scintillationActive;
            star.scintillationActive = Math.max(0, star.scintillationActive - 0.08);
          }
        }

        star.twinklePhase1 += star.twinkleSpeed1;
        star.twinklePhase2 += star.twinkleSpeed2;
        star.twinklePhase3 += star.twinkleSpeed3;
      }

      const atten = contentAttenuation(x, width);
      const finalAlpha = Math.min(
        1,
        star.baseAlpha * twinkleFactor * atten * (1 + scintillation * 0.85)
      );

      const { r, g, b } = star;
      const size = star.size * (1 + scintillation * 0.35);

      // Soft glow for brighter stars
      if (star.layer === "near" || (star.layer === "mid" && star.size > 1.4) || scintillation > 0.3) {
        const glowRadius = size * (2.8 + scintillation * 2);
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, glowRadius);
        gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${finalAlpha * 0.35})`);
        gradient.addColorStop(0.45, `rgba(${r}, ${g}, ${b}, ${finalAlpha * 0.08})`);
        gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, glowRadius, 0, Math.PI * 2);
        ctx.fill();
      }

      // Core
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${finalAlpha})`;
      ctx.beginPath();
      ctx.arc(x, y, Math.max(0.35, size * 0.55), 0, Math.PI * 2);
      ctx.fill();

      // Diffraction spikes only during scintillation glints
      if (scintillation > 0.25 && size > 1.5) {
        const spikeAlpha = finalAlpha * scintillation * 0.55;
        const spikeLen = size * (2.5 + scintillation * 2);
        ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${spikeAlpha})`;
        ctx.lineWidth = 0.6;
        ctx.beginPath();
        ctx.moveTo(x - spikeLen, y);
        ctx.lineTo(x + spikeLen, y);
        ctx.moveTo(x, y - spikeLen);
        ctx.lineTo(x, y + spikeLen);
        ctx.stroke();
      }
    };

    const drawStars = (animate: boolean) => {
      const layers: Layer[] = ["deep", "mid", "near"];
      const sidereal = siderealAngleRef.current;

      for (const layer of layers) {
        for (const star of starsRef.current) {
          if (star.layer !== layer) continue;

          if (animate) {
            star.angle += star.orbitSpeed;
          }

          const totalAngle = star.angle + sidereal * (star.layer === "near" ? 1 : star.layer === "mid" ? 0.85 : 0.7);
          const x = poleX + Math.cos(totalAngle) * star.radius;
          const y = poleY + Math.sin(totalAngle) * star.radius;

          // Keep screen-space cache updated for resize / static draws
          star.x = x;
          star.y = y;

          drawStar(star, x, y, animate);
        }
      }
    };

    const drawMeteors = () => {
      const remaining: Meteor[] = [];

      for (const meteor of meteorsRef.current) {
        meteor.x += meteor.vx;
        meteor.y += meteor.vy;
        meteor.life -= meteor.decay;

        if (meteor.life <= 0) continue;
        remaining.push(meteor);

        const atten = contentAttenuation(meteor.x, width);
        const alpha = meteor.alpha * meteor.life * atten;

        // Tail direction opposite velocity
        const speed = Math.sqrt(meteor.vx * meteor.vx + meteor.vy * meteor.vy) || 1;
        const tx = meteor.x - (meteor.vx / speed) * meteor.length * meteor.life;
        const ty = meteor.y - (meteor.vy / speed) * meteor.length * meteor.life;

        const gradient = ctx.createLinearGradient(tx, ty, meteor.x, meteor.y);
        gradient.addColorStop(0, `rgba(220, 230, 255, 0)`);
        gradient.addColorStop(0.55, `rgba(230, 235, 255, ${alpha * 0.35})`);
        gradient.addColorStop(1, `rgba(255, 255, 255, ${alpha})`);

        ctx.strokeStyle = gradient;
        ctx.lineWidth = meteor.width * (0.4 + meteor.life * 0.6);
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(tx, ty);
        ctx.lineTo(meteor.x, meteor.y);
        ctx.stroke();

        // Bright head
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.9})`;
        ctx.beginPath();
        ctx.arc(meteor.x, meteor.y, meteor.width * 0.7, 0, Math.PI * 2);
        ctx.fill();
      }

      meteorsRef.current = remaining;
    };

    const renderFrame = (animate: boolean, now: number) => {
      ctx.clearRect(0, 0, width, height);
      drawMilkyWay();

      if (animate) {
        // Extremely slow sidereal drift — perceptible over ~a minute, not second-to-second
        siderealAngleRef.current += 0.000012;
      }

      drawStars(animate);

      if (animate && !isMobile) {
        if (now >= nextMeteorAtRef.current) {
          spawnMeteor();
          scheduleNextMeteor(now);
        }
        drawMeteors();
      }
    };

    // Reduced motion: single static beautiful frame, zero animation
    if (prefersReducedMotion) {
      renderFrame(false, performance.now());

      const handleResize = () => {
        resizeCanvas();
        initStars();
        renderFrame(false, performance.now());
      };

      window.addEventListener("resize", handleResize);
      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }

    scheduleNextMeteor(performance.now());

    let lastTime = 0;
    const fps = 30;
    const frameInterval = 1000 / fps;

    const animate = (currentTime: number) => {
      if (!isVisibleRef.current) return;

      const deltaTime = currentTime - lastTime;

      if (deltaTime >= frameInterval) {
        lastTime = currentTime - (deltaTime % frameInterval);
        renderFrame(true, currentTime);
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        isVisibleRef.current = false;
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      } else {
        isVisibleRef.current = true;
        lastTime = performance.now();
        scheduleNextMeteor(performance.now());
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    };

    const handleResize = () => {
      resizeCanvas();
      initStars();
      meteorsRef.current = [];
    };

    animationFrameRef.current = requestAnimationFrame(animate);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("resize", handleResize);

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
      aria-hidden="true"
    />
  );
}
