"use client";

import { useState } from "react";
import ProgressBar, { type Step } from "./_components/ProgressBar";
import StepNavigation from "./_components/StepNavigation";

export default function Home() {
  const [currentStep, setCurrentStep] = useState<Step>("info");
  const steps: Step[] = ["info", "symptoms", "conditions", "details", "treatment"];

  const handlePrevious = () => {
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]!);
    }
  };

  const handleNext = () => {
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]!);
    }
  };

  const isFirstStep = currentStep === "info";
  const isLastStep = currentStep === "treatment";

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="mb-6 text-center text-3xl font-bold text-gray-800 dark:text-white">
        Welcome to SymptoTrack
      </h1>
      <p className="mb-8 text-center text-gray-600 dark:text-gray-300">
        Track your symptoms and discover potential conditions with our interactive medical assistant.
      </p>
      
      <div className="rounded-lg bg-white p-8 shadow-md dark:bg-gray-800">
        <ProgressBar 
          currentStep={currentStep}
          onStepClick={setCurrentStep}
        />
        
        <div className="min-h-[300px] py-6">
          {currentStep === "info" && (
            <div>
              <h2 className="mb-4 text-xl font-semibold text-gray-800 dark:text-white">Personal Information</h2>
              <p className="text-gray-600 dark:text-gray-300">
                This is the information step. Here, users would enter their basic information.
              </p>
            </div>
          )}
          
          {currentStep === "symptoms" && (
            <div>
              <h2 className="mb-4 text-xl font-semibold text-gray-800 dark:text-white">Select Your Symptoms</h2>
              <p className="text-gray-600 dark:text-gray-300">
                This is the symptoms step. Here, users would select symptoms from the interactive body model.
              </p>
            </div>
          )}
          
          {currentStep === "conditions" && (
            <div>
              <h2 className="mb-4 text-xl font-semibold text-gray-800 dark:text-white">Potential Conditions</h2>
              <p className="text-gray-600 dark:text-gray-300">
                This is the conditions step. Here, users would see AI-suggested conditions.
              </p>
            </div>
          )}
          
          {currentStep === "details" && (
            <div>
              <h2 className="mb-4 text-xl font-semibold text-gray-800 dark:text-white">Additional Details</h2>
              <p className="text-gray-600 dark:text-gray-300">
                This is the details step. Here, users would be asked additional questions about their symptoms.
              </p>
            </div>
          )}
          
          {currentStep === "treatment" && (
            <div>
              <h2 className="mb-4 text-xl font-semibold text-gray-800 dark:text-white">Treatment Suggestions</h2>
              <p className="text-gray-600 dark:text-gray-300">
                This is the treatment step. Here, users would receive treatment suggestions based on their conditions.
              </p>
            </div>
          )}
        </div>
        
        <StepNavigation
          currentStep={currentStep}
          onPrevious={handlePrevious}
          onNext={handleNext}
          canGoPrevious={!isFirstStep}
          isLastStep={isLastStep}
        />
      </div>
    </div>
  );
}
