"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  DollarSign,
  ShoppingBag,
  Users,
  Clock,
  CheckCircle2,
  TrendingUp,
  Tag,
  ArrowRight,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Plus,
  Trash2,
  AlertCircle,
  Check,
  CreditCard,
  Sparkles,
} from "lucide-react";

export default function AdminOverviewPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isResetting, setIsResetting] = useState(false);
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchStats = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const res = await fetch("/api/admin/stats");
      const json = await res.json();
      if (json.success) {
        setData(json);
      }
    } catch (e) {
      console.error(e);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    // Live Auto-Refresh every 10 seconds for real-time order monitoring
    const interval = setInterval(() => {
      fetchStats(true);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleResetDemoData = async () => {
    setIsResetting(true);
    try {
      const res = await fetch("/api/admin/reset-demo", { method: "POST" });
      const json = await res.json();
      if (json.success) {
        showToast(json.message);
        setResetModalOpen(false);
        fetchStats();
      } else {
        showToast(json.message || "রিসেট ব্যর্থ", "error");
      }
    } catch {
      showToast("সার্ভার ত্রুটি", "error");
    } finally {
      setIsResetting(false);
    }
  };

  const stats = data?.stats || {
    totalRevenue: 0,
    totalOrders: 0,
    activeSubscriptions: 0,
    pendingActivations: 0,
    totalBuyers: 0,
  };

  const recentOrders = data?.recentOrders || [];
  const recentBuyers = data?.recentBuyers || [];
  const planDistribution = data?.planDistribution || { "1m": 0, "12m": 0, "18m": 0 };
  const paymentMethods = data?.paymentMethodDistribution || {};

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

      {/* Top Banner / Welcome Action */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full text-xs font-bold font-outfit mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Live MongoDB Atlas Data Sync</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight font-outfit">
            Google AI Pro Overview
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-bangla">
            রিয়েল-টাইম বিক্রয়, সাবস্ক্রিপশন ও গ্রাহক ডাটাবেজ সরাসরি পর্যবেক্ষণ করুন।
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={() => fetchStats()}
            disabled={loading}
            className="inline-flex items-center gap-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold px-4 py-2.5 rounded-xl border border-slate-200 transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>রিফ্রেশ</span>
          </button>

          <button
            type="button"
            onClick={() => setResetModalOpen(true)}
            className="inline-flex items-center gap-2 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold px-4 py-2.5 rounded-xl border border-rose-200 transition-colors cursor-pointer"
            title="Clear all demo orders and buyers"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>ক্লিন ডাটাবেজ</span>
          </button>

          <Link
            href="/admin/pricing"
            className="inline-flex items-center gap-2 bg-brand-blue hover:bg-brand-blue/90 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xs transition-colors"
          >
            <Tag className="w-3.5 h-3.5" />
            <span>মূল্য পরিবর্তন</span>
          </Link>
        </div>
      </div>

      {/* 5 Core Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* Total Revenue */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 font-outfit uppercase">Total Revenue</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="font-outfit text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            ৳{stats.totalRevenue.toLocaleString()}
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">
            সম্পূর্ণ পরিশোধিত বিক্রয়
          </span>
        </div>

        {/* Total Orders */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 font-outfit uppercase">Total Orders</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-brand-blue flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="font-outfit text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {stats.totalOrders}
          </div>
          <span className="text-[11px] text-slate-500 font-medium mt-1 block">
            ডাটাবেজে মোট অর্ডার
          </span>
        </div>

        {/* Active Subscriptions */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 font-outfit uppercase">Active Plans</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-brand-purple flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="font-outfit text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {stats.activeSubscriptions}
          </div>
          <span className="text-[11px] text-purple-600 font-semibold mt-1 block">
            বর্তমানে সক্রিয় গ্রাহক
          </span>
        </div>

        {/* Pending Activations */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 font-outfit uppercase">Pending Activations</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="font-outfit text-2xl sm:text-3xl font-extrabold text-amber-600 tracking-tight">
            {stats.pendingActivations}
          </div>
          <span className="text-[11px] text-amber-600 font-semibold mt-1 block">
            অ্যাক্টিভেশন প্রয়োজন
          </span>
        </div>

        {/* Total Buyers */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 font-outfit uppercase">Total Buyers</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="font-outfit text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {stats.totalBuyers}
          </div>
          <span className="text-[11px] text-indigo-600 font-semibold mt-1 block">
            ইউনিক কাস্টমার সংখ্যা
          </span>
        </div>
      </div>

      {/* Plan Sales Breakdown Bar */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-slate-900 font-outfit uppercase tracking-wider">
            Plan Sales Distribution
          </h3>
          <span className="text-xs text-slate-400 font-mono">Live DB Analytics</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-600 block">১৮ মাসের মেগা প্ল্যান</span>
              <span className="text-[11px] text-slate-500">প্রাইভেট অ্যাকাউন্ট</span>
            </div>
            <span className="text-xl font-bold font-outfit text-brand-purple">
              {planDistribution["18m"] || 0} টি
            </span>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-600 block">১২ মাসের প্ল্যান</span>
              <span className="text-[11px] text-slate-500">বার্ষিক প্যাকেজ</span>
            </div>
            <span className="text-xl font-bold font-outfit text-amber-600">
              {planDistribution["12m"] || 0} টি
            </span>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-600 block">১ মাসের প্ল্যান</span>
              <span className="text-[11px] text-slate-500">ফ্যামিলি ইনভাইট</span>
            </div>
            <span className="text-xl font-bold font-outfit text-brand-blue">
              {planDistribution["1m"] || 0} টি
            </span>
          </div>
        </div>
      </div>

      {/* 2 Column Grid: Recent Orders & Recent Buyers */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Recent Orders (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 shadow-xs flex flex-col justify-between font-bangla">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 font-outfit">
                Recent Orders ({recentOrders.length})
              </h3>
              <Link
                href="/admin/orders"
                className="text-xs font-semibold text-brand-blue hover:underline font-outfit inline-flex items-center gap-1"
              >
                <span>View all</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-outfit uppercase">
                    <th className="pb-2.5 font-semibold">Order</th>
                    <th className="pb-2.5 font-semibold">Customer</th>
                    <th className="pb-2.5 font-semibold">Plan</th>
                    <th className="pb-2.5 font-semibold">Amount</th>
                    <th className="pb-2.5 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentOrders.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-400">
                        এখনো কোনো নতুন অর্ডার আসেনি
                      </td>
                    </tr>
                  ) : (
                    recentOrders.map((order: any) => (
                      <tr key={order.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 font-mono font-semibold text-slate-900">
                          {order.orderNumber}
                        </td>
                        <td className="py-3">
                          <span className="font-semibold text-slate-900 block truncate max-w-[130px]">
                            {order.customerName}
                          </span>
                          <span className="text-[10px] text-slate-400 block truncate max-w-[130px] font-mono">
                            {order.targetEmail}
                          </span>
                        </td>
                        <td className="py-3 font-medium text-slate-700">
                          {order.planKey.toUpperCase()}
                        </td>
                        <td className="py-3 font-outfit font-bold text-slate-900">
                          ৳{order.amount}
                        </td>
                        <td className="py-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-outfit ${
                              order.orderStatus === "active"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : order.orderStatus === "pending_activation"
                                ? "bg-amber-50 text-amber-700 border border-amber-200 animate-pulse"
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {order.orderStatus.replace("_", " ")}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 mt-4 text-center">
            <Link
              href="/admin/orders"
              className="text-xs text-brand-blue hover:text-brand-dark font-semibold font-outfit"
            >
              Manage all transactions & activation queue →
            </Link>
          </div>
        </div>

        {/* Recent Buyers (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-6 shadow-xs flex flex-col justify-between font-bangla">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 font-outfit">
                Recent Buyers ({recentBuyers.length})
              </h3>
              <Link
                href="/admin/buyers"
                className="text-xs font-semibold text-brand-blue hover:underline font-outfit inline-flex items-center gap-1"
              >
                <span>View all</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3">
              {recentBuyers.length === 0 ? (
                <p className="py-8 text-center text-xs text-slate-400">
                  কোনো গ্রাহক রেকর্ড পাওয়া যায়নি
                </p>
              ) : (
                recentBuyers.map((buyer: any) => (
                  <div
                    key={buyer.id}
                    className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-colors"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="w-9 h-9 rounded-xl bg-brand-blue/10 text-brand-blue flex items-center justify-center font-bold text-xs font-outfit shrink-0">
                        {buyer.name.charAt(0)}
                      </div>
                      <div className="truncate">
                        <span className="text-xs font-bold text-slate-900 block truncate">
                          {buyer.name}
                        </span>
                        <span className="text-[10px] text-slate-500 block truncate font-mono">
                          {buyer.email}
                        </span>
                      </div>
                    </div>

                    <div className="text-right shrink-0 font-outfit">
                      <span className="text-xs font-extrabold text-slate-900 block">
                        ৳{buyer.totalSpent}
                      </span>
                      <span className="text-[10px] text-emerald-600 font-semibold block capitalize">
                        {buyer.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 mt-4 text-center">
            <Link
              href="/admin/buyers"
              className="text-xs text-brand-blue hover:text-brand-dark font-semibold font-outfit"
            >
              Open complete customer directory →
            </Link>
          </div>
        </div>
      </div>

      {/* Clean Demo Data Modal Dialog */}
      {resetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in font-bangla">
          <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl p-6 text-center animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-slate-900 mb-1">
              ডাটাবেজ ক্লিন করতে চান?
            </h4>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              এটি সব ডেমো/টেস্ট অর্ডার এবং গ্রাহক ডাটা মুছে দিয়ে রেভিনিউ ৳০ এবং অর্ডার কাউন্ট ০ করবে। অ্যাডমিন লগিন বা প্ল্যানের কোনো ক্ষতি হবে না।
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setResetModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                বাতিল
              </button>
              <button
                type="button"
                onClick={handleResetDemoData}
                disabled={isResetting}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs"
              >
                {isResetting ? "ক্লিন হচ্ছে..." : "হ্যাঁ, ক্লিন করুন"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
