"use client";

import React, { useState, useEffect } from "react";
import {
  CreditCard,
  Search,
  RefreshCw,
  Copy,
  Check,
  Eye,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  X,
  Save,
  MessageSquare,
  Mail,
  ShieldCheck,
  Plus,
  Download,
  Trash2,
  Send,
  ExternalLink,
  Sparkles,
} from "lucide-react";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [orderStatus, setOrderStatus] = useState("all");
  const [paymentMethod, setPaymentMethod] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [activationLinkInput, setActivationLinkInput] = useState("");
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newOrder, setNewOrder] = useState({
    customerName: "",
    targetEmail: "",
    customerPhone: "",
    planKey: "18m",
    amount: 499,
    paymentMethod: "bkash_manual",
    trxId: "",
    orderStatus: "processing",
    notes: "",
  });

  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const url = new URL("/api/admin/orders", window.location.origin);
      url.searchParams.set("page", String(page));
      url.searchParams.set("limit", "15");
      if (search.trim()) url.searchParams.set("search", search.trim());
      if (orderStatus && orderStatus !== "all") url.searchParams.set("orderStatus", orderStatus);
      if (paymentMethod && paymentMethod !== "all") url.searchParams.set("paymentMethod", paymentMethod);

      const res = await fetch(url.toString());
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders);
        setTotalPages(data.pagination.totalPages || 1);
        setTotalCount(data.pagination.total || 0);
      }
    } catch {
      showToast("অর্ডার লোড করতে ব্যর্থ", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page, orderStatus, paymentMethod]);

  const handleCopyTrx = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showToast("ট্রানজেকশন আইডি কপি হয়েছে!");
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleOpenOrderDetails = (order: any) => {
    setSelectedOrder(order);
    setActivationLinkInput(order.activationLink || order.metadata?.activationLink || "");
  };

  // Complete Order & Send Activation Link
  const handleCompleteOrder = async () => {
    if (!selectedOrder) return;
    if (!activationLinkInput.trim()) {
      showToast("অনুগ্রহ করে অ্যাক্টিভেশন লিংক লিখুন বা পেস্ট করুন", "error");
      return;
    }

    setIsUpdating(true);
    try {
      const res = await fetch(`/api/admin/orders/${selectedOrder.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "complete",
          activationLink: activationLinkInput.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast("অর্ডার সফলভাবে সম্পন্ন হয়েছে এবং গ্রাহককে অ্যাক্টিভেশন লিংক পাঠানো হয়েছে!");
        setSelectedOrder(null);
        setActivationLinkInput("");
        fetchOrders();
      } else {
        showToast(data.message || "অর্ডার সম্পন্ন করতে সমস্যা হয়েছে", "error");
      }
    } catch {
      showToast("সার্ভার ত্রুটি। পুনরায় চেষ্টা করুন।", "error");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdateOrderStatus = async (newStatus: string) => {
    if (!selectedOrder) return;
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/admin/orders/${selectedOrder.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderStatus: newStatus,
          notes: selectedOrder.notes,
          trxId: selectedOrder.trxId,
          paymentStatus: newStatus === "completed" || newStatus === "active" ? "paid" : selectedOrder.paymentStatus,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast(data.message || "অর্ডার আপডেট হয়েছে!");
        setSelectedOrder(null);
        fetchOrders();
      } else {
        showToast(data.message || "আপডেট ব্যর্থ", "error");
      }
    } catch {
      showToast("সার্ভার ত্রুটি", "error");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCreateManualOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    try {
      const res = await fetch("/api/admin/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newOrder),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast("নতুন অর্ডার সফলভাবে তৈরি হয়েছে!");
        setCreateModalOpen(false);
        setNewOrder({
          customerName: "",
          targetEmail: "",
          customerPhone: "",
          planKey: "18m",
          amount: 499,
          paymentMethod: "bkash_manual",
          trxId: "",
          orderStatus: "processing",
          notes: "",
        });
        fetchOrders();
      } else {
        showToast(data.message || "অর্ডার তৈরি ব্যর্থ", "error");
      }
    } catch {
      showToast("সার্ভার ত্রুটি", "error");
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteOrder = async () => {
    if (!deletingId) return;
    try {
      const res = await fetch(`/api/admin/orders/${deletingId}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        showToast("অর্ডারটি মুছে ফেলা হয়েছে");
        setDeletingId(null);
        fetchOrders();
      }
    } catch {
      showToast("মুছে ফেলতে ব্যর্থ", "error");
    }
  };

  const exportToCSV = () => {
    if (orders.length === 0) {
      showToast("এক্সপোর্ট করার মতো কোনো ডাটা নেই", "error");
      return;
    }
    const headers = ["OrderNumber,CustomerName,TargetEmail,Phone,Plan,Amount,PaymentMethod,TrxID,PaymentStatus,OrderStatus,CreatedAt"];
    const rows = orders.map((o) =>
      [
        `"${o.orderNumber}"`,
        `"${o.customerName}"`,
        `"${o.targetEmail}"`,
        `"${o.customerPhone || ""}"`,
        `"${o.planKey}"`,
        `"${o.amount}"`,
        `"${o.paymentMethod}"`,
        `"${o.trxId || ""}"`,
        `"${o.paymentStatus}"`,
        `"${o.orderStatus}"`,
        `"${new Date(o.createdAt).toISOString()}"`,
      ].join(",")
    );

    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `google_ai_pro_orders_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("CSV ফাইল ডাউনলোড হয়েছে!");
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-semibold animate-in slide-in-from-bottom-5 font-bangla ${
            toast.type === "success"
              ? "bg-slate-900 text-emerald-400 border border-slate-700"
              : "bg-rose-900 text-rose-200 border border-rose-700"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-400" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header & Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 font-outfit">Orders Management</h1>
          <p className="text-xs text-slate-500 font-bangla mt-0.5">
            মোট অর্ডার: <strong>{totalCount}</strong> টি
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={exportToCSV}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-xl border border-slate-200 shadow-2xs transition-colors cursor-pointer font-bangla"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>CSV এক্সপোর্ট</span>
          </button>

          <button
            type="button"
            onClick={() => setCreateModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-brand-blue hover:bg-brand-blue/90 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors cursor-pointer font-bangla"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>ম্যানুয়াল অর্ডার</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3 font-bangla">
        {/* Status Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {[
            { id: "all", label: "সকল অর্ডার" },
            { id: "processing", label: "Processing (প্রসেসিং)" },
            { id: "completed", label: "Completed (সম্পন্ন)" },
            { id: "pending_activation", label: "Pending Activation" },
            { id: "cancelled", label: "Cancelled (বাতিল)" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setOrderStatus(tab.id);
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-colors cursor-pointer ${
                orderStatus === tab.id
                  ? "bg-brand-blue text-white shadow-2xs font-bold"
                  : "bg-slate-100/80 text-slate-600 hover:bg-slate-200/70"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search input + Method Filter */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && fetchOrders()}
              placeholder="অর্ডার নং, জিমেইল, নাম বা TrxID দিয়ে সার্চ করুন..."
              className="w-full h-9 pl-9 pr-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-none focus:border-brand-blue focus:bg-white transition-all font-outfit"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={paymentMethod}
              onChange={(e) => {
                setPaymentMethod(e.target.value);
                setPage(1);
              }}
              className="h-9 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 outline-none focus:border-brand-blue cursor-pointer"
            >
              <option value="all">সকল পেমেন্ট মেথড</option>
              <option value="bkash_manual">bKash Manual</option>
              <option value="bangla_qr_manual">Bangla QR</option>
              <option value="bkash_gateway">bKash Auto</option>
            </select>

            <button
              type="button"
              onClick={fetchOrders}
              className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-colors cursor-pointer"
              title="Refresh"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-outfit">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 uppercase tracking-wider text-[10px] font-bold">
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Target Gmail</th>
                <th className="py-3 px-4">Plan & Price</th>
                <th className="py-3 px-4">TrxID</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400 font-bangla">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-brand-blue" />
                    অর্ডার তালিকা লোড হচ্ছে...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400 font-bangla">
                    কোনো অর্ডার পাওয়া যায়নি
                  </td>
                </tr>
              ) : (
                orders.map((o) => {
                  const isProcessing = o.orderStatus === "processing";
                  const isCompleted = o.orderStatus === "completed" || o.orderStatus === "active";
                  const isCancelled = o.orderStatus === "cancelled";

                  return (
                    <tr key={o.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">
                        {o.orderNumber}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-slate-900 block font-bangla">
                          {o.customerName || "Customer"}
                        </span>
                        {o.customerPhone && (
                          <span className="text-[10px] text-slate-400 block font-mono">
                            {o.customerPhone}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 font-mono font-medium text-brand-blue">
                        {o.targetEmail}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-slate-800 block">৳{o.amount} BDT</span>
                        <span className="text-[10px] text-slate-500 font-bangla">{o.planName}</span>
                      </td>
                      <td className="py-3 px-4">
                        {o.trxId ? (
                          <div className="inline-flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-lg border border-slate-200/60 font-mono text-[11px] font-bold text-slate-800">
                            <span>{o.trxId}</span>
                            <button
                              type="button"
                              onClick={() => handleCopyTrx(o.trxId, o.id)}
                              className="text-slate-400 hover:text-slate-700 cursor-pointer ml-0.5"
                              title="Copy TrxID"
                            >
                              {copiedId === o.id ? (
                                <Check className="w-3 h-3 text-emerald-600" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                          </div>
                        ) : (
                          <span className="text-slate-400 text-[10px]">N/A</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {isProcessing ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                            <Clock className="w-3 h-3" />
                            <span>Processing</span>
                          </span>
                        ) : isCompleted ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Completed</span>
                          </span>
                        ) : isCancelled ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                            <XCircle className="w-3 h-3" />
                            <span>Cancelled</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                            <span>{o.orderStatus}</span>
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-slate-500 text-[11px]">
                        {new Date(o.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleOpenOrderDetails(o)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-brand-blue/10 hover:bg-brand-blue/20 text-brand-blue font-semibold rounded-lg text-xs transition-colors cursor-pointer"
                          >
                            <Eye className="w-3 h-3" />
                            <span>ভিউ / কমপ্লিট</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setDeletingId(o.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-outfit">
          <span>
            Page {page} of {totalPages}
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => setPage(page + 1)}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Manual Order Creation Modal Dialog */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 font-bangla">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 font-outfit">
                Create Manual Order
              </h3>
              <button
                type="button"
                onClick={() => setCreateModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateManualOrder} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    গ্রাহকের নাম <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newOrder.customerName}
                    onChange={(e) => setNewOrder({ ...newOrder, customerName: e.target.value })}
                    required
                    className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-none focus:border-brand-blue"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    টার্গেট জিমেইল <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={newOrder.targetEmail}
                    onChange={(e) => setNewOrder({ ...newOrder, targetEmail: e.target.value })}
                    required
                    className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 outline-none focus:border-brand-blue"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    ফোন নম্বর
                  </label>
                  <input
                    type="tel"
                    value={newOrder.customerPhone}
                    onChange={(e) => setNewOrder({ ...newOrder, customerPhone: e.target.value })}
                    className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 outline-none focus:border-brand-blue"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    প্ল্যান নির্বাচন করুন
                  </label>
                  <select
                    value={newOrder.planKey}
                    onChange={(e) => {
                      const pk = e.target.value;
                      setNewOrder({
                        ...newOrder,
                        planKey: pk,
                        amount: pk === "18m" ? 499 : pk === "12m" ? 399 : 149,
                      });
                    }}
                    className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-none focus:border-brand-blue"
                  >
                    <option value="18m">১৮ মাস - মেগা অফার (৳499)</option>
                    <option value="12m">১২ মাস - বার্ষিক প্ল্যান (৳399)</option>
                    <option value="1m">১ মাস - ট্রায়াল প্যাক (৳149)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    পেমেন্ট মেথড
                  </label>
                  <select
                    value={newOrder.paymentMethod}
                    onChange={(e) => setNewOrder({ ...newOrder, paymentMethod: e.target.value })}
                    className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-none focus:border-brand-blue"
                  >
                    <option value="bkash_manual">bKash (Send Money / Payment)</option>
                    <option value="bangla_qr_manual">Bangla QR</option>
                    <option value="bkash_gateway">bKash (Gateway)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    ট্রানজেকশন আইডি (TrxID)
                  </label>
                  <input
                    type="text"
                    value={newOrder.trxId}
                    onChange={(e) => setNewOrder({ ...newOrder, trxId: e.target.value })}
                    placeholder="ঐচ্ছিক"
                    className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 outline-none focus:border-brand-blue"
                  />
                </div>
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
                  disabled={isCreating}
                  className="inline-flex items-center gap-2 bg-brand-blue hover:bg-brand-blue/90 text-white font-semibold px-6 py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{isCreating ? "সংরক্ষণ হচ্ছে..." : "অর্ডার তৈরি করুন"}</span>
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
              অর্ডার মুছে ফেলতে চান?
            </h4>
            <p className="text-xs text-slate-500 mb-6">
              এই অর্ডারটি ডাটাবেজ থেকে স্থায়ীভাবে মুছে যাবে।
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setDeletingId(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                বাতিল
              </button>
              <button
                type="button"
                onClick={handleDeleteOrder}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs cursor-pointer"
              >
                মুছে ফেলুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Order Detail & Activation Modal Dialog */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 font-bangla">
            
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900 font-outfit">
                  Order Details: {selectedOrder.orderNumber}
                </h3>
                <span className="text-[11px] text-slate-400 font-mono">
                  {new Date(selectedOrder.createdAt).toLocaleString()}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              {/* Key Summary Box */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2">
                <div className="flex justify-between items-center pb-2 border-b border-slate-200/80">
                  <span className="text-slate-500 font-medium">Customer:</span>
                  <strong className="text-slate-900">{selectedOrder.customerName || "N/A"}</strong>
                </div>

                <div className="flex justify-between items-center pb-2 border-b border-slate-200/80">
                  <span className="text-slate-500 font-medium">Target Gmail:</span>
                  <span className="font-mono font-bold text-brand-blue">{selectedOrder.targetEmail}</span>
                </div>

                <div className="flex justify-between items-center pb-2 border-b border-slate-200/80">
                  <span className="text-slate-500 font-medium">Plan & Price:</span>
                  <span className="font-outfit font-extrabold text-slate-900">
                    {selectedOrder.planName} (৳{selectedOrder.amount})
                  </span>
                </div>

                <div className="flex justify-between items-center pb-2 border-b border-slate-200/80">
                  <span className="text-slate-500 font-medium">TrxID:</span>
                  <span className="font-mono font-bold text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-200">
                    {selectedOrder.trxId || "N/A"}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-medium">Current Status:</span>
                  <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                    selectedOrder.orderStatus === "completed" || selectedOrder.orderStatus === "active"
                      ? "bg-emerald-100 text-emerald-800"
                      : selectedOrder.orderStatus === "processing"
                      ? "bg-amber-100 text-amber-800"
                      : "bg-slate-100 text-slate-700"
                  }`}>
                    {selectedOrder.orderStatus.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Activation Link Input & Complete Order Workflow */}
              <div className="bg-gradient-to-br from-indigo-50/50 via-slate-50 to-emerald-50/50 p-4 rounded-2xl border border-brand-blue/20 space-y-3">
                <div className="flex items-center gap-1.5 text-slate-900 font-bold text-xs">
                  <Sparkles className="w-4 h-4 text-brand-blue" />
                  <span>গ্রাহকের অ্যাক্টিভেশন লিংক (Activation Link):</span>
                </div>

                <div>
                  <input
                    type="url"
                    value={activationLinkInput}
                    onChange={(e) => setActivationLinkInput(e.target.value)}
                    placeholder="https://families.google.com/join/... বা গুগল ইনভাইটেশন লিংক"
                    className="w-full h-10 px-3 bg-white border border-slate-300 focus:border-brand-blue focus:ring-1 focus:ring-brand-blue/30 rounded-xl text-xs font-mono text-slate-900 outline-none transition-all shadow-2xs"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">
                    এই লিংকে ক্লিক করে গ্রাহক সরাসরি সাবস্ক্রিপশন চালু করতে পারবেন।
                  </p>
                </div>

                {/* Complete Order Button */}
                <button
                  type="button"
                  onClick={handleCompleteOrder}
                  disabled={isUpdating}
                  className="w-full h-10 inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs transition-all disabled:opacity-50 cursor-pointer text-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>
                    {isUpdating ? "ইমেইল পাঠানো ও সম্পন্ন হচ্ছে..." : "Complete Order (অ্যাক্টিভেশন লিংক ইমেইল করুন)"}
                  </span>
                </button>
              </div>

              {/* Status Update Quick Actions */}
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">
                  অন্যান্য স্ট্যাটাস পরিবর্তন:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleUpdateOrderStatus("processing")}
                    disabled={isUpdating}
                    className="py-2 px-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>Processing রাখুন</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleUpdateOrderStatus("cancelled")}
                    disabled={isUpdating}
                    className="py-2 px-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>বাতিল (Cancel)</span>
                  </button>
                </div>
              </div>

              {/* Direct Communication Buttons */}
              <div className="flex gap-2 pt-1">
                {selectedOrder.customerPhone && (
                  <a
                    href={`https://wa.me/88${selectedOrder.customerPhone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                      `হ্যালো ${selectedOrder.customerName}, আপনার Google AI Pro অর্ডার (${selectedOrder.orderNumber}) অ্যাক্টিভেশন সম্পন্ন হয়েছে। আপনার ইমেইল চেক করুন।`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-1.5 bg-[#25D366] hover:bg-[#20bd5a] text-white py-2.5 px-3 rounded-xl font-bold font-outfit shadow-2xs"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>WhatsApp মেসেজ</span>
                  </a>
                )}
                <a
                  href={`mailto:${selectedOrder.targetEmail}?subject=${encodeURIComponent(
                    `Google AI Pro Subscription Activation - ${selectedOrder.orderNumber}`
                  )}`}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white py-2.5 px-3 rounded-xl font-semibold font-outfit"
                >
                  <Mail className="w-4 h-4" />
                  <span>ম্যানুয়াল ইমেইল</span>
                </a>
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 text-right">
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl cursor-pointer"
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
