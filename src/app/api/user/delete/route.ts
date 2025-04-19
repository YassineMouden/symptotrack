import { auth } from "~/server/auth";
import { db } from "~/server/db";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getIP } from "~/lib/rate-limit";
import { PrismaClient } from "@prisma/client";

// Define validation schema
const deleteSchema = z.object({
  password: z.string().optional(),
  confirmText: z.literal('DELETE'),
});

export async function DELETE(req: Request) {
  try {
    // Get current session
    const session = await auth();
    
    // Check if user is authenticated
    if (!session?.user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }
    
    // Get the IP for logging purposes
    const ip = getIP(req);
    
    // Get and validate request body
    const rawBody = await req.json() as unknown;
    const result = deleteSchema.safeParse(rawBody);
    
    if (!result.success) {
      return NextResponse.json(
        { message: "Please type DELETE to confirm account deletion" },
        { status: 400 }
      );
    }
    
    // Log deletion request with redacted IP for security/debugging
    console.log(`Account deletion request for user ${session.user.id} from ${ip.substring(0, 3)}***`);
    
    // Delete all user data in proper order to respect database constraints
    await db.$transaction(async (tx) => {
      // Delete all related data
      await tx.passwordReset.deleteMany({
        where: { userId: session.user.id }
      });
      
      await tx.userCondition.deleteMany({
        where: { userId: session.user.id }
      });
      
      await tx.userSymptom.deleteMany({
        where: { userId: session.user.id }
      });
      
      await tx.trackingSession.deleteMany({
        where: { userId: session.user.id }
      });
      
      await tx.post.deleteMany({
        where: { createdById: session.user.id }
      });
      
      await tx.session.deleteMany({
        where: { userId: session.user.id }
      });
      
      await tx.account.deleteMany({
        where: { userId: session.user.id }
      });
      
      // Finally delete the User
      await tx.user.delete({
        where: { id: session.user.id }
      });
    });
    
    return NextResponse.json(
      { message: "Account and all associated data successfully deleted" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Account deletion error:", error);
    
    return NextResponse.json(
      { message: "An error occurred while deleting your account" },
      { status: 500 }
    );
  }
} 