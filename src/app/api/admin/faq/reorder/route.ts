import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getAdminSession } from "@/lib/auth";

export async function PUT(req: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { items } = body; // array of { id: string, orderIndex: number }

    if (!Array.isArray(items)) {
      return NextResponse.json(
        { success: false, message: "Invalid payload" },
        { status: 400 }
      );
    }

    for (const item of items) {
      if (item.id && typeof item.orderIndex === "number") {
        await supabase
          .from("faqs")
          .update({
            order_index: item.orderIndex,
            updated_at: new Date().toISOString(),
          })
          .eq("id", item.id);
      }
    }

    return NextResponse.json({
      success: true,
      message: "FAQ ক্রম সফলভাবে সংরক্ষিত হয়েছে",
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
