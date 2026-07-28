"use client";

import { motion, useReducedMotion } from "motion/react";
import { reveal, revealTransition } from "./animation";

export function Hero() {
  const reducedMotion = useReducedMotion();
  const transition = reducedMotion ? { duration: 0.35 } : revealTransition;

  return (
    <section className="hero-section" id="home" aria-labelledby="hero-title">
      <div className="site-shell hero-grid hero-grid--background-owned">
        <div className="hero-copy" id="about">
          <h1 id="hero-title">
            {[
              { text: "مسیر واقعی", accent: false },
              { text: "هوش مصنوعی و ریاضی", accent: true },
              { text: "از همین‌جا شروع می‌شود", accent: false },
            ].map((line, index) => (
              <motion.span
                className={`hero-title-line ${line.accent ? "hero-title-line--accent" : ""}`}
                initial={
                  reducedMotion
                    ? { opacity: 0 }
                    : { opacity: 0, y: 20, filter: "blur(9px)" }
                }
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ ...transition, delay: 0.1 + index * 0.13 }}
                key={line.text}
              >
                {line.text}
              </motion.span>
            ))}
          </h1>

          <motion.p
            className="hero-description"
            initial={reducedMotion ? { opacity: 0 } : reveal.hidden}
            animate={reveal.visible}
            transition={{ ...transition, delay: 0.34 }}
          >
            با چند تست کوتاه، نقطه شروع تو مشخص می‌شود و مسیر یادگیری متناسب
            با هدفت را انتخاب می‌کنی.
          </motion.p>
        </div>
      </div>
    </section>
  );
}
