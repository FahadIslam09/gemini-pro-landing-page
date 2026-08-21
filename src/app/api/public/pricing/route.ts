import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const plans = await prisma.planPricing.findMany({
      where: { isActive: true },
      orderBy: { orderIndex: "asc" },
    });

    return NextResponse.json({
      success: true,
      plans: plans.map((p) => ({
        ...p,
        highlights: typeof p.highlights === "string" ? JSON.parse(p.highlights) : p.highlights,
      })),
    });
  } catch (error: any) {
    console.error("Public pricing API error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
