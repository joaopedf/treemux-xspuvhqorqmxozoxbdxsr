"use client";

import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";

interface RedFlagsProps {
  flags: string[];
}

export function RedFlags({ flags }: RedFlagsProps) {
  if (flags.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="rounded-lg border border-[var(--med-red)]/30 bg-[var(--med-red)]/5 p-4"
    >
      <div className="mb-2 flex items-center gap-2">
        <AlertTriangle className="h-4 w-4 text-[var(--med-red)]" />
        <h3 className="text-sm font-semibold text-[var(--med-red)]">
          Red Flags
        </h3>
      </div>
      <ul className="flex flex-col gap-1.5">
        {flags.map((flag, i) => (
          <motion.li
            key={i}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex items-start gap-2 text-xs"
          >
            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[var(--med-red)]" />
            <span className="leading-relaxed text-muted-foreground">
              {flag}
            </span>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}
