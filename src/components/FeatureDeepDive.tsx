"use client";

import React, { useState } from "react";
import {
  Sparkles,
  Mail,
  Video,
  Code2,
  HardDrive,
  CheckCircle2,
  ArrowRight,
  Search,
  Clapperboard,
  Music2,
  Terminal,
  FileSpreadsheet,
  Layers,
} from "lucide-react";

interface FeatureDeepDiveProps {
  onOpenCheckout: (plan?: string) => void;
  price18m?: number;
}

export default function FeatureDeepDive({ onOpenCheckout, price18m = 499 }: FeatureDeepDiveProps) {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    {
      id: "gemini-pro-research",
      title: "Gemini 3.1 Pro",
      icon: <Sparkles className="w-4 h-4" />,
      tagline: "গুগলের ফ্ল্যাগশিপ ৩.১ প্রো মডেল ও অটোনোমাস রিসার্চ",
      headline: "1 Million Token Context এবং রিয়েল-টাইম ডিপ রিসার্চ রিপোর্ট",
      description:
        "Gemini 3.1 Pro মডেলের ১ মিলিয়নের বিশাল কনটেক্সট উইন্ডো দিয়ে একসাথে ১,৫০০ পৃষ্ঠার রিসার্চ পেপার, বড় ভিডিও বা পুরো কোডবেস নির্ভুলভাবে অ্যানালাইজ করুন। আর Deep Research ফিচার স্বয়ংক্রিয়ভাবে শত শত ওয়েবসাইট ব্রাউজ করে কয়েক মিনিটে মাল্টি-পেজ রিসার্চ রিপোর্ট তৈরি করে দেয়।",
      perks: [
        "Gemini 3.1 Pro সর্বাধুনিক মডেলের ৪ গুণ এক্সপ্যান্ডেড লিমিট",
        "Deep Research: স্বয়ংক্রিয় মাল্টি-সোর্স ব্রাউজিং ও সাইটেশন রিপোর্ট",
        "Gemini Spark: আপনার হয়ে স্বয়ংক্রিয় ডিজিটাল টাস্ক সম্পন্নকারী ২৪/৭ এজেন্ট",
        "১ মিলিয়ন টোকেন (1,000,000) বিশাল কনটেক্সট উইন্ডো",
      ],
      previewTitle: "Gemini 3.1 Pro + Deep Research Sandbox",
      previewBadge: "Active Synthesis",
      previewContent: (
        <div className="space-y-3 font-mono text-xs">
          <div className="bg-brand-surface p-3 rounded-xl border border-brand-border text-brand-dark">
            <span className="text-brand-purple font-bold">Query:</span> "Deep Research: Analyze competitive SaaS pricing in South Asia and Bangladesh."
          </div>
          <div className="bg-brand-subtle p-3 rounded-xl border border-brand-purple/20 text-brand-dark">
            <div className="flex items-center gap-1.5 text-brand-purple font-bold mb-1.5">
              <Search className="w-3.5 h-3.5" />
              <span>Deep Research (Browsed 142 Sources):</span>
            </div>
            <p className="font-sans text-xs text-brand-body leading-relaxed">
              ১. <strong>লোকাল পেমেন্ট গ্রহণযোগ্যতা:</strong> bKash/Nagad পেমেন্ট ইন্টিগ্রেশন ছাড়া কনভার্সন ৬৫% ড্রপ করে।<br/>
              ২. <strong>মার্কেট ভ্যালু প্রপোজিশন:</strong> ৳৪৯৯ মূল্যে ১৮ মাসের অফার এশিয়ায় সর্বোচ্চ ROI প্রদানকারী বান্ডল।<br/>
              ৩. <strong>ক্লাউড কম্বিনেশন:</strong> 5TB গুগল ওয়ান স্টোরেজ টিমের ডেটা ম্যানেজমেন্ট খরচ প্রতিমাসে $২০+ সাশ্রয় করে।
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "workspace-ai",
      title: "Workspace AI",
      icon: <Mail className="w-4 h-4" />,
      tagline: "Gmail, Docs, Sheets ও Google Vids-এ সার্বক্ষণিক AI",
      headline: "ডকুমেন্ট ড্রাফট, স্মার্ট ইমেইল রিপ্লাই এবং ফর্মুলা তৈরি চোখের পলকে",
      description:
        "Google Docs বা Gmail-এ লেখার সময় 'Help me write' বাটনে ক্লিক করলেই প্রফেশনাল ইমেইল ও আর্টিকেলের খসড়া স্বয়ংক্রিয়ভাবে তৈরি হয়ে যায়। আর Google Sheets-এ লিখলেই জটিল সূত্র নিজে থেকে বসে যায় এবং Google Vids দিয়ে AI ভিডিও উপস্থাপনা তৈরি করা যায়।",
      perks: [
        "Gmail-এ এক ক্লিকে AI Overview, প্রফেশনাল ড্রাফট ও প্রুফরিডিং",
        "Google Docs-এ স্টাইলিশ রিপোর্ট, সামারি ও ফরম্যাটিং",
        "Google Sheets-এ স্বয়ংক্রিয় স্প্রেডশীট বিল্ডার ও ডাটা অ্যানালাইসিস",
        "Google Vids-এ স্বয়ংক্রিয় ভিডিও প্রেজেন্টেশন ও স্ক্রিপ্টিং",
      ],
      previewTitle: "Gmail & Google Docs Assistant",
      previewBadge: "Help me write",
      previewContent: (
        <div className="space-y-3 font-sans text-xs">
          <div className="border border-brand-border bg-white rounded-xl p-3.5 shadow-sm">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-gray-100">
              <span className="font-bold text-brand-dark flex items-center gap-1.5">
                <FileSpreadsheet className="w-3.5 h-3.5 text-brand-blue" />
                Workspace AI Sidebar
              </span>
              <span className="text-[10px] bg-blue-50 text-brand-blue font-bold px-2 py-0.5 rounded-full font-outfit">Active</span>
            </div>
            <div className="bg-brand-surface p-2.5 rounded-lg text-brand-dark mb-2">
              <span className="text-brand-blue font-bold">Prompt:</span> "Write a formal partnership proposal for enterprise client."
            </div>
            <p className="text-brand-body leading-relaxed">
              "We are pleased to introduce our comprehensive Google AI Pro integration, delivering 4x higher Gemini capacity, automated Workspace workflows, and 5 TB secure cloud storage across your entire operations..."
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "creative-studio",
      title: "Creative Studio",
      icon: <Video className="w-4 h-4" />,
      tagline: "সিনেম্যাটিক 4K ভিডিও, মিউজিক ও ইমেজ জেনারেশন",
      headline: "Veo 3.1 দিয়ে ভিডিও এবং Lyria 3 দিয়ে কমপ্লিট গান তৈরি",
      description:
        "গুগলের অত্যাধুনিক ভিডিও মডেল Veo 3.1 দিয়ে টেক্সট বা ছবি থেকে সিনেমাটিক কোয়ালিটির ভিডিও বানান। আর Lyria 3 মিউজিক মডেল দিয়ে যেকোনো জনরা, মুড, ভোকাল ও লিরিক্সসহ পূর্ণাঙ্গ গান তৈরি করুন।",
      perks: [
        "Veo 3.1 ও Omni Flash ভিডিও জেনারেশন ও 4K আপস্কেলিং",
        "Lyria 3: টেক্সট থেকে ভোকাল ও ইনস্ট্রুমেন্টাল গান তৈরি",
        "Nano Banana Pro (Imagen) হাই-রেজোলিউশন ইমেজ ও রিমিক্স",
        "Google Flow ক্রিয়েটিভ স্টুডিও অ্যাক্সেস",
      ],
      previewTitle: "Veo 3.1 & Lyria 3 Generation Hub",
      previewBadge: "Generative AI",
      previewContent: (
        <div className="space-y-3 font-sans text-xs">
          <div className="bg-white border border-brand-border p-3.5 rounded-xl shadow-sm space-y-2.5">
            <div className="flex items-center gap-3 bg-slate-900 text-white p-3 rounded-xl shadow-sm">
              <div className="w-9 h-9 rounded-xl bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-400 flex-shrink-0">
                <Clapperboard className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="font-bold text-xs">Veo 3.1 Cinematic Render</div>
                <div className="text-[10px] text-gray-400">4K Ultra HD • 60 FPS Prompt-to-Video</div>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-purple-950 text-white p-3 rounded-xl shadow-sm">
              <div className="w-9 h-9 rounded-xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-300 flex-shrink-0">
                <Music2 className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="font-bold text-xs">Lyria 3 Music Synthesis</div>
                <div className="text-[10px] text-purple-300">Vocals, Bass, Synth & Bangla Lyrics</div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "developer-agents",
      title: "Autonomous Coding",
      icon: <Code2 className="w-4 h-4" />,
      tagline: "Google Antigravity ও Jules এজেন্টের সাহায্যে দ্রুত কোডিং",
      headline: "মাল্টি-এজেন্ট টিম পরিচালনা ও গিটহাব পুল রিকোয়েস্ট অটোমেশন",
      description:
        "Google Antigravity-এর সাহায্যে একাধিক AI কোডিং এজেন্ট পরিচালনা করে কোড জেনারেশন ও আর্কিটেকচার তৈরি করুন। আর Jules এজেন্টের মাধ্যমে গিটহাবের ইস্যু নিজে থেকে সলভ এবং PR তৈরি করুন। সাথে পাচ্ছেন প্রতি মাসে $10 গুগল ক্লাউড ক্রেডিট।",
      perks: [
        "Google Antigravity: মাল্টি-এজেন্ট অর্কেস্ট্রেশন প্ল্যাটফর্ম",
        "Jules: গিটহাব রিপোজিটরির ইস্যু ফিক্সিং ও অটোমেটেড পুল রিকোয়েস্ট",
        "Android Studio-এ Gemini Pro এজেন্টের সাহায্যে মোবাইল অ্যাপ তৈরি",
        "Google Developer Program থেকে প্রতিমাসে $10 ক্লাউড ক্রেডিট",
      ],
      previewTitle: "Google Antigravity & Jules Console",
      previewBadge: "Multi-Agent Active",
      previewContent: (
        <div className="space-y-3 font-mono text-xs">
          <div className="bg-slate-950 text-slate-200 p-3.5 rounded-xl border border-slate-800">
            <div className="text-[11px] text-emerald-400 font-bold mb-1.5 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5" />
              <span>Antigravity Agent Fleet: 3 Subagents</span>
            </div>
            <div className="text-slate-300 text-[11px] leading-relaxed">
              &gt; Investigator Agent: Found bottleneck in API handler.<br/>
              &gt; Builder Agent: Generated optimized async pipeline.<br/>
              &gt; Jules PR: Created PR #104 with unit tests. Passed 100%.
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "storage-youtube",
      title: "5 TB Storage & Media",
      icon: <HardDrive className="w-4 h-4" />,
      tagline: "৫,০০০ জিবি গুগল ওয়ান ক্লাউড স্পেস ও অ্যাড-ফ্রি ভিডিও",
      headline: "স্মার্টফোন, পিসি ব্যাকআপ এবং বিজ্ঞাপনহীন এন্টারটেইনমেন্ট",
      description:
        "আর কখনো 'Storage Full' মেসেজ আসবে না। ৫ টেরাবাইট হাই-স্পিড ক্লাউড স্টোরেজে আপনার সমস্ত ছবি অরিজিনাল কোয়ালিটিতে ব্যাকআপ রাখুন এবং সর্বোচ্চ ৫ জন ফ্যামিলি মেম্বারের সাথে শেয়ার করুন। সাথে উপভোগ করুন বিজ্ঞাপনহীন YouTube।",
      perks: [
        "৫,০০০ GB (5 TB) গুগল ওয়ান ক্লাউড স্টোরেজ",
        "Google Photos-এ আনলিমিটেড হাই-কোয়ালিটি ফটো ও 4K ব্যাকআপ",
        "এক সাবস্ক্রিপশনে পরিবারের সর্বোচ্চ ৫ জন সদস্যের সাথে শেয়ার",
        "YouTube Premium: বিজ্ঞাপনহীন ভিডিও ও ব্যাকগ্রাউন্ড অডিও প্লে",
      ],
      previewTitle: "Google One Storage Pool",
      previewBadge: "5,120 GB Active",
      previewContent: (
        <div className="space-y-3 font-sans text-xs">
          <div className="bg-white border border-brand-border p-4 rounded-xl shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold text-brand-dark text-sm flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-brand-blue" />
                স্টোরেজ স্ট্যাটাস
              </span>
              <span className="font-outfit font-bold text-brand-blue text-sm">5,000 GB Total</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-3 mb-3 overflow-hidden flex">
              <div className="bg-brand-blue h-full w-[10%]" title="Google Drive"></div>
              <div className="bg-brand-purple h-full w-[12%]" title="Google Photos"></div>
              <div className="bg-brand-accent h-full w-[3%]" title="Gmail"></div>
              <div className="bg-emerald-500 h-full w-[75%]" title="Free Space"></div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px] text-brand-body pt-1">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-brand-blue" />
                <span>Drive: 500 GB</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-brand-purple" />
                <span>Photos: 600 GB</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-brand-accent" />
                <span>Gmail: 150 GB</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="font-bold text-brand-success">ফ্রি স্পেস: 3,750 GB</span>
              </div>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <section id="deep-dive" className="py-20 lg:py-28 bg-brand-surface">
      <div className="max-w-[1180px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 bg-brand-purple/10 border border-brand-purple/20 rounded-full px-3.5 py-1 text-xs font-semibold text-brand-purple mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>প্রিমিয়াম ফিচারের গভীর অভিজ্ঞতা</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-brand-dark tracking-tight mb-4">
            কেন Google AI Pro আপনার জন্য <span className="gradient-text">অপরিহার্য</span>?
          </h2>
          <p className="text-base sm:text-lg text-brand-muted leading-relaxed">
            শিক্ষার্থী, ফ্রিল্যান্সার, কন্টেন্ট ক্রিয়েটর ও সফটওয়্যার ইঞ্জিনিয়ারদের প্রতিটি কাজে অসাধারণ সুপারপাওয়ার এনে দেয়।
          </p>
        </div>

        {/* Premium Segmented Pill Tray (Desktop & Mobile Friendly, No Scrollbars, No Clipping) */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex flex-wrap sm:flex-nowrap items-center justify-center p-1.5 bg-[#EEF2F9] border border-brand-border/80 rounded-2xl sm:rounded-full gap-1 shadow-[inset_0_1px_3px_rgba(0,0,0,0.04)] max-w-full">
            {tabs.map((tab, idx) => {
              const isActive = activeTab === idx;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(idx)}
                  className={`flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl sm:rounded-full font-semibold text-xs sm:text-sm transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "bg-brand-gradient text-white shadow-[0_4px_16px_rgba(91,85,216,0.35)] scale-[1.02]"
                      : "text-brand-body hover:text-brand-dark hover:bg-white/70"
                  }`}
                >
                  <span className={isActive ? "text-white" : "text-brand-purple"}>
                    {tab.icon}
                  </span>
                  <span>{tab.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Showcase Card */}
        <div className="bg-white border border-brand-border rounded-[28px] p-6 sm:p-10 shadow-gemini grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Description Column */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-purple bg-brand-purple/10 px-3 py-1 rounded-full mb-3 font-outfit">
              {tabs[activeTab].tagline}
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold text-brand-dark tracking-tight mb-4 leading-snug">
              {tabs[activeTab].headline}
            </h3>
            <p className="text-base text-brand-body leading-relaxed mb-6">
              {tabs[activeTab].description}
            </p>

            {/* Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full mb-8">
              {tabs[activeTab].perks.map((perk, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-brand-purple/10 text-brand-purple flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-sm font-medium text-brand-dark">{perk}</span>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => onOpenCheckout()}
              className="inline-flex items-center gap-2 bg-brand-gradient hover:bg-brand-gradient-hover text-white text-sm font-semibold px-6 py-3.5 rounded-xl shadow-glow hover:shadow-lg transition-all"
            >
              <span>এই অফারে যোগ দিন (৳{price18m})</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Right Preview Interactive Box */}
          <div className="lg:col-span-5 bg-brand-surface border border-brand-border rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-brand-border">
              <span className="font-outfit text-xs font-bold text-brand-dark tracking-wide">
                {tabs[activeTab].previewTitle}
              </span>
              <span className="bg-brand-indigo/10 text-brand-indigo text-[10px] font-bold px-2 py-0.5 rounded-full font-outfit">
                {tabs[activeTab].previewBadge}
              </span>
            </div>
            {tabs[activeTab].previewContent}
          </div>
        </div>
      </div>
    </section>
  );
}
