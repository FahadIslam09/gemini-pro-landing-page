import { NextRequest, NextResponse } from "next/server";
import {
  verifyVaultPassword,
  generateVaultToken,
  setVaultSessionCookie,
  clearVaultSessionCookie,
  isVaultUnlocked,
  checkVaultRateLimit,
  resetVaultRateLimit,
} from "@/lib/vault-auth";
import { getAdminSession } from "@/lib/auth";

// Check if Vault is unlocked
export async function GET() {
  try {
    const adminSession = await getAdminSession();
    if (!adminSession) {
      return NextResponse.json({ success: false, unlocked: false, message: "Admin login required" }, { status: 401 });
    }

    const unlocked = await isVaultUnlocked();
    return NextResponse.json({ success: true, unlocked });
  } catch (error: any) {
    return NextResponse.json({ success: false, unlocked: false, message: error.message }, { status: 500 });
  }
}

// Unlock Vault with Master Password
export async function POST(req: NextRequest) {
  try {
    const adminSession = await getAdminSession();
    if (!adminSession) {
      return NextResponse.json({ success: false, message: "Admin login required first" }, { status: 401 });
    }

    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "127.0.0.1";
    const rateLimit = checkVaultRateLimit(ip);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          message: `অনেকবার ভুল চেষ্টার কারণে ভল্ট লক স্থগিত। অনুগ্রহ করে ${rateLimit.waitSeconds} সেকেন্ড পর চেষ্টা করুন।`,
        },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { password } = body;

    if (!password) {
      return NextResponse.json({ success: false, message: "ভল্ট পাসওয়ার্ড লিখুন" }, { status: 400 });
    }

    const isMatch = await verifyVaultPassword(password);
    if (!isMatch) {
      return NextResponse.json({ success: false, message: "ভুল ভল্ট পাসওয়ার্ড! প্রবেশাধিকার প্রত্যাখ্যাত।" }, { status: 401 });
    }

    // Reset rate limit on success
    resetVaultRateLimit(ip);

    // Generate and set vault session token
    const vaultToken = await generateVaultToken(adminSession.adminId);
    await setVaultSessionCookie(vaultToken);

    return NextResponse.json({
      success: true,
      message: "ভল্ট সফলভাবে আনলক হয়েছে।",
    });
  } catch (error: any) {
    console.error("Vault unlock error:", error);
    return NextResponse.json({ success: false, message: "সার্ভার সমস্যা: পুনরায় চেষ্টা করুন" }, { status: 500 });
  }
}

// Lock Vault (Clear Session)
export async function DELETE() {
  try {
    await clearVaultSessionCookie();
    return NextResponse.json({ success: true, message: "ভল্ট লক করা হয়েছে।" });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
