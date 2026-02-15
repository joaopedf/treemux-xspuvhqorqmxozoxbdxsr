"use client";

import { motion } from "framer-motion";
import { FileText } from "lucide-react";

interface ClinicalSummaryProps {
  summary: string;
}

export function ClinicalSummary({ summary }: ClinicalSummaryProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-lg border border-primary/20 bg-primary/5 p-4"
    >
      <div className="mb-2 flex items-center gap-2">
        <FileText className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold text-primary">
          Clinical Impression
        </h3>
      </div>
      <p className="text-sm leading-relaxed text-muted-foreground">
        {summary}
      </p>
    </motion.div>
  );
}
