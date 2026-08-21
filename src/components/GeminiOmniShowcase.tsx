"use client";

import React, { useRef, useState } from "react";
import { Sparkles, Play, Pause, ArrowRight, Layers, Clapperboard, Palette, CheckCircle2 } from "lucide-react";

interface GeminiOmniShowcaseProps {
  onOpenCheckout: (plan?: string) => void;
}

export default function GeminiOmniShowcase({ onOpenCheckout }: GeminiOmniShowcaseProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  return (
    <section className="py-20 lg:py-28 bg-gradient-to-b from-brand-surface via-[#F6F8FD] to-brand-surface relative overflow-hidden border-t border-brand-border/60">
      
      {/* Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-gradient-to-r from-brand-blue/10 via-brand-purple/10 to-brand-indigo/10 blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-[1180px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 lg:mb-16">
          <div className="inline-flex items-center gap-2 bg-brand-purple/10 border border-brand-purple/20 rounded-full px-4 py-1.5 text-xs font-semibold text-brand-purple mb-5 font-outfit shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Gemini Omni • নেক্সট-জেন মাল্টিমোডাল স্টুডিও</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-[46px] font-bold text-brand-dark tracking-tight leading-[1.2] mb-5">
            আপনার পরবর্তী ক্রিয়েটিভ মাস্টারপিসকে{" "}
            <span className="gradient-text">জীবন্ত করে তুলুন</span>
          </h2>

          <p className="text-lg sm:text-xl font-semibold text-brand-dark mb-3">
            টেক্সট, ছবি ও ভিডিওর সংমিশ্রণে আপনার আইডিয়াকে বাস্তবায়িত করে তুলুন
          </p>

          <p className="text-sm sm:text-base text-brand-body leading-relaxed max-w-2xl mx-auto">
            আপনি এখন একাধিক রেফারেন্স ইমেজ আপলোড করতে পারবেন। ফলে আপনার দৃশ্যের চরিত্র, অবজেক্ট এবং স্টাইল নির্দেশ করে ডায়নামিক স্টোরিটেলিং আরও সহজ হবে।
          </p>
        </div>

        {/* Studio Video Showcase Container */}
        <div className="relative max-w-4xl mx-auto mb-12">
          
          {/* Outer Glass Frame */}
          <div className="relative bg-white/80 backdrop-blur-xl border border-brand-border/90 rounded-[28px] sm:rounded-[36px] p-3 sm:p-5 shadow-[0_25px_60px_rgba(49,87,213,0.14)] group">
            
            {/* Top Bar inside Player Frame */}
            <div className="flex items-center justify-between px-3 py-2 mb-2">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-400/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400/80" />
                </div>
                <span className="text-xs font-semibold text-brand-muted font-outfit ml-2">
                  Gemini Omni Canvas
                </span>
              </div>

              {/* Status Badge */}
              <div className="flex items-center gap-2 bg-slate-900/90 text-white px-3 py-1 rounded-full text-[11px] font-semibold font-outfit shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Multimodal Studio Preview</span>
              </div>
            </div>

            {/* Video Container */}
            <div className="relative rounded-2xl sm:rounded-[24px] overflow-hidden bg-slate-950 aspect-video shadow-inner flex items-center justify-center">
              <video
                ref={videoRef}
                src="/omni.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />

              {/* Play/Pause Hover Overlay */}
              <button
                type="button"
                onClick={togglePlay}
                className="absolute bottom-4 right-4 bg-black/60 hover:bg-black/80 text-white p-3 rounded-full backdrop-blur-md transition-all shadow-lg cursor-pointer hover:scale-105 active:scale-95"
                aria-label={isPlaying ? "Pause video" : "Play video"}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
              </button>
            </div>
          </div>
        </div>

        {/* 3 Core Capability Highlights Below Video */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl mx-auto mb-10">
          <div className="bg-white border border-brand-border/80 rounded-2xl p-5 shadow-soft hover:shadow-card-hover transition-all">
            <div className="w-10 h-10 rounded-xl bg-brand-blue/10 text-brand-blue flex items-center justify-center mb-3">
              <Layers className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-brand-dark mb-1">
              মাল্টি-ইমেজ রেফারেন্স
            </h4>
            <p className="text-xs text-brand-muted leading-relaxed">
              একাধিক রেফারেন্স ছবি ইনপুট দিয়ে দৃশ্যের চরিত্র ও ব্যাকগ্রাউন্ড পারফেক্ট রাখুন।
            </p>
          </div>

          <div className="bg-white border border-brand-border/80 rounded-2xl p-5 shadow-soft hover:shadow-card-hover transition-all">
            <div className="w-10 h-10 rounded-xl bg-brand-purple/10 text-brand-purple flex items-center justify-center mb-3">
              <Palette className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-brand-dark mb-1">
              কনসিস্টেন্ট ক্যারেক্টার স্টাইল
            </h4>
            <p className="text-xs text-brand-muted leading-relaxed">
              প্রতিটি ফ্রেমে অবজেক্ট ও ক্যারেক্টারের ধারাবাহিকতা নিখুঁতভাবে বজায় থাকে।
            </p>
          </div>

          <div className="bg-white border border-brand-border/80 rounded-2xl p-5 shadow-soft hover:shadow-card-hover transition-all">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-3">
              <Clapperboard className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-brand-dark mb-1">
              ডায়নামিক সিনেমাটিক মোশন
            </h4>
            <p className="text-xs text-brand-muted leading-relaxed">
              সিনেমা কোয়ালিটির ক্যামেরা মুভমেন্ট ও রিয়েলিস্টিক ফিজিক্স কন্ট্রোল।
            </p>
          </div>
        </div>

        {/* Section Bottom CTA */}
        <div className="text-center">
          <button
            type="button"
            onClick={() => onOpenCheckout("18m")}
            className="inline-flex items-center justify-center gap-2 bg-brand-gradient hover:bg-brand-gradient-hover text-white text-base font-semibold px-8 py-3.5 rounded-xl shadow-glow hover:shadow-lg transition-all cursor-pointer hover:-translate-y-0.5"
          >
            <span>Gemini Omni দিয়ে এখনই শুরু করুন</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
