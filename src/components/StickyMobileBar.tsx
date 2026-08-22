"use client";

import React from "react";
import { ArrowRight, Sparkles } from "lucide-react";

interface StickyMobileBarProps {
  onOpenCheckout: (plan?: string) => void;
  price18m?: number;
}

export default function StickyMobileBar({ onOpenCheckout, price18m = 499 }: StickyMobileBarProps) {
  return (
    <aside aria-label="Quick Checkout" className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-brand-border px-4 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] animate-in slide-in-from-bottom duration-300">
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-col">
          <span className="text-[11px] font-semibold text-brand-muted">
            ১৮ মাসের অফার
          </span>
          <div className="flex items-baseline gap-1 font-outfit">
            <span className="text-xl font-extrabold text-brand-blue">৳{price18m}</span>
            <span className="text-[10px] font-bold text-brand-body">BDT</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onOpenCheckout("18m")}
          className="inline-flex items-center justify-center gap-1.5 bg-brand-gradient text-white text-xs font-bold py-2.5 px-5 rounded-xl shadow-glow active:scale-95 transition-all"
        >
          <span>এখনই অর্ডার করুন</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
}
