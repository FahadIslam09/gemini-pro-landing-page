import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const FALLBACK_PLANS = [
  {
    id: "1m",
    planKey: "1m",
    name: "১ মাসের ট্রায়াল প্যাক",
    price: 149,
    originalPrice: 299,
    discountPercent: 50,
    monthlyBreakdown: "৳১৪৯ / ১ মাস",
    badge: "বাজেট ফ্রেন্ডলি",
    badgeColor: "zinc",
    description: "Gemini Advanced ও 2TB স্টোরেজ এক্সপ্লোর করার জন্য সেরা ট্রায়াল প্যাক।",
    accountTypeTitle: "পার্সোনাল জিমেইল এক্সেস",
    accountTypeSubtitle: "১০০% নিরাপদ ও ব্যক্তিগত ডাটা",
    accountTypeStyle: "zinc",
    accountTypeIcon: "ShieldCheck",
    highlights: [
      "Gemini Advanced 1.5 Pro & Ultra মডেল এক্সেস",
      "২ টেরাবাইট (2TB) গুগল ওয়ান ক্লাউড স্টোরেজ",
      "Google Docs, Gmail ও Drive-এ ইন্টিগ্রেটেড AI",
      "১ মাসের নিরবচ্ছিন্ন গ্যারান্টিযুক্ত সার্ভিস",
    ],
    durationPerk: "১ মাস আনলিমিটেড এক্সেস",
    popular: false,
    isActive: true,
    orderIndex: 0,
  },
  {
    id: "12m",
    planKey: "12m",
    name: "১২ মাসের অ্যানুয়াল প্যাক",
    price: 399,
    originalPrice: 1499,
    discountPercent: 73,
    monthlyBreakdown: "৳৩৩ / মাস",
    badge: "জনপ্রিয় পছন্দ",
    badgeColor: "blue",
    description: "দীর্ঘমেয়াদে প্রফেশনাল কাজ, রিসার্চ ও কোডিংয়ের জন্য সেরা বাৎসরিক ডিল।",
    accountTypeTitle: "পার্সোনাল জিমেইল এক্সেস",
    accountTypeSubtitle: "সম্পূর্ণ বাৎসরিক ভ্যালিডিটি ও সাপোর্ট",
    accountTypeStyle: "blue",
    accountTypeIcon: "Zap",
    highlights: [
      "Gemini Advanced 1.5 Pro & Ultra ফুল এক্সেস",
      "২০০০ জিবি (2TB) সিকিউর ক্লাউড স্টোরেজ",
      "Docs, Sheets, Slides ও Meet-এ স্মার্ট AI সুবিধা",
      "১২ মাসের ফুল রিপ্লেসমেন্ট ওয়ারেন্টি ও সাপোর্ট",
    ],
    durationPerk: "১২ মাস নিরবচ্ছিন্ন ভ্যালিডিটি",
    popular: false,
    isActive: true,
    orderIndex: 1,
  },
  {
    id: "18m",
    planKey: "18m",
    name: "১৮ মাসের মেগা অফার",
    price: 299,
    originalPrice: 2499,
    discountPercent: 88,
    monthlyBreakdown: "৳১৭ / মাস",
    badge: "সর্বোচ্চ সাশ্রয়ী (Best Value)",
    badgeColor: "purple",
    description: "দেড় বছরের জন্য আনলিমিটেড সুপারপাওয়ার। সবচেয়ে কম খরচে সেরা ভ্যালু!",
    accountTypeTitle: "পার্সোনাল জিমেইল এক্সেস",
    accountTypeSubtitle: "সর্বোচ্চ প্রাইভেসি ও ১৮ মাসের ফুল সাপোর্ট",
    accountTypeStyle: "purple",
    accountTypeIcon: "Sparkles",
    highlights: [
      "সর্বাধুনিক Gemini Advanced 3.1 Pro মডেল এক্সেস",
      "৫ টেরাবাইট (5TB) গুগল ক্লাউড স্টোরেজ",
      "হাই-স্পিড রেসপন্স ও প্রায়োরিটি সার্ভার এক্সেস",
      "১৮ মাসের ফুল রিপ্লেসমেন্ট ওয়ারেন্টি ও ২৪/৭ ভিআইপি সাপোর্ট",
    ],
    durationPerk: "১৮ মাস মেগা ভ্যালিডিটি",
    popular: true,
    isActive: true,
    orderIndex: 2,
  },
];

export async function GET() {
  try {
    const { data: plans, error } = await supabase
      .from("plan_pricing")
      .select("*")
      .eq("is_active", true)
      .order("order_index", { ascending: true });

    if (error || !plans || plans.length === 0) {
      return NextResponse.json(
        { success: true, plans: FALLBACK_PLANS },
        { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } }
      );
    }

    const formattedPlans = plans.map((p: any) => ({
      id: p.id,
      planKey: p.plan_key,
      name: p.name,
      price: Number(p.price),
      originalPrice: Number(p.original_price || 0),
      discountPercent: Number(p.discount_percent || 0),
      monthlyBreakdown: p.monthly_breakdown,
      badge: p.badge,
      badgeColor: p.badge_color,
      description: p.description,
      accountTypeTitle: p.account_type_title,
      accountTypeSubtitle: p.account_type_subtitle,
      accountTypeStyle: p.account_type_style,
      accountTypeIcon: p.account_type_icon,
      highlights: typeof p.highlights === "string" ? JSON.parse(p.highlights) : (p.highlights || []),
      durationPerk: p.duration_perk,
      popular: p.popular,
      isActive: p.is_active,
      orderIndex: p.order_index,
    }));

    return NextResponse.json(
      { success: true, plans: formattedPlans },
      { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } }
    );
  } catch (error: any) {
    console.error("Public pricing API error:", error);
    return NextResponse.json(
      { success: true, plans: FALLBACK_PLANS },
      { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } }
    );
  }
}
