"use client";

import React, { useState, useEffect } from "react";
import {
  Tag,
  Edit2,
  Check,
  Sparkles,
  Save,
  RefreshCw,
  Eye,
  Lock,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  X,
  Plus,
  Trash2,
} from "lucide-react";

export default function AdminPricingPage() {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPlan, setEditingPlan] = useState<any | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newPlan, setNewPlan] = useState({
    planKey: "",
    name: "",
    price: 299,
    originalPrice: 2499,
    discountPercent: 88,
    monthlyBreakdown: "৳299 / মাস",
    badge: "নতুন প্ল্যান",
    badgeColor: "bg-blue-50 text-brand-blue border-blue-200",
    description: "বিশেষ প্যাকেজ",
    accountTypeTitle: "প্রাইভেট অ্যাকাউন্ট",
    accountTypeSubtitle: "সম্পূর্ণ নিজস্ব এক্সেস",
    accountTypeStyle: "bg-blue-50/80 border-blue-200 text-brand-blue",
    accountTypeIcon: "ShieldCheck",
    highlights: [
      "Gemini 3.1 Pro ও Deep Research এক্সেস",
      "5 TB ক্লাউড স্টোরেজ ও YouTube Premium",
      "সক্রিয় মেয়াদ ও সাপোর্ট",
    ],
    durationPerk: "সম্পূর্ণ মেয়াদে সাপোর্ট",
    popular: false,
    isActive: true,
  });

  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/pricing");
      const data = await res.json();
      if (data.success) {
        setPlans(data.plans);
      }
    } catch (e) {
      showToast("প্ল্যানের তথ্য লোড করতে ব্যর্থ", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleSavePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlan) return;

    setIsSaving(true);
    try {
      const res = await fetch(`/api/admin/pricing/${editingPlan.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingPlan),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast("সাবস্ক্রিপশন প্ল্যান সফলভাবে আপডেট হয়েছে!");
        setEditingPlan(null);
        fetchPlans();
      } else {
        showToast(data.message || "সংরক্ষণ ব্যর্থ হয়েছে", "error");
      }
    } catch (e: any) {
      showToast("সার্ভার ত্রুটি: সংরক্ষণ করা যায়নি", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreatePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/pricing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPlan),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast("নতুন সাবস্ক্রিপশন প্ল্যান তৈরি হয়েছে!");
        setCreateModalOpen(false);
        fetchPlans();
      } else {
        showToast(data.message || "প্ল্যান তৈরি ব্যর্থ", "error");
      }
    } catch {
      showToast("সার্ভার ত্রুটি", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeletePlan = async () => {
    if (!deletingId) return;
    try {
      const res = await fetch(`/api/admin/pricing/${deletingId}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        showToast("প্ল্যান মুছে ফেলা হয়েছে");
        setDeletingId(null);
        fetchPlans();
      }
    } catch {
      showToast("মুছে ফেলতে ব্যর্থ", "error");
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

      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-brand-purple/10 text-brand-purple px-3 py-1 rounded-full text-xs font-bold font-outfit mb-2">
            <span>Subscription Pricing System</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight font-outfit">
            Pricing & Plan Management
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-bangla">
            এখানে করা পরিবর্তনগুলো সরাসরি ওয়েবসাইটের প্রাইসিং কার্ড ও চেকআউট মডালে দৃশ্যমান হবে।
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setCreateModalOpen(true)}
            className="inline-flex items-center gap-2 bg-brand-blue hover:bg-brand-blue/90 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>নতুন প্ল্যান</span>
          </button>

          <button
            type="button"
            onClick={fetchPlans}
            disabled={loading}
            className="p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl border border-slate-200 transition-colors cursor-pointer"
            title="Refresh"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-3 py-16 text-center text-xs text-slate-400 font-bangla">
            প্ল্যান লোড হচ্ছে...
          </div>
        ) : (
          plans.map((plan) => {
            const highlightsList =
              typeof plan.highlights === "string"
                ? JSON.parse(plan.highlights)
                : plan.highlights || [];

            return (
              <div
                key={plan.id}
                className={`bg-white rounded-3xl p-6 border flex flex-col justify-between transition-all relative ${
                  plan.popular
                    ? "border-brand-indigo ring-2 ring-brand-purple/20 shadow-md"
                    : "border-slate-200 shadow-xs"
                }`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-gradient text-white text-[10px] font-bold uppercase tracking-wider px-3 py-0.5 rounded-full font-outfit shadow-sm">
                    Most Popular Choice
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${plan.badgeColor}`}>
                      {plan.badge}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">
                      ID: {plan.planKey}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mb-1">
                    {plan.name}
                  </h3>
                  <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                    {plan.description}
                  </p>

                  {/* Price */}
                  <div className="mb-4 pb-4 border-b border-slate-100">
                    <div className="flex items-baseline gap-1 font-outfit">
                      <span className="text-2xl font-bold text-brand-blue">৳</span>
                      <span className="text-4xl font-extrabold text-slate-900 tracking-tight">
                        {plan.price}
                      </span>
                    </div>
                    <span className="text-[11px] font-semibold text-brand-blue bg-blue-50 px-2.5 py-0.5 rounded-full inline-block mt-2 font-outfit">
                      {plan.monthlyBreakdown}
                    </span>
                  </div>

                  {/* Account Type Box */}
                  <div className={`p-3 rounded-2xl border ${plan.accountTypeStyle} mb-4`}>
                    <strong className="block text-xs font-bold text-slate-900">
                      {plan.accountTypeTitle}
                    </strong>
                    <span className="block text-[11px] text-slate-600 mt-0.5">
                      {plan.accountTypeSubtitle}
                    </span>
                  </div>

                  {/* Highlights */}
                  <div className="space-y-2 mb-6 text-xs text-slate-700">
                    {highlightsList.map((h: string, idx: number) => (
                      <div key={idx} className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-brand-purple shrink-0" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Edit & Delete Action Buttons */}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingPlan({ ...plan })}
                    className="flex-1 inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold py-2.5 px-4 rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>এডিট করুন</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeletingId(plan.id)}
                    className="p-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl transition-colors cursor-pointer"
                    title="Delete Plan"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Edit Plan Modal Dialog */}
      {editingPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-900 font-outfit">
                  Edit Plan: {editingPlan.name}
                </h3>
                <p className="text-xs text-slate-500">
                  মূল্য, ব্যাজ ও ডিসকাউন্ট পরিবর্তন করুন
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingPlan(null)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePlan} className="p-6 max-h-[75vh] overflow-y-auto space-y-4 text-xs font-bangla">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    প্ল্যানের নাম <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={editingPlan.name}
                    onChange={(e) => setEditingPlan({ ...editingPlan, name: e.target.value })}
                    required
                    className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-none focus:border-brand-blue"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1 font-outfit uppercase">
                    Selling Price (৳ BDT) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={editingPlan.price}
                    onChange={(e) => setEditingPlan({ ...editingPlan, price: Number(e.target.value) })}
                    required
                    className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 outline-none focus:border-brand-blue"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1 font-outfit uppercase">
                    Monthly Breakdown Text
                  </label>
                  <input
                    type="text"
                    value={editingPlan.monthlyBreakdown}
                    onChange={(e) => setEditingPlan({ ...editingPlan, monthlyBreakdown: e.target.value })}
                    placeholder="যেমন: ≈ ৳28 / মাস"
                    className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-none focus:border-brand-blue"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    ব্যাজ টেক্সট (Badge)
                  </label>
                  <input
                    type="text"
                    value={editingPlan.badge}
                    onChange={(e) => setEditingPlan({ ...editingPlan, badge: e.target.value })}
                    placeholder="যেমন: সেরা মূল্য • ৮৫% ছাড়"
                    className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-none focus:border-brand-blue"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  ছোট বিবরণ (Description)
                </label>
                <input
                  type="text"
                  value={editingPlan.description}
                  onChange={(e) => setEditingPlan({ ...editingPlan, description: e.target.value })}
                  className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-none focus:border-brand-blue"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    অ্যাকাউন্ট টাইপ শিরোনাম (Account Type Title)
                  </label>
                  <input
                    type="text"
                    value={editingPlan.accountTypeTitle}
                    onChange={(e) => setEditingPlan({ ...editingPlan, accountTypeTitle: e.target.value })}
                    className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-none focus:border-brand-blue"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    অ্যাকাউন্ট টাইপ বিবরণ (Subtitle)
                  </label>
                  <input
                    type="text"
                    value={editingPlan.accountTypeSubtitle}
                    onChange={(e) => setEditingPlan({ ...editingPlan, accountTypeSubtitle: e.target.value })}
                    className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-none focus:border-brand-blue"
                  />
                </div>
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingPlan.popular}
                    onChange={(e) => setEditingPlan({ ...editingPlan, popular: e.target.checked })}
                    className="rounded text-brand-blue"
                  />
                  <span className="font-semibold text-slate-700">Most Popular হিসেবে চিহ্নিত করুন</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingPlan.isActive}
                    onChange={(e) => setEditingPlan({ ...editingPlan, isActive: e.target.checked })}
                    className="rounded text-brand-blue"
                  />
                  <span className="font-semibold text-slate-700">সক্রিয় (Active) রাখুন</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingPlan(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  বাতিল
                </button>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 bg-brand-blue hover:bg-brand-blue/90 text-white font-semibold px-6 py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? "সংরক্ষণ হচ্ছে..." : "পরিবর্তন সংরক্ষণ করুন"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Plan Modal Dialog */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 font-bangla">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 font-outfit">
                Create New Subscription Plan
              </h3>
              <button
                type="button"
                onClick={() => setCreateModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePlan} className="p-6 max-h-[75vh] overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    প্ল্যান কী (Unique Key e.g. 6m, 24m) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newPlan.planKey}
                    onChange={(e) => setNewPlan({ ...newPlan, planKey: e.target.value.toLowerCase().trim() })}
                    placeholder="যেমন: 6m"
                    required
                    className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 outline-none focus:border-brand-blue"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    প্ল্যানের পুরো নাম <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newPlan.name}
                    onChange={(e) => setNewPlan({ ...newPlan, name: e.target.value })}
                    placeholder="যেমন: ৬ মাসের প্যাকেজ"
                    required
                    className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-none focus:border-brand-blue"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    বিক্রয় মূল্য (৳ BDT) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={newPlan.price}
                    onChange={(e) => setNewPlan({ ...newPlan, price: Number(e.target.value) })}
                    required
                    className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 outline-none focus:border-brand-blue"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Monthly Breakdown Text
                  </label>
                  <input
                    type="text"
                    value={newPlan.monthlyBreakdown}
                    onChange={(e) => setNewPlan({ ...newPlan, monthlyBreakdown: e.target.value })}
                    placeholder="যেমন: ৳৫৯ / মাস"
                    className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-none focus:border-brand-blue"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    অ্যাকাউন্ট টাইপ শিরোনাম
                  </label>
                  <input
                    type="text"
                    value={newPlan.accountTypeTitle}
                    onChange={(e) => setNewPlan({ ...newPlan, accountTypeTitle: e.target.value })}
                    className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-none focus:border-brand-blue"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    অ্যাকাউন্ট টাইপ সাবটাইটেল
                  </label>
                  <input
                    type="text"
                    value={newPlan.accountTypeSubtitle}
                    onChange={(e) => setNewPlan({ ...newPlan, accountTypeSubtitle: e.target.value })}
                    className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-none focus:border-brand-blue"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  বিবরণ
                </label>
                <input
                  type="text"
                  value={newPlan.description}
                  onChange={(e) => setNewPlan({ ...newPlan, description: e.target.value })}
                  className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-none focus:border-brand-blue"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 bg-brand-blue hover:bg-brand-blue/90 text-white font-semibold px-6 py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? "সংরক্ষণ হচ্ছে..." : "প্ল্যান তৈরি করুন"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal Dialog */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in font-bangla">
          <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl p-6 text-center animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-slate-900 mb-1">
              প্ল্যান মুছে ফেলতে চান?
            </h4>
            <p className="text-xs text-slate-500 mb-6">
              এটি ডাটাবেজ থেকে মুছে যাবে এবং ওয়েবসাইটের তালিকায় আর থাকবে না।
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setDeletingId(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                বাতিল
              </button>
              <button
                type="button"
                onClick={handleDeletePlan}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs"
              >
                মুছে ফেলুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
