"use client";

import React from "react";
import { ArrowRight, ShieldCheck, Zap, Headphones, Lock, Sparkles } from "lucide-react";

interface FinalCtaProps {
  onOpenCheckout: (plan?: string) => void;
}

export default function FinalCta({ onOpenCheckout }: FinalCtaProps) {
  return (
    <section id="support" className="py-16 lg:py-24 bg-brand-surface">
      <div className="max-w-[1180px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Banner Card */}
        <div className="reveal-init reveal-scale bg-gradient-to-br from-[#F0F4FF] via-[#F5F0FF] to-[#FAF5FF] border-1.5 border-[#E0E6FC] rounded-[32px] p-8 sm:p-12 shadow-gemini grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative overflow-hidden">
          
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-brand-purple/10 rounded-full blur-3xl pointer-events-none" />

          {/* Left: 3D Crystal Visual */}
          <div className="lg:col-span-3 flex items-center justify-center">
            <div className="relative w-36 h-36 sm:w-44 sm:h-44 flex items-center justify-center group">
              <div className="absolute inset-0 bg-brand-purple/20 rounded-full blur-xl scale-75 group-hover:scale-95 transition-transform duration-500" />
              <img
                src="/crystal.jpg"
                alt="Google AI Pro 3D Crystal Star"
                className="w-full h-full object-contain relative z-10 rounded-2xl drop-shadow-[0_12px_24px_rgba(49,87,213,0.2)] animate-float mix-blend-multiply"
                loading="lazy"
              />
            </div>
          </div>

          {/* Center: Headline & Info */}
          <div className="lg:col-span-6 flex flex-col items-center lg:items-start text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-brand-purple/10 border border-brand-purple/20 rounded-full px-3.5 py-1 text-xs font-semibold text-brand-purple mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>এক্সক্লুসিভ অফার</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-brand-dark tracking-tight mb-2 leading-tight">
              আপনার AI জার্নি আজ থেকেই <span className="gradient-text">শুরু করুন</span>
            </h2>
            <p className="text-base sm:text-lg font-semibold text-brand-dark mb-2">
              18 মাসের Google AI Pro — <span className="text-brand-blue font-bold">মাত্র ৳499</span>
            </p>
            <p className="text-sm text-brand-body leading-relaxed mb-6 max-w-md">
              কাজ, পড়াশোনা, সৃজনশীলতা ও প্রোডাক্টিভিটিতে নিন গুগলের সবচেয়ে শক্তিশালী AI-এর সহায়তা।
            </p>

            {/* Mini Trust Tags */}
            <div className="flex items-center gap-3 flex-wrap justify-center lg:justify-start">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-dark bg-white/90 border border-brand-border/80 px-3 py-1.5 rounded-full shadow-sm">
                <ShieldCheck className="w-3.5 h-3.5 text-brand-blue" />
                <span>নিরাপদ পেমেন্ট</span>
              </div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-dark bg-white/90 border border-brand-border/80 px-3 py-1.5 rounded-full shadow-sm">
                <Zap className="w-3.5 h-3.5 text-brand-indigo" />
                <span>দ্রুত অ্যাক্টিভেশন</span>
              </div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-dark bg-white/90 border border-brand-border/80 px-3 py-1.5 rounded-full shadow-sm">
                <Headphones className="w-3.5 h-3.5 text-brand-purple" />
                <span>২৪/৭ সাপোর্ট</span>
              </div>
            </div>
          </div>

          {/* Right: Big Price & Buy CTA */}
          <div className="lg:col-span-3 flex flex-col items-center lg:items-end text-center lg:text-right gap-3 border-t lg:border-t-0 lg:border-l border-brand-border/80 pt-6 lg:pt-0 lg:pl-6">
            <div>
              <div className="font-outfit text-4xl sm:text-5xl font-extrabold text-brand-dark tracking-tight leading-none">
                ৳499
              </div>
              <div className="text-xs font-semibold text-brand-muted mt-1 font-outfit">
                ≈ ৳28 / month only
              </div>
            </div>

            <button
              type="button"
              onClick={() => onOpenCheckout("18m")}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-brand-gradient hover:bg-brand-gradient-hover text-white text-base font-semibold px-8 py-3.5 rounded-xl shadow-glow hover:shadow-lg transition-all cursor-pointer hover:-translate-y-0.5"
            >
              <span>এখনই কিনুন</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-1.5 text-xs text-brand-muted font-medium">
              <Lock className="w-3.5 h-3.5" />
              <span>100% নিরাপদ পেমেন্ট</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
