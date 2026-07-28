"use client";

import type { CSSProperties } from "react";

type EntropyFieldProps = {
  variant?: "ai" | "math";
};

export function EntropyField({ variant = "ai" }: EntropyFieldProps) {
  return (
    <div className={`entropy-field entropy-field--${variant}`} aria-hidden="true">
      {Array.from({ length: 24 }, (_, index) => (
        <span key={index} style={{ "--i": index } as CSSProperties} />
      ))}
    </div>
  );
}
