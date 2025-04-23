import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "~/server/db";
import { sendEmail } from "~/lib/email";
import bcrypt from "bcryptjs";

// Define validation schema for password reset
const resetSchema = z.object({
  token: z.string().min(10),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
});

export async function POST(request: Request) {
  try {
    // Get request body
    const body = await request.json();
    
    // Validate request body
    const result = resetSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { message: result.error.errors[0]?.message ?? "Invalid input" },
        { status: 400 }
      );
    }
    
    const { token, password } = result.data;
    
    // Find reset token in database
    const resetToken = await db.passwordReset.findUnique({
      where: { token },
      include: { user: true },
    });
    
    if (!resetToken) {
      return NextResponse.json(
        { message: "Invalid or expired token" },
        { status: 400 }
      );
    }
    
    // Check if token is expired
    if (resetToken.expires < new Date()) {
      // Delete expired token
      await db.passwordReset.delete({
        where: { id: resetToken.id },
      });
      
      return NextResponse.json(
        { message: "Token has expired. Please request a new password reset link." },
        { status: 400 }
      );
    }
    
    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Update user password
    await db.user.update({
      where: { id: resetToken.userId },
      data: { password: hashedPassword },
    });
    
    // Delete the used token
    await db.passwordReset.delete({
      where: { id: resetToken.id },
    });
    
    // Send password changed notification
    if (resetToken.user.email) {
      await sendEmail({
        to: resetToken.user.email,
        subject: "Your SymptoTrack Password Has Been Changed",
        text: `
Hello ${resetToken.user.name ?? "there"},

Your password for SymptoTrack has been successfully changed.

If you did not request this change, please contact support immediately.

Best regards,
The SymptoTrack Team
        `.trim(),
      });
    }
    
    return NextResponse.json(
      { message: "Password reset successful" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Password reset error:", error);
    
    return NextResponse.json(
      { message: "An error occurred while resetting your password" },
      { status: 500 }
    );
  }
} 