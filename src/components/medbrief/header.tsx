"use client";

import { Activity, Brain } from "lucide-react";
import { motion } from "framer-motion";

export function Header() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl"
    >
      <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 glow-teal">
            <Brain className="h-5 w-5 text-primary" />
            <div className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-primary med-pulse" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-base font-semibold tracking-tight">
              Med<span className="text-primary">Brief</span>{" "}
              <span className="font-mono text-xs text-muted-foreground">AI</span>
            </h1>
            <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground">
              Clinical Reasoning Copilot
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden items-center gap-2 rounded-full border border-border/50 bg-card px-3 py-1.5 sm:flex">
            <Activity className="h-3 w-3 text-primary" />
            <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              GPT-4o Powered
            </span>
          </div>
          <div className="flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5">
            <div className="h-1.5 w-1.5 rounded-full bg-primary med-pulse" />
            <span className="font-mono text-[10px] uppercase tracking-wider text-primary">
              Ready
            </span>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
