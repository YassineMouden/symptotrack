"use client";

import { type SelectedSymptom } from "./BodyModel";

interface UserInfo {
  age?: number;
  sex?: "male" | "female" | "other";
}

interface SummaryPanelProps {
  userInfo: UserInfo;
  selectedSymptoms: SelectedSymptom[];
  onEditSymptoms: () => void;
  onStartOver: () => void;
}

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

// Group symptoms by body part
function groupSymptomsByBodyPart(symptoms: SelectedSymptom[]): Record<string, SelectedSymptom[]> {
  return symptoms.reduce((acc, symptom) => {
    const bodyPartId = symptom.bodyPartId;
    acc[bodyPartId] ??= [];
    acc[bodyPartId].push(symptom);
    return acc;
  }, {} as Record<string, SelectedSymptom[]>);
}

export default function SummaryPanel({ 
  userInfo, 
  selectedSymptoms, 
  onEditSymptoms, 
  onStartOver 
}: SummaryPanelProps) {
  const symptomsGroupedByBodyPart = groupSymptomsByBodyPart(selectedSymptoms);

  return (
    <div className="rounded-md bg-white shadow-md dark:bg-gray-800">
      <div className="border-b border-gray-200 px-4 py-3 dark:border-gray-700">
        <h3 className="font-medium text-gray-800 dark:text-white">Summary</h3>
      </div>
      
      <div className="p-4">
        {/* User demographics */}
        <div className="mb-4">
          <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            Your Information
          </h4>
          <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
            <p>Age: {userInfo.age ?? "Not specified"}</p>
            <p>Sex: {userInfo.sex ? userInfo.sex.charAt(0).toUpperCase() + userInfo.sex.slice(1) : "Not specified"}</p>
          </div>
        </div>
        
        {/* Symptoms list */}
        <div className="mb-4">
          <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            Reported Symptoms ({selectedSymptoms.length})
          </h4>
          <div className="max-h-[250px] overflow-y-auto rounded-md border border-gray-200 dark:border-gray-700">
            {Object.keys(symptomsGroupedByBodyPart).length > 0 ? (
              Object.entries(symptomsGroupedByBodyPart).map(([bodyPartId, symptoms]) => (
                <div key={bodyPartId} className="border-b border-gray-200 p-2 last:border-b-0 dark:border-gray-700">
                  <h5 className="text-xs font-medium text-gray-600 dark:text-gray-400">
                    {bodyPartNames[bodyPartId] ?? bodyPartId}
                  </h5>
                  <ul className="mt-1 list-inside list-disc text-xs">
                    {symptoms.map(symptom => (
                      <li key={`${symptom.bodyPartId}-${symptom.id}`} className="text-gray-600 dark:text-gray-400">
                        {symptom.name}
                        <span className={`ml-1 inline-block rounded-full px-1.5 py-0.5 text-xxs
                          ${symptom.severity === 'mild' 
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' 
                            : symptom.severity === 'moderate' 
                              ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' 
                              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}
                        >
                          {symptom.severity}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))
            ) : (
              <p className="p-2 text-center text-xs text-gray-500 dark:text-gray-400">
                No symptoms reported
              </p>
            )}
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="flex flex-col space-y-2">
          <button
            onClick={onEditSymptoms}
            className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
          >
            <svg className="mr-1.5 h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            Edit Symptoms
          </button>
          <button
            onClick={onStartOver}
            className="inline-flex items-center justify-center rounded-md border border-red-300 bg-white px-4 py-2 text-xs font-medium text-red-700 hover:bg-red-50 dark:border-red-700 dark:bg-gray-700 dark:text-red-400 dark:hover:bg-gray-600"
          >
            <svg className="mr-1.5 h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Start Over
          </button>
        </div>
      </div>
    </div>
  );
} 