import { auth } from "~/server/auth";
import { db } from "~/server/db";
import { NextResponse } from "next/server";
import { getIP } from "~/lib/rate-limit";

export async function GET(req: Request) {
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
    
    // Log export request with redacted IP for security/debugging
    console.log(`Data export request for user ${session.user.id} from ${ip.substring(0, 3)}***`);
    
    // Get user data
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true, 
        image: true,
        age: true,
        sex: true,
        // Exclude password for security
      }
    });
    
    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }
    
    // Get user tracking sessions
    const trackingSessions = await db.trackingSession.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      include: {
        userSymptoms: {
          include: {
            symptom: true
          }
        },
        userConditions: {
          include: {
            condition: true
          }
        }
      }
    });
    
    // Get user accounts (OAuth connections)
    const accounts = await db.account.findMany({
      where: { userId: session.user.id },
      select: {
        provider: true,
        providerAccountId: true,
        type: true,
        // Exclude tokens for security
      }
    });
    
    // Structure user data for export
    const exportData = {
      user: {
        ...user,
        accounts: accounts,
      },
      healthData: {
        trackingSessions: trackingSessions,
      },
      exportDate: new Date().toISOString(),
      exportType: "full"
    };
    
    // Set filename for download with date
    const dateString = new Date().toISOString().split('T')[0];
    const filename = `symptotrack-data-${dateString}.json`;
    
    // Return data as downloadable JSON
    return new NextResponse(JSON.stringify(exportData, null, 2), {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="${filename}"`
      }
    });
  } catch (error) {
    console.error("Data export error:", error);
    
    return NextResponse.json(
      { message: "An error occurred while exporting your data" },
      { status: 500 }
    );
  }
} 