import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const contents = await prisma.siteContent.findMany();
    return NextResponse.json({ success: true, contents });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { sectionKey, title, subtitle = "", content = "{}" } = body;

    if (!sectionKey || !title) {
      return NextResponse.json(
        { success: false, message: "সেকশন কী ও শিরোনাম আবশ্যক" },
        { status: 400 }
      );
    }

    const updated = await prisma.siteContent.upsert({
      where: { sectionKey },
      create: {
        sectionKey,
        title,
        subtitle,
        content: typeof content === "object" ? JSON.stringify(content) : String(content),
      },
      update: {
        title,
        subtitle,
        content: typeof content === "object" ? JSON.stringify(content) : String(content),
      },
    });

    await prisma.adminLog.create({
      data: {
        adminId: session.adminId,
        action: "UPDATE_CONTENT",
        entity: "content",
        entityId: sectionKey,
        details: `Updated content for section: ${sectionKey}`,
      },
    });

    return NextResponse.json({
      success: true,
      content: updated,
      message: "কন্টেন্ট সফলভাবে আপডেট হয়েছে",
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
