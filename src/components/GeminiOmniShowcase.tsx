"use client";

import React, { useRef, useState } from "react";
import { Sparkles, Play, Pause, Mic, MicOff } from "lucide-react";

interface GeminiOmniShowcaseProps {
  onOpenCheckout?: (plan?: string) => void;
}

export default function GeminiOmniShowcase({ onOpenCheckout }: GeminiOmniShowcaseProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

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

  const toggleAudio = () => {
    if (videoRef.current) {
      const nextMuted = !isMuted;
      videoRef.current.muted = nextMuted;
      setIsMuted(nextMuted);
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
        <div className="relative max-w-4xl mx-auto">
          
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
                muted={isMuted}
                playsInline
                className="w-full h-full object-cover"
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />

              {/* Sound / Mic Toggle Button */}
              <button
                type="button"
                onClick={toggleAudio}
                className={`absolute bottom-4 left-4 flex items-center gap-2 px-3.5 py-2 rounded-full backdrop-blur-md transition-all shadow-lg cursor-pointer hover:scale-105 active:scale-95 z-20 ${
                  isMuted
                    ? "bg-black/70 hover:bg-black/90 text-white/90 border border-white/20"
                    : "bg-brand-blue/90 hover:bg-brand-blue text-white border border-blue-400/40 shadow-blue-500/30"
                }`}
                aria-label={isMuted ? "সাউন্ড চালু করুন" : "সাউন্ড মিউট করুন"}
              >
                {isMuted ? (
                  <>
                    <MicOff className="w-4 h-4 text-red-400" />
                    <span className="text-xs font-semibold font-bangla">সাউন্ড শুনুন (আনমিউট)</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-4 h-4 text-emerald-300 animate-pulse" />
                    <span className="text-xs font-semibold font-bangla">সাউন্ড চালু আছে</span>
                  </>
                )}
              </button>

              {/* Play/Pause Hover Overlay */}
              <button
                type="button"
                onClick={togglePlay}
                className="absolute bottom-4 right-4 bg-black/60 hover:bg-black/80 text-white p-3 rounded-full backdrop-blur-md transition-all shadow-lg cursor-pointer hover:scale-105 active:scale-95 z-20"
                aria-label={isPlaying ? "Pause video" : "Play video"}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
