import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { verifyVaultAccess } from "@/lib/vault-auth";

// GET all activation links with stats and filters
export async function GET(req: NextRequest) {
  try {
    // Strict Vault Authorization Guard
    const vaultAuth = await verifyVaultAccess(req);
    if (!vaultAuth.authorized) {
      return NextResponse.json(
        { success: false, message: vaultAuth.error || "Vault access unauthorized" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const statusFilter = searchParams.get("status"); // 'available' | 'assigned' | 'sent' | 'used' | 'all'
    const search = searchParams.get("search")?.trim().toLowerCase() || "";

    // 1. Fetch Stats Aggregation
    const { data: allLinksSummary, error: summaryError } = await supabase
      .from("activation_links")
      .select("status");

    if (summaryError) {
      if (summaryError.message?.includes("schema cache") || summaryError.message?.includes("does not exist")) {
        return NextResponse.json({
          success: true,
          tableNotCreated: true,
          stats: { total: 0, available: 0, assigned: 0, sent: 0, used: 0 },
          links: [],
          message: "Database table 'activation_links' needs to be created in Supabase.",
        });
      }
      throw summaryError;
    }

    const stats = {
      total: allLinksSummary?.length || 0,
      available: allLinksSummary?.filter((l) => l.status === "available").length || 0,
      assigned: allLinksSummary?.filter((l) => l.status === "assigned").length || 0,
      sent: allLinksSummary?.filter((l) => l.status === "sent").length || 0,
      used: allLinksSummary?.filter((l) => l.status === "used").length || 0,
    };

    // 2. Fetch Filtered List
    let query = supabase
      .from("activation_links")
      .select("*")
      .order("created_at", { ascending: false });

    if (statusFilter && statusFilter !== "all") {
      if (statusFilter === "history") {
        query = query.in("status", ["assigned", "sent", "used"]);
      } else {
        query = query.eq("status", statusFilter);
      }
    }

    if (search) {
      query = query.or(
        `customer_email.ilike.%${search}%,order_number.ilike.%${search}%,customer_name.ilike.%${search}%,link.ilike.%${search}%,batch_label.ilike.%${search}%`
      );
    }

    const { data: links, error } = await query;
    if (error) throw error;

    return NextResponse.json({
      success: true,
      stats,
      links: links || [],
    });
  } catch (error: any) {
    console.error("Fetch activation links error:", error);
    const msg = error.message?.includes("schema cache")
      ? "⚠️ Database table 'activation_links' needs to be created in Supabase."
      : error.message;
    return NextResponse.json({ success: false, message: msg }, { status: 500 });
  }
}

// POST: Add Single or Bulk Activation Links
export async function POST(req: NextRequest) {
  try {
    // Strict Vault Authorization Guard
    const vaultAuth = await verifyVaultAccess(req);
    if (!vaultAuth.authorized) {
      return NextResponse.json(
        { success: false, message: vaultAuth.error || "Vault access unauthorized" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { link, links, batchLabel = "Manual Upload", planKey = "18m" } = body;

    // Normalize raw links into array
    let rawLinksList: string[] = [];

    if (Array.isArray(links)) {
      rawLinksList = links;
    } else if (typeof links === "string") {
      rawLinksList = links.split(/[\r\n,]+/);
    } else if (link && typeof link === "string") {
      rawLinksList = [link];
    }

    // Clean, trim, and normalize valid links (auto-prepend https:// if missing)
    const cleanedLinks = Array.from(
      new Set(
        rawLinksList
          .map((l) => l.trim())
          .filter((l) => l.length > 3)
          .map((l) => {
            if (l.startsWith("http://") || l.startsWith("https://")) return l;
            return `https://${l}`;
          })
      )
    );

    if (cleanedLinks.length === 0) {
      return NextResponse.json(
        { success: false, message: "কোনো সঠিক অ্যাক্টিভেশন লিংক পাওয়া যায়নি।" },
        { status: 400 }
      );
    }

    // Fetch existing links in database to avoid duplicates
    const { data: existingRecords, error: fetchErr } = await supabase
      .from("activation_links")
      .select("link")
      .in("link", cleanedLinks);

    if (fetchErr) {
      if (fetchErr.message?.includes("schema cache") || fetchErr.message?.includes("does not exist")) {
        return NextResponse.json(
          {
            success: false,
            message: "⚠️ Supabase ডাটাবেজে 'activation_links' টেবিলটি এখনও তৈরি করা হয়নি। অনুগ্রহ করে Supabase SQL Editor-এ স্ক্রিপ্ট রান করুন।",
          },
          { status: 500 }
        );
      }
      throw fetchErr;
    }

    const existingSet = new Set((existingRecords || []).map((r) => r.link));
    const newLinksToInsert = cleanedLinks
      .filter((l) => !existingSet.has(l))
      .map((l) => ({
        link: l,
        plan_key: planKey,
        status: "available",
        batch_label: batchLabel.trim() || "Batch Upload",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }));

    if (newLinksToInsert.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: `প্রদত্ত সমস্ত লিংক (${cleanedLinks.length}টি) ইতিমধ্যেই ডাটাবেজে রয়েছে (ডুপ্লিকেট)।`,
        },
        { status: 400 }
      );
    }

    const { error: insertErr } = await supabase
      .from("activation_links")
      .insert(newLinksToInsert);

    if (insertErr) {
      if (insertErr.message?.includes("schema cache") || insertErr.message?.includes("does not exist")) {
        return NextResponse.json(
          {
            success: false,
            message: "⚠️ Supabase ডাটাবেজে 'activation_links' টেবিলটি এখনও তৈরি করা হয়নি। অনুগ্রহ করে Supabase SQL Editor-এ স্ক্রিপ্ট রান করুন।",
          },
          { status: 500 }
        );
      }
      throw insertErr;
    }

    return NextResponse.json({
      success: true,
      message: `সফলভাবে ${newLinksToInsert.length}টি নতুন অ্যাক্টিভেশন লিংক যুক্ত করা হয়েছে।` +
        (existingSet.size > 0 ? ` (${existingSet.size}টি ডুপ্লিকেট বাদ দেওয়া হয়েছে)` : ""),
      insertedCount: newLinksToInsert.length,
      skippedCount: existingSet.size,
    });
  } catch (error: any) {
    console.error("Insert activation links error:", error);
    const msg = error.message?.includes("schema cache")
      ? "⚠️ Supabase ডাটাবেজে 'activation_links' টেবিলটি তৈরি করা হয়নি।"
      : error.message;
    return NextResponse.json({ success: false, message: msg }, { status: 500 });
  }
}
