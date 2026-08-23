"use client";

import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  ShieldAlert,
  Lock,
  Unlock,
  KeyRound,
  Link2,
  CheckCircle2,
  AlertCircle,
  Clock,
  Send,
  Plus,
  Layers,
  Search,
  RefreshCw,
  Copy,
  Check,
  Trash2,
  Eye,
  EyeOff,
  Mail,
  ExternalLink,
  Sparkles,
  Zap,
} from "lucide-react";

interface ActivationLink {
  id: string;
  link: string;
  plan_key: string;
  status: "available" | "assigned" | "sent" | "used";
  order_id: string | null;
  order_number: string | null;
  customer_name: string | null;
  customer_email: string | null;
  customer_phone: string | null;
  assigned_at: string | null;
  sent_at: string | null;
  email_status: "sent" | "failed" | "pending" | null;
  email_error: string | null;
  batch_label: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

interface Stats {
  total: number;
  available: number;
  assigned: number;
  sent: number;
  used: number;
}

export default function AdminActivationLinksPage() {
  // Vault Auth State
  const [isUnlocked, setIsUnlocked] = useState<boolean | null>(null);
  const [vaultPassword, setVaultPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Management State
  const [links, setLinks] = useState<ActivationLink[]>([]);
  const [stats, setStats] = useState<Stats>({
    total: 0,
    available: 0,
    assigned: 0,
    sent: 0,
    used: 0,
  });
  const [activeTab, setActiveTab] = useState<"available" | "history">("available");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [revealedIds, setRevealedIds] = useState<Record<string, boolean>>({});

  // Modals State
  const [isSingleModalOpen, setIsSingleModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [singleLink, setSingleLink] = useState("");
  const [singleBatch, setSingleBatch] = useState("");
  const [bulkLinksText, setBulkLinksText] = useState("");
  const [bulkBatch, setBulkBatch] = useState("");
  const [modalLoading, setModalLoading] = useState(false);

  // Action State
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [resendingId, setResendingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // 1. Check if Vault is already unlocked on mount
  const checkVaultStatus = async () => {
    try {
      const res = await fetch("/api/admin/activation-links/auth");
      const data = await res.json();
      if (data.unlocked) {
        setIsUnlocked(true);
        fetchLinks();
      } else {
        setIsUnlocked(false);
      }
    } catch {
      setIsUnlocked(false);
    }
  };

  useEffect(() => {
    checkVaultStatus();
  }, []);

  // 2. Unlock Vault with Master Password
  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vaultPassword.trim()) {
      setAuthError("অনুগ্রহ করে ভল্ট পাসওয়ার্ড লিখুন");
      return;
    }

    setAuthLoading(true);
    setAuthError(null);

    try {
      const res = await fetch("/api/admin/activation-links/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: vaultPassword }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setIsUnlocked(true);
        setVaultPassword("");
        showToast("ভল্ট সফলভাবে আনলক হয়েছে!", "success");
        fetchLinks();
      } else {
        setAuthError(data.message || "ভুল পাসওয়ার্ড! প্রবেশাধিকার প্রত্যাখ্যাত।");
      }
    } catch (err: any) {
      setAuthError("সার্ভার ত্রুটি: পুনরায় চেষ্টা করুন");
    } finally {
      setAuthLoading(false);
    }
  };

  // 3. Lock Vault immediately
  const handleLockVault = async () => {
    try {
      await fetch("/api/admin/activation-links/auth", { method: "DELETE" });
      setIsUnlocked(false);
      setLinks([]);
      showToast("ভল্ট লক করা হয়েছে।", "success");
    } catch {
      setIsUnlocked(false);
    }
  };

  // 4. Fetch Activation Links
  const fetchLinks = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/activation-links?status=all");
      if (res.status === 403 || res.status === 401) {
        setIsUnlocked(false);
        return;
      }
      const data = await res.json();
      if (data.success) {
        setLinks(data.links || []);
        if (data.stats) setStats(data.stats);
      } else {
        showToast(data.message || "Failed to load links", "error");
      }
    } catch (err: any) {
      showToast(err.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  // 5. Add Single Link
  const handleAddSingle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!singleLink.trim()) {
      showToast("অ্যাক্টিভেশন লিংক লিখুন", "error");
      return;
    }

    setModalLoading(true);
    try {
      const res = await fetch("/api/admin/activation-links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          link: singleLink.trim(),
          batchLabel: singleBatch.trim() || "Single Entry",
          planKey: "18m",
        }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        showToast(data.message, "success");
        setSingleLink("");
        setSingleBatch("");
        setIsSingleModalOpen(false);
        fetchLinks();
      } else {
        showToast(data.message || "Failed to add link", "error");
      }
    } catch (err: any) {
      showToast(err.message, "error");
    } finally {
      setModalLoading(false);
    }
  };

  // 6. Bulk Add Links
  const handleAddBulk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bulkLinksText.trim()) {
      showToast("অন্তত একটি অ্যাক্টিভেশন লিংক পেস্ট করুন", "error");
      return;
    }

    setModalLoading(true);
    try {
      const res = await fetch("/api/admin/activation-links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          links: bulkLinksText,
          batchLabel: bulkBatch.trim() || "Bulk Batch",
          planKey: "18m",
        }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        showToast(data.message, "success");
        setBulkLinksText("");
        setBulkBatch("");
        setIsBulkModalOpen(false);
        fetchLinks();
      } else {
        showToast(data.message || "Failed to add bulk links", "error");
      }
    } catch (err: any) {
      showToast(err.message, "error");
    } finally {
      setModalLoading(false);
    }
  };

  // 7. Delete an available link
  const handleDeleteLink = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/activation-links/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (res.ok && data.success) {
        showToast("লিংকটি সফলভাবে মুছে ফেলা হয়েছে", "success");
        setDeletingId(null);
        fetchLinks();
      } else {
        showToast(data.message || "মুছে ফেলা ব্যর্থ হয়েছে", "error");
      }
    } catch (err: any) {
      showToast(err.message, "error");
    }
  };

  // 8. Resend Email to customer
  const handleResendEmail = async (id: string) => {
    setResendingId(id);
    try {
      const res = await fetch("/api/admin/activation-links/resend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ linkId: id }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        showToast("গ্রাহককে পুনরায় ইমেইল সফলভাবে পাঠানো হয়েছে!", "success");
        fetchLinks();
      } else {
        showToast(data.message || "ইমেইল পাঠানো ব্যর্থ হয়েছে", "error");
      }
    } catch (err: any) {
      showToast(err.message, "error");
    } finally {
      setResendingId(null);
    }
  };

  // 9. Copy to clipboard
  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showToast("লিংক কপি করা হয়েছে!", "success");
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Filtered links based on active tab and search
  const filteredLinks = links.filter((l) => {
    if (activeTab === "available" && l.status !== "available") return false;
    if (activeTab === "history" && l.status === "available") return false;

    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      l.link.toLowerCase().includes(term) ||
      (l.customer_email && l.customer_email.toLowerCase().includes(term)) ||
      (l.order_number && l.order_number.toLowerCase().includes(term)) ||
      (l.customer_name && l.customer_name.toLowerCase().includes(term)) ||
      (l.batch_label && l.batch_label.toLowerCase().includes(term))
    );
  });

  // Calculate bulk link lines count
  const bulkLinesCount = bulkLinksText
    .split("\n")
    .map((s) => s.trim())
    .filter((s) => s.length > 5).length;

  // ----------------------------------------------------
  // RENDER: Loading Initial Auth Check
  // ----------------------------------------------------
  if (isUnlocked === null) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-brand-indigo/20 border-t-brand-indigo rounded-full animate-spin mb-4" />
        <p className="text-sm font-semibold text-slate-500 font-outfit">Verifying Vault Security Layer...</p>
      </div>
    );
  }

  // ----------------------------------------------------
  // RENDER: LOCKED VAULT VIEW
  // ----------------------------------------------------
  if (!isUnlocked) {
    return (
      <div className="max-w-md mx-auto my-12 sm:my-20">
        {/* Toast Alert */}
        {toast && (
          <div
            className={`fixed top-6 right-6 z-50 px-4 py-3 rounded-xl shadow-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-200 ${
              toast.type === "success" ? "bg-slate-900 text-emerald-400" : "bg-red-900 text-white"
            }`}
          >
            {toast.type === "success" ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            <span>{toast.message}</span>
          </div>
        )}

        <div className="bg-white rounded-3xl p-7 sm:p-9 shadow-xl border border-slate-200/90 text-center relative overflow-hidden">
          {/* Top Security Glow Badge */}
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 flex items-center justify-center mx-auto mb-5 shadow-xs">
            <Lock className="w-8 h-8" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold font-outfit mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-brand-indigo" />
            <span>End-to-End Vault Protection</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2 font-bangla">
            অ্যাক্টিভেশন লিংক সিকিউর ভল্ট
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mb-7 leading-relaxed font-bangla">
            ১৮ মাসের Google AI Pro অ্যাক্টিভেশন লিংক ইনভেন্টরি ও ডেলিভারি হিস্ট্রি সম্পূর্ণ সুরক্ষিত। প্রবেশ করতে আপনার
            মাস্টার ভল্ট পাসওয়ার্ড লিখুন।
          </p>

          {/* Form */}
          <form onSubmit={handleUnlock} className="space-y-4">
            <div className="relative text-left">
              <label className="block text-xs font-bold text-slate-700 mb-1.5 font-outfit">
                Vault Master Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={vaultPassword}
                  onChange={(e) => setVaultPassword(e.target.value)}
                  placeholder="ভল্ট পাসওয়ার্ড দিন..."
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand-indigo/30 focus:border-brand-indigo pr-10"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {authError && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-red-600 font-medium flex items-center gap-2 text-left">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={authLoading}
              className="w-full py-3.5 bg-gradient-to-r from-brand-indigo to-brand-purple hover:opacity-95 text-white font-bold rounded-xl text-sm shadow-md shadow-brand-indigo/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              {authLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>আনলক করা হচ্ছে...</span>
                </>
              ) : (
                <>
                  <Unlock className="w-4 h-4" />
                  <span>ভল্ট আনলক করুন</span>
                </>
              )}
            </button>
          </form>

          <p className="text-[11px] text-slate-600 mt-6 flex items-center justify-center gap-1">
            <KeyRound className="w-3 h-3 text-slate-600" />
            <span>সেশন নিষ্ক্রিয় হলে ২ ঘণ্টা পর ভল্ট স্বয়ংক্রিয়ভাবে পুনরায় লক হয়ে যাবে।</span>
          </p>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // RENDER: UNLOCKED MANAGEMENT DASHBOARD
  // ----------------------------------------------------
  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-50 px-4 py-3 rounded-xl shadow-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-200 ${
            toast.type === "success" ? "bg-slate-900 text-emerald-400" : "bg-red-900 text-white"
          }`}
        >
          {toast.type === "success" ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h1 className="text-xl font-bold text-slate-900 font-bangla">
              ১৮ মাসের অ্যাক্টিভেশন লিংক ইনভেন্টরি
            </h1>
            <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold font-outfit">
              Vault Unlocked 🔓
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            ১৮ মাসের প্ল্যান কেনার পর সিস্টেম স্বয়ংক্রিয়ভাবে এখান থেকে একটি লিংক কাস্টমারের জিমেইলে পাঠায়।
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setIsSingleModalOpen(true)}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>একটি লিংক যোগ করুন</span>
          </button>

          <button
            onClick={() => setIsBulkModalOpen(true)}
            className="px-3.5 py-2 bg-brand-gradient hover:opacity-95 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>বাল্ক আপলোড (Bulk Add)</span>
          </button>

          <button
            onClick={fetchLinks}
            disabled={isLoading}
            className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs transition-all cursor-pointer"
            title="রিফ্রেশ করুন"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          </button>

          <button
            onClick={handleLockVault}
            className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200/80 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
            title="ভল্ট এখনই লক করুন"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>লক করুন</span>
          </button>
        </div>
      </div>

      {/* 4 Stat Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Available Links */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              Ready to Assign
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900 font-outfit">{stats.available}</div>
          <p className="text-xs text-slate-500 mt-1 font-bangla">অব্যবহৃত অ্যাক্টিভেশন লিংক স্টক</p>
          {stats.available <= 3 && (
            <div className="mt-2 text-[11px] text-amber-700 bg-amber-50 p-1.5 rounded-md border border-amber-200 font-semibold flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              <span>স্টক কম! নতুন লিংক যুক্ত করুন।</span>
            </div>
          )}
        </div>

        {/* Assigned & Sent */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
              Delivered to 18m
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-brand-blue flex items-center justify-center">
              <Send className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900 font-outfit">{stats.sent + stats.assigned}</div>
          <p className="text-xs text-slate-500 mt-1 font-bangla">গ্রাহককে সফলভাবে প্রেরিত</p>
        </div>

        {/* Used Links */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
              Active / Claimed
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-brand-purple flex items-center justify-center">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900 font-outfit">{stats.used}</div>
          <p className="text-xs text-slate-500 mt-1 font-bangla">সক্রিয় সাবস্ক্রিপশন লিংক</p>
        </div>

        {/* Total Stored */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
              Total In Inventory
            </span>
            <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
              <Link2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900 font-outfit">{stats.total}</div>
          <p className="text-xs text-slate-500 mt-1 font-bangla">সর্বমোট আপলোডকৃত লিংক</p>
        </div>
      </div>

      {/* Tabs & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Tabs */}
        <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-xl">
          <button
            onClick={() => setActiveTab("available")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === "available"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>অব্যবহৃত লিংক পুল ({stats.available})</span>
          </button>

          <button
            onClick={() => setActiveTab("history")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === "history"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-brand-blue" />
            <span>অ্যাসাইন ও ডেলিভারি হিস্ট্রি ({stats.sent + stats.assigned + stats.used})</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="ইমেইল, অর্ডার আইডি, লিংক বা ব্যাচ দিয়ে খুঁজুন..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-indigo/30 focus:border-brand-indigo"
          />
        </div>
      </div>

      {/* Table Canvas */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="py-20 text-center">
            <div className="w-8 h-8 border-3 border-brand-indigo/20 border-t-brand-indigo rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs text-slate-500 font-semibold">লোড হচ্ছে...</p>
          </div>
        ) : filteredLinks.length === 0 ? (
          <div className="py-16 text-center px-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <Link2 className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-700">কোনো লিংক পাওয়া যায়নি</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              {activeTab === "available"
                ? "বর্তমানে কোনো অব্যবহৃত লিংক অবশিষ্ট নেই। 'একটি লিংক যোগ করুন' বা 'বাল্ক আপলোড' বাটনে ক্লিক করে নতুন লিংক যুক্ত করুন।"
                : "এখনও ১৮ মাসের কোনো অর্ডারে লিংক ডেলিভারি করা হয়নি।"}
            </p>
            {activeTab === "available" && (
              <button
                onClick={() => setIsBulkModalOpen(true)}
                className="mt-4 px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-xl inline-flex items-center gap-1.5 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>নতুন লিংক আপলোড করুন</span>
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider font-outfit">
                  <th className="py-3.5 px-4">অ্যাক্টিভেশন লিংক</th>
                  {activeTab === "history" ? (
                    <>
                      <th className="py-3.5 px-4">গ্রাহক ও অর্ডার</th>
                      <th className="py-3.5 px-4">অ্যাসাইন ও প্রেরণের সময়</th>
                      <th className="py-3.5 px-4">ইমেইল স্ট্যাটাস</th>
                    </>
                  ) : (
                    <>
                      <th className="py-3.5 px-4">প্ল্যান</th>
                      <th className="py-3.5 px-4">ব্যাচ ও নোট</th>
                      <th className="py-3.5 px-4">যুক্ত করার সময়</th>
                      <th className="py-3.5 px-4">স্ট্যাটাস</th>
                    </>
                  )}
                  <th className="py-3.5 px-4 text-right">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {filteredLinks.map((item) => {
                  const isRevealed = revealedIds[item.id];
                  const isCopied = copiedId === item.id;

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                      {/* Activation Link Column */}
                      <td className="py-3.5 px-4 max-w-[280px]">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[11px] text-slate-800 truncate select-all">
                            {isRevealed
                              ? item.link
                              : item.link.slice(0, 24) + "••••••••" + item.link.slice(-8)}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              setRevealedIds((prev) => ({ ...prev, [item.id]: !prev[item.id] }))
                            }
                            className="text-slate-400 hover:text-slate-600 p-1"
                            title={isRevealed ? "Hide URL" : "Reveal URL"}
                          >
                            {isRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </td>

                      {/* HISTORY TAB SPECIFIC COLUMNS */}
                      {activeTab === "history" ? (
                        <>
                          {/* Customer & Order */}
                          <td className="py-3.5 px-4">
                            <div>
                              <span className="font-bold text-slate-900 block truncate">
                                {item.customer_email || "N/A"}
                              </span>
                              <span className="text-[11px] text-slate-500 font-mono">
                                {item.order_number || "#Order"} {item.customer_name ? `• ${item.customer_name}` : ""}
                              </span>
                            </div>
                          </td>

                          {/* Assigned & Sent Time */}
                          <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">
                            <div>
                              {item.assigned_at
                                ? new Date(item.assigned_at).toLocaleString("en-GB", {
                                    day: "numeric",
                                    month: "short",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })
                                : "N/A"}
                            </div>
                            {item.sent_at && (
                              <span className="text-[10px] text-emerald-600 block">
                                Emailed:{" "}
                                {new Date(item.sent_at).toLocaleTimeString("en-GB", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                            )}
                          </td>

                          {/* Email Status */}
                          <td className="py-3.5 px-4">
                            {item.email_status === "sent" ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                                <Check className="w-3 h-3" />
                                <span>ইমেইল প্রেরিত</span>
                              </span>
                            ) : item.email_status === "failed" ? (
                              <span
                                className="inline-flex items-center gap-1 text-[11px] font-semibold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded-md"
                                title={item.email_error || "Email failed"}
                              >
                                <AlertCircle className="w-3 h-3" />
                                <span>ব্যর্থ (Failed)</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
                                <Clock className="w-3 h-3" />
                                <span>পেন্ডিং</span>
                              </span>
                            )}
                          </td>
                        </>
                      ) : (
                        /* AVAILABLE TAB SPECIFIC COLUMNS */
                        <>
                          {/* Plan */}
                          <td className="py-3.5 px-4">
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200 text-[11px] font-bold">
                              <Sparkles className="w-3 h-3" />
                              <span>১৮ মাসের অফার</span>
                            </span>
                          </td>

                          {/* Batch */}
                          <td className="py-3.5 px-4">
                            <span className="text-slate-600 text-[11px]">
                              {item.batch_label || "General Batch"}
                            </span>
                          </td>

                          {/* Added Date */}
                          <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">
                            {new Date(item.created_at).toLocaleString("en-GB", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </td>

                          {/* Status */}
                          <td className="py-3.5 px-4">
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-md">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Available</span>
                            </span>
                          </td>
                        </>
                      )}

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Copy Link Button */}
                          <button
                            type="button"
                            onClick={() => handleCopy(item.link, item.id)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                            title="লিংক কপি করুন"
                          >
                            {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>

                          {/* Resend Email Button (History Tab only) */}
                          {activeTab === "history" && item.customer_email && (
                            <button
                              type="button"
                              onClick={() => handleResendEmail(item.id)}
                              disabled={resendingId === item.id}
                              className="px-2.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-brand-blue font-semibold text-[11px] transition-colors flex items-center gap-1 disabled:opacity-50"
                              title="গ্রাহককে পুনরায় ইমেইল পাঠান"
                            >
                              <Mail className={`w-3.5 h-3.5 ${resendingId === item.id ? "animate-spin" : ""}`} />
                              <span>পুনরায় পাঠান</span>
                            </button>
                          )}

                          {/* Delete Link Button (Available Tab only) */}
                          {activeTab === "available" && (
                            <button
                              type="button"
                              onClick={() => setDeletingId(item.id)}
                              className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
                              title="লিংক মুছে ফেলুন"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ---------------------------------------------------- */}
      {/* MODAL 1: ADD SINGLE LINK */}
      {/* ---------------------------------------------------- */}
      {isSingleModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center">
                  <Plus className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-slate-900 font-bangla">একটি অ্যাক্টিভেশন লিংক যোগ করুন</h3>
              </div>
              <button
                onClick={() => setIsSingleModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSingle} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 font-outfit">
                  Google AI Pro Activation URL <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  value={singleLink}
                  onChange={(e) => setSingleLink(e.target.value)}
                  placeholder="https://one.google.com/promo/..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-brand-indigo"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 font-outfit">
                  Batch Label / Note (Optional)
                </label>
                <input
                  type="text"
                  value={singleBatch}
                  onChange={(e) => setSingleBatch(e.target.value)}
                  placeholder="যেমন: Batch #1 (Aug 2026)"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-indigo"
                />
              </div>

              <div className="bg-purple-50 p-3 rounded-xl text-[11px] text-brand-purple font-medium flex items-start gap-2">
                <Sparkles className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>
                  এই লিংকটি শুধুমাত্র <strong>১৮ মাসের মেগা অফার</strong> ক্রয়কারী গ্রাহকদের জন্য স্বয়ংক্রিয়ভাবে
                  অ্যাসাইন করা হবে।
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsSingleModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={modalLoading}
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-md disabled:opacity-50"
                >
                  {modalLoading ? "যোগ হচ্ছে..." : "সংরক্ষণ করুন"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* MODAL 2: BULK ADD LINKS */}
      {/* ---------------------------------------------------- */}
      {isBulkModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-xl w-full shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-brand-gradient text-white flex items-center justify-center">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 font-bangla">বাল্ক লিংক আপলোড (Bulk Add)</h3>
                  <p className="text-xs text-slate-500">প্রতি লাইনে একটি করে অ্যাক্টিভেশন লিংক পেস্ট করুন</p>
                </div>
              </div>
              <button
                onClick={() => setIsBulkModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddBulk} className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700 font-outfit">
                    Activation Links List <span className="text-red-500">*</span>
                  </label>
                  <span className="text-[11px] font-mono text-brand-indigo font-bold">
                    {bulkLinesCount} টি লিংক সনাক্ত করা হয়েছে
                  </span>
                </div>
                <textarea
                  rows={7}
                  value={bulkLinksText}
                  onChange={(e) => setBulkLinksText(e.target.value)}
                  placeholder={`https://one.google.com/promo/link1...\nhttps://one.google.com/promo/link2...\nhttps://one.google.com/promo/link3...`}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-brand-indigo resize-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 font-outfit">
                  Batch Label (Optional)
                </label>
                <input
                  type="text"
                  value={bulkBatch}
                  onChange={(e) => setBulkBatch(e.target.value)}
                  placeholder="যেমন: Bulk Batch #1 - August 2026"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-indigo"
                />
              </div>

              <div className="bg-slate-50 border border-slate-200/80 p-3 rounded-xl text-[11px] text-slate-600 space-y-1">
                <p>• ডাটাবেজে আগে থেকে থাকা ডুপ্লিকেট লিংক স্বয়ংক্রিয়ভাবে বাদ দেওয়া হবে।</p>
                <p>• সফলভাবে ইনসার্ট হওয়া লিংকগুলো অবিলম্বে ১৮ মাসের অর্ডারের জন্য প্রস্তুত হবে।</p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsBulkModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={modalLoading || bulkLinesCount === 0}
                  className="px-5 py-2.5 bg-brand-gradient hover:opacity-95 text-white text-xs font-bold rounded-xl shadow-md disabled:opacity-50"
                >
                  {modalLoading ? "আপলোড হচ্ছে..." : `আপলোড করুন (${bulkLinesCount} টি লিংক)`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* MODAL 3: DELETE CONFIRMATION */}
      {/* ---------------------------------------------------- */}
      {deletingId && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-200 text-center animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 font-bangla mb-1">
              লিংকটি মুছে ফেলতে চান?
            </h3>
            <p className="text-xs text-slate-500 mb-5 font-bangla">
              এই অব্যবহৃত অ্যাক্টিভেশন লিংকটি ডাটাবেজ থেকে স্থায়ীভাবে মুছে ফেলা হবে।
            </p>

            <div className="flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setDeletingId(null)}
                className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl"
              >
                বাতিল
              </button>
              <button
                type="button"
                onClick={() => handleDeleteLink(deletingId)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-sm"
              >
                হ্যাঁ, মুছে ফেলুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
