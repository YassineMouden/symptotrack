import { auth } from "~/server/auth";
// Remove database import
// import { db } from "~/server/db";
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
    
    // Instead of database query, create mock user data
    const userData = {
      user: {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        emailVerified: new Date().toISOString(),
        image: session.user.image,
        age: session.user.age ?? 30,
        sex: session.user.sex ?? "not specified"
      },
      trackingSessions: [
        {
          id: "1",
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          completed: true,
          userSymptoms: [
            { symptom: { name: "Headache" }, severity: "moderate" },
            { symptom: { name: "Fatigue" }, severity: "mild" },
            { symptom: { name: "Fever" }, severity: "mild" }
          ],
          userConditions: [
            { condition: { name: "Common Cold" }, confidenceScore: 0.85 },
            { condition: { name: "Seasonal Allergies" }, confidenceScore: 0.65 }
          ]
        },
        {
          id: "2",
          createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
          completed: true,
          userSymptoms: [
            { symptom: { name: "Sore Throat" }, severity: "severe" },
            { symptom: { name: "Cough" }, severity: "moderate" }
          ],
          userConditions: [
            { condition: { name: "Strep Throat" }, confidenceScore: 0.72 },
            { condition: { name: "Viral Pharyngitis" }, confidenceScore: 0.68 }
          ]
        }
      ],
      accounts: [
        {
          provider: "credentials",
          providerAccountId: "credentials",
          type: "credentials"
        }
      ]
    };
    
    // Return the data in a downloadable format
    const headers = new Headers();
    headers.append('Content-Disposition', 'attachment; filename=symptotrack-data-export.json');
    headers.append('Content-Type', 'application/json');
    
    return new NextResponse(JSON.stringify(userData, null, 2), {
      status: 200,
      headers
    });
  } catch (error) {
    console.error("Data export error:", error);
    
    return NextResponse.json(
      { message: "An error occurred while preparing your data export" },
      { status: 500 }
    );
  }
} 