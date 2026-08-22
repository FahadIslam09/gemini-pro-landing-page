import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getAdminSession } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { data: plan, error } = await supabase
      .from("plan_pricing")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error || !plan) {
      return NextResponse.json({ success: false, message: "Plan not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      plan: {
        id: plan.id,
        planKey: plan.plan_key,
        name: plan.name,
        price: Number(plan.price),
        originalPrice: Number(plan.original_price || 0),
        discountPercent: Number(plan.discount_percent || 0),
        monthlyBreakdown: plan.monthly_breakdown,
        badge: plan.badge,
        badgeColor: plan.badge_color,
        description: plan.description,
        accountTypeTitle: plan.account_type_title,
        accountTypeSubtitle: plan.account_type_subtitle,
        accountTypeStyle: plan.account_type_style,
        accountTypeIcon: plan.account_type_icon,
        highlights: typeof plan.highlights === "string" ? JSON.parse(plan.highlights) : (plan.highlights || []),
        durationPerk: plan.duration_perk,
        popular: plan.popular,
        isActive: plan.is_active,
        orderIndex: plan.order_index,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();

    const { data: plan, error: findError } = await supabase
      .from("plan_pricing")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (findError || !plan) {
      return NextResponse.json({ success: false, message: "Plan not found" }, { status: 404 });
    }

    const updatePayload: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    if (body.name !== undefined) updatePayload.name = String(body.name).trim();
    if (body.price !== undefined) updatePayload.price = Number(body.price);
    if (body.originalPrice !== undefined) updatePayload.original_price = Number(body.originalPrice);
    if (body.discountPercent !== undefined) updatePayload.discount_percent = Number(body.discountPercent);
    if (body.monthlyBreakdown !== undefined) updatePayload.monthly_breakdown = String(body.monthlyBreakdown);
    if (body.badge !== undefined) updatePayload.badge = String(body.badge);
    if (body.badgeColor !== undefined) updatePayload.badge_color = String(body.badgeColor);
    if (body.description !== undefined) updatePayload.description = String(body.description);
    if (body.accountTypeTitle !== undefined) updatePayload.account_type_title = String(body.accountTypeTitle);
    if (body.accountTypeSubtitle !== undefined) updatePayload.account_type_subtitle = String(body.accountTypeSubtitle);
    if (body.accountTypeStyle !== undefined) updatePayload.account_type_style = String(body.accountTypeStyle);
    if (body.accountTypeIcon !== undefined) updatePayload.account_type_icon = String(body.accountTypeIcon);
    if (body.highlights !== undefined) {
      updatePayload.highlights = Array.isArray(body.highlights) ? JSON.stringify(body.highlights) : String(body.highlights);
    }
    if (body.durationPerk !== undefined) updatePayload.duration_perk = String(body.durationPerk);
    if (body.popular !== undefined) updatePayload.popular = Boolean(body.popular);
    if (body.isActive !== undefined) updatePayload.is_active = Boolean(body.isActive);
    if (body.orderIndex !== undefined) updatePayload.order_index = Number(body.orderIndex);

    const { data: updated, error: updateError } = await supabase
      .from("plan_pricing")
      .update(updatePayload)
      .eq("id", id)
      .select()
      .single();

    if (updateError) throw updateError;

    await supabase.from("admin_logs").insert({
      admin_id: session.adminId,
      action: "UPDATE_PRICE",
      entity: "plan",
      entity_id: id,
      details: `Updated plan ${updated.name} (Price: ৳${updated.price})`,
    });

    return NextResponse.json({
      success: true,
      plan: updated,
      message: `${updated.name} প্ল্যানের তথ্য সফলভাবে আপডেট হয়েছে`,
    });
  } catch (error: any) {
    console.error("Plan update error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { error } = await supabase
      .from("plan_pricing")
      .delete()
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: "প্ল্যানটি মুছে ফেলা হয়েছে",
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
