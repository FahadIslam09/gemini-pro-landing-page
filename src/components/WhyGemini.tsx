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
      title: "অটোনোমাস এআই কোডিং",
      description:
        "Google Antigravity মাল্টি-এজেন্ট প্ল্যাটফর্ম এবং Jules গিটহাব এজেন্টের মাধ্যমে স্বয়ংক্রিয়ভাবে বাগ ফিক্স ও ফিচার বিল্ড করুন।",
      icon: <Code2 className="w-6 h-6 text-emerald-500" />,
      features: [
        "Google Antigravity মাল্টি-এজেন্ট IDE",
        "Jules অটোনোমাস PR ও ইস্যু সমাধান",
        "$10/মাস গুগল ক্লাউড ক্রেডিট",
      ],
      colorClass: "from-emerald-500/10 to-teal-500/10 border-emerald-200/60",
    },
    {
      id: "storage-media",
      badge: "5 TB + YouTube",
      title: "৫,০০০ জিবি ক্লাউড & নো-অ্যাডস",
      description:
        "Google Drive, Photos ও Gmail-এর জন্য বিশাল ৫ টেরাবাইট ক্লাউড ব্যাকআপ (সর্বোচ্চ ৫ জন পরিবারের সদস্যের সাথে শেয়ারযোগ্য) এবং বিজ্ঞাপনহীন YouTube।",
      icon: <HardDrive className="w-6 h-6 text-amber-500" />,
      features: [
        "৫ টেরাবাইট হাই-স্পিড ক্লাউড স্পেস",
        "পরিবারের ৫ জনের সাথে শেয়ার সুবিধা",
        "YouTube Premium (ব্যাকগ্রাউন্ড প্লে)",
      ],
      colorClass: "from-amber-500/10 to-orange-500/10 border-amber-200/60",
    },
  ];

  return (
    <section id="features" className="py-20 lg:py-24 bg-white border-y border-brand-border">
      <div className="max-w-[1180px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-16">
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
          {cards.slice(0, 3).map((card) => (
            <div
              key={card.id}
              className={`relative bg-gradient-to-b ${card.colorClass} bg-white rounded-2xl p-7 border transition-all duration-300 hover:shadow-card hover:-translate-y-1 flex flex-col justify-between`}
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
          {cards.slice(3, 5).map((card) => (
            <div
              key={card.id}
              className={`md:col-span-1 lg:col-span-auto relative bg-gradient-to-b ${card.colorClass} bg-white rounded-2xl p-7 border transition-all duration-300 hover:shadow-card hover:-translate-y-1 flex flex-col justify-between`}
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
          <div className="bg-gradient-to-br from-brand-blue/5 via-brand-purple/5 to-white rounded-2xl p-7 border border-brand-border/80 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-brand-purple uppercase tracking-wider font-outfit">
                Bangladeshi Community
              </span>
              <h3 className="text-2xl font-bold text-brand-dark mt-2 mb-2">
                ১০,০০০+ গ্রাহকের প্রথম পছন্দ
              </h3>
              <p className="text-sm text-brand-body leading-relaxed mb-4">
                বাংলাদেশের শিক্ষার্থী, শীর্ষ সফটওয়্যার ইঞ্জিনিয়ার, গবেষক এবং এজেন্সি উদ্যোক্তারা গুগল এআই প্রো ব্যবহার করছেন।
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-brand-border text-center">
              <div className="bg-white p-3 rounded-xl border border-brand-border">
                <div className="text-xl font-bold text-brand-blue font-outfit">4.9 / 5</div>
                <div className="text-[11px] text-brand-muted font-medium">ইউজার রেটিং</div>
              </div>
              <div className="bg-white p-3 rounded-xl border border-brand-border">
                <div className="text-xl font-bold text-brand-purple font-outfit">99.8%</div>
                <div className="text-[11px] text-brand-muted font-medium">সন্তুষ্টির হার</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
