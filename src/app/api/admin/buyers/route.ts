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
    const status = searchParams.get("status") || "";

    let query = supabase.from("buyers").select("*, orders(*)", { count: "exact" });

    if (status && status !== "all") {
      query = query.eq("status", status);
    }

    if (search.trim()) {
      const q = search.trim();
      query = query.or(`name.ilike.%${q}%,email.ilike.%${q}%,phone.ilike.%${q}%`);
    }

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data: buyers, count, error } = await query
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) throw error;

    const formatted = (buyers || []).map((b: any) => ({
      id: b.id,
      name: b.name,
      email: b.email,
      phone: b.phone,
      totalOrders: b.total_orders || 0,
      totalSpent: Number(b.total_spent || 0),
      currentPlan: b.current_plan,
      status: b.status,
      notes: b.notes,
      createdAt: b.created_at,
      updatedAt: b.updated_at,
      orders: (b.orders || []).map((o: any) => ({
        id: o.id,
        orderNumber: o.order_number,
        planName: o.plan_name,
        amount: Number(o.amount),
        paymentStatus: o.payment_status,
        orderStatus: o.order_status,
        createdAt: o.created_at,
      })),
    }));

    return NextResponse.json({
      success: true,
      buyers: formatted,
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
    const { name, email, phone, currentPlan = "Google AI Pro (১৮ মাস)", status = "active", notes } = body;

    if (!name || !email) {
      return NextResponse.json({ success: false, message: "নাম ও ইমেইল আবশ্যক" }, { status: 400 });
    }

    const { data: existing } = await supabase
      .from("buyers")
      .select("id")
      .eq("email", email.trim().toLowerCase())
      .maybeSingle();

    if (existing) {
      return NextResponse.json({ success: false, message: "এই ইমেইল দিয়ে গ্রাহক ইতিমধ্যে নিবন্ধিত আছে" }, { status: 400 });
    }

    const { data: buyer, error } = await supabase
      .from("buyers")
      .insert({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone ? phone.trim() : "",
        current_plan: currentPlan,
        status,
        notes: notes ? String(notes) : "",
        total_orders: 0,
        total_spent: 0,
      })
      .select()
      .single();

    if (error) throw error;

    await supabase.from("admin_logs").insert({
      admin_id: session.adminId,
      action: "CREATE_BUYER",
      entity: "buyer",
      entity_id: buyer.id,
      details: `Created customer ${buyer.name} (${buyer.email})`,
    });

    return NextResponse.json({
      success: true,
      buyer: {
        id: buyer.id,
        name: buyer.name,
        email: buyer.email,
        phone: buyer.phone,
        totalOrders: 0,
        totalSpent: 0,
      },
      message: "নতুন গ্রাহক সফলভাবে তৈরি হয়েছে",
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
