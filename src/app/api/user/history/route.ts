import { NextResponse } from "next/server";
import { auth } from "~/server/auth";
import { db } from "~/server/db";

export async function GET() {
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
    
    // Get user's tracking sessions
    const trackingSessions = await db.trackingSession.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      include: {
        userSymptoms: {
          include: {
            symptom: true,
          },
        },
        userConditions: {
          include: {
            condition: true,
          },
        },
      },
    });
    
    // Format the data for the frontend
    const history = trackingSessions.map(session => {
      return {
        id: session.id,
        date: session.createdAt,
        completed: session.completed,
        symptoms: session.userSymptoms.map(us => ({
          name: us.symptom.name,
          severity: us.severity,
        })),
        conditions: session.userConditions.map(uc => ({
          name: uc.condition.name,
          confidence: uc.confidenceScore,
        })),
      };
    });
    
    return NextResponse.json({ history });
  } catch (error) {
    console.error("Error fetching user history:", error);
    return NextResponse.json(
      { message: "Error fetching user history" },
      { status: 500 }
    );
  }
} 