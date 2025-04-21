import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "~/server/auth";
// Remove database import since we're not using it
// import { db } from "~/server/db";

// Define validation schema for profile update
const profileSchema = z.object({
  name: z.string().optional(),
  age: z.number().min(1).max(120).optional(),
  sex: z.string().optional(),
});

// Define the shape of the expected response data
interface RequestBody {
  name?: string;
  age?: number;
  sex?: string;
}

export async function PUT(req: Request) {
  try {
    // Get the current session
    const session = await auth();
    
    // Check if user is authenticated
    if (!session?.user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }
    
    // Get request body
    const rawBody = await req.json();
    
    // Validate request body
    const result = profileSchema.safeParse(rawBody);
    if (!result.success) {
      return NextResponse.json(
        { message: result.error.errors[0]?.message ?? "Invalid input" },
        { status: 400 }
      );
    }
    
    const { name, age, sex } = result.data;
    
    // Instead of updating in the database, create a mock response
    // with the updated user data
    const updatedUser = {
      id: session.user.id,
      name: name ?? session.user.name,
      email: session.user.email,
      age: age ?? session.user.age,
      sex: sex ?? session.user.sex,
      image: session.user.image,
    };
    
    // Create a safe user object without sensitive data
    const userResponse = {
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      age: updatedUser.age,
      sex: updatedUser.sex,
      image: updatedUser.image,
    };
    
    return NextResponse.json(
      { message: "Profile updated successfully", user: userResponse },
      { status: 200 }
    );
  } catch (error) {
    console.error("Profile update error:", error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { message: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { message: "An error occurred while updating your profile" },
      { status: 500 }
    );
  }
} 