"use client";

import { ArrowLeft } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { easeOut } from "./animation";
import { PathCardScene } from "./PathCardScene";

type LearningPathCardProps = {
  index: number;
  title: string;
  description: string;
  href: string;
  cta: string;
  variant: "ai" | "math";
};

export function LearningPathCard({
  index,
  title,
  description,
  href,
  cta,
  variant,
}: LearningPathCardProps) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.article
      className={`path-card path-card--${variant}`}
      initial={false}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: reducedMotion ? 0.35 : 0.85,
        delay: index * 0.12,
        ease: easeOut,
      }}
    >
      <PathCardScene variant={variant} />
      <div className="path-card-content">
        {variant === "ai" ? (
          <div className="path-emblem" aria-hidden="true">
            <span className="path-emblem-ring" />
            <span className="ai-emblem">
              <i />
              <i />
              <i />
              <i />
            </span>
          </div>
        ) : variant === "math" ? (
          <div className="path-emblem" aria-hidden="true">
            <span className="path-emblem-ring" />
            <span className="math-emblem">∑</span>
          </div>
        ) : null}
        <h3>{title}</h3>
        <p>{description}</p>
        <a className="path-link focus-ring" href={href}>
          <span className="path-link-orb" aria-hidden="true" />
          {cta}
          <ArrowLeft size={19} strokeWidth={1.7} aria-hidden="true" />
        </a>
      </div>
    </motion.article>
  );
}
