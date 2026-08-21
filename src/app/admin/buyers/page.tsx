"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  Search,
  RefreshCw,
  Mail,
  Phone,
  Calendar,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  Eye,
  X,
  MessageSquare,
  AlertCircle,
  Check,
  ShoppingBag,
  Plus,
  Download,
  Trash2,
  Save,
} from "lucide-react";

export default function AdminBuyersPage() {
  const [buyers, setBuyers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const [selectedBuyer, setSelectedBuyer] = useState<any | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newBuyer, setNewBuyer] = useState({
    name: "",
    email: "",
    phone: "",
    currentPlan: "Google AI Pro (১৮ মাস)",
    status: "active",
    notes: "",
  });

  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchBuyers = async () => {
    setLoading(true);
    try {
      const url = new URL("/api/admin/buyers", window.location.origin);
      url.searchParams.set("page", String(page));
      url.searchParams.set("limit", "12");
      if (search.trim()) url.searchParams.set("search", search.trim());
      if (status && status !== "all") url.searchParams.set("status", status);

      const res = await fetch(url.toString());
      const data = await res.json();
      if (data.success) {
        setBuyers(data.buyers);
        setTotalPages(data.pagination.totalPages || 1);
        setTotalCount(data.pagination.total || 0);
      }
    } catch {
      showToast("গ্রাহক তালিকা লোড করতে ব্যর্থ", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBuyers();
  }, [page, status]);

  const openBuyerDrawer = async (buyerId: string) => {
    setLoadingDetails(true);
    try {
      const res = await fetch(`/api/admin/buyers/${buyerId}`);
      const data = await res.json();
      if (data.success) {
        setSelectedBuyer(data.buyer);
      }
    } catch {
      showToast("বিস্তারিত তথ্য লোড করা যায়নি", "error");
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleCreateBuyer = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/buyers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newBuyer),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast("নতুন গ্রাহক সফলভাবে তৈরি হয়েছে!");
        setCreateModalOpen(false);
        setNewBuyer({
          name: "",
          email: "",
          phone: "",
          currentPlan: "Google AI Pro (১৮ মাস)",
          status: "active",
          notes: "",
        });
        fetchBuyers();
      } else {
        showToast(data.message || "গ্রাহক তৈরি ব্যর্থ", "error");
      }
    } catch {
      showToast("সার্ভার ত্রুটি", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateBuyerStatus = async (newStatus: string) => {
    if (!selectedBuyer) return;
    try {
      const res = await fetch(`/api/admin/buyers/${selectedBuyer.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setSelectedBuyer({ ...selectedBuyer, status: newStatus });
        showToast("গ্রাহক স্ট্যাটাস আপডেট হয়েছে");
        fetchBuyers();
      }
    } catch {
      showToast("আপডেট ব্যর্থ", "error");
    }
  };

  const handleDeleteBuyer = async () => {
    if (!deletingId) return;
    try {
      const res = await fetch(`/api/admin/buyers/${deletingId}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        showToast("গ্রাহক মুছে ফেলা হয়েছে");
        setDeletingId(null);
        if (selectedBuyer?.id === deletingId) setSelectedBuyer(null);
        fetchBuyers();
      }
    } catch {
      showToast("মুছে ফেলতে ব্যর্থ", "error");
    }
  };

  const exportToCSV = () => {
    if (buyers.length === 0) {
      showToast("এক্সপোর্ট করার মতো কোনো ডাটা নেই", "error");
      return;
    }
    const headers = ["Name,Email,Phone,CurrentPlan,TotalOrders,TotalSpent,Status,JoinedDate"];
    const rows = buyers.map((b) =>
      [
        `"${b.name}"`,
        `"${b.email}"`,
        `"${b.phone || ""}"`,
        `"${b.currentPlan || ""}"`,
        `"${b.totalOrders}"`,
        `"${b.totalSpent}"`,
        `"${b.status}"`,
        `"${new Date(b.createdAt).toISOString()}"`,
      ].join(",")
    );

    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `google_ai_pro_buyers_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("গ্রাহক তালিকা CSV ডাউনলোড হয়েছে!");
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
            <span>Customer Relationship Directory</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight font-outfit">
            Buyer Management ({totalCount})
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-bangla">
            সকল সাবস্ক্রিপশন গ্রাহকের যোগাযোগ, মোট ব্যয় ও অর্ডার হিস্ট্রি পরিচালনা করুন।
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={exportToCSV}
            className="inline-flex items-center gap-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold px-4 py-2.5 rounded-xl border border-slate-200 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>CSV এক্সপোর্ট</span>
          </button>

          <button
            type="button"
            onClick={() => setCreateModalOpen(true)}
            className="inline-flex items-center gap-2 bg-brand-blue hover:bg-brand-blue/90 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>নতুন গ্রাহক</span>
          </button>

          <button
            type="button"
            onClick={fetchBuyers}
            disabled={loading}
            className="p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl border border-slate-200 transition-colors cursor-pointer"
            title="Refresh"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs font-bangla">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setPage(1);
                fetchBuyers();
              }
            }}
            placeholder="নাম, জিমেইল বা ফোন নম্বর..."
            className="w-full h-10 pl-10 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-brand-blue"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {["all", "active", "inactive", "suspended"].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => {
                setStatus(s);
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-colors cursor-pointer ${
                status === s
                  ? "bg-slate-900 text-white"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100"
              }`}
            >
              {s === "all" ? "সকল গ্রাহক" : s}
            </button>
          ))}
        </div>
      </div>

      {/* Buyers Table */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-bangla">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-outfit uppercase">
                <th className="py-3 px-5 font-bold">Buyer</th>
                <th className="py-3 px-5 font-bold">Contact</th>
                <th className="py-3 px-5 font-bold">Current Plan</th>
                <th className="py-3 px-5 font-bold">Total Spent</th>
                <th className="py-3 px-5 font-bold text-center">Status</th>
                <th className="py-3 px-5 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    লোড হচ্ছে...
                  </td>
                </tr>
              ) : buyers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    কোনো গ্রাহক পাওয়া যায়নি
                  </td>
                </tr>
              ) : (
                buyers.map((buyer) => (
                  <tr key={buyer.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-brand-blue/10 text-brand-blue flex items-center justify-center font-bold text-xs font-outfit shrink-0">
                          {buyer.name.charAt(0)}
                        </div>
                        <div>
                          <strong className="text-sm font-bold text-slate-900 block">
                            {buyer.name}
                          </strong>
                          <span className="text-[10px] text-slate-400 font-mono">
                            Joined {new Date(buyer.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-5">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 text-slate-700 font-mono text-[11px]">
                          <Mail className="w-3 h-3 text-slate-400" />
                          <span>{buyer.email}</span>
                        </div>
                        {buyer.phone && (
                          <div className="flex items-center gap-1.5 text-slate-500 font-mono text-[11px]">
                            <Phone className="w-3 h-3 text-slate-400" />
                            <span>{buyer.phone}</span>
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="py-4 px-5 font-medium text-slate-800">
                      {buyer.currentPlan || "Google AI Pro"}
                    </td>

                    <td className="py-4 px-5 font-outfit font-extrabold text-slate-900 text-sm">
                      ৳{buyer.totalSpent}
                    </td>

                    <td className="py-4 px-5 text-center">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold font-outfit capitalize ${
                          buyer.status === "active"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : buyer.status === "suspended"
                            ? "bg-rose-50 text-rose-700 border border-rose-200"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {buyer.status}
                      </span>
                    </td>

                    <td className="py-4 px-5 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => openBuyerDrawer(buyer.id)}
                          className="inline-flex items-center gap-1 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>প্রোফাইল</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setDeletingId(buyer.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 cursor-pointer"
                          title="Delete Buyer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between font-outfit text-xs text-slate-500">
          <span>
            Page {page} of {totalPages} ({totalCount} total buyers)
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Add New Buyer Modal Dialog */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 font-bangla">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 font-outfit">
                Add New Customer
              </h3>
              <button
                type="button"
                onClick={() => setCreateModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBuyer} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  গ্রাহকের পুরো নাম <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newBuyer.name}
                  onChange={(e) => setNewBuyer({ ...newBuyer, name: e.target.value })}
                  placeholder="যেমন: তানভীর হাসান"
                  required
                  className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-none focus:border-brand-blue"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    ইমেইল এড্রেস <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={newBuyer.email}
                    onChange={(e) => setNewBuyer({ ...newBuyer, email: e.target.value })}
                    placeholder="name@gmail.com"
                    required
                    className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 outline-none focus:border-brand-blue"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    ফোন বা হোয়াটসঅ্যাপ নম্বর
                  </label>
                  <input
                    type="tel"
                    value={newBuyer.phone}
                    onChange={(e) => setNewBuyer({ ...newBuyer, phone: e.target.value })}
                    placeholder="017XXXXXXXX"
                    className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 outline-none focus:border-brand-blue"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    প্ল্যান
                  </label>
                  <input
                    type="text"
                    value={newBuyer.currentPlan}
                    onChange={(e) => setNewBuyer({ ...newBuyer, currentPlan: e.target.value })}
                    className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-none focus:border-brand-blue"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    স্ট্যাটাস
                  </label>
                  <select
                    value={newBuyer.status}
                    onChange={(e) => setNewBuyer({ ...newBuyer, status: e.target.value })}
                    className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-none focus:border-brand-blue"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  নোট (ঐচ্ছিক)
                </label>
                <textarea
                  rows={2}
                  value={newBuyer.notes}
                  onChange={(e) => setNewBuyer({ ...newBuyer, notes: e.target.value })}
                  placeholder="অতিরিক্ত তথ্য..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-none focus:border-brand-blue resize-none"
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
                  <span>{isSaving ? "সংরক্ষণ হচ্ছে..." : "গ্রাহক সংরক্ষণ করুন"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl p-6 text-center animate-in zoom-in-95 font-bangla">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-slate-900 mb-1">
              গ্রাহক মুছে ফেলতে চান?
            </h4>
            <p className="text-xs text-slate-500 mb-6">
              এই গ্রাহকের সমস্ত প্রোফাইল তথ্য ডাটাবেজ থেকে মুছে যাবে।
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
                onClick={handleDeleteBuyer}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs"
              >
                মুছে ফেলুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Customer Detail Drawer Modal */}
      {selectedBuyer && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-white h-screen shadow-2xl flex flex-col justify-between p-6 sm:p-7 overflow-y-auto animate-in slide-in-from-right duration-300 font-bangla">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
                <div>
                  <h3 className="text-base font-bold text-slate-900 font-outfit">
                    Customer Profile
                  </h3>
                  <span className="text-[11px] text-slate-400 font-mono">
                    ID: {selectedBuyer.id}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedBuyer(null)}
                  className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Profile Card */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-2xl bg-brand-gradient text-white flex items-center justify-center font-extrabold text-base font-outfit shadow-sm">
                    {selectedBuyer.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900">
                      {selectedBuyer.name}
                    </h4>
                    <span className="text-xs text-slate-500 font-mono">
                      {selectedBuyer.email}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-200/80 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 font-outfit uppercase font-bold block">
                      Total Orders
                    </span>
                    <span className="font-outfit font-bold text-slate-900 text-sm">
                      {selectedBuyer.totalOrders || selectedBuyer.orders?.length || 0}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-outfit uppercase font-bold block">
                      Lifetime Spend
                    </span>
                    <span className="font-outfit font-bold text-brand-blue text-sm">
                      ৳{selectedBuyer.totalSpent}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status Switcher */}
              <div className="mb-6">
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  গ্রাহক স্ট্যাটাস:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {["active", "inactive", "suspended"].map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => handleUpdateBuyerStatus(st)}
                      className={`py-1.5 px-2 rounded-xl text-xs font-bold capitalize transition-colors ${
                        selectedBuyer.status === st
                          ? "bg-slate-900 text-white"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 mb-6">
                {selectedBuyer.phone && (
                  <a
                    href={`https://wa.me/88${selectedBuyer.phone.replace(/[^0-9]/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-1.5 bg-[#25D366] hover:bg-[#20bd5a] text-white py-2 px-3 rounded-xl text-xs font-bold font-outfit shadow-xs"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>
                )}
                <a
                  href={`mailto:${selectedBuyer.email}`}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white py-2 px-3 rounded-xl text-xs font-semibold font-outfit"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Send Email</span>
                </a>
              </div>

              {/* Orders History List */}
              <div>
                <h4 className="text-xs font-bold text-slate-500 font-outfit uppercase tracking-wider mb-3">
                  Transaction History
                </h4>
                <div className="space-y-2.5">
                  {!selectedBuyer.orders || selectedBuyer.orders.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">কোনো অর্ডার হিস্ট্রি নেই</p>
                  ) : (
                    selectedBuyer.orders.map((ord: any) => (
                      <div
                        key={ord.id}
                        className="p-3 bg-white border border-slate-200 rounded-2xl flex items-center justify-between text-xs"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-slate-900">
                              {ord.orderNumber}
                            </span>
                            <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded font-mono">
                              {ord.planKey.toUpperCase()}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-400 block font-mono mt-0.5">
                            {new Date(ord.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="font-outfit font-extrabold text-slate-900 block">
                            ৳{ord.amount}
                          </span>
                          <span
                            className={`text-[10px] font-bold font-outfit ${
                              ord.orderStatus === "active" ? "text-emerald-600" : "text-amber-600"
                            }`}
                          >
                            {ord.orderStatus}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex gap-2">
              <button
                type="button"
                onClick={() => setDeletingId(selectedBuyer.id)}
                className="py-2.5 px-4 bg-rose-50 text-rose-600 hover:bg-rose-100 font-semibold text-xs rounded-xl"
              >
                ডিলিট
              </button>

              <button
                type="button"
                onClick={() => setSelectedBuyer(null)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
