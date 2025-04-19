"use client";

import Link from "next/link";
import { type ConditionPrediction } from "~/utils/ai";

interface ConditionCardProps {
  condition: ConditionPrediction;
  onViewDetails: (conditionId: string) => void;
}

export default function ConditionCard({ condition, onViewDetails }: ConditionCardProps) {
  // Calculate confidence percentage and determine color
  const confidencePercent = Math.round(condition.confidence * 100);
  
  const getConfidenceColor = () => {
    if (confidencePercent >= 75) return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    if (confidencePercent >= 50) return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    if (confidencePercent >= 25) return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
    return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
  };
  
  return (
    <div className={`rounded-lg border bg-white p-4 shadow-sm transition-all hover:shadow-md dark:bg-gray-800 ${
      condition.isSevere ? 'border-l-4 border-l-red-500 border-t border-r border-b border-gray-200 dark:border-l-red-600 dark:border-t dark:border-r dark:border-b dark:border-gray-700' : 'border-gray-200 dark:border-gray-700'
    }`}>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
          {condition.name}
          {condition.isSevere && (
            <span className="ml-2 inline-block rounded-full bg-red-100 px-2 py-0.5 text-xs text-red-800 dark:bg-red-900/50 dark:text-red-300">
              Potentially Serious
            </span>
          )}
        </h3>
        
        <div className={`rounded-full px-3 py-1 text-sm font-medium ${getConfidenceColor()}`}>
          {confidencePercent}% match
        </div>
      </div>
      
      <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">
        {condition.description}
      </p>
      
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-1">
          {condition.treatmentApproaches.length > 0 && (
            <span className="inline-block rounded-full bg-teal-100 px-2 py-1 text-xs font-medium text-teal-800 dark:bg-teal-900/50 dark:text-teal-300">
              {condition.treatmentApproaches.length} treatments
            </span>
          )}
          {condition.symptoms.length > 0 && (
            <span className="inline-block rounded-full bg-purple-100 px-2 py-1 text-xs font-medium text-purple-800 dark:bg-purple-900/50 dark:text-purple-300">
              {condition.symptoms.length} symptoms
            </span>
          )}
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => onViewDetails(condition.id)}
            className="flex items-center rounded-md bg-teal-50 px-3 py-1 text-sm font-medium text-teal-700 hover:bg-teal-100 dark:bg-teal-900/30 dark:text-teal-300 dark:hover:bg-teal-900/50"
          >
            Quick View
          </button>
          
          <Link
            href={`/conditions/${condition.id}`}
            className="flex items-center rounded-md bg-teal-500 px-3 py-1 text-sm font-medium text-white hover:bg-teal-600 dark:bg-teal-600 dark:hover:bg-teal-700"
          >
            View Details
            <svg 
              className="ml-1 h-4 w-4" 
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
          </Link>
        </div>
      </div>
    </div>
  );
} 