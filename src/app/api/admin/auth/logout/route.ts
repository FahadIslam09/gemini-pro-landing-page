import { NextResponse } from "next/server";
import { clearAdminSessionCookie } from "@/lib/auth";

export async function POST() {
  await clearAdminSessionCookie();
  return NextResponse.json({
    success: true,
    message: "সফলভাবে লগআউট সম্পন্ন হয়েছে",
  });
}
