import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession, verifyPassword, hashPassword } from "@/lib/auth";

export async function PUT(req: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { currentPassword, newPassword, name, email } = body;

    const admin = await prisma.admin.findUnique({
      where: { id: session.adminId },
    });

    if (!admin) {
      return NextResponse.json({ success: false, message: "Admin not found" }, { status: 404 });
    }

    // If changing password
    let updatedPasswordHash = admin.passwordHash;
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json(
          { success: false, message: "বর্তমান পাসওয়ার্ড প্রদান আবশ্যক" },
          { status: 400 }
        );
      }

      const isCurrentMatch = await verifyPassword(currentPassword, admin.passwordHash);
      if (!isCurrentMatch) {
        return NextResponse.json(
          { success: false, message: "বর্তমান পাসওয়ার্ড সঠিক নয়" },
          { status: 400 }
        );
      }

      if (newPassword.length < 8) {
        return NextResponse.json(
          { success: false, message: "নতুন পাসওয়ার্ড ন্যূনতম ৮ অক্ষরের হতে হবে" },
          { status: 400 }
        );
      }

      updatedPasswordHash = await hashPassword(newPassword);
    }

    const updatedAdmin = await prisma.admin.update({
      where: { id: session.adminId },
      data: {
        name: name ? name.trim() : admin.name,
        email: email ? email.trim().toLowerCase() : admin.email,
        passwordHash: updatedPasswordHash,
      },
      select: {
        id: true,
        username: true,
        name: true,
        email: true,
        role: true,
      },
    });

    await prisma.adminLog.create({
      data: {
        adminId: session.adminId,
        action: "UPDATE_SETTINGS",
        entity: "admin",
        entityId: session.adminId,
        details: "Admin updated profile / security password",
      },
    });

    return NextResponse.json({
      success: true,
      message: "প্রোফাইল ও নিরাপত্তা সেটিংস সফলভাবে আপডেট হয়েছে",
      admin: updatedAdmin,
    });
  } catch (error: any) {
    console.error("Admin settings update error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
