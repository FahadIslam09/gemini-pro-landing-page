import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getAdminSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { data: plans, error } = await supabase
      .from("plan_pricing")
      .select("*")
      .order("order_index", { ascending: true });

    if (error) throw error;

    const formattedPlans = (plans || []).map((p: any) => ({
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
      createdAt: p.created_at,
      updatedAt: p.updated_at,
    }));

    return NextResponse.json({ success: true, plans: formattedPlans });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      planKey,
      name,
      price,
      originalPrice = 0,
      discountPercent = 0,
      monthlyBreakdown,
      badge = "",
      badgeColor = "bg-gray-100 text-gray-800 border-gray-200",
      description = "",
      accountTypeTitle = "",
      accountTypeSubtitle = "",
      accountTypeStyle = "",
      accountTypeIcon = "ShieldCheck",
      highlights = [],
      durationPerk = "",
      popular = false,
      isActive = true,
      orderIndex = 0,
    } = body;

    if (!planKey || !name || price === undefined) {
      return NextResponse.json(
        { success: false, message: "প্ল্যান কী, নাম ও মূল্য আবশ্যক" },
        { status: 400 }
      );
    }

    const payload = {
      plan_key: planKey.trim(),
      name: name.trim(),
      price: Number(price),
      original_price: Number(originalPrice),
      discount_percent: Number(discountPercent),
      monthly_breakdown: monthlyBreakdown || `৳${price} / মাস`,
      badge,
      badge_color: badgeColor,
      description,
      account_type_title: accountTypeTitle,
      account_type_subtitle: accountTypeSubtitle,
      account_type_style: accountTypeStyle,
      account_type_icon: accountTypeIcon,
      highlights: Array.isArray(highlights) ? JSON.stringify(highlights) : String(highlights),
      duration_perk: durationPerk,
      popular: Boolean(popular),
      is_active: Boolean(isActive),
      order_index: Number(orderIndex),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data: plan, error } = await supabase
      .from("plan_pricing")
      .insert(payload)
      .select()
      .single();

    if (error) throw error;

    await supabase.from("admin_logs").insert({
      admin_id: session.adminId,
      action: "CREATE_PLAN",
      entity: "plan",
      entity_id: plan.id,
      details: `Created new plan ${plan.name} (৳${plan.price})`,
    });

    return NextResponse.json({ success: true, plan, message: "নতুন সাবস্ক্রিপশন প্ল্যান তৈরি হয়েছে" });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
