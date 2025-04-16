import { type FC } from "react";

export type Step = "info" | "symptoms" | "conditions" | "details" | "treatment";

interface ProgressBarProps {
  currentStep: Step;
  onStepClick?: (step: Step) => void;
}

const steps: Array<{ id: Step; label: string }> = [
  { id: "info", label: "INFO" },
  { id: "symptoms", label: "SYMPTOMS" },
  { id: "conditions", label: "CONDITIONS" },
  { id: "details", label: "DETAILS" },
  { id: "treatment", label: "TREATMENT" },
];

const ProgressBar: FC<ProgressBarProps> = ({
  currentStep,
  onStepClick,
}) => {
  // Helper function to determine if a step is completed
  const isCompleted = (stepId: Step): boolean => {
    const currentIndex = steps.findIndex((step) => step.id === currentStep);
    const stepIndex = steps.findIndex((step) => step.id === stepId);
    return stepIndex < currentIndex;
  };

  // Helper function to determine if a step is the current step
  const isCurrent = (stepId: Step): boolean => {
    return stepId === currentStep;
  };

  return (
    <div className="mb-8">
      <div className="flex w-full justify-between">
        {steps.map((step, index) => {
          const completed = isCompleted(step.id);
          const current = isCurrent(step.id);
          
          return (
            <div 
              key={step.id}
              className="flex flex-col items-center"
              style={{ width: `${100 / steps.length}%` }}
            >
              <button
                onClick={() => onStepClick && onStepClick(step.id)}
                disabled={!onStepClick}
                className={`
                  relative flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold 
                  ${completed 
                    ? "bg-teal-500 text-white" 
                    : current 
                      ? "bg-white text-teal-500 ring-2 ring-teal-500" 
                      : "bg-gray-200 text-gray-500"
                  }
                  ${onStepClick ? "cursor-pointer" : "cursor-default"}
                `}
              >
                {index + 1}
              </button>
              
              <div 
                className={`
                  mt-2 text-xs font-semibold uppercase tracking-wide
                  ${completed || current ? "text-teal-500" : "text-gray-500"}
                `}
              >
                {step.label}
              </div>
              
              {/* Underline for current step */}
              {current && (
                <div className="mt-1 h-1 w-12 rounded-full bg-teal-500" />
              )}
            </div>
          );
        })}
      </div>
      
      {/* Progress line */}
      <div className="relative mt-4">
        <div className="absolute top-0 h-1 w-full bg-gray-200" />
        <div
          className="absolute top-0 h-1 bg-teal-500 transition-all duration-300 ease-in-out"
          style={{
            width: `${
              ((steps.findIndex((step) => step.id === currentStep) + 0.5) /
                steps.length) *
              100
            }%`,
          }}
        />
      </div>
    </div>
  );
};

export default ProgressBar; 