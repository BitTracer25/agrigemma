"use client";

import React, { useState } from "react";
import {
  AlertTriangle,
  Wind,
  ShieldAlert,
  MapPin,
  Volume2,
  Filter,
  CheckCircle,
  Users,
  Sparkles,
  PlusCircle,
  X,
  Send,
} from "lucide-react";

export interface IncidentLocalization {
  crop: string;
  region: string;
  disease: string;
  action: string;
  audio: string;
}

export interface OutbreakIncident {
  id: string;
  severity: "Critical" | "Warning" | "Watch";
  reportsCount: number;
  windSpreadRisk: "High" | "Moderate" | "Low";
  cropKey: string;
  isLiveScan?: boolean;
  translations: Record<string, IncidentLocalization>;
}

const RADAR_UI_STRINGS: Record<string, Record<string, string>> = {
  English: {
    badge: "Live Field Surveillance",
    reportsSubtitle: "Reports across Indian States",
    title: "Regional Pest & Disease Early Warning Radar",
    description:
      "Live crowdsourced disease clusters reported by nearby farmers. Take preventive action before airborne spores reach your field.",
    filterLabel: "Filter Crop:",
    all: "All Crops",
    tomato: "Tomato",
    chili: "Chili",
    paddy: "Paddy",
    wheat: "Wheat",
    cotton: "Cotton",
    sugarcane: "Sugarcane",
    soybean: "Soybean",
    noOutbreaks: "No active outbreaks reported for this crop.",
    activeOutbreaks: "Active Regional Outbreaks",
    farmerScans: "Farmer Reports",
    windRisk: "Wind Drift Risk",
    viewAdvisory: "View Advisory →",
    directiveTitle: "Community Action Directive",
    threat: "Target Threat",
    broadcast: "Listen Alert",
    preventiveAction: "Preventive Community Action Plan",
    node: "Surveillance Node",
    nodeValue: "Krishi Vigyan Kendra (KVK) Network",
    radius: "Cluster Radius",
    status: "Containment Status",
    activeMonitoring: "Active Monitoring",
    verifiedBy: "Verified by Krishi Vigyan Kendra (KVK)",
    liveSync: "Live Data Sync",
    liveBadge: "LIVE CROWDSOURCED (Just Now)",
    reportBtn: "Report Outbreak",
    modalTitle: "Report Disease Outbreak in Your Area",
    modalDesc: "Broadcast an early alert to neighboring farmers and KVK within 25 km.",
    cropLabel: "Select Affected Crop",
    diseaseLabel: "Disease or Pest Name",
    regionLabel: "Your Village / District",
    severityLabel: "Severity Level",
    actionLabel: "Recommended Action / Note",
    submitBtn: "Broadcast Alert to Village",
    cancelBtn: "Cancel",
    high: "High",
    moderate: "Moderate",
    low: "Low",
    critical: "Critical",
    warning: "Warning",
    watch: "Watch",
  },
  Hindi: {
    badge: "सक्रिय क्षेत्रीय निगरानी",
    reportsSubtitle: "भारतीय राज्यों में किसानों द्वारा रिपोर्ट",
    title: "क्षेत्रीय कीट व रोग पूर्व चेतावनी रडार",
    description:
      "आस-पास के किसानों द्वारा दर्ज की गई फसलों की बीमारियां। हवा के जरिए फफूंद आपके खेत तक पहुंचने से पहले बचाव करें।",
    filterLabel: "फसल चुनें:",
    all: "सभी फसलें",
    tomato: "टमाटर",
    chili: "मिर्च",
    paddy: "धान",
    wheat: "गेहूं",
    cotton: "कपास",
    sugarcane: "गन्ना",
    soybean: "सोयाबीन",
    noOutbreaks: "इस फसल के लिए कोई सक्रिय प्रकोप दर्ज नहीं है।",
    activeOutbreaks: "सक्रिय प्रकोप क्षेत्र",
    farmerScans: "किसान रिपोर्ट",
    windRisk: "हवा से फैलाव का खतरा",
    viewAdvisory: "सलाह देखें →",
    directiveTitle: "सामूहिक कार्य निर्देश",
    threat: "लक्षित बीमारी",
    broadcast: "अलर्ट सुनें",
    preventiveAction: "सामूहिक बचाव उपाय (Action Plan)",
    node: "निगरानी केंद्र",
    nodeValue: "कृषि विज्ञान केंद्र (KVK) व किसान नेटवर्क",
    radius: "प्रभाव दायरा",
    status: "रोकथाम स्थिति",
    activeMonitoring: "सक्रिय निगरानी जारी",
    verifiedBy: "कृषि विज्ञान केंद्र (KVK) द्वारा सत्यापित",
    liveSync: "लाइव डेटा सिंक",
    liveBadge: "लाइव रिपोर्ट (अभी दर्ज)",
    reportBtn: "नया प्रकोप दर्ज करें",
    modalTitle: "अपने क्षेत्र में फसल रोग की सूचना दें",
    modalDesc: "25 किमी के दायरे में आने वाले साथी किसानों को समय रहते सतर्क करें।",
    cropLabel: "प्रभावित फसल चुनें",
    diseaseLabel: "बीमारी या कीड़े का नाम",
    regionLabel: "आपका गांव / जिला",
    severityLabel: "गंभीरता का स्तर",
    actionLabel: "सुझाया गया बचाव उपाय",
    submitBtn: "गांव में अलर्ट जारी करें",
    cancelBtn: "रद्द करें",
    high: "अधिक",
    moderate: "मध्यम",
    low: "कम",
    critical: "गंभीर",
    warning: "चेतावनी",
    watch: "निगरानी",
  },
  Marathi: {
    badge: "थेट क्षेत्रीय पाळत",
    reportsSubtitle: "राज्यांत शेतकऱ्यांनी नोंदवलेले अहवाल",
    title: "प्रादेशिक कीड व रोग पूर्वसूचना रडार",
    description:
      "परिसरातील शेतकऱ्यांनी नोंदवलेले कीड-रोग. वाऱ्यामुळे बुरशी आपल्या शेतात पोहोचण्यापूर्वी खबरदारी घ्या.",
    filterLabel: "पीक निवडा:",
    all: "सर्व पिके",
    tomato: "टोमॅटो",
    chili: "मिरची",
    paddy: "भात",
    wheat: "गहू",
    cotton: "कापूस",
    sugarcane: "ऊस",
    soybean: "सोयाबीन",
    noOutbreaks: "या पिकासाठी कोणताही सक्रिय प्रादुर्भाव आढळला नाही.",
    activeOutbreaks: "सक्रिय प्रादुर्भाव क्षेत्र",
    farmerScans: "शेतकरी नोंदी",
    windRisk: "वाऱ्याने प्रसाराचा धोका",
    viewAdvisory: "सल्ला पहा →",
    directiveTitle: "सामूहिक कृती निर्देश",
    threat: "रोगाचा धोका",
    broadcast: "अलर्ट ऐका",
    preventiveAction: "सामूहिक प्रतिबंधात्मक उपाय",
    node: "निरीक्षण केंद्र",
    nodeValue: "कृषी विज्ञान केंद्र (KVK) नेटवर्क",
    radius: "प्रभाव क्षेत्र",
    status: "नियंत्रण स्थिती",
    activeMonitoring: "सक्रिय देखरेख सुरू",
    verifiedBy: "कृषी विज्ञान केंद्र (KVK) प्रमाणित",
    liveSync: "थेट माहिती अद्यतन",
    liveBadge: "थेट शेतकरी नोंद (आताच)",
    reportBtn: "प्रकोप नोंदवा (Report)",
    modalTitle: "आपल्या भागातील रोगाची नोंद करा",
    modalDesc: "२५ किमी परिसरातील शेतकरी मित्रांना वेळीच सावध करण्यासाठी सूचना पाठवा.",
    cropLabel: "बाधित पीक निवडा",
    diseaseLabel: "रोगाचे किंवा किडीचे नाव",
    regionLabel: "आपले गाव / जिल्हा",
    severityLabel: "तीव्रता",
    actionLabel: "प्रतिबंधात्मक सल्ला",
    submitBtn: "गावात अलर्ट पाठवा",
    cancelBtn: "रद्द करा",
    high: "जास्त धोका",
    moderate: "मध्यम धोका",
    low: "कमी धोका",
    critical: "गंभीर",
    warning: "इशारा",
    watch: "लक्ष ठेवा",
  },
  Telugu: {
    badge: "క్రియాశీల నిఘా",
    reportsSubtitle: "రైతు నివేదికలు",
    title: "ప్రాంతీయ తెగుళ్లు & వ్యాధుల ముందస్తు హెచ్చరిక రాడార్",
    description:
      "పక్క రైతులు నమోదు చేసిన తెగుళ్ల వివరాలు. గాలి ద్వారా బీజాలు మీ పంటకు చేరకముందే నివారణ చర్యలు చేపట్టండి.",
    filterLabel: "పంట ఎంచుకోండి:",
    all: "అన్నీ",
    tomato: "టమాట",
    chili: "మిరప",
    paddy: "వరి",
    wheat: "గోధుమ",
    cotton: "పత్తి",
    sugarcane: "చెరకు",
    soybean: "సోయాబీన్",
    noOutbreaks: "ఈ పంటకు సంబంధించి ఎలాంటి తెగుళ్లు నమోదు కాలేదు.",
    activeOutbreaks: "తీవ్రమైన తెగులు ప్రాంతాలు",
    farmerScans: "రైతు నివేదికలు",
    windRisk: "గాలి ద్వారా వ్యాప్తి ముప్పు",
    viewAdvisory: "సలహా చూడండి →",
    directiveTitle: "సామూహిక కార్యాచరణ ఆదేశం",
    threat: "ప్రధాన తెగులు",
    broadcast: "హెచ్చరిక వినండి",
    preventiveAction: "నివారణ కార్యాచరణ",
    node: "నిఘా కేంద్రం",
    nodeValue: "కృషి విజ్ఞాన కేంద్రం (KVK) నెట్‌వర్క్",
    radius: "వ్యాప్తి పరిధి",
    status: "నియంత్రణ పరిస్థితి",
    activeMonitoring: "నిరంతర పర్యవేక్షణ",
    verifiedBy: "KVK ద్వారా ధృవీకరించబడింది",
    liveSync: "ప్రత్యక్ష సమాచారం",
    liveBadge: "లైవ్ రిపోర్ట్ (ఇప్పుడే నమోదు)",
    reportBtn: "తెగులు నమోదు చేయండి",
    modalTitle: "మీ ప్రాంతంలో తెగులును నమోదు చేయండి",
    modalDesc: "పక్క రైతులకు ముందస్తు హెచ్చరిక పంపండి.",
    cropLabel: "పంటను ఎంచుకోండి",
    diseaseLabel: "తెగులు పేరు",
    regionLabel: "గ్రామం / జిల్లా",
    severityLabel: "తీవ్రత",
    actionLabel: "సలహా",
    submitBtn: "హెచ్చరిక పంపండి",
    cancelBtn: "రద్దు",
    high: "అధికం",
    moderate: "మధ్యస్థం",
    low: "తక్కువ",
    critical: "తీవ్రం",
    warning: "హెచ్చరిక",
    watch: "గమనించండి",
  },
  Tamil: {
    badge: "தீவிர களக் கண்காணிப்பு",
    reportsSubtitle: "விவசாயிகள் பதிவு செய்தவை",
    title: "மண்டல பூச்சி மற்றும் நோய் முன் எச்சரிக்கை ரேடார்",
    description:
      "அருகிலுள்ள விவசாயிகள் பதிவு செய்த நோய் பாதிப்புகள். காற்றில் பரவும் வித்திகள் உங்கள் பயிரை அடையும் முன் பாதுகாக்கவும்.",
    filterLabel: "பயிரைத் தேர்ந்தெடு:",
    all: "அனைத்தும்",
    tomato: "தக்காளி",
    chili: "மிளகாய்",
    paddy: "நெல்",
    wheat: "கோதுமை",
    cotton: "பருத்தி",
    sugarcane: "கரும்பு",
    soybean: "சோயாபீன்",
    noOutbreaks: "இப்பயிருக்கு எவ்வித நோய் பாதிப்பும் பதிவாகவில்லை.",
    activeOutbreaks: "பாதிக்கப்பட்ட பகுதிகள்",
    farmerScans: "விவசாயி பதிவுகள்",
    windRisk: "காற்றில் பரவும் அபாயம்",
    viewAdvisory: "ஆலோசனையைப் பார்க்க →",
    directiveTitle: "கூட்டு செயல் வழிகாட்டுதல்",
    threat: "முக்கிய நோய்",
    broadcast: "ஒலிபரப்பைக் கேட்க",
    preventiveAction: "கூட்டு பாதுகாப்பு நடவடிக்கை",
    node: "கண்காணிப்பு மையம்",
    nodeValue: "வேளாண் அறிவியல் மையம் (KVK)",
    radius: "பாதிப்பு ஆரம்",
    status: "கட்டுப்பாடு நிலை",
    activeMonitoring: "தீவிர கண்காணிப்பில்",
    verifiedBy: "KVK மூலம் சரிபார்க்கப்பட்டது",
    liveSync: "நேரடித் தரவு",
    liveBadge: "நேரடிப் பதிவு (இப்போது)",
    reportBtn: "பாதிப்பை பதிவு செய்",
    modalTitle: "நோய் பாதிப்பை பதிவு செய்யவும்",
    modalDesc: "அருகிலுள்ள விவசாயிகளுக்கு முன் எச்சரிக்கை அனுப்பவும்.",
    cropLabel: "பயிர்",
    diseaseLabel: "நோய் பெயர்",
    regionLabel: "ஊர் / மாவட்டம்",
    severityLabel: "தீவிரம்",
    actionLabel: "பாதுகாப்பு நடவடிக்கை",
    submitBtn: "எச்சரிக்கை அனுப்பு",
    cancelBtn: "ரத்து செய்",
    high: "அதிகம்",
    moderate: "நடுத்தரம்",
    low: "குறைவு",
    critical: "மிகத் தீவிரம்",
    warning: "எச்சரிக்கை",
    watch: "கவனிக்கவும்",
  },
};

export const INITIAL_OUTBREAK_DATA: OutbreakIncident[] = [
  {
    id: "seed-1",
    severity: "Critical",
    reportsCount: 42,
    windSpreadRisk: "High",
    cropKey: "Tomato",
    translations: {
      English: {
        crop: "Tomato",
        region: "Nashik & Dindori, Maharashtra",
        disease: "Early Blight (Alternaria)",
        action:
          "All farmers within 20 km: Spray baking soda/neem solution before tomorrow morning. High humidity is accelerating fungal spore spread.",
        audio:
          "Alert for Nashik tomato growers: 42 cases of early blight detected. High wind spread risk. Spray organic neem solution immediately.",
      },
      Hindi: {
        crop: "टमाटर",
        region: "नासिक व दिंडोरी, महाराष्ट्र",
        disease: "अगेती झुलसा / करपा रोग",
        action:
          "20 किमी के दायरे में आने वाले सभी किसान: कल सुबह से पहले बेकिंग सोडा या नीम के घोल का छिड़काव करें। नमी से फफूंद तेजी से फैल रही है।",
        audio:
          "नासिक के टमाटर किसानों के लिए अलर्ट: अगेती झुलसा के 42 मामले मिले हैं। हवा से फैलाव का खतरा अधिक है। तुरंत नीम के घोल का छिड़काव करें।",
      },
      Marathi: {
        crop: "टोमॅटो",
        region: "नाशिक व दिंडोरी, महाराष्ट्र",
        disease: "अगेती करपा रोग (अल्टरनेरिया)",
        action:
          "२० किमी परिसरातील सर्व शेतकरी: उद्या सकाळपूर्वी बेकिंग सोडा किंवा कडुलिंबाच्या काढ्याची फवारणी करा. हवेतील दमटपणामुळे बुरशी झपाट्याने पसरत आहे.",
        audio:
          "नाशिक व दिंडोरी परिसरातील टोमॅटो उत्पादक शेतकऱ्यांसाठी इशारा: करपा रोगाचा प्रादुर्भाव वाढला आहे. हवेतील दमटपणामुळे बुरशी वेगाने पसरत आहे. ताबडतोब बेकिंग सोडा किंवा कडुलिंबाच्या काढ्याची फवारणी करा.",
      },
      Telugu: {
        crop: "టమాట",
        region: "నాసిక్ & దిండోరి, మహారాష్ట్ర",
        disease: "ముందస్తు తెగులు (ఆల్టర్నేరియా)",
        action:
          "20 కి.మీ పరిధిలోని రైతులు రేపు ఉదయానికల్లా బేకింగ్ సోడా లేదా వేప ద్రావణాన్ని పిచికారీ చేయండి.",
        audio:
          "నాసిక్ టమాటా రైతులకు హెచ్చరిక: ముందస్తు తెగులు కేసులు నమోదయ్యాయి. వెంటనే వేప నూనె పిచికారీ చేయండి.",
      },
      Tamil: {
        crop: "தக்காளி",
        region: "நாசிக் & திண்டோரி, மகாராஷ்டிரா",
        disease: "ஆரம்பக்கால கருகல் நோய்",
        action:
          "20 கி.மீ சுற்றளவிலுள்ள விவசாயிகள் நாளை காலைக்குள் வேப்ப எண்ணெய் அல்லது சோடா கரைசல் தெளிக்கவும்.",
        audio:
          "நாசிக் தக்காளி விவசாயிகளுக்கு எச்சரிக்கை: ஆரம்பக்கால கருகல் நோய் பாதிப்பு அதிகம். உடனே வேப்ப எண்ணெயை தெளிக்கவும்.",
      },
    },
  },
  {
    id: "seed-2",
    severity: "Critical",
    reportsCount: 68,
    windSpreadRisk: "High",
    cropKey: "Chili",
    translations: {
      English: {
        crop: "Chili",
        region: "Guntur & Tenali, Andhra Pradesh",
        disease: "Thrips & Leaf Curl Virus",
        action:
          "Install blue and yellow sticky traps at 20 per acre immediately. Avoid excessive chemical nitrogen to curb pest reproduction.",
        audio:
          "Critical alert for Guntur chili farmers: Heavy thrips and leaf curl infestation. Install sticky traps immediately across your field.",
      },
      Hindi: {
        crop: "मिर्च",
        region: "गुंटूर व तेनाली, आंध्र प्रदेश",
        disease: "थ्रिप्स व पत्ता मरोड़ (चुरडा) रोग",
        action:
          "प्रति एकड़ तुरंत 20 नीले व पीले चिपचिपे ट्रैप लगाएं। कीड़ों की संख्या बढ़ने से रोकने के लिए यूरिया का अधिक उपयोग न करें।",
        audio:
          "गुंटूर के मिर्च किसानों के लिए चेतावनी: थ्रिप्स व पत्ता मरोड़ रोग तेजी से फैल रहा है। तुरंत पीले और नीले ट्रैप लगाएं।",
      },
      Marathi: {
        crop: "मिरची",
        region: "गुंटूर व तेनाली, आंध्र प्रदेश",
        disease: "चुरडा-मुरडा (बोकड्या) रोग व फुलकिडे",
        action:
          "प्रति एकर तातडीने २० निळे व पिवळे चिकट सापळे लावावेत. किडींचा प्रादुर्भाव रोखण्यासाठी अतिरिक्त रासायनिक युरियाचा वापर टाळावा आणि दशपर्णी अर्क फवारावा.",
        audio:
          "गुंटूर आणि तेनाली परिसरातील मिरची पिकावर फुलकिडे व चुरडा-मुरडा रोगाचा मोठा प्रादुर्भाव झाला आहे. सर्व शेतकऱ्यांनी शेतात एकरी वीस निळे व पिवळे चिकट सापळे लावावेत आणि रासायनिक खतांचा अतिवापर टाळावा.",
      },
      Telugu: {
        crop: "మిరప",
        region: "గుంటూరు & తెనాలి, ఆంధ్రప్రదేశ్",
        disease: "తామర పురుగులు & బొబ్బర తెగులు",
        action:
          "ఎకరాకు వెంటనే 20 పసుపు మరియు నీలి రంగు జిగురు అట్టలను ఏర్పాటు చేయండి. అధిక నత్రజని వాడకాన్ని తగ్గించండి.",
        audio:
          "గుంటూరు మిరప రైతులకు హెచ్చరిక: తామర పురుగుల తీవ్రత ఎక్కువ. వెంటనే పొలాల్లో జిగురు అట్టలను అమర్చండి.",
      },
      Tamil: {
        crop: "மிளகாய்",
        region: "குண்டூர் & தெனாலி, ஆந்திரா",
        disease: "இலைசுருட்டு நோய் மற்றும் அசுவினி",
        action:
          "ஏக்கருக்கு 20 நீல மற்றும் மஞ்சள் நிற ஒட்டும் பொறிகளை உடனடியாக அமைக்கவும். அதிக தழைச்சத்து உரங்களை தவிர்க்கவும்.",
        audio:
          "குண்டூர் மிளகாய் விவசாயிகளுக்கு எச்சரிக்கை: இலைசுருட்டு நோய் அதிகம். உடனே ஒட்டும் பொறிகளை அமைக்கவும்.",
      },
    },
  },
  {
    id: "seed-3",
    severity: "Warning",
    reportsCount: 29,
    windSpreadRisk: "Moderate",
    cropKey: "Paddy",
    translations: {
      English: {
        crop: "Paddy / Rice",
        region: "Mandya & Mysuru, Karnataka",
        disease: "Paddy Blast (Pyricularia oryzae)",
        action:
          "Drain standing water for 48 hours to expose soil roots. Dust silica or sifted wood ash along field borders to arrest fungal progression.",
        audio:
          "Warning for Mandya paddy farmers: Blast disease identified in 29 fields. Drain standing water and apply wood ash.",
      },
      Hindi: {
        crop: "धान",
        region: "मंड्या व मैसूर, कर्नाटक",
        disease: "धान का झुलसा / ब्लास्ट रोग",
        action:
          "48 घंटों के लिए खेत से अतिरिक्त पानी निकाल दें। फफूंद रोकने के लिए खेत की मेड़ों पर लकड़ी की राख या सिलिका छिड़कें।",
        audio:
          "मंड्या के धान किसानों के लिए चेतावनी: 29 खेतों में ब्लास्ट रोग दिखा है। पानी निकालें और मेड़ों पर राख डालें।",
      },
      Marathi: {
        crop: "भात / धान",
        region: "मंड्या व म्हैसूर, कर्नाटक",
        disease: "भातावरील करपा (ब्लास्ट रोग)",
        action:
          "शेतात साचलेले अतिरिक्त पाणी दोन दिवस बाहेर काढून टाकावे. बुरशीचा प्रसार रोखण्यासाठी शेताच्या बांधांवर लाकडाची बारीक राख किंवा चुना पसरावा.",
        audio:
          "मंड्या आणि म्हैसूर भागातील भात पिकावर ब्लास्ट रोगाचा प्रादुर्भाव आढळला आहे. शेतातील साचलेले पाणी बाहेर काढा आणि बांधांवर लाकडाची राख टाका.",
      },
      Telugu: {
        crop: "వరి",
        region: "మండ్య & మైసూరు, కర్ణాటక",
        disease: "అగ్గి తెగులు (బ్లాస్ట్)",
        action:
          "రెండు రోజులు పొలంలో నిల్వ ఉన్న నీటిని తీసివేయండి. గట్ల వెంబడి బూడిదను చల్లండి.",
        audio:
          "మండ్య వరి రైతులకు హెచ్చరిక: 29 చోట్ల అగ్గి తెగులు కనిపించింది. పొలంలో నీటిని తీసివేసి బూడిద చల్లండి.",
      },
      Tamil: {
        crop: "நெல்",
        region: "மண்டியா & மைசூர், கர்நாடகா",
        disease: "நெல் குலை நோய் (பிளாஸ்ட்)",
        action:
          "48 மணி நேரம் வயலில் தேங்கிய நீரை வடிய வைக்கவும். வரப்புகளில் மரச்சாம்பல் தூவவும்.",
        audio:
          "மண்டியா நெல் விவசாயிகளுக்கு எச்சரிக்கை: குலை நோய் பரவுகிறது. வயல் நீரை வடிய வைக்கவும்.",
      },
    },
  },
  {
    id: "seed-4",
    severity: "Watch",
    reportsCount: 14,
    windSpreadRisk: "Moderate",
    cropKey: "Wheat",
    translations: {
      English: {
        crop: "Wheat",
        region: "Ludhiana & Khanna, Punjab",
        disease: "Yellow / Stripe Rust",
        action:
          "Inspect northern border rows of your wheat field daily. Early morning dew combined with low temperature favors stripe rust spores.",
        audio:
          "Wheat watch for Ludhiana region: Yellow rust patches observed in 14 locations. Monitor fields closely during cool morning hours.",
      },
      Hindi: {
        crop: "गेहूं",
        region: "लुधियाना व खन्ना, पंजाब",
        disease: "पीला रतुआ (Yellow Rust)",
        action:
          "गेहूं के खेत की उत्तरी सीमाओं की रोजाना जांच करें। सुबह की ओस और ठंड से पीली रतुआ के बीजाणु तेजी से पनपते हैं।",
        audio:
          "लुधियाना क्षेत्र के गेहूं किसानों के लिए सूचना: 14 जगहों पर पीली रतुआ के लक्षण दिखे हैं। सुबह के समय खेत का मुआयना करें।",
      },
      Marathi: {
        crop: "गहू",
        region: "लुधियाना व खन्ना, पंजाब",
        disease: "गव्हावरील पिवळा तांबेरा (Yellow Rust)",
        action:
          "गव्हाच्या पिकाची नियमित पाहणी करा. सकाळी पडणारे दव आणि थंड वातावरणामुळे तांबेऱ्याचा प्रादुर्भाव वाढू शकतो, सुरुवातीलाच निंबोळी अर्क फवारावा.",
        audio:
          "लुधियाना परिसरातील गहू उत्पादक शेतकऱ्यांसाठी पूर्वसूचना: पिवळा तांबेरा रोगाचे लक्षणे दिसली आहेत. सकाळच्या वेळी शेताची काळजीपूर्वक पाहणी करा.",
      },
      Telugu: {
        crop: "గోధుమ",
        region: "లూధియానా & ఖన్నా, పంజాబ్",
        disease: "పసుపు తుప్పు తెగులు",
        action:
          "గోధుమ చేలను ఉదయాన్నే పరిశీలించండి. చలి మరియు మంచు వల్ల తెగులు వ్యాప్తి చెందే అవకాశం ఉంది.",
        audio:
          "లూధియానా గోధుమ రైతులకు సూచన: 14 ప్రాంతాల్లో పసుపు తుప్పు తెగులు కనిపించింది. పొలాలను గమనించండి.",
      },
      Tamil: {
        crop: "கோதுமை",
        region: "லூதியானா & கன்னா, பஞ்சாப்",
        disease: "மஞ்சள் துரு நோய்",
        action:
          "கோதுமை பயிர்களை தினமும் கண்காணிக்கவும். பனிப்பொழிவு துரு நோயை பரப்பும் என்பதால் கவனம் தேவை.",
        audio:
          "லூதியானா கோதுமை விவசாயிகளுக்கு தகவல்: மஞ்சள் துரு நோய் தென்பட்டுள்ளது. காலை வேளையில் பயிரை கண்காணிக்கவும்.",
      },
    },
  },
  {
    id: "seed-5",
    severity: "Warning",
    reportsCount: 35,
    windSpreadRisk: "Low",
    cropKey: "Cotton",
    translations: {
      English: {
        crop: "Cotton",
        region: "Surat & Bharuch, Gujarat",
        disease: "Pink Bollworm Infestation",
        action:
          "Deploy pheromone traps at 5 per acre. Inspect rosette flowers at dawn and pick dropped squares to break the larvae cycle.",
        audio:
          "Advisory for Surat cotton belt: Pink bollworm detected in 35 holdings. Install pheromone traps to disrupt mating.",
      },
      Hindi: {
        crop: "कपास",
        region: "सूरत व भरूच, गुजरात",
        disease: "गुलाबी सुंडी (Pink Bollworm)",
        action:
          "प्रति एकड़ 5 फेरोमोन ट्रैप लगाएं। सुबह-सुबह खिले हुए फूलों की जांच करें और गिरे हुए डोडे नष्ट कर दें।",
        audio:
          "सूरत के कपास किसानों के लिए सलाह: 35 खेतों में गुलाबी सुंडी पाई गई है। तुरंत फेरोमोन ट्रैप लगाएं।",
      },
      Marathi: {
        crop: "कापूस",
        region: "सुरत व भरूच, गुजरात",
        disease: "गुलाबी बोंडअळीचा प्रादुर्भाव",
        action:
          "एकरामध्ये किमान ५ कामगंध (फेरोमोन) सापळे लावावेत. सकाळी उमललेली फुले तपासा आणि खाली पडलेली बोंडे गोळा करून नष्ट करा.",
        audio:
          "सुरत परिसरातील कापूस उत्पादक शेतकऱ्यांसाठी सल्ला: गुलाबी बोंडअळीचा प्रादुर्भाव आढळला आहे. तात्काळ कामगंध सापळे लावा.",
      },
      Telugu: {
        crop: "పత్తి",
        region: "సూరత్ & భరూచ్, గుజరాత్",
        disease: "గులాబీ రంగు కాయ తొలుచు పురుగు",
        action:
          "ఎకరాకు 5 లింగాకర్షక బుట్టలను అమర్చండి. రాలిపోయిన మొగ్గలను ఏరి నాశనం చేయండి.",
        audio:
          "సూరత్ పత్తి రైతులకు సలహా: గులాబీ పురుగు ఆశించింది. వెంటనే లింగాకర్షక బుట్టలను ఏర్పాటు చేయండి.",
      },
      Tamil: {
        crop: "பருத்தி",
        region: "சூரத் & பரூச், குஜராத்",
        disease: "இளஞ்சிவப்பு காய் புழு தாக்குதல்",
        action:
          "ஏக்கருக்கு 5 இனக்கவர்ச்சி பொறிகளை வைக்கவும். உதிர்ந்த பூ மொக்குகளை சேகரித்து அழிக்கவும்.",
        audio:
          "சூரத் பருத்தி விவசாயிகளுக்கு ஆலோசனை: இளஞ்சிவப்பு காய் புழு தென்பட்டுள்ளது. இனக்கவர்ச்சி பொறிகளை அமைக்கவும்.",
      },
    },
  },
];

interface OutbreakRadarProps {
  onSpeak: (text: string) => void;
  selectedLanguage: { code: string; name: string };
  incidents?: OutbreakIncident[];
  onAddIncident?: (incident: OutbreakIncident) => void;
}

export default function OutbreakRadar({
  onSpeak,
  selectedLanguage,
  incidents = INITIAL_OUTBREAK_DATA,
  onAddIncident,
}: OutbreakRadarProps) {
  const [selectedCrop, setSelectedCrop] = useState<string>("All");
  const [selectedIncidentId, setSelectedIncidentId] = useState<string>(
    incidents[0]?.id || "seed-1"
  );

  // Modal State for Reporting
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formCrop, setFormCrop] = useState("Tomato");
  const [formDisease, setFormDisease] = useState("");
  const [formRegion, setFormRegion] = useState("");
  const [formSeverity, setFormSeverity] = useState<"Critical" | "Warning" | "Watch">("Warning");
  const [formAction, setFormAction] = useState("");

  const langName = selectedLanguage?.name || "English";

  const t = (key: string): string => {
    return (
      RADAR_UI_STRINGS[langName]?.[key] ||
      RADAR_UI_STRINGS["English"]?.[key] ||
      key
    );
  };

  const getIncidentData = (incident?: OutbreakIncident): IncidentLocalization => {
    const fallback: IncidentLocalization = {
      crop: incident?.cropKey || "Crop",
      region: "Local Field Node",
      disease: "Crop Condition",
      action: "Please follow local KVK guidelines.",
      audio: "Please follow local KVK guidelines.",
    };

    if (!incident || !incident.translations) return fallback;

    return (
      incident.translations[langName] ||
      incident.translations["Marathi"] ||
      incident.translations["Hindi"] ||
      incident.translations["English"] ||
      fallback
    );
  };

  // Dynamically extract all unique crops present in the incidents
  const availableCrops = React.useMemo(() => {
    const cropSet = new Set<string>();
    incidents.forEach((inc) => {
      if (inc.cropKey && inc.cropKey.trim()) {
        const raw = inc.cropKey.trim();
        cropSet.add(raw.charAt(0).toUpperCase() + raw.slice(1));
      }
    });
    return ["All", ...Array.from(cropSet)];
  }, [incidents]);

  const filteredIncidents =
    selectedCrop === "All"
      ? incidents
      : incidents.filter((i) => {
          const incCrop = (i.cropKey || "").toLowerCase();
          const targetCrop = selectedCrop.toLowerCase();
          return (
            incCrop === targetCrop ||
            incCrop.includes(targetCrop) ||
            targetCrop.includes(incCrop)
          );
        });

  // Keep the active selection strictly synchronized with the filtered view
  const selectedIncident =
    filteredIncidents.find((i) => i.id === selectedIncidentId) ||
    filteredIncidents[0] ||
    incidents[0];

  const handleSelectCropFilter = (cropKey: string) => {
    setSelectedCrop(cropKey);
    if (cropKey === "All") {
      if (incidents.length > 0) {
        setSelectedIncidentId(incidents[0].id);
      }
    } else {
      const match = incidents.find((i) => {
        const incCrop = (i.cropKey || "").toLowerCase();
        const targetCrop = cropKey.toLowerCase();
        return (
          incCrop === targetCrop ||
          incCrop.includes(targetCrop) ||
          targetCrop.includes(incCrop)
        );
      });
      if (match) {
        setSelectedIncidentId(match.id);
      }
    }
  };

  const currentSelectedData = getIncidentData(selectedIncident);
  const totalReports = incidents.reduce((sum, item) => sum + item.reportsCount, 0);

  // Handle active reporting by farmer
  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formDisease.trim() || !formRegion.trim()) return;

    const newIncident: OutbreakIncident = {
      id: `reported-${Date.now()}`,
      severity: formSeverity,
      reportsCount: 1,
      windSpreadRisk: formSeverity === "Critical" ? "High" : "Moderate",
      cropKey: formCrop,
      isLiveScan: true,
      translations: {
        English: {
          crop: formCrop,
          region: `${formRegion} (Community Alert)`,
          disease: formDisease,
          action: formAction || "Inspect field and apply recommended organic remedy.",
          audio: `Community alert for ${formRegion}: ${formDisease} reported on ${formCrop}.`,
        },
        Hindi: {
          crop: formCrop,
          region: `${formRegion} (किसान चेतावनी)`,
          disease: formDisease,
          action: formAction || "खेत की जांच करें और जैविक उपचार लागू करें।",
          audio: `${formRegion} में ${formCrop} पर ${formDisease} की सूचना मिली है।`,
        },
        Marathi: {
          crop: formCrop,
          region: `${formRegion} (शेतकरी इशारा)`,
          disease: formDisease,
          action: formAction || "शेताची पाहणी करा आणि सेंद्रिय फवारणी करा.",
          audio: `${formRegion} परिसरात ${formCrop} पिकावर ${formDisease} चा प्रादुर्भाव आढळला आहे.`,
        },
        Telugu: {
          crop: formCrop,
          region: `${formRegion} (హెచ్చరిక)`,
          disease: formDisease,
          action: formAction || "పంటను గమనించి నివారణ చర్యలు చేపట్టండి.",
          audio: `${formRegion} లో ${formDisease} కనిపించింది.`,
        },
        Tamil: {
          crop: formCrop,
          region: `${formRegion} (எச்சரிக்கை)`,
          disease: formDisease,
          action: formAction || "பயிரை கண்காணித்து பாதுகாப்பு நடவடிக்கை எடுக்கவும்.",
          audio: `${formRegion} பகுதியில் ${formDisease} தென்பட்டுள்ளது.`,
        },
      },
    };

    if (onAddIncident) {
      onAddIncident(newIncident);
    }
    setSelectedIncidentId(newIncident.id);
    setIsModalOpen(false);
    setFormDisease("");
    setFormRegion("");
    setFormAction("");
  };

  return (
    <div className="space-y-4">
      {/* Community Alert Banner with "Report Outbreak" Button */}
      <div className="bg-gradient-to-r from-rose-900 to-amber-900 text-white rounded-3xl p-5 shadow-sm border border-rose-700/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start space-x-3.5">
          <div className="p-2.5 bg-rose-800/80 rounded-2xl mt-0.5 shadow-inner shrink-0">
            <ShieldAlert className="w-6 h-6 text-rose-300 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-black uppercase tracking-wider bg-rose-600 px-2.5 py-0.5 rounded-full shadow-2xs">
                {t("badge")}
              </span>
              <span className="text-xs text-rose-200 font-semibold">
                {totalReports} {t("reportsSubtitle")}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold mt-1">{t("title")}</h2>
            <p className="text-xs sm:text-sm text-rose-200/90 leading-relaxed mt-0.5 max-w-2xl">
              {t("description")}
            </p>
          </div>
        </div>

        {/* ACTIVE REPORT BUTTON */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full sm:w-auto shrink-0 bg-white hover:bg-rose-50 text-rose-900 active:scale-95 font-extrabold px-4 py-2.5 rounded-2xl shadow-md transition flex items-center justify-center space-x-2 text-xs sm:text-sm border border-rose-200"
        >
          <PlusCircle className="w-4 h-4 text-rose-600" />
          <span>{t("reportBtn")}</span>
        </button>
      </div>

      {/* REPORT OUTBREAK MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b pb-3">
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900">
                  {t("modalTitle")}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">{t("modalDesc")}</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitReport} className="space-y-3.5 text-xs sm:text-sm">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {t("cropLabel")}
                </label>
                <select
                  value={formCrop}
                  onChange={(e) => setFormCrop(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  <option value="Tomato">Tomato (टमाटर / टोमॅटो)</option>
                  <option value="Chili">Chili (मिर्च / मिरची)</option>
                  <option value="Paddy">Paddy / Rice (धान / भात)</option>
                  <option value="Wheat">Wheat (गेहूं / गहू)</option>
                  <option value="Cotton">Cotton (कपास / कापूस)</option>
                  <option value="Soybean">Soybean (सोयाबीन)</option>
                  <option value="Sugarcane">Sugarcane (ऊस)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {t("diseaseLabel")} *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Early Blight, Fall Armyworm, Leaf Curl..."
                  value={formDisease}
                  onChange={(e) => setFormDisease(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {t("regionLabel")} *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Nashik, Guntur, Baramati, Khanna..."
                  value={formRegion}
                  onChange={(e) => setFormRegion(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {t("severityLabel")}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(["Critical", "Warning", "Watch"] as const).map((sev) => (
                    <button
                      type="button"
                      key={sev}
                      onClick={() => setFormSeverity(sev)}
                      className={`py-2 px-3 rounded-xl font-bold text-xs border transition ${
                        formSeverity === sev
                          ? sev === "Critical"
                            ? "bg-rose-600 text-white border-rose-600"
                            : sev === "Warning"
                            ? "bg-amber-600 text-white border-amber-600"
                            : "bg-blue-600 text-white border-blue-600"
                          : "bg-slate-50 text-slate-700 border-slate-200"
                      }`}
                    >
                      {t(sev.toLowerCase())}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {t("actionLabel")}
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Seeing spots across 5 acres. Advise spraying neem oil..."
                  value={formAction}
                  onChange={(e) => setFormAction(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-600 font-bold hover:bg-slate-100 transition"
                >
                  {t("cancelBtn")}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold shadow-md transition flex items-center space-x-1.5"
                >
                  <Send className="w-4 h-4" />
                  <span>{t("submitBtn")}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Dynamic Crop Filter Pills */}
      <div className="bg-white rounded-2xl p-3 border border-slate-200 shadow-sm flex items-center space-x-2 overflow-x-auto">
        <Filter className="w-4 h-4 text-slate-400 ml-1 shrink-0" />
        <span className="text-xs font-semibold text-slate-500 shrink-0">
          {t("filterLabel")}
        </span>
        {availableCrops.map((cropKey) => {
          const lowerKey = cropKey.toLowerCase();
          const label =
            lowerKey === "all"
              ? t("all")
              : t(lowerKey) !== lowerKey
              ? t(lowerKey)
              : cropKey;
          const isSelected = selectedCrop.toLowerCase() === cropKey.toLowerCase();
          const matchCount =
            cropKey === "All"
              ? incidents.length
              : incidents.filter((i) => {
                  const incCrop = (i.cropKey || "").toLowerCase();
                  return (
                    incCrop === lowerKey ||
                    incCrop.includes(lowerKey) ||
                    lowerKey.includes(incCrop)
                  );
                }).length;

          return (
            <button
              key={cropKey}
              onClick={() => handleSelectCropFilter(cropKey)}
              className={`text-xs px-3 py-1.5 rounded-xl font-semibold transition shrink-0 flex items-center gap-1.5 ${
                isSelected
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-700"
              }`}
            >
              <span>{label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  isSelected
                    ? "bg-emerald-700 text-emerald-100"
                    : "bg-slate-200 text-slate-600"
                }`}
              >
                {matchCount}
              </span>
            </button>
          );
        })}
      </div>

      {/* 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Hotspot List (lg:col-span-5) */}
        <div className="lg:col-span-5 space-y-2.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 ml-1">
            <MapPin className="w-3.5 h-3.5 text-rose-600" />
            {t("activeOutbreaks")} ({filteredIncidents.length})
          </h3>

          {filteredIncidents.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center space-y-2.5 shadow-xs">
              <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto" />
              <p className="text-xs sm:text-sm font-bold text-slate-700">
                {t("noOutbreaks")}
              </p>
              <button
                onClick={() => handleSelectCropFilter("All")}
                className="text-xs text-emerald-700 font-extrabold hover:underline"
              >
                {t("all")} ({incidents.length}) →
              </button>
            </div>
          ) : (
            filteredIncidents.map((incident) => {
            const isSelected = selectedIncident?.id === incident.id;
            const itemData = getIncidentData(incident);

            return (
              <div
                key={incident.id}
                onClick={() => setSelectedIncidentId(incident.id)}
                className={`p-4 rounded-2xl border cursor-pointer transition text-left relative overflow-hidden ${
                  isSelected
                    ? "bg-white border-emerald-600 ring-2 ring-emerald-500/20 shadow-md"
                    : "bg-white border-slate-200 hover:border-slate-300 shadow-sm"
                }`}
              >
                {/* Live Badge for crowdsourced items */}
                {incident.isLiveScan && (
                  <div className="mb-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-100 border border-emerald-300 text-emerald-900 text-[10px] font-black tracking-wider uppercase animate-pulse">
                    <Sparkles className="w-3 h-3 text-emerald-600" />
                    <span>{t("liveBadge")}</span>
                  </div>
                )}

                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                          incident.severity === "Critical"
                            ? "bg-rose-100 text-rose-800"
                            : incident.severity === "Warning"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {incident.severity === "Critical"
                          ? t("critical")
                          : incident.severity === "Warning"
                          ? t("warning")
                          : t("watch")}
                      </span>
                      <span className="text-xs font-bold text-slate-700">
                        {itemData.crop}
                      </span>
                    </div>
                    <h4 className="text-sm font-extrabold text-slate-900 mt-1">
                      {itemData.region}
                    </h4>
                    <p className="text-xs text-rose-700 font-semibold mt-0.5">
                      {itemData.disease}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-lg font-black text-slate-800">
                      {incident.reportsCount}
                    </span>
                    <p className="text-[10px] text-slate-500 font-medium">
                      {t("farmerScans")}
                    </p>
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1 text-[11px]">
                    <Wind className="w-3 h-3 text-slate-400" />
                    {t("windRisk")}:{" "}
                    <strong
                      className={
                        incident.windSpreadRisk === "High"
                          ? "text-rose-600"
                          : "text-amber-600"
                      }
                    >
                      {incident.windSpreadRisk === "High"
                        ? t("high")
                        : incident.windSpreadRisk === "Moderate"
                        ? t("moderate")
                        : t("low")}
                    </strong>
                  </span>
                  <span className="text-emerald-700 text-[11px] font-bold hover:underline">
                    {t("viewAdvisory")}
                  </span>
                </div>
              </div>
            );
          })
        )}
        </div>

        {/* Selected Incident Deep-Dive Advisory Card (lg:col-span-7) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between lg:sticky lg:top-20">
          <div>
            <div className="flex items-start justify-between border-b pb-4 mb-4">
              <div>
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                  {t("directiveTitle")}
                </span>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 leading-tight mt-0.5">
                  {currentSelectedData.region}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  {t("threat")}: <strong>{currentSelectedData.disease}</strong> (
                  <strong>{currentSelectedData.crop}</strong>)
                </p>
              </div>

              {/* Broadcast Audio Button */}
              <button
                onClick={() => onSpeak(currentSelectedData.audio)}
                className="bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white px-3 py-2 rounded-xl shadow-xs transition flex items-center gap-1.5 text-xs font-bold shrink-0 ml-2"
                title={t("broadcast")}
              >
                <Volume2 className="w-4 h-4" />
                <span>{t("broadcast")}</span>
              </button>
            </div>

            {/* Protocol */}
            <div className="space-y-3.5">
              <div className="bg-amber-50/80 rounded-2xl p-4 border border-amber-200">
                <p className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  {t("preventiveAction")}
                </p>
                <p className="text-xs sm:text-sm text-amber-950 leading-relaxed font-medium">
                  {currentSelectedData.action}
                </p>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs sm:text-sm space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">{t("node")}:</span>
                  <span className="font-bold text-slate-800">
                    {t("nodeValue")}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">{t("radius")}:</span>
                  <span className="font-bold text-slate-800">25 km</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">{t("status")}:</span>
                  <span className="font-bold text-emerald-700 flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" /> {t("activeMonitoring")}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3.5 border-t text-xs text-slate-400 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-slate-400" />
              {t("verifiedBy")}
            </span>
            <span className="font-semibold text-emerald-600 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              {t("liveSync")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}