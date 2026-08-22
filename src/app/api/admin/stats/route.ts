import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getAdminSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const [
      { count: totalOrders },
      { data: paidOrders },
      { count: activeOrders },
      { count: pendingOrders },
      { count: totalBuyers },
      { data: recentOrders },
      { data: recentBuyers },
      { data: plans },
      { data: allOrders },
    ] = await Promise.all([
      supabase.from("orders").select("*", { count: "exact", head: true }),
      supabase.from("orders").select("amount, payment_method, plan_key, created_at").eq("payment_status", "paid"),
      supabase.from("orders").select("*", { count: "exact", head: true }).in("order_status", ["completed", "active"]),
      supabase.from("orders").select("*", { count: "exact", head: true }).in("order_status", ["processing", "pending_activation", "pending"]),
      supabase.from("buyers").select("*", { count: "exact", head: true }),
      supabase.from("orders").select("*").order("created_at", { ascending: false }).limit(6),
      supabase.from("buyers").select("*, orders(*)").order("created_at", { ascending: false }).limit(5),
      supabase.from("plan_pricing").select("plan_key, name, price").eq("is_active", true),
      supabase.from("orders").select("plan_key, payment_method, amount, payment_status").order("created_at", { ascending: false }).limit(100),
    ]);

    const totalRevenue = (paidOrders || []).reduce((sum, order) => sum + Number(order.amount || 0), 0);

    // Plan distribution
    const planCounts: Record<string, number> = { "1m": 0, "12m": 0, "18m": 0 };
    (allOrders || []).forEach((o: any) => {
      const key = o.plan_key || "18m";
      if (planCounts[key] !== undefined) {
        planCounts[key] += 1;
      }
    });

    // Payment methods distribution
    const methodCounts: Record<string, number> = {
      bkash_gateway: 0,
      bkash_manual: 0,
      nagad: 0,
      rocket: 0,
    };
    (allOrders || []).forEach((o: any) => {
      const method = o.payment_method || "bkash_manual";
      if (methodCounts[method] !== undefined) {
        methodCounts[method] += 1;
      } else {
        methodCounts[method] = 1;
      }
    });

    const formattedRecentOrders = (recentOrders || []).map((o: any) => ({
      id: o.id,
      orderNumber: o.order_number,
      planKey: o.plan_key,
      planName: o.plan_name,
      amount: Number(o.amount),
      paymentMethod: o.payment_method,
      paymentStatus: o.payment_status,
      orderStatus: o.order_status,
      trxId: o.trx_id,
      targetEmail: o.target_email,
      customerName: o.customer_name,
      createdAt: o.created_at,
    }));

    const formattedRecentBuyers = (recentBuyers || []).map((b: any) => ({
      id: b.id,
      name: b.name,
      email: b.email,
      phone: b.phone,
      totalOrders: b.total_orders,
      totalSpent: Number(b.total_spent),
      currentPlan: b.current_plan,
      status: b.status,
      createdAt: b.created_at,
      orders: b.orders || [],
    }));

    const formattedPlans = (plans || []).map((p: any) => ({
      planKey: p.plan_key,
      name: p.name,
      price: Number(p.price),
    }));

    return NextResponse.json({
      success: true,
      stats: {
        totalRevenue,
        totalOrders: totalOrders || 0,
        activeSubscriptions: activeOrders || 0,
        pendingActivations: pendingOrders || 0,
        totalBuyers: totalBuyers || 0,
      },
      planDistribution: planCounts,
      paymentMethodDistribution: methodCounts,
      recentOrders: formattedRecentOrders,
      recentBuyers: formattedRecentBuyers,
      plans: formattedPlans,
    });
  } catch (error: any) {
    console.error("Admin stats error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
