"use client";

import React, { useState, useEffect } from "react";
import {
  HelpCircle,
  Plus,
  Edit2,
  Trash2,
  Check,
  AlertCircle,
  Search,
  RefreshCw,
  ArrowUp,
  ArrowDown,
  X,
  Save,
} from "lucide-react";

export default function AdminFaqPage() {
  const [faqs, setFaqs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<any | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchFaqs = async () => {
    setLoading(true);
    try {
      const url = new URL("/api/admin/faq", window.location.origin);
      if (search) url.searchParams.set("search", search);
      if (category && category !== "all") url.searchParams.set("category", category);

      const res = await fetch(url.toString());
      const data = await res.json();
      if (data.success) {
        setFaqs(data.faqs);
      }
    } catch {
      showToast("FAQ লোড করতে ব্যর্থ", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, [category]);

  const handleOpenAdd = () => {
    setEditingFaq({
      question: "",
      answer: "",
      category: "general",
      isActive: true,
      orderIndex: faqs.length,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (faq: any) => {
    setEditingFaq({ ...faq });
    setModalOpen(true);
  };

  const handleSaveFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFaq) return;

    setIsSaving(true);
    try {
      const isEdit = Boolean(editingFaq.id);
      const url = isEdit ? `/api/admin/faq/${editingFaq.id}` : "/api/admin/faq";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingFaq),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast(isEdit ? "FAQ আপডেট হয়েছে!" : "নতুন FAQ যুক্ত হয়েছে!");
        setModalOpen(false);
        setEditingFaq(null);
        fetchFaqs();
      } else {
        showToast(data.message || "সংরক্ষণ ব্যর্থ", "error");
      }
    } catch {
      showToast("সার্ভার ত্রুটি", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteFaq = async () => {
    if (!deletingId) return;
    try {
      const res = await fetch(`/api/admin/faq/${deletingId}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        showToast("FAQ মুছে ফেলা হয়েছে");
        setDeletingId(null);
        fetchFaqs();
      }
    } catch {
      showToast("মুছে ফেলতে ব্যর্থ", "error");
    }
  };

  const handleToggleActive = async (faq: any) => {
    try {
      const res = await fetch(`/api/admin/faq/${faq.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !faq.isActive }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(faq.isActive ? "FAQ নিষ্ক্রিয় করা হয়েছে" : "FAQ সক্রিয় করা হয়েছে");
        fetchFaqs();
      }
    } catch {
      showToast("আপডেট ব্যর্থ", "error");
    }
  };

  const handleMoveOrder = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= faqs.length) return;

    const newFaqs = [...faqs];
    const temp = newFaqs[index];
    newFaqs[index] = newFaqs[targetIndex];
    newFaqs[targetIndex] = temp;

    const items = newFaqs.map((f, i) => ({ id: f.id, orderIndex: i }));
    setFaqs(newFaqs);

    try {
      await fetch("/api/admin/faq/reorder", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
      showToast("FAQ ক্রম আপডেট হয়েছে");
    } catch {
      fetchFaqs();
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
            <span>Customer Knowledge Base</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight font-outfit">
            FAQ Management
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-bangla">
            ওয়েবসাইটের সচরাচর জিজ্ঞাসা (FAQ) যোগ, পরিবর্তন ও ক্রম নিয়ন্ত্রণ করুন।
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 bg-brand-blue hover:bg-brand-blue/90 text-white text-xs font-semibold px-5 py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন FAQ যোগ করুন</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs font-bangla">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchFaqs()}
            placeholder="FAQ সার্চ করুন..."
            className="w-full h-10 pl-10 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-brand-blue"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: "all", label: "সকল ক্যাটাগরি" },
            { id: "activation", label: "অ্যাক্টিভেশন" },
            { id: "account", label: "অ্যাকাউন্ট" },
            { id: "plans", label: "প্ল্যান" },
            { id: "storage", label: "স্টোরেজ" },
            { id: "support", label: "সাপোর্ট" },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                category === cat.id
                  ? "bg-slate-900 text-white"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* FAQs List Table */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-bangla">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-outfit uppercase">
                <th className="py-3 px-5 font-bold w-12 text-center">#</th>
                <th className="py-3 px-5 font-bold">প্রশ্ন ও উত্তর</th>
                <th className="py-3 px-5 font-bold w-28">ক্যাটাগরি</th>
                <th className="py-3 px-5 font-bold w-24 text-center">স্ট্যাটাস</th>
                <th className="py-3 px-5 font-bold w-36 text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    লোড হচ্ছে...
                  </td>
                </tr>
              ) : faqs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    কোনো FAQ রেকর্ড পাওয়া যায়নি
                  </td>
                </tr>
              ) : (
                faqs.map((faq, index) => (
                  <tr key={faq.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-5 text-center font-mono font-bold text-slate-400">
                      {index + 1}
                    </td>
                    <td className="py-4 px-5">
                      <strong className="text-sm font-bold text-slate-900 block mb-1">
                        {faq.question}
                      </strong>
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {faq.answer}
                      </p>
                    </td>
                    <td className="py-4 px-5">
                      <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full text-[10px] font-mono uppercase font-bold">
                        {faq.category}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleActive(faq)}
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold font-outfit cursor-pointer ${
                          faq.isActive
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {faq.isActive ? "Active" : "Disabled"}
                      </button>
                    </td>
                    <td className="py-4 px-5 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleMoveOrder(index, "up")}
                          disabled={index === 0}
                          className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30"
                          title="Move Up"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveOrder(index, "down")}
                          disabled={index === faqs.length - 1}
                          className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30"
                          title="Move Down"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(faq)}
                          className="p-1.5 text-slate-600 hover:text-brand-blue rounded-md hover:bg-slate-100 cursor-pointer"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeletingId(faq.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-md hover:bg-rose-50 cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit FAQ Modal */}
      {modalOpen && editingFaq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 font-bangla">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 font-outfit">
                {editingFaq.id ? "Edit FAQ" : "Add New FAQ"}
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveFaq} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  প্রশ্ন (Question) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={editingFaq.question}
                  onChange={(e) => setEditingFaq({ ...editingFaq, question: e.target.value })}
                  placeholder="যেমন: সাবস্ক্রিপশন কতক্ষণে সক্রিয় হবে?"
                  required
                  className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-none focus:border-brand-blue"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  উত্তর (Answer) <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  value={editingFaq.answer}
                  onChange={(e) => setEditingFaq({ ...editingFaq, answer: e.target.value })}
                  placeholder="বিস্তারিত উত্তর লিখুন..."
                  required
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-none focus:border-brand-blue resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    ক্যাটাগরি
                  </label>
                  <select
                    value={editingFaq.category}
                    onChange={(e) => setEditingFaq({ ...editingFaq, category: e.target.value })}
                    className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-none focus:border-brand-blue"
                  >
                    <option value="general">সাধারণ (General)</option>
                    <option value="activation">অ্যাক্টিভেশন (Activation)</option>
                    <option value="account">অ্যাকাউন্ট (Account)</option>
                    <option value="plans">প্ল্যান (Plans)</option>
                    <option value="storage">স্টোরেজ (Storage)</option>
                    <option value="support">সাপোর্ট (Support)</option>
                  </select>
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingFaq.isActive}
                      onChange={(e) => setEditingFaq({ ...editingFaq, isActive: e.target.checked })}
                      className="rounded text-brand-blue"
                    />
                    <span className="font-semibold text-slate-700">ওয়েবসাইটে প্রকাশ করুন</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
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
                  <span>{isSaving ? "সংরক্ষণ হচ্ছে..." : "সংরক্ষণ করুন"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal Dialog */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl p-6 text-center animate-in zoom-in-95 font-bangla">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-slate-900 mb-1">
              FAQ মুছে ফেলতে চান?
            </h4>
            <p className="text-xs text-slate-500 mb-6">
              এটি স্থায়ীভাবে ওয়েবসাইট থেকে মুছে যাবে। আপনি কি নিশ্চিত?
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
                onClick={handleDeleteFaq}
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
