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
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";

    const where: any = {};
    if (search.trim()) {
      where.OR = [
        { question: { contains: search.trim() } },
        { answer: { contains: search.trim() } },
      ];
    }
    if (category.trim() && category !== "all") {
      where.category = category.trim();
    }

    const faqs = await prisma.faq.findMany({
      where,
      orderBy: { orderIndex: "asc" },
    });

    return NextResponse.json({ success: true, faqs });
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
    const { question, answer, category = "general", orderIndex, isActive = true } = body;

    if (!question || !answer) {
      return NextResponse.json(
        { success: false, message: "প্রশ্ন ও উত্তর উভয় ফিল্ড পূরণ আবশ্যক" },
        { status: 400 }
      );
    }

    const count = await prisma.faq.count();
    const faq = await prisma.faq.create({
      data: {
        question: question.trim(),
        answer: answer.trim(),
        category: category.trim(),
        orderIndex: orderIndex !== undefined ? Number(orderIndex) : count,
        isActive: Boolean(isActive),
      },
    });

    await prisma.adminLog.create({
      data: {
        adminId: session.adminId,
        action: "CREATE_FAQ",
        entity: "faq",
        entityId: faq.id,
        details: `Added new FAQ: "${faq.question.substring(0, 40)}..."`,
      },
    });

    return NextResponse.json({
      success: true,
      faq,
      message: "নতুন FAQ সফলভাবে যুক্ত হয়েছে",
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
