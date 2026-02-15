"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Heart,
  Activity,
  Pill,
  AlertTriangle,
  ClipboardList,
} from "lucide-react";
import type { ExtractedData } from "@/lib/types";

interface ExtractedDataProps {
  data: ExtractedData;
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0 },
};

function DataSection({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div variants={itemVariants} className="flex flex-col gap-1.5">
      <div className="flex items-center gap-1.5">
        <Icon className="h-3 w-3 text-primary/70" />
        <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          {title}
        </span>
      </div>
      <div className="pl-[18px]">{children}</div>
    </motion.div>
  );
}

export function ExtractedDataView({ data }: ExtractedDataProps) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-4 rounded-lg border border-border/50 bg-card/30 p-4"
    >
      <div className="flex items-center gap-2">
        <ClipboardList className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-medium">Extracted Clinical Data</h3>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <DataSection icon={User} title="Demographics">
          <p className="text-sm">{data.demographics}</p>
        </DataSection>

        <DataSection icon={Heart} title="Chief Complaint">
          <p className="text-sm font-medium text-primary">
            {data.chiefComplaint}
          </p>
        </DataSection>
      </div>

      <DataSection icon={ClipboardList} title="HPI Summary">
        <p className="text-sm leading-relaxed text-muted-foreground">
          {data.hpiSummary}
        </p>
      </DataSection>

      <div className="grid gap-4 sm:grid-cols-2">
        <DataSection icon={Activity} title="Vital Signs">
          <div className="flex flex-wrap gap-1.5">
            {data.vitalSigns.map((vs, i) => (
              <Badge
                key={i}
                variant="secondary"
                className="font-mono text-[10px]"
              >
                {vs}
              </Badge>
            ))}
          </div>
        </DataSection>

        <DataSection icon={AlertTriangle} title="Symptoms">
          <div className="flex flex-wrap gap-1.5">
            {data.symptoms.map((s, i) => (
              <Badge
                key={i}
                variant="outline"
                className="border-primary/20 text-[10px] text-primary"
              >
                {s}
              </Badge>
            ))}
          </div>
        </DataSection>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <DataSection icon={Pill} title="Medications">
          <div className="flex flex-col gap-0.5">
            {data.medications.length > 0 ? (
              data.medications.map((m, i) => (
                <span key={i} className="font-mono text-xs text-muted-foreground">
                  {m}
                </span>
              ))
            ) : (
              <span className="font-mono text-xs text-muted-foreground/50">
                None reported
              </span>
            )}
          </div>
        </DataSection>

        <DataSection icon={ClipboardList} title="Relevant History">
          <div className="flex flex-col gap-0.5">
            {data.relevantHistory.length > 0 ? (
              data.relevantHistory.map((h, i) => (
                <span key={i} className="font-mono text-xs text-muted-foreground">
                  {h}
                </span>
              ))
            ) : (
              <span className="font-mono text-xs text-muted-foreground/50">
                None reported
              </span>
            )}
          </div>
        </DataSection>
      </div>
    </motion.div>
  );
}
