import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
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
    const { data: buyer, error } = await supabase
      .from("buyers")
      .select("*, orders(*)")
      .eq("id", id)
      .maybeSingle();

    if (error || !buyer) {
      return NextResponse.json({ success: false, message: "Buyer not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      buyer: {
        id: buyer.id,
        name: buyer.name,
        email: buyer.email,
        phone: buyer.phone,
        totalOrders: buyer.total_orders,
        totalSpent: Number(buyer.total_spent),
        currentPlan: buyer.current_plan,
        status: buyer.status,
        notes: buyer.notes,
        createdAt: buyer.created_at,
        orders: buyer.orders,
      },
    });
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

    const { data: buyer, error: findError } = await supabase
      .from("buyers")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (findError || !buyer) {
      return NextResponse.json({ success: false, message: "Buyer not found" }, { status: 404 });
    }

    const updatePayload: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    if (body.name !== undefined) updatePayload.name = String(body.name).trim();
    if (body.phone !== undefined) updatePayload.phone = String(body.phone).trim();
    if (body.status !== undefined) updatePayload.status = String(body.status);
    if (body.notes !== undefined) updatePayload.notes = String(body.notes);
    if (body.currentPlan !== undefined) updatePayload.current_plan = String(body.currentPlan);

    const { data: updated, error: updateError } = await supabase
      .from("buyers")
      .update(updatePayload)
      .eq("id", id)
      .select()
      .single();

    if (updateError) throw updateError;

    await supabase.from("admin_logs").insert({
      admin_id: session.adminId,
      action: "UPDATE_BUYER",
      entity: "buyer",
      entity_id: id,
      details: `Updated customer ${updated.name}`,
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

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { data: buyer } = await supabase.from("buyers").select("name, email").eq("id", id).maybeSingle();

    const { error } = await supabase.from("buyers").delete().eq("id", id);
    if (error) throw error;

    await supabase.from("admin_logs").insert({
      admin_id: session.adminId,
      action: "DELETE_BUYER",
      entity: "buyer",
      entity_id: id,
      details: `Deleted customer ${buyer?.name || ""} (${buyer?.email || ""})`,
    });

    return NextResponse.json({
      success: true,
      message: "গ্রাহকের তথ্য মুছে ফেলা হয়েছে",
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
