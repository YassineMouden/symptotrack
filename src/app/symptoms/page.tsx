"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProgressBar from "../_components/ProgressBar";
import SymptomsScreen from "../_components/SymptomsScreen";
import { type SelectedSymptom } from "../_components/BodyModel";
import SymptomSearch from "../_components/SymptomSearch";
import SelectedSymptomsList from "../_components/SelectedSymptomsList";

export default function SymptomsPage() {
  const router = useRouter();
  const [selectedSymptoms, setSelectedSymptoms] = useState<SelectedSymptom[]>([]);
  
  // Load any previously saved symptoms from localStorage
  useEffect(() => {
    const savedSymptoms = localStorage.getItem("selectedSymptoms");
    if (savedSymptoms) {
      try {
        const parsedSymptoms = JSON.parse(savedSymptoms) as SelectedSymptom[];
        setSelectedSymptoms(parsedSymptoms);
      } catch (e) {
        console.error("Error parsing saved symptoms:", e);
      }
    }
  }, []);

  // Save symptoms to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("selectedSymptoms", JSON.stringify(selectedSymptoms));
  }, [selectedSymptoms]);

  // Handle adding a symptom from text search
  const handleAddSymptom = (symptom: SelectedSymptom) => {
    // Check if the symptom is already in the list
    const isDuplicate = selectedSymptoms.some(
      s => s.id === symptom.id && s.bodyPartId === symptom.bodyPartId
    );
    
    if (!isDuplicate) {
      setSelectedSymptoms(prev => [...prev, symptom]);
    }
  };

  // Handle symptoms selected from the body model
  const handleSymptomSelect = (symptoms: SelectedSymptom[]) => {
    // Merge new symptoms with existing ones, avoiding duplicates
    const merged = [...selectedSymptoms];
    
    symptoms.forEach(symptom => {
      const existingIndex = merged.findIndex(
        s => s.id === symptom.id && s.bodyPartId === symptom.bodyPartId
      );
      
      if (existingIndex >= 0) {
        // Update existing symptom (e.g., severity might have changed)
        merged[existingIndex] = symptom;
      } else {
        // Add new symptom
        merged.push(symptom);
      }
    });
    
    setSelectedSymptoms(merged);
  };

  // Remove a symptom
  const handleRemoveSymptom = (symptomId: string, bodyPartId: string) => {
    setSelectedSymptoms(prev => 
      prev.filter(s => !(s.id === symptomId && s.bodyPartId === bodyPartId))
    );
  };

  // Navigation handlers
  const handlePrevious = () => {
    router.push("/");
  };

  const handleContinue = () => {
    router.push("/conditions");
  };

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="mb-2 text-center text-3xl font-bold text-gray-800 dark:text-white">
        SymptoTrack
      </h1>
      <p className="mb-8 text-center text-xl text-teal-600 dark:text-teal-400">
        Track your symptoms, understand your health
      </p>
      
      <div className="rounded-lg bg-white p-8 shadow-lg dark:bg-gray-800">
        <ProgressBar currentStep="symptoms" />
        
        <div className="min-h-[500px] py-8">
          <h2 className="mb-4 text-xl font-semibold text-gray-800 dark:text-white">
            Enter Your Symptoms
          </h2>
          
          <div className="mb-6 flex flex-col space-y-2 md:flex-row md:space-x-4 md:space-y-0">
            <div className="w-full md:w-1/3">
              <SymptomSearch onSelectSymptom={handleAddSymptom} />
              
              <div className="mt-6">
                <SelectedSymptomsList 
                  symptoms={selectedSymptoms} 
                  onRemove={handleRemoveSymptom}
                />
              </div>
            </div>
            
            <div className="w-full md:w-2/3">
              <div className="rounded-md bg-gray-50 p-4 dark:bg-gray-700">
                <SymptomsScreen 
                  onContinue={handleSymptomSelect}
                  initialSymptoms={selectedSymptoms}
                />
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
            disabled={selectedSymptoms.length === 0}
            className={`
              flex items-center rounded-lg px-5 py-2.5 text-sm font-medium
              ${
                selectedSymptoms.length > 0
                  ? "bg-teal-500 text-white hover:bg-teal-600 dark:bg-teal-600 dark:hover:bg-teal-700"
                  : "cursor-not-allowed bg-gray-300 text-gray-500 dark:bg-gray-700 dark:text-gray-400"
              }
            `}
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