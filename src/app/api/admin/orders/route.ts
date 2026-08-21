import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(100, Math.max(5, parseInt(searchParams.get("limit") || "15")));
    const search = searchParams.get("search") || "";
    const orderStatus = searchParams.get("orderStatus") || "";
    const paymentStatus = searchParams.get("paymentStatus") || "";
    const paymentMethod = searchParams.get("paymentMethod") || "";
    const planKey = searchParams.get("planKey") || "";

    const where: any = {};

    if (search.trim()) {
      const q = search.trim();
      where.OR = [
        { orderNumber: { contains: q } },
        { trxId: { contains: q } },
        { targetEmail: { contains: q } },
        { customerName: { contains: q } },
        { customerPhone: { contains: q } },
      ];
    }

    if (orderStatus && orderStatus !== "all") {
      where.orderStatus = orderStatus;
    }
    if (paymentStatus && paymentStatus !== "all") {
      where.paymentStatus = paymentStatus;
    }
    if (paymentMethod && paymentMethod !== "all") {
      where.paymentMethod = paymentMethod;
    }
    if (planKey && planKey !== "all") {
      where.planKey = planKey;
    }

    const [total, orders] = await Promise.all([
      prisma.order.count({ where }),
      prisma.order.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          buyer: {
            select: { id: true, name: true, email: true, phone: true },
          },
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      orders,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
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
    const { customerName, targetEmail, customerPhone, planKey = "18m", amount, paymentMethod = "bkash_manual", trxId, orderStatus = "active", notes } = body;

    if (!customerName || !targetEmail) {
      return NextResponse.json({ success: false, message: "গ্রাহকের নাম ও ইমেইল আবশ্যক" }, { status: 400 });
    }

    const plan = await prisma.planPricing.findUnique({ where: { planKey } });
    const finalAmount = amount ? Number(amount) : (plan ? plan.price : 499);
    const planName = plan ? plan.name : `Google AI Pro (${planKey})`;
    const orderNumber = `#GAI-${Math.floor(10000 + Math.random() * 90000)}`;

    const buyer = await prisma.buyer.upsert({
      where: { email: targetEmail.trim().toLowerCase() },
      create: {
        name: customerName.trim(),
        email: targetEmail.trim().toLowerCase(),
        phone: customerPhone?.trim(),
        totalOrders: 1,
        totalSpent: finalAmount,
        currentPlan: planName,
        status: "active",
      },
      update: {
        name: customerName.trim(),
        phone: customerPhone?.trim(),
        totalOrders: { increment: 1 },
        totalSpent: { increment: finalAmount },
        currentPlan: planName,
      },
    });

    const order = await prisma.order.create({
      data: {
        orderNumber,
        planKey,
        planName,
        amount: finalAmount,
        paymentMethod,
        paymentStatus: "paid",
        orderStatus,
        trxId: trxId ? trxId.trim() : `ADM-${Date.now().toString(36).toUpperCase()}`,
        payerPhone: customerPhone ? customerPhone.trim() : "Admin Entry",
        targetEmail: targetEmail.trim().toLowerCase(),
        customerName: customerName.trim(),
        customerPhone: customerPhone ? customerPhone.trim() : "01700000000",
        buyerId: buyer.id,
        notes: notes ? String(notes) : "Created manually by admin",
      },
    });

    await prisma.adminLog.create({
      data: {
        adminId: session.adminId,
        action: "CREATE_ORDER",
        entity: "order",
        entityId: order.id,
        details: `Admin created order ${order.orderNumber} for ${order.customerName}`,
      },
    });

    return NextResponse.json({
      success: true,
      order,
      message: "অর্ডারটি সফলভাবে তৈরি হয়েছে",
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
