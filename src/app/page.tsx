"use client";

import React, { useState } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import WhyGemini from "@/components/WhyGemini";
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
      <Header onOpenCheckout={handleOpenCheckout} />

      {/* Hero Section */}
      <Hero onOpenCheckout={handleOpenCheckout} />

      {/* Why Google AI Pro Feature Grid */}
      <WhyGemini />

      {/* Interactive Deep Dive with Tabs */}
      <FeatureDeepDive onOpenCheckout={handleOpenCheckout} />

      {/* Comparison Table */}
      <ComparisonTable onOpenCheckout={handleOpenCheckout} />

      {/* Pricing Section */}
      <PricingSection onOpenCheckout={handleOpenCheckout} />

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
