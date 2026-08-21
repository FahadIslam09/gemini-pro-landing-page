"use client";

import React, { useState, useEffect } from "react";
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

  const [promoText, setPromoText] = useState("১৮ মাসের অফিসিয়াল মেগা অফার • ৮৫% ছাড়");
  const [headline, setHeadline] = useState("");
  const [subtext, setSubtext] = useState("");

  useEffect(() => {
    fetch("/api/public/content")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.contents) {
          if (data.contents.promo?.title) setPromoText(data.contents.promo.title);
          if (data.contents.hero?.title) setHeadline(data.contents.hero.title);
          if (data.contents.hero?.subtitle) setSubtext(data.contents.hero.subtitle);
        }
      })
      .catch(() => {});
  }, []);

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
              <span>{promoText}</span>
            </div>

            {/* Main Headline */}
            {headline ? (
              <h1 className="text-3xl sm:text-4xl lg:text-[46px] font-bold text-brand-dark leading-[1.18] tracking-tight mb-5">
                {headline}
              </h1>
            ) : (
              <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-bold text-brand-dark leading-[1.12] tracking-tight mb-5">
                <span className="block">18 মাসের</span>
                <span className="block">
                  Google <span className="gradient-text">AI Pro</span>
                </span>
                <span className="block text-brand-dark">মাত্র ৳499!</span>
              </h1>
            )}

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-brand-body leading-relaxed mb-8 max-w-xl">
              {subtext ? (
                subtext
              ) : (
                <>
                  সর্বাধুনিক <strong>Gemini 3.1 Pro</strong>, ডিপ রিসার্চ (Deep Research), <strong>Veo 3.1</strong> ভিডিও জেনারেশন, 
                  Google Workspace AI, <strong>5 TB ক্লাউড স্টোরেজ</strong> এবং YouTube Premium — সব কিছু এক প্রিমিয়াম বান্ডলে।
                </>
              )}
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
                href="#pricing"
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
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <path d="M20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4Z" fill="#EA4335" fillOpacity="0.15"/>
                      <path d="M4 6L12 11L20 6" stroke="#EA4335" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M2 6V18H6V9L2 6Z" fill="#EA4335"/>
                      <path d="M22 6V18H18V9L22 6Z" fill="#EA4335"/>
                    </svg>
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-brand-dark block leading-none">Google AI Pro</span>
                    <span className="text-[9px] text-brand-success font-semibold">Active Subscription</span>
                  </div>
                </div>
              </div>

              {/* Floating App Badge: 5 TB Cloud Storage (Bottom Right) */}
              <div className="absolute -bottom-3 right-4 sm:right-8 z-20 bg-white border border-brand-border p-2.5 rounded-2xl shadow-card animate-float-delayed">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4 text-brand-blue" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-brand-dark block leading-none">5,000 GB Cloud</span>
                    <span className="text-[9px] text-brand-muted">Google One Storage</span>
                  </div>
                </div>
              </div>

              {/* Main Interactive Glassmorphism AI Mockup Card */}
              <div className="relative z-10 bg-white/95 backdrop-blur-md rounded-3xl p-5 sm:p-7 border border-brand-border shadow-gemini transition-all duration-300 hover:shadow-glow">
                
                {/* Mockup Header */}
                <div className="flex items-center justify-between border-b border-brand-border/60 pb-4 mb-5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-brand-gradient flex items-center justify-center text-white shadow-sm">
                      <Sparkles className="w-4 h-4 animate-pulse" />
                    </div>
                    <div>
                      <h3 className="font-outfit font-bold text-sm text-brand-dark leading-none">
                        Gemini 3.1 Pro
                      </h3>
                      <span className="text-[11px] text-brand-purple font-medium">
                        1 Million Context Engine
                      </span>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200/80 px-2.5 py-0.5 rounded-full text-[11px] font-semibold font-outfit">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                    <span>Ready</span>
                  </span>
                </div>

                {/* Interactive Capability Chips */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-5">
                  {[
                    { label: "ডিপ রিসার্চ", icon: Search, prompt: "বাংলাদেশ ও বৈশ্বিক নবায়নযোগ্য জ্বালানির ভবিষ্যৎ নিয়ে একটি ৩০ পৃষ্ঠার ডিপ রিসার্চ পেপার তৈরি করো...", answer: "🌐 Deep Research সক্রিয়: ৪৫০+ সোর্স যাচাই করে এক্সিকিউটিভ সামারি, সাইটেশন ও চার্ট প্রস্তুত করা হয়েছে।" },
                    { label: "ভিডিও স্ক্রিপ্ট", icon: Video, prompt: "ইউটিউবের জন্য সিনেমাটিক ট্রাভেল ভিডিও স্ক্রিপ্ট ও ভিজ্যুয়াল প্রম্পট লিখে দাও...", answer: "🎬 Veo 3.1 ইন্টিগ্রেশন: ফুল ৪কে সিনেমাটিক শট-লিস্ট এবং স্টোরিবোর্ড জেনারেট সম্পন্ন।" },
                    { label: "কোড রিফ্যাক্টরিং", icon: Code2, prompt: "Next.js ও TypeScript-এ হাই-পারফরম্যান্স এপিআই এন্ডপয়েন্ট অপ্টিমাইজ করো...", answer: "⚡ কোড অপ্টিমাইজড: O(1) ক্যাশিং এবং সম্পূর্ণ টাইপ-সেফ কোড ব্লক প্রস্তুত।" },
                    { label: "স্মার্ট অ্যানালাইসিস", icon: FileText, prompt: "বাজেট এবং বিজনেস ফাইন্যান্সিয়াল রিপোর্ট বিস্তারিত বিশ্লেষণ করো...", answer: "📊 স্মার্ট রিপোর্ট: রেভিনিউ প্রজেকশন এবং কস্ট অপ্টিমাইজেশন মডেল তৈরি হয়েছে।" },
                    { label: "মিউজিক ও ভয়েস", icon: Music, prompt: "একটি লিরিক থেকে অডিও ট্র্যাক এবং স্টুডিও মাস্টার ভয়েস তৈরি করো...", answer: "🎵 Lyria 3 স্টুডিও: উচ্চমানের ৯৬kHz স্পেশিয়াল অডিও সিন্থেসিস সফল।" },
                    { label: "জিমেইল ড্রাফট", icon: Send, prompt: "আন্তর্জাতিক ক্লায়েন্টের জন্য প্রফেশনাল বিজনেস প্রপোজাল ড্রাফট তৈরি করো...", answer: "✉️ Google Workspace AI: সম্পূর্ণ প্রফেশনাল বিজনেস ইমেইল খসড়া রেডি।" },
                  ].map((chip, idx) => {
                    const Icon = chip.icon;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleActionClick(chip.prompt, chip.answer)}
                        className="flex items-center gap-1.5 p-2 rounded-xl bg-brand-surface hover:bg-brand-purple/10 hover:text-brand-purple text-brand-dark border border-brand-border/80 transition-all text-xs font-medium text-left cursor-pointer group"
                      >
                        <Icon className="w-3.5 h-3.5 text-brand-muted group-hover:text-brand-purple flex-shrink-0" />
                        <span className="truncate">{chip.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Prompt Display & Dynamic Output Area */}
                <div className="bg-brand-surface rounded-2xl p-4 border border-brand-border/80 space-y-3">
                  <div className="flex items-start gap-2.5">
                    <div className="w-6 h-6 rounded-full bg-brand-purple text-white flex items-center justify-center text-xs font-bold font-outfit flex-shrink-0 mt-0.5">
                      You
                    </div>
                    <p className="text-xs text-brand-dark font-medium leading-relaxed">
                      {activePrompt}
                    </p>
                  </div>

                  {/* AI Response Bubble */}
                  <div className="flex items-start gap-2.5 pt-2 border-t border-brand-border/60">
                    <div className="w-6 h-6 rounded-full bg-brand-gradient text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Sparkles className="w-3 h-3" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-brand-body leading-relaxed">
                        {promptResult || "🌐 Deep Research সক্রিয়: ৪৫০+ সোর্স যাচাই করে এক্সিকিউটিভ সামারি, সাইটেশন ও চার্ট প্রস্তুত করা হয়েছে।"}
                      </p>
                      <div className="flex items-center gap-2 pt-1">
                        <span className="text-[10px] bg-brand-purple/10 text-brand-purple font-semibold px-2 py-0.5 rounded">
                          Gemini 3.1 Pro Output
                        </span>
                        <span className="text-[10px] text-brand-muted font-mono">
                          0.4s response
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Quick Action */}
                <div className="mt-4 flex items-center justify-between text-xs pt-1">
                  <span className="text-brand-muted text-[11px]">
                    ১৮ মাসের আনলিমিটেড লাইসেন্স
                  </span>
                  <button
                    type="button"
                    onClick={() => onOpenCheckout("18m")}
                    className="font-semibold text-brand-blue hover:text-brand-dark flex items-center gap-1 font-outfit cursor-pointer"
                  >
                    <span>Activate Plan</span>
                    <ArrowRight className="w-3.5 h-3.5" />
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
