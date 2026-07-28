"use client";

import { ListChecks, Mouse, Play, Rocket, ScanSearch } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { easeOut } from "./animation";

const steps = [
  {
    title: "تست تعیین سطح",
    description: "چند تست کوتاه برای سنجش سطح دانش و مهارت‌های شما",
    icon: ListChecks,
  },
  {
    title: "تحلیل و پیشنهاد",
    description: "تحلیل نتایج و انتخاب بهترین دوره‌ها از بانک دوره‌ها",
    icon: ScanSearch,
  },
  {
    title: "یادگیری هدفمند",
    description: "شروع یادگیری با مسیر شخصی‌سازی شده و منابع منتخب",
    icon: Play,
  },
  {
    title: "پیشرفت و ساخت",
    description: "ساخت پروژه‌ها، حل مسئله و رسیدن به تسلط",
    icon: Rocket,
  },
];
const numbers = ["۱", "۲", "۳", "۴"];

export function ProcessIndicator() {
  const reducedMotion = useReducedMotion();

  return (
    <div className="process-wrap" id="process">
      <motion.h3
        initial={false}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.55 }}
      >
        مسیر یادگیری شخصی‌سازی شده
      </motion.h3>
      <ol className="process-indicator" aria-label="فرایند مسیر یادگیری">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <motion.li
              key={step.title}
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: reducedMotion ? 0.3 : 0.66,
                delay: index * 0.08,
                ease: easeOut,
              }}
            >
              <div className="process-icon">
                <Icon size={25} strokeWidth={1.45} />
              </div>
              <span>{numbers[index]}</span>
              <strong>{step.title}</strong>
              <p>{step.description}</p>
            </motion.li>
          );
        })}
      </ol>
      <motion.div
        className="scroll-hint"
        initial={false}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.55, delay: 0.25 }}
      >
        <span aria-hidden="true">
          <Mouse size={15} strokeWidth={1.45} />
        </span>
        برای مشاهده مسیرها اسکرول کنید
      </motion.div>
    </div>
  );
}
