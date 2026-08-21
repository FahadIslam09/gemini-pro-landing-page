"use client";

import React from "react";
import { Menu, ShieldCheck, User } from "lucide-react";

interface AdminHeaderProps {
  onToggleMobileMenu: () => void;
  title?: string;
  subtitle?: string;
  adminName?: string;
}

export default function AdminHeader({
  onToggleMobileMenu,
  title = "Dashboard",
  subtitle = "Manage your platform and business data",
  adminName = "Admin",
}: AdminHeaderProps) {
  return (
    <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3">
        {/* Mobile Hamburger */}
        <button
          type="button"
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
          aria-label="Open sidebar menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Page Title & Breadcrumbs */}
        <div>
          <h1 className="text-base sm:text-lg font-bold text-slate-900 font-outfit tracking-tight leading-tight">
            {title}
          </h1>
          <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Right Header Status */}
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-full text-[11px] font-semibold font-outfit">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>System Healthy</span>
        </div>

        <div className="flex items-center gap-2 pl-3 border-l border-slate-200 text-xs font-semibold text-slate-700 font-outfit">
          <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
            <User className="w-3.5 h-3.5" />
          </div>
          <span className="hidden md:inline">{adminName}</span>
        </div>
      </div>
    </header>
  );
}
