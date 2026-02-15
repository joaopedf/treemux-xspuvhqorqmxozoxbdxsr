"use client";

import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import {
  FileSearch,
  Brain,
  ListChecks,
  Pill,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import type { AnalysisState } from "@/lib/types";

const STATUS_CONFIG: Record<
  AnalysisState["status"],
  { icon: React.ElementType; label: string; color: string }
> = {
  idle: { icon: FileSearch, label: "Ready", color: "text-muted-foreground" },
  extracting: {
    icon: FileSearch,
    label: "Extracting Clinical Data",
    color: "text-primary",
  },
  reasoning: {
    icon: Brain,
    label: "Clinical Reasoning",
    color: "text-primary",
  },
  diagnosing: {
    icon: ListChecks,
    label: "Generating Differential",
    color: "text-primary",
  },
  recommending: {
    icon: Pill,
    label: "Building Workup Plan",
    color: "text-primary",
  },
  complete: {
    icon: CheckCircle2,
    label: "Analysis Complete",
    color: "text-[var(--med-green)]",
  },
  error: {
    icon: AlertCircle,
    label: "Analysis Failed",
    color: "text-destructive",
  },
};

interface AnalysisStatusProps {
  state: AnalysisState;
}

export function AnalysisStatus({ state }: AnalysisStatusProps) {
  const config = STATUS_CONFIG[state.status];
  const Icon = config.icon;

  if (state.status === "idle") return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-3 rounded-lg border border-border/50 bg-card/50 p-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon
            className={`h-4 w-4 ${config.color} ${
              state.status !== "complete" && state.status !== "error"
                ? "animate-pulse"
                : ""
            }`}
          />
          <span className="text-sm font-medium">{config.label}</span>
        </div>
        <span className="font-mono text-xs text-muted-foreground">
          {state.progress}%
        </span>
      </div>
      <Progress value={state.progress} className="h-1" />
      {state.currentStep && state.status !== "complete" && (
        <p className="font-mono text-xs text-muted-foreground typing-cursor">
          {state.currentStep}
        </p>
      )}
      {state.error && (
        <p className="text-xs text-destructive">{state.error}</p>
      )}
    </motion.div>
  );
}
