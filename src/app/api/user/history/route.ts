import { NextResponse } from "next/server";
import { auth } from "~/server/auth";

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
    
    // Instead of database query, provide mock data
    const mockHistory = [
      {
        id: "1",
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        completed: true,
        symptoms: [
          { name: "Headache", severity: "moderate" },
          { name: "Fatigue", severity: "mild" },
          { name: "Fever", severity: "mild" }
        ],
        conditions: [
          { name: "Common Cold", confidence: 0.85 },
          { name: "Seasonal Allergies", confidence: 0.65 }
        ]
      },
      {
        id: "2",
        date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 14 days ago
        completed: true,
        symptoms: [
          { name: "Sore Throat", severity: "severe" },
          { name: "Cough", severity: "moderate" }
        ],
        conditions: [
          { name: "Strep Throat", confidence: 0.72 },
          { name: "Viral Pharyngitis", confidence: 0.68 }
        ]
      }
    ];
    
    return NextResponse.json({ history: mockHistory });
  } catch (error) {
    console.error("Error fetching user history:", error);
    return NextResponse.json(
      { message: "Error fetching user history" },
      { status: 500 }
    );
  }
} 