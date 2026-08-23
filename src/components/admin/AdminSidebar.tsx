"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Tag,
  HelpCircle,
  Users,
  CreditCard,
  KeyRound,
  FileText,
  Settings,
  Globe,
  Sparkles,
  LogOut,
  X,
} from "lucide-react";

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  adminName?: string;
  adminRole?: string;
}

export default function AdminSidebar({
  isOpen,
  onClose,
  onLogout,
  adminName = "Administrator",
  adminRole = "super_admin",
}: AdminSidebarProps) {
  const pathname = usePathname();

  const navItems = [
    { name: "Overview", href: "/admin", icon: LayoutDashboard },
    { name: "Pricing Management", href: "/admin/pricing", icon: Tag },
    { name: "FAQ Management", href: "/admin/faq", icon: HelpCircle },
    { name: "Buyer Management", href: "/admin/buyers", icon: Users },
    { name: "Orders & Transactions", href: "/admin/orders", icon: CreditCard },
    { name: "Activation Links 🔒", href: "/admin/activation-links", icon: KeyRound },
    { name: "Website Content", href: "/admin/content", icon: FileText },
    { name: "Settings & Security", href: "/admin/settings", icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Shell */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen w-64 bg-white border-r border-slate-200 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div>
          {/* Brand Header */}
          <div className="h-16 flex items-center justify-between px-6 border-b border-slate-100">
            <Link href="/admin" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-brand-gradient flex items-center justify-center text-white shadow-xs">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <span className="font-outfit font-bold text-sm tracking-tight text-slate-900 block leading-tight">
                  Google AI Pro
                </span>
                <span className="text-[10px] font-semibold text-brand-purple tracking-wide uppercase block">
                  Admin Console
                </span>
              </div>
            </Link>

            {/* Mobile Close */}
            <button
              type="button"
              onClick={onClose}
              className="lg:hidden text-slate-400 hover:text-slate-600 p-1"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3.5 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold font-outfit transition-all ${
                    isActive
                      ? "bg-brand-blue text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400"}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Area with Live Link & Profile */}
        <div className="p-3.5 border-t border-slate-100 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-medium text-slate-600 hover:text-brand-blue hover:bg-slate-50 transition-colors font-outfit"
          >
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-slate-400" />
              <span>Public Website</span>
            </div>
            <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono">
              Live ↗
            </span>
          </Link>

          {/* Profile Card & Logout */}
          <div className="bg-slate-50 rounded-2xl p-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs font-outfit shrink-0">
                {adminName.charAt(0).toUpperCase()}
              </div>
              <div className="truncate">
                <span className="text-xs font-bold text-slate-900 block truncate font-outfit">
                  {adminName}
                </span>
                <span className="text-[10px] text-slate-500 font-medium block truncate capitalize">
                  {adminRole.replace("_", " ")}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onLogout}
              className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-white transition-colors cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
