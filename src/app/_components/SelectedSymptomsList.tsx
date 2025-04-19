"use client";

import { type SelectedSymptom } from "./BodyModel";

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

interface SelectedSymptomsListProps {
  symptoms: SelectedSymptom[];
  onRemove: (symptomId: string, bodyPartId: string) => void;
}

const SelectedSymptomsList: React.FC<SelectedSymptomsListProps> = ({ 
  symptoms, 
  onRemove 
}) => {
  // Group symptoms by body part
  const symptomsGroupedByBodyPart = symptoms.reduce((acc, symptom) => {
    const bodyPartId = symptom.bodyPartId;
    acc[bodyPartId] ??= [];
    acc[bodyPartId].push(symptom);
    return acc;
  }, {} as Record<string, SelectedSymptom[]>);

  // Only display if there are symptoms
  if (symptoms.length === 0) {
    return (
      <div className="rounded-md bg-gray-50 p-4 text-center text-sm text-gray-500 dark:bg-gray-700 dark:text-gray-400">
        No symptoms selected yet
      </div>
    );
  }

  return (
    <div className="rounded-md border border-gray-200 dark:border-gray-700">
      <div className="border-b border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-700 dark:bg-gray-800">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Selected Symptoms ({symptoms.length})
        </h3>
      </div>
      
      <div className="max-h-[400px] overflow-y-auto">
        {Object.entries(symptomsGroupedByBodyPart).map(([bodyPartId, bodyPartSymptoms]) => (
          <div key={bodyPartId} className="border-b border-gray-200 p-3 last:border-b-0 dark:border-gray-700">
            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
              {bodyPartNames[bodyPartId] ?? bodyPartId}
            </h4>
            
            <ul className="space-y-2">
              {bodyPartSymptoms.map(symptom => (
                <li 
                  key={`${symptom.bodyPartId}-${symptom.id}`}
                  className="flex items-center justify-between rounded-md bg-white p-2 shadow-sm dark:bg-gray-700"
                >
                  <div>
                    <span className="block text-sm font-medium text-gray-800 dark:text-white">
                      {symptom.name}
                    </span>
                    <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs
                      ${symptom.severity === 'mild' 
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' 
                        : symptom.severity === 'moderate' 
                          ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' 
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}
                    >
                      {symptom.severity}
                    </span>
                  </div>
                  
                  <button
                    type="button"
                    className="ml-2 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500 dark:hover:bg-gray-600 dark:hover:text-gray-300"
                    onClick={() => onRemove(symptom.id, symptom.bodyPartId)}
                    aria-label={`Remove ${symptom.name}`}
                  >
                    <svg 
                      className="h-4 w-4" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M6 18L18 6M6 6l12 12" 
                      />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SelectedSymptomsList; 