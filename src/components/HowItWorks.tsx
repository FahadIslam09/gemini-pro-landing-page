"use client";

import React from "react";
import { ShoppingCart, CreditCard, ShieldCheck, ArrowRight } from "lucide-react";

interface HowItWorksProps {
  price18m?: number;
}

export default function HowItWorks({ price18m = 499 }: HowItWorksProps) {
  const steps = [
    {
      num: "01",
      title: "অর্ডার করুন",
      desc: "আপনার জিমেইল এড্রেস ও প্রয়োজনীয় তথ্য দিয়ে সহজ ফর্মটি পূরণ করুন।",
      icon: <ShoppingCart className="w-6 h-6 text-brand-purple" />,
      bubbleBg: "bg-[#F3EEFB]",
    },
    {
      num: "02",
      title: "পেমেন্ট করুন",
      desc: `bKash, Nagad বা Rocket-এর মাধ্যমে মাত্র ৳${price18m} পেমেন্ট করুন।`,
      icon: <CreditCard className="w-6 h-6 text-brand-blue" />,
      bubbleBg: "bg-[#EBF2FE]",
    },
    {
      num: "03",
      title: "অ্যাক্সেস পান",
      desc: "পেমেন্ট যাচাইয়ের ৫-১৫ মিনিটের মধ্যেই আপনার গুগল একাউন্টে ফুল অ্যাক্সেস এক্টিভ হবে।",
      icon: <ShieldCheck className="w-6 h-6 text-brand-success" />,
      bubbleBg: "bg-[#EAF7EE]",
    },
  ];

  return (
    <section id="how-it-works" className="py-20 lg:py-28 bg-brand-alt border-y border-brand-border/60">
      <div className="max-w-[1080px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-brand-dark tracking-tight mb-4">
            কিভাবে কাজ করে?
          </h2>
          <p className="text-base sm:text-lg text-brand-muted leading-relaxed">
            মাত্র ৩টি সহজ ধাপে আপনার পার্সোনাল জিমেইল একাউন্টেই সাবস্ক্রিপশন বুঝে নিন
          </p>
        </div>

        {/* 3 Steps Grid with modern connectors */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {steps.map((step, idx) => (
            <div
              key={step.num}
              className="bg-white border border-brand-border hover:border-brand-indigo/30 rounded-2xl p-7 flex flex-col items-center text-center shadow-soft hover:shadow-card-hover transition-all duration-200 relative group"
            >
              {/* Circular Icon Bubble with Number */}
              <div className={`relative w-16 h-16 rounded-full ${step.bubbleBg} flex items-center justify-center mb-5 group-hover:scale-105 transition-transform`}>
                <span className="absolute -top-1 -right-1 bg-white border border-brand-border text-brand-dark text-[11px] font-bold w-6 h-6 rounded-full flex items-center justify-center shadow-sm font-outfit">
                  {step.num}
                </span>
                {step.icon}
              </div>

              {/* Title & Desc */}
              <h3 className="text-xl font-bold text-brand-dark mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-brand-body leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
