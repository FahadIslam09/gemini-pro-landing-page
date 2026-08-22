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
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";

    let query = supabase.from("faqs").select("*").order("order_index", { ascending: true });

    if (category.trim() && category !== "all") {
      query = query.eq("category", category.trim());
    }

    if (search.trim()) {
      query = query.or(`question.ilike.%${search.trim()}%,answer.ilike.%${search.trim()}%`);
    }

    const { data: faqs, error } = await query;
    if (error) throw error;

    const formatted = (faqs || []).map((f: any) => ({
      id: f.id,
      question: f.question,
      answer: f.answer,
      category: f.category,
      orderIndex: f.order_index,
      isActive: f.is_active,
      createdAt: f.created_at,
      updatedAt: f.updated_at,
    }));

    return NextResponse.json({ success: true, faqs: formatted });
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
    const { question, answer, category = "general", orderIndex, isActive = true } = body;

    if (!question || !answer) {
      return NextResponse.json(
        { success: false, message: "প্রশ্ন ও উত্তর উভয় ফিল্ড পূরণ আবশ্যক" },
        { status: 400 }
      );
    }

    const { count } = await supabase.from("faqs").select("*", { count: "exact", head: true });

    const payload = {
      question: question.trim(),
      answer: answer.trim(),
      category: category.trim(),
      order_index: orderIndex !== undefined ? Number(orderIndex) : (count || 0),
      is_active: Boolean(isActive),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data: faq, error } = await supabase
      .from("faqs")
      .insert(payload)
      .select()
      .single();

    if (error) throw error;

    await supabase.from("admin_logs").insert({
      admin_id: session.adminId,
      action: "CREATE_FAQ",
      entity: "faq",
      entity_id: faq.id,
      details: `Added new FAQ: "${faq.question.substring(0, 40)}..."`,
    });

    return NextResponse.json({
      success: true,
      faq,
      message: "নতুন FAQ সফলভাবে যুক্ত হয়েছে",
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
