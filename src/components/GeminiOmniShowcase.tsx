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
    <section className="pt-16 lg:pt-24 pb-8 lg:pb-10 bg-gradient-to-b from-brand-surface via-[#F6F8FD] to-brand-surface relative overflow-hidden border-t border-brand-border/60">
      
      {/* Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-gradient-to-r from-brand-blue/10 via-brand-purple/10 to-brand-indigo/10 blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-[1180px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 lg:mb-16 reveal-init">
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

        {/* Video Showcase Card */}
        <div className="reveal-init reveal-scale max-w-5xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden bg-slate-900 border border-brand-border/80 shadow-2xl group transition-all duration-300">
            
            {/* Native Loop Video */}
            <video
              ref={videoRef}
              src="/Gemini%20Omni.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-auto aspect-video object-cover block"
            />

            {/* Video Controls Overlay (Play/Pause Bottom Left, Audio Bottom Right) */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

            {/* Control Bar */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-auto">
              {/* Play/Pause Button */}
              <button
                type="button"
                onClick={togglePlay}
                aria-label={isPlaying ? "Pause video" : "Play video"}
                className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-white hover:text-brand-dark transition-all cursor-pointer shadow-lg"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
              </button>

              {/* Omni Video Tag */}
              <div className="hidden sm:inline-flex items-center gap-2 bg-black/50 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full text-xs font-semibold text-white/90">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>Gemini Omni Video Synthesis (Veo 3.1)</span>
              </div>

              {/* Mic / Audio Mute-Unmute Toggle Button */}
              <button
                type="button"
                onClick={toggleAudio}
                aria-label={isMuted ? "Unmute audio" : "Mute audio"}
                className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-white hover:text-brand-dark transition-all cursor-pointer shadow-lg"
                title={isMuted ? "সাউন্ড অন করুন" : "সাউন্ড মিউট করুন"}
              >
                {isMuted ? (
                  <MicOff className="w-4 h-4 text-red-400" />
                ) : (
                  <Mic className="w-4 h-4 text-emerald-400 animate-pulse" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
