import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getAdminSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { data: contents, error } = await supabase
      .from("site_content")
      .select("*");

    if (error) throw error;
    return NextResponse.json({ success: true, contents });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { sectionKey, title, subtitle = "", content = "{}" } = body;

    if (!sectionKey || !title) {
      return NextResponse.json(
        { success: false, message: "সেকশন কী ও শিরোনাম আবশ্যক" },
        { status: 400 }
      );
    }

    const payload = {
      section_key: sectionKey,
      title,
      subtitle,
      content: typeof content === "object" ? JSON.stringify(content) : String(content),
      updated_at: new Date().toISOString(),
    };

    const { data: updated, error } = await supabase
      .from("site_content")
      .upsert(payload, { onConflict: "section_key" })
      .select()
      .single();

    if (error) throw error;

    await supabase.from("admin_logs").insert({
      admin_id: session.adminId,
      action: "UPDATE_CONTENT",
      entity: "content",
      entity_id: sectionKey,
      details: `Updated content for section: ${sectionKey}`,
    });

    return NextResponse.json({
      success: true,
      content: updated,
      message: "কন্টেন্ট সফলভাবে আপডেট হয়েছে",
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
