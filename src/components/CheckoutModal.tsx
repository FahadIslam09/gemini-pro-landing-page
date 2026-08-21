"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Copy,
  Check,
  Lock,
  Sparkles,
  Loader2,
  CheckCircle2,
  MessageCircle,
  ShieldCheck,
  KeyRound,
  Users,
  Zap,
  ArrowRight,
} from "lucide-react";
import confetti from "canvas-confetti";
import { trackPixelEvent, generateEventId } from "@/lib/pixel-client";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPlan?: string;
  initialPlansData?: any[] | null;
  onToast: (msg: string) => void;
}

interface PlanDetail {
  name: string;
  price: number;
  duration: string;
  type: string;
  badge?: string;
  popular?: boolean;
}

const DEFAULT_PLANS: Record<string, PlanDetail> = {
  "1m": {
    name: "Google AI Pro (১ মাস - ফ্যামিলি ইনভাইট)",
    price: 149,
    duration: "১ মাস",
    type: "ফ্যামিলি ইনভাইটেশন (Google Family)",
    badge: "ট্রায়াল প্যাক",
    popular: false,
  },
  "18m": {
    name: "Google AI Pro (১৮ মাস - প্রাইভেট অ্যাকাউন্ট)",
    price: 499,
    duration: "১৮ মাস",
    type: "১০০% নিজস্ব প্রাইভেট অ্যাকাউন্ট",
    badge: "৮৫% ছাড়",
    popular: true,
  },
  "12m": {
    name: "Google AI Pro (১২ মাস - জিমেইল ও পাসওয়ার্ড)",
    price: 399,
    duration: "১২ মাস",
    type: "জিমেইল ও পাসওয়ার্ড প্রয়োজন",
    badge: "বার্ষিক প্ল্যান",
    popular: false,
  },
};

type PaymentMethodType = "bkash" | "bkash_manual" | "nagad" | "rocket";

export default function CheckoutModal({
  isOpen,
  onClose,
  initialPlan = "18m",
  initialPlansData,
  onToast,
}: CheckoutModalProps) {
  const [selectedPlan, setSelectedPlan] = useState(initialPlan);
  const [plansMap, setPlansMap] = useState<Record<string, PlanDetail>>(() => {
    if (initialPlansData && initialPlansData.length > 0) {
      const map: Record<string, PlanDetail> = {};
      initialPlansData.forEach((p: any) => {
        map[p.planKey] = {
          name: p.name,
          price: p.price,
          duration: p.monthlyBreakdown || `${p.planKey} মেয়াদ`,
          type: p.accountTypeTitle || "১০০% নিজস্ব প্রাইভেট অ্যাকাউন্ট",
          badge: p.badge || "",
          popular: p.popular || p.planKey === "18m",
        };
      });
      return { ...DEFAULT_PLANS, ...map };
    }
    return DEFAULT_PLANS;
  });
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>("bkash");

  // Form State
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [trxId, setTrxId] = useState("");

  // Loading & Submission States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isBkashRedirecting, setIsBkashRedirecting] = useState(false);
  const [submissionProgress, setSubmissionProgress] = useState(0);
  const [progressStatusText, setProgressStatusText] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);
  const [trackingId, setTrackingId] = useState("");
  const [copied, setCopied] = useState(false);

  // Sync dynamic plans when pre-fetched data updates
  useEffect(() => {
    if (initialPlansData && initialPlansData.length > 0) {
      const map: Record<string, PlanDetail> = {};
      initialPlansData.forEach((p: any) => {
        map[p.planKey] = {
          name: p.name,
          price: p.price,
          duration: p.monthlyBreakdown || `${p.planKey} মেয়াদ`,
          type: p.accountTypeTitle || "১০০% নিজস্ব প্রাইভেট অ্যাকাউন্ট",
          badge: p.badge || "",
          popular: p.popular || p.planKey === "18m",
        };
      });
      setPlansMap((prev) => ({ ...prev, ...map }));
    }
  }, [initialPlansData]);

  useEffect(() => {
    if (initialPlan) {
      setSelectedPlan(initialPlan);
    }
    if (isOpen) {
      const plan = plansMap[initialPlan || selectedPlan] || DEFAULT_PLANS["18m"];
      trackPixelEvent("InitiateCheckout", {
        content_name: plan.name,
        content_category: "AI Subscription",
        content_ids: [initialPlan || selectedPlan],
        currency: "BDT",
        value: plan.price,
      });
    }
  }, [initialPlan, isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !isSubmitting && !isBkashRedirecting) {
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
  }, [isOpen, isSubmitting, isBkashRedirecting, onClose]);

  const merchantNumbers: Record<string, string> = {
    bkash_manual: "01516556465",
    nagad: "01798765432",
    rocket: "019123456789",
  };

  const currentPlan = plansMap[selectedPlan] || plansMap["18m"] || DEFAULT_PLANS["18m"];

  const handleCopyNumber = () => {
    const num = merchantNumbers[paymentMethod] || "01798765432";
    navigator.clipboard.writeText(num).then(() => {
      setCopied(true);
      onToast("পেমেন্ট নম্বর সফলভাবে কপি হয়েছে!");
      setTimeout(() => setCopied(false), 2500);
    });
  };

  // Direct Official bKash Gateway Payment Handler
  const handleBkashAutoPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !phone.trim()) {
      onToast("অনুগ্রহ করে আপনার নাম, জিমেইল ও ফোন নম্বর দিন");
      return;
    }

    try {
      setIsBkashRedirecting(true);
      onToast("bKash নিরাপদ গেটওয়েতে রিডাইরেক্ট করা হচ্ছে...");

      const res = await fetch("/api/bkash/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId: selectedPlan,
          fullName,
          email,
          phone,
        }),
      });

      const data = await res.json();

      if (data.success && data.bkashURL) {
        window.location.href = data.bkashURL;
      } else {
        setIsBkashRedirecting(false);
        onToast(data.message || "bKash গেটওয়ে শুরু করতে সমস্যা হয়েছে");
      }
    } catch (err: any) {
      setIsBkashRedirecting(false);
      console.error("bKash redirect error:", err);
      onToast("সার্ভার ত্রুটি: অনুগ্রহ করে পুনরায় চেষ্টা করুন");
    }
  };

  // Manual Send Money Submission Handler (Nagad / Rocket)
  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !phone.trim() || !trxId.trim()) {
      onToast("অনুগ্রহ করে সমস্ত প্রয়োজনীয় তথ্য পূরণ করুন");
      return;
    }

    setIsSubmitting(true);
    setSubmissionProgress(20);
    setProgressStatusText("ডাটা এনক্রিপ্ট ও সাবমিট হচ্ছে...");

    const purchaseEventId = generateEventId();

    try {
      setTimeout(() => {
        setSubmissionProgress(60);
        setProgressStatusText("পেমেন্ট ট্রানজেকশন যাচাই করা হচ্ছে...");
      }, 400);

      const res = await fetch("/api/orders/manual", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          email,
          phone,
          planId: selectedPlan,
          paymentMethod,
          trxId,
          eventId: purchaseEventId,
        }),
      });

      setSubmissionProgress(85);
      setProgressStatusText("অর্ডার কনফার্মেশন ও ইনভয়েস তৈরি হচ্ছে...");

      const data = await res.json();

      setTimeout(() => {
        setSubmissionProgress(100);
        setProgressStatusText("অর্ডার সফলভাবে সম্পন্ন!");
        setIsSubmitting(false);
        setIsCompleted(true);
        setTrackingId(data.orderNumber || `#GAI-${Math.floor(10000 + Math.random() * 90000)}`);

        // Client-side Meta Pixel Purchase Event
        trackPixelEvent(
          "Purchase",
          {
            currency: "BDT",
            value: currentPlan.price,
            content_name: currentPlan.name,
            content_ids: [selectedPlan],
            content_type: "product",
            order_id: data.orderNumber,
          },
          purchaseEventId
        );

        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#3157D5", "#5B55D8", "#7B4FD8", "#2FA36B", "#F59E0B"],
        });
        onToast("অভিনন্দন! আপনার অর্ডারটি গৃহীত হয়েছে");
      }, 400);
    } catch {
      setIsSubmitting(false);
      onToast("অর্ডার সাবমিট করতে সমস্যা হয়েছে, পুনরায় চেষ্টা করুন");
    }
  };

  const resetAndClose = () => {
    setIsCompleted(false);
    setIsSubmitting(false);
    setIsBkashRedirecting(false);
    setSubmissionProgress(0);
    setProgressStatusText("");
    setTrxId("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={resetAndClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-brand-border overflow-hidden animate-in zoom-in-95 duration-200 my-auto"
      >
        {/* Modal Header */}
        <div className="bg-brand-surface border-b border-brand-border px-6 py-5 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-blue animate-pulse" />
              <h2 className="font-bangla font-bold text-lg text-brand-dark">
                Google AI Pro সাবস্ক্রিপশন
              </h2>
            </div>
            <p className="text-xs text-brand-muted font-bangla">
              নিরাপদ ও দ্রুত অ্যাক্টিভেশন • ৫-১৫ মিনিটে সক্রিয়
            </p>
          </div>
          <button
            type="button"
            onClick={resetAndClose}
            aria-label="Close modal"
            className="w-8 h-8 rounded-full bg-white hover:bg-gray-100 border border-brand-border text-brand-muted hover:text-brand-dark flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body with Custom Styled Scrollbar */}
        <div className="p-6 max-h-[80vh] overflow-y-auto custom-scrollbar">
          {!isCompleted ? (
            <>
              {/* Plan Selection Tabs (1m, 18m, 12m in clean exact visual layout) */}
              <div className="mb-5">
                <label className="block text-xs font-bold text-brand-dark mb-2 font-bangla">
                  সাবস্ক্রিপশন প্ল্যান বেছে নিন:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(["1m", "18m", "12m"] as const).map((planKey) => {
                    const plan = plansMap[planKey] || DEFAULT_PLANS[planKey];
                    const isSelected = selectedPlan === planKey;
                    return (
                      <button
                        key={planKey}
                        type="button"
                        onClick={() => setSelectedPlan(planKey)}
                        className={`relative p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                          isSelected
                            ? "bg-brand-purple/5 border-brand-purple shadow-sm ring-2 ring-brand-purple/20"
                            : "bg-white border-brand-border hover:border-gray-300"
                        }`}
                      >
                        {plan.popular && (
                          <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-brand-gradient text-white text-[9px] font-bold px-2 py-0.2 rounded-full font-outfit shadow-sm">
                            Popular
                          </span>
                        )}
                        <span className="block text-xs font-bold text-brand-dark font-bangla">
                          {planKey === "1m" ? "১ মাস" : planKey === "18m" ? "১৮ মাস" : "১২ মাস"}
                        </span>
                        <span className="block font-outfit text-sm font-extrabold text-brand-blue mt-0.5">
                          ৳{plan.price}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Selected Plan Summary Card */}
              <div className="bg-[#FAFBFD] border border-brand-border/80 rounded-2xl p-4 mb-5 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5 mb-0.5">
                    {selectedPlan === "1m" ? (
                      <Users className="w-3.5 h-3.5 text-brand-blue" />
                    ) : selectedPlan === "12m" ? (
                      <KeyRound className="w-3.5 h-3.5 text-amber-600" />
                    ) : (
                      <ShieldCheck className="w-3.5 h-3.5 text-brand-purple" />
                    )}
                    <span className="text-xs font-bold text-brand-dark font-bangla">
                      {currentPlan.type}
                    </span>
                  </div>
                  <p className="text-[11px] text-brand-muted font-bangla">
                    {currentPlan.name}
                  </p>
                </div>
                <div className="text-right font-outfit">
                  <span className="text-xl font-extrabold text-brand-dark">
                    ৳{currentPlan.price}
                  </span>
                  <span className="block text-[10px] text-brand-muted">
                    {currentPlan.duration}
                  </span>
                </div>
              </div>

              {/* Form Content */}
              <form
                onSubmit={paymentMethod === "bkash" ? handleBkashAutoPayment : handleManualSubmit}
                className="space-y-4"
              >
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-bold text-brand-dark mb-1 font-bangla">
                    আপনার নাম <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="আপনার পূর্ণ নাম লিখুন"
                    required
                    disabled={isSubmitting || isBkashRedirecting}
                    className="w-full h-10 px-3.5 bg-brand-surface border border-brand-border focus:border-brand-blue rounded-xl text-sm text-brand-dark outline-none transition-colors"
                  />
                </div>

                {/* Gmail Address */}
                <div>
                  <label className="block text-xs font-bold text-brand-dark mb-1 font-bangla">
                    যে জিমেইলে এক্সেস চান <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@gmail.com"
                    required
                    disabled={isSubmitting || isBkashRedirecting}
                    className="w-full h-10 px-3.5 bg-brand-surface border border-brand-border focus:border-brand-blue rounded-xl text-sm text-brand-dark outline-none transition-colors"
                  />
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-xs font-bold text-brand-dark mb-1 font-bangla">
                    মোবাইল নম্বর <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="017XXXXXXXX"
                    required
                    disabled={isSubmitting || isBkashRedirecting}
                    className="w-full h-10 px-3.5 bg-brand-surface border border-brand-border focus:border-brand-blue rounded-xl text-sm text-brand-dark outline-none transition-colors"
                  />
                </div>

                {/* Payment Method Selector (bKash Auto, bKash Send Money, Nagad, Rocket) */}
                <div>
                  <label className="block text-xs font-bold text-brand-dark mb-1.5 font-bangla">
                    পেমেন্ট মাধ্যম বেছে নিন:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("bkash")}
                      className={`h-11 rounded-xl border flex items-center justify-center font-outfit text-xs font-bold transition-all cursor-pointer relative ${
                        paymentMethod === "bkash"
                          ? "bg-[#E2136E]/10 border-[#E2136E] text-[#E2136E] ring-2 ring-[#E2136E]/20"
                          : "bg-white border-brand-border text-brand-body hover:border-gray-300"
                      }`}
                    >
                      <span className="flex items-center gap-1">
                        <Zap className="w-3.5 h-3.5 text-[#E2136E] fill-[#E2136E]" />
                        <span>bKash (অটো)</span>
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("bkash_manual")}
                      className={`h-11 rounded-xl border flex items-center justify-center font-outfit text-xs font-bold transition-all cursor-pointer ${
                        paymentMethod === "bkash_manual"
                          ? "bg-[#E2136E]/10 border-[#E2136E] text-[#E2136E] ring-2 ring-[#E2136E]/20"
                          : "bg-white border-brand-border text-brand-body hover:border-gray-300"
                      }`}
                    >
                      bKash (সেন্ড মানি)
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("nagad")}
                      className={`h-11 rounded-xl border flex items-center justify-center font-outfit text-xs font-bold transition-all cursor-pointer ${
                        paymentMethod === "nagad"
                          ? "bg-[#F7931E]/10 border-[#F7931E] text-[#F7931E] ring-2 ring-[#F7931E]/20"
                          : "bg-white border-brand-border text-brand-body hover:border-gray-300"
                      }`}
                    >
                      Nagad
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("rocket")}
                      className={`h-11 rounded-xl border flex items-center justify-center font-outfit text-xs font-bold transition-all cursor-pointer ${
                        paymentMethod === "rocket"
                          ? "bg-[#8C3494]/10 border-[#8C3494] text-[#8C3494] ring-2 ring-[#8C3494]/20"
                          : "bg-white border-brand-border text-brand-body hover:border-gray-300"
                      }`}
                    >
                      Rocket
                    </button>
                  </div>
                </div>

                {/* Conditional UI: bKash Auto Gateway vs Manual Send Money (Nagad / Rocket) */}
                {paymentMethod === "bkash" ? (
                  /* bKash Official Gateway Callout */
                  <div className="bg-[#FFF5F8] border border-[#FAD2E1] rounded-2xl p-4 space-y-2 text-xs">
                    <div className="flex items-center gap-2 text-[#E2136E] font-bold font-bangla">
                      <Zap className="w-4 h-4 fill-[#E2136E]" />
                      <span>অফিসিয়াল bKash পেমেন্ট গেটওয়ে (১-ক্লিক)</span>
                    </div>
                    <p className="text-[11px] text-brand-body leading-relaxed font-bangla">
                      নিচের বাটনে চাপ দিলে সরাসরি অফিসিয়াল bKash সিকিউর পেজে নিয়ে যাওয়া হবে। পেমেন্ট সম্পন্ন হলে সাথে সাথে আপনার সাবস্ক্রিপশন নিশ্চিত হবে।
                    </p>
                  </div>
                ) : (
                  /* Manual Send Money Details Box + TrxID Input */
                  <>
                    <div className="bg-[#F8F9FD] border border-brand-border rounded-2xl p-4 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-brand-body font-medium font-bangla">
                          Send Money নম্বর ({paymentMethod === "bkash_manual" ? "bKash" : paymentMethod.toUpperCase()} Personal):
                        </span>
                        <div className="flex items-center gap-1.5">
                          <strong className="font-outfit text-brand-dark font-bold text-sm">
                            {merchantNumbers[paymentMethod]}
                          </strong>
                          <button
                            type="button"
                            onClick={handleCopyNumber}
                            className="bg-white hover:bg-gray-100 text-brand-blue border border-brand-border rounded-md px-2 py-0.5 text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            {copied ? <Check className="w-3 h-3 text-brand-success" /> : <Copy className="w-3 h-3" />}
                            <span>{copied ? "কপি হয়েছে" : "কপি"}</span>
                          </button>
                        </div>
                      </div>
                      <p className="text-[11px] text-brand-muted leading-relaxed font-bangla">
                        টাকা পাঠিয়ে নিচের ঘরে আপনার ট্রানজেকশন আইডি (TrxID) দিন:
                      </p>
                    </div>

                    {/* TrxID Input */}
                    <div>
                      <label className="block text-xs font-bold text-brand-dark mb-1 font-bangla">
                        Transaction ID (TrxID) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={trxId}
                        onChange={(e) => setTrxId(e.target.value.toUpperCase())}
                        placeholder="যেমন: 9J87AKL0P1"
                        required
                        disabled={isSubmitting}
                        className="w-full h-10 px-3.5 bg-brand-surface border border-brand-border focus:border-brand-blue rounded-xl text-sm font-mono text-brand-dark uppercase tracking-wider outline-none transition-colors"
                      />
                    </div>
                  </>
                )}

                {/* Submission Progress & Status Feedback (for manual flow) */}
                {isSubmitting && (
                  <div className="space-y-1.5 pt-1 animate-in fade-in">
                    <div className="flex justify-between text-xs text-brand-muted font-medium font-bangla">
                      <span>{progressStatusText}</span>
                      <span className="font-outfit font-bold text-brand-blue">{submissionProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-brand-gradient h-full transition-all duration-300 rounded-full"
                        style={{ width: `${submissionProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Submit Action Button */}
                {paymentMethod === "bkash" ? (
                  <button
                    type="submit"
                    disabled={isBkashRedirecting}
                    className="w-full inline-flex items-center justify-center gap-2 bg-[#E2136E] hover:bg-[#c2105e] text-white text-sm font-semibold py-3.5 px-6 rounded-xl shadow-md hover:shadow-lg transition-all disabled:opacity-75 disabled:cursor-not-allowed hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                  >
                    {isBkashRedirecting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>bKash গেটওয়েতে রিডাইরেক্ট হচ্ছে...</span>
                      </>
                    ) : (
                      <>
                        <span>bKash দিয়ে সরাসরি পে করুন (৳{currentPlan.price})</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full inline-flex items-center justify-center gap-2 bg-brand-gradient hover:bg-brand-gradient-hover text-white text-sm font-semibold py-3.5 px-6 rounded-xl shadow-glow transition-all disabled:opacity-75 disabled:cursor-not-allowed hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>অর্ডার প্রসেস করা হচ্ছে...</span>
                      </>
                    ) : (
                      <>
                        <span>অর্ডার নিশ্চিত করুন (৳{currentPlan.price})</span>
                        <Sparkles className="w-4 h-4" />
                      </>
                    )}
                  </button>
                )}

                <div className="flex items-center justify-center gap-1.5 text-[11px] text-brand-muted text-center pt-0.5 font-bangla">
                  <Lock className="w-3 h-3 text-brand-muted" />
                  <span>আপনার ডাটা ২৫৬-বিট SSL এনক্রিপশনে সুরক্ষিত</span>
                </div>
              </form>
            </>
          ) : (
            /* Order Success Confirmation Screen */
            <div className="text-center py-4 space-y-4 animate-in zoom-in-95 duration-200">
              <div className="w-14 h-14 rounded-full bg-brand-success/10 text-brand-success flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
              </div>

              <div>
                <h3 className="text-xl font-bold text-brand-dark mb-1 font-bangla">
                  অর্ডার সফল হয়েছে!
                </h3>
                <p className="text-xs text-brand-body leading-relaxed max-w-sm mx-auto font-bangla">
                  ধন্যবাদ <strong>{fullName}</strong>! আপনার পেমেন্ট ভেরিফিকেশনের কাজ চলছে। আগামী ৫-১৫ মিনিটের মধ্যে আপনার জিমেইল ({email})-এ কনফার্মেশন ও অ্যাক্সেস পৌঁছে যাবে।
                </p>
              </div>

              {/* Receipt Summary Chip */}
              <div className="bg-brand-surface border border-brand-border rounded-2xl p-3.5 text-left space-y-2 text-xs font-bangla">
                <div className="flex justify-between border-b border-gray-100 pb-1.5">
                  <span className="text-brand-muted">অর্ডার ট্র্যাকিং আইডি:</span>
                  <strong className="font-outfit text-brand-blue font-bold">{trackingId}</strong>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-1.5">
                  <span className="text-brand-muted">প্ল্যান:</span>
                  <span className="font-semibold text-brand-dark">{currentPlan.name}</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-1.5">
                  <span className="text-brand-muted">পরিশোধিত মূল্য:</span>
                  <strong className="font-outfit text-brand-dark">৳{currentPlan.price} BDT</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-brand-muted">TrxID:</span>
                  <span className="font-mono font-bold text-brand-dark">{trxId}</span>
                </div>
              </div>

              {/* WhatsApp Support Button */}
              <div className="pt-2 space-y-2 font-bangla">
                <a
                  href={`https://wa.me/8801516556465?text=${encodeURIComponent(
                    `হ্যালো, আমি Google AI Pro অর্ডার করেছি। Order ID: ${trackingId}, TrxID: ${trxId}, Plan: ${currentPlan.name}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20BA5A] text-white font-semibold text-xs py-3 px-4 rounded-xl shadow-sm transition-colors cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>হোয়াটসঅ্যাপে দ্রুত কনফার্মেশন নিন</span>
                </a>

                <button
                  type="button"
                  onClick={resetAndClose}
                  className="w-full text-xs font-semibold text-brand-muted hover:text-brand-dark py-1.5 cursor-pointer"
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
