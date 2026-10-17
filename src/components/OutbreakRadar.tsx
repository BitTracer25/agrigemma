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
} from "lucide-react";

interface IncidentLocalization {
    crop: string;
    region: string;
    disease: string;
    action: string;
    audio: string;
}

interface OutbreakIncident {
    id: string;
    severity: "Critical" | "Warning" | "Watch";
    reportsCount: number;
    windSpreadRisk: "High" | "Moderate" | "Low";
    cropKey: string;
    translations: Record<string, IncidentLocalization>;
}

// Complete Multi-Language UI Strings
const RADAR_UI_STRINGS: Record<string, Record<string, string>> = {
    English: {
        badge: "Live Field Surveillance",
        reportsSubtitle: "188 Reports across 5 States",
        title: "Regional Pest & Disease Early Warning Radar",
        description:
            "Live crowdsourced disease clusters reported by nearby farmers. Take preventive action before airborne spores reach your field.",
        filterLabel: "Filter Crop:",
        all: "All",
        tomato: "Tomato",
        chili: "Chili",
        paddy: "Paddy",
        wheat: "Wheat",
        cotton: "Cotton",
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
        high: "High",
        moderate: "Moderate",
        low: "Low",
        critical: "Critical",
        warning: "Warning",
        watch: "Watch",
    },
    Hindi: {
        badge: "सक्रिय क्षेत्रीय निगरानी",
        reportsSubtitle: "5 राज्यों में 188 किसानों द्वारा रिपोर्ट",
        title: "क्षेत्रीय कीट व रोग पूर्व चेतावनी रडार",
        description:
            "आस-पास के किसानों द्वारा दर्ज की गई फसलों की बीमारियां। हवा के जरिए फफूंद आपके खेत तक पहुंचने से पहले बचाव करें।",
        filterLabel: "फसल चुनें:",
        all: "सभी",
        tomato: "टमाटर",
        chili: "मिर्च",
        paddy: "धान",
        wheat: "गेहूं",
        cotton: "कपास",
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
        high: "अधिक",
        moderate: "मध्यम",
        low: "कम",
        critical: "गंभीर",
        warning: "चेतावनी",
        watch: "निगरानी",
    },
    Marathi: {
        badge: "थेट क्षेत्रीय पाळत",
        reportsSubtitle: "५ राज्यांत १८८ शेतकऱ्यांच्या नोंदी",
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
        high: "जास्त धोका",
        moderate: "मध्यम धोका",
        low: "कमी धोका",
        critical: "गंभीर",
        warning: "इशारा",
        watch: "लक्ष ठेवा",
    },
    Telugu: {
        badge: "క్రియాశీల నిఘా",
        reportsSubtitle: "5 రాష్ట్రాల్లో 188 రైతు నివేదికలు",
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
        high: "అధికం",
        moderate: "మధ్యస్థం",
        low: "తక్కువ",
        critical: "తీవ్రం",
        warning: "హెచ్చరిక",
        watch: "గమనించండి",
    },
    Tamil: {
        badge: "தீவிர களக் கண்காணிப்பு",
        reportsSubtitle: "5 மாநிலங்களில் 188 விவசாயிகள் பதிவு",
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
        high: "அதிகம்",
        moderate: "நடுத்தரம்",
        low: "குறைவு",
        critical: "மிகத் தீவிரம்",
        warning: "எச்சரிக்கை",
        watch: "கவனிக்கவும்",
    },
};

const OUTBREAK_DATA: OutbreakIncident[] = [
    {
        id: "1",
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
                    "20 கி.मी சுற்றளவிலுள்ள விவசாயிகள் நாளை காலைக்குள் வேப்ப எண்ணெய் அல்லது சோடா கரைசல் தெளிக்கவும்.",
                audio:
                    "நாசிக் தக்காளி விவசாயிகளுக்கு எச்சரிக்கை: ஆரம்பக்கால கருகல் நோய் பாதிப்பு அதிகம். உடனே வேப்ப எண்ணெயை தெளிக்கவும்.",
            },
        },
    },
    {
        id: "2",
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
        id: "3",
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
        id: "4",
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
        id: "5",
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
}

export default function OutbreakRadar({
    onSpeak,
    selectedLanguage,
}: OutbreakRadarProps) {
    const [selectedCrop, setSelectedCrop] = useState<string>("All");
    const [selectedIncidentId, setSelectedIncidentId] = useState<string>("1");
    const selectedIncident =
        OUTBREAK_DATA.find((i) => i.id === selectedIncidentId) || OUTBREAK_DATA[0];
    const langName = selectedLanguage.name;

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
            region: "Region",
            disease: "Disease",
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

    const filteredIncidents =
        selectedCrop === "All"
            ? OUTBREAK_DATA
            : OUTBREAK_DATA.filter((i) => i.cropKey === selectedCrop);

    const currentSelectedData = getIncidentData(selectedIncident);

    return (
        <div className="space-y-4">
            {/* Community Alert Banner */}
            <div className="bg-gradient-to-r from-rose-900 to-amber-900 text-white rounded-2xl p-4 shadow-sm border border-rose-700/50 flex items-start justify-between">
                <div className="flex items-start space-x-3">
                    <div className="p-2 bg-rose-800/80 rounded-xl mt-0.5">
                        <ShieldAlert className="w-6 h-6 text-rose-300 animate-pulse" />
                    </div>
                    <div>
                        <div className="flex items-center space-x-2">
                            <span className="text-xs font-bold uppercase tracking-wider bg-rose-600 px-2.5 py-0.5 rounded-full">
                                {t("badge")}
                            </span>
                            <span className="text-xs text-rose-200">
                                {t("reportsSubtitle")}
                            </span>
                        </div>
                        <h2 className="text-lg font-bold mt-1">{t("title")}</h2>
                        <p className="text-xs text-rose-200/90 leading-relaxed mt-0.5">
                            {t("description")}
                        </p>
                    </div>
                </div>
            </div>

            {/* Crop Filter Pills */}
            <div className="bg-white rounded-2xl p-3 border border-slate-200 shadow-sm flex items-center space-x-2 overflow-x-auto">
                <Filter className="w-4 h-4 text-slate-400 ml-1 flex-shrink-0" />
                <span className="text-xs font-semibold text-slate-500 flex-shrink-0">
                    {t("filterLabel")}
                </span>
                {[
                    { key: "All", label: t("all") },
                    { key: "Tomato", label: t("tomato") },
                    { key: "Chili", label: t("chili") },
                    { key: "Paddy", label: t("paddy") },
                    { key: "Wheat", label: t("wheat") },
                    { key: "Cotton", label: t("cotton") },
                ].map((item) => (
                    <button
                        key={item.key}
                        onClick={() => setSelectedCrop(item.key)}
                        className={`text-xs px-3 py-1.5 rounded-xl font-medium transition flex-shrink-0 ${selectedCrop === item.key
                                ? "bg-emerald-600 text-white shadow-sm"
                                : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                            }`}
                    >
                        {item.label}
                    </button>
                ))}
            </div>

            {/* Visual Radar Card & Incident Detail */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Hotspot List */}
                <div className="space-y-2.5">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 ml-1">
                        <MapPin className="w-3.5 h-3.5 text-rose-600" />
                        {t("activeOutbreaks")} ({filteredIncidents.length})
                    </h3>

                    {filteredIncidents.map((incident) => {
                        const isSelected = selectedIncident.id === incident.id;
                        const itemData = getIncidentData(incident);

                        return (
                            <div
                                key={incident.id}
                                onClick={() => setSelectedIncidentId(incident.id)}
                                className={`p-3.5 rounded-2xl border cursor-pointer transition text-left relative overflow-hidden ${isSelected
                                        ? "bg-white border-emerald-600 ring-2 ring-emerald-500/20 shadow-md"
                                        : "bg-white border-slate-200 hover:border-slate-300 shadow-sm"
                                    }`}
                            >
                                <div className="flex items-start justify-between">
                                    <div>
                                        <div className="flex items-center space-x-2">
                                            <span
                                                className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${incident.severity === "Critical"
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
                                            <span className="text-xs font-semibold text-slate-700">
                                                {itemData.crop}
                                            </span>
                                        </div>
                                        <h4 className="text-sm font-bold text-slate-900 mt-1">
                                            {itemData.region}
                                        </h4>
                                        <p className="text-xs text-rose-700 font-medium">
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

                                <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
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
                                    <span className="text-emerald-700 text-[11px] font-semibold hover:underline">
                                        {t("viewAdvisory")}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Selected Incident Deep-Dive Advisory Card */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between border-b pb-3 mb-3">
                            <div>
                                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                                    {t("directiveTitle")}
                                </span>
                                <h3 className="text-lg font-bold text-slate-900 leading-tight mt-0.5">
                                    {currentSelectedData.region}
                                </h3>
                                <p className="text-xs text-slate-500">
                                    {t("threat")}: <strong>{currentSelectedData.disease}</strong> (
                                    <strong>{currentSelectedData.crop}</strong>)
                                </p>
                            </div>

                            {/* Broadcast Audio Button */}
                            <button
                                onClick={() => onSpeak(currentSelectedData.audio)}
                                className="bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white p-2.5 rounded-xl shadow transition flex items-center gap-1.5 text-xs font-semibold"
                                title={t("broadcast")}
                            >
                                <Volume2 className="w-4 h-4" />
                                <span>{t("broadcast")}</span>
                            </button>
                        </div>

                        {/* Protocol */}
                        <div className="space-y-3">
                            <div className="bg-amber-50 rounded-xl p-3.5 border border-amber-200">
                                <p className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-1 flex items-center gap-1">
                                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                                    {t("preventiveAction")}
                                </p>
                                <p className="text-xs text-amber-950 leading-relaxed font-medium">
                                    {currentSelectedData.action}
                                </p>
                            </div>

                            <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 text-xs space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-500">{t("node")}:</span>
                                    <span className="font-semibold text-slate-800">
                                        {t("nodeValue")}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-500">{t("radius")}:</span>
                                    <span className="font-semibold text-slate-800">25 km</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-500">{t("status")}:</span>
                                    <span className="font-semibold text-emerald-700 flex items-center gap-1">
                                        <CheckCircle className="w-3.5 h-3.5" />{" "}
                                        {t("activeMonitoring")}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 pt-3 border-t text-[11px] text-slate-400 flex items-center justify-between">
                        <span className="flex items-center gap-1">
                            <Users className="w-3.5 h-3.5 text-slate-400" />
                            {t("verifiedBy")}
                        </span>
                        <span>{t("liveSync")}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}