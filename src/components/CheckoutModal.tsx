"use client";

import React, { useState, useEffect } from "react";
import { X, Copy, Check, Lock, Sparkles, Loader2, CheckCircle2, MessageCircle } from "lucide-react";
import confetti from "canvas-confetti";

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
  const [paymentMethod, setPaymentMethod] = useState<"bkash" | "nagad" | "rocket">("bkash");
  
  // Form State
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
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

  const planDetails: Record<string, { name: string; price: number; duration: string }> = {
    "1m": { name: "Google AI Pro (১ মাসের প্ল্যান)", price: 149, duration: "১ মাস" },
    "12m": { name: "Google AI Pro (১২ মাসের প্ল্যান)", price: 399, duration: "১২ মাস" },
    "18m": { name: "Google AI Pro (১৮ মাসের মেগা অফার)", price: 499, duration: "১৮ মাস" },
  };

  const merchantNumbers: Record<string, string> = {
    bkash: "01812345678",
    nagad: "01798765432",
    rocket: "019123456789",
  };

  const currentPlan = planDetails[selectedPlan] || planDetails["18m"];

  const handleCopyNumber = () => {
    const num = merchantNumbers[paymentMethod];
    navigator.clipboard.writeText(num).then(() => {
      setCopied(true);
      onToast("পেমেন্ট নম্বর সফলভাবে কপি হয়েছে!");
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !phone.trim() || !trxId.trim()) {
      onToast("অনুগ্রহ করে সমস্ত প্রয়োজনীয় তথ্য পূরণ করুন");
      return;
    }

    setIsSubmitting(true);
    setSubmissionProgress(15);
    setProgressStatusText("ডাটা এনক্রিপ্ট ও সাবমিট হচ্ছে...");

    setTimeout(() => {
      setSubmissionProgress(55);
      setProgressStatusText("পেমেন্ট ট্রানজেকশন যাচাই করা হচ্ছে...");
    }, 800);

    setTimeout(() => {
      setSubmissionProgress(85);
      setProgressStatusText("অর্ডার কনফার্মেশন ও ইনভয়েস তৈরি হচ্ছে...");
    }, 1600);

    setTimeout(() => {
      setSubmissionProgress(100);
      setProgressStatusText("অর্ডার সফলভাবে সম্পন্ন!");
      setIsSubmitting(false);
      setIsCompleted(true);
      const generatedId = `#GAI-${Math.floor(10000 + Math.random() * 90000)}`;
      setTrackingId(generatedId);

      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#3157D5", "#5B55D8", "#7B4FD8", "#2FA36B", "#F59E0B"],
      });
      onToast("অভিনন্দন! আপনার অর্ডারটি গৃহীত হয়েছে 🎉");
    }, 2400);
  };

  const resetAndClose = () => {
    setIsCompleted(false);
    setIsSubmitting(false);
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
        className="fixed inset-0 bg-brand-dark/60 backdrop-blur-sm transition-opacity"
        onClick={() => !isSubmitting && resetAndClose()}
      />

      {/* Modal Outer Shell (Perfect Rounded Frame with No Overflowing Scrollbar) */}
      <div className="relative z-10 w-full max-w-lg bg-white rounded-[28px] shadow-2xl border border-brand-border overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Inner Scrollable Container */}
        <div className="max-h-[88vh] overflow-y-auto modal-scroll p-6 sm:p-7">
          
          {/* Close Button */}
          {!isSubmitting && (
            <button
              type="button"
              onClick={resetAndClose}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-brand-muted hover:text-brand-dark flex items-center justify-center transition-colors z-20 cursor-pointer"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {!isCompleted ? (
            <>
              {/* Modal Header */}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="w-5 h-5 text-brand-purple" />
                  <h3 className="text-xl font-bold text-brand-dark">
                    Google AI Pro অর্ডার করুন
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-brand-muted">
                  সহজ ৩টি ধাপে আপনার সাবস্ক্রিপশন সম্পন্ন করুন
                </p>
              </div>

              {/* Plan Selector Radio Pill Bar (Clean Consistent Font) */}
              <div className="grid grid-cols-3 gap-2 mb-4 bg-brand-surface p-1.5 rounded-2xl border border-brand-border">
                {[
                  { id: "1m", label: "১ মাস", price: "৳149" },
                  { id: "12m", label: "১২ মাস", price: "৳399" },
                  { id: "18m", label: "১৮ মাস (সেরা)", price: "৳499" },
                ].map((p) => {
                  const isSelected = selectedPlan === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setSelectedPlan(p.id)}
                      className={`py-2 px-1 text-center rounded-xl transition-all cursor-pointer ${
                        isSelected
                          ? "bg-white text-brand-blue font-bold shadow-sm border border-brand-blue/30"
                          : "text-brand-body text-xs font-semibold hover:text-brand-dark hover:bg-white/60"
                      }`}
                    >
                      <span className="block text-xs font-bangla">{p.label}</span>
                      <span className="block font-outfit text-xs font-bold text-brand-dark mt-0.5">
                        {p.price}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Plan Summary Banner */}
              <div className="bg-brand-subtle border border-brand-purple/20 rounded-2xl p-3.5 flex items-center justify-between mb-4">
                <div>
                  <span className="font-bold text-sm text-brand-dark block font-bangla">
                    {currentPlan.name}
                  </span>
                  <span className="text-xs text-brand-muted block font-bangla">
                    Gemini 3.1 Pro + 5 TB Storage + YouTube Premium
                  </span>
                </div>
                <div className="text-right font-outfit">
                  <span className="text-2xl font-extrabold text-brand-blue">
                    ৳{currentPlan.price}
                  </span>
                </div>
              </div>

              {/* Checkout Form */}
              <form onSubmit={handleSubmit} className="space-y-3.5">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-bold text-brand-dark mb-1">
                    আপনার নাম <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="যেমন: তানভীর হাসান"
                    required
                    disabled={isSubmitting}
                    className="w-full h-10 px-3.5 bg-brand-surface border border-brand-border focus:border-brand-blue rounded-xl text-sm text-brand-dark outline-none transition-colors"
                  />
                </div>

                {/* Gmail Address */}
                <div>
                  <label className="block text-xs font-bold text-brand-dark mb-1">
                    যে জিমেইলে সাবস্ক্রিপশন নিবেন <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your-personal-email@gmail.com"
                    required
                    disabled={isSubmitting}
                    className="w-full h-10 px-3.5 bg-brand-surface border border-brand-border focus:border-brand-blue rounded-xl text-sm text-brand-dark outline-none transition-colors font-outfit"
                  />
                </div>

                {/* Mobile / WhatsApp */}
                <div>
                  <label className="block text-xs font-bold text-brand-dark mb-1">
                    মোবাইল নম্বর / WhatsApp <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="017XXXXXXXX"
                    required
                    disabled={isSubmitting}
                    className="w-full h-10 px-3.5 bg-brand-surface border border-brand-border focus:border-brand-blue rounded-xl text-sm text-brand-dark outline-none transition-colors font-outfit"
                  />
                </div>

                {/* Payment Method Selector */}
                <div>
                  <label className="block text-xs font-bold text-brand-dark mb-1.5">
                    পেমেন্ট মেথড বেছে নিন <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "bkash", name: "bKash", color: "text-[#D12053]" },
                      { id: "nagad", name: "Nagad", color: "text-[#F7941D]" },
                      { id: "rocket", name: "Rocket", color: "text-[#8C3494]" },
                    ].map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setPaymentMethod(m.id as any)}
                        disabled={isSubmitting}
                        className={`h-10 rounded-xl border flex items-center justify-center font-bold text-xs sm:text-sm font-outfit transition-all cursor-pointer ${
                          paymentMethod === m.id
                            ? "border-brand-blue bg-blue-50/50 shadow-sm ring-2 ring-brand-blue/20"
                            : "border-brand-border bg-white hover:bg-gray-50"
                        }`}
                      >
                        <span className={m.color}>{m.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Dynamic Payment Instruction Box */}
                <div className="bg-brand-alt border border-dashed border-brand-border rounded-xl p-3 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-brand-body font-medium font-bangla">
                      Send Money নম্বর ({paymentMethod.toUpperCase()} Personal):
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
                  <label className="block text-xs font-bold text-brand-dark mb-1">
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

                {/* Submission Progress & Status Feedback */}
                {isSubmitting && (
                  <div className="space-y-1.5 pt-1 animate-in fade-in">
                    <div className="flex justify-between text-xs text-brand-muted font-medium">
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

                {/* Submit Button */}
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

                <div className="flex items-center justify-center gap-1.5 text-[11px] text-brand-muted text-center pt-0.5">
                  <Lock className="w-3 h-3 text-brand-muted" />
                  <span>আপনার ডাটা ২৫৬-বিট SSL এনক্রিপশনে সুরক্ষিত</span>
                </div>
              </form>
            </>
          ) : (
            /* Order Success Confirmation Screen */
            <div className="text-center py-4 space-y-4 animate-in zoom-in-95 duration-200">
              <div className="w-14 h-14 rounded-full bg-brand-success/10 text-brand-success flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-xl font-bold text-brand-dark mb-1">
                  অর্ডার সফল হয়েছে! 🎉
                </h3>
                <p className="text-xs text-brand-body leading-relaxed max-w-sm mx-auto">
                  ধন্যবাদ <strong>{fullName}</strong>! আপনার পেমেন্ট ভেরিফিকেশনের কাজ চলছে। আগামী ৫-১৫ মিনিটের মধ্যে আপনার জিমেইল ({email})-এ কনফার্মেশন ও অ্যাক্সেস পৌঁছে যাবে।
                </p>
              </div>

              {/* Receipt Summary Chip */}
              <div className="bg-brand-surface border border-brand-border rounded-2xl p-3.5 text-left space-y-2 text-xs">
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
              <div className="pt-2 space-y-2">
                <a
                  href={`https://wa.me/?text=Hello%2C%20I%20placed%20an%20order%20for%20Google%20AI%20Pro%20with%20Order%20ID%3A%20${trackingId}`}
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
