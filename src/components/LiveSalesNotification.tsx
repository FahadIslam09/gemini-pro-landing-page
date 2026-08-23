"use client";

import React, { useState, useEffect } from "react";
import { CheckCircle2, Zap, X } from "lucide-react";

interface LiveSalesNotificationProps {
  price18m?: number;
}

interface PurchaseNotification {
  name: string;
  location: string;
  plan: string;
  price: string;
  timeAgo: string;
  verified: boolean;
  avatarColor: string;
}

const BUYERS = [
  { name: "তানভীর আহমেদ", location: "ঢাকা (মিরপুর)" },
  { name: "সাকিব আল হাসান", location: "চট্টগ্রাম (জিইসি)" },
  { name: "মাহমুদুল হাসান", location: "ঢাকা (উত্তরা)" },
  { name: "রাফসান জামান", location: "সিলেট সদর" },
  { name: "নাজমুল হুদা", location: "রাজশাহী (বোয়ালিয়া)" },
  { name: "আরিফুল ইসলাম", location: "ঢাকা (ধানমন্ডি)" },
  { name: "ইশতিয়াক চৌধুরী", location: "খুলনা (খালিশপুর)" },
  { name: "ফাহিম মুনতাসির", location: "ঢাকা (বনশ্রী)" },
  { name: "মেহেদী হাসান", location: "রংপুর সদর" },
  { name: "আহমেদ জুবায়ের", location: "ঢাকা (গুলশান)" },
  { name: "তাসনিম জাহান", location: "চট্টগ্রাম (আগ্রাবাদ)" },
  { name: "রায়হান কবির", location: "কুমিল্লা সদর" },
  { name: "তাহমিদ রেজা", location: "ঢাকা (মোহাম্মদপুর)" },
  { name: "নাবিল ফারহান", location: "ময়মনসিংহ সদর" },
  { name: "হাসান মাহমুদ", location: "নারায়ণগঞ্জ" },
  { name: "সায়মা আক্তার", location: "ঢাকা (বসুন্ধরা)" },
  { name: "ইমরান হোসেন", location: "বরিশাল সদর" },
  { name: "কাওসার আহমেদ", location: "গাজীপুর (চৌরাস্তা)" },
];

const TIME_AGOS = [
  "এইমাত্র",
  "১ মিনিট আগে",
  "২ মিনিট আগে",
  "৩ মিনিট আগে",
  "৪ মিনিট আগে",
  "৫ মিনিট আগে",
  "৭ মিনিট আগে",
];

const AVATAR_COLORS = [
  "bg-gradient-to-tr from-blue-600 to-indigo-600",
  "bg-gradient-to-tr from-purple-600 to-pink-600",
  "bg-gradient-to-tr from-emerald-600 to-teal-600",
  "bg-gradient-to-tr from-amber-600 to-orange-600",
  "bg-gradient-to-tr from-cyan-600 to-blue-600",
];

export default function LiveSalesNotification({ price18m = 299 }: LiveSalesNotificationProps) {
  const [currentNotification, setCurrentNotification] = useState<PurchaseNotification | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    if (isDismissed) return;

    let hideTimeout: NodeJS.Timeout;

    const showRandomNotification = () => {
      const randomBuyer = BUYERS[Math.floor(Math.random() * BUYERS.length)];
      const randomTime = TIME_AGOS[Math.floor(Math.random() * TIME_AGOS.length)];
      const randomColor = AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];
      
      // 80% chance of 18m mega plan, 15% 12m, 5% 1m
      const rand = Math.random();
      let plan = "১৮ মাসের মেগা অফার";
      let price = `৳${price18m}`;
      if (rand > 0.85) {
        plan = "১২ মাসের বার্ষিক প্ল্যান";
        price = "৳৩৯৯";
      } else if (rand > 0.95) {
        plan = "১ মাসের ট্রায়াল প্যাক";
        price = "৳১৪৯";
      }

      setCurrentNotification({
        name: randomBuyer.name,
        location: randomBuyer.location,
        plan,
        price,
        timeAgo: randomTime,
        verified: true,
        avatarColor: randomColor,
      });
      setIsVisible(true);

      // Hide after 5.5 seconds
      hideTimeout = setTimeout(() => {
        setIsVisible(false);
      }, 5500);
    };

    // First popup appears after 4 seconds of page visit
    const initialTimer = setTimeout(() => {
      showRandomNotification();
    }, 4000);

    // Repeat popup every 12 to 18 seconds
    const intervalTimer = setInterval(() => {
      showRandomNotification();
    }, 14000);

    return () => {
      clearTimeout(initialTimer);
      clearTimeout(hideTimeout);
      clearInterval(intervalTimer);
    };
  }, [isDismissed, price18m]);

  if (isDismissed || !currentNotification) return null;

  return (
    <div
      className={`fixed bottom-20 sm:bottom-6 left-4 sm:left-6 z-40 max-w-[340px] sm:max-w-[370px] w-[calc(100%-2rem)] transition-all duration-500 ease-out transform ${
        isVisible
          ? "opacity-100 translate-y-0 scale-100"
          : "opacity-0 translate-y-6 scale-95 pointer-events-none"
      }`}
    >
      <div className="relative bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl p-3.5 shadow-[0_12px_36px_rgba(15,23,42,0.14)] flex items-start gap-3 group hover:shadow-2xl transition-all">
        {/* Close Button */}
        <button
          type="button"
          onClick={() => {
            setIsVisible(false);
            setIsDismissed(true);
          }}
          className="absolute -top-2 -right-2 w-5 h-5 bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 rounded-full flex items-center justify-center text-xs shadow-sm transition-all cursor-pointer"
          title="বন্ধ করুন"
        >
          <X className="w-3 h-3" />
        </button>

        {/* User Avatar Initial */}
        <div
          className={`w-10 h-10 rounded-xl ${currentNotification.avatarColor} text-white flex-shrink-0 flex items-center justify-center font-bold text-sm shadow-md font-bangla`}
        >
          {currentNotification.name.charAt(0)}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 pr-2">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="font-bold text-xs sm:text-sm text-slate-900 truncate">
              {currentNotification.name}
            </span>
            <span className="text-[11px] text-slate-500 font-normal">
              • {currentNotification.location}
            </span>
          </div>

          <p className="text-xs text-slate-700 leading-snug">
            <span className="font-semibold text-brand-purple">{currentNotification.plan}</span>{" "}
            সাবস্ক্রিপশন সম্পন্ন করেছেন ({currentNotification.price})
          </p>

          <div className="flex items-center gap-2 mt-1.5">
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200/60 px-1.5 py-0.5 rounded-md">
              <CheckCircle2 className="w-2.5 h-2.5" />
              ভেরিফাইড পেমেন্ট
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] text-slate-600 font-medium">
              <Zap className="w-2.5 h-2.5 text-amber-500 fill-amber-500" />
              {currentNotification.timeAgo}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
