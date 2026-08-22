import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getAdminSession } from "@/lib/auth";
import { sendOrderActivationEmail } from "@/lib/email";

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
    const { data: order, error } = await supabase
      .from("orders")
      .select("*, buyer:buyers(*)")
      .eq("id", id)
      .maybeSingle();

    if (error || !order) {
      return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 });
    }

    const formatted = {
      id: order.id,
      orderNumber: order.order_number,
      planKey: order.plan_key,
      planName: order.plan_name,
      amount: Number(order.amount),
      paymentMethod: order.payment_method,
      paymentStatus: order.payment_status,
      orderStatus: order.order_status,
      trxId: order.trx_id,
      payerPhone: order.payer_phone,
      targetEmail: order.target_email,
      customerName: order.customer_name,
      customerPhone: order.customer_phone,
      notes: order.notes,
      metadata: order.metadata,
      activationLink: order.metadata?.activationLink || null,
      completedAt: order.metadata?.completedAt || null,
      createdAt: order.created_at,
      updatedAt: order.updated_at,
      buyerId: order.buyer_id,
      buyer: order.buyer,
    };

    return NextResponse.json({ success: true, order: formatted });
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

    const { data: order, error: findError } = await supabase
      .from("orders")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (findError || !order) {
      return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 });
    }

    const updatePayload: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    let isOrderCompletion = false;

    // Handle "Complete Order" action with activation link delivery
    if (body.action === "complete" || body.activationLink) {
      const link = String(body.activationLink || "").trim();
      if (!link) {
        return NextResponse.json(
          { success: false, message: "অনুগ্রহ করে কাস্টমারের অ্যাক্টিভেশন লিংক দিন" },
          { status: 400 }
        );
      }

      isOrderCompletion = true;
      updatePayload.order_status = "completed";
      updatePayload.payment_status = "paid";
      updatePayload.metadata = {
        ...(order.metadata || {}),
        activationLink: link,
        completedAt: new Date().toISOString(),
      };
      updatePayload.notes = body.notes || order.notes || `Activation Link: ${link}`;

      // Send Activation Email to Customer
      await sendOrderActivationEmail({
        to: order.target_email,
        customerName: order.customer_name || "Valued Customer",
        orderNumber: order.order_number,
        planName: order.plan_name,
        activationLink: link,
      }).catch((emailErr) => {
        console.error("Failed to send activation email:", emailErr);
      });
    } else {
      if (body.orderStatus !== undefined) updatePayload.order_status = String(body.orderStatus);
      if (body.paymentStatus !== undefined) updatePayload.payment_status = String(body.paymentStatus);
      if (body.notes !== undefined) updatePayload.notes = String(body.notes);
      if (body.trxId !== undefined) updatePayload.trx_id = String(body.trxId).trim();
    }

    const { data: updated, error: updateError } = await supabase
      .from("orders")
      .update(updatePayload)
      .eq("id", id)
      .select("*, buyer:buyers(*)")
      .single();

    if (updateError) throw updateError;

    // Update Buyer status to active if completed
    if (isOrderCompletion && order.target_email) {
      await supabase
        .from("buyers")
        .update({
          status: "active",
          current_plan: order.plan_name,
          updated_at: new Date().toISOString(),
        })
        .eq("email", order.target_email.toLowerCase());
    }

    await supabase.from("admin_logs").insert({
      admin_id: session.adminId,
      action: isOrderCompletion ? "COMPLETE_ORDER" : "UPDATE_ORDER",
      entity: "order",
      entity_id: id,
      details: isOrderCompletion
        ? `Completed order ${order.order_number} and emailed activation link to ${order.target_email}`
        : `Updated order ${order.order_number} status to ${updated.order_status}`,
    });

    const formatted = {
      id: updated.id,
      orderNumber: updated.order_number,
      planKey: updated.plan_key,
      planName: updated.plan_name,
      amount: Number(updated.amount),
      paymentMethod: updated.payment_method,
      paymentStatus: updated.payment_status,
      orderStatus: updated.order_status,
      trxId: updated.trx_id,
      payerPhone: updated.payer_phone,
      targetEmail: updated.target_email,
      customerName: updated.customer_name,
      customerPhone: updated.customer_phone,
      notes: updated.notes,
      metadata: updated.metadata,
      activationLink: updated.metadata?.activationLink || null,
      completedAt: updated.metadata?.completedAt || null,
      buyer: updated.buyer,
    };

    return NextResponse.json({
      success: true,
      order: formatted,
      message: isOrderCompletion
        ? `অর্ডার ${order.order_number} সফলভাবে সম্পন্ন হয়েছে এবং গ্রাহককে অ্যাক্টিভেশন লিংক পাঠানো হয়েছে!`
        : `অর্ডার ${order.order_number} আপডেট করা হয়েছে`,
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
    const { data: order } = await supabase.from("orders").select("order_number").eq("id", id).maybeSingle();

    const { error } = await supabase.from("orders").delete().eq("id", id);
    if (error) throw error;

    await supabase.from("admin_logs").insert({
      admin_id: session.adminId,
      action: "DELETE_ORDER",
      entity: "order",
      entity_id: id,
      details: `Deleted order ${order?.order_number || id}`,
    });

    return NextResponse.json({
      success: true,
      message: `অর্ডার ${order?.order_number || ""} মুছে ফেলা হয়েছে`,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
