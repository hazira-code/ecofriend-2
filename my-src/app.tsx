import React, { useState, useEffect, useRef } from "react";
import {
  Sprout,
  Droplet,
  Languages,
  User,
  Compass,
  FileText,
  LayoutDashboard,
  Volume2,
  Bot,
  TrendingUp,
  Sparkles,
  Upload,
  Clock,
  Thermometer,
  Send,
  Mic,
  MicOff,
  LogOut,
  Lock,
  Mail,
  ArrowRight,
  ShieldAlert,
  CheckCircle,
  Check,
  Sun,
  CloudSun,
  Leaf,
  RefreshCw,
  Info
} from "lucide-react";
import { Language, UserProfile, ChatMessage, PlantRecommendation, SoilGuidance, WaterPrediction, ClimateSuitability, DiseaseResult, GrowthPrediction } from "./types";

export default function App() {
  // Localization state
  const [lang, setLang] = useState<Language>("en");

  // Authentication states
  const [user, setUser] = useState<UserProfile>({
    email: "student@ecofriend.org",
    name: "Horticulture Student",
    isLoggedIn: false
  });
  const [screen, setScreen] = useState<"landing" | "login" | "signup" | "forgot" | "dashboard">("landing");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authName, setAuthName] = useState("");
  const [authError, setAuthError] = useState("");
  const [authSuccess, setAuthSuccess] = useState("");

  // Dashboard layout states
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "recommendation" | "soil" | "water" | "climate" | "disease" | "chatbot" | "growth" | "voice"
  >("dashboard");

  // Features APIs Response States with beautiful seed state
  const [loading, setLoading] = useState(false);
  const [recInputs, setRecInputs] = useState({ climate: "Tropical", sunlight: "Full Sun", soilType: "Loamy", water: "Moderate" });
  const [recResults, setRecResults] = useState<PlantRecommendation[]>([]);

  const [soilInputs, setSoilInputs] = useState({ soilType: "Clayey", currentCondition: "Slightly dry, cracked" });
  const [soilResult, setSoilResult] = useState<SoilGuidance | null>(null);

  const [waterInputs, setWaterInputs] = useState({ plantName: "Holy Basil (Tulsi)", climate: "Semi-Arid", temperature: "32", stage: "Vegetative" });
  const [waterResult, setWaterResult] = useState<WaterPrediction | null>(null);

  const [climateInputs, setClimateInputs] = useState({ plantName: "Tomato", location: "Andhra Pradesh", temperature: "34", humidity: "65" });
  const [climateResult, setClimateResult] = useState<ClimateSuitability | null>(null);

  const [diseaseImage, setDiseaseImage] = useState<string | null>(null);
  const [diseaseResult, setDiseaseResult] = useState<DiseaseResult | null>(null);

  const [chatbotMessages, setChatbotMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      sender: "bot",
      text: "Namaste! Welcome to EcoFriend AI. I can guide you in English or Telugu with soil recipes, seedling care, or crop choices.",
      textTelugu: "నమస్తే! ఏకోఫ్రెండ్ AI కి స్వాగతం. మట్టి తయారీ, నారు పోషణ లేదా పంటల ఎంపికలో నేను మీకు సహాయం చేయగలను.",
      timestamp: new Date()
    }
  ]);
  const [chatInput, setChatInput] = useState("");

  const [growthInputs, setGrowthInputs] = useState({ plantName: "Marigold (Banthi)", careLevel: "High Care", soilQuality: "Compost Rich" });
  const [growthResult, setGrowthResult] = useState<GrowthPrediction | null>(null);

  // Audio Voice Assistant Speech State
  const [listening, setListening] = useState(false);
  const [speechText, setSpeechText] = useState("");
  const [speechError, setSpeechError] = useState("");
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioSource, setAudioSource] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const chatBottomRef = useRef<HTMLDivElement | null>(null);

  // Auto Scroll Chat
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatbotMessages, activeTab]);

  // Handle TTS playback from the server-side Gemini API (TTS preview)
  const speakText = async (textToSpeak: string) => {
    try {
      setIsPlayingAudio(true);
      setSpeechError("");
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: textToSpeak, language: lang })
      });

      if (!res.ok) throw new Error("Could not speak via Gemini TTS API");
      const data = await res.json();
      if (data.audio) {
        const audioBlobUrl = `data:audio/wav;base64,${data.audio}`;
        setAudioSource(audioBlobUrl);
      }
    } catch (err: any) {
      console.error(err);
      setSpeechError(lang === "en" ? "Voice response failed. Speaking using Browser Speech instead." : "బ్రౌజర్ వాయిస్ సహాయంతో మాట్లాడుతోంది.");
      
      // Fallback to client browser window speech API
      if ("speechSynthesis" in window) {
        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        utterance.lang = lang === "te" ? "te-IN" : "en-US";
        utterance.onend = () => setIsPlayingAudio(false);
        window.speechSynthesis.speak(utterance);
      } else {
        setIsPlayingAudio(false);
      }
    }
  };

  useEffect(() => {
    if (audioSource && audioRef.current) {
      audioRef.current.play();
    }
  }, [audioSource]);

  // Auth Validations
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setAuthSuccess("");
    if (!authEmail.includes("@")) {
      setAuthError(lang === "en" ? "Please enter a valid student or general email." : "దయచేసి సరైన ఈమెయిల్ నమోదు చేయండి.");
      return;
    }
    if (authPassword.length < 4) {
      setAuthError(lang === "en" ? "Password must contain at least 4 characters." : "పాస్‌వర్డ్ కనీసం 4 అక్షరాలను కలిగి ఉండాలి.");
      return;
    }

    setUser({
      email: authEmail,
      name: authEmail.split("@")[0].toUpperCase(),
      isLoggedIn: true
    });
    setAuthSuccess(lang === "en" ? "Authenticated Successfully! Click Next to go to Dashboard." : "విజయవంతంగా లాగిన్ అయ్యారు! తదుపరి నొక్కండి.");
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setAuthSuccess("");
    if (!authName) {
      setAuthError(lang === "en" ? "Please enter your name." : "దయచేసి మీ పేరును నమోదు చేయండి.");
      return;
    }
    if (!authEmail.includes("@")) {
      setAuthError(lang === "en" ? "Please enter a valid email." : "దయచేసి సరైన ఈమెయిల్ ఎంటర్ చేయండి.");
      return;
    }
    if (authPassword.length < 4) {
      setAuthError(lang === "en" ? "Password must be at least 4 characters." : "పాస్‌వర్డ్ కనీసం 4 అక్షరాలు ఉండాలి.");
      return;
    }

    setUser({
      email: authEmail,
      name: authName,
      isLoggedIn: true
    });
    setAuthSuccess(lang === "en" ? "Account Created Successfully! Click Next." : "ఖాతా సృష్టించబడింది! తదుపరి బటన్ నొక్కండి.");
  };

  // Feature 1: Plant Recommendation API
  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(recInputs)
      });
      const data = await res.json();
      setRecResults(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Feature 2: Soil Guidance API
  const fetchSoilGuidance = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/soil-guidance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(soilInputs)
      });
      const data = await res.json();
      setSoilResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Feature 3: Water Prediction API
  const fetchWaterPrediction = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/water-prediction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(waterInputs)
      });
      const data = await res.json();
      setWaterResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Feature 4: Climate Suitability API
  const fetchClimateSuitability = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/climate-suitability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(climateInputs)
      });
      const data = await res.json();
      setClimateResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Feature 5: Leaf Disease Analyzer (Base64 file reader)
  const handleDiseaseImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setDiseaseImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const runDiseaseDetection = async () => {
    if (!diseaseImage) return;
    setLoading(true);
    try {
      const res = await fetch("/api/disease-detection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: diseaseImage })
      });
      const data = await res.json();
      setDiseaseResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Pre-load leaf sample images for interactive testing
  const selectSampleLeaf = (type: "spots" | "mildew" | "healthy") => {
    // Elegant canvas pattern simulated leaf spots
    const canvas = document.createElement("canvas");
    canvas.width = 300;
    canvas.height = 300;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      // Natural leaf design base
      ctx.fillStyle = "#2D6A4F";
      ctx.beginPath();
      ctx.ellipse(150, 150, 100, 60, Math.PI / 4, 0, 2 * Math.PI);
      ctx.fill();
      
      // Veins
      ctx.strokeStyle = "#4D936F";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(80, 80);
      ctx.lineTo(220, 220);
      ctx.stroke();

      if (type === "spots") {
        ctx.fillStyle = "#78350F"; // brown rot spots
        ctx.beginPath(); ctx.arc(120, 130, 8, 0, 2 * Math.PI); ctx.fill();
        ctx.beginPath(); ctx.arc(160, 110, 12, 0, 2 * Math.PI); ctx.fill();
        ctx.beginPath(); ctx.arc(170, 180, 6, 0, 2 * Math.PI); ctx.fill();
      } else if (type === "mildew") {
        ctx.fillStyle = "#E2E8F0"; // white powdery mildew spots
        ctx.globalAlpha = 0.8;
        ctx.beginPath(); ctx.arc(130, 140, 16, 0, 2 * Math.PI); ctx.fill();
        ctx.beginPath(); ctx.arc(170, 150, 22, 0, 2 * Math.PI); ctx.fill();
      } else {
        // healthy highlight shiny emerald
        ctx.fillStyle = "#F0FDF4";
        ctx.globalAlpha = 0.2;
        ctx.beginPath(); ctx.ellipse(130, 130, 40, 20, Math.PI/4, 0, 2 * Math.PI); ctx.fill();
      }
    }
    setDiseaseImage(canvas.toDataURL());
    setDiseaseResult(null);
  };

  // Feature 6: Chatbot API Trigger
  const handleSendChat = async (presetText?: string) => {
    const textToSend = presetText || chatInput;
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: "user",
      text: textToSend,
      timestamp: new Date()
    };

    setChatbotMessages((prev) => [...prev, userMsg]);
    setChatInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          chatHistory: chatbotMessages.slice(-6)
        })
      });

      const data = await res.json();
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        text: data.reply || "Happy gardening! Keep learning.",
        textTelugu: data.replyTelugu,
        timestamp: new Date()
      };

      setChatbotMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Feature 7: Growth Predictor API
  const fetchGrowthPrediction = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/growth-prediction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(growthInputs)
      });
      const data = await res.json();
      setGrowthResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Feature 8: Voice Assistant Voice Integration Simulator
  const triggerVoiceRecognition = () => {
    if (listening) {
      setListening(false);
      return;
    }

    setListening(true);
    setSpeechError("");

    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.lang = lang === "te" ? "te-IN" : "en-US";

      recognition.onresult = async (event: any) => {
        const transcript = event.results[0][0].transcript;
        setSpeechText(transcript);
        setListening(false);
        setLoading(true);

        try {
          const res = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: transcript })
          });
          const data = await res.json();
          const voiceReply = lang === "te" && data.replyTelugu ? data.replyTelugu : data.reply;
          setSpeechText(`${transcript} ➜ Assistant: ${voiceReply}`);
          speakText(voiceReply);
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      };

      recognition.onerror = () => {
        setListening(false);
        setSpeechError(lang === "en" ? "Speech recognition error. Use simulation below." : "వాయిస్ దోషం. కింద ఇవ్వబడిన బటన్స్ ఉపయోగించండి.");
      };

      recognition.start();
    } else {
      // simulated voice timing fallback for previewers
      setTimeout(() => {
        setListening(false);
        setSpeechError(lang === "en" ? "Web speech is restricted in some iframe sandboxes. Use custom fast voice actions!" : "క్రింది వేగవంతమైన వాయిస్ డైలాగ్‌లను ఉపయోగించండి.");
      }, 1500);
    }
  };

  // Trigger high-fidelity simulation buttons for the Voice Assistant
  const runVoiceSimulation = async (phrase: string, teluguPhrase: string) => {
    setLoading(true);
    setSpeechText(lang === "te" ? teluguPhrase : phrase);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: phrase })
      });
      const data = await res.json();
      const output = lang === "te" && data.replyTelugu ? data.replyTelugu : data.reply;
      setSpeechText((lang === "te" ? teluguPhrase : phrase) + " ➜ EcoFriend: " + output);
      speakText(output);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Automatically fetch initial dashboard data on successful login
  useEffect(() => {
    if (user.isLoggedIn) {
      fetchRecommendations();
      fetchSoilGuidance();
      fetchWaterPrediction();
      fetchClimateSuitability();
      fetchGrowthPrediction();
    }
  }, [user.isLoggedIn]);

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#F0F4EF] text-[#1B4332] selection:bg-[#95D5B2] selection:text-[#1B4332]">
      {/* Hidden TTS player element */}
      {audioSource && (
        <audio
          ref={audioRef}
          src={audioSource}
          onEnded={() => setIsPlayingAudio(false)}
          className="hidden"
        />
      )}

      {/* TOP DECORATIVE INTEGRATION ALERT STATUS (HUMBLE & PROFESSIONAL) */}
      <div className="bg-[#1B4332] text-[#B7E4C7] text-xs px-4 py-1.5 flex justify-between items-center z-50 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-mono text-[10px] tracking-wider uppercase">
            {lang === "en" ? "BILINGUAL COOPERATION ONLINE" : "ద్విభాషా సహాయం అందుబాటులో ఉంది"}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setLang(lang === "en" ? "te" : "en")}
            id="lang-toggle-top"
            className="flex items-center gap-1.5 hover:text-white transition font-bold"
          >
            <Languages size={13} />
            <span>{lang === "en" ? "తెలుగు" : "English"}</span>
          </button>
          <span className="opacity-50">|</span>
          <span className="text-[10px] opacity-80 font-mono">2026 UTC</span>
        </div>
      </div>

      {/* 1. LANDING SCREEN */}
      {screen === "landing" && (
        <div className="flex-1 flex flex-col overflow-x-hidden">
          {/* Landing Header */}
          <header className="max-w-7xl w-full mx-auto px-6 py-5 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#95D5B2] rounded-xl flex items-center justify-center text-xl shadow-md border border-white/40">
                🌱
              </div>
              <span className="font-bold text-xl tracking-tight text-[#1B4332]">
                EcoFriend
              </span>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setScreen("login")}
                id="landing-signin-btn"
                className="text-sm font-semibold text-[#2D6A4F] hover:text-[#1B4332] px-3 py-1.5 rounded-lg transition"
              >
                {lang === "en" ? "Sign In" : "లాగిన్"}
              </button>
              <button
                onClick={() => setScreen("signup")}
                id="landing-signup-btn"
                className="text-sm font-semibold bg-[#2D6A4F] text-white hover:bg-[#1B4332] px-4 py-2 rounded-xl shadow-sm hover:shadow-md transition"
              >
                {lang === "en" ? "Register" : "రిజిస్టర్"}
              </button>
            </div>
          </header>

          {/* Hero Section */}
          <section className="max-w-7xl w-full mx-auto px-6 py-8 md:py-16 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center flex-1">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#B7E4C7]/40 rounded-full text-xs font-bold text-[#1B4332]">
                <Sparkles size={14} className="text-[#2D6A4F] animate-spin-slow" />
                <span>
                  {lang === "en" ? "For Classroom Students & Gardening Beginners" : "విద్యార్థులు మరియు ప్రారంభకులకు ప్రత్యేకం"}
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#1B4332] leading-none">
                EcoFriend
                <span className="block mt-1 text-2xl md:text-3xl text-[#2D6A4F] font-bold">
                  AI Smart Plantation Assistant
                </span>
                <span className="block mt-2 text-xl md:text-2xl text-[#40916C] font-semibold font-telugu">
                  ఏకోఫ్రెండ్ – AI స్మార్ట్ ప్లాంటేషన్ సహాయకుడు
                </span>
              </h1>

              <p className="text-base text-[#2D6A4F] leading-relaxed max-w-xl">
                {lang === "en"
                  ? "Transform your school project or backyard balcony into a thriving organic garden. Detect plant diseases instantly, calculate ideal manure mixes, predict water counts, and speak bilingually with our voice chatbot."
                  : "మీ తదుపరి గృహ లేదా పాఠశాల ప్రాజెక్ట్‌ను బయో-డైవర్స్ తోటగా మార్చండి. వేప నూనె చిట్కాలు, రోజూ నీటి పరిమాణం అంచనా మరియు వాయిస్ అసిస్టెంట్‌తో తెలుగులోనే సమాధానాలు కనుగొనండి."}
              </p>

              <div className="flex flex-wrap gap-4 pt-2">
                <button
                  onClick={() => setScreen("signup")}
                  id="hero-cta-register"
                  className="px-6 py-3 bg-[#1B4332] text-[#B7E4C7] font-bold text-sm rounded-xl shadow-md hover:bg-[#2D6A4F] hover:translate-y-[-1px] transition flex items-center gap-2"
                >
                  <span>{lang === "en" ? "Sow Your First Seed (Register)" : "మొదటి విత్తనాన్ని నాటండి (రిజిస్టర్)"}</span>
                  <ArrowRight size={16} />
                </button>
                <button
                  onClick={() => setScreen("login")}
                  id="hero-cta-login"
                  className="px-6 py-3 bg-white/80 backdrop-blur text-[#1B4332] font-semibold text-sm rounded-xl border border-[#B7E4C7] hover:bg-white transition"
                >
                  {lang === "en" ? "Access Lab Dashboard" : "ల్యాబ్ డాష్బోర్డ్ యాక్సెస్"}
                </button>
              </div>

              {/* Quick stats grid */}
              <div className="grid grid-cols-3 gap-4 pt-6 max-w-md">
                <div className="p-3 bg-white/50 rounded-xl border border-white/30 text-center">
                  <p className="font-bold text-lg text-[#1B4332] font-mono">100%</p>
                  <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">
                    {lang === "en" ? "Bilingual" : "ద్విభాషా"}
                  </p>
                </div>
                <div className="p-3 bg-white/50 rounded-xl border border-white/30 text-center">
                  <p className="font-bold text-lg text-[#1B4332] font-mono">Gemini 3.5</p>
                  <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">
                    {lang === "en" ? "AI Powered" : "ఏఐ ఆధారితం"}
                  </p>
                </div>
                <div className="p-3 bg-white/50 rounded-xl border border-white/30 text-center">
                  <p className="font-bold text-lg text-[#1B4332] font-mono">Offline</p>
                  <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">
                    {lang === "en" ? "Sim Option" : "సిమ్యులేటర్"}
                  </p>
                </div>
              </div>
            </div>

            {/* Premium Interactive Showcase Widget on Hero */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-sm glass-card bg-white/80 rounded-3xl p-6 border border-[#B7E4C7] shadow-xl space-y-4">
                {/* Simulated live scanner animation */}
                <div className="relative h-48 rounded-2xl overflow-hidden bg-emerald-950 flex items-center justify-center border border-emerald-800">
                  <img
                    src="/src/assets/images/eco_hero_banner_1779541933908.png"
                    alt="EcoFriend Greenhouse Banner"
                    className="absolute inset-0 w-full h-full object-cover opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/90 via-emerald-900/40 to-transparent" />
                  <div className="absolute top-2 left-2 px-2 py-0.5 bg-emerald-500 text-white font-mono text-[9px] font-bold rounded">
                    LIVE CORE v3.5
                  </div>
                  
                  {/* Digital scanner line overlay effect */}
                  <div className="absolute left-0 right-0 h-0.5 bg-emerald-400 opacity-60 animate-bounce" style={{ top: "35%", animationDuration: "3s" }} />
                  
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <p className="text-[10px] tracking-wider text-emerald-300 font-mono font-bold uppercase">
                      {lang === "en" ? "CURRENT SEEDLING STATUS" : "ప్రస్తుత మొక్కల స్థితి"}
                    </p>
                    <p className="text-sm font-bold truncate">
                      {lang === "en" ? "Smart Greenhouse Chamber 01" : "స్మార్ట్ గ్రీన్హౌస్ చాంబర్ 01"}
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-[#F0F4EF] rounded-2xl border border-emerald-100">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
                    <p className="text-xs font-bold text-emerald-950 uppercase tracking-wide">
                      {lang === "en" ? "Daily Botanical Prompt" : "నేటి తోటపని చిట్కా"}
                    </p>
                  </div>
                  <p className="text-xs text-slate-700 italic mt-1 pb-1">
                    {lang === "en" 
                      ? '"Add crushed eggshells around tomato roots to prevent black bottom rot."'
                      : '"టమోటా ముండ్లకు నల్లని తెగులు రాకుండా ఉండటానికి పాదులలో కోడిగుడ్డు పెంకుల పొడి చల్లండి."'}
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs pt-2">
                  <span className="text-slate-500">{lang === "en" ? "Already Registered?" : "ముందే ఖాతా ఉందా?"}</span>
                  <button
                    onClick={() => setScreen("login")}
                    className="font-bold text-[#2D6A4F] hover:underline"
                  >
                    {lang === "en" ? "Log In Instantly ➜" : "లాగిన్ అవ్వండి ➜"}
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Quick core visual walkthrough section */}
          <footer className="bg-white/40 border-t border-emerald-100/40 py-8 px-6 mt-12 z-10">
            <div className="max-w-7xl w-full mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-emerald-100 text-emerald-800 rounded-lg">🌱</div>
                <div>
                  <h4 className="font-bold text-xs uppercase text-slate-600 tracking-wider">
                    {lang === "en" ? "Recommendation" : "మొక్కల ప్రతిపాదనలు"}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {lang === "en" ? "Best fits for your sunlight." : "మీ ఎండ తీవ్రతకు తగిన మొక్కలు."}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-emerald-100 text-emerald-800 rounded-lg">🍂</div>
                <div>
                  <h4 className="font-bold text-xs uppercase text-slate-600 tracking-wider">
                    {lang === "en" ? "Disease Scanning" : "వ్యాధి నివారణ"}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {lang === "en" ? "Botanical AI vision analysis." : "ఆకు ఫోటోతో రోగ గుర్తింపు."}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-emerald-100 text-emerald-800 rounded-lg">🎤</div>
                <div>
                  <h4 className="font-bold text-xs uppercase text-slate-600 tracking-wider">
                    {lang === "en" ? "Telugu Voice Assistance" : "తెలుగు వాయిస్ సహాయం"}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {lang === "en" ? "Hands-free regional speech." : "హ్యాండ్స్-ఫ్రీ తెలుగు సంభాషణలు."}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-emerald-100 text-emerald-800 rounded-lg">💧</div>
                <div>
                  <h4 className="font-bold text-xs uppercase text-slate-600 tracking-wider">
                    {lang === "en" ? "Irrigation prediction" : "నీటి యాజమాన్యం"}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {lang === "en" ? "Milliliters calculated precisely." : "మిల్లీలీటర్లలో ఖచ్చితమైన అంచనా."}
                  </p>
                </div>
              </div>
            </div>
          </footer>
        </div>
      )}

      {/* 2. AUTHENTICATION PAGES (LOGIN, SIGNUP, FORGOT) */}
      {(screen === "login" || screen === "signup" || screen === "forgot") && (
        <div className="flex-1 flex items-center justify-center p-6 relative">
          <div className="absolute inset-0 z-0 overflow-hidden opacity-30">
            <div className="absolute top-10 left-10 w-96 h-96 bg-emerald-300 rounded-full filter blur-3xl" />
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#B7E4C7] rounded-full filter blur-3xl" />
          </div>

          <div className="w-full max-w-md bg-white/70 backdrop-blur-md p-8 rounded-3xl border border-[#B7E4C7] shadow-xl space-y-6 z-10 transition-all">
            <div className="text-center space-y-2">
              <div className="inline-flex w-12 h-12 bg-[#95D5B2] text-[#1B4332] rounded-2xl items-center justify-center text-2xl mx-auto shadow-sm">
                🌱
              </div>
              <h2 className="text-2xl font-extrabold text-[#1B4332] tracking-tight">
                {screen === "login"
                  ? (lang === "en" ? "Student Login" : "విద్యార్థి లాగిన్")
                  : screen === "signup"
                  ? (lang === "en" ? "Create Account" : "ఖాతా సృష్టించండి")
                  : (lang === "en" ? "Restore Access" : "పాస్వర్డ్ రీసెట్")}
              </h2>
              <p className="text-xs text-[#2D6A4F] uppercase tracking-wider font-semibold">
                EcoFriend Smart Plantation assistant
              </p>
            </div>

            {authError && (
              <div className="p-3.5 bg-red-50 text-red-900 rounded-xl border border-red-200 text-xs flex items-center gap-2">
                <ShieldAlert size={16} className="text-red-600 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            {authSuccess && (
              <div className="p-3.5 bg-emerald-50 text-emerald-950 rounded-xl border border-emerald-200 text-xs flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-emerald-600 shrink-0" />
                  <span className="font-semibold">{authSuccess}</span>
                </div>
                <button
                  onClick={() => {
                    setScreen("dashboard");
                    setActiveTab("dashboard");
                  }}
                  id="auth-next-btn"
                  className="w-full mt-1.5 py-2 px-4 bg-[#1B4332] text-white hover:bg-[#2D6A4F] font-bold rounded-lg text-xs transition uppercase tracking-widest"
                >
                  {lang === "en" ? "Next ➜" : "తదుపరి ప్రవేశించండి ➜"}
                </button>
              </div>
            )}

            {screen === "login" && (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-emerald-900 uppercase tracking-widest block">
                    {lang === "en" ? "Email Address" : "ఈమెయిల్ చిరునామా"}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="student@ecofriend.org"
                      value={authEmail}
                      onChange={(e) => setAuthEmail(e.target.value)}
                      id="login-email-input"
                      className="w-full bg-white border border-emerald-100 rounded-xl py-2.5 pl-9 pr-4 text-xs focus:ring-1 focus:ring-emerald-400 outline-none transition"
                    />
                    <Mail size={13} className="absolute left-3 top-3 text-emerald-600" />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <label className="text-[11px] font-bold text-emerald-900 uppercase tracking-widest block">
                      {lang === "en" ? "Password" : "పాస్వర్డ్"}
                    </label>
                    <button
                      type="button"
                      onClick={() => setScreen("forgot")}
                      id="forgot-pwd-trigger"
                      className="text-[10px] text-emerald-700 hover:underline font-bold"
                    >
                      {lang === "en" ? "Forgot?" : "మర్చిపోయారా?"}
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={authPassword}
                      onChange={(e) => setAuthPassword(e.target.value)}
                      id="login-password-input"
                      className="w-full bg-white border border-emerald-100 rounded-xl py-2.5 pl-9 pr-4 text-xs focus:ring-1 focus:ring-emerald-400 outline-none transition"
                    />
                    <Lock size={13} className="absolute left-3 top-3 text-emerald-600" />
                  </div>
                  <p className="text-[10px] text-slate-400">
                    {lang === "en" ? "Hint: You can use any testing password." : "సూచన: ఏదైనా పాస్‌వర్డ్ వాడవచ్చు."}
                  </p>
                </div>

                <button
                  type="submit"
                  id="login-submit-btn"
                  className="w-full bg-[#1B4332] text-white py-2.5 rounded-xl text-xs font-bold hover:bg-[#2D6A4F] transition shadow-md"
                >
                  {lang === "en" ? "Sign In to Laboratory" : "ల్యాబ్‌లోకి లాగిన్ అవ్వండి"}
                </button>
              </form>
            )}

            {screen === "signup" && (
              <form onSubmit={handleSignupSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-emerald-900 uppercase tracking-widest block">
                    {lang === "en" ? "Full Name" : "పూర్తి పేరు"}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Aarav Prasad"
                      value={authName}
                      onChange={(e) => setAuthName(e.target.value)}
                      id="signup-name-input"
                      className="w-full bg-white border border-emerald-100 rounded-xl py-2.5 pl-9 pr-4 text-xs focus:ring-1 focus:ring-emerald-400 outline-none transition"
                    />
                    <User size={13} className="absolute left-3 top-3 text-emerald-600" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-emerald-900 uppercase tracking-widest block">
                    {lang === "en" ? "Email Address" : "ఈమెయిల్ చిరునామా"}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="aarav@ecofriend.org"
                      value={authEmail}
                      onChange={(e) => setAuthEmail(e.target.value)}
                      id="signup-email-input"
                      className="w-full bg-white border border-emerald-100 rounded-xl py-2.5 pl-9 pr-4 text-xs focus:ring-1 focus:ring-emerald-400 outline-none transition"
                    />
                    <Mail size={13} className="absolute left-3 top-3 text-emerald-600" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-emerald-900 uppercase tracking-widest block">
                    {lang === "en" ? "Set Password" : "పాస్వర్డ్ సెట్ చేయండి"}
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={authPassword}
                      onChange={(e) => setAuthPassword(e.target.value)}
                      id="signup-password-input"
                      className="w-full bg-white border border-[#B7E4C7] rounded-xl py-2.5 pl-9 pr-4 text-xs focus:ring-1 focus:ring-emerald-400 outline-none transition"
                    />
                    <Lock size={13} className="absolute left-3 top-3 text-emerald-600" />
                  </div>
                </div>

                <button
                  type="submit"
                  id="signup-submit-btn"
                  className="w-full bg-[#1B4332] text-[#B7E4C7] py-2.5 rounded-xl text-xs font-bold hover:bg-[#2D6A4F] transition"
                >
                  {lang === "en" ? "Create Free Student Account" : "ఉచిత విద్యార్థి ఖాతా సృష్టించండి"}
                </button>
              </form>
            )}

            {screen === "forgot" && (
              <div className="space-y-4">
                <p className="text-xs text-slate-600">
                  {lang === "en"
                    ? "Enter your registered student email and we will simulate password rehabilitation instructions."
                    : "మీ రిజిస్టర్డ్ ఈమెయిల్ ఎంటర్ చేయండి, రీసెట్ సూచనలు పంపిస్తాము."}
                </p>
                <div className="space-y-1">
                  <input
                    type="text"
                    placeholder="yourname@ecofriend.org"
                    className="w-full bg-white border border-[#B7E4C7] rounded-xl py-2 px-3 text-xs outline-none"
                  />
                </div>
                <button
                  onClick={() => {
                    setAuthSuccess(lang === "en" ? "Simulation link sent! Reset success." : "లింక్ పంపబడింది! రీసెట్ పూర్తయింది.");
                  }}
                  className="w-full bg-[#2D6A4F] text-white py-2 rounded-xl text-xs font-bold"
                >
                  {lang === "en" ? "Send Recovery Link" : "రికవరీ లింక్ పంపండి"}
                </button>
              </div>
            )}

            <div className="border-t border-emerald-100 pt-4 flex items-center justify-between text-xs text-slate-500">
              <span>
                {screen === "login"
                  ? (lang === "en" ? "New school beginner?" : "కొత్త విద్యార్థా?")
                  : (lang === "en" ? "Already registered?" : "ముందే ఖాతా ఉందా?")}
              </span>
              <button
                type="button"
                onClick={() => {
                  setAuthError("");
                  setAuthSuccess("");
                  setScreen(screen === "login" ? "signup" : "login");
                }}
                className="font-bold text-[#2D6A4F] hover:underline"
              >
                {screen === "login"
                  ? (lang === "en" ? "Create Account" : "ఖాతా సృష్టించండి")
                  : (lang === "en" ? "Sign In Here" : "లాగిన్ అవ్వండి")}
              </button>
            </div>

            <div className="text-center pt-2">
              <button
                onClick={() => setScreen("landing")}
                className="text-slate-400 hover:text-slate-700 text-xs transition underline"
              >
                {lang === "en" ? "← Back to Homepage" : "← హోంపేజీకి తిరిగి వెళ్ళు"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. CORE DASHBOARD & MAIN INTERACTIVE GREEN APPLICATION */}
      {screen === "dashboard" && (
        <div className="flex-1 flex overflow-hidden">
          {/* SIDEBAR NAVIGATION PANEL */}
          <aside
            className={`${
              sidebarOpen ? "w-68" : "w-16"
            } bg-gradient-to-b from-[#1B4332] to-[#0D2418] text-white flex flex-col p-4 transition-all duration-350 shrink-0 z-30 shadow-2xl relative border-r border-[#2D6A4F]/20`}
          >
            {/* Header / Logo branding */}
            <div className="flex items-center gap-3 mb-8 mt-2 overflow-hidden">
              <div className="w-10 h-10 bg-[#95D5B2] text-[#1B4332] rounded-xl flex items-center justify-center text-xl shrink-0 shadow-lg border border-[#B7E4C7]/30">
                🌱
              </div>
              {sidebarOpen && (
                <div>
                  <h1 className="font-extrabold text-sm tracking-tight leading-none text-white flex items-center gap-1">
                    <span>EcoFriend</span>
                    <span className="text-[9px] bg-[#95D5B2] text-[#1B4332] px-1 rounded">STUDENT</span>
                  </h1>
                  <p className="text-[9px] opacity-75 tracking-wider uppercase font-semibold font-mono mt-0.5">
                    {lang === "en" ? "AI Smart Assistant" : "సహజ సహాయకుడు"}
                  </p>
                </div>
              )}
            </div>

            {/* Sidebar toggle badge */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="absolute right-[-12px] top-6 w-6 h-6 rounded-full bg-[#2D6A4F] text-[#B7E4C7] border border-white/20 flex items-center justify-center text-[10px] shadow-md z-40 hover:bg-[#40916C] transition"
            >
              {sidebarOpen ? "◀" : "▶"}
            </button>

            {/* Navigation groups */}
            <div className="space-y-1.5 flex-1 select-none">
              <p className={`text-[8px] font-bold text-emerald-400 uppercase tracking-widest mb-2 px-2.5 ${!sidebarOpen && "opacity-0"}`}>
                {lang === "en" ? "Primary Hub" : "ప్రధాన విభాగాలు"}
              </p>

              {[
                { id: "dashboard", label: "Overview Status", telugu: "అవలోకనం", icon: <LayoutDashboard size={16} /> },
                { id: "recommendation", label: "Plant Recommend", telugu: "మొక్కల సిఫార్సు", icon: <Sprout size={16} /> },
                { id: "soil", label: "Soil Guidance", telugu: "మట్టి సూచనలు", icon: <FileText size={16} /> },
                { id: "water", label: "Water Quantity", telugu: "నీటి అంచనా", icon: <Droplet size={16} /> },
                { id: "climate", label: "Climate Suitability", telugu: "వాతావరణం", icon: <CloudSun size={16} /> },
                { id: "disease", label: "Leaf Disease Vision", telugu: "వ్యాధి నివారణ", icon: <ShieldAlert size={16} /> },
                { id: "chatbot", label: "AI Consultation", telugu: "AI చాట్బాట్", icon: <Bot size={16} /> },
                { id: "growth", label: "Yield Estimator", telugu: "దిగుబడి అంచనా", icon: <TrendingUp size={16} /> },
                { id: "voice", label: "Voice Interactions", telugu: "వాయిస్ సహాయం", icon: <Volume2 size={16} /> }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`w-full text-left p-2.5 rounded-xl transition flex items-center gap-3 relative ${
                    activeTab === item.id
                      ? "bg-white/10 text-emerald-200 border-l-4 border-emerald-400 font-bold"
                      : "text-emerald-100/70 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <span className="shrink-0">{item.icon}</span>
                  {sidebarOpen && (
                    <div className="truncate">
                      <span className="block text-[11px] leading-none mb-1 font-semibold">{item.label}</span>
                      <span className="block text-[9px] opacity-70 font-telugu leading-none">{item.telugu}</span>
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* Profile Drawer footer */}
            <div className="mt-auto pt-4 border-t border-[#2D6A4F]/30 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#B7E4C7] flex items-center justify-center text-emerald-950 font-bold shrink-0 text-xs">
                  {user.name.charAt(0)}
                </div>
                {sidebarOpen && (
                  <div className="truncate">
                    <p className="text-xs font-bold leading-tight truncate">{user.name}</p>
                    <p className="text-[9px] opacity-60 truncate">{user.email}</p>
                  </div>
                )}
              </div>
              <button
                onClick={() => setUser({ ...user, isLoggedIn: false })}
                className="w-full py-1.5 px-2 bg-red-950/40 hover:bg-red-900/40 text-red-300 rounded-lg text-[10px] font-bold transition flex items-center justify-center gap-2"
              >
                <LogOut size={11} />
                {sidebarOpen && <span>{lang === "en" ? "Sign Out" : "లాగౌట్"}</span>}
              </button>
            </div>
          </aside>

          {/* MAIN PAGE CONTAINER WITH HEADER & INTERACTIVE INNER TAB VIEW */}
          <main className="flex-1 flex flex-col overflow-y-auto">
            {/* Main Header bar */}
            <header className="bg-white/80 backdrop-blur px-6 py-4 border-b border-[#B7E4C7]/40 flex justify-between items-center shrink-0">
              <div>
                <h2 className="text-xl font-extrabold text-[#1B4332] tracking-tight flex items-center gap-2">
                  <span>EcoFriend Platform</span>
                  <span className="text-xs font-normal text-slate-400">| {lang === "en" ? "Active Study Room" : "యాక్టివ్ ల్యాబ్"}</span>
                </h2>
                <p className="text-[10px] font-semibold text-emerald-700 tracking-wider uppercase font-mono mt-0.5">
                  {lang === "en"
                    ? "STUDENT & BEGINNER BOTANICAL PORTAL"
                    : "విద్యార్థులు మరియు ప్రారంభకులకు తోటపని పోర్టల్"}
                </p>
              </div>

              {/* Header options controls */}
              <div className="flex items-center gap-3">
                {/* Active language selector pill */}
                <div className="bg-[#B7E4C7]/30 px-3 py-1.5 rounded-full border border-emerald-200 text-xs font-bold text-[#1B4332] flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-700" />
                  <span>{lang === "en" ? "English Model" : "తెలుగు మోడల్"}</span>
                  <button
                    onClick={() => setLang(lang === "en" ? "te" : "en")}
                    className="ml-2 px-2 py-0.5 bg-[#1B4332] text-white text-[9px] font-bold rounded hover:bg-[#2D6A4F] transition"
                  >
                    {lang === "en" ? "To Telugu" : "To English"}
                  </button>
                </div>

                {/* Status indicator */}
                <div className="h-9 w-9 bg-slate-50 border border-slate-200 rounded-full flex items-center justify-center relative">
                  <span className="absolute top-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-white" />
                  🌱
                </div>
              </div>
            </header>

            {/* INNER DYNAMIC TAB DISPLAY AREA */}
            <div className="flex-1 p-6 space-y-6">
              {/* Spinner loader indicator overlay (Humble & Responsive) */}
              {loading && (
                <div className="bg-[#95D5B2]/20 border border-emerald-400 px-4 py-3 rounded-2xl flex items-center gap-3 animate-pulse">
                  <RefreshCw className="text-emerald-800 animate-spin" size={16} />
                  <p className="text-xs font-medium text-emerald-950">
                    {lang === "en" ? "EcoFriend AI performing botanical calculations..." : "ఏకోఫ్రెండ్ తోటపని సమాచారాన్ని సేకరిస్తోంది..."}
                  </p>
                </div>
              )}

              {/* OVERVIEW STATUS DASHBOARD */}
              {activeTab === "dashboard" && (
                <div className="space-y-6 animate-fade-in">
                  {/* Greeting dashboard panel */}
                  <div className="relative rounded-3xl overflow-hidden shadow-sm aspect-[3/1] md:aspect-[5/1] bg-emerald-950 text-white min-h-[140px] flex items-center p-6 md:p-8">
                    <img
                      src="/src/assets/images/eco_hero_banner_1779541933908.png"
                      alt="Banner"
                      className="absolute inset-0 w-full h-full object-cover opacity-35"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#1B4332] via-[#2A5E3F]/90 to-transparent" />
                    
                    <div className="relative z-10 space-y-1">
                      <h3 className="text-xl md:text-2xl font-extrabold text-white">
                        {lang === "en" ? `Namaste, ${user.name}! 🧑‍🌾` : `నమస్తే, ${user.name}! 🧑‍🌾`}
                      </h3>
                      <p className="text-sm text-emerald-200 font-medium">
                        {lang === "en" ? "Welcome back! Your micro-greenhouse is stable today." : "తిరిగి స్వాగతం! మీ కుండీల వాతావరణం ఈరోజు అనుకూలంగా ఉంది."}
                      </p>
                      <p className="text-[10px] text-emerald-300 tracking-wider font-mono font-bold uppercase pt-1">
                        {lang === "en" ? "LOCATION APPLIED: STATE OF COGNITIVE BOTANY" : "ప్రాంతం: స్థానిక పర్యావరణ ల్యాబ్"}
                      </p>
                    </div>
                  </div>

                  {/* QUICK STATS REVIEWS */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white/90 p-5 rounded-2xl border border-emerald-100 flex items-center gap-4">
                      <div className="w-11 h-11 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-lg shrink-0">
                        🪴
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                          {lang === "en" ? "Monitored Pots" : "పర్యవేక్షణలో ఉన్న మొక్కలు"}
                        </p>
                        <p className="text-base font-bold text-[#1B4332]">
                          Tulsi, Marigold, Tomato
                        </p>
                      </div>
                    </div>

                    <div className="bg-white/90 p-5 rounded-2xl border border-emerald-100 flex items-center gap-4">
                      <div className="w-11 h-11 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-lg shrink-0">
                        🧪
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                          {lang === "en" ? "Average Level" : "సగటు సారాంశం"}
                        </p>
                        <p className="text-base font-bold text-[#1B4332]">
                          {lang === "en" ? "Medium Fertile Loamy" : "మధ్యస్థ సారవంతమైన బంకమట్టి"}
                        </p>
                      </div>
                    </div>

                    <div className="bg-white/90 p-5 rounded-2xl border border-emerald-100 flex items-center gap-4">
                      <div className="w-11 h-11 rounded-full bg-[#B7E4C7] text-emerald-950 flex items-center justify-center text-lg shrink-0">
                        ⚡
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-bold text-[#1B4332] tracking-wider">
                          {lang === "en" ? "System Core" : "సిస్టమ్ కోర్"}
                        </p>
                        <p className="text-base font-bold text-[#1B4332]">
                          Bilingual Active
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* FEATURE GRID ACCELERATION CARDS */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-[#2D6A4F] border-b border-[#B7E4C7]/40 pb-1.5 flex items-center gap-2">
                      <Sprout size={14} />
                      <span>{lang === "en" ? "Smart Interactive Features" : "స్మార్ట్ తోటపని సాధనాలు"}</span>
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                      {/* CARD 1: Plant Recommendation */}
                      <div
                        onClick={() => setActiveTab("recommendation")}
                        className="glass-card bg-white hover:bg-[#F2FAF5] p-5 rounded-2xl border border-[#B7E4C7] shadow-sm hover:shadow transition relative cursor-pointer group"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <span className="text-2xl">🌱</span>
                          <span className="text-[9px] bg-[#B7E4C7] text-[#1B4332] font-mono tracking-widest px-2 py-0.5 rounded font-bold uppercase">
                            Recommend
                          </span>
                        </div>
                        <h3 className="font-bold text-sm text-[#1B4332] group-hover:text-emerald-800 transition">
                          Plant Recommendations
                        </h3>
                        <p className="text-xs text-[#2D6A4F] font-telugu italic mt-0.5">మొక్కల ఎంపికల మార్గదర్శనం</p>
                        <p className="text-xs text-[#40916C] mt-2 leading-relaxed">
                          {lang === "en"
                            ? "Get climate & soil-compatible plant species suggestions using Gemini AI."
                            : "మీ ప్రాంత వాతావరణం మరియు ఎండకు తగిన మొక్కల సిఫార్సులు కనుగొనండి."}
                        </p>
                        <span className="absolute bottom-4 right-4 text-emerald-800 hover:underline text-xs font-bold leading-none">
                          ➜
                        </span>
                      </div>

                      {/* CARD 2: Soil Guidance */}
                      <div
                        onClick={() => setActiveTab("soil")}
                        className="glass-card bg-white hover:bg-[#F2FAF5] p-5 rounded-2xl border border-[#B7E4C7] shadow-sm hover:shadow transition relative cursor-pointer group"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <span className="text-2xl">🧪</span>
                          <span className="text-[9px] bg-[#B7E4C7] text-[#1B4332] font-mono tracking-widest px-2 py-0.5 rounded font-bold uppercase">
                            Fertilizer
                          </span>
                        </div>
                        <h3 className="font-bold text-sm text-[#1B4332] group-hover:text-emerald-800 transition">
                          Soil Guidance
                        </h3>
                        <p className="text-xs text-[#2D6A4F] font-telugu italic mt-0.5">మట్టి సంరక్షణ పద్ధతులు</p>
                        <p className="text-xs text-[#40916C] mt-2 leading-relaxed">
                          {lang === "en"
                            ? "Analyze soil fertility rating and suggest natural organic compost teas."
                            : "మీ మట్టి సారవంతతను పెంచే సహజ సేంద్రియ ఎరువులు కనుగొనండి."}
                        </p>
                        <span className="absolute bottom-4 right-4 text-emerald-800 hover:underline text-xs font-bold leading-none">
                          ➜
                        </span>
                      </div>

                      {/* CARD 3: Water Prediction */}
                      <div
                        onClick={() => setActiveTab("water")}
                        className="glass-card bg-white hover:bg-[#F2FAF5] p-5 rounded-2xl border border-[#B7E4C7] shadow-sm hover:shadow transition relative cursor-pointer group"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <span className="text-2xl">💧</span>
                          <span className="text-[9px] bg-sky-100 text-sky-800 font-mono tracking-widest px-2 py-0.5 rounded font-bold uppercase">
                            Volume ml
                          </span>
                        </div>
                        <h3 className="font-bold text-sm text-[#1B4332] group-hover:text-emerald-800 transition">
                          Water Prediction
                        </h3>
                        <p className="text-xs text-[#2D6A4F] font-telugu italic mt-0.5">నీటి పరిమాణ అంచనా</p>
                        <p className="text-xs text-[#40916C] mt-2 leading-relaxed">
                          {lang === "en"
                            ? "Get precise milliliters target for consistent early morning irrigation loops."
                            : "మొక్కల కోసం ఖచ్చితమైన నీటి పరిమాణం మరియు స్ప్రే సమయం తెలుసుకోండి."}
                        </p>
                        <span className="absolute bottom-4 right-4 text-emerald-800 hover:underline text-xs font-bold leading-none">
                          ➜
                        </span>
                      </div>

                      {/* CARD 4: Climate Suitability */}
                      <div
                        onClick={() => setActiveTab("climate")}
                        className="glass-card bg-white hover:bg-[#F2FAF5] p-5 rounded-2xl border border-[#B7E4C7] shadow-sm hover:shadow transition relative cursor-pointer group"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <span className="text-2xl">🌤️</span>
                          <span className="text-[9px] bg-orange-100 text-orange-800 font-mono tracking-widest px-2 py-0.5 rounded font-bold uppercase">
                            Analysis
                          </span>
                        </div>
                        <h3 className="font-bold text-sm text-[#1B4332] group-hover:text-emerald-800 transition">
                          Climate Suitability
                        </h3>
                        <p className="text-xs text-[#2D6A4F] font-telugu italic mt-0.5">శీతోష్ణస్థితి విశ్లేషణ</p>
                        <p className="text-xs text-[#40916C] mt-2 leading-relaxed">
                          {lang === "en"
                            ? "Check suitability metric scores out of 100 on local heating trends."
                            : "ప్రస్తుత ఉష్ణోగ్రతలకు ఏ మొక్కలు బాగా పెరుగుతాయో అంచనా వేయండి."}
                        </p>
                        <span className="absolute bottom-4 right-4 text-emerald-800 hover:underline text-xs font-bold leading-none">
                          ➜
                        </span>
                      </div>

                      {/* CARD 5: Leaf Diseasevision */}
                      <div
                        onClick={() => setActiveTab("disease")}
                        className="glass-card bg-white hover:bg-[#F2FAF5] p-5 rounded-2xl border border-[#B7E4C7] shadow-sm hover:shadow transition relative cursor-pointer group"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <span className="text-2xl">🔍</span>
                          <span className="text-[9px] bg-red-100 text-red-800 font-mono tracking-widest px-2 py-0.5 rounded font-bold uppercase">
                            Vision AI
                          </span>
                        </div>
                        <h3 className="font-bold text-sm text-[#1B4332] group-hover:text-emerald-800 transition">
                          Disease Vision Detection
                        </h3>
                        <p className="text-xs text-[#2D6A4F] font-telugu italic mt-0.5">తెగుళ్లు గుర్తింపు</p>
                        <p className="text-xs text-[#40916C] mt-2 leading-relaxed">
                          {lang === "en"
                            ? "Upload actual leaf photo scans to isolate fungal blights automatically."
                            : "ఆకులపై వచ్చే పల్లాకు తెగులు, బూడిద తెగులు వంటి గుర్తులు స్కాన్ చేయండి."}
                        </p>
                        <span className="absolute bottom-4 right-4 text-emerald-800 hover:underline text-xs font-bold leading-none">
                          ➜
                        </span>
                      </div>

                      {/* CARD 6: Interactive Growth */}
                      <div
                        onClick={() => setActiveTab("growth")}
                        className="glass-card bg-white hover:bg-[#F2FAF5] p-5 rounded-2xl border border-[#B7E4C7] shadow-sm hover:shadow transition relative cursor-pointer group"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <span className="text-2xl">📈</span>
                          <span className="text-[9px] bg-emerald-100 text-emerald-800 font-mono tracking-widest px-2 py-0.5 rounded font-bold uppercase">
                            Yield Forecast
                          </span>
                        </div>
                        <h3 className="font-bold text-sm text-[#1B4332] group-hover:text-emerald-800 transition">
                          Growth yield Predictor
                        </h3>
                        <p className="text-xs text-[#2D6A4F] font-telugu italic mt-0.5">మొక్కల ఎదుగుదల అంచనాలు</p>
                        <p className="text-xs text-[#40916C] mt-2 leading-relaxed">
                          {lang === "en"
                            ? "View estimated harvest days & organic weight produce milestones."
                            : "సేంద్రియ పంట దిగుబడి మరియు మైలురాళ్లు రేఖాచిత్రంతో తెలుసుకోండి."}
                        </p>
                        <span className="absolute bottom-4 right-4 text-emerald-800 hover:underline text-xs font-bold leading-none">
                          ➜
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* DAILY BOTANICAL TIP BANNER */}
                  <div className="bg-emerald-100/50 p-6 rounded-3xl border border-emerald-200/50 flex flex-col md:flex-row items-center gap-4">
                    <span className="text-4xl">🪴</span>
                    <div>
                      <p className="text-xs font-extrabold text-emerald-800 uppercase tracking-wider">
                        {lang === "en" ? "EcoFriend Tip of the Day" : "నేటి సేంద్రియ తోటపని చిట్కా"}
                      </p>
                      <p className="text-sm mt-1 font-semibold">
                        {lang === "en"
                          ? "Avoid watering leaves during evening humidity. Wet leaves harbor fungi overnight."
                          : "సాయంత్రపు వేళల్లో మొక్కల ఆకులపై నీరు చల్లకుండా కేవలం మొదళ్ళ వద్దనే పోయండి."}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* FEATURE 1: PLANT RECOMMENDATION SECTION */}
              {activeTab === "recommendation" && (
                <div className="space-y-6 animate-fade-in bg-white p-6 rounded-3xl border border-emerald-100 shadow-sm">
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold">
                      {lang === "en" ? "🌱 Smart Plant Recommendation" : "🌱 పంటల సిఫార్సు విధానం"}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {lang === "en" ? "Suggest optimal botanical varieties matching sunlight & soil values." : "మీ ప్రాంతపు నేల మరియు నీటి వసతికి సరిపడే ఉత్తమ మొక్కలను ఎంపిక చేసుకోండి."}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-[#F0F4EF]/50 p-4 rounded-2xl border border-emerald-100">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-emerald-950 uppercase block">{lang === "en" ? "Climate" : "శీతోష్ణస్థితి"}</label>
                      <select
                        value={recInputs.climate}
                        onChange={(e) => setRecInputs({ ...recInputs, climate: e.target.value })}
                        id="rec-climate"
                        className="w-full bg-white border border-[#B7E4C7] rounded-lg p-2 text-xs outline-none focus:ring-1 focus:ring-emerald-400"
                      >
                        <option value="Tropical">Tropical Rain (ఉష్ణమండల)</option>
                        <option value="Dry Arid">Dry Arid (పొడి ఎడారి వాతావరణం)</option>
                        <option value="Temperate">Temperate (మధ్యస్థ శీతల వాతావరణం)</option>
                        <option value="High Humid">Coastal / Humid (సముద్ర తీరప్రాంతం)</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-emerald-950 uppercase block">{lang === "en" ? "Sunlight Exposure" : "సూర్యరశ్మి"}</label>
                      <select
                        value={recInputs.sunlight}
                        onChange={(e) => setRecInputs({ ...recInputs, sunlight: e.target.value })}
                        id="rec-sunlight"
                        className="w-full bg-white border border-[#B7E4C7] rounded-lg p-2 text-xs outline-none focus:ring-1 focus:ring-emerald-400"
                      >
                        <option value="Full Sun">Full Sun (6+ hrs ఎండ)</option>
                        <option value="Partial Shade">Partial Shade (తక్కువ ఎండ)</option>
                        <option value="Deep Shade">Deep Shade (పూర్తి నీడ)</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-emerald-950 uppercase block">{lang === "en" ? "Soil Texture" : "నేల రకం"}</label>
                      <select
                        value={recInputs.soilType}
                        onChange={(e) => setRecInputs({ ...recInputs, soilType: e.target.value })}
                        id="rec-soil"
                        className="w-full bg-white border border-[#B7E4C7] rounded-lg p-2 text-xs outline-none focus:ring-1 focus:ring-emerald-400"
                      >
                        <option value="Loamy">Loamy Moist Soil (నల్లరేగడి మట్టి)</option>
                        <option value="Clayey">Clayey Dense (బంకమట్టి)</option>
                        <option value="Sandy">Sandy Loam (ఇసుక నేల)</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-[#1B4332] uppercase block">{lang === "en" ? "Watering Capacity" : "నీటి సరఫరా"}</label>
                      <select
                        value={recInputs.water}
                        onChange={(e) => setRecInputs({ ...recInputs, water: e.target.value })}
                        id="rec-water"
                        className="w-full bg-white border border-[#B7E4C7] rounded-lg p-2 text-xs outline-none focus:ring-1 focus:ring-emerald-400"
                      >
                        <option value="Moderate">Moderate (మధ్యస్థ నీరు)</option>
                        <option value="High Frequency">Daily Abundant (ఎక్కువ సాగు నీరు)</option>
                        <option value="Low/Drought Resistant">Extremely Dry Rainfed (వర్షాధారం)</option>
                      </select>
                    </div>
                  </div>

                  <button
                    onClick={fetchRecommendations}
                    id="recommend-submit-btn"
                    className="w-full md:w-auto py-2.5 px-6 bg-[#1B4332] text-[#B7E4C7] font-bold text-xs rounded-xl shadow hover:bg-[#2D6A4F] hover:shadow-md transition"
                  >
                    {lang === "en" ? "Analyze Compatibility Checklist" : "సిఫార్సులను సేకరించు"}
                  </button>

                  {/* Recommendations response display */}
                  {recResults.length > 0 && (
                    <div className="space-y-4 pt-4">
                      <p className="text-xs font-bold text-emerald-900 uppercase tracking-widest">
                        {lang === "en" ? "Gemini Recommendation Results" : "జెమిని ప్రతిపాదించిన సిఫార్సులు"}
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {recResults.map((plant, index) => (
                          <div key={index} className="bg-[#F0F4EF] p-5 rounded-2xl border border-emerald-100/60 flex flex-col justify-between">
                            <div>
                              <div className="flex justify-between items-start mb-2">
                                <span className="bg-emerald-800 text-emerald-100 text-[9px] px-2 py-0.5 rounded-full font-bold">
                                  {plant.growthTime}
                                </span>
                                <button
                                  onClick={() => speakText(lang === "te" ? plant.teluguDescription : plant.description)}
                                  className="text-emerald-700 hover:text-emerald-900"
                                  title="Speak"
                                >
                                  🔊
                                </button>
                              </div>
                              <h4 className="font-extrabold text-base text-[#1B4332]">
                                {plant.name}
                              </h4>
                              <p className="text-xs text-slate-500 font-telugu font-bold mb-3">{plant.teluguName}</p>
                              
                              <div className="space-y-2 mb-4 border-l-2 border-emerald-500 pl-2">
                                <p className="text-xs text-slate-700 leading-relaxed font-semibold">
                                  {plant.description}
                                </p>
                                <p className="text-xs text-emerald-800 font-medium font-telugu leading-relaxed bg-emerald-50/40 p-1.5 rounded">
                                  {plant.teluguDescription}
                                </p>
                              </div>

                              <div className="space-y-1 text-[11px] bg-white p-3 rounded-xl border border-emerald-50 mb-3">
                                <p><strong>Sun:</strong> {plant.sunlightRequired}</p>
                                <p><strong>Soil:</strong> {plant.soilRequired}</p>
                                <p><strong>Water:</strong> {plant.waterRequired}</p>
                              </div>

                              <div className="space-y-2">
                                <p className="text-[10px] font-bold text-[#1B4332] uppercase tracking-wider">
                                  📋 Planting Tips / నాటడానికి చిట్కాలు
                                </p>
                                <div className="grid grid-cols-1 gap-2">
                                  <div className="bg-white p-2 text-xs text-slate-600 rounded-lg border border-slate-100">
                                    <p className="text-[9px] uppercase tracking-wider font-bold text-slate-400 mb-1">English Tips</p>
                                    <ul className="list-disc pl-4 space-y-0.5">
                                      {plant.careTips.map((tip, tIdx) => (
                                        <li key={tIdx}>{tip}</li>
                                      ))}
                                    </ul>
                                  </div>
                                  {plant.careTipsTelugu && plant.careTipsTelugu.length > 0 && (
                                    <div className="bg-emerald-50/20 p-2 text-xs text-slate-700 rounded-lg border border-emerald-100/30">
                                      <p className="text-[9px] uppercase tracking-wider font-bold text-emerald-700 mb-1">తెలుగు చిట్కాలు</p>
                                      <ul className="list-disc pl-4 space-y-0.5 font-telugu">
                                        {plant.careTipsTelugu.map((tip, tIdx) => (
                                          <li key={tIdx}>{tip}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* FEATURE 2: SOIL GUIDANCE METHOD */}
              {activeTab === "soil" && (
                <div className="space-y-6 animate-fade-in bg-white p-6 rounded-3xl border border-emerald-100 shadow-sm">
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold">
                      {lang === "en" ? "🪴 Soil Guidance & fertility Recipes" : "🪴 మట్టి మార్గదర్శకత్వం & ఎరువులు"}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {lang === "en" ? "Analyze clay parameters and organic nitrogen boosters." : "అవసరమైన సూక్ష్మ పోషకాలు సంబందించిన నివేదికలను సృష్టించండి."}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3 bg-[#F0F4EF]/40 p-5 rounded-2xl border border-emerald-100">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-[#1B4332] uppercase block">
                          {lang === "en" ? "Soil Texture type" : "నేల లక్షణ రకం"}
                        </label>
                        <select
                          value={soilInputs.soilType}
                          onChange={(e) => setSoilInputs({ ...soilInputs, soilType: e.target.value })}
                          id="soil-type-select"
                          className="w-full bg-white border border-[#B7E4C7] rounded-lg p-2 text-xs outline-none focus:ring-1 focus:ring-emerald-400"
                        >
                          <option value="Loamy">Rich Loamy Compost (నల్లరేగడి నేల)</option>
                          <option value="Clayey">Sticky Hard Clayey (బంకమట్టి)</option>
                          <option value="Sandy">Loose Sandy Desert (ఇసుక నేల)</option>
                          <option value="Red Soil">Mineral Red Iron Soil (ఎర్ర నేల)</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-[#1B4332] uppercase block">
                          {lang === "en" ? "Current Soil Visual State" : "ప్రస్తుత మట్టి దృశ్య రూపం"}
                        </label>
                        <input
                          type="text"
                          value={soilInputs.currentCondition}
                          onChange={(e) => setSoilInputs({ ...soilInputs, currentCondition: e.target.value })}
                          placeholder={lang === "en" ? "e.g. Dry, hard grey chunks, low compost content" : "ఉదా. బాగా ఎండిపోయి గట్టిగా ఉంది"}
                          id="soil-condition-input"
                          className="w-full bg-white border border-[#B7E4C7] rounded-lg p-2 text-xs outline-none focus:ring-1 focus:ring-emerald-400"
                        />
                      </div>

                      <button
                        onClick={fetchSoilGuidance}
                        id="soil-guidance-btn"
                        className="w-full py-2.5 bg-[#1B4332] text-white rounded-xl text-xs font-bold hover:bg-[#2D6A4F] transition"
                      >
                        {lang === "en" ? "Analyze Fertility Recipe" : "సేంద్రియ విధానం కనుగొను"}
                      </button>
                    </div>

                    {soilResult && (
                      <div className="p-5 bg-emerald-50/50 rounded-2xl border border-emerald-100 space-y-4">
                        <div className="flex justify-between items-center">
                          <p className="text-xs font-bold text-[#1B4332] uppercase">
                            {lang === "en" ? "Soil Diagnostics" : "మట్టి పోషక అవలోకనము"}
                          </p>
                          <span className="text-xs font-bold bg-[#B7E4C7] px-2.5 py-1 rounded text-emerald-950">
                            {soilResult.fertilityRating}
                          </span>
                        </div>

                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                            {lang === "en" ? "Recommended High-yield crops" : "సిఫార్సు చేయదగిన ఉత్తమ మొలకలు"}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {soilResult.bestCrops.map((crop, i) => (
                              <span key={i} className="text-xs bg-white px-3 py-1 rounded-full border border-emerald-100 font-medium text-emerald-900">
                                {crop}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                            Compost suggestions / సేంద్రియ ఎరువుల చిట్కాలు
                          </p>
                          <div className="space-y-3 bg-white p-3 rounded-xl border border-emerald-50">
                            <div>
                              <p className="text-[9px] uppercase tracking-wider font-bold text-slate-400 mb-1">English suggestions</p>
                              <ul className="list-disc pl-4 text-xs text-slate-700 space-y-1">
                                {soilResult.compostSuggestions.map((step, idx) => (
                                  <li key={idx} className="leading-normal">{step}</li>
                                ))}
                              </ul>
                            </div>
                            {soilResult.compostSuggestionsTelugu && soilResult.compostSuggestionsTelugu.length > 0 && (
                              <div className="border-t border-dashed border-emerald-100 pt-2 font-telugu">
                                <p className="text-[9px] uppercase tracking-wider font-bold text-emerald-700 mb-1">తెలుగు చిట్కాలు</p>
                                <ul className="list-disc pl-4 text-xs text-slate-800 space-y-1">
                                  {soilResult.compostSuggestionsTelugu.map((step, idx) => (
                                    <li key={idx} className="leading-normal">{step}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                            Soil Tilling advice / మట్టిని దున్నడానికి/గుల్ల చేయడానికి చిట్కా
                          </p>
                          <div className="space-y-3 bg-white p-3 rounded-xl border border-emerald-50">
                            <div>
                              <p className="text-[9px] uppercase tracking-wider font-bold text-slate-400 mb-1">English advice</p>
                              <ul className="list-disc pl-4 text-xs text-slate-700 space-y-1">
                                {soilResult.fertilityTips.map((tip, idx) => (
                                  <li key={idx}>{tip}</li>
                                ))}
                              </ul>
                            </div>
                            {soilResult.fertilityTipsTelugu && soilResult.fertilityTipsTelugu.length > 0 && (
                              <div className="border-t border-dashed border-emerald-100 pt-2 font-telugu">
                                <p className="text-[9px] uppercase tracking-wider font-bold text-emerald-700 mb-1">తెలుగు చిట్కాలు</p>
                                <ul className="list-disc pl-4 text-xs text-slate-800 space-y-1">
                                  {soilResult.fertilityTipsTelugu.map((tip, idx) => (
                                    <li key={idx}>{tip}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* FEATURE 3: WATER QUANTITY PREDICTION SECTION */}
              {activeTab === "water" && (
                <div className="space-y-6 animate-fade-in bg-white p-6 rounded-3xl border border-emerald-100 shadow-sm">
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold">
                      {lang === "en" ? "💧 Water Quantity Prediction Engine" : "💧 నీటి పరిమాణ ఖచ్చితమైన అంచనా"}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {lang === "en" ? "Calculate the precise amount of water in ml to maintain balanced soil humidity." : "అధిక నీటివల్ల కుళ్లుడు తెగులు సోకకుండా వేర్లకు సరిపడు మిల్లీలీటర్ల తాజా నీటిని అంచనా వేయండి."}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-3 bg-[#F0F4EF]/40 p-5 rounded-2xl border border-emerald-100">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-emerald-950 block">{lang === "en" ? "Target Crop / Plant Name" : "మొక్క లేదా ఆకుకూర పేరు"}</label>
                        <input
                          type="text"
                          value={waterInputs.plantName}
                          onChange={(e) => setWaterInputs({ ...waterInputs, plantName: e.target.value })}
                          placeholder="e.g. Green Chilli, Brinjal, Mint"
                          id="water-plant-input"
                          className="w-full bg-white border border-[#B7E4C7] rounded-lg p-2 text-xs outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-emerald-950 block">{lang === "en" ? "Current Temperature (°C)" : "ప్రస్తుత ఉష్ణోగ్రత (°C)"}</label>
                          <input
                            type="number"
                            value={waterInputs.temperature}
                            onChange={(e) => setWaterInputs({ ...waterInputs, temperature: e.target.value })}
                            id="water-temp-input"
                            className="w-full bg-white border border-[#B7E4C7] rounded-lg p-2 text-xs outline-none"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-emerald-950 block">{lang === "en" ? "Growth Phase" : "మొక్క పెరుగుదల దశ"}</label>
                          <select
                            value={waterInputs.stage}
                            onChange={(e) => setWaterInputs({ ...waterInputs, stage: e.target.value })}
                            id="water-stage-select"
                            className="w-full bg-white border border-[#B7E4C7] rounded-lg p-2 text-xs outline-none"
                          >
                            <option value="Germinating Seed">Germinating Seedling (నారు దశ)</option>
                            <option value="Vegetative">Vegetative green stems (శాఖీయ ఎదుగుదల దశ)</option>
                            <option value="Flowering">Flowering Budding (పూత మరియు కాయ దశ)</option>
                          </select>
                        </div>
                      </div>

                      <button
                        onClick={fetchWaterPrediction}
                        id="water-prediction-btn"
                        className="w-full py-2.5 bg-[#1B4332] text-white rounded-xl text-xs font-bold hover:bg-[#2D6A4F] transition"
                      >
                        {lang === "en" ? "Calculate Required Volume" : "నీటి కొలతను లెక్కించు"}
                      </button>
                    </div>

                    {waterResult && (
                      <div className="p-5 bg-emerald-50/50 rounded-2xl border border-[#B7E4C7] space-y-4">
                        <div className="text-center bg-[#1B4332] text-white py-4 rounded-xl shadow-sm">
                          <p className="text-[10px] uppercase font-bold text-emerald-300 tracking-wider">
                            {lang === "en" ? "Calculated Daily Dosage" : "రోజువారీ నీటి పరిమాణం"}
                          </p>
                          <p className="text-2xl font-black text-white mt-1">
                            {waterResult.dailyRequirement}
                          </p>
                          <p className="text-xs text-emerald-100 font-medium">
                            {waterResult.wateringFrequency}
                          </p>
                        </div>

                        <div className="space-y-1 bg-white p-3 rounded-xl border border-emerald-50">
                          <p className="text-[10px] font-bold text-[#1B4332] uppercase">
                            Preferred Irrigation Mode / నీటి పారుదల రకం
                          </p>
                          <p className="text-xs font-semibold text-emerald-950">
                            {waterResult.irrigationType} <span className="mx-1 text-slate-300">|</span> <span className="font-telugu text-emerald-800 font-bold">{waterResult.irrigationTypeTelugu}</span>
                          </p>
                        </div>

                        <div className="space-y-2">
                          <p className="text-[10px] font-bold text-slate-500 uppercase">
                            Watering Precautions / నీరు పోసేటప్పుడు పాటివలసిన సూత్రాలు
                          </p>
                          <div className="grid grid-cols-1 gap-2">
                            <div className="bg-white p-2.5 rounded-lg border border-slate-100">
                              <p className="text-[9px] uppercase tracking-wider font-bold text-slate-400 mb-1">English Tips</p>
                              <ul className="list-disc pl-4 text-xs text-slate-700 space-y-0.5">
                                {waterResult.tips.map((tip, idx) => (
                                  <li key={idx}>{tip}</li>
                                ))}
                              </ul>
                            </div>
                            {waterResult.tipsTelugu && waterResult.tipsTelugu.length > 0 && (
                              <div className="bg-emerald-50/25 p-2.5 rounded-lg border border-emerald-100/30 font-telugu">
                                <p className="text-[9px] uppercase tracking-wider font-bold text-emerald-700 mb-1">తెలుగు చిట్కాలు</p>
                                <ul className="list-disc pl-4 text-xs text-[#1B4332] space-y-0.5">
                                  {waterResult.tipsTelugu.map((tip, idx) => (
                                    <li key={idx}>{tip}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* FEATURE 4: CLIMATE SUITABILITY */}
              {activeTab === "climate" && (
                <div className="space-y-6 animate-fade-in bg-white p-6 rounded-3xl border border-emerald-100 shadow-sm">
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold">
                      {lang === "en" ? "🌤️ Climate Suitability Calculator" : "🌤️ వాతావరణ అనుకూలత విలేఖరి"}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {lang === "en" ? "Input summer temperature trends to check botanical compatibility score." : "వేసవి ఎండ తీవ్రత లేదా వర్షపాతాన్ని నమోదు చేసి మీ పంట వృద్ధి సాధ్యపడుతుందో లేదో సరిచూసుకోండి."}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-3 bg-[#F0F4EF]/40 p-5 rounded-2xl border border-emerald-100">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-emerald-950 block">{lang === "en" ? "Crop Name" : "పంట పేరు"}</label>
                        <input
                          type="text"
                          value={climateInputs.plantName}
                          onChange={(e) => setClimateInputs({ ...climateInputs, plantName: e.target.value })}
                          placeholder="e.g. Hibiscus, Spinach"
                          id="climate-plant-input"
                          className="w-full bg-white border border-[#B7E4C7] rounded-lg p-2 text-xs outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-emerald-950 block">{lang === "en" ? "State / Region Name" : "పాఠశాల గ్రీన్ ల్యాబ్ ఉండే ప్రాంతం"}</label>
                        <input
                          type="text"
                          value={climateInputs.location}
                          onChange={(e) => setClimateInputs({ ...climateInputs, location: e.target.value })}
                          placeholder="Andhra Pradesh"
                          id="climate-location-input"
                          className="w-full bg-white border border-[#B7E4C7] rounded-lg p-2 text-xs outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-emerald-950 block">{lang === "en" ? "Local Temp (°C)" : "ఉష్ణోగ్రత (°C)"}</label>
                          <input
                            type="number"
                            value={climateInputs.temperature}
                            onChange={(e) => setClimateInputs({ ...climateInputs, temperature: e.target.value })}
                            id="climate-temp-input"
                            className="w-full bg-white border border-[#B7E4C7] rounded-lg p-2 text-xs outline-none"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-emerald-950 block">{lang === "en" ? "Estimated Humidity (%)" : "తేమ శాతము (%)"}</label>
                          <input
                            type="number"
                            value={climateInputs.humidity}
                            onChange={(e) => setClimateInputs({ ...climateInputs, humidity: e.target.value })}
                            id="climate-humidity-input"
                            className="w-full bg-white border border-[#B7E4C7] rounded-lg p-2 text-xs outline-none"
                          />
                        </div>
                      </div>

                      <button
                        onClick={fetchClimateSuitability}
                        id="climate-guidance-btn"
                        className="w-full py-2.5 bg-[#1B4332] text-white rounded-xl text-xs font-bold hover:bg-[#2D6A4F] transition"
                      >
                        {lang === "en" ? "Analyze Climate Viability" : "వాతావరణ సరిపోలికను లెక్కించు"}
                      </button>
                    </div>

                    {climateResult && (
                      <div className="p-5 bg-emerald-50/50 rounded-2xl border border-emerald-100 space-y-4">
                        <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-emerald-100">
                          <div>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                              {lang === "en" ? "Viability Match" : "వృద్ధి చెందే సామర్థ్యం"}
                            </p>
                            <p className="text-xl font-bold text-emerald-900 font-mono">
                              {climateResult.suitabilityScore} / 100
                            </p>
                          </div>
                          <span
                            className={`px-3 py-1 rounded text-xs font-bold ${
                              climateResult.isSuitable ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"
                            }`}
                          >
                            {climateResult.isSuitable
                              ? (lang === "en" ? "Fully Suitable" : "చాలా అనుకూలం")
                              : (lang === "en" ? "Challenging" : "అనుకూలం కాదు")}
                          </span>
                        </div>

                        <div className="space-y-1">
                          <p className="text-[10px] font-bold text-[#1B4332] uppercase">
                            Gemini Botanical Analysis / జెమిని పంటల పరిశోధన విశ్లేషణ
                          </p>
                          <div className="text-xs text-slate-700 leading-normal bg-white p-3 rounded-xl border border-emerald-50 space-y-2">
                            <p className="font-semibold">{climateResult.analysis}</p>
                            <p className="border-t border-dashed border-emerald-100 pt-2 font-telugu text-emerald-800">{climateResult.analysisTelugu}</p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <p className="text-[10px] font-bold text-slate-500 uppercase">
                            Protective actions to establish / మొక్కను కాపాడుకోవడానికి అవసరమైన నియమాలు
                          </p>
                          <div className="grid grid-cols-1 gap-2">
                            <div className="bg-white p-2.5 rounded-lg border border-slate-100">
                              <p className="text-[9px] uppercase tracking-wider font-bold text-slate-400 mb-1">English Precautions</p>
                              <ul className="list-disc pl-4 text-xs text-slate-700 space-y-0.5">
                                {climateResult.precautions.map((step, idx) => (
                                  <li key={idx}>{step}</li>
                                ))}
                              </ul>
                            </div>
                            {climateResult.precautionsTelugu && climateResult.precautionsTelugu.length > 0 && (
                              <div className="bg-emerald-50/25 p-2.5 rounded-lg border border-emerald-100/30 font-telugu">
                                <p className="text-[9px] uppercase tracking-wider font-bold text-emerald-700 mb-1">తెలుగు నివారణ చర్యలు</p>
                                <ul className="list-disc pl-4 text-xs text-[#1B4332] space-y-0.5">
                                  {climateResult.precautionsTelugu.map((step, idx) => (
                                    <li key={idx}>{step}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* FEATURE 5: BOTANICAL LEAF DISEASE EYE DETECTION (VISION AI) */}
              {activeTab === "disease" && (
                <div className="space-y-6 animate-fade-in bg-white p-6 rounded-3xl border border-emerald-100 shadow-sm">
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold">
                      {lang === "en" ? "🍂 Leaf Disease Vision AI Detector" : "🍂 ఆకు తెగుళ్ల నివారణా పర్యవేక్షకుడు"}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {lang === "en" ? "Upload an image of a spotted/dry leaf, or select simulated school project leaf templates to isolate pathogens." : "వ్యాధి సోకిన ఆకు చిత్రాన్ని అప్‌లోడ్ చేసి లేదా మాతో ఉన్న శాంపిల్ ఆకులను క్లిక్ చేసి తెగులును నివారించండి."}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-4 bg-[#F0F4EF]/40 p-5 rounded-2xl border border-emerald-100">
                      {/* Leaf samples triggers */}
                      <div className="space-y-2">
                        <p className="text-[10px] font-bold text-emerald-950 uppercase tracking-wider block">
                          {lang === "en" ? "Quick Classroom Simulated Leaf Samples" : "తక్షణ విద్యార్థి ల్యాబ్ ఆకు నమూనాలు"}
                        </p>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => selectSampleLeaf("spots")}
                            id="leaf-spots-btn"
                            className="flex-1 py-1.5 bg-yellow-200/80 text-yellow-950 font-bold rounded-xl text-xs hover:bg-yellow-200"
                          >
                            ⚠️ Leaf spots (మచ్చలు)
                          </button>
                          <button
                            type="button"
                            onClick={() => selectSampleLeaf("mildew")}
                            id="leaf-mildew-btn"
                            className="flex-1 py-1.5 bg-slate-200 text-slate-900 font-bold rounded-xl text-xs hover:bg-slate-300"
                          >
                            ❄️ Powdery Mildew
                          </button>
                          <button
                            type="button"
                            onClick={() => selectSampleLeaf("healthy")}
                            id="leaf-healthy-btn"
                            className="flex-1 py-1.5 bg-emerald-200/80 text-emerald-950 font-bold rounded-xl text-xs hover:bg-emerald-200"
                          >
                            ✅ Healthy (ఆరోగ్యమైన)
                          </button>
                        </div>
                      </div>

                      {/* File upload drag structure */}
                      <div className="border border-dashed border-[#B7E4C7] rounded-xl p-6 text-center bg-white cursor-pointer relative hover:border-emerald-500 transition">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleDiseaseImageUpload}
                          id="leaf-file-upload"
                          className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                        <Upload size={24} className="mx-auto text-emerald-700 mb-2" />
                        <p className="text-xs font-semibold text-slate-700">
                          {lang === "en" ? "Drag & drop leaf photo, or click to choose file" : "ఆకు ఫోటోను ఇక్కడ అప్‌లోడ్ చేయండి"}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-1">
                          JPEG, PNG format supported
                        </p>
                      </div>

                      {diseaseImage && (
                        <div className="space-y-3">
                          <div className="relative h-40 bg-zinc-100 rounded-xl overflow-hidden flex items-center justify-center border border-emerald-100">
                            <img
                              src={diseaseImage}
                              alt="Uploaded leaf"
                              className="h-full object-contain"
                            />
                            <button
                              type="button"
                              onClick={() => setDiseaseImage(null)}
                              className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold"
                            >
                              ✕
                            </button>
                          </div>

                          <button
                            onClick={runDiseaseDetection}
                            id="vision-detection-btn"
                            className="w-full py-2 bg-[#1B4332] text-white rounded-xl text-xs font-bold hover:bg-[#2D6A4F] transition shadow"
                          >
                            {lang === "en" ? "Run Gemini Vision AI Isolation" : "ఆకు వ్యాధి ఏఐ విశ్లేషణను ప్రారంభించు"}
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Results of vision detection */}
                    {diseaseResult && (
                      <div className="p-5 bg-emerald-50/50 rounded-2xl border border-emerald-100 space-y-4">
                        <div className="flex justify-between items-center bg-white p-3.5 rounded-xl border border-emerald-100">
                          <div>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{lang === "en" ? "Detected Condition" : "కనుగొనబడిన తెగులు"}</p>
                            <h4 className="text-sm font-extrabold text-red-900 leading-tight">
                              {diseaseResult.detectedDisease}
                            </h4>
                            <p className="text-xs text-[#2D6A4F] font-telugu font-bold">{diseaseResult.detectedDiseaseTelugu}</p>
                          </div>
                          <span className="text-[11px] font-bold bg-amber-100 text-amber-900 px-2 py-1 rounded">
                            {diseaseResult.confidenceScore}% {lang === "en" ? "Confidence" : "ఖచ్చితత్వం"}
                          </span>
                        </div>

                        <div className="space-y-1 bg-white p-3 rounded-xl border border-emerald-50">
                          <p className="text-[10px] font-bold text-red-950 uppercase">
                            Immediate remedies / నివారణా క్రియలు (సేంద్రియ ద్రావణాలు)
                          </p>
                          <div className="space-y-3 pt-1.5">
                            <div>
                              <p className="text-[9px] uppercase tracking-wider font-bold text-slate-400 mb-1">English Remedies</p>
                              <ul className="list-disc pl-4 text-xs text-slate-700 space-y-0.5">
                                {diseaseResult.remedies.map((step, idx) => (
                                  <li key={idx}>{step}</li>
                                ))}
                              </ul>
                            </div>
                            {diseaseResult.remediesTelugu && diseaseResult.remediesTelugu.length > 0 && (
                              <div className="border-t border-dashed border-red-100 pt-2 mt-2 font-telugu">
                                <p className="text-[9px] uppercase tracking-wider font-bold text-red-700 mb-1">తెలుగు నివారణ చర్యలు</p>
                                <ul className="list-disc pl-4 text-xs text-slate-800 space-y-0.5">
                                  {diseaseResult.remediesTelugu.map((step, idx) => (
                                    <li key={idx}>{step}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="space-y-1">
                          <p className="text-[10px] font-bold text-slate-500 uppercase">
                            Future Botanical Preventions / వ్యాధి రాకుండా ముందస్తు జాగ్రత్తలు
                          </p>
                          <div className="space-y-3 bg-white p-3 rounded-xl border border-emerald-50">
                            <div>
                              <p className="text-[9px] uppercase tracking-wider font-bold text-slate-400 mb-1">English Preventions</p>
                              <ul className="list-disc pl-4 text-xs text-slate-700 space-y-0.5">
                                {diseaseResult.preventions.map((step, idx) => (
                                  <li key={idx}>{step}</li>
                                ))}
                              </ul>
                            </div>
                            {diseaseResult.preventionsTelugu && diseaseResult.preventionsTelugu.length > 0 && (
                              <div className="border-t border-dashed border-emerald-100 pt-2 mt-2 font-telugu">
                                <p className="text-[9px] uppercase tracking-wider font-bold text-emerald-700 mb-1">తెలుగు జాగ్రత్తలు</p>
                                <ul className="list-disc pl-4 text-xs text-slate-800 space-y-0.5">
                                  {diseaseResult.preventionsTelugu.map((step, idx) => (
                                    <li key={idx}>{step}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* FEATURE 6: AI CONSULTATION CHATBOT SECTION */}
              {activeTab === "chatbot" && (
                <div className="space-y-4 animate-fade-in bg-white p-6 rounded-3xl border border-emerald-100 shadow-sm flex flex-col h-[500px]">
                  <div className="shrink-0 flex justify-between items-center border-b border-emerald-100 pb-3">
                    <div>
                      <h3 className="text-base font-bold flex items-center gap-2">
                        <Bot size={18} className="text-emerald-800" />
                        <span>EcoFriend Smart Chatbot</span>
                      </h3>
                      <p className="text-[11px] text-slate-400">
                        {lang === "en" ? "Get compost recipes and watering instructions instantly." : "అవసరమైన కంపోస్ట్ ఎరువులు, నీటి యాజమాన్యం పై ప్రశ్నలు అడగండి."}
                      </p>
                    </div>

                    <button
                      onClick={() => setChatbotMessages([
                        {
                          id: "1",
                          sender: "bot",
                          text: "Messages cleared. Ask any horticulture query!",
                          textTelugu: "సందేశాలు క్లియర్ చేయబడ్డాయి. తోటపని ప్రశ్నలు అడగండి!",
                          timestamp: new Date()
                        }
                      ])}
                      className="text-[10px] text-[#2D6A4F] hover:underline"
                    >
                      {lang === "en" ? "Clear Logs" : "క్లియర్ చేయండి"}
                    </button>
                  </div>

                  {/* Messages flow */}
                  <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 py-2 select-text">
                    {chatbotMessages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex flex-col max-w-[85%] ${
                          msg.sender === "user" ? "ml-auto" : "mr-auto"
                        }`}
                      >
                        <div
                          className={`p-3.5 rounded-2xl text-xs space-y-1.5 shadow-sm leading-relaxed ${
                            msg.sender === "user"
                              ? "bg-[#1B4332] text-white rounded-tr-none"
                              : "bg-[#F0F4EF] text-[#1B4332] rounded-tl-none border border-emerald-100"
                          }`}
                        >
                          <p className="font-bold text-[9px] opacity-60 uppercase mb-0.5 tracking-wider">
                            {msg.sender === "user" ? (lang === "en" ? "You" : "మీరు") : (lang === "en" ? "Assistant" : "ఏకోఫ్రెండ్ సహాయకుడు")}
                          </p>
                          <p className="text-xs">{msg.text}</p>
                          {msg.textTelugu && (
                            <p className="text-xs font-telugu opacity-95 italic border-t border-emerald-200/40 pt-1.5 mt-1">
                              {msg.textTelugu}
                            </p>
                          )}
                        </div>
                        <span className="text-[8px] text-slate-400 mt-1 px-1 auto">
                          {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                    ))}
                    <div ref={chatBottomRef} />
                  </div>

                  {/* Recommended Quick Assistant helper pills */}
                  <div className="flex flex-wrap gap-2 shrink-0 py-1 border-t border-emerald-50 pt-2">
                    <button
                      onClick={() => handleSendChat("How to grow tulsi?")}
                      className="text-[10px] bg-emerald-50 text-emerald-950 font-bold px-3 py-1 rounded-full hover:bg-emerald-100 border border-emerald-100 transition"
                    >
                      🌱 Grow Tulsi (తులసి)
                    </button>
                    <button
                      onClick={() => handleSendChat("What is vermicompost?")}
                      className="text-[10px] bg-emerald-50 text-emerald-950 font-bold px-3 py-1 rounded-full hover:bg-emerald-100 border border-emerald-100 transition"
                    >
                      🪱 Vermicompost (వనపాముల ఎరువు)
                    </button>
                    <button
                      onClick={() => handleSendChat("Organic pest sprayer")}
                      className="text-[10px] bg-emerald-50 text-emerald-950 font-bold px-3 py-1 rounded-full hover:bg-emerald-100 border border-emerald-100 transition"
                    >
                      🦟 Bio-Insecticides (వేప సమాచారం)
                    </button>
                  </div>

                  {/* Input line structure */}
                  <div className="flex gap-2 shrink-0 mt-2">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSendChat();
                      }}
                      placeholder={lang === "en" ? "Ask Gemini anything about plants..." : "మొక్కలకు సంబందించిన ఏ సమాచారమైనా అడగండి..."}
                      id="chat-input-field"
                      className="flex-1 bg-white border border-[#B7E4C7] rounded-full px-4 py-2.5 text-xs outline-none focus:ring-1 focus:ring-emerald-400"
                    />
                    <button
                      onClick={() => handleSendChat()}
                      id="chat-send-btn"
                      className="w-10 h-10 bg-[#1B4332] hover:bg-[#2D6A4F] text-white rounded-full flex items-center justify-center shrink-0 shadow transition"
                    >
                      <Send size={14} />
                    </button>
                  </div>
                </div>
              )}

              {/* FEATURE 7: GROWTH YIELD PREDICTOR TIMELINE SECTION */}
              {activeTab === "growth" && (
                <div className="space-y-6 animate-fade-in bg-white p-6 rounded-3xl border border-emerald-100 shadow-sm">
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold">
                      {lang === "en" ? "📈 Real-Time Growth & Yield Estimator" : "📈 పంట ఎదుగుదల & దిగుబడి నివేదిక"}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {lang === "en" ? "Predict growth speed and visualize botanical milestones using mathematical models." : "మొక్క నాటిన రోజు నుండి వృద్ధి మైలురాళ్ళు మరియు తాజా దిగుబడి కిలోగ్రాములు అంచనా వేయండి."}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-3 bg-[#F0F4EF]/40 p-5 rounded-2xl border border-emerald-100">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-emerald-950 block">{lang === "en" ? "Plant Species Name" : "మొక్క రకము పేరు"}</label>
                        <input
                          type="text"
                          value={growthInputs.plantName}
                          onChange={(e) => setGrowthInputs({ ...growthInputs, plantName: e.target.value })}
                          placeholder="e.g. Marigold"
                          id="growth-plant-input"
                          className="w-full bg-white border border-[#B7E4C7] rounded-lg p-2 text-xs outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-emerald-950 block">{lang === "en" ? "Routine Care Diligence" : "సంరక్షణ సేవల తీవ్రత"}</label>
                        <select
                          value={growthInputs.careLevel}
                          onChange={(e) => setGrowthInputs({ ...growthInputs, careLevel: e.target.value })}
                          id="growth-care-select"
                          className="w-full bg-white border border-[#B7E4C7] rounded-lg p-2 text-xs outline-none"
                        >
                          <option value="High Care">High Diligent Care (ప్రతి రోజూ సంరక్షణ)</option>
                          <option value="Moderate Care">Moderate (వారానికి రెండు సార్లు తనిఖీ)</option>
                          <option value="Low Maintenance">Low / Minimal Care (కనిష్ట నీటి వసతి)</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-emerald-950 block">{lang === "en" ? "Soil Ground Quality" : "మట్టి పోషకాల స్థాయి"}</label>
                        <select
                          value={growthInputs.soilQuality}
                          onChange={(e) => setGrowthInputs({ ...growthInputs, soilQuality: e.target.value })}
                          id="growth-soil-select"
                          className="w-full bg-white border border-[#B7E4C7] rounded-lg p-2 text-xs outline-none"
                        >
                          <option value="Compost Rich">Highly Compost Rich (పూర్తి ఎరువులతో కూడిన మట్టి)</option>
                          <option value="Regular Dirt">Medium Garden soil (సాధారణ తోట మట్టి)</option>
                          <option value="Sand Clay Blend">Poor Clay Blend (ఇసుక మిశ్రమ నేల)</option>
                        </select>
                      </div>

                      <button
                        onClick={fetchGrowthPrediction}
                        id="growth-forecast-btn"
                        className="w-full py-2.5 bg-[#1B4332] text-white rounded-xl text-xs font-bold hover:bg-[#2D6A4F] transition"
                      >
                        {lang === "en" ? "Estimate Sowing Timeline" : "దిగుబడి నివేదికను రూపొందించు"}
                      </button>
                    </div>

                    {growthResult && (
                      <div className="p-5 bg-emerald-50/50 rounded-2xl border border-emerald-100 space-y-4">
                        <div className="grid grid-cols-2 gap-2 text-center">
                          <div className="bg-white p-3 rounded-xl border border-emerald-100">
                            <p className="text-[10px] text-slate-400 font-bold uppercase">{lang === "en" ? "Days to Harvest" : "పంట కాల వ్యవధి"}</p>
                            <p className="text-sm font-black text-emerald-950 mt-1">
                              {growthResult.estimatedHarvestDate}
                            </p>
                          </div>

                          <div className="bg-white p-3 rounded-xl border border-emerald-100">
                            <p className="text-[10px] text-slate-400 font-bold uppercase">Estimated Yield / అంచనా వేసిన దిగుబడి</p>
                            <p className="text-sm font-black text-emerald-950 mt-1">
                              {growthResult.yieldEstimate} <span className="mx-1 text-slate-300">|</span> <span className="font-telugu text-emerald-800 font-bold">{growthResult.yieldEstimateTelugu}</span>
                            </p>
                          </div>
                        </div>

                        {/* Milestone visualization chart lines structure */}
                        <div className="space-y-3.5 pt-2">
                          <p className="text-[10px] font-bold text-[#1B4332] uppercase tracking-wider block">
                            {lang === "en" ? "Estimated Botanical Milestones" : "అంచనా వేసిన వృద్ధి మైలురాళ్లు"}
                          </p>

                          <div className="space-y-3 relative before:absolute before:bottom-0 before:top-2 before:left-3 before:w-0.5 before:bg-[#95D5B2]">
                            {growthResult.milestones.map((milestone, idx) => (
                              <div key={idx} className="flex gap-4 relative">
                                <span className="w-6.5 h-6.5 bg-[#1B4332] border border-[#B7E4C7] rounded-full text-white flex items-center justify-center text-[10px] font-bold shrink-0 z-10">
                                  {idx + 1}
                                </span>
                                <div className="bg-white p-3.5 rounded-xl border border-emerald-50 flex-1">
                                  <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 mb-1.5">
                                    <span>{milestone.day}</span>
                                    <span className="text-emerald-800 text-right">
                                      {milestone.stage} <span className="mx-1 text-slate-300">|</span> <span className="font-telugu text-emerald-700 font-bold">{milestone.stageTelugu}</span>
                                    </span>
                                  </div>
                                  <div className="space-y-1.5">
                                    <p className="text-xs text-slate-600 font-medium leading-relaxed">
                                      {milestone.details}
                                    </p>
                                    <p className="text-xs text-emerald-800 font-medium font-telugu leading-relaxed bg-emerald-50/40 p-1 rounded border border-emerald-100/30">
                                      {milestone.detailsTelugu}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* FEATURE 8: VOICE ASSISTANT INTERACTION WITH BILINGUAL SPEAKING ACCENTS */}
              {activeTab === "voice" && (
                <div className="space-y-6 animate-fade-in bg-white p-6 rounded-3xl border border-emerald-100 shadow-sm text-center">
                  <div className="max-w-md mx-auto space-y-4">
                    <span className="text-4xl">🎙️</span>
                    <h3 className="text-lg font-bold">
                      {lang === "en" ? "Voice Assistant Simulator" : "వాయిస్ అసిస్టెంట్ సమాచార కేంద్రాన్ని సక్రియం చేయండి"}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {lang === "en"
                        ? "Speak directly to EcoFriend or use predefined voice triggers below to generate premium Telugu or English auditory speech."
                        : "ఫోన్‌తో మాట్లాడే రీతిగా వేగవంతమైన వాయిస్ డైలాగ్ చిట్కాలను క్లిక్ చేసి జెమిని తోటపని ఆడియో వినండి."}
                    </p>

                    <div className="flex flex-col items-center justify-center py-4 bg-[#F0F4EF] rounded-2xl border border-emerald-100">
                      <button
                        onClick={triggerVoiceRecognition}
                        id="voice-mic-btn"
                        className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg transition transform active:scale-95 ${
                          listening ? "bg-red-600 animate-ping" : "bg-emerald-800 hover:bg-[#2D6A4F]"
                        }`}
                      >
                        {listening ? <MicOff size={22} /> : <Mic size={22} />}
                      </button>
                      <p className="text-xs text-slate-500 mt-2 font-bold font-mono">
                        {listening ? "LISTENING ACTIVE... SPEAK NOW" : "TAP TO TALK BILINGUALLY"}
                      </p>
                    </div>

                    {isPlayingAudio && (
                      <div className="p-3 bg-emerald-50 text-emerald-950 text-xs rounded-xl flex items-center gap-2 justify-center">
                        <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
                        <span>{lang === "en" ? "Streaming Gemini Kore voice reply..." : "ఏకోఫ్రెండ్ ఆడియో సమాధానం వినిపిస్తోంది..."}</span>
                      </div>
                    )}

                    {speechError && (
                      <p className="text-[10px] text-red-700 italic">{speechError}</p>
                    )}

                    {speechText && (
                      <div className="p-4 bg-[#F0F4EF]/80 text-[#1B4332] text-xs font-mono rounded-xl border border-emerald-100 text-left">
                        <p className="font-bold text-[9px] text-[#2D6A4F] uppercase tracking-widest mb-1">
                          {lang === "en" ? "Transcribed Audio Stream" : "ఆడియో రికార్డ్ లాగ్"}
                        </p>
                        <p>{speechText}</p>
                      </div>
                    )}

                    {/* Predefined prompt helpers */}
                    <div className="space-y-2 pt-2 text-left">
                      <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                        {lang === "en" ? "Classroom Voice Prompts to Simulate" : "శిక్షణార్థి కోసం ముందే రాసిన వాయిస్ సమాధానాలు"}
                      </p>

                      <div className="space-y-1.5 text-xs">
                        {[
                          {
                            label: "Which crop grows well in full direct sun?",
                            labelTe: "ఎండ తీవ్రత ఎక్కువగా ఉన్నప్పుడు ఏ పంటలు వేయాలి?",
                            voice: "Which crop grows well in full direct sun?",
                            voiceTe: "ఎండ తీవ్రత ఎక్కువగా ఉన్నప్పుడు ఏ పంటలు వేయాలి?"
                          },
                          {
                            label: "Soil recipe with natural eggshells",
                            labelTe: "కోడిగుడ్డు పెంకులతో మట్టిని ఎలా తయారు చేయాలి?",
                            voice: "How to use eggshells compost in backyard soil?",
                            voiceTe: "మొక్కలకు కోడిగుడ్డు పెంకుల ఎరువు ఎలా వేయాలి?"
                          },
                          {
                            label: "Morning watering schedules for beginners",
                            labelTe: "మొక్కలకు నీరు ఎప్పుడు మరియు ఎంత పోయాలి?",
                            voice: "Water scheduling guidelines morning or evenings?",
                            voiceTe: "మొక్కలకు నీరు ఏ సమయంలో పోయటం మంచిది?"
                          }
                        ].map((prompt, pIdx) => (
                          <button
                            key={pIdx}
                            onClick={() => runVoiceSimulation(prompt.voice, prompt.voiceTe)}
                            loading-id={`voice-preset-${pIdx}`}
                            className="w-full text-left p-3 bg-white hover:bg-emerald-50 rounded-xl border border-slate-200 hover:border-emerald-500 flex justify-between items-center transition"
                          >
                            <div className="truncate pr-4">
                              <p className="font-semibold text-slate-800 truncate">{prompt.label}</p>
                              <p className="text-slate-500 font-telugu text-[10px] truncate">{prompt.labelTe}</p>
                            </div>
                            <span>🔊</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      )}
    </div>
  );
}
