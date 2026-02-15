"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { ListChecks, ChevronRight, AlertCircle, Shield, ShieldAlert, ShieldOff } from "lucide-react";
import type { DifferentialDiagnosis } from "@/lib/types";
import { useState } from "react";

interface DifferentialDiagnosisProps {
  diagnoses: DifferentialDiagnosis[];
}

const severityConfig: Record<
  DifferentialDiagnosis["severity"],
  { color: string; bg: string; border: string; icon: React.ElementType; label: string }
> = {
  low: {
    color: "text-[var(--med-green)]",
    bg: "bg-[var(--med-green)]/10",
    border: "border-[var(--med-green)]/20",
    icon: Shield,
    label: "Low",
  },
  moderate: {
    color: "text-[var(--med-amber)]",
    bg: "bg-[var(--med-amber)]/10",
    border: "border-[var(--med-amber)]/20",
    icon: ShieldAlert,
    label: "Moderate",
  },
  high: {
    color: "text-[var(--med-red)]",
    bg: "bg-[var(--med-red)]/10",
    border: "border-[var(--med-red)]/20",
    icon: ShieldOff,
    label: "High",
  },
  critical: {
    color: "text-[var(--med-red)]",
    bg: "bg-[var(--med-red)]/15",
    border: "border-[var(--med-red)]/30",
    icon: AlertCircle,
    label: "Critical",
  },
};

function getBarColor(confidence: number): string {
  if (confidence >= 70) return "bg-[var(--med-teal)]";
  if (confidence >= 40) return "bg-[var(--med-amber)]";
  return "bg-[var(--med-purple)]";
}

function DiagnosisCard({
  dx,
  index,
  rank,
}: {
  dx: DifferentialDiagnosis;
  index: number;
  rank: number;
}) {
  const [expanded, setExpanded] = useState(index === 0);
  const severity = severityConfig[dx.severity];
  const SeverityIcon = severity.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={`group overflow-hidden rounded-lg border transition-all ${
        expanded
          ? "border-primary/30 bg-card/60"
          : "border-border/50 bg-card/30 hover:border-border"
      }`}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center gap-3 p-3 text-left"
      >
        {/* Rank */}
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10 font-mono text-sm font-bold text-primary">
          #{rank}
        </div>

        {/* Main info */}
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold truncate">{dx.name}</span>
            <Badge
              variant="outline"
              className={`shrink-0 ${severity.border} ${severity.color} text-[9px] gap-1`}
            >
              <SeverityIcon className="h-2.5 w-2.5" />
              {severity.label}
            </Badge>
          </div>

          {/* Confidence bar */}
          <div className="flex items-center gap-2">
            <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-secondary">
              <div
                className={`absolute left-0 top-0 h-full rounded-full ${getBarColor(dx.confidence)} animate-fill-bar`}
                style={{ width: `${dx.confidence}%` }}
              />
            </div>
            <span className="shrink-0 font-mono text-[10px] text-muted-foreground">
              {dx.confidence}%
            </span>
          </div>
        </div>

        <ChevronRight
          className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${
            expanded ? "rotate-90" : ""
          }`}
        />
      </button>

      {/* Expanded Content */}
      {expanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="border-t border-border/30 px-3 pb-3 pt-2"
        >
          <p className="mb-2 text-xs leading-relaxed text-muted-foreground">
            {dx.reasoning}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {dx.keyFindings.map((finding, i) => (
              <Badge
                key={i}
                variant="secondary"
                className="text-[10px] font-normal"
              >
                {finding}
              </Badge>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

export function DifferentialDiagnosisView({
  diagnoses,
}: DifferentialDiagnosisProps) {
  const sorted = [...diagnoses].sort((a, b) => b.confidence - a.confidence);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <ListChecks className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-medium">Differential Diagnosis</h3>
        <Badge variant="secondary" className="font-mono text-[10px]">
          {sorted.length} considered
        </Badge>
      </div>

      <div className="flex flex-col gap-2">
        {sorted.map((dx, i) => (
          <DiagnosisCard key={i} dx={dx} index={i} rank={i + 1} />
        ))}
      </div>
    </div>
  );
}
