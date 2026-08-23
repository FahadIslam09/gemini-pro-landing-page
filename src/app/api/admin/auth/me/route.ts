import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getAdminSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { data: admin, error } = await supabase
      .from("admins")
      .select("id, username, email, name, role, created_at")
      .eq("id", session.adminId)
      .maybeSingle();

    if (error || !admin) {
      return NextResponse.json({
        success: true,
        admin: {
          id: session.adminId || "admin-root",
          username: session.username || "admin",
          email: session.email || "admin@googleai.neonweb.xyz",
          name: "Super Administrator",
          role: session.role || "super_admin",
          createdAt: new Date().toISOString(),
        },
      });
    }

    return NextResponse.json({
      success: true,
      admin: {
        id: admin.id,
        username: admin.username,
        email: admin.email,
        name: admin.name,
        role: admin.role,
        createdAt: admin.created_at,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
