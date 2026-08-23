import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getAdminSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(100, Math.max(5, parseInt(searchParams.get("limit") || "15")));
    const search = searchParams.get("search") || "";
    const orderStatus = searchParams.get("orderStatus") || "";
    const paymentStatus = searchParams.get("paymentStatus") || "";
    const paymentMethod = searchParams.get("paymentMethod") || "";
    const planKey = searchParams.get("planKey") || "";

    let query = supabase.from("orders").select("*, buyer:buyers(id, name, email, phone)", { count: "exact" });

    if (orderStatus && orderStatus !== "all") {
      query = query.eq("order_status", orderStatus);
    }
    if (paymentStatus && paymentStatus !== "all") {
      query = query.eq("payment_status", paymentStatus);
    }
    if (paymentMethod && paymentMethod !== "all") {
      query = query.eq("payment_method", paymentMethod);
    }
    if (planKey && planKey !== "all") {
      query = query.eq("plan_key", planKey);
    }
    if (search.trim()) {
      const q = search.trim();
      query = query.or(
        `order_number.ilike.%${q}%,trx_id.ilike.%${q}%,target_email.ilike.%${q}%,customer_name.ilike.%${q}%,customer_phone.ilike.%${q}%`
      );
    }

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data: orders, count, error } = await query
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) throw error;

    const formattedOrders = (orders || []).map((o: any) => ({
      id: o.id,
      orderNumber: o.order_number,
      planKey: o.plan_key,
      planName: o.plan_name,
      amount: Number(o.amount),
      paymentMethod: o.payment_method,
      paymentStatus: o.payment_status,
      orderStatus: o.order_status,
      trxId: o.trx_id,
      payerPhone: o.payer_phone,
      targetEmail: o.target_email,
      customerName: o.customer_name,
      customerPhone: o.customer_phone,
      notes: o.notes,
      metadata: o.metadata,
      createdAt: o.created_at,
      updatedAt: o.updated_at,
      buyerId: o.buyer_id,
      buyer: o.buyer,
    }));

    return NextResponse.json({
      success: true,
      orders: formattedOrders,
      pagination: {
        total: count || 0,
        page,
        limit,
        totalPages: Math.ceil((count || 0) / limit),
      },
    });
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
    const { customerName, targetEmail, customerPhone, planKey = "18m", amount, paymentMethod = "bkash_manual", trxId, orderStatus = "active", notes } = body;

    if (!customerName || !targetEmail) {
      return NextResponse.json({ success: false, message: "গ্রাহকের নাম ও ইমেইল আবশ্যক" }, { status: 400 });
    }

    // Look up plan
    const { data: plan } = await supabase
      .from("plan_pricing")
      .select("*")
      .eq("plan_key", planKey)
      .maybeSingle();

    const finalAmount = amount ? Number(amount) : (plan ? Number(plan.price) : 299);
    const planName = plan ? plan.name : `Google AI Pro (${planKey})`;
    const orderNumber = `#GAI-${Math.floor(10000 + Math.random() * 90000)}`;

    // Upsert Buyer
    const { data: existingBuyer } = await supabase
      .from("buyers")
      .select("*")
      .eq("email", targetEmail.trim().toLowerCase())
      .maybeSingle();

    let buyerId: string | null = null;
    if (existingBuyer) {
      buyerId = existingBuyer.id;
      await supabase
        .from("buyers")
        .update({
          name: customerName.trim(),
          phone: customerPhone?.trim() || existingBuyer.phone,
          total_orders: (existingBuyer.total_orders || 1) + 1,
          total_spent: Number(existingBuyer.total_spent || 0) + finalAmount,
          current_plan: planName,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingBuyer.id);
    } else {
      const { data: newBuyer } = await supabase
        .from("buyers")
        .insert({
          name: customerName.trim(),
          email: targetEmail.trim().toLowerCase(),
          phone: customerPhone?.trim() || "",
          total_orders: 1,
          total_spent: finalAmount,
          current_plan: planName,
          status: "active",
        })
        .select()
        .single();
      if (newBuyer) buyerId = newBuyer.id;
    }

    // Create Order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        order_number: orderNumber,
        plan_key: planKey,
        plan_name: planName,
        amount: finalAmount,
        payment_method: paymentMethod,
        payment_status: "paid",
        order_status: orderStatus,
        trx_id: trxId ? trxId.trim() : `ADM-${Date.now().toString(36).toUpperCase()}`,
        payer_phone: customerPhone ? customerPhone.trim() : "Admin Entry",
        target_email: targetEmail.trim().toLowerCase(),
        customer_name: customerName.trim(),
        customer_phone: customerPhone ? customerPhone.trim() : "N/A",
        buyer_id: buyerId,
        notes: notes ? String(notes) : "Created manually by admin",
      })
      .select()
      .single();

    if (orderError) throw orderError;

    await supabase.from("admin_logs").insert({
      admin_id: session.adminId,
      action: "CREATE_ORDER",
      entity: "order",
      entity_id: order.id,
      details: `Admin created order ${order.order_number} for ${order.customer_name}`,
    });

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        orderNumber: order.order_number,
        planKey: order.plan_key,
        planName: order.plan_name,
        amount: Number(order.amount),
        paymentStatus: order.payment_status,
        orderStatus: order.order_status,
      },
      message: "অর্ডারটি সফলভাবে তৈরি হয়েছে",
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
