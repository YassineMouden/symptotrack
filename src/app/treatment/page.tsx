"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { type SelectedSymptom } from "../_components/BodyModel";
import ProgressBar from "../_components/ProgressBar";
import { type SymptomAnalysisResponse, type ConditionPrediction } from "~/utils/ai";
import TreatmentCategory from "../_components/TreatmentCategory";
import TreatmentActions from "../_components/TreatmentActions";
import DoctorFinder from "../_components/DoctorFinder";

// Define types for form data
type FormAnswers = Record<string, string | string[]>;

interface UserInfo {
  age?: number;
  sex?: "male" | "female" | "other";
}

// Function to categorize treatments
const categorizeTreatments = (condition: ConditionPrediction) => {
  const medications = condition.treatmentApproaches
    .filter(t => 
      t.toLowerCase().includes("medication") || 
      t.toLowerCase().includes("drug") || 
      t.toLowerCase().includes("medicine") ||
      t.toLowerCase().includes("pill") ||
      t.toLowerCase().includes("prescription")
    )
    .map(t => ({
      title: t.split(" ")[0] ?? "Medication",
      description: t
    }));
    
  const lifestyle = condition.treatmentApproaches
    .filter(t => 
      t.toLowerCase().includes("diet") || 
      t.toLowerCase().includes("exercise") || 
      t.toLowerCase().includes("sleep") ||
      t.toLowerCase().includes("avoid") ||
      t.toLowerCase().includes("reduce") ||
      t.toLowerCase().includes("lifestyle") ||
      t.toLowerCase().includes("habit")
    )
    .map(t => ({
      title: t.split(" ")[0] ?? "Lifestyle",
      description: t
    }));
    
  const procedures = condition.treatmentApproaches
    .filter(t => 
      t.toLowerCase().includes("surgery") || 
      t.toLowerCase().includes("procedure") || 
      t.toLowerCase().includes("therapy") ||
      t.toLowerCase().includes("treatment") ||
      t.toLowerCase().includes("operation")
    )
    .map(t => ({
      title: t.split(" ")[0] ?? "Procedure",
      description: t
    }));
    
  const other = condition.treatmentApproaches
    .filter(t => 
      !medications.some(m => m.description === t) &&
      !lifestyle.some(l => l.description === t) &&
      !procedures.some(p => p.description === t)
    )
    .map(t => ({
      title: t.split(" ")[0] ?? "Other",
      description: t
    }));
    
  return { medications, lifestyle, procedures, other };
};

export default function TreatmentPage() {
  const router = useRouter();
  const [selectedSymptoms, setSelectedSymptoms] = useState<SelectedSymptom[]>([]);
  const [conditions, setConditions] = useState<ConditionPrediction[]>([]);
  const [detailAnswers, setDetailAnswers] = useState<FormAnswers>({});
  const [isLoading, setIsLoading] = useState(true);
  const [disclaimer, setDisclaimer] = useState<string>("");
  const [userInfo, setUserInfo] = useState<UserInfo>({});

  // Load saved symptoms, answers, and determine relevant treatments
  useEffect(() => {
    const savedSymptoms = localStorage.getItem("selectedSymptoms");
    const savedAnswers = localStorage.getItem("detailAnswers");
    const savedAnalysisResult = localStorage.getItem("analysisResult");
    const savedUserInfo = localStorage.getItem("userInfo");
    
    if (savedUserInfo) {
      try {
        const parsedUserInfo = JSON.parse(savedUserInfo) as UserInfo;
        setUserInfo(parsedUserInfo);
      } catch (e) {
        console.error("Error parsing user info:", e);
      }
    }
    
    if (savedSymptoms) {
      try {
        const parsedSymptoms = JSON.parse(savedSymptoms) as SelectedSymptom[];
        setSelectedSymptoms(parsedSymptoms);
      } catch (e) {
        console.error("Error parsing saved symptoms:", e);
      }
    }
    
    if (savedAnswers) {
      try {
        const parsedAnswers = JSON.parse(savedAnswers) as FormAnswers;
        setDetailAnswers(parsedAnswers);
      } catch (e) {
        console.error("Error parsing saved answers:", e);
      }
    }
    
    if (savedAnalysisResult) {
      try {
        const analysisResult = JSON.parse(savedAnalysisResult) as SymptomAnalysisResponse;
        
        // Set disclaimer from the analysis result
        setDisclaimer(analysisResult.disclaimer);
        
        // Set conditions from analysis result
        const topConditions = analysisResult.conditions
          .sort((a, b) => b.confidence - a.confidence);
        
        setConditions(topConditions);
      } catch (e) {
        console.error("Error parsing analysis result:", e);
      }
    } else {
      // If no analysis result exists, redirect to conditions page
      router.push("/conditions");
      return;
    }
    
    setIsLoading(false);
  }, [router]);

  // Navigate back to details page if no answers were provided
  useEffect(() => {
    if (!isLoading && Object.keys(detailAnswers).length === 0) {
      router.push("/details");
    }
  }, [isLoading, detailAnswers, router]);

  // Get the primary condition
  const primaryCondition = useMemo(() => {
    return conditions.length > 0 ? conditions[0] : null;
  }, [conditions]);

  // Categorize treatments for the primary condition
  const treatmentCategories = useMemo(() => {
    if (!primaryCondition) return { medications: [], lifestyle: [], procedures: [], other: [] };
    return categorizeTreatments(primaryCondition);
  }, [primaryCondition]);

  // Navigation handlers
  const handlePrevious = () => {
    router.push("/details");
  };

  const handleStartOver = () => {
    // Clear localStorage and redirect to home
    localStorage.removeItem("selectedSymptoms");
    localStorage.removeItem("detailAnswers");
    localStorage.removeItem("analysisResult");
    router.push("/");
  };

  const handleBackToResults = () => {
    router.push("/conditions");
  };

  if (isLoading || !primaryCondition) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8">
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
              Generating treatment recommendations...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-2 text-center text-3xl font-bold text-gray-800 dark:text-white">
        SymptoTrack
      </h1>
      <p className="mb-8 text-center text-xl text-teal-600 dark:text-teal-400">
        Track your symptoms, understand your health
      </p>
      
      <div className="rounded-lg bg-white p-8 shadow-lg dark:bg-gray-800">
        <ProgressBar currentStep="treatment" />
        
        <div className="py-8">
          <div className="mb-6 flex items-center">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
              Treatment Recommendations
            </h2>
            <span className="ml-3 rounded-full bg-teal-100 px-3 py-1 text-sm font-medium text-teal-800 dark:bg-teal-900/50 dark:text-teal-300">
              {primaryCondition.name}
            </span>
            {primaryCondition.isSevere && (
              <span className="ml-2 rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-800 dark:bg-red-900/50 dark:text-red-300">
                Potentially Serious
              </span>
            )}
          </div>
          
          <div className="mb-6 rounded-lg border border-blue-100 bg-blue-50 p-4 text-sm text-blue-800 dark:border-blue-900/50 dark:bg-blue-900/30 dark:text-blue-200">
            <div className="flex">
              <svg className="mr-3 h-5 w-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="font-medium">
                  <strong>Medical Disclaimer:</strong> {disclaimer || "This information is provided for educational purposes only and is not intended as medical advice. Always consult with a healthcare professional for diagnosis and treatment of medical conditions."}
                </p>
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <p className="text-gray-600 dark:text-gray-300">
              {primaryCondition.description}
            </p>
          </div>
          
          <div className="space-y-8">
            {/* Treatment Categories Grid */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <TreatmentCategory
                title="Medications"
                items={treatmentCategories.medications}
                icon={
                  <svg className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                }
                colorClass="text-blue-700 dark:text-blue-400"
                iconBgClass="bg-blue-500 dark:bg-blue-600"
              />
              
              <TreatmentCategory
                title="Lifestyle Changes"
                items={treatmentCategories.lifestyle}
                icon={
                  <svg className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                }
                colorClass="text-green-700 dark:text-green-400"
                iconBgClass="bg-green-500 dark:bg-green-600"
              />
              
              <TreatmentCategory
                title="Medical Procedures"
                items={treatmentCategories.procedures}
                icon={
                  <svg className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z" clipRule="evenodd" />
                  </svg>
                }
                colorClass="text-purple-700 dark:text-purple-400"
                iconBgClass="bg-purple-500 dark:bg-purple-600"
              />
              
              <TreatmentCategory
                title="Other Recommendations"
                items={treatmentCategories.other}
                icon={
                  <svg className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
                  </svg>
                }
                colorClass="text-yellow-700 dark:text-yellow-400"
                iconBgClass="bg-yellow-500 dark:bg-yellow-600"
              />
            </div>
            
            {/* When to See a Doctor Section */}
            <div className="rounded-lg border border-red-200 bg-red-50 p-5 dark:border-red-900/50 dark:bg-red-900/20">
              <div className="mb-4 flex items-center">
                <svg className="mr-3 h-6 w-6 text-red-600 dark:text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <h3 className="text-lg font-semibold text-red-700 dark:text-red-400">
                  When to See a Doctor
                </h3>
              </div>
              
              <p className="mb-4 text-sm text-red-700 dark:text-red-300">
                Seek medical attention if you experience any of the following:
              </p>
              
              <ul className="grid gap-2 sm:grid-cols-2">
                {primaryCondition.whenToSeeDoctor.map((item, index) => (
                  <li key={index} className="flex items-start text-red-700 dark:text-red-300">
                    <svg className="mr-2 mt-1 h-4 w-4 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              
              <div className="mt-4 rounded-md bg-red-100 p-3 text-sm text-red-800 dark:bg-red-900/40 dark:text-red-200">
                <strong>Important:</strong> If you experience severe symptoms like difficulty breathing, chest pain, severe bleeding, or loss of consciousness, call emergency services (911) immediately.
              </div>
            </div>
            
            {/* Doctor Finder Component */}
            <DoctorFinder conditionName={primaryCondition.name} />
            
            {/* Treatment Actions Component */}
            <TreatmentActions 
              conditions={conditions} 
              symptoms={selectedSymptoms}
              userInfo={userInfo}
            />
          </div>
        </div>
        
        <div className="mt-8 flex flex-wrap justify-between gap-4">
          <div className="flex gap-4">
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
              onClick={handleBackToResults}
              className="flex items-center rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
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
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              Back to Results
            </button>
          </div>
          
          <button
            onClick={handleStartOver}
            className="flex items-center rounded-lg bg-teal-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-teal-600 dark:bg-teal-600 dark:hover:bg-teal-700"
          >
            Start Over
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
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
} 