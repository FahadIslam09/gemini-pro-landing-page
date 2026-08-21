import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

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

    const faq = await prisma.faq.findUnique({
      where: { id },
    });

    if (!faq) {
      return NextResponse.json({ success: false, message: "FAQ not found" }, { status: 404 });
    }

    const updated = await prisma.faq.update({
      where: { id },
      data: {
        question: body.question !== undefined ? String(body.question).trim() : faq.question,
        answer: body.answer !== undefined ? String(body.answer).trim() : faq.answer,
        category: body.category !== undefined ? String(body.category).trim() : faq.category,
        isActive: body.isActive !== undefined ? Boolean(body.isActive) : faq.isActive,
        orderIndex: body.orderIndex !== undefined ? Number(body.orderIndex) : faq.orderIndex,
      },
    });

    await prisma.adminLog.create({
      data: {
        adminId: session.adminId,
        action: "UPDATE_FAQ",
        entity: "faq",
        entityId: id,
        details: `Updated FAQ "${updated.question.substring(0, 40)}..."`,
      },
    });

    return NextResponse.json({
      success: true,
      faq: updated,
      message: "FAQ সফলভাবে আপডেট করা হয়েছে",
    });
  } catch (error: any) {
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
    await prisma.faq.delete({
      where: { id },
    });

    await prisma.adminLog.create({
      data: {
        adminId: session.adminId,
        action: "DELETE_FAQ",
        entity: "faq",
        entityId: id,
        details: "Deleted FAQ",
      },
    });

    return NextResponse.json({
      success: true,
      message: "FAQ সফলভাবে মুছে ফেলা হয়েছে",
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
