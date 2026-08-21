"use client";

import React, { useState } from "react";
import { Plus, Play, Pause, Sparkles, Music2, Image as ImageIcon, Volume2, Wand2 } from "lucide-react";

interface CreativeGenerativeShowcaseProps {
  onOpenCheckout: (plan?: string) => void;
}

export default function CreativeGenerativeShowcase({
  onOpenCheckout,
}: CreativeGenerativeShowcaseProps) {
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);

  return (
    <section className="py-16 lg:py-24 bg-[#090D16] text-white relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-brand-blue/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-brand-purple/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1180px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-3.5 py-1 text-xs font-semibold text-blue-300 mb-4 font-outfit">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Google Next-Gen Creative AI Engines</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
            ক্রিয়েটিভিটির এক নতুন <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400">দিগন্ত উন্মোচন</span>
          </h2>
          <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
            সর্বাধুনিক ইমেজ সিন্থেসিস ও মিউজিক জেনারেশন মডেল দিয়ে আপনার চিন্তাকে রূপ দিন বাস্তবে।
          </p>
        </div>

        {/* 2 Dark Showcase Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          
          {/* Card 1: Nano Banana 2 (Image Generation Showcase) */}
          <div className="bg-[#0F1422] border border-white/10 rounded-[32px] p-6 sm:p-8 flex flex-col justify-between shadow-2xl hover:border-white/20 transition-all duration-300 group relative overflow-hidden">
            
            {/* Top Image Collage Container */}
            <div className="space-y-3 mb-8">
              {/* Top Hero Banner Image Mockup */}
              <div className="w-full h-44 sm:h-52 rounded-2xl overflow-hidden relative shadow-lg bg-gradient-to-r from-amber-900/60 via-orange-800/40 to-slate-900 border border-white/10">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/20 via-transparent to-black/80" />
                <div className="absolute inset-0 flex items-center justify-between p-6">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-black/50 text-amber-300 px-2 py-0.5 rounded backdrop-blur-md border border-amber-500/30">
                      Photorealistic 8K
                    </span>
                    <h4 className="text-lg font-bold text-white mt-1 drop-shadow-md">
                      Cinematic Portrait
                    </h4>
                    <p className="text-xs text-gray-300 drop-shadow">
                      Floating feather dynamics & volumetric light
                    </p>
                  </div>
                  <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500 to-orange-400/80 p-0.5 shadow-xl flex items-center justify-center text-white/90">
                    <Wand2 className="w-7 h-7 drop-shadow" />
                  </div>
                </div>
              </div>

              {/* Bottom 3 Collage Thumbnails */}
              <div className="grid grid-cols-3 gap-3">
                {/* Thumb 1: Neon Car in Mist */}
                <div className="h-24 sm:h-28 rounded-xl bg-gradient-to-br from-emerald-950 to-teal-900 border border-white/10 relative overflow-hidden p-2.5 flex flex-col justify-end shadow-md">
                  <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-[10px] font-bold text-emerald-300">Synthwave 90s</span>
                  <span className="text-[9px] text-gray-400 truncate">Cyber Car in Rain</span>
                </div>

                {/* Thumb 2: Chrome 3D Typography */}
                <div className="h-24 sm:h-28 rounded-xl bg-gradient-to-br from-slate-900 to-zinc-800 border border-white/10 relative overflow-hidden p-2.5 flex flex-col justify-center items-center text-center shadow-md">
                  <span className="font-outfit font-black text-xl text-transparent bg-clip-text bg-gradient-to-r from-gray-100 via-gray-300 to-gray-500 tracking-tighter leading-none">
                    WAVE<br />FORM
                  </span>
                  <span className="text-[9px] text-gray-400 mt-1">3D Chrome Type</span>
                </div>

                {/* Thumb 3: Vintage Italian Restaurant Sign */}
                <div className="h-24 sm:h-28 rounded-xl bg-gradient-to-br from-amber-950 via-yellow-950 to-stone-900 border border-white/10 relative overflow-hidden p-2.5 flex flex-col justify-end shadow-md">
                  <span className="text-[10px] font-serif font-bold text-amber-200 leading-tight">
                    Tornabuoni
                  </span>
                  <span className="text-[9px] text-amber-400/80 truncate">Vintage Signage</span>
                </div>
              </div>
            </div>

            {/* Bottom Info & Action */}
            <div className="flex items-end justify-between gap-4 pt-2">
              <div>
                {/* Badge */}
                <div className="inline-flex items-center gap-1.5 bg-white/10 border border-white/15 px-2.5 py-0.5 rounded-full text-xs font-semibold text-gray-200 mb-3 font-outfit">
                  <span className="bg-white text-black text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                    নতুন
                  </span>
                  <span>Nano Banana 2</span>
                </div>

                {/* Bengali Title */}
                <h3 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                    আপনার কল্পনার সাথে
                  </span>{" "}
                  <span className="block text-white">মানানসই ছবি তৈরি করুন</span>
                </h3>
              </div>

              {/* Plus Action Button */}
              <button
                type="button"
                onClick={() => onOpenCheckout("18m")}
                className="w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-600/30 transition-all group-hover:scale-105 active:scale-95 cursor-pointer"
                aria-label="Try Nano Banana 2"
              >
                <Plus className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Card 2: Lyria 3 (Music & Soundtrack Generation Showcase) */}
          <div className="bg-[#0F1422] border border-white/10 rounded-[32px] p-6 sm:p-8 flex flex-col justify-between shadow-2xl hover:border-white/20 transition-all duration-300 group relative overflow-hidden">
            
            {/* Top Stacked Album Art / Music Player Mockup */}
            <div className="relative h-64 sm:h-72 mb-8 flex items-center justify-center">
              
              {/* Stacked Background Album Cover (Left) */}
              <div className="absolute left-2 sm:left-6 w-36 sm:w-44 h-48 sm:h-56 rounded-2xl bg-gradient-to-tr from-purple-900 to-pink-900 border border-white/10 opacity-40 transform -rotate-12 scale-90 shadow-xl" />

              {/* Stacked Background Album Cover (Right) */}
              <div className="absolute right-2 sm:right-6 w-36 sm:w-44 h-48 sm:h-56 rounded-2xl bg-gradient-to-tr from-cyan-900 to-blue-900 border border-white/10 opacity-40 transform rotate-12 scale-90 shadow-xl" />

              {/* Center Main Record Player Album Card */}
              <div className="relative z-10 w-56 sm:w-64 h-56 sm:h-64 rounded-2xl bg-gradient-to-b from-stone-900 to-black border border-white/20 p-4 flex flex-col items-center justify-between shadow-2xl">
                {/* Vinyl Grooves with Center Glowing Orb */}
                <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-amber-500/20 via-yellow-600/30 to-black border border-amber-500/40 flex items-center justify-center shadow-[inset_0_0_20px_rgba(245,158,11,0.3)]">
                  {/* Rotating Record Rim */}
                  <div className={`absolute inset-2 rounded-full border border-dashed border-amber-400/30 ${isPlayingMusic ? "animate-spin [animation-duration:8s]" : ""}`} />
                  
                  {/* Play Button */}
                  <button
                    type="button"
                    onClick={() => setIsPlayingMusic(!isPlayingMusic)}
                    className="w-11 h-11 rounded-full bg-white text-brand-dark flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all z-20 cursor-pointer"
                    aria-label="Play sample"
                  >
                    {isPlayingMusic ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-brand-dark ml-0.5" />}
                  </button>
                </div>

                {/* Track Metadata */}
                <div className="text-center w-full">
                  <h5 className="text-sm font-bold text-white font-outfit tracking-wide">
                    Dryer Love
                  </h5>
                  <div className="flex items-center justify-center gap-1.5 text-[10px] text-gray-400 mt-1">
                    <span className="bg-white/10 px-1.5 py-0.5 rounded">R&B</span>
                    <span>•</span>
                    <span className="bg-white/10 px-1.5 py-0.5 rounded">Soulful</span>
                    <span>•</span>
                    <span className="bg-white/10 px-1.5 py-0.5 rounded">Ad-Libs</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Info & Action */}
            <div className="flex items-end justify-between gap-4 pt-2">
              <div>
                {/* Badge */}
                <div className="inline-flex items-center gap-1.5 bg-white/10 border border-white/15 px-2.5 py-0.5 rounded-full text-xs font-semibold text-gray-200 mb-3 font-outfit">
                  <span className="bg-white text-black text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                    নতুন
                  </span>
                  <span>Lyria 3</span>
                </div>

                {/* Bengali Title */}
                <h3 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
                  <span className="block text-white">যেকোনও মুহূর্তের জন্য</span>{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                    পছন্দমতো সাউন্ডট্র্যাক কম্পোজ করুন
                  </span>
                </h3>
              </div>

              {/* Plus Action Button */}
              <button
                type="button"
                onClick={() => onOpenCheckout("18m")}
                className="w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-600/30 transition-all group-hover:scale-105 active:scale-95 cursor-pointer"
                aria-label="Try Lyria 3"
              >
                <Plus className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
