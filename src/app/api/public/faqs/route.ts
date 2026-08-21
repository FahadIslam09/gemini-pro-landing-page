import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const faqs = await prisma.faq.findMany({
      where: { isActive: true },
      orderBy: { orderIndex: "asc" },
    });

    return NextResponse.json({
      success: true,
      faqs,
    });
  } catch (error: any) {
    console.error("Public FAQs API error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
