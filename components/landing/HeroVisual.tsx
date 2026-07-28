"use client";

import { useEffect, useRef } from "react";

type FieldLine = {
  row: number;
  phase: number;
  alpha: number;
  hueMix: number;
};

type Particle = {
  x: number;
  y: number;
  radius: number;
  alpha: number;
  speed: number;
  phase: number;
  violet: boolean;
};

type FieldModel = {
  width: number;
  height: number;
  lines: FieldLine[];
  samples: number[];
  particles: Particle[];
  compact: boolean;
};

const createModel = (
  width: number,
  height: number,
  compact: boolean,
): FieldModel => {
  const lineCount = compact ? 38 : 76;
  const sampleCount = compact ? 72 : 142;
  const particleCount = compact ? 26 : 68;

  return {
    width,
    height,
    compact,
    lines: Array.from({ length: lineCount }, (_, index) => ({
      row: index / Math.max(lineCount - 1, 1),
      phase: Math.sin(index * 2.731) * 0.55,
      alpha: 0.17 + (index / lineCount) * 0.24,
      hueMix: 0.5 + Math.sin(index * 1.17) * 0.5,
    })),
    samples: Array.from(
      { length: sampleCount },
      (_, index) => index / Math.max(sampleCount - 1, 1),
    ),
    particles: Array.from({ length: particleCount }, (_, index) => ({
      x: (Math.sin(index * 91.77) * 0.5 + 0.5) * 0.94 + 0.015,
      y: (Math.sin(index * 37.11 + 1.4) * 0.5 + 0.5) * 0.66 + 0.17,
      radius: 0.55 + (index % 4) * 0.23,
      alpha: 0.18 + (index % 5) * 0.07,
      speed: 0.000035 + (index % 7) * 0.000006,
      phase: index * 0.83,
      violet: index % 3 === 0,
    })),
  };
};

export default function HeroVisual() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const modelRef = useRef<FieldModel | null>(null);
  const frameRef = useRef<number | null>(null);
  const visibleRef = useRef(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d", { alpha: true });
    if (!context) return;

    const host = canvas.parentElement;
    if (!host) return;

    const reducedMotionQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    const coarsePointerQuery = window.matchMedia("(pointer: coarse)");
    let reducedMotion = reducedMotionQuery.matches;
    let coarsePointer = coarsePointerQuery.matches;
    let destroyed = false;

    const draw = (time: number) => {
      const model = modelRef.current;
      if (!model) return;

      const { width, height, lines, samples, particles } = model;
      const pointer = pointerRef.current;
      pointer.x += (pointer.targetX - pointer.x) * 0.035;
      pointer.y += (pointer.targetY - pointer.y) * 0.035;

      context.clearRect(0, 0, width, height);
      context.save();

      const focalX = width * 0.38 + pointer.x;
      const focalY = height * 0.57 + pointer.y;
      const phase = reducedMotion ? 0.65 : time * 0.00019;

      const violetGlow = context.createRadialGradient(
        focalX,
        focalY - height * 0.16,
        0,
        focalX,
        focalY,
        Math.min(width, height) * 0.46,
      );
      violetGlow.addColorStop(0, "rgba(178, 133, 255, 0.24)");
      violetGlow.addColorStop(0.28, "rgba(118, 93, 214, 0.12)");
      violetGlow.addColorStop(0.64, "rgba(50, 149, 175, 0.045)");
      violetGlow.addColorStop(1, "rgba(5, 11, 22, 0)");
      context.fillStyle = violetGlow;
      context.fillRect(0, 0, width, height);

      for (let lineIndex = 0; lineIndex < lines.length; lineIndex += 1) {
        const line = lines[lineIndex];
        const rowDistance = (line.row - 0.57) / 0.36;
        const rowEnvelope = Math.exp(-(rowDistance * rowDistance));
        const baseY = height * (0.2 + line.row * 0.66);

        context.beginPath();

        for (
          let sampleIndex = 0;
          sampleIndex < samples.length;
          sampleIndex += 1
        ) {
          const sample = samples[sampleIndex];
          const x = -width * 0.035 + sample * width * 1.07;
          const normalizedX = (x - focalX) / (width * 0.25);
          const mound = Math.exp(
            -(
              normalizedX * normalizedX * 1.42 +
              rowDistance * rowDistance * 0.86
            ),
          );
          const flowingWave =
            Math.sin(sample * 11.2 + phase + line.phase) * height * 0.009 +
            Math.sin(sample * 4.9 - phase * 0.72 + line.phase * 1.8) *
              height *
              0.006;
          const perspective =
            Math.pow(sample - 0.44, 2) * height * (0.042 + line.row * 0.065);
          const crestRipple =
            Math.sin(sample * 18 - phase * 0.5 + line.row * 7) *
            height *
            0.007 *
            mound;
          const y =
            baseY -
            height * 0.36 * mound * (0.42 + rowEnvelope * 0.6) +
            flowingWave +
            perspective +
            crestRipple;

          const dotRadius =
            0.42 + line.row * 0.42 + mound * 0.42 + (sampleIndex % 3) * 0.045;

          context.moveTo(x + dotRadius, y);
          context.arc(x, y, dotRadius, 0, Math.PI * 2);
        }

        const violetAmount = Math.min(1, rowEnvelope * 0.8 + line.hueMix * 0.2);
        context.globalAlpha = line.alpha * (0.72 + rowEnvelope * 0.36);
        context.fillStyle =
          violetAmount > 0.58 ? "rgb(143, 113, 244)" : "rgb(69, 180, 207)";
        context.fill();
      }

      context.globalAlpha = 1;
      for (let index = 0; index < particles.length; index += 1) {
        const particle = particles[index];
        const drift = reducedMotion
          ? 0
          : Math.sin(time * particle.speed + particle.phase) * 8;
        const x = particle.x * width + drift;
        const y =
          particle.y * height +
          Math.cos(time * particle.speed * 0.72 + particle.phase) * 5;
        const edgeFade = Math.sin(Math.min(1, particle.x * 1.3) * Math.PI);

        context.beginPath();
        context.globalAlpha = particle.alpha * Math.max(0, edgeFade);
        context.fillStyle = particle.violet ? "#a47be8" : "#57c9df";
        context.arc(x, y, particle.radius, 0, Math.PI * 2);
        context.fill();
      }

      context.restore();

      if (!destroyed && visibleRef.current && !reducedMotion) {
        frameRef.current = requestAnimationFrame(draw);
      }
    };

    const resize = () => {
      const rect = host.getBoundingClientRect();
      const width = Math.max(1, Math.round(rect.width));
      const height = Math.max(1, Math.round(rect.height));
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const compact = width < 520 || window.innerWidth < 768;

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      modelRef.current = createModel(width, height, compact);

      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
      draw(reducedMotion ? 0 : performance.now());
    };

    const restart = () => {
      reducedMotion = reducedMotionQuery.matches;
      coarsePointer = coarsePointerQuery.matches;
      pointerRef.current.targetX = 0;
      pointerRef.current.targetY = 0;
      resize();
    };

    const onPointerMove = (event: PointerEvent) => {
      if (coarsePointer || reducedMotion) return;
      const rect = host.getBoundingClientRect();
      const normalizedX = event.clientX - rect.left - rect.width / 2;
      const normalizedY = event.clientY - rect.top - rect.height / 2;
      pointerRef.current.targetX = (normalizedX / rect.width) * 6;
      pointerRef.current.targetY = (normalizedY / rect.height) * 6;
    };

    const onPointerLeave = () => {
      pointerRef.current.targetX = 0;
      pointerRef.current.targetY = 0;
    };

    const resizeObserver = new ResizeObserver(resize);
    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = entry.isIntersecting;
        if (
          entry.isIntersecting &&
          !reducedMotion &&
          frameRef.current === null
        ) {
          frameRef.current = requestAnimationFrame(draw);
        }
        if (!entry.isIntersecting && frameRef.current !== null) {
          cancelAnimationFrame(frameRef.current);
          frameRef.current = null;
        }
      },
      { threshold: 0.05 },
    );

    resizeObserver.observe(host);
    visibilityObserver.observe(host);
    host.addEventListener("pointermove", onPointerMove, { passive: true });
    host.addEventListener("pointerleave", onPointerLeave);
    reducedMotionQuery.addEventListener("change", restart);
    coarsePointerQuery.addEventListener("change", restart);
    resize();

    return () => {
      destroyed = true;
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      host.removeEventListener("pointermove", onPointerMove);
      host.removeEventListener("pointerleave", onPointerLeave);
      reducedMotionQuery.removeEventListener("change", restart);
      coarsePointerQuery.removeEventListener("change", restart);
    };
  }, []);

  return (
    <div className="hero-visual hero-visual--field" aria-hidden="true">
      <canvas ref={canvasRef} />
      <span className="field-vignette" />
    </div>
  );
}
