"use client";

import React, { useState, useEffect } from "react";
import { ArrowRight, Menu, X, Sparkles } from "lucide-react";

interface HeaderProps {
  onOpenCheckout: (plan?: string) => void;
}

export default function Header({ onOpenCheckout }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "সুবিধা", href: "#features" },
    { label: "কেন AI Pro", href: "#why-pro" },
    { label: "ফিচার তুলনা", href: "#comparison" },
    { label: "প্রাইসিং", href: "#pricing" },
    { label: "পদ্ধতি", href: "#how-it-works" },
    { label: "রিভিউ", href: "#testimonials" },
    { label: "FAQ", href: "#faq" },
  ];

  return (
    <>
      {/* Top Discount Notification Bar */}
      <div className="bg-gradient-to-r from-brand-blue via-brand-indigo to-brand-purple text-white text-xs sm:text-sm py-2 px-4 text-center font-medium shadow-sm relative z-50">
        <div className="max-w-[1180px] mx-auto flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
          <span className="bg-white/20 px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider">
            সীমিত সময়ের অফার
          </span>
          <span>
            🔥 18 মাসের Google AI Pro সাবস্ক্রিপশনে পাচ্ছেন <strong>৮৫% পর্যন্ত ছাড়</strong> — মাত্র ৳499!
          </span>
          <a
            href="#pricing"
            className="underline underline-offset-2 font-semibold hover:text-white/90 transition-colors"
          >
            অফার দেখুন &rarr;
          </a>
        </div>
      </div>

      {/* Main Sticky Header */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? "bg-white/90 backdrop-blur-md border-b border-brand-border/80 shadow-[0_4px_20px_rgba(23,32,51,0.05)] py-3"
            : "bg-brand-surface/80 backdrop-blur-sm border-b border-brand-border/50 py-4"
        }`}
      >
        <div className="max-w-[1180px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2.5 group">
            <div className="relative w-8 h-8 flex items-center justify-center">
              <svg className="w-8 h-8 drop-shadow-sm" viewBox="0 0 32 32" fill="none">
                <defs>
                  <linearGradient id="headerSparkleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3157D5" />
                    <stop offset="50%" stopColor="#5B55D8" />
                    <stop offset="100%" stopColor="#8A4EDB" />
                  </linearGradient>
                </defs>
                <path
                  d="M16 2C16 10 10 16 2 16C10 16 16 22 16 30C16 22 22 16 30 16C22 16 16 10 16 2Z"
                  fill="url(#headerSparkleGrad)"
                />
              </svg>
            </div>
            <span className="text-xl sm:text-2xl font-bold tracking-tight text-brand-dark">
              Google <span className="gradient-text">AI Pro</span>
            </span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-[15px] font-medium text-brand-body hover:text-brand-blue transition-colors relative py-1 group"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-brand-gradient rounded-full transition-all duration-200 group-hover:w-full" />
              </a>
            ))}
          </nav>

          {/* Header Action CTA */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onOpenCheckout()}
              className="hidden sm:inline-flex items-center gap-2 bg-brand-gradient hover:bg-brand-gradient-hover text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-glow hover:shadow-[0_10px_28px_rgba(91,85,216,0.42)] transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>এখনই কিনুন</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Mobile Toggle Hamburger */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-brand-dark hover:bg-gray-100 transition-colors"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-brand-dark/40 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-white shadow-2xl p-6 flex flex-col justify-between z-10 animate-in slide-in-from-right duration-200">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-brand-border">
                <span className="text-lg font-bold text-brand-dark">
                  Google <span className="gradient-text">AI Pro</span>
                </span>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg text-brand-muted hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex flex-col gap-2 py-6">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-base font-semibold text-brand-dark hover:text-brand-blue py-2.5 px-3 rounded-lg hover:bg-brand-surface transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-brand-border">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenCheckout();
                }}
                className="w-full inline-flex items-center justify-center gap-2 bg-brand-gradient text-white text-base font-semibold py-3 px-4 rounded-xl shadow-glow"
              >
                <span>এখনই কিনুন — ৳499</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
