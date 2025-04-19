"use client";

import Modal from "react-modal";
import { type ConditionPrediction } from "~/utils/ai";

interface ConditionDetailsProps {
  condition: ConditionPrediction | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ConditionDetails({ condition, isOpen, onClose }: ConditionDetailsProps) {
  if (!condition) {
    return null;
  }
  
  // Calculate confidence percentage
  const confidencePercent = Math.round(condition.confidence * 100);
  
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel={`${condition.name} Details`}
      ariaHideApp={false}
      style={{
        overlay: {
          zIndex: 1000,
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.75)'
        },
        content: {
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          maxWidth: '600px',
          width: '90%',
          maxHeight: '85vh',
          padding: '0',
          border: 'none',
          borderRadius: '0.5rem',
          backgroundColor: 'white'
        }
      }}
    >
      <div className="h-full overflow-y-auto rounded-lg bg-white dark:bg-gray-800">
        <div className="sticky top-0 z-10 border-b border-gray-200 bg-white px-6 py-4 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
              {condition.name}
            </h2>
            <button
              onClick={onClose}
              className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500 dark:hover:bg-gray-700 dark:hover:text-gray-300"
              aria-label="Close"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          
          <div className="mt-1 flex items-center">
            <span className={`mr-2 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
              confidencePercent >= 75
                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                : confidencePercent >= 50
                ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
            }`}>
              {confidencePercent}% confidence
            </span>
            
            {condition.isSevere && (
              <span className="inline-block rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900 dark:text-red-200">
                Potentially serious
              </span>
            )}
          </div>
        </div>
        
        <div className="px-6 py-4">
          <div className="mb-6">
            <h3 className="mb-2 font-medium text-gray-800 dark:text-white">
              Description
            </h3>
            <p className="text-gray-600 dark:text-gray-300">{condition.description}</p>
          </div>
          
          <div className="mb-6">
            <h3 className="mb-2 font-medium text-gray-800 dark:text-white">
              Common Symptoms
            </h3>
            <ul className="list-inside list-disc space-y-1 text-gray-600 dark:text-gray-300">
              {condition.symptoms.map((symptom, index) => (
                <li key={index}>{typeof symptom === 'string' ? symptom.replace(/-/g, ' ') : symptom}</li>
              ))}
            </ul>
          </div>
          
          {condition.possibleCauses && condition.possibleCauses.length > 0 && (
            <div className="mb-6">
              <h3 className="mb-2 font-medium text-gray-800 dark:text-white">
                Possible Causes
              </h3>
              <ul className="list-inside list-disc space-y-1 text-gray-600 dark:text-gray-300">
                {condition.possibleCauses.map((cause, index) => (
                  <li key={index}>{cause}</li>
                ))}
              </ul>
            </div>
          )}
          
          {condition.riskFactors && condition.riskFactors.length > 0 && (
            <div className="mb-6">
              <h3 className="mb-2 font-medium text-gray-800 dark:text-white">
                Risk Factors
              </h3>
              <ul className="list-inside list-disc space-y-1 text-gray-600 dark:text-gray-300">
                {condition.riskFactors.map((factor, index) => (
                  <li key={index}>{factor}</li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="mb-6">
            <h3 className="mb-2 font-medium text-gray-800 dark:text-white">
              Treatment Approaches
            </h3>
            <ul className="list-inside list-disc space-y-1 text-gray-600 dark:text-gray-300">
              {condition.treatmentApproaches.map((treatment, index) => (
                <li key={index}>{treatment}</li>
              ))}
            </ul>
          </div>
          
          <div className="rounded-md bg-red-50 p-4 dark:bg-red-900/20">
            <h3 className="mb-2 font-medium text-red-800 dark:text-red-200">
              When to See a Doctor
            </h3>
            <ul className="list-inside list-disc space-y-1 text-red-700 dark:text-red-300">
              {condition.whenToSeeDoctor.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="sticky bottom-0 z-10 border-t border-gray-200 bg-gray-50 px-6 py-4 dark:border-gray-700 dark:bg-gray-750">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
} 