import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { DiagnosisResponse, DiagnoseApiRequest } from "@/types/diagonsis";

// Initialize the Google GenAI SDK (reads GEMINI_API_KEY from .env.local)
const ai = new GoogleGenAI();

export async function POST(req: NextRequest) {
  try {
    const body: DiagnoseApiRequest = await req.json();
    const { imageBase64, mimeType, language = "English", cropHint } = body;

    if (!imageBase64 || !mimeType) {
      return NextResponse.json(
        { error: "Image data and MIME type are required." },
        { status: 400 }
      );
    }

    // System prompt tailored for agricultural field diagnostics & organic remedies
    const systemPrompt = `You are AgriGemma, an expert on-field plant pathologist and agronomist dedicated to assisting smallholder farmers.
Your mission is to accurately diagnose crop diseases, pest damage, and nutritional deficiencies from leaf, stem, or fruit images.

CRITICAL INSTRUCTIONS:
1. Prioritize ACCESSIBLE, LOW-COST, and ORGANIC remedies (e.g., neem oil, wood ash, compost tea, baking soda spray, companion planting, pruning) that a small farmer can readily obtain or prepare.
2. If the plant looks completely healthy, indicate isHealthy: true, severity: "None", and provide maintenance tips.
3. If an image is not a plant or cannot be identified, specify that clearly in detectedCondition.
4. The 'audioSummary' MUST be concise (2-3 sentences), warm, and spoken directly to the farmer in the target language: ${language}.
5. Translate all remedy descriptions and advice to ${language}.

Respond ONLY with a valid JSON object matching this schema:
{
  "crop": "string (name of crop in ${language})",
  "detectedCondition": "string (disease, pest name, or 'Healthy Plant')",
  "isHealthy": boolean,
  "confidence": "Low" | "Medium" | "High",
  "severity": "None" | "Mild" | "Moderate" | "Severe",
  "symptomsIdentified": ["symptom 1", "symptom 2"],
  "organicRemedies": ["step-by-step affordable remedy 1", "remedy 2"],
  "culturalPractices": ["farming practice 1 (e.g. spacing, watering technique)"],
  "preventiveTips": ["future prevention tip 1"],
  "audioSummary": "concise spoken summary in ${language}"
}`;

    // Prompt combining the image and instructions
    const promptText = `Analyze this crop image.${
      cropHint ? ` The farmer notes this might be: ${cropHint}.` : ""
    }
Provide diagnosis, severity, symptoms, and organic remedies in ${language}.`;

    // Candidate models with fallback: If one hits quota, automatically try the next!
        // Active modern models with fresh quotas
    const candidateModels = [
      process.env.GEMMA_MODEL || "gemini-3.5-flash-lite",
      "gemini-3.5-flash-lite",
      "gemini-3.5-flash",
      "gemini-3.1-flash-lite",
      "gemini-3.8-flash",
    ].filter(Boolean) as string[];

    let response: any = null;
    let lastError: any = null;

    for (const model of candidateModels) {
      try {
        response = await ai.models.generateContent({
          model,
          contents: [
            {
              role: "user",
              parts: [
                {
                  inlineData: {
                    data: imageBase64,
                    mimeType: mimeType,
                  },
                },
                {
                  text: `${systemPrompt}\n\n${promptText}`,
                },
              ],
            },
          ],
          config: {
            responseMimeType: "application/json",
          },
        });

        if (response?.text) {
          break; // Successfully generated content!
        }
      } catch (err: any) {
        console.warn(`Model ${model} unavailable or quota reached. Trying next fallback...`, err?.message);
        lastError = err;
      }
    }

    if (!response || !response.text) {
      throw lastError || new Error("All candidate diagnostic models were exhausted.");
    }

    const responseText = response.text.trim();

    // Clean potential markdown code blocks if returned
    const cleanedJson = responseText
      .replace(/^```json\s*/i, "")
      .replace(/```$/i, "")
      .trim();

    const diagnosis: DiagnosisResponse = JSON.parse(cleanedJson);

    return NextResponse.json(diagnosis, { status: 200 });
  } catch (error: any) {
    console.error("Diagnosis API Error:", error);
    return NextResponse.json(
      {
        error: "Failed to diagnose image.",
        details: error?.message || "Unknown error occurred.",
      },
      { status: 500 }
    );
  }
}