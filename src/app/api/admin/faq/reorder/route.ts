import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export async function PUT(req: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { items } = body; // array of { id: string, orderIndex: number }

    if (!Array.isArray(items)) {
      return NextResponse.json(
        { success: false, message: "Invalid payload" },
        { status: 400 }
      );
    }

    for (const item of items) {
      if (item.id && typeof item.orderIndex === "number") {
        await prisma.faq.update({
          where: { id: item.id },
          data: { orderIndex: item.orderIndex },
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: "FAQ ক্রম সফলভাবে সংরক্ষিত হয়েছে",
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
