---
name: agrigemma-crop-pathologist
description: Autonomous multimodal on-field crop disease and pest diagnostic engine powered by Gemma 4. Analyzes leaf, stem, and fruit imagery, identifies pathogens, and provides low-cost localized organic remedies.
version: 1.2.0
author: AgriGemma Open Source Community
license: MIT
tags:
  - agriculture
  - plant-pathology
  - multimodal-vision
  - gemma-4
  - sustainable-farming
  - krishi-vigyan
---

# AgriGemma Crop Pathologist Skill

## Overview
Equips autonomous AI agents with specialized agronomic and botanical diagnostic intelligence. The skill accepts images of distressed crops (leaves, stems, flowers, or fruits) and outputs clinical pathogen diagnoses, severity triage, and accessible organic remediation protocols tailored for smallholder farmers.

## When to Activate This Skill
Activate this skill whenever a user or workflow:
1. Supplies an image, photo, or visual URL of a plant or farm crop.
2. Asks for disease identification, pest damage diagnosis, or leaf discoloration analysis.
3. Requests affordable, organic, or low-cost remediation strategies (e.g., neem oil, wood ash, buttermilk spray, biological controls) rather than expensive commercial chemicals.
4. Needs localized agricultural advisory in Indian languages (Hindi, Marathi, Telugu, Tamil, Kannada, Bengali, Gujarati, Punjabi, or Indian English).

## Diagnostic Workflow Protocol

### Step 1: Visual Pathology Analysis
Examine the image across 4 clinical axes:
- **Leaf Margin & Lamina:** Inspect for circular chlorotic halos, target-board concentric rings, water-soaked lesions, or powdery white/gray mycelium.
- **Vascular System:** Check for petiole collapse, wilting, vein clearing, or vascular browning.
- **Entomological Signs:** Scan for thrips silvery scarring, spider mite webbing, caterpillar frass, or leaf miner serpentine trails.
- **Healthy Baseline:** If no symptoms are detected, mark `isHealthy: true` and output maintenance tips.

### Step 2: Low-Cost Organic Remediation (Krishi Protocol)
Always prioritize natural, non-toxic, locally accessible ingredients:
- **Fungal Blights / Mildew:** Baking soda spray (1 tbsp + 1 tsp liquid soap in 1L water) or 5% cold-pressed neem oil emulsion.
- **Bacterial Spots:** Wood ash dusting to desiccate lesions; copper-soap sprays if severe.
- **Viral Leaf Curl / Vectors:** Yellow/blue sticky traps (20 per acre), neem seed kernel extract (NSKE 5%).
- **Soil & Root Rot:** Field drainage, trichoderma viride bio-fungicide, compost tea inoculation.

### Step 3: Weather & Spray Condition Check
Cross-reference weather conditions prior to advising sprays:
- Do not spray if rainfall is forecasted within 6 hours.
- Avoid midday spraying (temperatures > 33°C) to prevent foliar phototoxicity.

## CLI Execution Tool
Autonomous agents can invoke the bundled CLI script:

```bash
node skills/agrigemma-crop-pathologist/scripts/diagnose_crop.mjs --image <path-or-url> --lang <Language>