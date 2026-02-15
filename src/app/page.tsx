"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "@/components/medbrief/header";
import { CaseInput } from "@/components/medbrief/case-input";
import { AnalysisStatus } from "@/components/medbrief/analysis-status";
import { ExtractedDataView } from "@/components/medbrief/extracted-data";
import { DifferentialDiagnosisView } from "@/components/medbrief/differential-diagnosis";
import { ReasoningTimeline } from "@/components/medbrief/reasoning-timeline";
import { WorkupRecommendationsView } from "@/components/medbrief/workup-recommendations";
import { RedFlags } from "@/components/medbrief/red-flags";
import { ClinicalSummary } from "@/components/medbrief/clinical-summary";
import { FollowUpChat } from "@/components/medbrief/follow-up-chat";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Brain,
  FlaskConical,
  RotateCcw,
  Sparkles,
  Stethoscope,
  Activity,
  ShieldCheck,
} from "lucide-react";
import type { AnalysisState, ClinicalAnalysis } from "@/lib/types";

export default function Home() {
  const [analysisState, setAnalysisState] = useState<AnalysisState>({
    status: "idle",
    progress: 0,
    currentStep: "",
    result: null,
    error: null,
    rawStream: "",
  });

  const handleAnalyze = useCallback(async (presentation: string) => {
    setAnalysisState({
      status: "extracting",
      progress: 10,
      currentStep: "Reading patient presentation and extracting clinical data...",
      result: null,
      error: null,
      rawStream: "",
    });

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ presentation }),
      });

      if (!response.ok) {
        throw new Error(`Analysis failed: ${response.statusText}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No response stream");

      const decoder = new TextDecoder();
      let accumulated = "";
      let lastProgressUpdate = Date.now();

      const stages: { threshold: number; status: AnalysisState["status"]; step: string }[] = [
        { threshold: 0.1, status: "extracting", step: "Parsing clinical presentation..." },
        { threshold: 0.2, status: "extracting", step: "Identifying vital signs and symptoms..." },
        { threshold: 0.3, status: "reasoning", step: "Analyzing symptom patterns..." },
        { threshold: 0.4, status: "reasoning", step: "Correlating findings with clinical knowledge..." },
        { threshold: 0.55, status: "diagnosing", step: "Generating differential diagnoses..." },
        { threshold: 0.7, status: "diagnosing", step: "Ranking diagnoses by likelihood..." },
        { threshold: 0.8, status: "recommending", step: "Building workup recommendations..." },
        { threshold: 0.9, status: "recommending", step: "Finalizing clinical analysis..." },
      ];

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        accumulated += decoder.decode(value, { stream: true });

        const estimatedTotal = 3000;
        const progress = Math.min(
          95,
          Math.round((accumulated.length / estimatedTotal) * 100)
        );

        const now = Date.now();
        if (now - lastProgressUpdate > 300) {
          const currentStage =
            [...stages].reverse().find((s) => progress / 100 >= s.threshold) ||
            stages[0];

          setAnalysisState((prev) => ({
            ...prev,
            status: currentStage.status,
            progress,
            currentStep: currentStage.step,
            rawStream: accumulated,
          }));
          lastProgressUpdate = now;
        }
      }

      let parsed: ClinicalAnalysis;
      try {
        const jsonMatch = accumulated.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error("No JSON found in response");
        parsed = JSON.parse(jsonMatch[0]);
      } catch {
        throw new Error(
          "Failed to parse clinical analysis. The AI response was malformed."
        );
      }

      setAnalysisState({
        status: "complete",
        progress: 100,
        currentStep: "Analysis complete",
        result: parsed,
        error: null,
        rawStream: accumulated,
      });
    } catch (error) {
      setAnalysisState((prev) => ({
        ...prev,
        status: "error",
        error:
          error instanceof Error ? error.message : "An unexpected error occurred",
        progress: 0,
      }));
    }
  }, []);

  const handleReset = () => {
    setAnalysisState({
      status: "idle",
      progress: 0,
      currentStep: "",
      result: null,
      error: null,
      rawStream: "",
    });
  };

  const isAnalyzing =
    analysisState.status !== "idle" &&
    analysisState.status !== "complete" &&
    analysisState.status !== "error";

  const result = analysisState.result;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="mx-auto max-w-[1600px] p-4 sm:p-6">
        {!result ? (
          /* Input Mode */
          <div className="mx-auto max-w-3xl">
            {/* Hero */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 text-center"
            >
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                <span className="font-mono text-xs uppercase tracking-wider text-primary">
                  AI-Powered Clinical Analysis
                </span>
              </div>
              <h2 className="mb-3 text-3xl font-bold tracking-tight sm:text-4xl">
                Clinical Reasoning{" "}
                <span className="text-primary">Copilot</span>
              </h2>
              <p className="mx-auto max-w-lg text-sm leading-relaxed text-muted-foreground">
                Enter a patient presentation and receive structured differential
                diagnoses, evidence-based workup recommendations, and transparent
                clinical reasoning — all in real-time.
              </p>

              {/* Feature pills */}
              <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                {[
                  { icon: Stethoscope, label: "Differential Dx" },
                  { icon: Brain, label: "Clinical Reasoning" },
                  { icon: FlaskConical, label: "Workup Plans" },
                  { icon: Activity, label: "Red Flag Detection" },
                  { icon: ShieldCheck, label: "Evidence-Based" },
                ].map((feat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.06 }}
                    className="flex items-center gap-1.5 rounded-full border border-border/50 bg-card/30 px-3 py-1"
                  >
                    <feat.icon className="h-3 w-3 text-primary/60" />
                    <span className="text-[11px] text-muted-foreground">
                      {feat.label}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <CaseInput onSubmit={handleAnalyze} isAnalyzing={isAnalyzing} />

            <AnimatePresence>
              {analysisState.status !== "idle" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="mt-4"
                >
                  <AnalysisStatus state={analysisState} />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Disclaimer */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-8 text-center text-[10px] leading-relaxed text-muted-foreground/50"
            >
              MedBrief AI is a clinical decision support tool for educational
              purposes only. It does not replace clinical judgment. Always verify
              recommendations against current evidence-based guidelines.
            </motion.p>
          </div>
        ) : (
          /* Results Mode */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* Results Header */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--med-green)]/10 glow-teal">
                  <Brain className="h-5 w-5 text-[var(--med-green)]" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold tracking-tight">
                    Analysis Complete
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    {result.differentialDiagnoses.length} diagnoses
                    <span className="mx-1.5 text-border">|</span>
                    {result.reasoningSteps.length} reasoning steps
                    <span className="mx-1.5 text-border">|</span>
                    {result.redFlags.length} red flags identified
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                className="gap-1.5 self-start sm:self-auto"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                New Case
              </Button>
            </div>

            {/* Red Flags */}
            {result.redFlags.length > 0 && (
              <div className="mb-6">
                <RedFlags flags={result.redFlags} />
              </div>
            )}

            {/* Clinical Summary */}
            <div className="mb-6">
              <ClinicalSummary summary={result.clinicalSummary} />
            </div>

            <Separator className="mb-6" />

            {/* Two-column layout on desktop */}
            <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
              {/* Left: Differential + Workup */}
              <div className="flex flex-col gap-6">
                <DifferentialDiagnosisView
                  diagnoses={result.differentialDiagnoses}
                />
                <Separator />
                <WorkupRecommendationsView
                  recommendations={result.workupRecommendations}
                />
              </div>

              {/* Right: Reasoning + Data */}
              <div className="flex flex-col gap-6">
                <ReasoningTimeline steps={result.reasoningSteps} />
                <Separator />
                <ExtractedDataView data={result.extractedData} />
              </div>
            </div>

            {/* Follow-up Chat */}
            <FollowUpChat analysis={result} />
          </motion.div>
        )}
      </main>
    </div>
  );
}
