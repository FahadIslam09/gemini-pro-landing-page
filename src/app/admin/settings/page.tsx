"use client";

import React, { useState, useEffect } from "react";
import {
  Settings,
  Lock,
  User,
  ShieldCheck,
  Save,
  Check,
  AlertCircle,
  KeyRound,
  Eye,
  EyeOff,
} from "lucide-react";

export default function AdminSettingsPage() {
  const [profile, setProfile] = useState({
    name: "",
    username: "",
    email: "",
    role: "",
  });

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    fetch("/api/admin/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.admin) {
          setProfile({
            name: data.admin.name || "",
            username: data.admin.username || "",
            email: data.admin.email || "",
            role: data.admin.role || "super_admin",
          });
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword && newPassword !== confirmPassword) {
      showToast("নতুন পাসওয়ার্ড ও কনফার্ম পাসওয়ার্ড মিলছে না", "error");
      return;
    }

    if (newPassword && newPassword.length < 8) {
      showToast("পাসওয়ার্ড ন্যূনতম ৮ অক্ষরের হতে হবে", "error");
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/auth/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: profile.name,
          email: profile.email,
          currentPassword: currentPassword || undefined,
          newPassword: newPassword || undefined,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast("প্রোফাইল ও নিরাপত্তা সেটিংস সফলভাবে সংরক্ষিত হয়েছে!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        showToast(data.message || "আপডেট ব্যর্থ", "error");
      }
    } catch {
      showToast("সার্ভার ত্রুটি", "error");
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
            <span>Security & Access Control</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight font-outfit">
            Admin Settings & Security
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-bangla">
            অ্যাডমিন প্রোফাইল তথ্য ও সিকিউরিটি পাসওয়ার্ড পরিবর্তন করুন।
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Settings Form (8 cols) */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
          <form onSubmit={handleUpdateProfile} className="space-y-6 font-bangla text-xs">
            
            {/* Profile Info */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 font-outfit uppercase">
                Administrator Profile
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    অ্যাডমিনের পুরো নাম
                  </label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    required
                    className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-brand-blue"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    ইউজারনেম (Username)
                  </label>
                  <input
                    type="text"
                    value={profile.username}
                    disabled
                    className="w-full h-11 px-3.5 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 outline-none cursor-not-allowed font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  অফিসিয়াল ইমেইল
                </label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  required
                  className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-brand-blue font-mono"
                />
              </div>
            </div>

            {/* Change Password Section */}
            <div className="pt-6 border-t border-slate-100 space-y-4">
              <div className="flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-brand-purple" />
                <h3 className="text-sm font-bold text-slate-900 font-outfit uppercase">
                  Change Password
                </h3>
              </div>
              <p className="text-[11px] text-slate-500">
                পাসওয়ার্ড পরিবর্তন না করতে চাইলে নিচের ফিল্ডগুলো ফাঁকা রাখুন।
              </p>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  বর্তমান পাসওয়ার্ড (Current Password)
                </label>
                <div className="relative">
                  <input
                    type={showCurrent ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="বর্তমান পাসওয়ার্ড লিখুন"
                    className="w-full h-11 px-3.5 pr-10 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-brand-blue font-outfit"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent(!showCurrent)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                  >
                    {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    নতুন পাসওয়ার্ড (New Password)
                  </label>
                  <div className="relative">
                    <input
                      type={showNew ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="কমপক্ষে ৮ অক্ষরের পাসওয়ার্ড"
                      className="w-full h-11 px-3.5 pr-10 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-brand-blue font-outfit"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNew(!showNew)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                    >
                      {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    পাসওয়ার্ড নিশ্চিত করুন (Confirm)
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="পুনরায় নতুন পাসওয়ার্ড লিখুন"
                    className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-brand-blue font-outfit"
                  />
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center gap-2 bg-brand-blue hover:bg-brand-blue/90 text-white font-semibold text-xs px-8 py-3 rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? "সংরক্ষণ হচ্ছে..." : "সেটিংস সংরক্ষণ করুন"}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Security Overview Box (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
            <h4 className="text-xs font-bold text-slate-900 font-outfit uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Security Highlights</span>
            </h4>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">
                  Password Encryption
                </span>
                <span className="font-mono text-slate-800 font-semibold">
                  bcrypt (Salt Rounds 12)
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">
                  Session Token
                </span>
                <span className="font-mono text-slate-800 font-semibold">
                  JWT via HTTP-Only Secure Cookie
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">
                  Rate Limiter
                </span>
                <span className="text-slate-800 font-medium font-bangla">
                  ৫ বার ভুল চেষ্টার পর ১৫ মিনিট লক
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
