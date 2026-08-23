"use client";

import React, { useState } from "react";
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
import Footer from "@/components/Footer";
import { CheckCircle2 } from "lucide-react";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalPlan, setModalPlan] = useState("18m");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [price18m, setPrice18m] = useState(299);

  React.useEffect(() => {
    fetch("/api/public/pricing")
      .then((res) => res.json())
      .then((data) => {
        if (data?.plans && Array.isArray(data.plans)) {
          const p18 = data.plans.find((p: any) => (p.planKey || p.plan_key) === "18m");
          if (p18 && p18.price !== undefined) {
            setPrice18m(Number(p18.price));
          }
        }
      })
      .catch(() => {});
  }, []);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage((prev) => (prev === message ? null : prev));
    }, 3500);
  };

  const handleOpenCheckout = (plan: string = "18m") => {
    setModalPlan(plan);
    setIsModalOpen(true);
  };

  return (
    <main className="min-h-screen bg-brand-surface text-brand-body relative">
      {/* Header */}
      <Header onOpenCheckout={handleOpenCheckout} price18m={price18m} />

      {/* Hero Section */}
      <Hero onOpenCheckout={handleOpenCheckout} price18m={price18m} />

      {/* Why Google AI Pro Feature Grid (অল-ইন-ওয়ান অফিসিয়াল পাওয়ার হাউস) */}
      <WhyGemini />

      {/* Gemini Omni Video & Multimodal Studio Showcase */}
      <GeminiOmniShowcase onOpenCheckout={handleOpenCheckout} />

      {/* Nano Banana 2 & Lyria 3 Creative AI Showcase */}
      <CreativeGenerativeShowcase onOpenCheckout={handleOpenCheckout} />

      {/* Interactive Deep Dive with Tabs */}
      <FeatureDeepDive onOpenCheckout={handleOpenCheckout} price18m={price18m} />

      {/* Comparison Table */}
      <ComparisonTable onOpenCheckout={handleOpenCheckout} price18m={price18m} />

      {/* Pricing Section */}
      <PricingSection onOpenCheckout={handleOpenCheckout} />

      {/* How It Works */}
      <HowItWorks price18m={price18m} />

      {/* Testimonials / Social Proof */}
      <Testimonials price18m={price18m} />

      {/* FAQ Section */}
      <FaqSection />

      {/* Final CTA Banner */}
      <FinalCta onOpenCheckout={handleOpenCheckout} price18m={price18m} />

      {/* Footer */}
      <Footer />

      {/* Sticky Mobile Quick Checkout Bar */}
      <StickyMobileBar onOpenCheckout={handleOpenCheckout} price18m={price18m} />

      {/* Interactive Checkout Modal with Multi-Stage Loading */}
      <CheckoutModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialPlan={modalPlan}
        onToast={showToast}
      />

      {/* Toast Notification Container */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-20 sm:bottom-6 right-6 z-50 bg-slate-900 text-white text-xs sm:text-sm font-semibold px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-3 duration-200"
        >
          <CheckCircle2 className="w-4 h-4 text-brand-success flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </main>
  );
}
