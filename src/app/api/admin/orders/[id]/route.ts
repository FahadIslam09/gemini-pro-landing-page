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
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        buyer: true,
      },
    });

    if (!order) {
      return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, order });
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

    const order = await prisma.order.findUnique({
      where: { id },
    });

    if (!order) {
      return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 });
    }

    const updated = await prisma.order.update({
      where: { id },
      data: {
        orderStatus: body.orderStatus !== undefined ? String(body.orderStatus) : order.orderStatus,
        paymentStatus: body.paymentStatus !== undefined ? String(body.paymentStatus) : order.paymentStatus,
        notes: body.notes !== undefined ? String(body.notes) : order.notes,
        trxId: body.trxId !== undefined ? String(body.trxId).trim() : order.trxId,
      },
      include: {
        buyer: true,
      },
    });

    await prisma.adminLog.create({
      data: {
        adminId: session.adminId,
        action: "UPDATE_ORDER",
        entity: "order",
        entityId: id,
        details: `Updated order ${order.orderNumber} status to ${updated.orderStatus} (Payment: ${updated.paymentStatus})`,
      },
    });

    return NextResponse.json({
      success: true,
      order: updated,
      message: `অর্ডার ${order.orderNumber} সফলভাবে আপডেট করা হয়েছে`,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
