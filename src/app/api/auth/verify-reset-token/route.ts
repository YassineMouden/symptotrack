import { NextResponse } from "next/server";
import { db } from "~/server/db";
import { z } from "zod";

// Define validation schema for token verification
const tokenSchema = z.object({
  token: z.string().min(1, { message: "Token is required" }),
});

export async function GET(request: Request) {
  try {
    // Get the token from the URL
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");
    
    // Validate token
    const result = tokenSchema.safeParse({ token });
    if (!result.success) {
      return NextResponse.json(
        { message: result.error.errors[0]?.message ?? "Invalid token" },
        { status: 400 }
      );
    }
    
    // Find the token in the database
    const resetToken = await db.passwordReset.findUnique({
      where: { token: result.data.token },
    });
    
    // Check if token exists and is not expired
    if (!resetToken || resetToken.expires < new Date()) {
      return NextResponse.json(
        { message: "Invalid or expired token" },
        { status: 400 }
      );
    }
    
    // Token is valid
    return NextResponse.json(
      { message: "Token is valid", email: resetToken.email },
      { status: 200 }
    );
  } catch (error) {
    console.error("Token verification error:", error);
    
    return NextResponse.json(
      { message: "An error occurred while verifying the token" },
      { status: 500 }
    );
  }
} 