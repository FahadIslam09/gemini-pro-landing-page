"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Check,
  ShieldCheck,
  Sparkles,
  Lock,
  Copy,
  AlertCircle,
  Loader2,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import confetti from "canvas-confetti";
import { trackPixelEvent, generateEventId } from "@/lib/pixel-client";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPlan?: string;
  onToast: (msg: string) => void;
}

const DEFAULT_PLAN_DETAILS: Record<string, { name: string; price: number; duration: string; type: string }> = {
  "1m": {
    name: "Google AI Pro (১ মাস - ফ্যামিলি ইনভাইট)",
    price: 149,
    duration: "১ মাস",
    type: "ফ্যামিলি ইনভাইটেশন",
  },
  "12m": {
    name: "Google AI Pro (১২ মাস - জিমেইল ও পাসওয়ার্ড)",
    price: 399,
    duration: "১২ মাস",
    type: "জিমেইল ও পাসওয়ার্ড প্রয়োজন",
  },
  "18m": {
    name: "Google AI Pro (১৮ মাস - প্রাইভেট অ্যাকাউন্ট)",
    price: 499,
    duration: "১৮ মাস",
    type: "১০০% নিজস্ব প্রাইভেট অ্যাকাউন্ট",
  },
};

export default function CheckoutModal({
  isOpen,
  onClose,
  initialPlan = "18m",
  onToast,
}: CheckoutModalProps) {
  const [selectedPlan, setSelectedPlan] = useState(initialPlan);
  const [paymentMethod, setPaymentMethod] = useState<"bkash" | "nagad" | "rocket">("bkash");
  const [isManualBkash, setIsManualBkash] = useState(false);
  const [plansMap, setPlansMap] = useState(DEFAULT_PLAN_DETAILS);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [trxId, setTrxId] = useState("");
  const [copied, setCopied] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isBkashRedirecting, setIsBkashRedirecting] = useState(false);
  const [submissionProgress, setSubmissionProgress] = useState(0);
  const [progressStatusText, setProgressStatusText] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);
  const [trackingId, setTrackingId] = useState("");

  useEffect(() => {
    if (initialPlan) {
      setSelectedPlan(initialPlan);
    }
    if (isOpen) {
      const plan = plansMap[initialPlan || selectedPlan] || DEFAULT_PLAN_DETAILS["18m"];
      trackPixelEvent("InitiateCheckout", {
        content_name: plan.name,
        content_category: "AI Subscription",
        content_ids: [initialPlan || selectedPlan],
        currency: "BDT",
        value: plan.price,
      });
    }
  }, [initialPlan, isOpen]);

  // Load dynamic plans from MongoDB
  useEffect(() => {
    fetch("/api/public/pricing")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.plans?.length > 0) {
          const map: Record<string, any> = {};
          data.plans.forEach((p: any) => {
            map[p.planKey] = {
              name: p.name,
              price: p.price,
              duration: p.monthlyBreakdown,
              type: p.accountTypeTitle,
            };
          });
          setPlansMap((prev) => ({ ...prev, ...map }));
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !isSubmitting && !isBkashRedirecting) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, isSubmitting, isBkashRedirecting, onClose]);

  const merchantNumbers: Record<string, string> = {
    bkash: "01516556465",
    nagad: "01798765432",
    rocket: "019123456789",
  };

  const currentPlan = plansMap[selectedPlan] || plansMap["18m"] || DEFAULT_PLAN_DETAILS["18m"];

  const handleCopyNumber = () => {
    const num = merchantNumbers[paymentMethod];
    navigator.clipboard.writeText(num).then(() => {
      setCopied(true);
      onToast("পেমেন্ট নম্বর সফলভাবে কপি হয়েছে!");
      setTimeout(() => setCopied(false), 2500);
    });
  };

  // Direct Official bKash Gateway Payment Handler
  const handleBkashGatewayPayment = async (e: React.FormEvent) => {
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

  // Manual Send Money Submission Handler (Saves to MongoDB)
  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !phone.trim() || !trxId.trim()) {
      onToast("অনুগ্রহ করে সমস্ত প্রয়োজনীয় তথ্য পূরণ করুন");
      return;
    }

    setIsSubmitting(true);
    setSubmissionProgress(25);
    setProgressStatusText("ডাটাবেজে অর্ডার এনক্রিপ্ট ও সেভ হচ্ছে...");

    const purchaseEventId = generateEventId();

    try {
      const res = await fetch("/api/orders/manual", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          email,
          phone,
          planId: selectedPlan,
          paymentMethod: paymentMethod === "bkash" ? "bkash_manual" : paymentMethod,
          trxId,
          eventId: purchaseEventId,
        }),
      });

      setSubmissionProgress(75);
      setProgressStatusText("অর্ডার কনফার্মেশন ও ইনভয়েস তৈরি হচ্ছে...");

      const data = await res.json();

      setTimeout(() => {
        setSubmissionProgress(100);
        setProgressStatusText("অর্ডার সফলভাবে সম্পন্ন!");
        setIsSubmitting(false);
        setIsCompleted(true);
        setTrackingId(data.orderNumber || `#GAI-${Math.floor(10000 + Math.random() * 90000)}`);

        // Client-side Meta Pixel Purchase Event (Deduplicated with CAPI via purchaseEventId)
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
      }, 600);
    } catch (err) {
      setIsSubmitting(false);
      onToast("অর্ডার সাবমিট করতে সমস্যা হয়েছে, পুনরায় চেষ্টা করুন");
    }
  };

  const resetAndClose = () => {
    setIsCompleted(false);
    setIsSubmitting(false);
    setIsBkashRedirecting(false);
    setSubmissionProgress(0);
    setFullName("");
    setEmail("");
    setPhone("");
    setTrxId("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-brand-dark/70 backdrop-blur-sm transition-opacity"
        onClick={isSubmitting || isBkashRedirecting ? undefined : onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-brand-border/80 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#F8FAFC] via-[#F1F5F9] to-[#F8FAFC] px-6 py-4 border-b border-brand-border flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-brand-gradient flex items-center justify-center text-white shadow-sm">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-outfit font-bold text-base text-brand-dark tracking-tight leading-none">
                Google AI Pro Checkout
              </h3>
              <p className="text-[11px] text-brand-muted mt-0.5">
                নিরাপদ ও দ্রুত অ্যাক্টিভেশন পোর্টাল
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={resetAndClose}
            disabled={isSubmitting || isBkashRedirecting}
            className="text-brand-muted hover:text-brand-dark p-1.5 rounded-full hover:bg-gray-200/60 transition-colors disabled:opacity-30 cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-5">
          {isCompleted ? (
            /* Success State */
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-brand-success flex items-center justify-center mx-auto ring-8 ring-emerald-50">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>
              <h3 className="text-2xl font-bold text-brand-dark">
                অর্ডার সফলভাবে গ্রহণ করা হয়েছে!
              </h3>
              <p className="text-sm text-brand-muted max-w-md mx-auto leading-relaxed">
                ধন্যবাদ, <strong className="text-brand-dark">{fullName}</strong>। আপনার অর্ডার আইডি:{" "}
                <span className="font-mono font-bold text-brand-blue bg-blue-50 px-2 py-0.5 rounded">
                  {trackingId}
                </span>
                । পরবর্তী ৫ থেকে ১৫ মিনিটের মধ্যে আপনার জিমেইল (
                <span className="font-mono text-brand-dark">{email}</span>)-এ অ্যাক্টিভেশন নিশ্চিত করা হবে।
              </p>

              <div className="p-4 bg-brand-surface rounded-2xl border border-brand-border text-left text-xs space-y-1.5 max-w-md mx-auto">
                <div className="flex justify-between">
                  <span className="text-brand-muted">নির্বাচিত প্ল্যান:</span>
                  <span className="font-semibold text-brand-dark">{currentPlan.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-brand-muted">পরিশোধিত মূল্য:</span>
                  <span className="font-bold text-brand-blue font-outfit">৳{currentPlan.price} BDT</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-brand-muted">ট্রানজেকশন আইডি:</span>
                  <span className="font-mono font-semibold text-brand-dark">{trxId}</span>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href={`https://wa.me/8801516556465?text=${encodeURIComponent(
                    `হ্যালো! আমি Google AI Pro অর্ডার করেছি।\nঅর্ডার আইডি: ${trackingId}\nইমেইল: ${email}\nTrxID: ${trxId}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-semibold py-3 px-6 rounded-xl shadow-sm transition-all"
                >
                  <span>হোয়াটসঅ্যাপে দ্রুত সাপোর্ট পান</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <button
                  type="button"
                  onClick={resetAndClose}
                  className="bg-brand-dark hover:bg-brand-dark/90 text-white text-xs font-semibold py-3 px-6 rounded-xl transition-all cursor-pointer"
                >
                  সম্পন্ন করুন
                </button>
              </div>
            </div>
          ) : (
            /* Checkout Form State */
            <>
              {/* Plan Selection Carousel/Pills (Order: 1m Left, 18m Center/Featured, 12m Right) */}
              <div>
                <label className="block text-xs font-bold text-brand-dark mb-2 font-outfit uppercase tracking-wider">
                  সাবস্ক্রিপশন প্ল্যান পরিবর্তন করুন:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(["1m", "18m", "12m"] as const).map((key) => {
                    const p = plansMap[key] || DEFAULT_PLAN_DETAILS[key];
                    const isSel = selectedPlan === key;
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setSelectedPlan(key)}
                        className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer relative ${
                          isSel
                            ? "border-brand-purple bg-purple-50/50 shadow-sm ring-1 ring-brand-purple"
                            : "border-brand-border bg-white hover:border-brand-border/90 hover:bg-slate-50/50"
                        }`}
                      >
                        {key === "18m" && (
                          <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-brand-gradient text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full uppercase tracking-tighter">
                            মেগা অফার
                          </span>
                        )}
                        <span className="block text-xs font-bold text-brand-dark font-outfit">
                          {key === "1m" ? "১ মাস" : key === "18m" ? "১৮ মাস" : "১২ মাস"}
                        </span>
                        <span className="block font-outfit font-extrabold text-sm text-brand-blue">
                          ৳{p?.price}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Selected Plan Summary Banner */}
              <div className="p-3.5 bg-gradient-to-r from-blue-50/60 via-purple-50/40 to-white rounded-2xl border border-brand-purple/20 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-brand-dark block">
                    {currentPlan.name}
                  </span>
                  <span className="text-[11px] text-brand-muted">
                    {currentPlan.type}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-brand-muted block font-outfit">টোটাল পেয়্যাবল</span>
                  <span className="text-xl font-extrabold text-brand-blue font-outfit">
                    ৳{currentPlan.price}
                  </span>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div>
                <label className="block text-xs font-bold text-brand-dark mb-2 font-outfit uppercase tracking-wider">
                  পেমেন্ট মেথড বেছে নিন:
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      setPaymentMethod("bkash");
                      setIsManualBkash(false);
                    }}
                    className={`py-3 px-2 rounded-2xl border flex flex-col items-center justify-center gap-1 font-semibold text-xs transition-all cursor-pointer ${
                      paymentMethod === "bkash"
                        ? "border-[#D12053] bg-[#FEF0F4] text-[#D12053] ring-1 ring-[#D12053] shadow-xs"
                        : "border-brand-border bg-white text-brand-dark hover:bg-slate-50"
                    }`}
                  >
                    <span className="font-bold">bKash</span>
                    <span className="text-[10px] opacity-80">
                      {isManualBkash ? "সেন্ড মানি" : "ইন্সট্যান্ট গেটওয়ে"}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("nagad")}
                    className={`py-3 px-2 rounded-2xl border flex flex-col items-center justify-center gap-1 font-semibold text-xs transition-all cursor-pointer ${
                      paymentMethod === "nagad"
                        ? "border-[#F7931E] bg-[#FFF8F0] text-[#F7931E] ring-1 ring-[#F7931E] shadow-xs"
                        : "border-brand-border bg-white text-brand-dark hover:bg-slate-50"
                    }`}
                  >
                    <span className="font-bold">Nagad</span>
                    <span className="text-[10px] opacity-80">সেন্ড মানি</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("rocket")}
                    className={`py-3 px-2 rounded-2xl border flex flex-col items-center justify-center gap-1 font-semibold text-xs transition-all cursor-pointer ${
                      paymentMethod === "rocket"
                        ? "border-[#8C3494] bg-[#FAF0FC] text-[#8C3494] ring-1 ring-[#8C3494] shadow-xs"
                        : "border-brand-border bg-white text-brand-dark hover:bg-slate-50"
                    }`}
                  >
                    <span className="font-bold">Rocket</span>
                    <span className="text-[10px] opacity-80">সেন্ড মানি</span>
                  </button>
                </div>
              </div>

              {/* bKash Payment Switch */}
              {paymentMethod === "bkash" && !isManualBkash ? (
                /* Instant bKash Gateway Mode */
                <div className="space-y-4">
                  <div className="p-4 bg-pink-50/70 border border-pink-200 rounded-2xl space-y-2">
                    <div className="flex items-center gap-2 text-pink-900 font-bold text-xs">
                      <ShieldCheck className="w-4 h-4 text-[#D12053]" />
                      <span>অফিসিয়াল bKash পেমেন্ট গেটওয়ে</span>
                    </div>
                    <p className="text-xs text-pink-800 leading-relaxed">
                      নিচের ফর্মে আপনার নাম, জিমেইল ও ফোন দিয়ে সরাসরি bKash গেটওয়ের মাধ্যমে ওটিপি/পিন দিয়ে নিরাপদভাবে ইনস্ট্যান্ট পেমেন্ট সম্পন্ন করুন।
                    </p>
                  </div>

                  {/* Customer Information Form */}
                  <form onSubmit={handleBkashGatewayPayment} className="space-y-3.5">
                    <div>
                      <label className="block text-xs font-bold text-brand-dark mb-1">
                        আপনার পুরো নাম <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="যেমন: তানভীর হাসান"
                        required
                        disabled={isBkashRedirecting}
                        className="w-full h-11 px-3.5 bg-brand-surface border border-brand-border rounded-xl text-xs text-brand-dark outline-none focus:border-brand-purple"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-brand-dark mb-1">
                        যে জিমেইলে এক্সেস চান <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="yourname@gmail.com"
                        required
                        disabled={isBkashRedirecting}
                        className="w-full h-11 px-3.5 bg-brand-surface border border-brand-border rounded-xl text-xs font-mono text-brand-dark outline-none focus:border-brand-purple"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-brand-dark mb-1">
                        হোয়াটসঅ্যাপ বা ফোন নম্বর <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="017XXXXXXXX"
                        required
                        disabled={isBkashRedirecting}
                        className="w-full h-11 px-3.5 bg-brand-surface border border-brand-border rounded-xl text-xs font-mono text-brand-dark outline-none focus:border-brand-purple"
                      />
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={isBkashRedirecting}
                        className="w-full h-13 inline-flex items-center justify-center gap-2 bg-[#D12053] hover:bg-[#b01742] text-white text-sm font-bold rounded-2xl shadow-lg shadow-pink-600/20 transition-all cursor-pointer disabled:opacity-75"
                      >
                        {isBkashRedirecting ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>bKash গেটওয়েতে সংযোগ করা হচ্ছে...</span>
                          </>
                        ) : (
                          <>
                            <span>bKash দিয়ে সরাসরি পেমেন্ট করুন (৳{currentPlan.price})</span>
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </div>

                    <div className="text-center pt-1">
                      <button
                        type="button"
                        onClick={() => setIsManualBkash(true)}
                        className="text-xs text-brand-muted hover:text-brand-dark underline font-medium cursor-pointer"
                      >
                        ম্যানুয়াল সেন্ড মানি (Send Money) করতে চান?
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                /* Manual Send Money Form (Nagad / Rocket / Manual bKash) */
                <form onSubmit={handleManualSubmit} className="space-y-4">
                  {/* Merchant Number Instruction Box */}
                  <div className="p-4 bg-brand-surface rounded-2xl border border-brand-border space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-brand-dark capitalize">
                        {paymentMethod} Personal / Send Money Number:
                      </span>
                      <span className="text-[10px] bg-brand-purple/10 text-brand-purple font-semibold px-2 py-0.5 rounded-full">
                        Send Money
                      </span>
                    </div>

                    <div className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-brand-border">
                      <span className="font-mono font-bold text-sm text-brand-dark tracking-wide">
                        {merchantNumbers[paymentMethod]}
                      </span>
                      <button
                        type="button"
                        onClick={handleCopyNumber}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-brand-blue hover:text-brand-dark transition-colors px-2 py-1 rounded-md hover:bg-blue-50 cursor-pointer"
                      >
                        {copied ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-brand-success" />
                            <span className="text-brand-success">কপি হয়েছে!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>কপি করুন</span>
                          </>
                        )}
                      </button>
                    </div>

                    <p className="text-[11px] text-brand-muted leading-relaxed">
                      উপরের নম্বরে <strong className="text-brand-dark">৳{currentPlan.price}</strong> সেন্ড মানি করুন এবং নিচে ট্রানজেকশন আইডি (TrxID) প্রদান করুন।
                    </p>
                  </div>

                  {paymentMethod === "bkash" && isManualBkash && (
                    <div className="text-right">
                      <button
                        type="button"
                        onClick={() => setIsManualBkash(false)}
                        className="text-xs text-[#D12053] hover:underline font-semibold cursor-pointer"
                      >
                        ← bKash অনলাইন গেটওয়েতে ফিরে যান
                      </button>
                    </div>
                  )}

                  {/* Input Fields */}
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-brand-dark mb-1">
                        আপনার পুরো নাম <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="যেমন: তানভীর হাসান"
                        required
                        disabled={isSubmitting}
                        className="w-full h-10 px-3 bg-brand-surface border border-brand-border rounded-xl text-xs text-brand-dark outline-none focus:border-brand-purple"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-brand-dark mb-1">
                        যে জিমেইলে এক্সেস চান <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="yourname@gmail.com"
                        required
                        disabled={isSubmitting}
                        className="w-full h-10 px-3 bg-brand-surface border border-brand-border rounded-xl text-xs font-mono text-brand-dark outline-none focus:border-brand-purple"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-brand-dark mb-1">
                          যে নম্বর থেকে টাকা পাঠিয়েছেন <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="017XXXXXXXX"
                          required
                          disabled={isSubmitting}
                          className="w-full h-10 px-3 bg-brand-surface border border-brand-border rounded-xl text-xs font-mono text-brand-dark outline-none focus:border-brand-purple"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-brand-dark mb-1 font-outfit uppercase">
                          Transaction ID (TrxID) <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={trxId}
                          onChange={(e) => setTrxId(e.target.value)}
                          placeholder="BK12345678"
                          required
                          disabled={isSubmitting}
                          className="w-full h-10 px-3 bg-brand-surface border border-brand-border rounded-xl text-xs font-mono font-bold text-brand-dark outline-none focus:border-brand-purple uppercase"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Submission Progress Bar if loading */}
                  {isSubmitting && (
                    <div className="p-3 bg-blue-50/80 rounded-xl border border-blue-100 space-y-2">
                      <div className="flex justify-between text-xs font-semibold text-brand-blue">
                        <span>{progressStatusText}</span>
                        <span>{submissionProgress}%</span>
                      </div>
                      <div className="w-full bg-blue-200/60 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-brand-blue h-2 rounded-full transition-all duration-300"
                          style={{ width: `${submissionProgress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-12 inline-flex items-center justify-center gap-2 bg-brand-gradient hover:bg-brand-gradient-hover text-white text-xs font-bold rounded-xl shadow-glow hover:shadow-lg transition-all cursor-pointer disabled:opacity-75"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>যাচাই ও সংরক্ষণ হচ্ছে...</span>
                        </>
                      ) : (
                        <>
                          <span>পেমেন্ট নিশ্চিত করুন (৳{currentPlan.price})</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}

              {/* Trust Badge Footnote */}
              <div className="flex items-center justify-center gap-1.5 text-[11px] text-brand-muted pt-2 border-t border-brand-border">
                <Lock className="w-3.5 h-3.5 text-brand-muted" />
                <span>SSL সুরক্ষিত এনক্রিপ্টেড ট্রানজেকশন ও ২৪/৭ সক্রিয় কাস্টমার সাপোর্ট</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
