import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export async function POST() {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    // Delete all orders and buyers to start with a fresh clean database
    await prisma.order.deleteMany({});
    await prisma.buyer.deleteMany({});
    await prisma.adminLog.deleteMany({});

    return NextResponse.json({
      success: true,
      message: "ডেমো অর্ডার ও গ্রাহক ডাটা সফলভাবে মুছে ফেলা হয়েছে। ডাটাবেজ এখন সম্পূর্ণ ক্লিন।",
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
