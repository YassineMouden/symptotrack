import { type FC } from "react";
import { type Step } from "./ProgressBar";

interface StepNavigationProps {
  currentStep: Step;
  onPrevious: () => void;
  onNext: () => void;
  canGoNext?: boolean;
  canGoPrevious?: boolean;
  isLastStep?: boolean;
}

const StepNavigation: FC<StepNavigationProps> = ({
  currentStep,
  onPrevious,
  onNext,
  canGoNext = true,
  canGoPrevious = true,
  isLastStep = false,
}) => {
  return (
    <div className="mt-8 flex justify-between">
      <button
        onClick={onPrevious}
        disabled={!canGoPrevious}
        className={`
          flex items-center rounded-lg px-5 py-2.5 text-sm font-medium
          ${
            canGoPrevious
              ? "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
              : "cursor-not-allowed bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500"
          }
        `}
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
        onClick={onNext}
        disabled={!canGoNext}
        className={`
          flex items-center rounded-lg px-5 py-2.5 text-sm font-medium
          ${
            canGoNext
              ? "bg-teal-500 text-white hover:bg-teal-600 dark:bg-teal-600 dark:hover:bg-teal-700"
              : "cursor-not-allowed bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500"
          }
        `}
      >
        {isLastStep ? 'Finish' : 'Continue'}
        {!isLastStep && (
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
        )}
      </button>
    </div>
  );
};

export default StepNavigation; 