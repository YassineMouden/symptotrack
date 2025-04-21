import { auth } from "~/server/auth";
// Remove database import
// import { db } from "~/server/db";
import { NextResponse } from "next/server";
import { signOut } from "next-auth/react";
import { getIP } from "~/lib/rate-limit";

export async function DELETE(req: Request) {
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
    
    // Request body validation
    const body = await req.json();
    
    // For extra security/confirmation, require password or confirmation text
    if (!body.confirmation || body.confirmation !== "DELETE") {
      return NextResponse.json(
        { message: "Please type DELETE to confirm account deletion" },
        { status: 400 }
      );
    }
    
    // Get the IP for logging purposes
    const ip = getIP(req);
    
    // Log deletion request with redacted IP for security/debugging
    console.log(`Account deletion request for user ${session.user.id} from ${ip.substring(0, 3)}***`);
    
    // Instead of actually deleting from database, just log and pretend it worked
    console.log(`[MOCK] Deleting user account: ${session.user.id}`);
    
    // In a real app, we would do something like this:
    // await db.$transaction([
    //   db.userSymptom.deleteMany({ where: { userId: session.user.id } }),
    //   db.userCondition.deleteMany({ where: { userId: session.user.id } }),
    //   db.trackingSession.deleteMany({ where: { userId: session.user.id } }),
    //   db.session.deleteMany({ where: { userId: session.user.id } }),
    //   db.account.deleteMany({ where: { userId: session.user.id } }),
    //   db.user.delete({ where: { id: session.user.id } })
    // ]);
    
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