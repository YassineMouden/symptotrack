"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { type SelectedSymptom } from "../_components/BodyModel";
import ProgressBar from "../_components/ProgressBar";
import { analyzeSymptoms, sortConditionsBySeverity, type ApiError } from "~/services/symptomAnalysisService";
import { type ConditionPrediction, type SymptomAnalysisResponse } from "~/utils/ai";
import SummaryPanel from "../_components/SummaryPanel";
import ConditionCard from "../_components/ConditionCard";
import ConditionDetails from "../_components/ConditionDetails";
import ConditionsFilter, { 
  type SortOption, 
  type FilterOption 
} from "../_components/ConditionsFilter";

interface UserInfo {
  age?: number;
  sex?: "male" | "female" | "other";
}

// Map body part IDs to more readable names
const bodyPartNames: Record<string, string> = {
  head: "Head",
  left_shoulder: "Left Shoulder",
  right_shoulder: "Right Shoulder",
  chest: "Chest",
  left_arm: "Left Arm",
  right_arm: "Right Arm",
  stomach: "Stomach",
  left_leg: "Left Leg",
  right_leg: "Right Leg",
  left_hand: "Left Hand",
  right_hand: "Right Hand",
  left_foot: "Left Foot",
  right_foot: "Right Foot",
  general: "General"
};

export default function ConditionsPage() {
  const router = useRouter();
  const [selectedSymptoms, setSelectedSymptoms] = useState<SelectedSymptom[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [analysisResult, setAnalysisResult] = useState<SymptomAnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedConditionId, setSelectedConditionId] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<SortOption>("confidence");
  const [filterOption, setFilterOption] = useState<FilterOption>("all");
  const [userInfo, setUserInfo] = useState<UserInfo>({});
  
  // Load saved user info and symptoms from localStorage and analyze
  useEffect(() => {
    // Load user info
    const savedUserInfo = localStorage.getItem("userInfo");
    if (savedUserInfo) {
      try {
        const parsedUserInfo = JSON.parse(savedUserInfo) as UserInfo;
        setUserInfo(parsedUserInfo);
      } catch (e) {
        console.error("Error parsing user info:", e);
      }
    }
    
    // Load symptoms
    const savedSymptoms = localStorage.getItem("selectedSymptoms");
    
    if (!savedSymptoms) {
      setIsLoading(false);
      return;
    }
    
    try {
      const parsedSymptoms = JSON.parse(savedSymptoms) as SelectedSymptom[];
      setSelectedSymptoms(parsedSymptoms);
      
      // Only analyze if we have symptoms
      if (parsedSymptoms.length > 0) {
        void fetchAnalysis(parsedSymptoms);
      } else {
        setIsLoading(false);
      }
    } catch (e) {
      console.error("Error parsing saved symptoms:", e);
      setError("Error loading saved symptoms. Please go back and try again.");
      setIsLoading(false);
    }
  }, []);
  
  // Function to fetch analysis from the API
  const fetchAnalysis = async (symptoms: SelectedSymptom[]) => {
    try {
      const result = await analyzeSymptoms(symptoms);
      setAnalysisResult(result);
      
      // Store the results in localStorage for other pages to use
      localStorage.setItem("analysisResult", JSON.stringify(result));
      
      setIsLoading(false);
    } catch (e) {
      console.error("Error analyzing symptoms:", e);
      
      let errorMessage = "Error analyzing symptoms. Please try again later.";
      if (e instanceof Error) {
        errorMessage = e.message;
      }
      
      setError(errorMessage);
      setIsLoading(false);
    }
  };
  
  // Navigate back to symptoms page if no symptoms were selected
  useEffect(() => {
    if (!isLoading && selectedSymptoms.length === 0) {
      router.push("/symptoms");
    }
  }, [isLoading, selectedSymptoms, router]);

  // Navigation handlers
  const handlePrevious = () => {
    router.push("/symptoms");
  };

  const handleContinue = () => {
    router.push("/details");
  };

  // Helper function to retry analysis
  const handleRetry = () => {
    setIsLoading(true);
    setError(null);
    void fetchAnalysis(selectedSymptoms);
  };
  
  // Handle edit symptoms
  const handleEditSymptoms = () => {
    router.push("/symptoms");
  };
  
  // Handle start over
  const handleStartOver = () => {
    // Clear localStorage and redirect to home
    localStorage.removeItem("selectedSymptoms");
    router.push("/");
  };
  
  // Get the selected condition details
  const selectedCondition = useMemo(() => {
    if (!selectedConditionId || !analysisResult) return null;
    return analysisResult.conditions.find(c => c.id === selectedConditionId) ?? null;
  }, [selectedConditionId, analysisResult]);
  
  // Handle opening condition details
  const handleViewConditionDetails = (conditionId: string) => {
    setSelectedConditionId(conditionId);
  };
  
  // Handle closing condition details
  const handleCloseConditionDetails = () => {
    setSelectedConditionId(null);
  };
  
  // Filter and sort conditions
  const filteredAndSortedConditions = useMemo(() => {
    if (!analysisResult) return [];
    
    // First, filter the conditions
    let filtered = [...analysisResult.conditions];
    
    if (filterOption === "serious") {
      filtered = filtered.filter(c => c.isSevere);
    } else if (filterOption === "common") {
      filtered = filtered.filter(c => c.confidence >= 0.5);
    }
    
    // Then sort the conditions
    if (sortOption === "confidence") {
      return sortConditionsBySeverity(filtered);
    } else if (sortOption === "severity") {
      return filtered.sort((a, b) => {
        // Sort by severity first, then confidence
        if (a.isSevere && !b.isSevere) return -1;
        if (!a.isSevere && b.isSevere) return 1;
        return b.confidence - a.confidence;
      });
    } else if (sortOption === "alphabetical") {
      return filtered.sort((a, b) => a.name.localeCompare(b.name));
    }
    
    return filtered;
  }, [analysisResult, sortOption, filterOption]);
  
  // Check if we need to show the "more input needed" banner
  const showMoreInputNeeded = useMemo(() => {
    if (!analysisResult || !selectedSymptoms) return false;
    
    // Show the banner if we have fewer than 3 symptoms or low confidence scores
    const hasLowConfidence = analysisResult.conditions.every(c => c.confidence < 0.5);
    return selectedSymptoms.length < 3 || hasLowConfidence;
  }, [analysisResult, selectedSymptoms]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8">
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
              Analyzing your symptoms...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Display error if there is one
  if (error) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="mb-2 text-center text-3xl font-bold text-gray-800 dark:text-white">
          SymptoTrack
        </h1>
        <p className="mb-8 text-center text-xl text-teal-600 dark:text-teal-400">
          Track your symptoms, understand your health
        </p>
        
        <div className="rounded-lg bg-white p-8 shadow-lg dark:bg-gray-800">
          <ProgressBar currentStep="conditions" />
          
          <div className="my-8 rounded-md bg-red-50 p-6 text-center dark:bg-red-900/30">
            <svg 
              className="mx-auto h-12 w-12 text-red-500 dark:text-red-400" 
              fill="none" 
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
              />
            </svg>
            <h2 className="mt-2 text-xl font-semibold text-red-800 dark:text-red-300">
              Analysis Error
            </h2>
            <p className="mt-2 text-red-700 dark:text-red-200">
              {error}
            </p>
            <div className="mt-4">
              <button
                onClick={handleRetry}
                className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800"
              >
                Try Again
              </button>
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
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-2 text-center text-3xl font-bold text-gray-800 dark:text-white">
        SymptoTrack
      </h1>
      <p className="mb-8 text-center text-xl text-teal-600 dark:text-teal-400">
        Track your symptoms, understand your health
      </p>
      
      <div className="rounded-lg bg-white p-8 shadow-lg dark:bg-gray-800">
        <ProgressBar currentStep="conditions" />
        
        <div className="min-h-[500px] py-8">
          <h2 className="mb-6 text-xl font-semibold text-gray-800 dark:text-white">
            Potential Conditions
          </h2>
          
          {showMoreInputNeeded && (
            <div className="mb-6 rounded-md bg-yellow-50 p-4 text-sm text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200">
              <div className="flex">
                <svg 
                  className="mr-3 h-5 w-5 flex-shrink-0 text-yellow-500 dark:text-yellow-400" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                  />
                </svg>
                <div>
                  <p className="font-medium">
                    More information may improve results
                  </p>
                  <p className="mt-1">
                    Adding more symptoms or details about your condition can help provide more accurate results.
                    Click "Edit Symptoms" to add more information.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <div className="mb-6 rounded-md bg-blue-50 p-4 text-sm text-blue-800 dark:bg-blue-950 dark:text-blue-300">
            <p className="font-medium">
              <strong>Medical Disclaimer:</strong> {analysisResult?.disclaimer ?? "This analysis is based on your reported symptoms and should not be considered a medical diagnosis. Always consult with a healthcare professional."}
            </p>
          </div>
          
          {/* Main content grid */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* Left sidebar - Summary panel */}
            <div className="md:col-span-1">
              <SummaryPanel 
                userInfo={userInfo}
                selectedSymptoms={selectedSymptoms}
                onEditSymptoms={handleEditSymptoms}
                onStartOver={handleStartOver}
              />
            </div>
            
            {/* Main content - Conditions list */}
            <div className="md:col-span-2">
              {analysisResult?.generalAdvice && (
                <div className="mb-6 rounded-md bg-gray-50 p-4 text-gray-700 dark:bg-gray-700/50 dark:text-gray-300">
                  <h3 className="mb-1 font-medium">General Advice</h3>
                  <p>{analysisResult.generalAdvice}</p>
                </div>
              )}
              
              {/* Filter and sort controls */}
              <ConditionsFilter 
                sortOption={sortOption}
                filterOption={filterOption}
                onChangeSortOption={setSortOption}
                onChangeFilterOption={setFilterOption}
                totalConditions={analysisResult?.conditions.length ?? 0}
                filteredCount={filteredAndSortedConditions.length}
              />
              
              {/* Conditions list */}
              <div className="space-y-4">
                {filteredAndSortedConditions.length > 0 ? (
                  filteredAndSortedConditions.map(condition => (
                    <ConditionCard 
                      key={condition.id}
                      condition={condition}
                      onViewDetails={handleViewConditionDetails}
                    />
                  ))
                ) : (
                  <div className="flex h-40 items-center justify-center rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
                    <p className="text-center text-gray-500 dark:text-gray-400">
                      No matching conditions found. Try adjusting your filter settings.
                    </p>
                  </div>
                )}
              </div>
            </div>
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
      
      {/* Condition details modal */}
      <ConditionDetails 
        condition={selectedCondition}
        isOpen={selectedConditionId !== null}
        onClose={handleCloseConditionDetails}
      />
    </div>
  );
} 