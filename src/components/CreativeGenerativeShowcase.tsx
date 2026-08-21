"use client";

import React from "react";
import { Plus, Sparkles } from "lucide-react";

interface CreativeGenerativeShowcaseProps {
  onOpenCheckout: (plan?: string) => void;
}

export default function CreativeGenerativeShowcase({
  onOpenCheckout,
}: CreativeGenerativeShowcaseProps) {
  return (
    <section className="pt-4 lg:pt-6 pb-20 lg:pb-28 bg-gradient-to-b from-transparent to-brand-surface relative overflow-hidden">
      
      {/* Subtle Ambient Glows */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-brand-blue/8 blur-3xl pointer-events-none rounded-full" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-brand-purple/8 blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-[1180px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header (Harmonized with site typography) */}
        <div className="text-center max-w-2xl mx-auto mb-14 reveal-init">
          <div className="inline-flex items-center gap-2 bg-brand-purple/10 border border-brand-purple/20 rounded-full px-3.5 py-1 text-xs font-semibold text-brand-purple mb-4 font-outfit shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Google Next-Gen Creative AI Engines</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-bold text-brand-dark tracking-tight mb-3">
            ক্রিয়েটিভিটির এক নতুন <span className="gradient-text">দিগন্ত উন্মোচন</span>
          </h2>
          <p className="text-base sm:text-lg text-brand-muted leading-relaxed">
            সর্বাধুনিক ইমেজ সিন্থেসিস ও মিউজিক জেনারেশন মডেল দিয়ে আপনার চিন্তাকে রূপ দিন বাস্তবে।
          </p>
        </div>

        {/* 2 High-Contrast Studio Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          
          {/* Card 1: Nano Banana 2 (Image Generation Showcase) */}
          <div className="reveal-init stagger-1 reveal-scale bg-[#0B0F19] text-white border border-slate-800/80 rounded-[32px] p-6 sm:p-8 flex flex-col justify-between shadow-[0_20px_50px_rgba(15,23,42,0.18)] hover:border-slate-700 transition-all duration-300 group relative overflow-hidden">
            
            {/* Top Image Showcase */}
            <div className="mb-8 rounded-2xl overflow-hidden bg-black/50 flex items-center justify-center p-2 border border-white/5 shadow-inner">
              <img
                src="/nano-top-img.png"
                alt="Nano Banana 2 Image Generation Showcase"
                className="w-full h-auto max-h-72 object-contain rounded-xl drop-shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]"
                loading="lazy"
              />
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
          <div className="reveal-init stagger-2 reveal-scale bg-[#0B0F19] text-white border border-slate-800/80 rounded-[32px] p-6 sm:p-8 flex flex-col justify-between shadow-[0_20px_50px_rgba(15,23,42,0.18)] hover:border-slate-700 transition-all duration-300 group relative overflow-hidden">
            
            {/* Top Image Showcase */}
            <div className="mb-8 rounded-2xl overflow-hidden bg-black/50 flex items-center justify-center p-2 border border-white/5 shadow-inner">
              <img
                src="/lyria_3-top-img.png"
                alt="Lyria 3 Music Generation Showcase"
                className="w-full h-auto max-h-72 object-contain rounded-xl drop-shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]"
                loading="lazy"
              />
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
