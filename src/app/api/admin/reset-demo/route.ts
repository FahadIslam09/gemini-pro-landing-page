import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getAdminSession } from "@/lib/auth";

export async function POST() {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    // Delete all orders, buyers, and logs in Supabase
    await supabase.from("orders").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    await supabase.from("buyers").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    await supabase.from("admin_logs").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    await supabase.from("sms_transactions").delete().neq("id", "00000000-0000-0000-0000-000000000000");

    return NextResponse.json({
      success: true,
      message: "ডেমো অর্ডার ও গ্রাহক ডাটা সফলভাবে মুছে ফেলা হয়েছে। ডাটাবেজ এখন সম্পূর্ণ ক্লিন।",
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
