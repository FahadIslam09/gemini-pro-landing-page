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
  const [isUpdating, setIsUpdating] = useState(false);
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
            <span>Payment & Activation Queue</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight font-outfit">
            Orders & Transactions ({totalCount})
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-bangla">
            bKash গেটওয়ে ও ম্যানুয়াল পেমেন্টের ট্রানজেকশন ভেরিফাই এবং সাবস্ক্রিপশন অ্যাক্টিভ করুন।
          </p>
        </div>

        <button
          type="button"
          onClick={fetchOrders}
          disabled={loading}
          className="inline-flex items-center gap-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold px-4 py-2.5 rounded-xl border border-slate-200 transition-colors cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>রিফ্রেশ</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col lg:flex-row items-center justify-between gap-3 shadow-xs font-bangla">
        <div className="relative w-full lg:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setPage(1);
                fetchOrders();
              }
            }}
            placeholder="অর্ডার #, TrxID, ইমেইল বা ফোন..."
            className="w-full h-10 pl-10 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-brand-blue"
          />
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-2 w-full lg:w-auto overflow-x-auto pb-1 lg:pb-0">
          {[
            { id: "all", label: "সকল অর্ডার" },
            { id: "pending_activation", label: "পেন্ডিং অ্যাক্টিভেশন" },
            { id: "active", label: "অ্যাক্টিভ" },
            { id: "cancelled", label: "বাতিল" },
          ].map((st) => (
            <button
              key={st.id}
              type="button"
              onClick={() => {
                setOrderStatus(st.id);
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                orderStatus === st.id
                  ? "bg-slate-900 text-white"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100"
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-bangla">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-outfit uppercase">
                <th className="py-3 px-5 font-bold">Order ID</th>
                <th className="py-3 px-5 font-bold">Customer & Target Gmail</th>
                <th className="py-3 px-5 font-bold">Plan & Amount</th>
                <th className="py-3 px-5 font-bold">Method / TrxID</th>
                <th className="py-3 px-5 font-bold text-center">Payment</th>
                <th className="py-3 px-5 font-bold text-center">Status</th>
                <th className="py-3 px-5 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    লোড হচ্ছে...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    কোনো অর্ডার রেকর্ড পাওয়া যায়নি
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/80 transition-colors">
                    
                    {/* Order ID */}
                    <td className="py-4 px-5 font-mono font-bold text-slate-900">
                      {order.orderNumber}
                      <span className="block text-[10px] text-slate-400 font-normal">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                    </td>

                    {/* Customer Info */}
                    <td className="py-4 px-5">
                      <strong className="text-slate-900 block text-xs">
                        {order.customerName}
                      </strong>
                      <span className="text-[11px] text-slate-500 font-mono block">
                        {order.targetEmail}
                      </span>
                      {order.customerPhone && (
                        <span className="text-[10px] text-slate-400 font-mono">
                          {order.customerPhone}
                        </span>
                      )}
                    </td>

                    {/* Plan & Amount */}
                    <td className="py-4 px-5">
                      <span className="font-semibold text-slate-900 block">
                        {order.planKey.toUpperCase()}
                      </span>
                      <span className="font-outfit font-extrabold text-brand-blue text-sm">
                        ৳{order.amount}
                      </span>
                    </td>

                    {/* Payment Method & TrxID */}
                    <td className="py-4 px-5">
                      <div className="space-y-1">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold font-outfit uppercase ${
                            order.paymentMethod.includes("bkash")
                              ? "bg-pink-50 text-[#D12053] border border-pink-200"
                              : order.paymentMethod.includes("nagad")
                              ? "bg-amber-50 text-amber-700 border border-amber-200"
                              : "bg-purple-50 text-purple-700 border border-purple-200"
                          }`}
                        >
                          {order.paymentMethod.replace("_", " ")}
                        </span>

                        {order.trxId ? (
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-[11px] font-bold text-slate-800 bg-slate-100 px-1.5 py-0.5 rounded">
                              {order.trxId}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleCopyTrx(order.trxId, order.id)}
                              className="text-slate-400 hover:text-slate-700"
                              title="Copy TrxID"
                            >
                              {copiedId === order.id ? (
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        ) : (
                          <span className="text-[10px] text-slate-400 italic block">No TrxID</span>
                        )}
                      </div>
                    </td>

                    {/* Payment Status */}
                    <td className="py-4 px-5 text-center">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold font-outfit uppercase ${
                          order.paymentStatus === "paid"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : order.paymentStatus === "failed"
                            ? "bg-rose-50 text-rose-700 border border-rose-200"
                            : "bg-amber-50 text-amber-700 border border-amber-200"
                        }`}
                      >
                        {order.paymentStatus}
                      </span>
                    </td>

                    {/* Order / Activation Status */}
                    <td className="py-4 px-5 text-center">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold font-outfit ${
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

                    {/* Actions */}
                    <td className="py-4 px-5 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedOrder({ ...order })}
                        className="inline-flex items-center gap-1 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>বিস্তারিত</span>
                      </button>
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
            Page {page} of {totalPages} ({totalCount} total orders)
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

      {/* Order Detail & Status Update Modal Dialog */}
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
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              {/* Key Summary Box */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2">
                <div className="flex justify-between items-center pb-2 border-b border-slate-200/80">
                  <span className="text-slate-500 font-medium">Customer:</span>
                  <strong className="text-slate-900">{selectedOrder.customerName}</strong>
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

                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-medium">TrxID:</span>
                  <span className="font-mono font-bold text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-200">
                    {selectedOrder.trxId || "N/A"}
                  </span>
                </div>
              </div>

              {/* Status Update Quick Actions */}
              <div>
                <label className="block font-bold text-slate-700 mb-2">
                  অ্যাক্টিভেশন স্ট্যাটাস পরিবর্তন করুন:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handleUpdateOrderStatus("active")}
                    disabled={isUpdating}
                    className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>অ্যাক্টিভ করুন</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleUpdateOrderStatus("pending_activation")}
                    disabled={isUpdating}
                    className="py-2.5 px-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                  >
                    <Clock className="w-4 h-4" />
                    <span>পেন্ডিং</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleUpdateOrderStatus("cancelled")}
                    disabled={isUpdating}
                    className="py-2.5 px-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>বাতিল</span>
                  </button>
                </div>
              </div>

              {/* Direct Communication Buttons */}
              <div className="flex gap-2 pt-2">
                {selectedOrder.customerPhone && (
                  <a
                    href={`https://wa.me/88${selectedOrder.customerPhone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                      `হ্যালো ${selectedOrder.customerName}, আপনার Google AI Pro অর্ডার ${selectedOrder.orderNumber} সফলভাবে গ্রহণ করা হয়েছে।`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-1.5 bg-[#25D366] hover:bg-[#20bd5a] text-white py-2.5 px-3 rounded-xl font-bold font-outfit shadow-xs"
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
                  <span>ইমেইল পাঠান</span>
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
