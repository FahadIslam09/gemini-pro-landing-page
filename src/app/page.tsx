"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import WhyGemini from "@/components/WhyGemini";
import GeminiOmniShowcase from "@/components/GeminiOmniShowcase";
import CreativeGenerativeShowcase from "@/components/CreativeGenerativeShowcase";
import FeatureDeepDive from "@/components/FeatureDeepDive";
import ComparisonTable from "@/components/ComparisonTable";
import PricingSection from "@/components/PricingSection";
import HowItWorks from "@/components/HowItWorks";
import Testimonials from "@/components/Testimonials";
import FaqSection from "@/components/FaqSection";
import FinalCta from "@/components/FinalCta";
import CheckoutModal from "@/components/CheckoutModal";
import StickyMobileBar from "@/components/StickyMobileBar";
import ScrollProgress from "@/components/ScrollProgress";
import Footer from "@/components/Footer";
import { CheckCircle2, AlertTriangle } from "lucide-react";

function HomeContent() {
  const searchParams = useSearchParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalPlan, setModalPlan] = useState("18m");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"success" | "error">("success");
  const [dynamicPlansData, setDynamicPlansData] = useState<any[] | null>(null);

  // Fast pre-fetch of live database pricing as soon as the page loads
  useEffect(() => {
    fetch("/api/public/pricing", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.plans?.length > 0) {
          setDynamicPlansData(data.plans);
        }
      })
      .catch((err) => console.error("Error preloading pricing:", err));
  }, []);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => {
      setToastMessage((prev) => (prev === message ? null : prev));
    }, 4500);
  };

  useEffect(() => {
    const paymentStatus = searchParams.get("payment");
    const reason = searchParams.get("reason");
    if (paymentStatus === "cancelled") {
      showToast("bKash পেমেন্ট বাতিল করা হয়েছে। আবার চেষ্টা করতে পারেন।", "error");
    } else if (paymentStatus === "failed") {
      showToast(reason || "পেমেন্ট ব্যর্থ হয়েছে। দয়া করে আবার চেষ্টা করুন।", "error");
    }
  }, [searchParams]);

  const handleOpenCheckout = (plan: string = "18m") => {
    setModalPlan(plan);
    setIsModalOpen(true);
  };

  return (
    <main className="min-h-screen bg-brand-surface text-brand-body relative">
      {/* Scroll Progress & Scroll-to-Top Indicator */}
      <ScrollProgress />

      {/* Header */}
      <Header onOpenCheckout={handleOpenCheckout} />

      {/* Hero Section */}
      <Hero onOpenCheckout={handleOpenCheckout} />

      {/* Why Google AI Pro Feature Grid */}
      <WhyGemini />

      {/* Gemini Omni Video & Multimodal Studio Showcase */}
      <GeminiOmniShowcase onOpenCheckout={handleOpenCheckout} />

      {/* Nano Banana 2 & Lyria 3 Creative AI Showcase */}
      <CreativeGenerativeShowcase onOpenCheckout={handleOpenCheckout} />

      {/* Interactive Deep Dive with Tabs */}
      <FeatureDeepDive onOpenCheckout={handleOpenCheckout} />

      {/* Comparison Table */}
      <ComparisonTable onOpenCheckout={handleOpenCheckout} />

      {/* Pricing Section */}
      <PricingSection onOpenCheckout={handleOpenCheckout} initialPlans={dynamicPlansData} />

      {/* How It Works */}
      <HowItWorks />

      {/* Testimonials / Social Proof */}
      <Testimonials />

      {/* FAQ Section */}
      <FaqSection />

      {/* Final CTA Banner */}
      <FinalCta onOpenCheckout={handleOpenCheckout} />

      {/* Footer */}
      <Footer />

      {/* Sticky Mobile Quick Checkout Bar */}
      <StickyMobileBar onOpenCheckout={handleOpenCheckout} />

      {/* Interactive Checkout Modal with Instant Live DB Prices */}
      <CheckoutModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialPlan={modalPlan}
        initialPlansData={dynamicPlansData}
        onToast={(msg) => showToast(msg, "success")}
      />

      {/* Toast Notification Container */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className={`fixed bottom-20 sm:bottom-6 right-6 z-50 text-white text-xs sm:text-sm font-semibold px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-3 duration-200 ${
            toastType === "error" ? "bg-red-900 border border-red-700" : "bg-slate-900"
          }`}
        >
          {toastType === "error" ? (
            <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-brand-success flex-shrink-0" />
          )}
          <span>{toastMessage}</span>
        </div>
      )}
    </main>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-brand-surface" />}>
      <HomeContent />
    </Suspense>
  );
}
