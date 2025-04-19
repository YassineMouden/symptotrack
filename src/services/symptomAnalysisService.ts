import { type SelectedSymptom } from "~/app/_components/BodyModel";
import { type ConditionPrediction, type SymptomAnalysisResponse } from "~/utils/ai";

// Error class for API errors
export class ApiError extends Error {
  status: number;
  
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = "ApiError";
  }
}

// Function to analyze symptoms via the API
export async function analyzeSymptoms(
  symptoms: SelectedSymptom[]
): Promise<SymptomAnalysisResponse> {
  try {
    // Call the API
    const response = await fetch("/api/analyze-symptoms", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ symptoms }),
    });

    // Check for API errors
    if (!response.ok) {
      const errorData = await response.json() as { error?: string };
      throw new ApiError(
        errorData.error ?? "An error occurred while analyzing symptoms",
        response.status
      );
    }

    // Parse the response
    const data = await response.json() as SymptomAnalysisResponse;
    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    
    // Convert other errors to ApiError
    console.error("Error analyzing symptoms:", error);
    throw new ApiError(
      error instanceof Error ? error.message : "An unexpected error occurred",
      500
    );
  }
}

// Helper function to get severity score for sorting
export function getSeverityScore(condition: ConditionPrediction): number {
  // Higher confidence and isSevere should rank higher
  return (condition.isSevere ? 1 : 0) + condition.confidence;
}

// Sort conditions by severity and confidence
export function sortConditionsBySeverity(
  conditions: ConditionPrediction[]
): ConditionPrediction[] {
  return [...conditions].sort((a, b) => getSeverityScore(b) - getSeverityScore(a));
} 