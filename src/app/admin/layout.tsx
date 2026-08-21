"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [admin, setAdmin] = useState<{ name: string; role: string } | null>(null);

  // If login page, render children directly without dashboard chrome
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (!isLoginPage) {
      fetch("/api/admin/auth/me")
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.admin) {
            setAdmin(data.admin);
          }
        })
        .catch(() => {});
    }
  }, [isLoginPage]);

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/auth/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch {
      router.push("/admin/login");
    }
  };

  if (isLoginPage) {
    return <div className="min-h-screen bg-slate-900 font-outfit">{children}</div>;
  }

  // Determine dynamic title for header based on route
  const getHeaderMeta = () => {
    if (pathname === "/admin") return { title: "Executive Overview", subtitle: "Real-time metrics, revenue, and quick business statistics" };
    if (pathname.startsWith("/admin/pricing")) return { title: "Pricing & Plans", subtitle: "Configure subscription prices, badges, and discounts" };
    if (pathname.startsWith("/admin/faq")) return { title: "FAQ Management", subtitle: "Add, edit, reorder, and publish customer FAQs" };
    if (pathname.startsWith("/admin/buyers")) return { title: "Buyer Management", subtitle: "View customer profiles, contact info, and lifetime value" };
    if (pathname.startsWith("/admin/orders")) return { title: "Orders & Transactions", subtitle: "Monitor bKash gateway and manual payments and activations" };
    if (pathname.startsWith("/admin/content")) return { title: "Website Content", subtitle: "Manage editable public text and promotional banners" };
    if (pathname.startsWith("/admin/settings")) return { title: "Admin Settings", subtitle: "Security profile, credentials, and access configuration" };
    return { title: "Admin Dashboard", subtitle: "Google AI Pro Subscription Platform" };
  };

  const meta = getHeaderMeta();

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex font-bangla">
      {/* Responsive Sidebar */}
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onLogout={handleLogout}
        adminName={admin?.name || "Administrator"}
        adminRole={admin?.role || "super_admin"}
      />

      {/* Main Dashboard Canvas */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen min-w-0">
        <AdminHeader
          onToggleMobileMenu={() => setSidebarOpen(!sidebarOpen)}
          title={meta.title}
          subtitle={meta.subtitle}
          adminName={admin?.name || "Admin"}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
