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
    const buyer = await prisma.buyer.findUnique({
      where: { id },
      include: {
        orders: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!buyer) {
      return NextResponse.json({ success: false, message: "Buyer not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, buyer });
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

    const buyer = await prisma.buyer.findUnique({
      where: { id },
    });

    if (!buyer) {
      return NextResponse.json({ success: false, message: "Buyer not found" }, { status: 404 });
    }

    const updated = await prisma.buyer.update({
      where: { id },
      data: {
        name: body.name !== undefined ? String(body.name).trim() : buyer.name,
        phone: body.phone !== undefined ? String(body.phone).trim() : buyer.phone,
        status: body.status !== undefined ? String(body.status) : buyer.status,
        notes: body.notes !== undefined ? String(body.notes) : buyer.notes,
      },
    });

    return NextResponse.json({
      success: true,
      buyer: updated,
      message: "গ্রাহকের তথ্য আপডেট হয়েছে",
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
