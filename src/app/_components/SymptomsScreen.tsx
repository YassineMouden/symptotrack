"use client";

import { useState } from "react";
import BodyModel, { type SelectedSymptom } from "./BodyModel";

interface SymptomsScreenProps {
  onContinue: (symptoms: SelectedSymptom[]) => void;
  initialSymptoms?: SelectedSymptom[];
}

const SymptomsScreen: React.FC<SymptomsScreenProps> = ({ 
  onContinue, 
  initialSymptoms = [] 
}) => {
  const [selectedSymptoms, setSelectedSymptoms] = useState<SelectedSymptom[]>(initialSymptoms);

  const handleSymptomSelect = (symptoms: SelectedSymptom[]) => {
    setSelectedSymptoms(symptoms);
  };

  const handleContinue = () => {
    onContinue(selectedSymptoms);
  };

  return (
    <div className="flex flex-col">
      <h2 className="mb-4 text-xl font-semibold text-gray-800 dark:text-white">
        Select Your Symptoms
      </h2>
      <p className="mb-6 text-gray-600 dark:text-gray-300">
        Click on the body parts where you&apos;re experiencing symptoms, then select specific symptoms from the list.
      </p>
      
      <div className="mb-8">
        <BodyModel 
          onSymptomSelect={handleSymptomSelect} 
          selectedSymptoms={selectedSymptoms} 
        />
      </div>
      
      <div className="mt-auto flex justify-end">
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
  );
};

export default SymptomsScreen; 