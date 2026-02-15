"use client";

import { motion } from "framer-motion";
import {
  Eye,
  Lightbulb,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  Brain,
} from "lucide-react";
import type { ReasoningStep } from "@/lib/types";

interface ReasoningTimelineProps {
  steps: ReasoningStep[];
}

const typeConfig: Record<
  ReasoningStep["type"],
  { icon: React.ElementType; color: string; dotColor: string; lineColor: string }
> = {
  observation: {
    icon: Eye,
    color: "text-[var(--med-teal)]",
    dotColor: "bg-[var(--med-teal)]",
    lineColor: "border-[var(--med-teal)]/20",
  },
  hypothesis: {
    icon: Lightbulb,
    color: "text-[var(--med-amber)]",
    dotColor: "bg-[var(--med-amber)]",
    lineColor: "border-[var(--med-amber)]/20",
  },
  evidence: {
    icon: BookOpen,
    color: "text-[var(--med-purple)]",
    dotColor: "bg-[var(--med-purple)]",
    lineColor: "border-[var(--med-purple)]/20",
  },
  conclusion: {
    icon: CheckCircle2,
    color: "text-[var(--med-green)]",
    dotColor: "bg-[var(--med-green)]",
    lineColor: "border-[var(--med-green)]/20",
  },
  warning: {
    icon: AlertTriangle,
    color: "text-[var(--med-red)]",
    dotColor: "bg-[var(--med-red)]",
    lineColor: "border-[var(--med-red)]/20",
  },
};

export function ReasoningTimeline({ steps }: ReasoningTimelineProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Brain className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-medium">Clinical Reasoning</h3>
      </div>

      <div className="relative flex flex-col">
        {/* Vertical line */}
        <div className="absolute bottom-0 left-[11px] top-0 w-px bg-border/50" />

        {steps.map((step, i) => {
          const config = typeConfig[step.type];
          const Icon = config.icon;

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                delay: i * 0.1,
                duration: 0.4,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="relative flex gap-3 pb-4 last:pb-0"
            >
              {/* Dot */}
              <div className="relative z-10 mt-1 flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full border border-border bg-background">
                <div className={`h-2 w-2 rounded-full ${config.dotColor}`} />
              </div>

              {/* Content */}
              <div className="flex flex-1 flex-col gap-1 rounded-lg border border-border/30 bg-card/20 p-3">
                <div className="flex items-center gap-2">
                  <Icon className={`h-3.5 w-3.5 ${config.color}`} />
                  <span className="text-xs font-semibold">{step.title}</span>
                  <span
                    className={`font-mono text-[9px] uppercase tracking-wider ${config.color}`}
                  >
                    {step.type}
                  </span>
                </div>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {step.content}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
