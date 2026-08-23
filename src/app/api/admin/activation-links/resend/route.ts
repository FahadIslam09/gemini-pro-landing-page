import { NextRequest, NextResponse } from "next/server";
import { resendActivationLinkEmail } from "@/lib/activation-service";
import { verifyVaultAccess } from "@/lib/vault-auth";

export async function POST(req: NextRequest) {
  try {
    const vaultAuth = await verifyVaultAccess(req);
    if (!vaultAuth.authorized) {
      return NextResponse.json(
        { success: false, message: vaultAuth.error || "Vault unauthorized" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { linkId } = body;

    if (!linkId) {
      return NextResponse.json({ success: false, message: "Link ID required" }, { status: 400 });
    }

    const res = await resendActivationLinkEmail(linkId);
    if (!res.success) {
      return NextResponse.json({ success: false, message: res.error || "Failed to resend activation email" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "গ্রাহকের ইমেইলে অ্যাক্টিভেশন লিংকটি সফলভাবে পুনরায় পাঠানো হয়েছে।",
    });
  } catch (error: any) {
    console.error("Resend activation email error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
