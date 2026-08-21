"use client";

import React from "react";
import { MessageCircle } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-brand-border pt-16 pb-24 sm:pb-12 text-brand-body">
      <div className="max-w-[1180px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Footer Top 4 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-brand-border">
          
          {/* Col 1: Brand (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <a href="#" className="flex items-center gap-2.5">
              <svg className="w-7 h-7" viewBox="0 0 32 32" fill="none">
                <defs>
                  <linearGradient id="footerSparkleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3157D5" />
                    <stop offset="50%" stopColor="#5B55D8" />
                    <stop offset="100%" stopColor="#8A4EDB" />
                  </linearGradient>
                </defs>
                <path
                  d="M16 2C16 10 10 16 2 16C10 16 16 22 16 30C16 22 22 16 30 16C22 16 16 10 16 2Z"
                  fill="url(#footerSparkleGrad)"
                />
              </svg>
              <span className="text-xl font-bold tracking-tight text-brand-dark">
                Google <span className="gradient-text">AI Pro</span>
              </span>
            </a>
            <p className="text-xs sm:text-sm text-brand-muted leading-relaxed max-w-sm">
              বাংলাদেশের শিক্ষার্থী, ফ্রিল্যান্সার ও প্রফেশনালদের জন্য বিশ্বস্ত, দ্রুত এবং শতভাগ নিরাপদ প্রিমিয়াম AI সেবা প্ল্যাটফর্ম।
            </p>
          </div>

          {/* Col 2: Quick Links (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-sm font-bold text-brand-dark">
              কুইক লিংকস
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <a href="#features" className="hover:text-brand-blue transition-colors">
                  সুবিধাসমূহ
                </a>
              </li>
              <li>
                <a href="#why-pro" className="hover:text-brand-blue transition-colors">
                  কেন Google AI Pro?
                </a>
              </li>
              <li>
                <a href="#comparison" className="hover:text-brand-blue transition-colors">
                  ফিচার তুলনা
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-brand-blue transition-colors">
                  সাবস্ক্রিপশন প্ল্যান ও মূল্য
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-brand-blue transition-colors">
                  সচরাচর প্রশ্ন (FAQ)
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Payment Methods (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-sm font-bold text-brand-dark">
              পেমেন্ট মাধ্যম
            </h4>
            <div className="flex flex-wrap gap-2">
              <span className="bg-brand-surface border border-brand-border px-2.5 py-1 rounded-md text-xs font-bold text-[#D12053]">
                bKash
              </span>
              <span className="bg-brand-surface border border-brand-border px-2.5 py-1 rounded-md text-xs font-bold text-[#F7941D]">
                Nagad
              </span>
              <span className="bg-brand-surface border border-brand-border px-2.5 py-1 rounded-md text-xs font-bold text-[#8C3494]">
                Rocket
              </span>
              <span className="bg-brand-surface border border-brand-border px-2.5 py-1 rounded-md text-xs font-bold text-blue-600">
                Upay
              </span>
            </div>
          </div>

          {/* Col 4: Support (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-sm font-bold text-brand-dark">
              ২৪/৭ লাইভ সাপোর্ট
            </h4>
            <p className="text-xs text-brand-muted leading-relaxed">
              যেকোনো প্রশ্ন, অর্ডার স্ট্যাটাস বা সহযোগিতার জন্য সরাসরি চ্যাট করুন:
            </p>
            <a
              href="https://wa.me/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20BA5A] text-white font-semibold text-xs py-2.5 px-4 rounded-xl shadow-sm transition-all hover:-translate-y-0.5"
            >
              <MessageCircle className="w-4 h-4" />
              <span>হোয়াটসঅ্যাপে চ্যাট করুন</span>
            </a>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-brand-muted text-center sm:text-left">
          <p>&copy; 2026 Google AI Pro Bangladesh Offer. সকল স্বত্ব সংরক্ষিত।</p>
          <p className="max-w-md text-[11px] text-gray-400">
            Google, Gemini, Workspace, Google One ও YouTube হলো Google LLC-এর নিবন্ধিত ট্রেডমার্ক। এটি একটি স্বাধীন প্রমোশনাল প্ল্যাটফর্ম।
          </p>
        </div>
      </div>
    </footer>
  );
}
