"use client";

import React, { useState, useEffect } from "react";
import { Check, Lock, Sparkles, ArrowRight, ShieldCheck, Users, KeyRound } from "lucide-react";

interface PricingSectionProps {
  onOpenCheckout: (plan?: string) => void;
  initialPlans?: any[] | null;
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

const mapPlans = (rawPlans: any[]) => {
  const mapped = rawPlans.map((p: any) => ({
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

  const customOrder = ["1m", "18m", "12m"];
  mapped.sort((a: any, b: any) => {
    const indexA = customOrder.indexOf(a.id);
    const indexB = customOrder.indexOf(b.id);
    return (indexA === -1 ? 99 : indexA) - (indexB === -1 ? 99 : indexB);
  });
  return mapped;
};

export default function PricingSection({ onOpenCheckout, initialPlans }: PricingSectionProps) {
  const [plans, setPlans] = useState<any[]>(() => {
    if (initialPlans && initialPlans.length > 0) {
      return mapPlans(initialPlans);
    }
    return DEFAULT_PLANS;
  });
  const [selectedPlan, setSelectedPlan] = useState<string>("18m");

  useEffect(() => {
    if (initialPlans && initialPlans.length > 0) {
      setPlans(mapPlans(initialPlans));
    }
  }, [initialPlans]);

  return (
    <section id="pricing" className="py-20 lg:py-28 bg-[#FAFBFD] relative overflow-hidden">
      
      {/* Background Subtle Gradient Blobs */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-brand-purple/5 rounded-full blur-3xl -ml-40 pointer-events-none" />
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-brand-blue/5 rounded-full blur-3xl -mr-40 pointer-events-none" />

      <div className="max-w-[1180px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-brand-blue/10 border border-brand-blue/20 rounded-full px-4 py-1.5 text-xs font-semibold text-brand-blue mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>স্বচ্ছ ও সাশ্রয়ী প্রাইসিং</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-brand-dark tracking-tight mb-4 font-bangla">
            আপনার প্রয়োজন অনুযায়ী সেরা প্ল্যান বেছে নিন
          </h2>
          <p className="text-base text-brand-body leading-relaxed font-bangla">
            কোনো লুকানো চার্জ নেই। ১০০% অফিশিয়াল সাবস্ক্রিপশন গ্যারান্টি এবং সার্বক্ষণিক টেকনিক্যাল সাপোর্ট।
          </p>
        </div>

        {/* Pricing Cards Grid (Strict Order: 1 Month -> 18 Months Featured -> 12 Months) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch mb-12">
          {plans.map((plan) => {
            const isFeatured = plan.popular || plan.id === "18m";
            const AccountIcon = plan.accountType.icon;

            return (
              <div
                key={plan.id}
                className={`relative rounded-3xl transition-all duration-300 flex flex-col justify-between ${
                  isFeatured
                    ? "bg-white border-2 border-brand-purple shadow-xl shadow-brand-purple/10 md:-translate-y-2 z-10"
                    : "bg-white border border-brand-border hover:border-gray-300 hover:shadow-lg"
                }`}
              >
                {/* Popular / Best Value Ribbon */}
                {isFeatured && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-brand-gradient text-white text-xs font-bold px-4 py-1 rounded-full shadow-md tracking-wide uppercase">
                    Most Popular & Recommended
                  </div>
                )}

                <div className="p-6 sm:p-8 flex-1 flex flex-col">
                  {/* Plan Top Meta */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border font-bangla ${plan.badgeColor || "bg-gray-100 text-gray-700 border-gray-200"}`}>
                      {plan.badge}
                    </span>
                  </div>

                  {/* Plan Name */}
                  <h3 className="text-xl font-bold text-brand-dark mb-2 font-bangla">
                    {plan.name}
                  </h3>
                  <p className="text-xs text-brand-muted mb-6 leading-relaxed font-bangla">
                    {plan.description}
                  </p>

                  {/* Price Tag */}
                  <div className="mb-6 pb-6 border-b border-gray-100">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl sm:text-5xl font-extrabold text-brand-dark tracking-tight font-outfit">
                        ৳{plan.price}
                      </span>
                      <span className="text-xs text-brand-muted font-medium font-bangla">
                        / এককালীন
                      </span>
                    </div>
                    <span className="inline-block mt-1 text-xs font-semibold text-brand-blue font-outfit">
                      {plan.monthlyBreakdown}
                    </span>
                  </div>

                  {/* Account Type Highlight Box */}
                  <div className={`p-3.5 rounded-2xl border mb-6 flex items-start gap-3 ${plan.accountType.style}`}>
                    <AccountIcon className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold leading-tight font-bangla">
                        {plan.accountType.title}
                      </h4>
                      <p className="text-[11px] opacity-85 mt-0.5 leading-snug font-bangla">
                        {plan.accountType.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Highlights Checklist */}
                  <div className="space-y-3 mb-8 flex-1">
                    <span className="text-xs font-bold text-brand-dark block uppercase tracking-wider font-bangla">
                      প্ল্যানের মূল সুবিধাসমূহ:
                    </span>
                    {plan.highlights.map((highlight: string, idx: number) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs text-brand-body leading-snug">
                        <div className="w-4 h-4 rounded-full bg-green-50 text-green-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                        <span className="font-bangla">{highlight}</span>
                      </div>
                    ))}
                  </div>

                  {/* Action CTA Button */}
                  <button
                    type="button"
                    onClick={() => onOpenCheckout(plan.id)}
                    className={`w-full py-3.5 px-6 rounded-2xl font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
                      isFeatured
                        ? "bg-brand-gradient hover:bg-brand-gradient-hover text-white shadow-glow hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
                        : "bg-[#F4F6FC] hover:bg-brand-blue hover:text-white text-brand-dark"
                    }`}
                  >
                    <span className="font-bangla">এখনই সাবস্ক্রাইব করুন</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Trust Guarantee Badge */}
        <div className="bg-white border border-brand-border rounded-2xl p-5 max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-3 text-center sm:text-left shadow-sm">
          <div className="w-10 h-10 rounded-full bg-brand-blue/10 text-brand-blue flex items-center justify-center flex-shrink-0">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-brand-dark font-bangla">
              ১০০% ঝুঁকিমুক্ত রিপ্লেসমেন্ট ও অফিসিয়াল মানিব্যাক নিশ্চয়তা
            </h4>
            <p className="text-[11px] text-brand-muted font-bangla">
              যেকোনো অ্যাকাউন্টিং সমস্যায় সাথে সাথে রিপ্লেসমেন্ট এবং সার্বক্ষণিক হোয়াটসঅ্যাপ সাপোর্ট।
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
