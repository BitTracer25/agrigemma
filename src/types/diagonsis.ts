export interface DiagnosisResponse {
  crop: string;
  detectedCondition: string;
  isHealthy: boolean;
  confidence: "Low" | "Medium" | "High";
  severity: "None" | "Mild" | "Moderate" | "Severe";
  symptomsIdentified: string[];
  organicRemedies: string[];
  culturalPractices: string[];
  preventiveTips: string[];
  audioSummary: string; // Plain-text concise spoken summary in the requested language
}

export interface DiagnoseApiRequest {
  imageBase64: string; // Base64 encoded image string (without data:image/... prefix)
  mimeType: string;    // e.g. "image/jpeg" or "image/png"
  language?: string;   // e.g. "English", "Hindi", "Spanish", "Swahili"
  cropHint?: string;   // Optional hint if the farmer already knows the crop
}