"use client";

import React, { useState, useEffect } from "react";
import {
  FileText,
  Save,
  Check,
  AlertCircle,
  RefreshCw,
  Sparkles,
  Globe,
} from "lucide-react";

export default function AdminContentPage() {
  const [content, setContent] = useState({
    heroTitle: "বাংলাদেশে সবচেয়ে সাশ্রয়ী মূল্যে অফিসিয়াল Google AI Pro সাবস্ক্রিপশন",
    heroSubtitle: "Gemini 3.1 Pro, Deep Research, 5 TB ক্লাউড স্টোরেজ ও Google Workspace AI — এখন ৮৮% ছাড়ে মাত্র ৳১৭/মাসে!",
    promoBanner: "🔥 সীমিত সময়ের মেগা অফার: ১৮ মাসের প্যাকেজে ৮৫% পর্যন্ত বিশেষ ছাড় চলছে!",
    ctaHeadline: "আজই শুরু করুন আপনার AI নির্ভর স্মার্ট যাত্রা",
    ctaSubtitle: "Google AI Pro এর সাথে কাজের গতি বাড়িয়ে তুলুন কয়েক গুণ। ১ মিনিটে সক্রিয় করুন!",
  });

  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchContent = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/content");
      const data = await res.json();
      if (data.success && data.contents?.length > 0) {
        const hero = data.contents.find((c: any) => c.sectionKey === "hero");
        const promo = data.contents.find((c: any) => c.sectionKey === "promo");
        const cta = data.contents.find((c: any) => c.sectionKey === "cta");

        setContent({
          heroTitle: hero?.title || content.heroTitle,
          heroSubtitle: hero?.subtitle || content.heroSubtitle,
          promoBanner: promo?.title || content.promoBanner,
          ctaHeadline: cta?.title || content.ctaHeadline,
          ctaSubtitle: cta?.subtitle || content.ctaSubtitle,
        });
      }
    } catch {
      showToast("কন্টেন্ট লোড করতে ব্যর্থ", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await Promise.all([
        fetch("/api/admin/content", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sectionKey: "hero",
            title: content.heroTitle,
            subtitle: content.heroSubtitle,
          }),
        }),
        fetch("/api/admin/content", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sectionKey: "promo",
            title: content.promoBanner,
          }),
        }),
        fetch("/api/admin/content", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sectionKey: "cta",
            title: content.ctaHeadline,
            subtitle: content.ctaSubtitle,
          }),
        }),
      ]);

      showToast("ওয়েবসাইট কন্টেন্ট সফলভাবে আপডেট হয়েছে!");
    } catch {
      showToast("সংরক্ষণ ব্যর্থ হয়েছে", "error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Toast Alert */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl shadow-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-bottom-3 ${
            toast.type === "error"
              ? "bg-rose-900 text-white border border-rose-700"
              : "bg-slate-900 text-white"
          }`}
        >
          {toast.type === "error" ? <AlertCircle className="w-4 h-4 text-rose-400" /> : <Check className="w-4 h-4 text-emerald-400" />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Top Header Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-brand-purple/10 text-brand-purple px-3 py-1 rounded-full text-xs font-bold font-outfit mb-2">
            <span>Website Copywriter</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight font-outfit">
            Website Content Management
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-bangla">
            ওয়েবসাইটের ব্যানার, শিরোনাম ও অফার টেক্সট পরিবর্তন করুন।
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/"
            target="_blank"
            className="inline-flex items-center gap-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold px-4 py-2.5 rounded-xl border border-slate-200 transition-colors"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>লাইভ প্রিভিউ</span>
          </a>
        </div>
      </div>

      {/* Content Form */}
      <form onSubmit={handleSave} className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6 font-bangla">
        
        {/* Top Promo Banner */}
        <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
          <h3 className="text-sm font-bold text-slate-900 font-outfit uppercase">
            Top Promotional Banner Notice
          </h3>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              ব্যানার মেসেজ
            </label>
            <input
              type="text"
              value={content.promoBanner}
              onChange={(e) => setContent({ ...content, promoBanner: e.target.value })}
              className="w-full h-11 px-3.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 outline-none focus:border-brand-blue"
            />
          </div>
        </div>

        {/* Hero Section */}
        <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 font-outfit uppercase">
            Hero Section Text
          </h3>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              মূল শিরোনাম (Main Headline)
            </label>
            <input
              type="text"
              value={content.heroTitle}
              onChange={(e) => setContent({ ...content, heroTitle: e.target.value })}
              className="w-full h-11 px-3.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 outline-none focus:border-brand-blue"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              উপশিরোনাম (Subtext Tagline)
            </label>
            <textarea
              rows={2}
              value={content.heroSubtitle}
              onChange={(e) => setContent({ ...content, heroSubtitle: e.target.value })}
              className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 outline-none focus:border-brand-blue resize-none"
            />
          </div>
        </div>

        {/* Final CTA Section */}
        <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 font-outfit uppercase">
            Bottom CTA Banner Text
          </h3>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              CTA ব্যানার শিরোনাম
            </label>
            <input
              type="text"
              value={content.ctaHeadline}
              onChange={(e) => setContent({ ...content, ctaHeadline: e.target.value })}
              className="w-full h-11 px-3.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 outline-none focus:border-brand-blue"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              CTA ব্যানার বিবরণ
            </label>
            <input
              type="text"
              value={content.ctaSubtitle}
              onChange={(e) => setContent({ ...content, ctaSubtitle: e.target.value })}
              className="w-full h-11 px-3.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 outline-none focus:border-brand-blue"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 bg-brand-blue hover:bg-brand-blue/90 text-white font-semibold text-xs px-8 py-3 rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? "সংরক্ষণ হচ্ছে..." : "কন্টেন্ট সংরক্ষণ করুন"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
