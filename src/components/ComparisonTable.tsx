"use client";

import React from "react";
import { Check, X, ArrowRight, Sparkles } from "lucide-react";

interface ComparisonTableProps {
  onOpenCheckout: (plan?: string) => void;
}

export default function ComparisonTable({ onOpenCheckout }: ComparisonTableProps) {
  const rows = [
    {
      feature: "AI মডেল ও সক্ষমতা",
      free: "সাধারণ Gemini Flash",
      pro: "Gemini 3.1 Pro (ফ্ল্যাগশিপ)",
      highlight: true,
    },
    {
      feature: "কনটেক্সট উইন্ডো (মেমরি সাইজ)",
      free: "৩২,০০০ টোকেন",
      pro: "১,০০০,০০০ টোকেন (১ মিলিয়ন)",
      highlight: true,
    },
    {
      feature: "ব্যবহারের লিমিট ও স্পিড",
      free: "১x স্ট্যান্ডার্ড লিমিট",
      pro: "৪x এক্সপ্যান্ডেড লিমিট + ফাস্ট স্পিড",
      highlight: true,
    },
    {
      feature: "Deep Research (অটোনোমাস রিসার্চ)",
      free: false,
      pro: "আনলিমিটেড মাল্টি-পেজ রিসার্চ রিপোর্ট",
      highlight: true,
    },
    {
      feature: "Gemini Spark (২৪/৭ পার্সোনাল এজেন্ট)",
      free: false,
      pro: "ডিজিটাল টাস্ক এক্সিকিউশন সক্রিয়",
      highlight: false,
    },
    {
      feature: "Google Workspace AI (Gmail, Docs, Sheets)",
      free: false,
      pro: "Help me write, AI overview ও সূত্র তৈরি",
      highlight: true,
    },
    {
      feature: "Veo 3.1 ও Lyria 3 (ভিডিও ও গান তৈরি)",
      free: false,
      pro: "সিনেম্যাটিক 4K ভিডিও ও ভোকাল গান",
      highlight: false,
    },
    {
      feature: "Google Antigravity & Jules (কোডিং এজেন্ট)",
      free: "সীমিত চ্যাট",
      pro: "মাল্টি-এজেন্ট IDE ও গিটহাব PR অটোমেশন",
      highlight: false,
    },
    {
      feature: "গুগল ক্লাউড ডেভেলপার ক্রেডিট",
      free: "০ ডলার",
      pro: "$10 মাসিক ক্লাউড ক্রেডিট",
      highlight: false,
    },
    {
      feature: "Google One ক্লাউড স্টোরেজ",
      free: "১৫ GB মাত্র",
      pro: "৫,০০০ GB (৫ টেরাবাইট)",
      highlight: true,
    },
    {
      feature: "ফ্যামিলি মেম্বার শেয়ারিং",
      free: "প্রযোজ্য নয়",
      pro: "সর্বোচ্চ ৫ জন ফ্যামিলি মেম্বার",
      highlight: false,
    },
    {
      feature: "YouTube Premium সুবিধা",
      free: false,
      pro: "অ্যাড-ফ্রি ও ব্যাকগ্রাউন্ড প্লে",
      highlight: true,
    },
    {
      feature: "১৮ মাসের অফার মূল্য",
      free: "৳০ (অত্যন্ত সীমিত)",
      pro: "৳৪৯৯ মাত্র (৮৫% ছাড়)",
      highlight: true,
    },
  ];

  return (
    <section id="comparison" className="py-20 lg:py-28 bg-white border-y border-brand-border">
      <div className="max-w-[1040px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-14 reveal-init">
          <div className="inline-flex items-center gap-2 bg-brand-purple/10 border border-brand-purple/20 rounded-full px-3.5 py-1 text-xs font-semibold text-brand-purple mb-4 font-outfit">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Feature Comparison Matrix</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-brand-dark tracking-tight mb-4">
            ফ্রি Gemini বনাম <span className="gradient-text">Google AI Pro</span>
          </h2>
          <p className="text-base sm:text-lg text-brand-body leading-relaxed">
            এক নজরে দেখে নিন কেন গুগল এআই প্রো আপনার কাজ ও ক্যারিয়ারে এক অনন্য সুপারপাওয়ার।
          </p>
        </div>

        {/* Comparison Table Card */}
        <div className="reveal-init reveal-scale bg-white border border-brand-border rounded-3xl shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[620px]">
              <thead>
                <tr className="border-b border-brand-border bg-[#F8F9FD]">
                  <th className="py-5 px-6 text-sm font-bold text-brand-dark w-1/2">
                    ফিচার ও সুবিধাসমূহ
                  </th>
                  <th className="py-5 px-6 text-sm font-semibold text-brand-muted text-center w-1/4">
                    ফ্রি একাউন্ট
                  </th>
                  <th className="py-5 px-6 text-sm font-bold text-brand-purple text-center w-1/4 bg-brand-purple/[0.04]">
                    <div className="flex items-center justify-center gap-1.5 font-outfit text-base">
                      <Sparkles className="w-4 h-4 text-brand-purple" />
                      <span>Google AI Pro</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border text-sm">
                {rows.map((row, idx) => (
                  <tr
                    key={idx}
                    className={`transition-colors hover:bg-slate-50/70 ${
                      row.highlight ? "bg-brand-surface/40 font-medium" : ""
                    }`}
                  >
                    <td className="py-4 px-6 text-brand-dark font-medium">
                      {row.feature}
                    </td>

                    {/* Free Column */}
                    <td className="py-4 px-6 text-center text-brand-muted">
                      {typeof row.free === "boolean" ? (
                        row.free ? (
                          <Check className="w-5 h-5 text-brand-success mx-auto" />
                        ) : (
                          <X className="w-4 h-4 text-gray-300 mx-auto" />
                        )
                      ) : (
                        <span>{row.free}</span>
                      )}
                    </td>

                    {/* Pro Column */}
                    <td className="py-4 px-6 text-center bg-brand-purple/[0.03] text-brand-dark font-semibold">
                      {typeof row.pro === "boolean" ? (
                        row.pro ? (
                          <Check className="w-5 h-5 text-brand-purple mx-auto" />
                        ) : (
                          <X className="w-4 h-4 text-gray-300 mx-auto" />
                        )
                      ) : (
                        <span className={row.highlight ? "text-brand-purple font-bold" : ""}>
                          {row.pro}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table Bottom Footer CTA */}
          <div className="bg-[#F8F9FD] p-6 border-t border-brand-border flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <span className="font-bold text-brand-dark text-base block">
                ১৮ মাসের ফুল সাবস্ক্রিপশন মাত্র ৳৪৯৯
              </span>
              <span className="text-xs text-brand-muted">
                ১০০% নিরাপদ ও নিজস্ব জিমেইলে এক্টিভেশন গ্যারান্টি
              </span>
            </div>
            <button
              type="button"
              onClick={() => onOpenCheckout("18m")}
              className="inline-flex items-center gap-2 bg-brand-gradient hover:bg-brand-gradient-hover text-white text-sm font-semibold px-6 py-3 rounded-xl shadow-glow hover:shadow-lg transition-all"
            >
              <span>Google AI Pro নিন</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
