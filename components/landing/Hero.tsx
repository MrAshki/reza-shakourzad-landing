"use client";

import { motion, useReducedMotion } from "motion/react";
import type { MouseEvent } from "react";
import { reveal, revealTransition } from "./animation";

export function Hero() {
  const reducedMotion = useReducedMotion();
  const transition = reducedMotion ? { duration: 0.35 } : revealTransition;

  const scrollToLearningPaths = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    document.querySelector("#learning-paths")?.scrollIntoView({
      behavior: reducedMotion ? "auto" : "smooth",
      block: "start",
    });
  };

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

          <motion.div
            className="hero-actions"
            initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 14, filter: "blur(7px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ ...transition, delay: 0.48 }}
          >
            <a className="hero-primary-cta focus-ring" href="#learning-paths" onClick={scrollToLearningPaths}>
              همین حالا رایگان شروع کن
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
