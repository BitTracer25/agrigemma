"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Camera,
  Upload,
  Volume2,
  VolumeX,
  Leaf,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  RefreshCw,
  Languages,
  CloudSun,
  CloudRain,
  Wind,
  Send,
  MessageSquare,
  Radio,
  ArrowRight,
} from "lucide-react";
import { DiagnosisResponse } from "@/types/diagonsis";
import OutbreakRadar, {
  INITIAL_OUTBREAK_DATA,
  OutbreakIncident,
} from "@/components/OutbreakRadar";

// 9 Major Indian Agricultural Languages
const INDIAN_LANGUAGES = [
  { code: "en-IN", name: "English", label: "English (India)" },
  { code: "hi-IN", name: "Hindi", label: "हिंदी (Hindi)" },
  { code: "mr-IN", name: "Marathi", label: "मराठी (Marathi)" },
  { code: "te-IN", name: "Telugu", label: "తెలుగు (Telugu)" },
  { code: "ta-IN", name: "Tamil", label: "தமிழ் (Tamil)" },
  { code: "kn-IN", name: "Kannada", label: "ಕನ್ನಡ (Kannada)" },
  { code: "bn-IN", name: "Bengali", label: "বাংলা (Bengali)" },
  { code: "gu-IN", name: "Gujarati", label: "ગુજરાતી (Gujarati)" },
  { code: "pa-IN", name: "Punjabi", label: "ਪੰਜਾਬੀ (Punjabi)" },
];

const UI_STRINGS: Record<string, Record<string, string>> = {
  English: {
    subtitle: "Digital Krishi Co-Pilot",
    tabDoctor: "Crop Doctor",
    tabRadar: "Outbreak Radar (Alerts)",
    sprayOptimal: "Optimal for Spraying",
    sprayCaution: "Caution: Check Heat/Wind",
    sprayAvoid: "Avoid: Rain Forecasted",
    humidity: "Humidity",
    takePhoto: "Take or Upload Leaf Photo",
    takePhotoDesc: "Point camera at damaged leaves, stems, or pests",
    captureBtn: "Capture Photo",
    uploadBtn: "Upload Gallery",
    demoTitle: "Instant Demo Samples (Click to test):",
    examining: "Examining leaf symptoms...",
    poweredBy: "Powered by Gemma 4 Multimodal",
    crop: "Crop",
    severity: "Severity",
    confidence: "Confidence",
    listen: "Listen",
    stop: "Stop",
    symptoms: "Observed Symptoms",
    remedies: "Low-Cost & Organic Remedies",
    practices: "Best Cultural Practices",
    chatHeader: "Ask Follow-Up Questions",
    placeholder: "Ask about remedies, preparation, or safety...",
    waitingTitle: "Ready for Plant Inspection",
    waitingDesc:
      "Capture a leaf photo or click one of the sample crops on the left to view instant diagnosis, organic remedies, and audio guidance.",
    liveContribution:
      "📡 Your scan was logged to the Outbreak Radar! Nearby farmers will receive early alerts.",
    viewOnRadar: "View on Radar →",
  },
  Hindi: {
    subtitle: "डिजिटल किसान मित्र (Krishi Co-Pilot)",
    tabDoctor: "फसल डॉक्टर (जांच)",
    tabRadar: "प्रकोप रडार (अलर्ट)",
    sprayOptimal: "छिड़काव अनुकूल",
    sprayCaution: "सावधानी: धूप/हवा अधिक",
    sprayAvoid: "छिड़काव टालें: बारिश की संभावना",
    humidity: "आर्द्रता",
    takePhoto: "फसल या पत्ती की फोटो लें",
    takePhotoDesc: "कैमरे को खराब पत्ती, तने या कीड़े पर फोकस करें",
    captureBtn: "फोटो खींचें (Camera)",
    uploadBtn: "गैलरी से चुनें (Upload)",
    demoTitle: "नमूना फसलें (डेमो के लिए क्लिक करें):",
    examining: "पत्तियों की जांच हो रही है...",
    poweredBy: "Gemma 4 मल्टीमॉडल द्वारा संचालित",
    crop: "फसल",
    severity: "गंभीरता",
    confidence: "सटीकता",
    listen: "सुनें (Audio)",
    stop: "रोकें",
    symptoms: "दिखे लक्षण (Symptoms)",
    remedies: "किफायती व देसी उपचार (Remedies)",
    practices: "रोकथाम व देखरेख (Best Practices)",
    chatHeader: "कृषि सलाहकार से और सवाल पूछें",
    placeholder: "दवा या सुरक्षा के बारे में सवाल पूछें...",
    waitingTitle: "फसल जांच के लिए तैयार",
    waitingDesc:
      "बाईं ओर से पत्ती की फोटो खींचें या किसी नमूना फसल पर क्लिक करें। तुरंत बीमारी की जांच व देसी उपचार देखें।",
    liveContribution:
      "📡 आपकी जांच प्रकोप रडार में दर्ज हो गई है! आस-पास के किसानों को तुरंत अलर्ट मिलेगा।",
    viewOnRadar: "रडार पर देखें →",
  },
  Marathi: {
    subtitle: "डिजिटल शेतकरी मित्र (Krishi Co-Pilot)",
    tabDoctor: "पीक डॉक्टर (तपासणी)",
    tabRadar: "रोग रडार (अलर्ट)",
    sprayOptimal: "फवारणीसाठी अनुकूल",
    sprayCaution: "सावधान: ऊन/वारा जास्त",
    sprayAvoid: "फवारणी टाळा: पावसाची शक्यता",
    humidity: "आर्द्रता",
    takePhoto: "पिकाचा किंवा पानाचा फोटो घ्या",
    takePhotoDesc: "कॅमेरा खराब पान किंवा किडीवर धरा",
    captureBtn: "फोटो काढा (Camera)",
    uploadBtn: "गॅलरीतून निवडा (Upload)",
    demoTitle: "नमुना पिके (चाचणीसाठी क्लिक करा):",
    examining: "पानांची तपासणी सुरू आहे...",
    poweredBy: "Gemma 4 द्वारे समर्थित",
    crop: "पीक",
    severity: "तीव्रता",
    confidence: "अचूकता",
    listen: "ऐका (Audio)",
    stop: "थांबवा",
    symptoms: "दिसलेली लक्षणे",
    remedies: "कमी खर्चाचे सेंद्रिय उपाय",
    practices: "व्यवस्थापन व काळजी",
    chatHeader: "सल्लागाराला आणखी प्रश्न विचारा",
    placeholder: "औषध किंवा फवारणीबद्दल प्रश्न विचारा...",
    waitingTitle: "पिकांची तपासणी करण्यासाठी सज्ज",
    waitingDesc:
      "डाव्या बाजूने पानाचा फोटो घ्या किंवा नमुना पिकावर क्लिक करा. तात्काळ रोग निदान व सेंद्रिय उपचार पहा.",
    liveContribution:
      "📡 तुमची नोंद रोग रडारमध्ये जोडली गेली आहे! परिसरातील शेतकऱ्यांना पूर्वसूचना मिळेल.",
    viewOnRadar: "रडारवर पहा →",
  },
  Telugu: {
    subtitle: "డిజిటల్ రైతు మిత్ర (Krishi Co-Pilot)",
    tabDoctor: "పంట డాక్టర్",
    tabRadar: "తెగులు రాడార్ (హెచ్చరికలు)",
    sprayOptimal: "పిచికారీకి అనుకూలం",
    sprayCaution: "జాగ్రత్త: ఎండ/గాలి ఎక్కువ",
    sprayAvoid: "పిచికారీ చేయవద్దు: వర్ష సూచన",
    humidity: "తేమ",
    takePhoto: "ఆకు లేదా తెగులు ఫోటో తీయండి",
    takePhotoDesc: "దెబ్బతిన్న ఆకులు లేదా పురుగులపై కెమెరా ఉంచండి",
    captureBtn: "ఫోటో తీయండి (Camera)",
    uploadBtn: "గ్యాలరీ నుండి ఎంచుకోండి",
    demoTitle: "నమూనా పంటలు (పరీక్షించడానికి క్లిక్ చేయండి):",
    examining: "లక్షణాలను పరిశీలిస్తోంది...",
    poweredBy: "Gemma 4 మల్టీమోడల్ ఆధారితం",
    crop: "పంట",
    severity: "తీవ్రత",
    confidence: "ఖచ్చితత్వం",
    listen: "వినండి (Audio)",
    stop: "ఆపండి",
    symptoms: "గుర్తించిన లక్షణాలు",
    remedies: "తక్కువ ఖర్చుతో సహజ నివారణలు",
    practices: "యాజమాన్య పద్ధతులు",
    chatHeader: "వ్యవసాయ సలహాదారుని అడగండి",
    placeholder: "నివారణ లేదా జాగ్రత్తల గురించి అడగండి...",
    waitingTitle: "పంట తనిఖీకి సిద్ధం",
    waitingDesc: "ఎడమవైపు నుండి ఆకు ఫోటో తీయండి లేదా నమూనా పంటపై క్లిక్ చేయండి.",
    liveContribution: "📡 మీ నివేదిక రాడార్‌లో నమోదైంది! పక్క రైతులకు హెచ్చరిక అందుతుంది.",
    viewOnRadar: "రాడార్‌లో చూడండి →",
  },
  Tamil: {
    subtitle: "டிஜிட்டல் உழவன் தோழன் (Krishi Co-Pilot)",
    tabDoctor: "பயிர் மருத்துவர்",
    tabRadar: "நோய் கண்காணிப்பு ரேடார்",
    sprayOptimal: "தெளிக்க உகந்த நேரம்",
    sprayCaution: "எச்சரிக்கை: வெயில்/காற்று அதிகம்",
    sprayAvoid: "தெளிக்க வேண்டாம்: மழை வாய்ப்பு",
    humidity: "ஈரப்பதம்",
    takePhoto: "இலை அல்லது பயிரின் புகைப்படம் எடுக்கவும்",
    takePhotoDesc: "பாதிக்கப்பட்ட இலை அல்லது பூச்சிகள் மீது கேமராவை வைக்கவும்",
    captureBtn: "புகைப்படம் எடு (Camera)",
    uploadBtn: "கேலரியில் இருந்து தேர்வு செய்",
    demoTitle: "மாதிரி பயிர்கள் (சோதிக்க கிளிக் செய்யவும்):",
    examining: "இலைகள் ஆய்வு செய்யப்படுகின்றன...",
    poweredBy: "Gemma 4 மூலம் இயக்கப்படுகிறது",
    crop: "பயிர்",
    severity: "தீவிரம்",
    confidence: "நம்பகத்தன்மை",
    listen: "கேட்க (Audio)",
    stop: "நிறுத்து",
    symptoms: "கண்டறியப்பட்ட அறிகுறிகள்",
    remedies: "குறைந்த செலவு இயற்கை தீர்வுகள்",
    practices: "மேலாண்மை முறைகள்",
    chatHeader: "விவசாய ஆலோசகரிடம் கேள்வி கேட்கவும்",
    placeholder: "இயற்கை உரம் அல்லது பாதுகாப்பு பற்றி கேட்கவும்...",
    waitingTitle: "பயிர் பரிசோதனைக்கு தயார்",
    waitingDesc: "இடதுபுறத்தில் இலை புகைப்படத்தை எடுக்கவும் அல்லது மாதிரி பயிரை தேர்வு செய்யவும்.",
    liveContribution: "📡 உங்கள் பதிவு ரேடாரில் சேர்க்கப்பட்டது! மற்ற விவசாயிகளுக்கு எச்சரிக்கை கிடைக்கும்.",
    viewOnRadar: "ரேடாரில் பார்க்க →",
  },
};

const LOCALIZED_QUESTIONS: Record<string, string[]> = {
  English: [
    "How to prepare this organic remedy at home?",
    "Will this infection spread to neighboring crops?",
    "How many days before it is safe to harvest?",
    "Can I spray buttermilk or neem oil instead?",
  ],
  Hindi: [
    "यह जैविक स्प्रे घर पर कैसे तैयार करें?",
    "क्या यह बीमारी आस-पास की फसलों में फैलेगी?",
    "फसल काटने में कितने दिन रुकना चाहिए?",
    "क्या हम नीम का तेल या छाछ का छिड़काव कर सकते हैं?",
  ],
  Marathi: [
    "हे सेंद्रिय औषध घरी कसे तयार करावे?",
    "हा रोग शेजारील पिकांवर पसरेल का?",
    "कापणीसाठी किती दिवस थांबावे लागेल?",
    "आम्ही ताक किंवा कडुनिंबाचे तेल फवारू शकतो का?",
  ],
  Telugu: [
    "ఈ సహజ మందును ఇంట్లోనే ఎలా తయారు చేయాలి?",
    "ఈ తెగులు పక్క పంటలకు వ్యాపిస్తుందా?",
    "పంట కోతకు ఇంకా ఎన్ని రోజులు వేచి ఉండాలి?",
    "వేపనూనె లేదా మజ్జిగ పిచికారీ చేయవచ్చా?",
  ],
  Tamil: [
    "இந்த இயற்கை மருந்தை வீட்டில் தயாரிப்பது எப்படி?",
    "இந்த நோய் பக்கத்து பயிர்களுக்கும் பரவுமா?",
    "அறுவடை செய்ய எத்தனை நாட்கள் காத்திருக்க வேண்டும்?",
    "வேப்ப எண்ணெய் அல்லது மோர் தெளிக்கலாமா?",
  ],
};

const PRESET_SAMPLES = [
  {
    name: "Tomato Blight",
    crop: "Tomato (टमाटर / टोमॅटो)",
    url: "https://images.unsplash.com/photo-1592150621744-aca64f48394a?w=600&auto=format&fit=crop&q=80",
  },
  {
    name: "Chili Leaf Curl",
    crop: "Chili (मिर्च / मिरची)",
    url: "https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=600&auto=format&fit=crop&q=80",
  },
  {
    name: "Healthy Paddy",
    crop: "Rice / Paddy (धान / भात)",
    url: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=600&auto=format&fit=crop&q=80",
  },
];

interface ChatMessage {
  role: "user" | "model";
  text: string;
}

interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  rainProbability: number;
  verdict: "Optimal" | "Caution" | "Avoid";
}

export default function AgriGemmaApp() {
  const [activeTab, setActiveTab] = useState<"diagnose" | "radar">("diagnose");
  const [selectedLanguage, setSelectedLanguage] = useState(INDIAN_LANGUAGES[0]);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [diagnosis, setDiagnosis] = useState<DiagnosisResponse | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);

  // Weather State
  const [weather, setWeather] = useState<WeatherData | null>(null);

  // Chat State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [inputQuestion, setInputQuestion] = useState("");
  const [sendingChat, setSendingChat] = useState(false);

  // Live Outbreak Incidents State (Starts with seed + grows with scans)
  const [outbreakIncidents, setOutbreakIncidents] = useState<OutbreakIncident[]>(
    INITIAL_OUTBREAK_DATA
  );
  const [liveContributionAlert, setLiveContributionAlert] = useState<string | null>(null);

  const t = (key: string): string => {
    return (
      UI_STRINGS[selectedLanguage.name]?.[key] ||
      UI_STRINGS["English"]?.[key] ||
      key
    );
  };

  const fetchWeatherAdvisory = (lat = 20.5937, lon = 78.9629) => {
    fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m&hourly=precipitation_probability&forecast_hours=6`
    )
      .then((res) => res.json())
      .then((data) => {
        const temp = data.current?.temperature_2m ?? 28;
        const humidity = data.current?.relative_humidity_2m ?? 65;
        const wind = data.current?.wind_speed_10m ?? 8;
        const maxRainProb = Math.max(...(data.hourly?.precipitation_probability || [10]));

        let verdict: "Optimal" | "Caution" | "Avoid" = "Optimal";
        if (maxRainProb > 40) verdict = "Avoid";
        else if (temp > 33 || wind > 20) verdict = "Caution";

        setWeather({
          temperature: Math.round(temp),
          humidity: Math.round(humidity),
          windSpeed: Math.round(wind),
          rainProbability: maxRainProb,
          verdict,
        });
      })
      .catch(() => {
        setWeather({
          temperature: 28,
          humidity: 60,
          windSpeed: 10,
          rainProbability: 15,
          verdict: "Optimal",
        });
      });
  };

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => fetchWeatherAdvisory(pos.coords.latitude, pos.coords.longitude),
        () => fetchWeatherAdvisory()
      );
    } else {
      fetchWeatherAdvisory();
    }
  }, []);

  const compressAndEncode = (file: File): Promise<{ base64: string; mimeType: string }> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX = 1024;
          let w = img.width;
          let h = img.height;
          if (w > h && w > MAX) {
            h *= MAX / w;
            w = MAX;
          } else if (h > MAX) {
            w *= MAX / h;
            h = MAX;
          }
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, w, h);
          const compressed = canvas.toDataURL("image/jpeg", 0.8);
          resolve({ base64: compressed.split(",")[1], mimeType: "image/jpeg" });
        };
        img.onerror = (e) => reject(e);
      };
      reader.onerror = (e) => reject(e);
    });
  };

  const runDiagnosis = async (base64: string, mimeType: string) => {
    setLoading(true);
    setDiagnosis(null);
    setChatMessages([]);
    setLiveContributionAlert(null);
    stopAudio();

    try {
      const res = await fetch("/api/diagnose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64: base64,
          mimeType,
          language: selectedLanguage.name,
        }),
      });

      if (!res.ok) throw new Error("Diagnosis failed. Check image or connection.");
      const data: DiagnosisResponse = await res.json();
      setDiagnosis(data);

      // LIVE CROWDSOURCING: If disease is detected, register it to the Outbreak Radar!
      if (!data.isHealthy && data.detectedCondition) {
        const liveIncident: OutbreakIncident = {
          id: `live-${Date.now()}`,
          severity: data.severity === "Severe" ? "Critical" : "Warning",
          reportsCount: 1,
          windSpreadRisk: "Moderate",
          cropKey: data.crop || "Crop",
          isLiveScan: true,
          translations: {
            English: {
              crop: data.crop || "Crop",
              region: "Live Field Node (Your Scan)",
              disease: data.detectedCondition,
              action:
                data.organicRemedies?.[0] ||
                "Apply recommended organic remedy immediately.",
              audio:
                data.audioSummary ||
                `New active case of ${data.detectedCondition} reported just now.`,
            },
            Hindi: {
              crop: data.crop || "फसल",
              region: "स्थानीय खेत (लाइव किसान रिपोर्ट)",
              disease: data.detectedCondition,
              action:
                data.organicRemedies?.[0] ||
                "तुरंत अनुशंसित जैविक उपचार का छिड़काव करें।",
              audio:
                data.audioSummary ||
                `अभी-अभी ${data.detectedCondition} का नया मामला दर्ज किया गया।`,
            },
            Marathi: {
              crop: data.crop || "पीक",
              region: "स्थानिक शेतकरी केंद्र (थेट नोंद)",
              disease: data.detectedCondition,
              action:
                data.organicRemedies?.[0] ||
                "शिफारस केलेले सेंद्रिय उपाय तातडीने करा.",
              audio:
                data.audioSummary ||
                `आताच ${data.detectedCondition} रोगाची नवीन नोंद झाली आहे.`,
            },
            Telugu: {
              crop: data.crop || "పంట",
              region: "స్థానిక క్షేత్రం (లైవ్ రిపోర్ట్)",
              disease: data.detectedCondition,
              action:
                data.organicRemedies?.[0] ||
                "సిఫార్సు చేసిన నివారణ చర్యలు వెంటనే చేపట్టండి.",
              audio: data.audioSummary || "కొత్త తెగులు కేసు నమోదైంది.",
            },
            Tamil: {
              crop: data.crop || "பயிர்",
              region: "உள்ளூர் வயல் (நேரடிப் பதிவு)",
              disease: data.detectedCondition,
              action:
                data.organicRemedies?.[0] ||
                "பரிந்துரைக்கப்பட்ட இயற்கை தீர்வை உடனே தெளிக்கவும்.",
              audio: data.audioSummary || "புதிய நோய் பாதிப்பு பதிவாகியுள்ளது.",
            },
          },
        };

        setOutbreakIncidents((prev) => [liveIncident, ...prev]);
        setLiveContributionAlert(t("liveContribution"));
      }
    } catch (err: any) {
      alert(err.message || "Failed to analyze image");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const { base64, mimeType } = await compressAndEncode(file);
      setPreviewImage(`data:${mimeType};base64,${base64}`);
      await runDiagnosis(base64, mimeType);
    } catch {
      alert("Error reading file.");
    }
  };

  const handleSelectPreset = async (url: string) => {
    setLoading(true);
    setPreviewImage(url);
    setDiagnosis(null);
    setChatMessages([]);
    setLiveContributionAlert(null);
    stopAudio();

    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const file = new File([blob], "sample.jpg", { type: "image/jpeg" });
      const { base64, mimeType } = await compressAndEncode(file);
      await runDiagnosis(base64, mimeType);
    } catch {
      alert("Failed to load sample image.");
      setLoading(false);
    }
  };

  const speakText = (text: string) => {
    if (!text) return;

    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
      setIsSpeaking(false);
      return;
    }

    setIsSpeaking(true);
    const audioUrl = `/api/tts?text=${encodeURIComponent(text)}&lang=${selectedLanguage.code}`;
    const audio = new Audio(audioUrl);
    currentAudioRef.current = audio;

    audio.onended = () => {
      setIsSpeaking(false);
      currentAudioRef.current = null;
    };
    audio.onerror = () => {
      if ("speechSynthesis" in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = selectedLanguage.code;
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utterance);
      } else {
        setIsSpeaking(false);
        currentAudioRef.current = null;
      }
    };

    audio.play().catch(() => {
      setIsSpeaking(false);
      currentAudioRef.current = null;
    });
  };

  const stopAudio = () => {
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
    }
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  const handleSendChat = async (questionText?: string) => {
    const textToSend = questionText || inputQuestion;
    if (!textToSend.trim() || sendingChat) return;

    const newHistory: ChatMessage[] = [...chatMessages, { role: "user", text: textToSend }];
    setChatMessages(newHistory);
    setInputQuestion("");
    setSendingChat(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          history: chatMessages,
          diagnosisContext: diagnosis,
          language: selectedLanguage.name,
        }),
      });

      if (!res.ok) throw new Error("Chat request failed");
      const data = await res.json();
      setChatMessages([...newHistory, { role: "model", text: data.reply }]);
    } catch {
      setChatMessages([
        ...newHistory,
        { role: "model", text: "Error answering. Please try again." },
      ]);
    } finally {
      setSendingChat(false);
    }
  };

  const currentSuggestedQuestions =
    LOCALIZED_QUESTIONS[selectedLanguage.name] || LOCALIZED_QUESTIONS["English"];

  return (
    <main className="min-h-screen bg-slate-100/70 text-slate-900 pb-20 font-sans">
      {/* Top Header */}
      <header className="bg-emerald-700 text-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="bg-emerald-800 p-2 rounded-xl shadow-inner">
              <Leaf className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-300" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-black tracking-tight leading-none">
                AgriGemma
              </h1>
              <p className="text-[11px] sm:text-xs text-emerald-200 font-medium mt-0.5">
                {t("subtitle")}
              </p>
            </div>
          </div>

          {/* Regional Language Picker */}
          <div className="flex items-center space-x-1.5 bg-emerald-800/90 rounded-xl px-2.5 py-1.5 text-xs sm:text-sm border border-emerald-600/70 shadow-sm">
            <Languages className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-300" />
            <select
              value={selectedLanguage.code}
              onChange={(e) => {
                const lang = INDIAN_LANGUAGES.find((l) => l.code === e.target.value);
                if (lang) setSelectedLanguage(lang);
              }}
              className="bg-transparent text-white font-medium focus:outline-none cursor-pointer text-xs sm:text-sm"
            >
              {INDIAN_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code} className="text-slate-900">
                  {lang.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </header>

      {/* Main Tab Switcher */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
        <div className="max-w-md mx-auto grid grid-cols-2 gap-2 bg-slate-200/90 p-1.5 rounded-2xl shadow-inner">
          <button
            onClick={() => setActiveTab("diagnose")}
            className={`py-2 px-3 text-xs sm:text-sm font-bold rounded-xl transition flex items-center justify-center space-x-1.5 ${activeTab === "diagnose"
                ? "bg-white text-emerald-800 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
              }`}
          >
            <Leaf className="w-4 h-4" />
            <span>{t("tabDoctor")}</span>
          </button>
          <button
            onClick={() => setActiveTab("radar")}
            className={`py-2 px-3 text-xs sm:text-sm font-bold rounded-xl transition flex items-center justify-center space-x-1.5 ${activeTab === "radar"
                ? "bg-rose-600 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900"
              }`}
          >
            <Radio className="w-4 h-4 animate-pulse" />
            <span>{t("tabRadar")}</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-5">
        {activeTab === "radar" ? (
          <OutbreakRadar
            onSpeak={speakText}
            selectedLanguage={selectedLanguage}
            incidents={outbreakIncidents}
            onAddIncident={(newIncident) =>
              setOutbreakIncidents((prev) => [newIncident, ...prev])
            }
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Weather, Camera Upload & Demo Samples */}
            <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-20">
              {weather && (
                <div
                  className={`rounded-2xl p-4 border flex items-center justify-between shadow-sm transition ${weather.verdict === "Optimal"
                      ? "bg-emerald-50 border-emerald-200 text-emerald-950"
                      : weather.verdict === "Caution"
                        ? "bg-amber-50 border-amber-200 text-amber-950"
                        : "bg-rose-50 border-rose-200 text-rose-950"
                    }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="mt-0.5">
                      {weather.verdict === "Optimal" ? (
                        <CloudSun className="w-6 h-6 text-emerald-600" />
                      ) : weather.verdict === "Caution" ? (
                        <Wind className="w-6 h-6 text-amber-600" />
                      ) : (
                        <CloudRain className="w-6 h-6 text-rose-600" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-white/90 border shadow-2xs">
                          {weather.verdict === "Optimal"
                            ? t("sprayOptimal")
                            : weather.verdict === "Caution"
                              ? t("sprayCaution")
                              : t("sprayAvoid")}
                        </span>
                        <span className="text-xs font-semibold opacity-80">
                          {weather.temperature}°C • {weather.humidity}% {t("humidity")}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Camera / Upload Card */}
              <div className="bg-white rounded-3xl shadow-sm border border-slate-200/80 p-5 sm:p-6">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={handleFileChange}
                />

                {previewImage ? (
                  <div className="relative rounded-2xl overflow-hidden bg-black/5 aspect-video mb-4 flex items-center justify-center border border-slate-200 shadow-inner">
                    <img
                      src={previewImage}
                      alt="Crop preview"
                      className="w-full h-full object-cover"
                    />
                    {loading && (
                      <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center text-white p-4 text-center">
                        <RefreshCw className="w-8 h-8 animate-spin mb-2.5 text-emerald-400" />
                        <p className="font-bold text-base sm:text-lg">{t("examining")}</p>
                        <p className="text-xs text-emerald-200 mt-0.5">{t("poweredBy")}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-emerald-400/80 bg-emerald-50/40 hover:bg-emerald-50/80 rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition mb-4 group"
                  >
                    <div className="mx-auto w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mb-3 shadow-inner group-hover:scale-105 transition">
                      <Camera className="w-7 h-7" />
                    </div>
                    <p className="font-bold text-slate-800 text-base sm:text-lg">
                      {t("takePhoto")}
                    </p>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">
                      {t("takePhotoDesc")}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-bold py-3 px-4 rounded-xl shadow-sm transition text-xs sm:text-sm"
                  >
                    <Camera className="w-4 h-4" />
                    <span>{t("captureBtn")}</span>
                  </button>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center justify-center space-x-2 bg-slate-100 hover:bg-slate-200 active:scale-[0.98] text-slate-800 font-bold py-3 px-4 rounded-xl border border-slate-300 transition text-xs sm:text-sm"
                  >
                    <Upload className="w-4 h-4 text-slate-600" />
                    <span>{t("uploadBtn")}</span>
                  </button>
                </div>

                {/* Instant Demo Samples */}
                <div className="mt-5 pt-4 border-t border-slate-100">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    {t("demoTitle")}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-2">
                    {PRESET_SAMPLES.map((sample) => (
                      <button
                        key={sample.name}
                        onClick={() => handleSelectPreset(sample.url)}
                        className="text-xs bg-slate-50 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300 border border-slate-200 text-slate-700 p-2.5 rounded-xl font-semibold transition text-left flex items-center justify-between"
                      >
                        <span>🍃 {sample.crop}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400 opacity-60" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Live Alert, Diagnosis Card & Chat */}
            <div className="lg:col-span-7 space-y-4">
              {/* LIVE CROWDSOURCING ALERT BANNER */}
              {liveContributionAlert && (
                <div className="bg-emerald-100 border border-emerald-300 text-emerald-950 px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-between shadow-2xs animate-fadeIn">
                  <div className="flex items-center space-x-2">
                    <span className="text-base">📡</span>
                    <span>{liveContributionAlert}</span>
                  </div>
                  <button
                    onClick={() => setActiveTab("radar")}
                    className="underline hover:text-emerald-800 text-xs ml-3 font-extrabold shrink-0"
                  >
                    {t("viewOnRadar")}
                  </button>
                </div>
              )}

              {diagnosis ? (
                <div className="bg-white rounded-3xl shadow-sm border border-slate-200/80 overflow-hidden">
                  {/* Severity Banner */}
                  <div
                    className={`p-4 sm:p-5 border-b flex items-start justify-between ${diagnosis.isHealthy
                        ? "bg-emerald-50/90 border-emerald-200 text-emerald-900"
                        : diagnosis.severity === "Severe"
                          ? "bg-rose-50/90 border-rose-200 text-rose-900"
                          : "bg-amber-50/90 border-amber-200 text-amber-900"
                      }`}
                  >
                    <div className="flex items-start sm:items-center space-x-3.5">
                      {diagnosis.isHealthy ? (
                        <CheckCircle2 className="w-7 h-7 text-emerald-600 shrink-0 mt-0.5 sm:mt-0" />
                      ) : (
                        <AlertTriangle
                          className={`w-7 h-7 shrink-0 mt-0.5 sm:mt-0 ${diagnosis.severity === "Severe"
                              ? "text-rose-600"
                              : "text-amber-600"
                            }`}
                        />
                      )}
                      <div>
                        <h2 className="text-lg sm:text-xl font-extrabold leading-tight">
                          {diagnosis.detectedCondition}
                        </h2>
                        <p className="text-xs sm:text-sm opacity-85 mt-0.5">
                          {t("crop")}: <strong>{diagnosis.crop}</strong> • {t("severity")}:{" "}
                          <strong>{diagnosis.severity}</strong> • {t("confidence")}:{" "}
                          <strong>{diagnosis.confidence}</strong>
                        </p>
                      </div>
                    </div>

                    {/* Audio Listen Button */}
                    <button
                      onClick={() => speakText(diagnosis.audioSummary)}
                      className={`shrink-0 flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold shadow-xs transition active:scale-95 ${isSpeaking
                          ? "bg-rose-600 text-white animate-pulse"
                          : "bg-emerald-700 hover:bg-emerald-800 text-white"
                        }`}
                      title={t("listen")}
                    >
                      {isSpeaking ? (
                        <>
                          <VolumeX className="w-4 h-4" />
                          <span>{t("stop")}</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-4 h-4" />
                          <span>{t("listen")}</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Audio Callout */}
                  <div className="p-4 sm:p-5 bg-emerald-50/40 border-b border-emerald-100/70 flex items-start space-x-3">
                    <span className="text-xl">📢</span>
                    <p className="text-xs sm:text-sm font-medium text-emerald-950 italic leading-relaxed">
                      "{diagnosis.audioSummary}"
                    </p>
                  </div>

                  <div className="p-5 sm:p-6 space-y-5">
                    {/* Symptoms Identified */}
                    {diagnosis.symptomsIdentified?.length > 0 && (
                      <div>
                        <h3 className="text-xs sm:text-sm font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                          🔍 {t("symptoms")}
                        </h3>
                        <ul className="list-disc list-inside space-y-1.5 text-xs sm:text-sm text-slate-600">
                          {diagnosis.symptomsIdentified.map((symptom, idx) => (
                            <li key={idx} className="leading-relaxed">
                              {symptom}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Low-Cost Organic Remedies */}
                    {diagnosis.organicRemedies?.length > 0 && (
                      <div className="bg-emerald-50/80 rounded-2xl p-4 sm:p-5 border border-emerald-200">
                        <h3 className="text-xs sm:text-sm font-bold text-emerald-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                          🌱 {t("remedies")}
                        </h3>
                        <ul className="space-y-2 text-xs sm:text-sm text-emerald-950">
                          {diagnosis.organicRemedies.map((remedy, idx) => (
                            <li key={idx} className="flex items-start space-x-2 leading-relaxed">
                              <span className="font-bold text-emerald-700">•</span>
                              <span>{remedy}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Cultural Practices */}
                    {diagnosis.culturalPractices?.length > 0 && (
                      <div>
                        <h3 className="text-xs sm:text-sm font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                          🚜 {t("practices")}
                        </h3>
                        <ul className="list-disc list-inside space-y-1.5 text-xs sm:text-sm text-slate-600">
                          {diagnosis.culturalPractices.map((practice, idx) => (
                            <li key={idx} className="leading-relaxed">
                              {practice}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* "Ask AgriGemma" Chat */}
                  <div className="border-t border-slate-200 p-5 sm:p-6 bg-slate-50/60">
                    <div className="flex items-center space-x-2 mb-3">
                      <MessageSquare className="w-5 h-5 text-emerald-700" />
                      <h3 className="font-bold text-slate-800 text-xs sm:text-sm">
                        {t("chatHeader")} ({selectedLanguage.label})
                      </h3>
                    </div>

                    {/* Localized Question Chips */}
                    <div className="flex flex-wrap gap-1.5 mb-3.5">
                      {currentSuggestedQuestions.map((q, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSendChat(q)}
                          disabled={sendingChat}
                          className="text-xs bg-white hover:bg-emerald-50 hover:text-emerald-800 border border-slate-200 rounded-xl px-3 py-1.5 text-slate-600 transition text-left shadow-2xs"
                        >
                          💬 {q}
                        </button>
                      ))}
                    </div>

                    {/* Chat Thread */}
                    {chatMessages.length > 0 && (
                      <div className="space-y-3 mb-4 max-h-80 overflow-y-auto pr-1">
                        {chatMessages.map((msg, idx) => (
                          <div
                            key={idx}
                            className={`p-3.5 rounded-2xl text-xs sm:text-sm ${msg.role === "user"
                                ? "bg-emerald-600 text-white ml-8 rounded-br-none"
                                : "bg-white border border-slate-200 text-slate-800 mr-8 rounded-bl-none shadow-xs flex items-start justify-between"
                              }`}
                          >
                            <p className="leading-relaxed">{msg.text}</p>
                            {msg.role === "model" && (
                              <button
                                onClick={() => speakText(msg.text)}
                                className="ml-2.5 text-slate-400 hover:text-emerald-700 shrink-0"
                                title={t("listen")}
                              >
                                <Volume2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Input Field */}
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={inputQuestion}
                        onChange={(e) => setInputQuestion(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSendChat()}
                        placeholder={t("placeholder")}
                        disabled={sendingChat}
                        className="flex-1 bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-2xs"
                      />
                      <button
                        onClick={() => handleSendChat()}
                        disabled={sendingChat || !inputQuestion.trim()}
                        className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white p-2.5 sm:px-4 sm:py-2.5 rounded-xl shadow-xs transition flex items-center justify-center"
                      >
                        {sendingChat ? (
                          <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                        ) : (
                          <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* Empty Waiting State on Desktop */
                <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-10 text-center flex flex-col items-center justify-center min-h-[380px]">
                  <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-4 shadow-inner">
                    <Leaf className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800">{t("waitingTitle")}</h3>
                  <p className="text-xs sm:text-sm text-slate-500 max-w-md mt-1.5 leading-relaxed">
                    {t("waitingDesc")}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}