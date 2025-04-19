import { db } from "~/server/db";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";

// Define validation schema for registration
const registerSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
});

export async function POST(req: Request) {
  try {
    // Get request body
    const body = await req.json();
    
    // Validate request body
    const result = registerSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { message: result.error.errors[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }
    
    const { name, email, password } = result.data;
    
    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email },
    });
    
    if (existingUser) {
      return NextResponse.json(
        { message: "User with this email already exists" },
        { status: 409 }
      );
    }
    
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create the user
    const user = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });
    
    // Remove password from the response
    const { password: _, ...userWithoutPassword } = user;
    
    return NextResponse.json(
      { message: "User created successfully", user: userWithoutPassword },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
} 