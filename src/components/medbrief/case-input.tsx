"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Send,
  FileText,
  Sparkles,
  ChevronDown,
  Stethoscope,
} from "lucide-react";
import { SAMPLE_CASES } from "@/lib/types";

interface CaseInputProps {
  onSubmit: (presentation: string) => void;
  isAnalyzing: boolean;
}

export function CaseInput({ onSubmit, isAnalyzing }: CaseInputProps) {
  const [input, setInput] = useState("");
  const [showSamples, setShowSamples] = useState(false);

  const handleSubmit = () => {
    if (input.trim() && !isAnalyzing) {
      onSubmit(input.trim());
    }
  };

  const handleSampleSelect = (presentation: string) => {
    setInput(presentation);
    setShowSamples(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="flex flex-col gap-4"
    >
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Stethoscope className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-medium tracking-tight">
            Patient Presentation
          </h2>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowSamples(!showSamples)}
          className="h-7 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
        >
          <FileText className="h-3 w-3" />
          Sample Cases
          <ChevronDown
            className={`h-3 w-3 transition-transform ${showSamples ? "rotate-180" : ""}`}
          />
        </Button>
      </div>

      {/* Sample Cases */}
      <AnimatePresence>
        {showSamples && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="grid gap-2 sm:grid-cols-2">
              {SAMPLE_CASES.map((sample, i) => (
                <motion.button
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => handleSampleSelect(sample.presentation)}
                  className="group flex items-start gap-3 rounded-lg border border-border/50 bg-card/50 p-3 text-left transition-all hover:border-primary/30 hover:bg-card"
                >
                  <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary/10 text-xs font-mono text-primary transition-colors group-hover:bg-primary/20">
                    {i + 1}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{sample.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {sample.description}
                    </p>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input Area */}
      <div className="relative">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter patient presentation, history, vitals, and physical exam findings..."
          className="min-h-[180px] resize-none border-border/50 bg-card/30 font-mono text-sm leading-relaxed placeholder:text-muted-foreground/50 focus:border-primary/40 focus:ring-1 focus:ring-primary/20"
          disabled={isAnalyzing}
        />
        <div className="absolute bottom-3 right-3 flex items-center gap-2">
          <Badge
            variant="secondary"
            className="font-mono text-[10px] uppercase tracking-wider"
          >
            {input.length > 0 ? `${input.split(/\s+/).filter(Boolean).length} words` : "Empty"}
          </Badge>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          <span className="text-primary/70">Tip:</span> Include vitals, PMH,
          medications, and physical exam for best results
        </p>
        <Button
          onClick={handleSubmit}
          disabled={!input.trim() || isAnalyzing}
          className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
          size="sm"
        >
          {isAnalyzing ? (
            <>
              <Sparkles className="h-3.5 w-3.5 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Send className="h-3.5 w-3.5" />
              Analyze Case
            </>
          )}
        </Button>
      </div>
    </motion.div>
  );
}
