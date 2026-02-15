export interface PatientCase {
  presentation: string;
  age?: string;
  sex?: string;
  chiefComplaint?: string;
}

export interface ExtractedData {
  demographics: string;
  chiefComplaint: string;
  hpiSummary: string;
  vitalSigns: string[];
  symptoms: string[];
  relevantHistory: string[];
  medications: string[];
  allergies: string[];
}

export interface DifferentialDiagnosis {
  name: string;
  confidence: number; // 0-100
  reasoning: string;
  keyFindings: string[];
  severity: "low" | "moderate" | "high" | "critical";
}

export interface WorkupRecommendation {
  category: string;
  tests: {
    name: string;
    rationale: string;
    priority: "stat" | "routine" | "optional";
  }[];
}

export interface ReasoningStep {
  title: string;
  content: string;
  type: "observation" | "hypothesis" | "evidence" | "conclusion" | "warning";
}

export interface ClinicalAnalysis {
  extractedData: ExtractedData;
  differentialDiagnoses: DifferentialDiagnosis[];
  workupRecommendations: WorkupRecommendation[];
  reasoningSteps: ReasoningStep[];
  clinicalSummary: string;
  redFlags: string[];
}

export interface AnalysisState {
  status: "idle" | "extracting" | "reasoning" | "diagnosing" | "recommending" | "complete" | "error";
  progress: number;
  currentStep: string;
  result: ClinicalAnalysis | null;
  error: string | null;
  rawStream: string;
}

export const SAMPLE_CASES: { title: string; description: string; presentation: string }[] = [
  {
    title: "Acute Chest Pain",
    description: "55M with substernal chest pain",
    presentation: `55-year-old male presents to the ED with acute onset substernal chest pain radiating to left arm, started 2 hours ago while climbing stairs. Patient describes the pain as "crushing" and rates it 8/10. Associated with diaphoresis and shortness of breath. Denies nausea or vomiting.

PMH: Hypertension (15 years), Type 2 Diabetes Mellitus (10 years), Hyperlipidemia
Medications: Metformin 1000mg BID, Lisinopril 20mg daily, Atorvastatin 40mg daily
Family History: Father had MI at age 52
Social History: Former smoker (30 pack-years, quit 5 years ago), occasional alcohol

Vitals: BP 165/95, HR 102, RR 22, SpO2 94% on RA, Temp 98.6F
Physical Exam: Anxious, diaphoretic. Heart: Tachycardic, regular rhythm, no murmurs. Lungs: Bibasilar crackles. Extremities: No edema.`
  },
  {
    title: "Pediatric Fever",
    description: "4yo with high fever and rash",
    presentation: `4-year-old female brought by mother with 5-day history of high fever (up to 104.5F) unresponsive to acetaminophen and ibuprofen. Mother reports the child has bilateral conjunctival redness without discharge, cracked red lips, swollen hands and feet, and a diffuse rash on the trunk that appeared on day 3.

The child has been irritable and refusing to eat. No sick contacts. No recent travel. Up to date on vaccinations.

PMH: None significant
Medications: None
Allergies: NKDA

Vitals: Temp 104.2F, HR 145, RR 28, BP 90/55, SpO2 98% on RA
Physical Exam: Irritable child. Bilateral non-purulent conjunctivitis. Erythematous, cracked lips. Strawberry tongue. Cervical lymphadenopathy (>1.5cm on right). Polymorphous rash on trunk. Edematous hands and feet with erythema. Heart: Tachycardic, no murmur. Lungs: Clear.`
  },
  {
    title: "Acute Abdomen",
    description: "30F with RLQ pain and fever",
    presentation: `30-year-old female presents with 18-hour history of progressive abdominal pain. Pain initially began periumbilically, then migrated to the right lower quadrant. Associated with anorexia, nausea, and one episode of non-bilious vomiting. Low-grade fever started this morning. Last menstrual period was 2 weeks ago, regular cycles.

PMH: None
Medications: Oral contraceptive pills
Allergies: Penicillin (rash)
Social History: Non-smoker, social drinker, sexually active with one partner

Vitals: Temp 100.8F, HR 95, RR 18, BP 125/78, SpO2 99% on RA
Physical Exam: Appears uncomfortable, lying still. Abdomen: Moderate tenderness in RLQ with voluntary guarding. Positive McBurney's point tenderness. Positive Rovsing's sign. Positive psoas sign. No rebound tenderness. Bowel sounds hypoactive. No pelvic exam performed yet.`
  },
  {
    title: "Altered Mental Status",
    description: "72F found confused at home",
    presentation: `72-year-old female brought by EMS after neighbors found her confused and unable to stand. Per neighbors, she was fine yesterday. Patient is a poor historian. She is oriented to person only, not to place or time.

PMH: Atrial fibrillation, Congestive Heart Failure (EF 35%), Chronic Kidney Disease stage 3, Hypothyroidism
Medications: Warfarin 5mg daily, Digoxin 0.125mg daily, Furosemide 40mg daily, Levothyroxine 75mcg daily, Metoprolol 50mg BID
Allergies: Sulfa drugs
Social History: Lives alone, independent at baseline, no alcohol or tobacco

Vitals: Temp 96.8F, HR 48 irregular, RR 14, BP 95/60, SpO2 93% on RA, glucose 65mg/dL
Physical Exam: Elderly woman, lethargic but arousable. Pupils 3mm bilateral, sluggish. Dry mucous membranes. Heart: Bradycardic, irregularly irregular. Lungs: Bibasilar crackles. Abdomen: Soft, non-tender. Extremities: 2+ bilateral lower extremity edema. Neuro: No focal deficits, but globally slowed.`
  }
];
