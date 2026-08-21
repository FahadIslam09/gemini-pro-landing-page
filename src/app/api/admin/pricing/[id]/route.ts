import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
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
    const plan = await prisma.planPricing.findUnique({
      where: { id },
    });

    if (!plan) {
      return NextResponse.json({ success: false, message: "Plan not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, plan });
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

    const plan = await prisma.planPricing.findUnique({
      where: { id },
    });

    if (!plan) {
      return NextResponse.json({ success: false, message: "Plan not found" }, { status: 404 });
    }

    const updated = await prisma.planPricing.update({
      where: { id },
      data: {
        name: body.name !== undefined ? String(body.name).trim() : plan.name,
        price: body.price !== undefined ? Number(body.price) : plan.price,
        originalPrice: body.originalPrice !== undefined ? Number(body.originalPrice) : plan.originalPrice,
        discountPercent: body.discountPercent !== undefined ? Number(body.discountPercent) : plan.discountPercent,
        monthlyBreakdown: body.monthlyBreakdown !== undefined ? String(body.monthlyBreakdown) : plan.monthlyBreakdown,
        badge: body.badge !== undefined ? String(body.badge) : plan.badge,
        badgeColor: body.badgeColor !== undefined ? String(body.badgeColor) : plan.badgeColor,
        description: body.description !== undefined ? String(body.description) : plan.description,
        accountTypeTitle: body.accountTypeTitle !== undefined ? String(body.accountTypeTitle) : plan.accountTypeTitle,
        accountTypeSubtitle: body.accountTypeSubtitle !== undefined ? String(body.accountTypeSubtitle) : plan.accountTypeSubtitle,
        accountTypeStyle: body.accountTypeStyle !== undefined ? String(body.accountTypeStyle) : plan.accountTypeStyle,
        accountTypeIcon: body.accountTypeIcon !== undefined ? String(body.accountTypeIcon) : plan.accountTypeIcon,
        highlights:
          body.highlights !== undefined
            ? Array.isArray(body.highlights)
              ? JSON.stringify(body.highlights)
              : String(body.highlights)
            : plan.highlights,
        durationPerk: body.durationPerk !== undefined ? String(body.durationPerk) : plan.durationPerk,
        popular: body.popular !== undefined ? Boolean(body.popular) : plan.popular,
        isActive: body.isActive !== undefined ? Boolean(body.isActive) : plan.isActive,
        orderIndex: body.orderIndex !== undefined ? Number(body.orderIndex) : plan.orderIndex,
      },
    });

    await prisma.adminLog.create({
      data: {
        adminId: session.adminId,
        action: "UPDATE_PRICE",
        entity: "plan",
        entityId: id,
        details: `Updated plan ${updated.name} (Price: ৳${updated.price})`,
      },
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
    await prisma.planPricing.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "প্ল্যানটি মুছে ফেলা হয়েছে",
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
