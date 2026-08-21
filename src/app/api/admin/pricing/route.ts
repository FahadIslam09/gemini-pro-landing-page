import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const plans = await prisma.planPricing.findMany({
      orderBy: { orderIndex: "asc" },
    });

    return NextResponse.json({ success: true, plans });
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

    const plan = await prisma.planPricing.create({
      data: {
        planKey: planKey.trim(),
        name: name.trim(),
        price: Number(price),
        originalPrice: Number(originalPrice),
        discountPercent: Number(discountPercent),
        monthlyBreakdown: monthlyBreakdown || `৳${price} / মাস`,
        badge,
        badgeColor,
        description,
        accountTypeTitle,
        accountTypeSubtitle,
        accountTypeStyle,
        accountTypeIcon,
        highlights: Array.isArray(highlights) ? JSON.stringify(highlights) : String(highlights),
        durationPerk,
        popular: Boolean(popular),
        isActive: Boolean(isActive),
        orderIndex: Number(orderIndex),
      },
    });

    await prisma.adminLog.create({
      data: {
        adminId: session.adminId,
        action: "CREATE_PLAN",
        entity: "plan",
        entityId: plan.id,
        details: `Created new plan ${plan.name} (৳${plan.price})`,
      },
    });

    return NextResponse.json({ success: true, plan, message: "নতুন সাবস্ক্রিপশন প্ল্যান তৈরি হয়েছে" });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
