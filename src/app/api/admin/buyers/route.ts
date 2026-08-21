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
    const status = searchParams.get("status") || "";

    const where: any = {};
    if (search.trim()) {
      const q = search.trim();
      where.OR = [
        { name: { contains: q } },
        { email: { contains: q } },
        { phone: { contains: q } },
      ];
    }
    if (status && status !== "all") {
      where.status = status;
    }

    const [total, buyers] = await Promise.all([
      prisma.buyer.count({ where }),
      prisma.buyer.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          orders: {
            take: 3,
            orderBy: { createdAt: "desc" },
          },
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      buyers,
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
    const { name, email, phone, currentPlan = "Google AI Pro (১৮ মাস)", status = "active", notes } = body;

    if (!name || !email) {
      return NextResponse.json({ success: false, message: "নাম ও ইমেইল আবশ্যক" }, { status: 400 });
    }

    const existing = await prisma.buyer.findUnique({
      where: { email: email.trim().toLowerCase() },
    });

    if (existing) {
      return NextResponse.json({ success: false, message: "এই ইমেইল দিয়ে গ্রাহক ইতিমধ্যে নিবন্ধিত আছে" }, { status: 400 });
    }

    const buyer = await prisma.buyer.create({
      data: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone ? phone.trim() : null,
        currentPlan,
        status,
        notes: notes ? String(notes) : null,
        totalOrders: 0,
        totalSpent: 0,
      },
    });

    await prisma.adminLog.create({
      data: {
        adminId: session.adminId,
        action: "CREATE_BUYER",
        entity: "buyer",
        entityId: buyer.id,
        details: `Created customer ${buyer.name} (${buyer.email})`,
      },
    });

    return NextResponse.json({
      success: true,
      buyer,
      message: "নতুন গ্রাহক সফলভাবে তৈরি হয়েছে",
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
