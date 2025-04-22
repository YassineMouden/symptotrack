"use client";

import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import ProgressBar, { type Step } from "./_components/ProgressBar";
import StepNavigation from "./_components/StepNavigation";
import SymptomsScreen from "./_components/SymptomsScreen";
import { type SelectedSymptom } from "./_components/BodyModel";

interface UserInfoInputs {
  age: number;
  sex: "male" | "female" | "other";
}

export default function Home() {
  const [currentStep, setCurrentStep] = useState<Step>("info");
  const [userInfo, setUserInfo] = useState<UserInfoInputs | null>(null);
  const [selectedSymptoms, setSelectedSymptoms] = useState<SelectedSymptom[]>([]);
  const steps: Step[] = ["info", "symptoms", "conditions", "details", "treatment"];

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<UserInfoInputs>({
    mode: "onChange",
    defaultValues: {
      age: undefined,
      sex: undefined,
    },
  });

  const onInfoSubmit: SubmitHandler<UserInfoInputs> = (data) => {
    console.log("Form submitted:", data);
    setUserInfo(data);
    handleNext();
  };

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

  const handleSymptomsSubmit = (symptoms: SelectedSymptom[]) => {
    setSelectedSymptoms(symptoms);
    handleNext();
  };

  const isFirstStep = currentStep === "info";
  const isLastStep = currentStep === "treatment";

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="mb-2 text-center text-3xl font-bold text-gray-800 dark:text-white">
        SymptoTrack
          </h1>
      <p className="mb-8 text-center text-xl text-teal-600 dark:text-teal-400">
        Track your symptoms, understand your health
      </p>
      
      <div className="rounded-lg bg-white p-8 shadow-lg dark:bg-gray-800">
        <ProgressBar 
          currentStep={currentStep}
          onStepClick={setCurrentStep}
        />
        
        <div className="min-h-[400px] py-8">
          {currentStep === "info" && (
            <div>
              <h2 className="mb-4 text-xl font-semibold text-gray-800 dark:text-white">
                Personal Information
              </h2>
              <p className="mb-6 text-gray-600 dark:text-gray-300">
                This tool helps identify potential conditions based on your symptoms. 
                Please provide some basic information to get started.
              </p>
              
              <div className="mb-8 rounded-md bg-blue-50 p-4 text-sm text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                <p className="font-medium">
                  <strong>Medical Disclaimer:</strong> This is not a substitute for professional medical advice. 
                  Please consult a healthcare provider for diagnosis and treatment.
                </p>
              </div>
              
              <form onSubmit={handleSubmit(onInfoSubmit)} className="space-y-6">
                <div>
                  <label 
                    htmlFor="age" 
                    className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Age
                  </label>
                  <input
                    id="age"
                    type="number"
                    className={`
                      w-full rounded-md border px-4 py-2 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50
                      ${errors.age ? "border-red-500" : "border-gray-300 dark:border-gray-600"}
                      dark:bg-gray-700 dark:text-white
                    `}
                    placeholder="Enter your age"
                    min={0}
                    max={120}
                    {...register("age", { 
                      required: "Age is required", 
                      min: { value: 0, message: "Age must be between 0 and 120" },
                      max: { value: 120, message: "Age must be between 0 and 120" },
                      valueAsNumber: true,
                    })}
                  />
                  {errors.age && (
                    <p className="mt-1 text-sm text-red-500">{errors.age.message}</p>
                  )}
                </div>
                
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Sex
                  </label>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input
                        id="sex-male"
                        type="radio"
                        value="male"
                        className="h-4 w-4 border-gray-300 text-teal-600 focus:ring-teal-500"
                        {...register("sex", { required: "Please select your sex" })}
                      />
                      <label 
                        htmlFor="sex-male" 
                        className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                      >
                        Male
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="sex-female"
                        type="radio"
                        value="female"
                        className="h-4 w-4 border-gray-300 text-teal-600 focus:ring-teal-500"
                        {...register("sex", { required: "Please select your sex" })}
                      />
                      <label 
                        htmlFor="sex-female" 
                        className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                      >
                        Female
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="sex-other"
                        type="radio"
                        value="other"
                        className="h-4 w-4 border-gray-300 text-teal-600 focus:ring-teal-500"
                        {...register("sex", { required: "Please select your sex" })}
                      />
                      <label 
                        htmlFor="sex-other" 
                        className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                      >
                        Other
                      </label>
                    </div>
                  </div>
                  {errors.sex && (
                    <p className="mt-1 text-sm text-red-500">{errors.sex.message}</p>
                  )}
                </div>
                
                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    className={`
                      flex items-center rounded-lg px-5 py-2.5 text-sm font-medium
                      ${
                        isValid
                          ? "bg-teal-500 text-white hover:bg-teal-600 dark:bg-teal-600 dark:hover:bg-teal-700"
                          : "cursor-not-allowed bg-gray-300 text-gray-500 dark:bg-gray-700 dark:text-gray-400"
                      }
                    `}
                    disabled={!isValid}
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
              </form>
            </div>
          )}
          
          {currentStep === "symptoms" && (
            <SymptomsScreen 
              onContinue={handleSymptomsSubmit}
              initialSymptoms={selectedSymptoms}
            />
          )}
          
          {currentStep === "conditions" && (
            <div>
              <h2 className="mb-4 text-xl font-semibold text-gray-800 dark:text-white">Potential Conditions</h2>
              <p className="text-gray-600 dark:text-gray-300">
                Based on your symptoms, these are potential conditions you may be experiencing.
              </p>
              {selectedSymptoms.length > 0 && (
                <div className="mt-6 rounded-md bg-gray-50 p-4 dark:bg-gray-700">
                  <h3 className="mb-2 font-medium text-gray-800 dark:text-white">Selected Symptoms:</h3>
                  <ul className="list-inside list-disc text-gray-600 dark:text-gray-300">
                    {selectedSymptoms.map((symptom) => (
                      <li key={`${symptom.bodyPartId}-${symptom.id}`}>
                        {symptom.name} ({symptom.severity}) - {symptom.bodyPartId.replace("_", " ")}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div className="mt-8">
                <p className="text-gray-500 dark:text-gray-400">
                  This screen will be developed further to show AI-generated potential conditions.
                </p>
              </div>
          </div>
          )}
          
          {currentStep === "details" && (
            <div>
              <h2 className="mb-4 text-xl font-semibold text-gray-800 dark:text-white">Additional Details</h2>
              <p className="text-gray-600 dark:text-gray-300">
                Please provide additional details about your symptoms to help us better understand your situation.
              </p>
              
              <div className="mt-8">
                <p className="text-gray-500 dark:text-gray-400">
                  This screen will be developed to ask condition-specific questions.
                </p>
              </div>
            </div>
          )}
          
          {currentStep === "treatment" && (
            <div>
              <h2 className="mb-4 text-xl font-semibold text-gray-800 dark:text-white">Treatment Suggestions</h2>
              <p className="text-gray-600 dark:text-gray-300">
                Based on your symptoms and the potential conditions, here are some treatment suggestions.
              </p>
              
              <div className="mt-8">
                <p className="text-gray-500 dark:text-gray-400">
                  This screen will be developed to show treatment recommendations based on identified conditions.
                </p>
              </div>
            </div>
          )}
          </div>

        {currentStep !== "info" && currentStep !== "symptoms" && (
          <StepNavigation
            _currentStep={currentStep}
            onPrevious={handlePrevious}
            onNext={handleNext}
            canGoPrevious={!isFirstStep}
            isLastStep={isLastStep}
          />
        )}
      </div>
        </div>
  );
}
