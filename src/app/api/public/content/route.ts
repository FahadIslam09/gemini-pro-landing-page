import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { data: contents, error } = await supabase
      .from("site_content")
      .select("*");

    const map: Record<string, any> = {};
    if (contents && contents.length > 0) {
      contents.forEach((c: any) => {
        let parsed = {};
        try {
          parsed = c.content ? JSON.parse(c.content) : {};
        } catch {
          parsed = c.content;
        }
        map[c.section_key] = {
          title: c.title,
          subtitle: c.subtitle,
          content: parsed,
        };
      });
    }

    return NextResponse.json({
      success: true,
      contents: map,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
