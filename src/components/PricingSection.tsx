"use client";

import React, { useState } from "react";
import { Check, Lock, Sparkles, ArrowRight, ShieldCheck, Users } from "lucide-react";

interface PricingSectionProps {
  onOpenCheckout: (plan?: string) => void;
}

export default function PricingSection({ onOpenCheckout }: PricingSectionProps) {
  const [selectedPlan, setSelectedPlan] = useState<"1m" | "18m">("18m");

  const sharedPerks = [
    "Gemini 3.1 Pro (1M টোকেন কনটেক্সট উইন্ডো)",
    "Deep Research অটোনোমাস ব্রাউজিং ও রিসার্চ এজেন্ট",
    "Google Workspace AI (Gmail, Docs, Sheets, Slides)",
    "৫ টেরাবাইট (5,000 GB) Google One ক্লাউড স্টোরেজ",
    "পরিবারের ৫ জন সদস্যের সাথে ক্লাউড শেয়ারিং সুবিধা",
    "Veo 3.1 4K সিনেমাটিক ভিডিও ও Lyria 3 মিউজিক",
    "Google Antigravity & Jules কোডিং সুপারপাওয়ার",
    "YouTube Premium ব্যাকগ্রাউন্ড প্লে ও বিজ্ঞাপনহীন সুবিধা",
  ];

  const plans = [
    {
      id: "1m",
      name: "১ মাসের সাবস্ক্রিপশন",
      price: 149,
      monthlyBreakdown: "৳149 / মাস",
      badge: "ট্রায়াল প্যাক",
      badgeColor: "bg-gray-100 text-gray-700 border-gray-200",
      description: "স্বল্পমেয়াদী ট্রায়াল ও ফিচারগুলো টেস্ট করার জন্য উপযুক্ত।",
      accountType: {
        title: "ফ্যামিলি ইনভাইটেশন (Google Family Group)",
        subtitle: "গুগল ফ্যামিলি গ্রুপের মাধ্যমে আপনার বর্তমান জিমেইলে এক্সেস যুক্ত হবে।",
        icon: Users,
        style: "bg-blue-50/80 border-blue-200/90 text-brand-blue",
      },
      durationPerk: "১ মাসের ফুল অ্যাক্টিভেশন ও সাপোর্ট",
      popular: false,
    },
    {
      id: "18m",
      name: "১৮ মাসের মেগা অফার",
      price: 499,
      monthlyBreakdown: "≈ ৳28 / মাস মাত্র",
      badge: "সেরা মূল্য • ৮৫% ছাড়",
      badgeColor: "bg-[#FEF6EA] text-[#B45309] border-[#FDE68A]",
      description: "সবচেয়ে বেশি বিক্রি হওয়া এবং সর্বোচ্চ সাশ্রয়ী অফিসিয়াল মেগা প্ল্যান।",
      accountType: {
        title: "১০০% নিজস্ব প্রাইভেট অ্যাকাউন্ট (Private Account)",
        subtitle: "সম্পূর্ণ নিজস্ব প্রাইভেট একাউন্ট — শুধুমাত্র আপনার একক ও নিরাপদ এক্সেস।",
        icon: ShieldCheck,
        style: "bg-purple-50/90 border-brand-purple/30 text-brand-purple",
      },
      durationPerk: "১৮ মাসের পূর্ণ গ্যারান্টিযুক্ত মেগা প্যাক",
      popular: true,
    },
  ];

  return (
    <section id="pricing" className="py-20 lg:py-28 bg-brand-surface relative overflow-hidden">
      <div className="max-w-[1180px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-brand-purple/10 border border-brand-purple/20 rounded-full px-3.5 py-1 text-xs font-semibold text-brand-purple mb-4 font-outfit">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Transparent Subscription Plans</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-brand-dark tracking-tight mb-4">
            আপনার পছন্দের <span className="gradient-text">প্ল্যান বেছে নিন</span>
          </h2>
          <p className="text-base sm:text-lg text-brand-muted leading-relaxed">
            কোনো লুকায়িত চার্জ নেই। bKash, Nagad বা Rocket দিয়ে ৫-১৫ মিনিটে আপনার নিজস্ব জিমেইলে সক্রিয় করুন।
          </p>
        </div>

        {/* 2 Pricing Cards Grid (Balanced 2-Column Layout) */}
        <div className="grid grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto gap-8 items-stretch mb-16">
          {plans.map((plan) => {
            const AccountIcon = plan.accountType.icon;
            return (
              <div
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id as any)}
                className={`rounded-[28px] p-7 sm:p-8 flex flex-col justify-between transition-all duration-300 relative cursor-pointer ${
                  plan.popular
                    ? "bg-white border-2 border-brand-indigo shadow-[0_20px_50px_rgba(91,85,216,0.18)] ring-4 ring-brand-purple/10 md:-translate-y-2"
                    : "bg-white border border-brand-border hover:border-brand-border/80 shadow-soft hover:shadow-card-hover"
                }`}
              >
                {/* Popular Pill */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-brand-gradient text-white text-xs font-bold uppercase tracking-wider px-4 py-1 rounded-full shadow-md font-outfit">
                    Most Popular Choice
                  </div>
                )}

                <div>
                  {/* Badge & Title */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full border ${plan.badgeColor}`}>
                      {plan.badge}
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold text-brand-dark mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-brand-muted mb-6 leading-relaxed">
                    {plan.description}
                  </p>

                  {/* Big Price */}
                  <div className="mb-5 pb-5 border-b border-brand-border">
                    <div className="flex items-baseline gap-1 font-outfit">
                      <span className="text-2xl font-bold text-brand-blue">৳</span>
                      <span className="text-4xl sm:text-5xl font-extrabold text-brand-dark tracking-tight">
                        {plan.price}
                      </span>
                    </div>
                    <span className="text-xs font-semibold text-brand-blue bg-brand-blue/10 px-2.5 py-0.5 rounded-full inline-block mt-2 font-outfit">
                      {plan.monthlyBreakdown}
                    </span>
                  </div>

                  {/* Highlighted Account Type Callout Box */}
                  <div className={`mb-6 p-3.5 rounded-2xl border ${plan.accountType.style} flex items-start gap-3`}>
                    <AccountIcon className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-xs sm:text-sm font-bold">
                        {plan.accountType.title}
                      </strong>
                      <span className="block text-xs opacity-90 leading-relaxed mt-0.5">
                        {plan.accountType.subtitle}
                      </span>
                    </div>
                  </div>

                  {/* Complete Features Checklist (Identical for all cards) */}
                  <div className="space-y-3 mb-8">
                    <span className="text-xs font-bold uppercase tracking-wider text-brand-muted block mb-2 font-outfit">
                      What's included:
                    </span>
                    {sharedPerks.map((perk, i) => (
                      <div key={i} className="flex items-start gap-2.5">
                        <div className="w-5 h-5 rounded-full bg-brand-purple/10 text-brand-purple flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                        </div>
                        <span className="text-xs sm:text-sm font-medium text-brand-dark leading-snug">
                          {perk}
                        </span>
                      </div>
                    ))}
                    {/* Duration Perk */}
                    <div className="flex items-start gap-2.5 pt-1">
                      <div className="w-5 h-5 rounded-full bg-brand-success/15 text-brand-success flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                      </div>
                      <span className="text-xs sm:text-sm font-bold text-brand-success leading-snug">
                        {plan.durationPerk}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card CTA */}
                <div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenCheckout(plan.id);
                    }}
                    className={`w-full inline-flex items-center justify-center gap-2 font-semibold text-sm py-3.5 px-6 rounded-xl transition-all cursor-pointer ${
                      plan.popular
                        ? "bg-brand-gradient hover:bg-brand-gradient-hover text-white shadow-glow hover:shadow-lg hover:-translate-y-0.5"
                        : "bg-brand-surface hover:bg-brand-blue hover:text-white text-brand-dark border border-brand-border"
                    }`}
                  >
                    <span>এখনই সাবস্ক্রিপশন নিন</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <div className="flex items-center justify-center gap-1.5 text-[11px] text-brand-muted mt-3">
                    <Lock className="w-3.5 h-3.5 text-brand-muted" />
                    <span>১০০% নিরাপদ পেমেন্ট ও সাপোর্ট</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Reference Banner Card */}
        <div className="bg-gradient-to-r from-[#F0F4FF] via-[#F5F0FF] to-[#FAF5FF] border-1.5 border-[#E2E7F5] rounded-[28px] p-8 sm:p-10 shadow-gemini grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-4xl mx-auto">
          
          {/* Left: Big Price */}
          <div className="lg:col-span-4 flex flex-col items-start text-left border-b lg:border-b-0 lg:border-r border-brand-border/80 pb-6 lg:pb-0 lg:pr-6">
            <span className="text-sm font-semibold text-brand-muted mb-1 font-outfit">
              18 Months Private Account Offer
            </span>
            <div className="flex items-baseline gap-1 font-outfit mb-1">
              <span className="text-3xl font-bold text-brand-blue">৳</span>
              <span className="text-5xl sm:text-6xl font-extrabold gradient-text tracking-tight">
                499
              </span>
            </div>
            <span className="text-xs sm:text-sm font-semibold text-brand-blue bg-brand-blue/10 px-3 py-1 rounded-full font-outfit">
              ≈ ৳28/মাস মাত্র (৮৫% ছাড়)
            </span>
          </div>

          {/* Center: Key Highlights */}
          <div className="lg:col-span-5 space-y-2.5">
            {[
              "১০০% প্রাইভেট অ্যাকাউন্ট (শুধু আপনার একক এক্সেস)",
              "Gemini 3.1 Pro & Deep Research অ্যাক্সেস",
              "Google Workspace AI (Gmail, Docs, Sheets)",
              "5 TB Google One ক্লাউড স্টোরেজ (৫ জন শেয়ারিং)",
              "Veo 3.1 4K ভিডিও ও Lyria 3 মিউজিক",
              "YouTube Premium বিজ্ঞাপনহীন সুবিধা",
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full bg-brand-purple/10 text-brand-purple flex items-center justify-center flex-shrink-0">
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                </div>
                <span className="text-sm sm:text-base font-semibold text-brand-dark">
                  {item}
                </span>
              </div>
            ))}
          </div>

          {/* Right: CTA & Trust */}
          <div className="lg:col-span-3 flex flex-col items-center lg:items-end text-center lg:text-right gap-3">
            <div className="inline-flex items-center gap-1.5 bg-[#FEF6EA] border border-[#FDE68A] text-[#B45309] text-xs font-bold px-3 py-1 rounded-full">
              <span>সেরা মূল্য • প্রাইভেট অ্যাকাউন্ট</span>
            </div>
            <button
              type="button"
              onClick={() => onOpenCheckout("18m")}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-brand-gradient hover:bg-brand-gradient-hover text-white text-base font-semibold px-8 py-3.5 rounded-xl shadow-glow hover:shadow-lg transition-all cursor-pointer"
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
