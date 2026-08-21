"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Sparkles, Lock, User, ArrowRight, Loader2, AlertCircle, ShieldCheck, Eye, EyeOff } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/admin";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        router.push(from);
        router.refresh();
      } else {
        setErrorMessage(data.message || "ভুল ব্যবহারকারীর নাম বা পাসওয়ার্ড");
        setIsLoading(false);
      }
    } catch (err: any) {
      setErrorMessage("সার্ভার ত্রুটি: অনুগ্রহ করে পুনরায় চেষ্টা করুন");
      setIsLoading(false);
    }
  };

  return (
    <div className="relative z-10 w-full max-w-md bg-white/95 backdrop-blur-xl rounded-[32px] p-8 sm:p-10 shadow-2xl border border-white/20">
      {/* Brand Icon & Heading */}
      <div className="text-center mb-8">
        <div className="w-14 h-14 rounded-2xl bg-brand-gradient flex items-center justify-center text-white mx-auto mb-4 shadow-lg shadow-brand-purple/20">
          <Sparkles className="w-7 h-7" />
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight font-outfit">
          Admin Console
        </h1>
        <p className="text-xs text-slate-500 mt-1 font-medium font-bangla">
          Google AI Pro ম্যানেজমেন্ট প্যানেলে সাইন-ইন করুন
        </p>
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <div className="mb-6 p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-2.5 text-xs text-rose-700 font-bangla animate-in fade-in">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-4 font-bangla">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5 font-outfit uppercase tracking-wider">
            Username or Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <User className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
              required
              disabled={isLoading}
              className="w-full h-11 pl-10 pr-4 bg-slate-50 border border-slate-200 focus:border-brand-blue focus:bg-white rounded-xl text-sm text-slate-900 outline-none transition-all font-outfit"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5 font-outfit uppercase tracking-wider">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Lock className="w-4 h-4" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              required
              disabled={isLoading}
              className="w-full h-11 pl-10 pr-11 bg-slate-50 border border-slate-200 focus:border-brand-blue focus:bg-white rounded-xl text-sm text-slate-900 outline-none transition-all font-outfit"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full h-12 inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm rounded-xl shadow-lg transition-all disabled:opacity-75 cursor-pointer mt-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>যাচাই করা হচ্ছে...</span>
            </>
          ) : (
            <>
              <span>ড্যাশবোর্ডে প্রবেশ করুন</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Security Footnote */}
      <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[11px] text-slate-400 font-outfit">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
        <span>Server-Side Encrypted Session (24h Expiry)</span>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
      {/* Background Ambient Glow */}
      <div className="absolute w-[500px] h-[500px] bg-brand-purple/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute w-[400px] h-[400px] bg-brand-blue/10 rounded-full blur-3xl pointer-events-none" />

      <Suspense fallback={<div className="w-full max-w-md h-96 bg-white/10 rounded-[32px] animate-pulse" />}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
