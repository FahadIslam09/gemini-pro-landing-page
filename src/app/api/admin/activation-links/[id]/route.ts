import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { verifyVaultAccess } from "@/lib/vault-auth";

// DELETE an activation link
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const vaultAuth = await verifyVaultAccess(req);
    if (!vaultAuth.authorized) {
      return NextResponse.json(
        { success: false, message: vaultAuth.error || "Vault unauthorized" },
        { status: 403 }
      );
    }

    const { id } = await params;

    // Check link status before deleting
    const { data: link, error: fetchErr } = await supabase
      .from("activation_links")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchErr || !link) {
      return NextResponse.json({ success: false, message: "Link not found" }, { status: 404 });
    }

    if (link.status === "sent" || link.status === "used") {
      return NextResponse.json(
        { success: false, message: "গ্রাহককে ইতিমধ্যে পাঠানো বা ব্যবহৃত লিংক মুছে ফেলা যাবে না।" },
        { status: 400 }
      );
    }

    const { error: deleteErr } = await supabase
      .from("activation_links")
      .delete()
      .eq("id", id);

    if (deleteErr) throw deleteErr;

    return NextResponse.json({
      success: true,
      message: "অ্যাক্টিভেশন লিংকটি সফলভাবে মুছে ফেলা হয়েছে।",
    });
  } catch (error: any) {
    console.error("Delete activation link error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// PATCH: Update status, notes, or batch label
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const vaultAuth = await verifyVaultAccess(req);
    if (!vaultAuth.authorized) {
      return NextResponse.json(
        { success: false, message: vaultAuth.error || "Vault unauthorized" },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await req.json();
    const { status, notes, batchLabel } = body;

    const updates: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    if (status) updates.status = status;
    if (notes !== undefined) updates.notes = notes;
    if (batchLabel !== undefined) updates.batch_label = batchLabel;

    const { error } = await supabase
      .from("activation_links")
      .update(updates)
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: "অ্যাক্টিভেশন লিংক আপডেট সম্পন্ন হয়েছে।",
    });
  } catch (error: any) {
    console.error("Update activation link error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
