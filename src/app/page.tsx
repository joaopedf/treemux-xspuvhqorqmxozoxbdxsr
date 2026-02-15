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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Brain,
  ListChecks,
  FlaskConical,
  ClipboardList,
  RotateCcw,
  Sparkles,
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

      // Progress simulation stages
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

        // Estimate progress based on accumulated content length (approximate)
        const estimatedTotal = 3000; // rough character estimate for full response
        const progress = Math.min(
          95,
          Math.round((accumulated.length / estimatedTotal) * 100)
        );

        // Update status based on progress
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

      // Parse the complete JSON response
      let parsed: ClinicalAnalysis;
      try {
        // Try to extract JSON from the accumulated text
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

      <main className="mx-auto max-w-[1600px] p-6">
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
              <h2 className="mb-2 text-2xl font-bold tracking-tight sm:text-3xl">
                Clinical Reasoning{" "}
                <span className="text-primary">Copilot</span>
              </h2>
              <p className="mx-auto max-w-lg text-sm text-muted-foreground">
                Enter a patient presentation and receive structured differential
                diagnoses, evidence-based workup recommendations, and transparent
                clinical reasoning — all in real-time.
              </p>
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
              purposes. It does not replace clinical judgment. Always verify
              recommendations against current evidence-based guidelines and
              institutional protocols.
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
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--med-green)]/10">
                  <Brain className="h-5 w-5 text-[var(--med-green)]" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold tracking-tight">
                    Analysis Complete
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    {result.differentialDiagnoses.length} diagnoses considered
                    {" / "}
                    {result.reasoningSteps.length} reasoning steps
                    {" / "}
                    {result.redFlags.length} red flags
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                className="gap-1.5"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                New Case
              </Button>
            </div>

            {/* Red Flags - Always visible at top */}
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

            {/* Tabbed Results */}
            <Tabs defaultValue="differential" className="w-full">
              <TabsList className="mb-6 w-full justify-start gap-1 bg-transparent p-0">
                <TabsTrigger
                  value="differential"
                  className="gap-1.5 rounded-lg border border-transparent data-[state=active]:border-primary/30 data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
                >
                  <ListChecks className="h-3.5 w-3.5" />
                  Differential
                </TabsTrigger>
                <TabsTrigger
                  value="reasoning"
                  className="gap-1.5 rounded-lg border border-transparent data-[state=active]:border-primary/30 data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
                >
                  <Brain className="h-3.5 w-3.5" />
                  Reasoning
                </TabsTrigger>
                <TabsTrigger
                  value="workup"
                  className="gap-1.5 rounded-lg border border-transparent data-[state=active]:border-primary/30 data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
                >
                  <FlaskConical className="h-3.5 w-3.5" />
                  Workup
                </TabsTrigger>
                <TabsTrigger
                  value="data"
                  className="gap-1.5 rounded-lg border border-transparent data-[state=active]:border-primary/30 data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
                >
                  <ClipboardList className="h-3.5 w-3.5" />
                  Data
                </TabsTrigger>
              </TabsList>

              <ScrollArea className="h-[calc(100vh-350px)]">
                <TabsContent value="differential" className="mt-0">
                  <DifferentialDiagnosisView
                    diagnoses={result.differentialDiagnoses}
                  />
                </TabsContent>
                <TabsContent value="reasoning" className="mt-0">
                  <ReasoningTimeline steps={result.reasoningSteps} />
                </TabsContent>
                <TabsContent value="workup" className="mt-0">
                  <WorkupRecommendationsView
                    recommendations={result.workupRecommendations}
                  />
                </TabsContent>
                <TabsContent value="data" className="mt-0">
                  <ExtractedDataView data={result.extractedData} />
                </TabsContent>
              </ScrollArea>
            </Tabs>
          </motion.div>
        )}
      </main>
    </div>
  );
}
