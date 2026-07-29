"use client";

import { motion, useReducedMotion } from "motion/react";
import { easeOut } from "./animation";
import { LearningPathCard } from "./LearningPathCard";
import { ProcessIndicator } from "./ProcessIndicator";

export function LearningPaths() {
  const reducedMotion = useReducedMotion();

  return (
    <section
      className="learning-section"
      id="learning-paths"
      aria-labelledby="paths-title"
    >
      <div className="site-shell">
        <motion.div
          className="section-heading"
          initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.65 }}
          transition={{ duration: reducedMotion ? 0.35 : 0.7, ease: easeOut }}
        >
          <span className="section-heading-line" aria-hidden="true" />
          <h2 id="paths-title">مسیر یادگیری خودت را انتخاب کن</h2>
          <span className="section-heading-line" aria-hidden="true" />
        </motion.div>

        <div className="paths-grid">
          <LearningPathCard
            index={0}
            title="هوش مصنوعی"
            description="یادگیری مفاهیم و ساخت پروژه‌های کاربردی در دنیای هوش مصنوعی"
            href="/assessment?path=ai"
            cta="شروع مسیر"
            variant="ai"
          />
          <LearningPathCard
            index={1}
            title="ریاضی"
            description="تقویت پایه ریاضی و یادگیری مباحث کاربردی و حل مسئله"
            href="/assessment?path=math"
            cta="شروع مسیر"
            variant="math"
          />
        </div>

        <ProcessIndicator />
      </div>
    </section>
  );
}
