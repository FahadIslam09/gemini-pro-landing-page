import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getAdminSession } from "@/lib/auth";

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

    const { data: faq, error: findError } = await supabase
      .from("faqs")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (findError || !faq) {
      return NextResponse.json({ success: false, message: "FAQ not found" }, { status: 404 });
    }

    const updatePayload: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    if (body.question !== undefined) updatePayload.question = String(body.question).trim();
    if (body.answer !== undefined) updatePayload.answer = String(body.answer).trim();
    if (body.category !== undefined) updatePayload.category = String(body.category).trim();
    if (body.isActive !== undefined) updatePayload.is_active = Boolean(body.isActive);
    if (body.orderIndex !== undefined) updatePayload.order_index = Number(body.orderIndex);

    const { data: updated, error: updateError } = await supabase
      .from("faqs")
      .update(updatePayload)
      .eq("id", id)
      .select()
      .single();

    if (updateError) throw updateError;

    await supabase.from("admin_logs").insert({
      admin_id: session.adminId,
      action: "UPDATE_FAQ",
      entity: "faq",
      entity_id: id,
      details: `Updated FAQ "${(updated.question || "").substring(0, 40)}..."`,
    });

    return NextResponse.json({
      success: true,
      faq: {
        id: updated.id,
        question: updated.question,
        answer: updated.answer,
        category: updated.category,
        orderIndex: updated.order_index,
        isActive: updated.is_active,
      },
      message: "FAQ সফলভাবে আপডেট করা হয়েছে",
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
    const { error } = await supabase
      .from("faqs")
      .delete()
      .eq("id", id);

    if (error) throw error;

    await supabase.from("admin_logs").insert({
      admin_id: session.adminId,
      action: "DELETE_FAQ",
      entity: "faq",
      entity_id: id,
      details: "Deleted FAQ",
    });

    return NextResponse.json({
      success: true,
      message: "FAQ সফলভাবে মুছে ফেলা হয়েছে",
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
