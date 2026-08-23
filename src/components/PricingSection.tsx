"use client";

import React, { useState } from "react";
import { Check, Lock, Sparkles, ArrowRight, ShieldCheck, Users, KeyRound } from "lucide-react";

interface PricingSectionProps {
  onOpenCheckout: (plan?: string) => void;
}

export default function PricingSection({ onOpenCheckout }: PricingSectionProps) {
  const [selectedPlan, setSelectedPlan] = useState<"1m" | "12m" | "18m">("18m");
  const [livePrices, setLivePrices] = useState<Record<string, number>>({
    "1m": 149,
    "18m": 299,
    "12m": 399,
  });

  React.useEffect(() => {
    fetch("/api/public/pricing")
      .then((res) => res.json())
      .then((data) => {
        if (data?.plans && Array.isArray(data.plans)) {
          const map: Record<string, number> = {};
          data.plans.forEach((p: any) => {
            const key = p.planKey || p.plan_key;
            if (key && p.price !== undefined) {
              map[key] = Number(p.price);
            }
          });
          setLivePrices((prev) => ({ ...prev, ...map }));
        }
      })
      .catch(() => {});
  }, []);

  const plans = [
    {
      id: "1m",
      name: "১ মাসের সাবস্ক্রিপশন",
      price: livePrices["1m"] || 149,
      monthlyBreakdown: `৳${livePrices["1m"] || 149} / মাস`,
      badge: "ট্রায়াল প্যাক",
      badgeColor: "bg-gray-100 text-gray-700 border-gray-200",
      description: "স্বল্পমেয়াদী ট্রায়াল ও টেস্ট করার জন্য।",
      accountType: {
        title: "ফ্যামিলি ইনভাইটেশন (Google Family)",
        subtitle: "গুগল ফ্যামিলি গ্রুপ ইনভাইটের মাধ্যমে এক্সেস",
        icon: Users,
        style: "bg-blue-50/80 border-blue-200/80 text-brand-blue",
      },
      highlights: [
        "Gemini 3.1 Pro ও Deep Research অ্যাক্সেস",
        "5 TB ক্লাউড স্টোরেজ ও YouTube Premium",
        "১ মাসের সক্রিয় মেয়াদ ও সাপোর্ট",
      ],
      popular: false,
    },
    {
      id: "18m",
      name: "১৮ মাসের মেগা অফার",
      price: livePrices["18m"] || 299,
      monthlyBreakdown: `≈ ৳${Math.round((livePrices["18m"] || 299) / 18)} / মাস মাত্র`,
      badge: "সেরা মূল্য • ৮৫% ছাড়",
      badgeColor: "bg-[#FEF6EA] text-[#B45309] border-[#FDE68A]",
      description: "সর্বোচ্চ সাশ্রয়ী অফিসিয়াল মেগা প্ল্যান।",
      accountType: {
        title: "১০০% নিজস্ব প্রাইভেট অ্যাকাউন্ট",
        subtitle: "সম্পূর্ণ নিজস্ব অ্যাকাউন্ট (শুধু আপনার একক এক্সেস)",
        icon: ShieldCheck,
        style: "bg-purple-50/90 border-brand-purple/30 text-brand-purple",
      },
      highlights: [
        "Gemini 3.1 Pro ও Deep Research অ্যাক্সেস",
        "5 TB ক্লাউড স্টোরেজ ও YouTube Premium",
        "১৮ মাসের পূর্ণ মেগা প্যাক ও গ্যারান্টি",
      ],
      popular: true,
    },
    {
      id: "12m",
      name: "১২ মাসের সাবস্ক্রিপশন",
      price: livePrices["12m"] || 399,
      monthlyBreakdown: `≈ ৳${Math.round((livePrices["12m"] || 399) / 12)} / মাস`,
      badge: "বার্ষিক প্ল্যান",
      badgeColor: "bg-amber-50 text-amber-800 border-amber-200",
      description: "১ বছরের জন্য নির্ভরযোগ্য AI সমাধান।",
      accountType: {
        title: "জিমেইল ও পাসওয়ার্ড প্রয়োজন",
        subtitle: "অ্যাক্টিভেশনের জন্য জিমেইল ও পাসওয়ার্ড দিতে হবে",
        icon: KeyRound,
        style: "bg-amber-50/90 border-amber-300 text-amber-900",
      },
      highlights: [
        "Gemini 3.1 Pro ও Deep Research অ্যাক্সেস",
        "5 TB ক্লাউড স্টোরেজ ও YouTube Premium",
        "১২ মাসের সক্রিয় মেয়াদ ও সাপোর্ট",
      ],
      popular: false,
    },
  ];

  return (
    <section id="pricing" className="py-20 lg:py-28 bg-brand-surface relative overflow-hidden">
      <div className="max-w-[1180px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 bg-brand-purple/10 border border-brand-purple/20 rounded-full px-3.5 py-1 text-xs font-semibold text-brand-purple mb-4 font-outfit">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Transparent Subscription Plans</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-brand-dark tracking-tight mb-4">
            আপনার পছন্দের <span className="gradient-text">প্ল্যান বেছে নিন</span>
          </h2>
          <p className="text-base sm:text-lg text-brand-muted leading-relaxed">
            সকল প্ল্যানে Google AI Pro-এর পূর্ণ ফিচার অন্তর্ভুক্ত। পেমেন্ট সম্পন্ন করে জিমেইল লিংকে সক্রিয় করুন।
          </p>
        </div>

        {/* 3 Standard-Sized Clean Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch mb-14">
          {plans.map((plan) => {
            const AccountIcon = plan.accountType.icon;
            return (
              <div
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id as any)}
                className={`rounded-[26px] p-6 sm:p-7 flex flex-col justify-between h-full transition-all duration-300 relative cursor-pointer ${
                  plan.popular
                    ? "bg-white border-2 border-brand-indigo shadow-[0_20px_50px_rgba(91,85,216,0.18)] ring-4 ring-brand-purple/10 md:-translate-y-2"
                    : "bg-white border border-brand-border hover:border-brand-border/80 shadow-soft hover:shadow-card-hover"
                }`}
              >
                {/* Popular Pill */}
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-brand-gradient text-white text-[11px] font-bold uppercase tracking-wider px-3.5 py-1 rounded-full shadow-md font-outfit">
                    Most Popular Choice
                  </div>
                )}

                <div>
                  {/* Top Badge & Duration */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${plan.badgeColor}`}>
                      {plan.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-brand-dark mb-1">
                    {plan.name}
                  </h3>
                  <p className="text-xs text-brand-muted mb-4 leading-relaxed">
                    {plan.description}
                  </p>

                  {/* Price Block */}
                  <div className="mb-4 pb-4 border-b border-brand-border">
                    <div className="flex items-baseline gap-1 font-outfit">
                      <span className="text-2xl font-bold text-brand-blue">৳</span>
                      <span className="text-4xl sm:text-[42px] font-extrabold text-brand-dark tracking-tight leading-none">
                        {plan.price}
                      </span>
                    </div>
                    <span className="text-[11px] font-semibold text-brand-blue bg-brand-blue/10 px-2.5 py-0.5 rounded-full inline-block mt-2 font-outfit">
                      {plan.monthlyBreakdown}
                    </span>
                  </div>

                  {/* Highlighted Account Requirement Callout Box */}
                  <div className={`mb-5 p-3 rounded-xl border ${plan.accountType.style} flex items-start gap-2.5`}>
                    <AccountIcon className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-xs font-bold leading-snug">
                        {plan.accountType.title}
                      </strong>
                      <span className="block text-[11px] opacity-90 leading-tight mt-0.5">
                        {plan.accountType.subtitle}
                      </span>
                    </div>
                  </div>

                  {/* Concise 3-Bullet Core Highlights */}
                  <div className="space-y-2 mb-6">
                    {plan.highlights.map((highlight, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-brand-purple/10 text-brand-purple flex items-center justify-center flex-shrink-0">
                          <Check className="w-3 h-3 stroke-[2.5]" />
                        </div>
                        <span className="text-xs font-medium text-brand-dark leading-snug">
                          {highlight}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom CTA Button */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenCheckout(plan.id);
                    }}
                    className={`w-full inline-flex items-center justify-center gap-2 font-semibold text-sm py-3 px-5 rounded-xl transition-all cursor-pointer ${
                      plan.popular
                        ? "bg-brand-gradient hover:bg-brand-gradient-hover text-white shadow-glow hover:shadow-lg hover:-translate-y-0.5"
                        : "bg-brand-surface hover:bg-brand-blue hover:text-white text-brand-dark border border-brand-border"
                    }`}
                  >
                    <span>এখনই কিনুন</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <div className="flex items-center justify-center gap-1.5 text-[11px] text-brand-muted mt-2.5">
                    <Lock className="w-3 h-3 text-brand-muted" />
                    <span>১০০% নিরাপদ পেমেন্ট ও সাপোর্ট</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Reference Banner Card */}
        <div className="bg-gradient-to-r from-[#F0F4FF] via-[#F5F0FF] to-[#FAF5FF] border-1.5 border-[#E2E7F5] rounded-[28px] p-6 sm:p-8 shadow-gemini grid grid-cols-1 lg:grid-cols-12 gap-6 items-center max-w-4xl mx-auto">
          
          {/* Left: Big Price */}
          <div className="lg:col-span-4 flex flex-col items-start text-left border-b lg:border-b-0 lg:border-r border-brand-border/80 pb-4 lg:pb-0 lg:pr-6">
            <span className="text-xs sm:text-sm font-semibold text-brand-muted mb-1 font-outfit">
              18 Months Private Account Offer
            </span>
            <div className="flex items-baseline gap-1 font-outfit mb-1">
              <span className="text-2xl font-bold text-brand-blue">৳</span>
              <span className="text-4xl sm:text-5xl font-extrabold gradient-text tracking-tight">
                {livePrices["18m"] || 299}
              </span>
            </div>
            <span className="text-xs font-semibold text-brand-blue bg-brand-blue/10 px-2.5 py-0.5 rounded-full font-outfit">
              ≈ ৳{Math.round((livePrices["18m"] || 299) / 18)}/মাস মাত্র (৮৫% ছাড়)
            </span>
          </div>

          {/* Center: Key Highlights */}
          <div className="lg:col-span-5 space-y-2">
            {[
              "১০০% প্রাইভেট অ্যাকাউন্ট (শুধু আপনার একক এক্সেস)",
              "Gemini 3.1 Pro & Deep Research ফুল অ্যাক্সেস",
              "5 TB ক্লাউড স্টোরেজ ও YouTube Premium",
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-brand-purple/10 text-brand-purple flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 stroke-[2.5]" />
                </div>
                <span className="text-xs sm:text-sm font-semibold text-brand-dark">
                  {item}
                </span>
              </div>
            ))}
          </div>

          {/* Right: CTA & Trust */}
          <div className="lg:col-span-3 flex flex-col items-center lg:items-end text-center lg:text-right gap-2.5">
            <div className="inline-flex items-center gap-1.5 bg-[#FEF6EA] border border-[#FDE68A] text-[#B45309] text-[11px] font-bold px-2.5 py-0.5 rounded-full">
              <span>সেরা মূল্য • প্রাইভেট অ্যাকাউন্ট</span>
            </div>
            <button
              type="button"
              onClick={() => onOpenCheckout("18m")}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-brand-gradient hover:bg-brand-gradient-hover text-white text-sm font-semibold px-6 py-3 rounded-xl shadow-glow hover:shadow-lg transition-all cursor-pointer"
            >
              <span>এখনই কিনুন</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
