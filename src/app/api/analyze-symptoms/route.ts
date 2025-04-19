import { NextResponse } from "next/server";
import { analyzeSymptoms } from "~/utils/ai";
import { type SelectedSymptom } from "~/app/_components/BodyModel";

// Rate limiting - track requests by IP
interface RateLimitTracker {
  count: number;
  lastReset: number;
}

const rateLimits = new Map<string, RateLimitTracker>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 5;

// Rate limit check function
function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const tracker = rateLimits.get(ip) ?? { count: 0, lastReset: now };
  
  // Reset counter if window has passed
  if (now - tracker.lastReset > RATE_LIMIT_WINDOW) {
    tracker.count = 1;
    tracker.lastReset = now;
    rateLimits.set(ip, tracker);
    return true;
  }
  
  // Check if limit reached
  if (tracker.count >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }
  
  // Increment counter
  tracker.count += 1;
  rateLimits.set(ip, tracker);
  return true;
}

export async function POST(request: Request) {
  try {
    // Get client IP for rate limiting
    const forwardedFor = request.headers.get("x-forwarded-for");
    const ip = forwardedFor?.split(",")[0] ?? "unknown";
    
    // Check rate limit
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please try again later." },
        { status: 429 }
      );
    }
    
    // Parse request body
    const body = await request.json() as { symptoms?: unknown };
    
    // Validate request
    if (!body.symptoms || !Array.isArray(body.symptoms) || body.symptoms.length === 0) {
      return NextResponse.json(
        { error: "Invalid request. Symptoms array is required." },
        { status: 400 }
      );
    }
    
    // Validate each symptom has required fields
    const symptoms = body.symptoms as SelectedSymptom[];
    const invalidSymptom = symptoms.find(
      (s) => !s.id || !s.name || !s.bodyPartId || !s.severity
    );
    
    if (invalidSymptom) {
      return NextResponse.json(
        { error: "Invalid symptom data. Each symptom must have id, name, bodyPartId, and severity." },
        { status: 400 }
      );
    }
    
    // Call the AI service
    const result = await analyzeSymptoms(symptoms);
    
    // Return the analysis results
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error in analyze-symptoms API:", error);
    
    // Format the error message
    let errorMessage = "An unexpected error occurred";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

// Also handle GET requests with a 405 Method Not Allowed
export async function GET() {
  return NextResponse.json(
    { error: "Method not allowed. Use POST instead." },
    { status: 405 }
  );
} 