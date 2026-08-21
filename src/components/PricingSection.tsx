"use client";

import React, { useState, useEffect } from "react";
import { Check, Lock, Sparkles, ArrowRight, ShieldCheck, Users, KeyRound } from "lucide-react";

interface PricingSectionProps {
  onOpenCheckout: (plan?: string) => void;
}

const DEFAULT_PLANS = [
  {
    id: "1m",
    name: "১ মাসের সাবস্ক্রিপশন",
    price: 149,
    monthlyBreakdown: "৳149 / মাস",
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
    price: 499,
    monthlyBreakdown: "≈ ৳28 / মাস মাত্র",
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
    price: 399,
    monthlyBreakdown: "≈ ৳33 / মাস",
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

export default function PricingSection({ onOpenCheckout }: PricingSectionProps) {
  const [plans, setPlans] = useState<any[]>(DEFAULT_PLANS);
  const [selectedPlan, setSelectedPlan] = useState<string>("18m");

  useEffect(() => {
    fetch("/api/public/pricing")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.plans?.length > 0) {
          const mapped = data.plans.map((p: any) => ({
            id: p.planKey,
            name: p.name,
            price: p.price,
            monthlyBreakdown: p.monthlyBreakdown,
            badge: p.badge,
            badgeColor: p.badgeColor,
            description: p.description,
            accountType: {
              title: p.accountTypeTitle,
              subtitle: p.accountTypeSubtitle,
              icon: p.accountTypeIcon === "Users" ? Users : p.accountTypeIcon === "KeyRound" ? KeyRound : ShieldCheck,
              style: p.accountTypeStyle,
            },
            highlights: Array.isArray(p.highlights) ? p.highlights : [],
            popular: p.popular,
          }));

          // Strict left-to-right order: 1m Left, 18m Middle/Featured, 12m Right
          const customOrder = ["1m", "18m", "12m"];
          mapped.sort((a: any, b: any) => {
            const indexA = customOrder.indexOf(a.id);
            const indexB = customOrder.indexOf(b.id);
            return (indexA === -1 ? 99 : indexA) - (indexB === -1 ? 99 : indexB);
          });

          setPlans(mapped);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section id="pricing" className="py-20 lg:py-28 bg-[#FAFBFD] relative overflow-hidden">
      
      {/* Background Subtle Gradient Blobs */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-brand-purple/5 rounded-full blur-3xl -ml-40 pointer-events-none" />
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-brand-blue/5 rounded-full blur-3xl -mr-40 pointer-events-none" />

      <div className="max-w-[1180px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 reveal-init">
          <div className="inline-flex items-center gap-2 bg-brand-purple/10 border border-brand-purple/20 rounded-full px-3.5 py-1 text-xs font-semibold text-brand-purple mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>অফিসিয়াল ও সাশ্রয়ী সাবস্ক্রিপশন প্ল্যান</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-brand-dark tracking-tight mb-4">
            আপনার পছন্দের <span className="gradient-text">প্ল্যান বেছে নিন</span>
          </h2>
          <p className="text-base sm:text-lg text-brand-muted leading-relaxed">
            সকল প্ল্যানে Google AI Pro-এর পূর্ণ ফিচার অন্তর্ভুক্ত। bKash, Nagad বা Rocket দিয়ে ৫-১৫ মিনিটে সক্রিয় করুন।
          </p>
        </div>

        {/* 3 Standard-Sized Clean Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch mb-14">
          {plans.map((plan, idx) => {
            const AccountIcon = plan.accountType.icon;
            return (
              <div
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id)}
                className={`reveal-init stagger-${idx + 1} reveal-scale rounded-[26px] p-6 sm:p-7 flex flex-col justify-between h-full transition-all duration-300 relative cursor-pointer ${
                  plan.popular
                    ? "bg-white border-2 border-brand-indigo shadow-[0_20px_50px_rgba(91,85,216,0.18)] ring-4 ring-brand-purple/10 md:-translate-y-2 hover:shadow-[0_25px_60px_rgba(91,85,216,0.25)]"
                    : "bg-white border border-brand-border hover:border-brand-border/80 shadow-soft hover:shadow-card-hover hover:-translate-y-1"
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
                    {plan.highlights.map((highlight: string, i: number) => (
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
                </div>
              </div>
            );
          })}
        </div>

        {/* Trust Badges Footnote */}
        <div className="reveal-init max-w-2xl mx-auto flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs text-brand-muted border-t border-brand-border/60 pt-8">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-brand-purple" />
            <span>১০০% অফিসিয়াল এক্সেস গ্যারান্টি</span>
          </div>
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-brand-blue" />
            <span>নিরাপদ পেমেন্ট গেটওয়ে</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-brand-success" />
            <span>লাইভ সাপোর্ট ও ইনস্ট্যান্ট রিপ্লেসমেন্ট</span>
          </div>
        </div>
      </div>
    </section>
  );
}
