"use client";

import React from "react";
import {
  Sparkles,
  Search,
  Video,
  Code2,
  HardDrive,
  CheckCircle2,
  Zap,
} from "lucide-react";

export default function WhyGemini() {
  const cards = [
    {
      id: "gemini-model",
      badge: "Gemini 3.1 Pro",
      title: "1M টোকেন কনটেক্সট উইন্ডো",
      description:
        "একসাথে ১ ঘণ্টার ভিডিও, ১,৫০০ পৃষ্ঠার ডকুমেন্ট বা পুরো কোডবেস আপলোড করে নিমিষেই নিখুঁত বিশ্লেষণ ও উত্তর পান।",
      icon: <Sparkles className="w-6 h-6 text-brand-purple" />,
      features: [
        "গুগলের ফ্ল্যাগশিপ 3.1 Pro মডেল",
        "জটিল গাণিতিক ও লজিক্যাল রিজনিং",
        "মাল্টিমোডাল ফাইল প্রসেসিং",
      ],
      colorClass: "from-purple-500/10 to-indigo-500/10 border-purple-200/60",
    },
    {
      id: "deep-research",
      badge: "ডিপ রিসার্চ & স্পার্ক",
      title: "অটোনোমাস রিসার্চ অ্যাসিস্ট্যান্ট",
      description:
        "Deep Research শত শত লাইভ ওয়েবসাইট ব্রাউজ করে কয়েক মিনিটে পূর্ণাঙ্গ রিসার্চ রিপোর্ট তৈরি করে। সাথে Gemini Spark সার্বক্ষণিক পার্সোনাল এজেন্ট।",
      icon: <Search className="w-6 h-6 text-brand-blue" />,
      features: [
        "রিয়েল-টাইম মাল্টি-সোর্স ব্রাউজিং",
        "পূর্ণাঙ্গ ইন-ডেপথ রেফারেন্স রিপোর্ট",
        "২৪/৭ ডিজিটাল টাস্ক এক্সিকিউশন",
      ],
      colorClass: "from-blue-500/10 to-cyan-500/10 border-blue-200/60",
    },
    {
      id: "creative-studio",
      badge: "Veo 3.1 & Lyria 3",
      title: "ভিডিও ও মিউজিক জেনারেশন",
      description:
        "Veo 3.1 দিয়ে টেক্সট থেকে সিনেমাটিক 4K ভিডিও এবং Lyria 3 দিয়ে ভোকাল, লিরিক্স ও ইনস্ট্রুমেন্টালসহ গান তৈরি করুন।",
      icon: <Video className="w-6 h-6 text-red-500" />,
      features: [
        "সিনেমাটিক 4K ভিডিও ক্রিয়েশন",
        "কমপ্লিট ট্র্যাক ও ভোকাল মিউজিক",
        "Nano Banana Pro ইমেজ এডিটিং",
      ],
      colorClass: "from-red-500/10 to-pink-500/10 border-red-200/60",
    },
    {
      id: "developer-suite",
      badge: "Antigravity & Jules",
      title: "মাল্টি-এজেন্ট কোডিং পরিবেশ",
      description:
        "Google Antigravity ও Jules এর সহায়তায় কোডিং, ডিবাগিং, পিআর রিভিউ এবং এন্ড-টু-এন্ড সফটওয়্যার আর্কিটেকচার করুন সেকেন্ডের মধ্যে।",
      icon: <Code2 className="w-6 h-6 text-brand-success" />,
      features: [
        "Jules অটোনোমাস কোডিং এজেন্ট",
        "অ্যান্টিগ্র্যাভিটি মাল্টি-এজেন্ট সাপোর্ট",
        "রিয়েল-টাইম কোড অ্যান্ড আর্কিটেকচার",
      ],
      colorClass: "from-emerald-500/10 to-teal-500/10 border-emerald-200/60",
    },
    {
      id: "workspace-cloud",
      badge: "5 TB + Workspace",
      title: "5,000 GB ক্লাউড ও ওয়ার্কস্পেস",
      description:
        "Google One এর মাধ্যমে 5 TB হাই-স্পিড স্টোরেজ, যা পরিবারের ৫ জনের সাথে শেয়ারযোগ্য। সাথে Docs, Sheets ও Gmail-এ বিল্ট-ইন AI।",
      icon: <HardDrive className="w-6 h-6 text-brand-indigo" />,
      features: [
        "৫ টেরাবাইট Google One ড্রাইভ",
        "Docs, Gmail ও Sheets-এ AI পাওয়ার",
        "ইউটিউব প্রিমিয়াম এড-ফ্রি স্ট্রিমিং",
      ],
      colorClass: "from-indigo-500/10 to-purple-500/10 border-indigo-200/60",
    },
  ];

  return (
    <section id="features" className="py-20 lg:py-28 bg-white border-y border-brand-border/60 relative overflow-hidden">
      
      {/* Background Subtle Gradient Blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-blue/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-purple/5 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none" />

      <div className="max-w-[1180px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-16 reveal-init">
          <div className="inline-flex items-center gap-2 bg-brand-blue/10 border border-brand-blue/20 rounded-full px-3.5 py-1 text-xs font-semibold text-brand-blue mb-4">
            <Zap className="w-3.5 h-3.5" />
            <span>অল-ইন-ওয়ান অফিসিয়াল পাওয়ার হাউস</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-brand-dark tracking-tight mb-4">
            গুগল এআই প্রো-তে যা যা পাচ্ছেন
          </h2>
          <p className="text-base sm:text-lg text-brand-body leading-relaxed">
            গুগলের সবচেয়ে ক্ষমতাশালী AI মডেল, প্রোডাক্টিভিটি স্যুট, ক্রিয়েটিভ টুলস এবং ক্লাউড স্টোরেজের এক অসাধারণ কম্বিনেশন।
          </p>
        </div>

        {/* 5-Card Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.slice(0, 3).map((card, idx) => (
            <div
              key={card.id}
              className={`reveal-init stagger-${idx + 1} reveal-scale relative bg-gradient-to-b ${card.colorClass} bg-white rounded-2xl p-7 border transition-all duration-300 hover:shadow-card hover:-translate-y-1.5 flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-white shadow-sm border border-brand-border/60 flex items-center justify-center">
                    {card.icon}
                  </div>
                  <span className="text-[11px] font-bold text-brand-dark bg-white/90 border border-brand-border px-3 py-1 rounded-full font-outfit">
                    {card.badge}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-brand-dark mb-2.5 leading-snug">
                  {card.title}
                </h3>
                <p className="text-sm text-brand-body leading-relaxed mb-6">
                  {card.description}
                </p>
              </div>

              <ul className="space-y-2.5 pt-4 border-t border-brand-border/60">
                {card.features.map((feat, i) => (
                  <li key={i} className="flex items-center gap-2 text-xs font-medium text-brand-dark">
                    <CheckCircle2 className="w-4 h-4 text-brand-success flex-shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Bottom Row - 2 Wide Cards */}
          {cards.slice(3, 5).map((card, idx) => (
            <div
              key={card.id}
              className={`reveal-init stagger-${idx + 4} reveal-scale md:col-span-1 lg:col-span-auto relative bg-gradient-to-b ${card.colorClass} bg-white rounded-2xl p-7 border transition-all duration-300 hover:shadow-card hover:-translate-y-1.5 flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-white shadow-sm border border-brand-border/60 flex items-center justify-center">
                    {card.icon}
                  </div>
                  <span className="text-[11px] font-bold text-brand-dark bg-white/90 border border-brand-border px-3 py-1 rounded-full font-outfit">
                    {card.badge}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-brand-dark mb-2.5 leading-snug">
                  {card.title}
                </h3>
                <p className="text-sm text-brand-body leading-relaxed mb-6">
                  {card.description}
                </p>
              </div>

              <ul className="space-y-2.5 pt-4 border-t border-brand-border/60">
                {card.features.map((feat, i) => (
                  <li key={i} className="flex items-center gap-2 text-xs font-medium text-brand-dark">
                    <CheckCircle2 className="w-4 h-4 text-brand-success flex-shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* 6th Stat Card */}
          <div className="reveal-init stagger-6 reveal-scale bg-gradient-to-br from-brand-blue/5 via-brand-purple/5 to-white rounded-2xl p-7 border border-brand-border/80 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-brand-purple uppercase tracking-wider font-outfit">
                Bangladeshi Community
              </span>
              <h3 className="text-xl font-bold text-brand-dark mt-2 mb-3">
                ৫,০০০+ বাংলাদেশি প্রফেশনালদের বিশ্বস্ত পছন্দ
              </h3>
              <p className="text-xs text-brand-body leading-relaxed mb-6">
                সফটওয়্যার ইঞ্জিনিয়ার, কন্টেন্ট ক্রিয়েটর, একাডেমিশিয়ান এবং রিসার্চাররা প্রতিদিন তাদের প্রোডাক্টিভিটি বাড়াতে ব্যবহার করছেন।
              </p>
            </div>

            <div className="p-4 bg-white/80 rounded-xl border border-brand-border/60 flex items-center justify-between">
              <div>
                <span className="text-2xl font-bold font-outfit text-brand-blue block">
                  ৯৯.৮%
                </span>
                <span className="text-[11px] text-brand-muted">গ্রাহক সন্তুষ্টি হার</span>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold font-outfit text-brand-purple block">
                  ৫-১৫ মি.
                </span>
                <span className="text-[11px] text-brand-muted">গড় অ্যাক্টিভেশন টাইম</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
