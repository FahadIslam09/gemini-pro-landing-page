import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import {
  verifyPassword,
  generateAdminToken,
  setAdminSessionCookie,
  checkLoginRateLimit,
  resetLoginRateLimit,
} from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
    const rateLimit = checkLoginRateLimit(ip);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          message: `অনেকবার ভুল চেষ্টার কারণে এক্সেস স্থগিত। অনুগ্রহ করে ${rateLimit.waitSeconds} সেকেন্ড পর চেষ্টা করুন।`,
        },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: "ব্যবহারকারীর নাম ও পাসওয়ার্ড প্রয়োজন" },
        { status: 400 }
      );
    }

    // Lookup admin by username or email in Supabase
    const { data: admin, error } = await supabase
      .from("admins")
      .select("*")
      .or(`username.eq.${username.trim()},email.eq.${username.trim().toLowerCase()}`)
      .maybeSingle();

    if (error || !admin) {
      return NextResponse.json(
        { success: false, message: "ভুল ইউজারনেম বা পাসওয়ার্ড" },
        { status: 401 }
      );
    }

    const isMatch = await verifyPassword(password, admin.password_hash);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, message: "ভুল ইউজারনেম বা পাসওয়ার্ড" },
        { status: 401 }
      );
    }

    // Reset rate limit counter on success
    resetLoginRateLimit(ip);

    // Generate JWT token
    const token = await generateAdminToken({
      adminId: admin.id,
      username: admin.username,
      email: admin.email,
      role: admin.role || "super_admin",
    });

    // Set HTTP-Only session cookie
    await setAdminSessionCookie(token);

    // Log admin login activity in Supabase
    await supabase.from("admin_logs").insert({
      admin_id: admin.id,
      action: "LOGIN",
      entity: "admin",
      entity_id: admin.id,
      details: "Admin successfully logged in",
      ip_address: ip,
    });

    return NextResponse.json({
      success: true,
      message: "সফলভাবে লগইন হয়েছে",
      admin: {
        id: admin.id,
        username: admin.username,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error: any) {
    console.error("Admin login error:", error);
    return NextResponse.json(
      { success: false, message: "সার্ভার ত্রুটি: অনুগ্রহ করে পুনরায় চেষ্টা করুন" },
      { status: 500 }
    );
  }
}
