"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { FlaskConical, Zap, Clock, CircleDashed } from "lucide-react";
import type { WorkupRecommendation } from "@/lib/types";

interface WorkupRecommendationsProps {
  recommendations: WorkupRecommendation[];
}

const priorityConfig: Record<
  string,
  { color: string; bg: string; icon: React.ElementType; label: string }
> = {
  stat: {
    color: "text-[var(--med-red)]",
    bg: "bg-[var(--med-red)]/10",
    icon: Zap,
    label: "STAT",
  },
  routine: {
    color: "text-[var(--med-amber)]",
    bg: "bg-[var(--med-amber)]/10",
    icon: Clock,
    label: "Routine",
  },
  optional: {
    color: "text-muted-foreground",
    bg: "bg-muted/50",
    icon: CircleDashed,
    label: "Optional",
  },
};

export function WorkupRecommendationsView({
  recommendations,
}: WorkupRecommendationsProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <FlaskConical className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-medium">Workup Recommendations</h3>
      </div>

      <div className="flex flex-col gap-3">
        {recommendations.map((category, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="rounded-lg border border-border/50 bg-card/30 p-3"
          >
            <div className="mb-2 flex items-center gap-2">
              <span className="font-mono text-[10px] uppercase tracking-wider text-primary">
                {category.category}
              </span>
              <div className="h-px flex-1 bg-border/30" />
            </div>

            <div className="flex flex-col gap-2">
              {category.tests.map((test, j) => {
                const priority = priorityConfig[test.priority] || priorityConfig.routine;
                const PriorityIcon = priority.icon;

                return (
                  <motion.div
                    key={j}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 + j * 0.05 }}
                    className="flex items-start gap-2"
                  >
                    <Badge
                      variant="outline"
                      className={`shrink-0 gap-1 ${priority.color} border-current/20 text-[9px]`}
                    >
                      <PriorityIcon className="h-2.5 w-2.5" />
                      {priority.label}
                    </Badge>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs font-medium">{test.name}</span>
                      <span className="text-[11px] leading-relaxed text-muted-foreground">
                        {test.rationale}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
