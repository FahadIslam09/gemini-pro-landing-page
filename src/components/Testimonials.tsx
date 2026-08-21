"use client";

import React from "react";
import { Star, ShieldCheck, Clock, Users, CheckCircle2 } from "lucide-react";

export default function Testimonials() {
  const reviews = [
    {
      name: "তানভীর আহমেদ",
      role: "সফটওয়্যার ইঞ্জিনিয়ার, ঢাকা",
      avatarBg: "bg-blue-100 text-brand-blue",
      content:
        "Gemini 3.1 Pro কোডিং এবং বড় আর্কিটেকচার পর্যালোচনায় অসাধারণ কাজ করে। সাথে ৫ টেরাবাইট ক্লাউড স্টোরেজ পাওয়ার পর আমার সমস্ত প্রোজেক্ট ফাইল ব্যাকআপ নিরাপদ হয়েছে। মাত্র ৳499-এ এত সুবিধা অবিশ্বাস্য!",
      rating: 5,
    },
    {
      name: "নুসরাত জাহান",
      role: "গবেষক ও ঢাবি শিক্ষার্থী",
      avatarBg: "bg-purple-100 text-brand-purple",
      content:
        "আমার থিসিস পেপার এবং লিটারেচার রিভিউর জন্য ১ মিলিয়ন কনটেক্সট উইন্ডো ও Deep Research লাইফসেভার ছিল। আর পেমেন্ট করার ১০ মিনিটের মধ্যেই একাউন্টে সাবস্ক্রিপশন এক্টিভ হয়ে গেছে। অনেক ধন্যবাদ!",
      rating: 5,
    },
    {
      name: "শাকিল মাহমুদ",
      role: "ডিজিটাল মার্কেটার ও কন্টেন্ট ক্রিয়েটর",
      avatarBg: "bg-emerald-100 text-brand-success",
      content:
        "YouTube Premium-এ নো-অ্যাডস আর ব্যাকগ্রাউন্ড প্লে কন্টেন্ট রিসার্চে দারুণ সাহায্য করে। সাথে Veo 3.1 ও Lyria 3 দিয়ে ভিডিও ও ব্যাকগ্রাউন্ড মিউজিক নিমিষেই বানিয়ে ফেলি।",
      rating: 5,
    },
  ];

  return (
    <section id="testimonials" className="py-20 lg:py-28 bg-brand-surface">
      <div className="max-w-[1180px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 reveal-init">
          <div className="inline-flex items-center gap-2 bg-brand-success/10 border border-brand-success/20 rounded-full px-3.5 py-1 text-xs font-semibold text-brand-success mb-4 font-outfit">
            <Users className="w-3.5 h-3.5" />
            <span>Community Trust</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-brand-dark tracking-tight mb-4">
            আমাদের ব্যবহারকারীদের <span className="gradient-text">মতামত</span>
          </h2>
          <p className="text-base sm:text-lg text-brand-muted leading-relaxed">
            বাংলাদেশের শত শত প্রফেশনাল ও শিক্ষার্থী প্রতিদিন Google AI Pro দিয়ে তাদের প্রোডাক্টিভিটি বৃদ্ধি করছেন।
          </p>
        </div>

        {/* Trust Stats Counter Bar */}
        <div className="reveal-init reveal-scale grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-brand-alt border border-brand-border rounded-2xl mb-12 shadow-sm">
          <div className="text-center">
            <span className="font-outfit text-2xl sm:text-3xl font-extrabold text-brand-dark block">
              10,000+
            </span>
            <span className="text-xs sm:text-sm font-medium text-brand-muted">
              অ্যাক্টিভ গ্রাহক
            </span>
          </div>
          <div className="text-center">
            <span className="font-outfit text-2xl sm:text-3xl font-extrabold text-brand-purple block">
              4.9 / 5.0
            </span>
            <span className="text-xs sm:text-sm font-medium text-brand-muted">
              সন্তুষ্টি রেটিং
            </span>
          </div>
          <div className="text-center">
            <span className="font-outfit text-2xl sm:text-3xl font-extrabold text-brand-blue block">
              5–15 Min
            </span>
            <span className="text-xs sm:text-sm font-medium text-brand-muted">
              ডেলিভারি সময়
            </span>
          </div>
          <div className="text-center">
            <span className="font-outfit text-2xl sm:text-3xl font-extrabold text-brand-success block">
              100%
            </span>
            <span className="text-xs sm:text-sm font-medium text-brand-muted">
              মানিব্যাক নিশ্চয়তা
            </span>
          </div>
        </div>

        {/* 3 Review Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((rev, i) => (
            <div
              key={i}
              className={`reveal-init stagger-${i + 1} reveal-scale bg-white border border-brand-border hover:border-brand-border/80 rounded-2xl p-7 shadow-soft hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between`}
            >
              <div>
                {/* 5 Stars */}
                <div className="flex items-center gap-1 text-brand-accent mb-4">
                  {[...Array(rev.rating)].map((_, idx) => (
                    <Star key={idx} className="w-4 h-4 fill-brand-accent" />
                  ))}
                </div>
                {/* Content */}
                <p className="text-sm text-brand-body leading-relaxed mb-6">
                  "{rev.content}"
                </p>
              </div>

              {/* User Bio */}
              <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                <div className={`w-10 h-10 rounded-full font-bold text-sm flex items-center justify-center ${rev.avatarBg}`}>
                  {rev.name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-brand-dark leading-tight">
                    {rev.name}
                  </h4>
                  <span className="text-xs text-brand-muted">
                    {rev.role}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
