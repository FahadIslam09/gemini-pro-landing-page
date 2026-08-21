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
    <section className="py-16 lg:py-24 bg-[#080B14] text-white relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-brand-blue/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-brand-purple/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1180px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-3.5 py-1 text-xs font-semibold text-blue-300 mb-4 font-outfit shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Google Next-Gen Creative AI Engines</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
            ক্রিয়েটিভিটির এক নতুন{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400">
              দিগন্ত উন্মোচন
            </span>
          </h2>
          <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
            সর্বাধুনিক ইমেজ সিন্থেসিস ও মিউজিক জেনারেশন মডেল দিয়ে আপনার চিন্তাকে রূপ দিন বাস্তবে।
          </p>
        </div>

        {/* 2 Dark Showcase Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          
          {/* Card 1: Nano Banana 2 (Image Generation Showcase) */}
          <div className="bg-[#0D121F] border border-white/10 rounded-[32px] p-6 sm:p-8 flex flex-col justify-between shadow-2xl hover:border-white/20 transition-all duration-300 group relative overflow-hidden">
            
            {/* Top Image Showcase (Provided by User) */}
            <div className="mb-8 rounded-2xl overflow-hidden bg-black/40 flex items-center justify-center p-2 border border-white/5 shadow-inner">
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
          <div className="bg-[#0D121F] border border-white/10 rounded-[32px] p-6 sm:p-8 flex flex-col justify-between shadow-2xl hover:border-white/20 transition-all duration-300 group relative overflow-hidden">
            
            {/* Top Image Showcase (Provided by User) */}
            <div className="mb-8 rounded-2xl overflow-hidden bg-black/40 flex items-center justify-center p-2 border border-white/5 shadow-inner">
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
