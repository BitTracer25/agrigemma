import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const text = searchParams.get("text") || "";
  const lang = searchParams.get("lang") || "hi-IN";

  if (!text.trim()) {
    return new NextResponse("Text parameter required", { status: 400 });
  }

  // Map BCP-47 codes to native TTS language codes
  const langMap: Record<string, string> = {
    "hi-IN": "hi",
    "en-IN": "en",
    "mr-IN": "mr",
    "te-IN": "te",
    "ta-IN": "ta",
    "kn-IN": "kn",
    "bn-IN": "bn",
    "gu-IN": "gu",
    "pa-IN": "pa",
  };

  const targetLang = langMap[lang] || lang.split("-")[0] || "hi";

  try {
    // Break long text into natural sentence chunks <= 180 chars
    const chunks: string[] = [];
    let remaining = text.trim();

    while (remaining.length > 0) {
      if (remaining.length <= 180) {
        chunks.push(remaining);
        break;
      }
      let splitIdx = remaining.lastIndexOf(" ", 180);
      if (splitIdx === -1) splitIdx = 180;
      chunks.push(remaining.substring(0, splitIdx));
      remaining = remaining.substring(splitIdx).trim();
    }

    // Fetch native audio chunks and combine
    const audioBuffers: Buffer[] = [];
    for (const chunk of chunks) {
      const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${targetLang}&client=tw-ob&q=${encodeURIComponent(
        chunk
      )}`;

      const res = await fetch(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          Referer: "https://translate.google.com/",
        },
      });

      if (res.ok) {
        const buf = Buffer.from(await res.arrayBuffer());
        audioBuffers.push(buf);
      }
    }

    const combinedBuffer = Buffer.concat(audioBuffers);

    return new NextResponse(combinedBuffer, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch (err: any) {
    console.error("TTS Stream Error:", err);
    return new NextResponse("Failed to generate audio", { status: 500 });
  }
}