import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const contents = await prisma.siteContent.findMany();
    const map: Record<string, any> = {};
    contents.forEach((c) => {
      map[c.sectionKey] = {
        title: c.title,
        subtitle: c.subtitle,
        content: c.content ? JSON.parse(c.content) : {},
      };
    });

    return NextResponse.json({
      success: true,
      contents: map,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
