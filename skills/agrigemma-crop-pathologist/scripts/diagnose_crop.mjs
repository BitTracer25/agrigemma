#!/usr/bin/env node

/**
 * AgriGemma CLI Diagnostic Tool
 * Compliant with the Agent Skill Open Standard
 */

import { GoogleGenAI } from "@google/genai";
import * as fs from "node:fs";
import * as path from "node:path";

// 1. Auto-load GEMINI_API_KEY from .env.local or .env if not in environment
if (!process.env.GEMINI_API_KEY) {
  const possibleEnvPaths = [
    path.resolve(process.cwd(), ".env.local"),
    path.resolve(process.cwd(), ".env"),
    path.resolve(import.meta.dirname, "../../../.env.local"),
    path.resolve(import.meta.dirname, "../../../.env"),
  ];

  for (const envPath of possibleEnvPaths) {
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, "utf-8");
      for (const line of content.split("\n")) {
        const trimmed = line.trim();
        if (trimmed.startsWith("GEMINI_API_KEY=")) {
          process.env.GEMINI_API_KEY = trimmed
            .replace("GEMINI_API_KEY=", "")
            .replace(/["']/g, "")
            .trim();
          break;
        }
      }
      if (process.env.GEMINI_API_KEY) break;
    }
  }
}

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("Error: Could not find GEMINI_API_KEY in .env.local or environment.");
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey });

// Parse CLI arguments
const args = process.argv.slice(2);
let imagePath = "";
let imageUrl = "";
let language = "English";

for (let i = 0; i < args.length; i++) {
  if (args[i] === "--image" && args[i + 1]) imagePath = args[++i];
  if (args[i] === "--url" && args[i + 1]) imageUrl = args[++i];
  if (args[i] === "--lang" && args[i + 1]) language = args[++i];
}

if (!imagePath && !imageUrl) {
  console.log("Usage: node diagnose_crop.mjs --image <path> [--lang <Language>]");
  console.log("       node diagnose_crop.mjs --url <imageUrl> [--lang <Language>]");
  process.exit(1);
}

async function run() {
  try {
    let base64Data = "";
    let mimeType = "image/jpeg";

    if (imagePath) {
      const buffer = fs.readFileSync(imagePath);
      base64Data = buffer.toString("base64");
      if (imagePath.endsWith(".png")) mimeType = "image/png";
    } else if (imageUrl) {
      const res = await fetch(imageUrl);
      const arrayBuffer = await res.arrayBuffer();
      base64Data = Buffer.from(arrayBuffer).toString("base64");
    }

    const systemPrompt = `You are AgriGemma, an expert on-field plant pathologist and agronomist.
Diagnose the crop disease from the image and respond strictly in JSON in ${language}.
Focus on accessible, low-cost organic remedies for smallholder farmers.

Output JSON format:
{
  "crop": "Crop name in ${language}",
  "detectedCondition": "Disease/Pest name",
  "isHealthy": boolean,
  "confidence": "Low" | "Medium" | "High",
  "severity": "None" | "Mild" | "Moderate" | "Severe",
  "symptomsIdentified": ["symptom 1", "symptom 2"],
  "organicRemedies": ["remedy 1", "remedy 2"],
  "culturalPractices": ["practice 1"],
  "audioSummary": "spoken summary in ${language}"
}`;

    const modelName = process.env.GEMMA_MODEL || "gemini-3.8-flash";

    const response = await ai.models.generateContent({
      model: modelName,
      contents: [
        {
          role: "user",
          parts: [
            { inlineData: { data: base64Data, mimeType } },
            { text: systemPrompt },
          ],
        },
      ],
      config: { responseMimeType: "application/json" },
    });

    const output = response.text?.trim() || "{}";
    const cleaned = output.replace(/^```json\s*/i, "").replace(/```$/i, "").trim();
    console.log(JSON.stringify(JSON.parse(cleaned), null, 2));
  } catch (err) {
    console.error("Diagnosis Failed:", err.message);
    process.exit(1);
  }
}

run();