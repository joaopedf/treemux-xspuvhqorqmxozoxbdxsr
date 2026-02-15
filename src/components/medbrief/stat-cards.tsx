"use client";

import { motion } from "framer-motion";
import {
  ListChecks,
  Brain,
  AlertTriangle,
  FlaskConical,
  TrendingUp,
} from "lucide-react";
import type { ClinicalAnalysis } from "@/lib/types";

interface StatCardsProps {
  analysis: ClinicalAnalysis;
}

export function StatCards({ analysis }: StatCardsProps) {
  const topDx = [...analysis.differentialDiagnoses].sort(
    (a, b) => b.confidence - a.confidence
  )[0];

  const totalTests = analysis.workupRecommendations.reduce(
    (acc, cat) => acc + cat.tests.length,
    0
  );

  const statTests = analysis.workupRecommendations.reduce(
    (acc, cat) => acc + cat.tests.filter((t) => t.priority === "stat").length,
    0
  );

  const stats = [
    {
      icon: TrendingUp,
      label: "Top Diagnosis",
      value: topDx?.name || "N/A",
      sub: `${topDx?.confidence || 0}% confidence`,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      icon: ListChecks,
      label: "Differentials",
      value: `${analysis.differentialDiagnoses.length}`,
      sub: "diagnoses considered",
      color: "text-[var(--med-purple)]",
      bg: "bg-[var(--med-purple)]/10",
    },
    {
      icon: AlertTriangle,
      label: "Red Flags",
      value: `${analysis.redFlags.length}`,
      sub: analysis.redFlags.length > 0 ? "requiring attention" : "none identified",
      color:
        analysis.redFlags.length > 0
          ? "text-[var(--med-red)]"
          : "text-[var(--med-green)]",
      bg:
        analysis.redFlags.length > 0
          ? "bg-[var(--med-red)]/10"
          : "bg-[var(--med-green)]/10",
    },
    {
      icon: FlaskConical,
      label: "Workup Tests",
      value: `${totalTests}`,
      sub: `${statTests} stat, ${totalTests - statTests} routine/optional`,
      color: "text-[var(--med-amber)]",
      bg: "bg-[var(--med-amber)]/10",
    },
    {
      icon: Brain,
      label: "Reasoning Steps",
      value: `${analysis.reasoningSteps.length}`,
      sub: "clinical reasoning steps",
      color: "text-primary",
      bg: "bg-primary/10",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {stats.map((stat, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.06 }}
          className="flex flex-col gap-1 rounded-lg border border-border/50 bg-card/30 p-3"
        >
          <div className="flex items-center gap-1.5">
            <div
              className={`flex h-5 w-5 items-center justify-center rounded ${stat.bg}`}
            >
              <stat.icon className={`h-3 w-3 ${stat.color}`} />
            </div>
            <span className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
              {stat.label}
            </span>
          </div>
          <p
            className={`text-sm font-semibold leading-tight ${
              stat.label === "Top Diagnosis" ? "truncate" : ""
            }`}
          >
            {stat.value}
          </p>
          <p className="text-[10px] text-muted-foreground">{stat.sub}</p>
        </motion.div>
      ))}
    </div>
  );
}
