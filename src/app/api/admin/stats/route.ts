import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const [
      totalOrders,
      paidOrders,
      activeOrders,
      pendingOrders,
      totalBuyers,
      recentOrders,
      recentBuyers,
      plans,
      allOrders,
    ] = await Promise.all([
      prisma.order.count(),
      prisma.order.findMany({
        where: { paymentStatus: "paid" },
        select: { amount: true, paymentMethod: true, planKey: true, createdAt: true },
      }),
      prisma.order.count({ where: { orderStatus: "active" } }),
      prisma.order.count({ where: { orderStatus: "pending_activation" } }),
      prisma.buyer.count(),
      prisma.order.findMany({
        take: 6,
        orderBy: { createdAt: "desc" },
      }),
      prisma.buyer.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          orders: {
            take: 1,
            orderBy: { createdAt: "desc" },
          },
        },
      }),
      prisma.planPricing.findMany({
        where: { isActive: true },
        select: { planKey: true, name: true, price: true },
      }),
      prisma.order.findMany({
        take: 100,
        orderBy: { createdAt: "desc" },
        select: { planKey: true, paymentMethod: true, amount: true, paymentStatus: true },
      }),
    ]);

    const totalRevenue = paidOrders.reduce((sum, order) => sum + order.amount, 0);

    // Plan distribution
    const planCounts: Record<string, number> = { "1m": 0, "12m": 0, "18m": 0 };
    allOrders.forEach((o) => {
      if (planCounts[o.planKey] !== undefined) {
        planCounts[o.planKey] += 1;
      }
    });

    // Payment methods distribution
    const methodCounts: Record<string, number> = {
      bkash_gateway: 0,
      bkash_manual: 0,
      nagad: 0,
      rocket: 0,
    };
    allOrders.forEach((o) => {
      if (methodCounts[o.paymentMethod] !== undefined) {
        methodCounts[o.paymentMethod] += 1;
      } else {
        methodCounts[o.paymentMethod] = 1;
      }
    });

    return NextResponse.json({
      success: true,
      stats: {
        totalRevenue,
        totalOrders,
        activeSubscriptions: activeOrders,
        pendingActivations: pendingOrders,
        totalBuyers,
      },
      planDistribution: planCounts,
      paymentMethodDistribution: methodCounts,
      recentOrders,
      recentBuyers,
      plans,
    });
  } catch (error: any) {
    console.error("Admin stats error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
