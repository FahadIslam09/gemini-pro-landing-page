"use client";

import React, { useState } from "react";
import { Plus, Minus, HelpCircle } from "lucide-react";

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "Google AI Pro কী এবং এতে কী কী রয়েছে?",
      a: "Google AI Pro হলো গুগলের সর্বোচ্চ ক্ষমতাসম্পন্ন AI প্ল্যাটফর্ম। এতে রয়েছে Gemini 3.1 Pro (1M টোকেন কনটেক্সট), Deep Research অটোনোমাস ব্রাউজিং, Gemini Spark ২৪/৭ পার্সোনাল এজেন্ট, Gmail/Docs/Sheets-এ AI ইন্টিগ্রেশন, 5 TB Google One ক্লাউড স্টোরেজ, Veo 3.1 ভিডিও জেনারেশন ও YouTube Premium।",
    },
    {
      q: "আমার বর্তমান জিমেইল (existing account) ব্যবহার করতে পারব কি?",
      a: "হ্যাঁ, সম্পূর্ণভাবে। আপনার বর্তমান ব্যক্তিগত জিমেইল একাউন্টেই এই সাবস্ক্রিপশন চালু হবে। আপনার কোনো আগের ফাইল, ছবি বা ড্রাইভের ডেটা নষ্ট হবে না।",
    },
    {
      q: "৫ টেরাবাইট (5 TB) স্টোরেজ কি পরিবারের সাথে শেয়ার করা যাবে?",
      a: "হ্যাঁ! Google One ফ্যামিলি শেয়ারিং ফিচারের মাধ্যমে আপনি পরিবারের সর্বোচ্চ ৫ জন সদস্যের সাথে এই ৫,০০০ জিবি ক্লাউড স্পেস শেয়ার করতে পারবেন। সবার ফাইল এবং ছবি সম্পূর্ণ ব্যক্তিগত ও গোপন থাকবে।",
    },
    {
      q: "Deep Research কীভাবে কাজ করে?",
      a: "Deep Research আপনার দেওয়া যেকোনো জটিল বিষয়ের উপর রিয়েল-টাইমে শত শত ওয়েব সোর্স ও গবেষণা প্রকাশনা স্বয়ংক্রিয়ভাবে ব্রাউজ করে কয়েক মিনিটের মধ্যে রেফারেন্স এবং সাইটেশনসহ মাল্টি-পেজ কম্প্রিহেনসিভ রিসার্চ রিপোর্ট তৈরি করে।",
    },
    {
      q: "পেমেন্ট করার পর সাবস্ক্রিপশন পেতে কত সময় লাগবে?",
      a: "bKash, Nagad বা Rocket-এ পেমেন্ট সম্পন্ন করে TrxID দিয়ে সাবমিট করার পর সাধারণত ৫ থেকে ১৫ মিনিটের মধ্যেই আপনার একাউন্টে সেবা সক্রিয় হয়ে যাবে।",
    },
    {
      q: "YouTube Premium-এ কী কী সুবিধা থাকবে?",
      a: "YouTube ভিডিও দেখার সময় কোনো প্রকার বিজ্ঞাপন আসবে না। এছাড়াও মোবাইল স্ক্রিন অফ রেখে ব্যাকগ্রাউন্ডে অডিও ও গান শোনা এবং অফলাইন ডাউনলোডের সম্পূর্ণ সুবিধা পাবেন।",
    },
    {
      q: "সাবস্ক্রিপশন কি অটো-রিনিউ হবে নাকি হিডেন কোনো চার্জ আছে?",
      a: "না, কোনো অটোমেটিক রিনিউয়াল বা হিডেন চার্জ নেই। ১৮ মাস শেষ হওয়ার পর কোনো টাকা কাটা হবে না। আপনি চাইলে মেয়াদ শেষে পুনরায় অফার মূল্যে রিনিউ করতে পারবেন।",
    },
    {
      q: "কোনো টেকনিক্যাল সমস্যা হলে সাপোর্ট কীভাবে পাব?",
      a: "আমাদের রয়েছে ২৪/৭ সক্রিয় কাস্টমার সাপোর্ট ও ডেডিকেটেড হোয়াটসঅ্যাপ হেল্পলাইন। যেকোনো প্রশ্ন বা সহায়তার জন্য সাথে সাথে সাপোর্ট পাবেন।",
    },
  ];

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 lg:py-28 bg-brand-alt border-y border-brand-border/60">
      <div className="max-w-[1080px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-brand-purple/10 border border-brand-purple/20 rounded-full px-3.5 py-1 text-xs font-semibold text-brand-purple mb-4 font-outfit">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Frequently Asked Questions</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-brand-dark tracking-tight mb-4">
            সাধারণ জিজ্ঞাসা <span className="gradient-text">(FAQ)</span>
          </h2>
          <p className="text-base sm:text-lg text-brand-muted leading-relaxed">
            সাবস্ক্রিপশন ও ফিচার সম্পর্কিত আপনার যাবতীয় প্রশ্নের সহজ ও স্পষ্ট উত্তর।
          </p>
        </div>

        {/* 2-Column Accordion Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className={`bg-white border rounded-2xl transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? "border-brand-purple/40 shadow-sm"
                    : "border-brand-border hover:border-brand-border/80"
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full text-left p-5 flex items-center justify-between gap-4 font-semibold text-base text-brand-dark hover:text-brand-blue transition-colors"
                  aria-expanded={isOpen}
                >
                  <span>{faq.q}</span>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                    isOpen ? "bg-brand-purple text-white" : "bg-gray-100 text-brand-muted"
                  }`}>
                    {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 text-sm text-brand-body leading-relaxed border-t border-dashed border-gray-100 pt-3 animate-in fade-in duration-200">
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
