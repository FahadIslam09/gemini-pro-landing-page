"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, ShieldCheck, Sparkles, ArrowRight, Copy, Check, MessageSquare, Mail } from "lucide-react";
import confetti from "canvas-confetti";
import { trackPixelEvent } from "@/lib/pixel-client";

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const trxID = searchParams.get("trxID") || "BKASH-LIVE-OK";
  const paymentID = searchParams.get("paymentID") || "";
  const amount = searchParams.get("amount") || "499";
  const invoice = searchParams.get("invoice") || "GAI-18M";
  const payer = searchParams.get("payer") || "";

  const [copied, setCopied] = useState(false);

  useEffect(() => {
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.5 },
      colors: ["#3157D5", "#5B55D8", "#7B4FD8", "#2FA36B", "#E11470"],
    });

    // Track Meta Pixel Purchase Event
    trackPixelEvent(
      "Purchase",
      {
        currency: "BDT",
        value: Number(amount) || 499,
        content_name: "Google AI Pro Subscription",
        content_category: "AI Subscription",
        order_id: invoice,
      },
      `pur_bkash_client_${trxID}`
    );
  }, [amount, invoice, trxID]);

  const handleCopyTrx = () => {
    navigator.clipboard.writeText(trxID);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const whatsappMessage = encodeURIComponent(
    `হ্যালো, আমি bKash দিয়ে Google AI Pro সাবস্ক্রিপশন সম্পন্ন করেছি।\nTrxID: ${trxID}\nInvoice: ${invoice}\nAmount: ৳${amount}\nদয়া করে আমার অ্যাকাউন্ট সক্রিয় করে দিন।`
  );

  return (
    <div className="min-h-screen bg-brand-surface py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-lg w-full bg-white rounded-[32px] border border-brand-border shadow-2xl p-7 sm:p-9 text-center animate-in zoom-in-95 duration-300">
        
        {/* Success Icon & Header */}
        <div className="w-20 h-20 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto mb-5 border-2 border-emerald-500/20 shadow-inner">
          <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
        </div>

        <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full text-xs font-bold font-outfit mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Payment Verified & Confirmed</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-brand-dark mb-2">
          পেমেন্ট সফলভাবে সম্পন্ন হয়েছে!
        </h1>
        <p className="text-xs sm:text-sm text-brand-muted mb-6 leading-relaxed">
          আপনার bKash গেটওয়ে পেমেন্ট সফলভাবে ভেরিফাই করা হয়েছে। আপনার গুগল অ্যাকাউন্টে ৫-১৫ মিনিটের মধ্যে সাবস্ক্রিপশন চালু হবে।
        </p>

        {/* Transaction Summary Card */}
        <div className="bg-brand-surface border border-brand-border rounded-2xl p-4.5 sm:p-5 text-left mb-6 space-y-3 font-outfit">
          <div className="flex justify-between items-center pb-2.5 border-b border-brand-border">
            <span className="text-xs font-semibold text-brand-muted">Amount Paid</span>
            <span className="text-base font-extrabold text-brand-blue">৳{amount} BDT</span>
          </div>

          <div className="flex justify-between items-center pb-2.5 border-b border-brand-border">
            <span className="text-xs font-semibold text-brand-muted">bKash TrxID</span>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-brand-dark bg-white px-2 py-0.5 rounded border border-brand-border">
                {trxID}
              </span>
              <button
                type="button"
                onClick={handleCopyTrx}
                className="text-brand-blue hover:text-brand-dark p-1 rounded hover:bg-white transition-colors"
                title="Copy TrxID"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center pb-2.5 border-b border-brand-border">
            <span className="text-xs font-semibold text-brand-muted">Invoice No</span>
            <span className="text-xs font-mono font-bold text-brand-dark">{invoice}</span>
          </div>

          {payer && (
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold text-brand-muted">Payer Account</span>
              <span className="text-xs font-mono font-bold text-brand-dark">{payer}</span>
            </div>
          )}
        </div>

        {/* Instant Activation Next Steps */}
        <div className="bg-[#FAF5FF] border border-purple-200/80 rounded-2xl p-4 text-left mb-6">
          <div className="flex items-center gap-2 mb-1.5 text-brand-purple font-bold text-xs sm:text-sm">
            <ShieldCheck className="w-4 h-4" />
            <span>অ্যাক্টিভেশন সম্পন্ন করতে যোগাযোগ করুন</span>
          </div>
          <p className="text-xs text-brand-body leading-relaxed">
            আপনার TrxID কপি করে সরাসরি আমাদের অফিশিয়াল হোয়াটসঅ্যাপ বা টেলিগ্রাম সাপোর্টে মেসেজ দিন। আমাদের টিম দ্রুত আপনার জিমেইলে প্রিমিয়াম এক্সেস প্রদান করবে।
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href={`https://wa.me/8801516556465?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white text-sm font-bold py-3.5 px-5 rounded-xl shadow-md transition-all cursor-pointer"
          >
            <MessageSquare className="w-4 h-4" />
            <span>WhatsApp-এ মেসেজ দিন</span>
          </a>

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-brand-surface hover:bg-gray-200 text-brand-dark text-sm font-semibold py-3.5 px-5 rounded-xl border border-brand-border transition-all"
          >
            <span>হোমে ফিরে যান</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center font-bangla">লোড হচ্ছে...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
