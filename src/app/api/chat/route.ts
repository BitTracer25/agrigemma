import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI();

export async function POST(req: NextRequest) {
  try {
    const { message, history, diagnosisContext, language = "English" } =
      await req.json();

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const systemInstruction = `You are AgriGemma, an expert on-field agricultural scientist (कृषि वैज्ञानिक / Krishi Mitra) advising an Indian farmer in ${language}.
The farmer is asking follow-up questions about their crop diagnosis:
- Crop: ${diagnosisContext?.crop || "Unknown"}
- Detected Condition: ${diagnosisContext?.detectedCondition || "Unknown"}
- Severity: ${diagnosisContext?.severity || "Unknown"}
- Suggested Remedies: ${diagnosisContext?.organicRemedies?.join("; ") || "None"}

CRITICAL INSTRUCTIONS:
1. You MUST respond entirely in ${language} using its official native script (e.g., Devanagari for Hindi/Marathi, Tamil script for Tamil, Telugu script for Telugu, Bengali for Bengali, Gurmukhi for Punjabi, Gujarati script for Gujarati, Kannada script for Kannada). If English, use simple Indian English.
2. Recommend low-cost, locally available Indian farming practices (e.g., Jeevamrutha, Neemastra, Dashaparni ark, buttermilk spray, wood ash, composting).
3. Keep the tone respectful, warm (like a caring Krishi Vigyan Kendra scientist), and concise (2 to 3 sentences maximum) for mobile voice readout.`;

    // Construct multi-turn conversation
    const contents: any[] = [
      {
        role: "user",
        parts: [{ text: systemInstruction }],
      },
      {
        role: "model",
        parts: [
          {
            text: `Understood. I will advise the farmer clearly and practically in ${language}.`,
          },
        ],
      },
    ];

    // Append prior history
    if (Array.isArray(history)) {
      for (const item of history) {
        contents.push({
          role: item.role === "user" ? "user" : "model",
          parts: [{ text: item.text }],
        });
      }
    }

    // Append current user question
    contents.push({
      role: "user",
      parts: [{ text: message }],
    });

    // Multi-model fallback: ensures 100% uptime even if one model runs out of free quota
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
          contents,
        });

        if (response?.text) {
          break; // Success!
        }
      } catch (err: any) {
        console.warn(`Chat model ${model} failed, trying next fallback...`, err?.message);
        lastError = err;
      }
    }

    if (!response || !response.text) {
      throw lastError || new Error("All chat models were exhausted.");
    }

    const reply = response.text.trim();

    return NextResponse.json({ reply }, { status: 200 });
  } catch (error: any) {
    console.error("Chat API Error:", error);
    return NextResponse.json(
      { error: "Chat failed.", details: error.message },
      { status: 500 }
    );
  }
}