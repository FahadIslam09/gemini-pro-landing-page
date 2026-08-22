"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  X,
  Copy,
  Check,
  Lock,
  Sparkles,
  Loader2,
  CheckCircle2,
  MessageCircle,
  QrCode,
  Mail,
  Receipt,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import confetti from "canvas-confetti";
import { trackPixelEvent, generateEventId } from "@/lib/pixel-client";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPlan?: string;
  onToast: (msg: string) => void;
}

export default function CheckoutModal({
  isOpen,
  onClose,
  initialPlan = "18m",
  onToast,
}: CheckoutModalProps) {
  const [selectedPlan, setSelectedPlan] = useState(initialPlan);
  const [showQr, setShowQr] = useState(false);

  const paymentNumber = "01516556465";

  // Form State
  const [email, setEmail] = useState("");
  const [trxId, setTrxId] = useState("");

  // Loading & Submission States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionProgress, setSubmissionProgress] = useState(0);
  const [progressStatusText, setProgressStatusText] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);
  const [trackingId, setTrackingId] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (initialPlan) setSelectedPlan(initialPlan);
  }, [initialPlan]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !isSubmitting) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, isSubmitting, onClose]);

  const [livePrices, setLivePrices] = useState<Record<string, number>>({
    "1m": 149,
    "18m": 499,
    "12m": 399,
  });

  useEffect(() => {
    fetch("/api/public/pricing")
      .then((res) => res.json())
      .then((data) => {
        if (data?.plans && Array.isArray(data.plans)) {
          const map: Record<string, number> = {};
          data.plans.forEach((p: any) => {
            const key = p.planKey || p.plan_key;
            if (key && p.price !== undefined) {
              map[key] = Number(p.price);
            }
          });
          setLivePrices((prev) => ({ ...prev, ...map }));
        }
      })
      .catch(() => {});
  }, [isOpen]);

  const planDetails: Record<string, { name: string; price: number; badge: string }> = {
    "1m": {
      name: "Google AI Pro (১ মাস)",
      price: livePrices["1m"] || 149,
      badge: "ইনভাইটেশন",
    },
    "18m": {
      name: "Google AI Pro (১৮ মাস)",
      price: livePrices["18m"] || 499,
      badge: "প্রাইভেট অ্যাকাউন্ট",
    },
    "12m": {
      name: "Google AI Pro (১২ মাস)",
      price: livePrices["12m"] || 399,
      badge: "পাসওয়ার্ড প্রয়োজন",
    },
  };

  const currentPlan = planDetails[selectedPlan] || planDetails["18m"];

  const handleCopyNumber = () => {
    navigator.clipboard.writeText(paymentNumber).then(() => {
      setCopied(true);
      onToast("পেমেন্ট নম্বর কপি হয়েছে!");
      setTimeout(() => setCopied(false), 2500);
    });
  };

  // Track InitiateCheckout on modal open
  useEffect(() => {
    if (isOpen) {
      trackPixelEvent("InitiateCheckout", {
        content_name: currentPlan.name,
        content_ids: [selectedPlan],
        content_type: "product",
        value: currentPlan.price,
        currency: "BDT",
      });
    }
  }, [isOpen]);

  // Handle Manual Payment Submission
  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !trxId.trim()) {
      onToast("অনুগ্রহ করে জিমেইল ও TrxID দিন");
      return;
    }

    setIsSubmitting(true);
    setSubmissionProgress(35);
    setProgressStatusText("পেমেন্ট ডাটা এনক্রিপ্ট হচ্ছে...");

    const timer1 = setTimeout(() => {
      setSubmissionProgress(75);
      setProgressStatusText("TrxID ও ব্যাংক রেকর্ড যাচাই হচ্ছে...");
    }, 400);

    const purchaseEventId = generateEventId();

    try {
      const response = await fetch("/api/orders/manual", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: email.trim().split("@")[0] || "Customer",
          email: email.trim(),
          phone: "N/A",
          planId: selectedPlan,
          paymentMethod: "bkash_manual",
          trxId: trxId.trim().toUpperCase(),
          eventId: purchaseEventId,
        }),
      });

      clearTimeout(timer1);

      const data = await response.json();

      if (!response.ok || !data.success) {
        setIsSubmitting(false);
        setSubmissionProgress(0);
        onToast(data.message || "ভেরিফিকেশন ব্যর্থ হয়েছে। সঠিক TrxID দিন।");
        return;
      }

      // Track Meta Pixel Purchase Event on Browser
      trackPixelEvent(
        "Purchase",
        {
          currency: "BDT",
          value: currentPlan.price,
          content_name: currentPlan.name,
          content_category: "AI Subscription",
          content_ids: [selectedPlan],
          content_type: "product",
          order_id: data.orderNumber || data.order?.orderNumber,
        },
        purchaseEventId
      );

      setSubmissionProgress(100);
      setProgressStatusText("পেমেন্ট সফলভাবে ভেরিফাইড!");

      setTimeout(() => {
        setIsSubmitting(false);
        setIsCompleted(true);
        setTrackingId(data.orderNumber || data.order?.orderNumber || `#GAI-${Math.floor(10000 + Math.random() * 90000)}`);

        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 },
          colors: ["#3157D5", "#5B55D8", "#7B4FD8", "#2FA36B"],
        });
        onToast("অভিনন্দন! আপনার অর্ডার সফলভাবে নিশ্চিত হয়েছে!");
      }, 350);
    } catch (err: any) {
      clearTimeout(timer1);
      console.error("Order submission error:", err);
      setIsSubmitting(false);
      setSubmissionProgress(0);
      onToast("সার্ভার সমস্যা। কিছুক্ষণ পর চেষ্টা করুন।");
    }
  };

  const resetAndClose = () => {
    setIsCompleted(false);
    setIsSubmitting(false);
    setSubmissionProgress(0);
    setEmail("");
    setTrxId("");
    setShowQr(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-brand-dark/50 backdrop-blur-xs transition-opacity"
        onClick={() => !isSubmitting && resetAndClose()}
      />

      {/* Modal Shell */}
      <div className="relative z-10 w-full max-w-[440px] max-h-[92vh] flex flex-col bg-white rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden animate-in zoom-in-95 duration-150 my-auto">
        
        {/* Close Button */}
        {!isSubmitting && (
          <button
            type="button"
            onClick={resetAndClose}
            className="absolute top-4 right-4 w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors z-20 cursor-pointer"
            aria-label="Close"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}

        <div className="p-5 sm:p-6 overflow-y-auto modal-scroll">
          {!isCompleted ? (
            <>
              {/* Header */}
              <div className="mb-4 text-center">
                <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-brand-blue/10 text-brand-blue text-[11px] font-bold font-outfit mb-1">
                  <Sparkles className="w-3 h-3" />
                  <span>Google AI Pro Checkout</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 font-bangla">
                  সাবস্ক্রিপশন সম্পন্ন করুন
                </h3>
              </div>

              {/* Minimal Plan Selector Pills */}
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100/80 rounded-2xl mb-4 border border-slate-200/60">
                {[
                  { id: "1m", label: "১ মাস", price: `৳${livePrices["1m"] || 149}` },
                  { id: "18m", label: "১৮ মাস", price: `৳${livePrices["18m"] || 499}`, popular: true },
                  { id: "12m", label: "১২ মাস", price: `৳${livePrices["12m"] || 399}` },
                ].map((p) => {
                  const isSelected = selectedPlan === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => !isSubmitting && setSelectedPlan(p.id)}
                      disabled={isSubmitting}
                      className={`relative py-1.5 px-2 rounded-xl text-center transition-all cursor-pointer ${
                        isSelected
                          ? "bg-white text-slate-900 shadow-xs font-bold border border-slate-200/80"
                          : "text-slate-600 hover:text-slate-900 font-medium"
                      }`}
                    >
                      <span className="block text-[11px] font-bangla leading-tight">{p.label}</span>
                      <span className={`block text-xs font-outfit font-extrabold ${isSelected ? "text-brand-blue" : "text-slate-700"}`}>
                        {p.price}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Clean Payment Box (Previous Design with Native QR Dimensions) */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 mb-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#D12053]" />
                    <span className="text-xs font-bold text-slate-800 font-bangla">
                      bKash / Bangla QR পেমেন্ট:
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <strong className="font-outfit text-sm font-extrabold text-slate-900 tracking-wider">
                      {paymentNumber}
                    </strong>
                    <button
                      type="button"
                      onClick={handleCopyNumber}
                      className="bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg px-2 py-0.5 text-[10px] font-bold font-outfit flex items-center gap-1 shadow-2xs transition-colors cursor-pointer"
                    >
                      {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span>{copied ? "Copied" : "Copy"}</span>
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 text-[11px] text-slate-500 font-bangla">
                  <span>bKash, Nagad বা Rocket দিয়ে <strong>৳{currentPlan.price}</strong> পরিশোধ করুন</span>
                  
                  {/* QR Toggle */}
                  <button
                    type="button"
                    onClick={() => setShowQr(!showQr)}
                    className="text-brand-blue hover:underline font-medium inline-flex items-center gap-0.5 cursor-pointer ml-1"
                  >
                    <QrCode className="w-3 h-3" />
                    <span>{showQr ? "QR লুকান" : "QR দেখুন"}</span>
                    {showQr ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </button>
                </div>

                {/* Collapsible QR Preview (Native 612x780 Dimensions Unaltered) */}
                {showQr && (
                  <div className="pt-2 text-center animate-in fade-in zoom-in-95 duration-150">
                    <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs inline-block">
                      <Image
                        src="/bKash_Merchant.png"
                        alt="Bangla QR Code"
                        width={612}
                        height={780}
                        priority
                        className="w-full max-w-[240px] h-auto object-contain mx-auto rounded-xl"
                      />
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1.5 font-bangla">
                      Nagad, Rocket বা যেকোনো ব্যাংকিং অ্যাপ থেকে স্ক্যান করুন
                    </p>
                  </div>
                )}
              </div>

              {/* Minimal Form */}
              <form onSubmit={handleManualSubmit} className="space-y-3">
                {/* Email Field */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1 font-bangla">
                    আপনার জিমেইল এড্রেস
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="yourname@gmail.com"
                      required
                      disabled={isSubmitting}
                      className="w-full h-10 pl-9 pr-3 bg-white border border-slate-200 focus:border-brand-blue focus:ring-1 focus:ring-brand-blue/30 rounded-xl text-xs sm:text-sm text-slate-900 outline-none transition-all font-outfit"
                    />
                  </div>
                </div>

                {/* TrxID Field */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1 font-bangla">
                    পেমেন্ট TrxID (Transaction ID)
                  </label>
                  <div className="relative">
                    <Receipt className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={trxId}
                      onChange={(e) => setTrxId(e.target.value.toUpperCase())}
                      placeholder="যেমন: 9J87AKL0P1"
                      required
                      disabled={isSubmitting}
                      className="w-full h-10 pl-9 pr-3 bg-white border border-slate-200 focus:border-brand-blue focus:ring-1 focus:ring-brand-blue/30 rounded-xl text-xs sm:text-sm font-mono text-slate-900 uppercase tracking-wider outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Verification Progress Bar Display */}
                {isSubmitting && (
                  <div className="bg-slate-50 border border-brand-blue/20 rounded-2xl p-3 space-y-2 animate-in fade-in duration-150">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-800 font-bangla flex items-center gap-1.5">
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-brand-blue" />
                        <span>{progressStatusText}</span>
                      </span>
                      <span className="font-outfit font-extrabold text-brand-blue text-xs">
                        {submissionProgress}%
                      </span>
                    </div>

                    {/* Progress Track */}
                    <div className="w-full bg-slate-200/80 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#3157D5] via-[#5B55D8] to-[#8A4EDB] transition-all duration-300 ease-out rounded-full shadow-sm"
                        style={{ width: `${submissionProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-11 mt-1 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#3157D5] via-[#5B55D8] to-[#8A4EDB] hover:opacity-95 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="font-bangla">যাচাই করা হচ্ছে...</span>
                    </>
                  ) : (
                    <>
                      <span className="font-bangla">৳{currentPlan.price} দিয়ে নিশ্চিত করুন</span>
                      <Sparkles className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>

                {/* WhatsApp Support Button */}
                <a
                  href={`https://wa.me/8801516556465?text=${encodeURIComponent(
                    `হ্যালো, আমি Google AI Pro (${currentPlan.name}) নিতে আগ্রহী। পেমেন্ট বা অর্ডার সংক্রান্ত সহায়তা প্রয়োজন।`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full h-9 inline-flex items-center justify-center gap-1.5 bg-emerald-50 hover:bg-emerald-100/80 text-emerald-700 border border-emerald-200/70 rounded-xl text-xs font-bold font-bangla transition-colors cursor-pointer"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>পেমেন্টে সমস্যা? WhatsApp-এ হেল্প নিন</span>
                </a>

                <div className="flex items-center justify-center gap-1 text-[10px] text-slate-400 text-center font-bangla pt-0.5">
                  <Lock className="w-2.5 h-2.5" />
                  <span>২৫৬-বিট এনক্রিপশনে শতভাগ সুরক্ষিত</span>
                </div>
              </form>
            </>
          ) : (
            /* Clean Minimal Success Screen */
            <div className="text-center py-2 space-y-3.5 animate-in zoom-in-95 duration-150">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200/60 shadow-2xs">
                <CheckCircle2 className="w-7 h-7" />
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 font-bangla">
                  অর্ডার সফল হয়েছে!
                </h3>
                <p className="text-xs text-slate-500 mt-0.5 font-bangla max-w-xs mx-auto">
                  আপনার জিমেইল ({email})-এ ৫-১৫ মিনিটের মধ্যে সাবস্ক্রিপশন সক্রিয় হয়ে যাবে।
                </p>
              </div>

              {/* Minimal Receipt Box */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 text-left space-y-1.5 text-xs font-outfit">
                <div className="flex justify-between items-center text-slate-500">
                  <span className="font-bangla">অর্ডার আইডি:</span>
                  <strong className="text-slate-900 font-mono font-bold">{trackingId}</strong>
                </div>
                <div className="flex justify-between items-center text-slate-500">
                  <span className="font-bangla">প্ল্যান:</span>
                  <span className="text-slate-800 font-semibold font-bangla">{currentPlan.name}</span>
                </div>
                <div className="flex justify-between items-center text-slate-500">
                  <span className="font-bangla">মূল্য:</span>
                  <strong className="text-brand-blue font-extrabold">৳{currentPlan.price} BDT</strong>
                </div>
                {trxId && (
                  <div className="flex justify-between items-center text-slate-500">
                    <span>TrxID:</span>
                    <span className="font-mono font-bold text-slate-900">{trxId}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-1 space-y-2">
                <a
                  href={`https://wa.me/8801516556465?text=${encodeURIComponent(
                    `হ্যালো, আমি Google AI Pro অর্ডার সম্পন্ন করেছি।\nঅর্ডার আইডি: ${trackingId}\nপ্ল্যান: ${currentPlan.name}\nTrxID: ${trxId || "N/A"}\nঅনুগ্রহ করে দ্রুত অ্যাকাউন্ট সক্রিয় করে দিন।`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20BA5A] text-white font-semibold text-xs py-2.5 px-4 rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span className="font-bangla">WhatsApp-এ দ্রুত নিশ্চিত করুন</span>
                </a>

                <button
                  type="button"
                  onClick={resetAndClose}
                  className="w-full text-xs font-medium text-slate-400 hover:text-slate-700 py-1 cursor-pointer font-bangla"
                >
                  উইন্ডো বন্ধ করুন
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
