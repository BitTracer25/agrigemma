import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { DiagnosisResponse } from "@/types/diagonsis";

const ai = new GoogleGenAI();

export async function POST(req: NextRequest) {
  try {
    const { diagnosis, targetLanguage = "Hindi" }: { diagnosis: DiagnosisResponse; targetLanguage: string } =
      await req.json();

    if (!diagnosis) {
      return NextResponse.json({ error: "Diagnosis payload required" }, { status: 400 });
    }

    const systemPrompt = `You are an expert agricultural translator and agronomist dedicated to Indian farmers.
Translate the following crop pathology diagnosis JSON into natural, authentic ${targetLanguage} for smallholder farmers.

CRITICAL TRANSLATION RULES:
1. Translate 'crop' into the common local name in ${targetLanguage} (e.g. Tomato -> टमाटर / टोमॅटो / టమాట / தக்காளி).
2. Translate 'detectedCondition' into ${targetLanguage} (e.g. 'Healthy Plant' -> 'स्वस्थ पौधा' in Hindi, 'निरोगी पीक' in Marathi, 'ఆరోగ్యకరమైన పంట' in Telugu, 'ஆரோக்கியமான பயிர்' in Tamil).
3. Translate 'symptomsIdentified', 'organicRemedies', 'culturalPractices', and 'preventiveTips' into simple, actionable steps in the native script of ${targetLanguage}.
4. 'audioSummary' MUST be a spoken audio script (2-3 sentences) written in the native script of ${targetLanguage} (e.g. Devanagari for Hindi/Marathi, Telugu script for Telugu, Tamil script for Tamil, Bengali, etc.), addressing the farmer warmly ("नमस्ते किसान भाई...", "शेतकरी मित्रांनो...", etc.).
5. PRESERVE exact boolean and enum values:
   - 'isHealthy': true or false (boolean)
   - 'confidence': "Low" | "Medium" | "High"
   - 'severity': "None" | "Mild" | "Moderate" | "Severe"
6. Output ONLY valid JSON matching the exact schema. Do not include markdown preamble.`;

    const promptText = `Translate this plant diagnosis into ${targetLanguage}:
${JSON.stringify(diagnosis, null, 2)}`;

    const candidateModels = [
      process.env.GEMMA_MODEL || "gemini-3.5-flash-lite",
      "gemini-3.5-flash-lite",
      "gemini-3.5-flash",
      "gemini-3.1-flash-lite",
      "gemini-3.8-flash",
    ].filter(Boolean) as string[];

    let lastError: any = null;

    for (const modelName of candidateModels) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: [
            {
              role: "user",
              parts: [{ text: `${systemPrompt}\n\n${promptText}` }],
            },
          ],
          config: {
            responseMimeType: "application/json",
            temperature: 0.2,
          },
        });

        const rawText = response.text?.trim() || "";
        let cleanText = rawText;
        if (cleanText.startsWith("```")) {
          cleanText = cleanText.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
        }

        const parsed: DiagnosisResponse = JSON.parse(cleanText);
        return NextResponse.json(parsed);
      } catch (err: any) {
        lastError = err;
        console.warn(`[Translate API] Model ${modelName} failed, attempting next fallback...`, err?.message);
      }
    }

    throw lastError || new Error("All translation models failed.");
  } catch (err: any) {
    console.error("[Translate API Error]:", err);
    return NextResponse.json(
      { error: err?.message || "Failed to translate diagnosis." },
      { status: 500 }
    );
  }
}
