import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "~/server/db";
import crypto from "crypto";
import { sendEmail, getPasswordResetEmailHtml } from "~/lib/email";

// Define validation schema for password reset
const resetSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
});

export async function POST(req: Request) {
  try {
    // Get request body and parse it as unknown first for type safety
    const rawBody = await req.json() as unknown;
    
    // Validate request body
    const result = resetSchema.safeParse(rawBody);
    if (!result.success) {
      return NextResponse.json(
        { message: result.error.errors[0]?.message ?? "Invalid input" },
        { status: 400 }
      );
    }
    
    const { email } = result.data;
    
    // Check if user exists
    const user = await db.user.findUnique({
      where: { email },
    });
    
    // Do not reveal if user exists
    if (!user) {
      // We still return a 200 to prevent user enumeration
      return NextResponse.json(
        { message: "If an account with that email exists, a password reset link has been sent." },
        { status: 200 }
      );
    }
    
    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const expiry = new Date(Date.now() + 3600000); // 1 hour from now
    
    // Delete any existing reset tokens for this user
    await db.passwordReset.deleteMany({
      where: { userId: user.id },
    });
    
    // Store reset token in database
    await db.passwordReset.create({
      data: {
        token: resetToken,
        email: user.email!,
        expires: expiry,
        userId: user.id,
      },
    });
    
    // Build the reset link
    const baseUrl = process.env.NODE_ENV === "production" 
      ? "https://symptotrack.com" 
      : "http://localhost:3000";
    
    const resetLink = `${baseUrl}/auth/reset-password?token=${resetToken}`;
    
    // Send the password reset email
    await sendEmail({
      to: user.email!,
      subject: "Reset Your SymptoTrack Password",
      html: getPasswordResetEmailHtml(user.name ?? "there", resetLink),
    });
    
    // Log for development purposes
    if (process.env.NODE_ENV !== "production") {
      console.log(`[Password Reset] Token for ${email}: ${resetToken}`);
      console.log(`[Password Reset] Link: ${resetLink}`);
    }
    
    return NextResponse.json(
      { message: "If an account with that email exists, a password reset link has been sent." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Password reset error:", error);
    
    return NextResponse.json(
      { message: "An error occurred while processing your request" },
      { status: 500 }
    );
  }
} 