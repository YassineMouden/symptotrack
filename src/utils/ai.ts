import { type SelectedSymptom } from "~/app/_components/BodyModel";
import { env } from "~/env";
import OpenAI from "openai";
import { cache } from "~/utils/cache";

// Initialize OpenAI client with proper typing
/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-argument */
const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
});

// Rate limiting settings
const MAX_CALLS_PER_MINUTE = 10;
const callTimestamps: number[] = [];

// Types for API response
export interface ConditionPrediction {
  id: string;
  name: string;
  description: string;
  confidence: number;
  symptoms: string[];
  possibleCauses: string[];
  treatmentApproaches: string[];
  riskFactors: string[];
  whenToSeeDoctor: string[];
  isSevere: boolean;
}

export interface SymptomAnalysisResponse {
  conditions: ConditionPrediction[];
  disclaimer: string;
  generalAdvice: string;
}

// Simple rate limiting function
function checkRateLimit(): boolean {
  const now = Date.now();
  const oneMinuteAgo = now - 60 * 1000;
  
  // Remove timestamps older than 1 minute
  while (callTimestamps.length > 0 && callTimestamps[0]! < oneMinuteAgo) {
    callTimestamps.shift();
  }
  
  // Check if we're under the limit
  if (callTimestamps.length < MAX_CALLS_PER_MINUTE) {
    callTimestamps.push(now);
    return true;
  }
  
  return false;
}

// Generate a cache key based on the symptoms
function generateCacheKey(symptoms: SelectedSymptom[]): string {
  // Sort symptoms to ensure consistent cache keys regardless of order
  const sortedSymptoms = [...symptoms].sort((a, b) => {
    if (a.bodyPartId !== b.bodyPartId) {
      return a.bodyPartId.localeCompare(b.bodyPartId);
    }
    if (a.id !== b.id) {
      return a.id.localeCompare(b.id);
    }
    return a.severity.localeCompare(b.severity);
  });
  
  // Create a string representation
  return JSON.stringify(sortedSymptoms);
}

// Create the prompt for the AI model
function createSystemPrompt(): string {
  return `You are an AI medical assistant designed to analyze symptoms and suggest potential medical conditions. 
Follow these guidelines:

1. ACCURACY: Provide medically accurate information based on current medical knowledge.
2. NO DIAGNOSIS: Make it clear you are not providing a diagnosis and the user should consult a healthcare professional.
3. CONFIDENCE LEVELS: Assign confidence scores (0.0-1.0) to conditions based on symptom matching.
4. SYMPTOM CORRELATION: Match symptoms to possible conditions with attention to severity, location, and duration.
5. COMPLETENESS: Include a range of potential conditions from common to less common when appropriate.
6. EVIDENCE-BASED: Base your responses on established medical literature and clinical guidelines.
7. SEVERITY AWARENESS: Flag potentially serious conditions that require urgent medical attention.
8. LANGUAGE: Use clear, concise medical terminology with plain language explanations.

Your response should be structured in JSON format with the following fields:
- conditions: an array of potential conditions, each with:
  - id: a unique identifier (kebab-case)
  - name: the medical name of the condition
  - description: a brief description of what the condition is
  - confidence: a number between 0 and 1 indicating confidence level
  - symptoms: an array of common symptoms associated with this condition
  - possibleCauses: an array of possible causes or risk factors
  - treatmentApproaches: an array of common treatment approaches
  - riskFactors: factors that may increase risk
  - whenToSeeDoctor: specific symptoms or situations that should prompt medical attention
  - isSevere: boolean indicating if the condition potentially requires urgent care
- disclaimer: a medical disclaimer about the limitations of this analysis
- generalAdvice: general health advice based on the symptoms

Return valid JSON only.`;
}

// Create the user prompt based on the symptoms
function createUserPrompt(symptoms: SelectedSymptom[]): string {
  // Group symptoms by body part
  const symptomsByBodyPart: Record<string, { name: string; severity: string }[]> = {};
  
  symptoms.forEach(symptom => {
    symptomsByBodyPart[symptom.bodyPartId] ??= [];
    
    symptomsByBodyPart[symptom.bodyPartId]!.push({
      name: symptom.name,
      severity: symptom.severity
    });
  });
  
  // Create a formatted list
  let promptText = "I'm experiencing the following symptoms:\n\n";
  
  Object.entries(symptomsByBodyPart).forEach(([bodyPart, bodyPartSymptoms]) => {
    promptText += `In my ${bodyPart.replace(/_/g, " ")}:\n`;
    
    bodyPartSymptoms.forEach(symptom => {
      promptText += `- ${symptom.name} (${symptom.severity} severity)\n`;
    });
    
    promptText += "\n";
  });
  
  promptText += "Based on these symptoms, what potential conditions should I be aware of? Please provide the response in the JSON format specified.";
  
  return promptText;
}

// Main function to analyze symptoms
export async function analyzeSymptoms(
  symptoms: SelectedSymptom[]
): Promise<SymptomAnalysisResponse> {
  // Check if we have a cached response
  const cacheKey = generateCacheKey(symptoms);
  const cachedResponse = cache.get<SymptomAnalysisResponse>(cacheKey);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  // Check rate limit
  if (!checkRateLimit()) {
    throw new Error("Rate limit exceeded. Please try again later.");
  }
  
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        { role: "system", content: createSystemPrompt() },
        { role: "user", content: createUserPrompt(symptoms) }
      ],
      response_format: { type: "json_object" },
      temperature: 0.3, // Lower temperature for more deterministic results
    });
    
    const responseContent = completion.choices[0]?.message.content ?? "";
    
    if (!responseContent) {
      throw new Error("No response from AI model");
    }
    
    // Parse the JSON response
    const parsedResponse = JSON.parse(responseContent) as SymptomAnalysisResponse;
    
    // Store in cache (1 hour expiration)
    cache.set(cacheKey, parsedResponse, 60 * 60);
    
    return parsedResponse;
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    throw new Error("Failed to analyze symptoms. Please try again later.");
  }
} 