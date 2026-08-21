"use client";

import React, { useState } from "react";
import {
  ArrowRight,
  ChevronDown,
  ShieldCheck,
  Zap,
  Headphones,
  CheckCircle2,
  FileText,
  Video,
  Music,
  Code2,
  Search,
  Send,
  Sparkles,
} from "lucide-react";

interface HeroProps {
  onOpenCheckout: (plan?: string) => void;
}

export default function Hero({ onOpenCheckout }: HeroProps) {
  const [activePrompt, setActivePrompt] = useState("Generate Deep Research report on renewable energy...");
  const [promptResult, setPromptResult] = useState<string | null>(null);

  const handleActionClick = (promptText: string, previewAnswer: string) => {
    setActivePrompt(promptText);
    setPromptResult(previewAnswer);
  };

  return (
    <section className="relative pt-8 pb-16 lg:pt-14 lg:pb-24 overflow-hidden bg-brand-surface">
      <div className="max-w-[1180px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* Left Column (Content & CTAs) */}
          <div className="lg:col-span-6 flex flex-col items-start text-left">
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 bg-[#FFFDF8] border border-[#FEE7C8] rounded-full px-4 py-2 text-sm font-semibold text-[#C25E00] shadow-[0_2px_8px_rgba(245,158,11,0.08)] mb-6 animate-pulse-glow">
              <Sparkles className="w-4 h-4 text-brand-accent fill-brand-accent/20" />
              <span>১৮ মাসের অফিসিয়াল মেগা অফার • ৮৫% ছাড়</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-bold text-brand-dark leading-[1.12] tracking-tight mb-5">
              <span className="block">18 মাসের</span>
              <span className="block">
                Google <span className="gradient-text">AI Pro</span>
              </span>
              <span className="block text-brand-dark">মাত্র ৳499!</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-brand-body leading-relaxed mb-8 max-w-xl">
              সর্বাধুনিক <strong>Gemini 3.1 Pro</strong>, ডিপ রিসার্চ (Deep Research), <strong>Veo 3.1</strong> ভিডিও জেনারেশন, 
              Google Workspace AI, <strong>5 TB ক্লাউড স্টোরেজ</strong> এবং YouTube Premium — সব কিছু এক প্রিমিয়াম বান্ডলে।
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto mb-10">
              <button
                type="button"
                onClick={() => onOpenCheckout("18m")}
                className="inline-flex items-center justify-center gap-2.5 bg-brand-gradient hover:bg-brand-gradient-hover text-white text-base font-semibold px-8 py-4 rounded-xl shadow-glow hover:shadow-[0_10px_28px_rgba(91,85,216,0.42)] transition-all duration-200 hover:-translate-y-0.5"
              >
                <span>এখনই সাবস্ক্রিপশন নিন</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <a
                href="#deep-dive"
                className="inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-brand-dark border border-brand-border text-base font-semibold px-6 py-4 rounded-xl shadow-soft hover:shadow-md transition-all duration-200"
              >
                <span>ফিচারসমূহ দেখুন</span>
                <ChevronDown className="w-4 h-4 text-brand-muted" />
              </a>
            </div>

            {/* Trust Row */}
            <div className="w-full pt-6 border-t border-brand-border grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-white border border-brand-border shadow-sm flex items-center justify-center text-brand-blue">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <span className="text-xs sm:text-sm font-medium text-brand-dark">১০০% ভেরিফাইড</span>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-white border border-brand-border shadow-sm flex items-center justify-center text-brand-indigo">
                  <Zap className="w-4 h-4" />
                </div>
                <span className="text-xs sm:text-sm font-medium text-brand-dark">৫-১৫ মি. অ্যাক্টিভেশন</span>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-white border border-brand-border shadow-sm flex items-center justify-center text-brand-purple">
                  <Headphones className="w-4 h-4" />
                </div>
                <span className="text-xs sm:text-sm font-medium text-brand-dark">২৪/৭ লাইভ সাপোর্ট</span>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-white border border-brand-border shadow-sm flex items-center justify-center text-brand-success">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <span className="text-xs sm:text-sm font-medium text-brand-dark">নিজস্ব জিমেইল একাউন্টে</span>
              </div>
            </div>
          </div>

          {/* Right Column (Interactive Gemini Visual Component) */}
          <div className="lg:col-span-6 relative flex items-center justify-center pt-6 lg:pt-0">
            <div className="relative w-full max-w-[530px] p-2 sm:p-6">
              
              {/* Background Flowing Curves */}
              <div className="absolute inset-0 -m-8 pointer-events-none z-0">
                <svg className="w-full h-full opacity-60" viewBox="0 0 540 460" fill="none">
                  <defs>
                    <linearGradient id="heroWaveGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#3157D5" stopOpacity="0.16" />
                      <stop offset="100%" stopColor="#8A4EDB" stopOpacity="0.05" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M40 100 C 160 30, 300 200, 500 120 C 560 100, 540 320, 440 390 C 320 460, 130 420, 50 330 C -20 260, -30 160, 40 100 Z"
                    fill="url(#heroWaveGrad)"
                  />
                  <path
                    d="M100 160 C 200 80, 360 240, 490 180"
                    stroke="#7B4FD8"
                    strokeWidth="1.5"
                    strokeOpacity="0.2"
                    strokeDasharray="4 6"
                  />
                </svg>
              </div>

              {/* Floating App Badge: Official Google Gmail (Top Left) */}
              <div className="absolute -top-3 left-4 sm:left-8 z-20 bg-white border border-brand-border p-2.5 rounded-2xl shadow-card animate-float">
                <svg className="w-7 h-7 sm:w-8 sm:h-8" viewBox="0 -31.5 256 256">
                  <g>
                    <path d="M58.1818182,192.049515 L58.1818182,93.1404244 L27.5066233,65.0770089 L0,49.5040608 L0,174.59497 C0,184.253152 7.82545455,192.049515 17.4545455,192.049515 L58.1818182,192.049515 Z" fill="#4285F4" />
                    <path d="M197.818182,192.049515 L238.545455,192.049515 C248.203636,192.049515 256,184.224061 256,174.59497 L256,49.5040608 L224.844415,67.3422767 L197.818182,93.1404244 L197.818182,192.049515 Z" fill="#34A853" />
                    <polygon fill="#EA4335" points="58.1818182 93.1404244 54.0077618 54.4932827 58.1818182 17.5040608 128 69.8676972 197.818182 17.5040608 202.487488 52.4960089 197.818182 93.1404244 128 145.504061" />
                    <path d="M197.818182,17.5040608 L197.818182,93.1404244 L256,49.5040608 L256,26.2313335 C256,4.64587897 231.36,-7.65957557 214.109091,5.28587897 L197.818182,17.5040608 Z" fill="#FBBC04" />
                    <path d="M0,49.5040608 L26.7588051,69.5731646 L58.1818182,93.1404244 L58.1818182,17.5040608 L41.8909091,5.28587897 C24.6109091,-7.65957557 0,4.64587897 0,26.2313335 L0,49.5040608 Z" fill="#C5221F" />
                  </g>
                </svg>
              </div>

              {/* Floating App Badge: Google Drive (Top Right) */}
              <div className="absolute top-2 -right-2 sm:-right-4 z-20 bg-white border border-brand-border p-2.5 rounded-2xl shadow-card animate-float [animation-delay:1.5s]">
                <svg className="w-7 h-7 sm:w-8 sm:h-8" viewBox="0 0 48 48">
                  <path fill="#FFC107" d="M17 6L31 6L45 30L31 30Z"/>
                  <path fill="#4CAF50" d="M9.7 42L16.7 30L44.7 30L37.7 42Z"/>
                  <path fill="#1976D2" d="M17 6L3 30L10 42L24 18Z"/>
                </svg>
              </div>

              {/* Floating App Badge: YouTube (Right Middle) */}
              <div className="absolute top-1/2 -right-3 sm:-right-6 -translate-y-1/2 z-20 bg-white border border-brand-border p-2.5 rounded-2xl shadow-card animate-float [animation-delay:2.2s]">
                <svg className="w-7 h-7 sm:w-8 sm:h-8" viewBox="0 0 48 48">
                  <path fill="#FF0000" d="M43.2,13.9c-0.5-1.9-2-3.4-3.9-3.9C35.8,9,24,9,24,9s-11.8,0-15.3,1c-1.9,0.5-3.4,2-3.9,3.9 C3.8,17.4,3.8,24,3.8,24s0,6.6,1,10.1c0.5,1.9,2,3.4,3.9,3.9c3.5,1,15.3,1,15.3,1s11.8,0,15.3-1c1.9-0.5,3.4-2,3.9-3.9 c1-3.5,1-10.1,1-10.1S44.2,17.4,43.2,13.9z"/>
                  <polygon fill="#FFFFFF" points="20,31 31,24 20,17"/>
                </svg>
              </div>

              {/* Floating App Badge: Workspace Group (Bottom Left) */}
              <div className="absolute -bottom-3 -left-2 sm:-left-4 z-20 bg-white border border-brand-border px-3 py-2 rounded-2xl shadow-card flex items-center gap-1.5 animate-float [animation-delay:0.8s]">
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="#4285F4">
                  <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
                </svg>
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="#0F9D58">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-8-2h6v-2h-6v2zm0-4h6v-2h-6v2zm-4 4h2v-2H7v2zm0-4h2v-2H7v2zm0-4h2V7H7v2zm4 0h6V7h-6v2z"/>
                </svg>
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="#F4B400">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zM8 7h8v6H8z"/>
                </svg>
              </div>

              {/* Floating App Badge: Google One 5 TB (Bottom Right) */}
              <div className="absolute -bottom-2 -right-2 sm:right-2 z-20 bg-white border border-brand-border px-3.5 py-2 rounded-2xl shadow-card flex items-center gap-2.5 animate-float [animation-delay:1.2s]">
                <div className="w-6 h-6 rounded-full bg-brand-blue/10 flex items-center justify-center text-brand-blue">
                  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>
                  </svg>
                </div>
                <div className="text-left font-outfit">
                  <span className="block text-xs font-bold text-brand-dark leading-none">Google One</span>
                  <span className="block text-[11px] font-semibold text-brand-blue">5 TB Storage</span>
                </div>
              </div>

              {/* Main Interactive Gemini Card */}
              <div className="relative z-10 bg-white/95 backdrop-blur-xl border border-brand-border/90 rounded-[28px] p-6 sm:p-7 shadow-gemini">
                {/* Gemini Header */}
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M12 2C12 7.5 7.5 12 2 12C7.5 12 12 16.5 12 22C12 16.5 16.5 12 22 12C16.5 12 12 7.5 12 2Z"
                        fill="url(#headerSparkleGrad)"
                      />
                    </svg>
                    <span className="font-outfit text-lg font-bold text-brand-dark tracking-tight">
                      Google AI Pro
                    </span>
                  </div>
                  <span className="bg-brand-purple/10 text-brand-purple text-[11px] font-bold px-2.5 py-0.5 rounded-full font-outfit">
                    GEMINI 3.1 PRO
                  </span>
                </div>

                {/* Greeting */}
                <h3 className="font-outfit text-lg sm:text-xl font-medium text-brand-dark mb-4">
                  What would you like to build or research today?
                </h3>

                {/* Search / Prompt Box */}
                <div className="flex items-center justify-between bg-brand-surface border border-brand-border rounded-full px-4 py-2.5 mb-5 shadow-[inset_0_1px_3px_rgba(0,0,0,0.02)]">
                  <span className="font-outfit text-sm text-brand-dark truncate pr-2">
                    {activePrompt}
                  </span>
                  <button
                    type="button"
                    className="w-8 h-8 rounded-full bg-brand-blue/10 hover:bg-brand-blue text-brand-blue hover:text-white flex items-center justify-center transition-all flex-shrink-0"
                    aria-label="Send"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* AI Interactive Preview Output Box (if clicked) */}
                {promptResult && (
                  <div className="bg-brand-subtle border border-brand-purple/20 rounded-xl p-3 text-xs text-brand-dark mb-4 animate-in fade-in zoom-in-95 duration-200">
                    <div className="flex items-center gap-1.5 text-brand-purple font-semibold mb-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Gemini 3.1 Pro Live Synthesis:</span>
                    </div>
                    <p className="leading-relaxed">{promptResult}</p>
                  </div>
                )}

                {/* 5 Mini Action Cards */}
                <div className="grid grid-cols-5 gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      handleActionClick(
                        "Generate Deep Research report on renewable energy investments in Bangladesh",
                        "১০০+ অনলাইন সোর্স ও আন্তর্জাতিক রিপোর্ট ব্রাউজ করে একটি ১২ পৃষ্ঠার কমপ্রিহেনসিভ রিপোর্ট প্রস্তুত করা হয়েছে।"
                      )
                    }
                    className="bg-[#F8F9FD] hover:bg-white border border-brand-border hover:border-brand-purple/40 rounded-xl p-2.5 flex flex-col items-center text-center gap-1.5 transition-all hover:-translate-y-0.5 group shadow-sm"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#EBF2FE] text-brand-blue flex items-center justify-center">
                      <Search className="w-4 h-4" />
                    </div>
                    <span className="font-outfit text-[11px] font-medium text-brand-body group-hover:text-brand-dark leading-tight line-clamp-2">
                      Deep Research
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleActionClick(
                        "Generate 4K cinematic video using Veo 3.1",
                        "Veo 3.1 দিয়ে হাইপার-রিয়েলিস্টিক সিনেমাটিক 4K ভিডিও রেন্ডার সম্পন্ন হয়েছে।"
                      )
                    }
                    className="bg-[#F8F9FD] hover:bg-white border border-brand-border hover:border-brand-purple/40 rounded-xl p-2.5 flex flex-col items-center text-center gap-1.5 transition-all hover:-translate-y-0.5 group shadow-sm"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#FEECEC] text-red-500 flex items-center justify-center">
                      <Video className="w-4 h-4" />
                    </div>
                    <span className="font-outfit text-[11px] font-medium text-brand-body group-hover:text-brand-dark leading-tight line-clamp-2">
                      Veo 3.1 Video
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleActionClick(
                        "Create soundtrack with vocals using Lyria 3",
                        "Lyria 3 মিউজিক মডেলের সাহায্যে ভোকাল, ইনস্ট্রুমেন্টাল ও লিরিক্সসহ ট্র্যাক তৈরি সম্পন্ন।"
                      )
                    }
                    className="bg-[#F8F9FD] hover:bg-white border border-brand-border hover:border-brand-purple/40 rounded-xl p-2.5 flex flex-col items-center text-center gap-1.5 transition-all hover:-translate-y-0.5 group shadow-sm"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#F3EEFB] text-brand-purple flex items-center justify-center">
                      <Music className="w-4 h-4" />
                    </div>
                    <span className="font-outfit text-[11px] font-medium text-brand-body group-hover:text-brand-dark leading-tight line-clamp-2">
                      Lyria 3 Music
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleActionClick(
                        "Orchestrate multi-agent project in Antigravity & Jules",
                        "Google Antigravity ও Jules এজেন্টের মাধ্যমে গিটহাব পুল রিকোয়েস্ট ও বাগ ফিক্সিং স্বয়ংক্রিয়ভাবে সম্পন্ন হয়েছে।"
                      )
                    }
                    className="bg-[#F8F9FD] hover:bg-white border border-brand-border hover:border-brand-purple/40 rounded-xl p-2.5 flex flex-col items-center text-center gap-1.5 transition-all hover:-translate-y-0.5 group shadow-sm"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#EAF7EE] text-brand-success flex items-center justify-center">
                      <Code2 className="w-4 h-4" />
                    </div>
                    <span className="font-outfit text-[11px] font-medium text-brand-body group-hover:text-brand-dark leading-tight line-clamp-2">
                      AI Coding
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleActionClick(
                        "Draft professional executive proposal in Docs",
                        "Google Docs-এ ফরম্যাটিং ও এক্সিকিউটিভ সামারিসহ প্রপোজাল ড্রাফট তৈরি হয়েছে।"
                      )
                    }
                    className="bg-[#F8F9FD] hover:bg-white border border-brand-border hover:border-brand-purple/40 rounded-xl p-2.5 flex flex-col items-center text-center gap-1.5 transition-all hover:-translate-y-0.5 group shadow-sm"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#FEF6EA] text-brand-accent flex items-center justify-center">
                      <FileText className="w-4 h-4" />
                    </div>
                    <span className="font-outfit text-[11px] font-medium text-brand-body group-hover:text-brand-dark leading-tight line-clamp-2">
                      Workspace AI
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
