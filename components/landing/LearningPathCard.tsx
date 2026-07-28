"use client";

import { EntropyField } from "@/components/ui/EntropyField";
import { ArrowLeft } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { easeOut } from "./animation";

type LearningPathCardProps = {
  index: number;
  title: string;
  description: string;
  href: string;
  cta: string;
  variant: "ai" | "math";
  pattern: ReactNode;
};

export function LearningPathCard({
  index,
  title,
  description,
  href,
  cta,
  variant,
  pattern,
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
      <div className="path-pattern" aria-hidden="true">
        {pattern}
      </div>
      <EntropyField variant={variant} />
      <div className="path-card-content">
        <div className="path-emblem" aria-hidden="true">
          <span className="path-emblem-ring" />
          {variant === "ai" ? (
            <span className="ai-emblem">
              <i />
              <i />
              <i />
              <i />
            </span>
          ) : (
            <span className="math-emblem">∑</span>
          )}
        </div>
        <h3>{title}</h3>
        <p>{description}</p>
        <a className="path-link focus-ring" href={href}>
          {cta}
          <ArrowLeft size={19} strokeWidth={1.7} aria-hidden="true" />
        </a>
      </div>
    </motion.article>
  );
}
