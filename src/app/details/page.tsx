"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { type SelectedSymptom } from "../_components/BodyModel";
import ProgressBar from "../_components/ProgressBar";
import { type SymptomAnalysisResponse, type ConditionPrediction } from "~/utils/ai";

// Define question types for different conditions
interface Question {
  id: string;
  text: string;
  type: "select" | "radio" | "checkbox";
  options: string[];
}

interface ConditionQuestions {
  id: string;
  name: string;
  questions: Question[];
}

// Define the structure for form answers
interface FormAnswers {
  [questionId: string]: string | string[];
}

// Generate questions based on condition
function generateQuestionsForCondition(condition: ConditionPrediction): Question[] {
  const questions: Question[] = [];
  
  // Duration question for all conditions
  questions.push({
    id: `${condition.id}-duration`,
    text: `How long have you been experiencing symptoms related to ${condition.name}?`,
    type: "select",
    options: ["Less than 24 hours", "1-3 days", "4-7 days", "More than a week"]
  });
  
  // Severity question for all conditions
  questions.push({
    id: `${condition.id}-severity`,
    text: "How would you rate the severity of your symptoms?",
    type: "radio",
    options: ["Mild - noticeable but doesn't affect daily activities", 
              "Moderate - affects some daily activities", 
              "Severe - significantly affects daily activities"]
  });
  
  // Add treatment history question
  questions.push({
    id: `${condition.id}-treatment`,
    text: "Have you tried any treatments or medications for these symptoms?",
    type: "checkbox",
    options: ["Over-the-counter medications", "Prescription medications", 
              "Home remedies", "Rest", "Hydration", "None of the above"]
  });
  
  // Add a condition-specific question if riskFactors are available
  if (condition.riskFactors && condition.riskFactors.length > 0) {
    questions.push({
      id: `${condition.id}-riskfactors`,
      text: "Do any of these risk factors apply to you?",
      type: "checkbox",
      options: condition.riskFactors.map(factor => factor)
    });
  }
  
  return questions;
}

export default function DetailsPage() {
  const router = useRouter();
  const [selectedSymptoms, setSelectedSymptoms] = useState<SelectedSymptom[]>([]);
  const [relevantConditions, setRelevantConditions] = useState<ConditionQuestions[]>([]);
  const [formAnswers, setFormAnswers] = useState<FormAnswers>({});
  const [isLoading, setIsLoading] = useState(true);
  
  // Load saved symptoms and analysis results, then generate condition questions
  useEffect(() => {
    const savedSymptoms = localStorage.getItem("selectedSymptoms");
    const savedAnalysisResult = localStorage.getItem("analysisResult");
    
    if (savedSymptoms) {
      try {
        const parsedSymptoms = JSON.parse(savedSymptoms) as SelectedSymptom[];
        setSelectedSymptoms(parsedSymptoms);
      } catch (e) {
        console.error("Error parsing saved symptoms:", e);
      }
    }
    
    if (savedAnalysisResult) {
      try {
        const analysisResult = JSON.parse(savedAnalysisResult) as SymptomAnalysisResponse;
        
        // Generate conditions with questions from AI results
        // Take up to top 3 conditions with highest confidence
        const topConditions = analysisResult.conditions
          .sort((a, b) => b.confidence - a.confidence)
          .slice(0, 3);
        
        const conditionsWithQuestions: ConditionQuestions[] = topConditions.map(condition => ({
          id: condition.id,
          name: condition.name,
          questions: generateQuestionsForCondition(condition)
        }));
        
        setRelevantConditions(conditionsWithQuestions);
      } catch (e) {
        console.error("Error parsing analysis result:", e);
      }
    } else {
      // If no analysis result exists, redirect to conditions page
      router.push("/conditions");
    }
    
    setIsLoading(false);
  }, [router]);

  // Navigate back to conditions page if no conditions were selected
  useEffect(() => {
    if (!isLoading && relevantConditions.length === 0) {
      router.push("/conditions");
    }
  }, [isLoading, relevantConditions, router]);

  // Handle form changes
  const handleInputChange = (questionId: string, value: string | string[]) => {
    setFormAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  // Handle checkbox changes
  const handleCheckboxChange = (questionId: string, option: string, checked: boolean) => {
    setFormAnswers(prev => {
      const currentValues = (prev[questionId] as string[]) || [];
      
      if (checked) {
        return {
          ...prev,
          [questionId]: [...currentValues, option]
        };
      } else {
        return {
          ...prev,
          [questionId]: currentValues.filter(item => item !== option)
        };
      }
    });
  };

  // Navigation handlers
  const handlePrevious = () => {
    router.push("/conditions");
  };

  const handleContinue = () => {
    // Save answers to localStorage before proceeding
    localStorage.setItem("detailAnswers", JSON.stringify(formAnswers));
    router.push("/treatment");
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl">
        <div className="flex h-64 items-center justify-center">
          <div className="text-center">
            <svg 
              className="mx-auto h-12 w-12 animate-spin text-teal-500" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24"
            >
              <circle 
                className="opacity-25" 
                cx="12" 
                cy="12" 
                r="10" 
                stroke="currentColor" 
                strokeWidth="4"
              ></circle>
              <path 
                className="opacity-75" 
                fill="currentColor" 
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <p className="mt-4 text-gray-600 dark:text-gray-300">
              Loading detailed questions...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="mb-2 text-center text-3xl font-bold text-gray-800 dark:text-white">
        SymptoTrack
      </h1>
      <p className="mb-8 text-center text-xl text-teal-600 dark:text-teal-400">
        Track your symptoms, understand your health
      </p>
      
      <div className="rounded-lg bg-white p-8 shadow-lg dark:bg-gray-800">
        <ProgressBar currentStep="details" />
        
        <div className="min-h-[500px] py-8">
          <h2 className="mb-4 text-xl font-semibold text-gray-800 dark:text-white">
            Additional Details
          </h2>
          
          <p className="mb-6 text-gray-600 dark:text-gray-300">
            Based on your symptoms, we'd like to ask a few more questions to better understand your situation.
            This information will help provide more tailored guidance in the next step.
          </p>
          
          <div className="space-y-8">
            {relevantConditions.map(condition => (
              <div key={condition.id} className="rounded-lg border border-gray-200 p-6 dark:border-gray-700">
                <h3 className="mb-4 text-lg font-semibold text-teal-600 dark:text-teal-400">
                  {condition.name} Questions
                </h3>
                
                <div className="space-y-6">
                  {condition.questions.map(question => (
                    <div key={question.id} className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        {question.text}
                      </label>
                      
                      {question.type === 'select' && (
                        <select
                          value={formAnswers[question.id] as string || ''}
                          onChange={(e) => handleInputChange(question.id, e.target.value)}
                          className="w-full rounded-md border border-gray-300 bg-white p-2 text-gray-800 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-teal-400 dark:focus:ring-teal-400"
                        >
                          <option value="">-- Please select --</option>
                          {question.options.map(option => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      )}
                      
                      {question.type === 'radio' && (
                        <div className="space-y-2">
                          {question.options.map(option => (
                            <div key={option} className="flex items-center">
                              <input
                                type="radio"
                                id={`${question.id}-${option}`}
                                name={question.id}
                                value={option}
                                checked={formAnswers[question.id] === option}
                                onChange={() => handleInputChange(question.id, option)}
                                className="h-4 w-4 border-gray-300 text-teal-600 focus:ring-teal-500 dark:border-gray-600 dark:text-teal-400 dark:focus:ring-teal-400"
                              />
                              <label
                                htmlFor={`${question.id}-${option}`}
                                className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                              >
                                {option}
                              </label>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {question.type === 'checkbox' && (
                        <div className="space-y-2">
                          {question.options.map(option => (
                            <div key={option} className="flex items-center">
                              <input
                                type="checkbox"
                                id={`${question.id}-${option}`}
                                value={option}
                                checked={Array.isArray(formAnswers[question.id]) && 
                                  (formAnswers[question.id] as string[])?.includes(option)}
                                onChange={(e) => handleCheckboxChange(question.id, option, e.target.checked)}
                                className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500 dark:border-gray-600 dark:text-teal-400 dark:focus:ring-teal-400"
                              />
                              <label
                                htmlFor={`${question.id}-${option}`}
                                className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                              >
                                {option}
                              </label>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-8 flex justify-between">
          <button
            onClick={handlePrevious}
            className="flex items-center rounded-lg bg-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
          >
            <svg
              className="mr-2 h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Previous
          </button>
          
          <button
            onClick={handleContinue}
            className="flex items-center rounded-lg bg-teal-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-teal-600 dark:bg-teal-600 dark:hover:bg-teal-700"
          >
            Continue
            <svg
              className="ml-2 h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
} 