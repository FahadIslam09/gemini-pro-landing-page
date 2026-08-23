import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import {
  verifyPassword,
  generateAdminToken,
  setAdminSessionCookie,
  checkLoginRateLimit,
  resetLoginRateLimit,
  hashPassword,
} from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "127.0.0.1";
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

    const cleanUsername = String(username).trim();
    const cleanPassword = String(password);

    const envAdminUser = process.env.ADMIN_USERNAME || "admin";
    const envAdminPass = process.env.ADMIN_PASSWORD || "admin123456";

    // 1. Direct Env / Master Fallback Credentials Check
    if (
      (cleanUsername.toLowerCase() === envAdminUser.toLowerCase() ||
        cleanUsername.toLowerCase() === "admin" ||
        cleanUsername.toLowerCase() === "admin@googleai.neonweb.xyz") &&
      (cleanPassword === envAdminPass || cleanPassword === "admin123456")
    ) {
      resetLoginRateLimit(ip);

      let adminId = "admin-root";

      // Ensure admin row exists in Supabase so logs and foreign keys work
      try {
        const { data: existingAdmin } = await supabase
          .from("admins")
          .select("id")
          .eq("username", "admin")
          .maybeSingle();

        if (existingAdmin) {
          adminId = existingAdmin.id;
        } else {
          const passwordHash = await hashPassword(cleanPassword);
          const { data: insertedAdmin } = await supabase
            .from("admins")
            .insert({
              username: "admin",
              email: "admin@googleai.neonweb.xyz",
              name: "Super Administrator",
              role: "super_admin",
              password_hash: passwordHash,
            })
            .select("id")
            .single();

          if (insertedAdmin) {
            adminId = insertedAdmin.id;
          }
        }
      } catch (err) {
        console.warn("Auto-seeding admin to Supabase failed:", err);
      }

      // Generate JWT Token
      const token = await generateAdminToken({
        adminId,
        username: "admin",
        email: "admin@googleai.neonweb.xyz",
        role: "super_admin",
      });

      // Set Cookie
      await setAdminSessionCookie(token);

      return NextResponse.json({
        success: true,
        message: "সফলভাবে লগইন হয়েছে",
        admin: {
          id: adminId,
          username: "admin",
          name: "Super Administrator",
          email: "admin@googleai.neonweb.xyz",
          role: "super_admin",
        },
      });
    }

    // 2. Lookup other admin users by username or email in Supabase
    const { data: admin, error } = await supabase
      .from("admins")
      .select("*")
      .or(`username.eq.${cleanUsername},email.eq.${cleanUsername.toLowerCase()}`)
      .maybeSingle();

    if (error || !admin) {
      return NextResponse.json(
        { success: false, message: "ভুল ইউজারনেম বা পাসওয়ার্ড" },
        { status: 401 }
      );
    }

    const isMatch = await verifyPassword(cleanPassword, admin.password_hash);
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
    try {
      await supabase.from("admin_logs").insert({
        admin_id: admin.id,
        action: "LOGIN",
        entity: "admin",
        entity_id: admin.id,
        details: "Admin successfully logged in",
        ip_address: ip,
      });
    } catch {
      // ignore logging errors
    }

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
