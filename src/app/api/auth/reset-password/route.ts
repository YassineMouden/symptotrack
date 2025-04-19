import { NextResponse } from "next/server";
import { db } from "~/server/db";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { sendEmail, getWelcomeEmailHtml } from "~/lib/email";

// Define validation schema for password reset
const resetPasswordSchema = z.object({
  token: z.string().min(1, { message: "Token is required" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
});

export async function POST(request: Request) {
  try {
    // Get request body and parse it as unknown first for type safety
    const rawBody = await request.json() as unknown;
    
    // Validate request body
    const result = resetPasswordSchema.safeParse(rawBody);
    if (!result.success) {
      return NextResponse.json(
        { message: result.error.errors[0]?.message ?? "Invalid input" },
        { status: 400 }
      );
    }
    
    const { token, password } = result.data;
    
    // Find the token in the database
    const resetToken = await db.passwordReset.findUnique({
      where: { token },
      include: { user: true },
    });
    
    // Check if token exists and is not expired
    if (!resetToken || resetToken.expires < new Date()) {
      return NextResponse.json(
        { message: "Invalid or expired token" },
        { status: 400 }
      );
    }
    
    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Update the user's password
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
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #14b8a6;">Password Changed</h1>
            <p>Hello ${resetToken.user.name ?? "there"},</p>
            <p>Your password for SymptoTrack has been successfully changed.</p>
            <p>If you did not request this change, please contact support immediately.</p>
            <p>Best regards,<br>The SymptoTrack Team</p>
          </div>
        `,
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