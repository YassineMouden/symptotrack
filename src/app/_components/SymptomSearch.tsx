"use client";

import { useState, useEffect, useRef } from "react";
import { type SelectedSymptom, type Symptom } from "./BodyModel";

// Sample symptom data - in a real app, this would come from an API
const allSymptoms: Symptom[] = [
  { id: "headache", name: "Headache", description: "Pain in the head or upper neck" },
  { id: "fever", name: "Fever", description: "Elevated body temperature" },
  { id: "cough", name: "Cough", description: "Sudden expulsion of air from the lungs" },
  { id: "sore-throat", name: "Sore throat", description: "Pain or irritation in the throat" },
  { id: "fatigue", name: "Fatigue", description: "Extreme tiredness or lack of energy" },
  { id: "shortness-of-breath", name: "Shortness of breath", description: "Difficulty breathing" },
  { id: "nausea", name: "Nausea", description: "Feeling of sickness with an inclination to vomit" },
  { id: "dizziness", name: "Dizziness", description: "Feeling faint or unsteady" },
  { id: "chest-pain", name: "Chest pain", description: "Pain or discomfort in the chest" },
  { id: "abdominal-pain", name: "Abdominal pain", description: "Pain in the stomach area" },
  { id: "muscle-ache", name: "Muscle ache", description: "Pain in muscles" },
  { id: "joint-pain", name: "Joint pain", description: "Pain in joints" },
  { id: "rash", name: "Rash", description: "Change in skin color or texture" },
  { id: "vomiting", name: "Vomiting", description: "Forcible ejection of stomach contents" },
  { id: "diarrhea", name: "Diarrhea", description: "Loose, watery bowel movements" },
  { id: "chills", name: "Chills", description: "Feeling of cold with shivering" },
  { id: "swelling", name: "Swelling", description: "Enlargement of body parts" },
  { id: "blurred-vision", name: "Blurred vision", description: "Lack of visual clarity" },
  { id: "ear-pain", name: "Ear pain", description: "Pain in or around the ear" },
  { id: "runny-nose", name: "Runny nose", description: "Excess discharge of nasal fluid" },
];

// Default body part for general symptoms
const DEFAULT_BODY_PART_ID = "general";
const DEFAULT_BODY_PART_NAME = "General";

interface SymptomSearchProps {
  onSelectSymptom: (symptom: SelectedSymptom) => void;
}

const SymptomSearch: React.FC<SymptomSearchProps> = ({ onSelectSymptom }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Symptom[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedSeverity, setSelectedSeverity] = useState<"mild" | "moderate" | "severe">("moderate");
  const [selectedSymptom, setSelectedSymptom] = useState<Symptom | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Search for symptoms based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setSearchResults([]);
      return;
    }

    const results = allSymptoms.filter(symptom => 
      symptom.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      symptom.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    setSearchResults(results);
    setIsDropdownOpen(results.length > 0);
  }, [searchTerm]);

  // Handle symptom selection
  const handleSelectSymptom = (symptom: Symptom) => {
    setSelectedSymptom(symptom);
    setSearchTerm(symptom.name);
    setIsDropdownOpen(false);
  };

  // Handle adding the symptom
  const handleAddSymptom = () => {
    if (!selectedSymptom) return;
    
    const selectedSymptomWithDetails: SelectedSymptom = {
      ...selectedSymptom,
      severity: selectedSeverity,
      bodyPartId: DEFAULT_BODY_PART_ID
    };
    
    onSelectSymptom(selectedSymptomWithDetails);
    
    // Reset the form
    setSearchTerm("");
    setSelectedSymptom(null);
  };

  return (
    <div className="w-full">
      <label htmlFor="symptom-search" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
        Search symptoms
      </label>
      
      <div className="relative" ref={dropdownRef}>
        <input
          id="symptom-search"
          type="text"
          className="w-full rounded-md border border-gray-300 p-2 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          placeholder="Enter symptom..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => searchResults.length > 0 && setIsDropdownOpen(true)}
        />
        
        {isDropdownOpen && (
          <div className="absolute z-10 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
            {searchResults.map(symptom => (
              <div
                key={symptom.id}
                className="cursor-pointer px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => handleSelectSymptom(symptom)}
              >
                <div className="font-medium text-gray-800 dark:text-white">{symptom.name}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{symptom.description}</div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {selectedSymptom && (
        <div className="mt-4 rounded-md border border-gray-200 p-4 dark:border-gray-700">
          <div className="mb-2 font-medium text-gray-800 dark:text-white">{selectedSymptom.name}</div>
          <div className="mb-3 text-sm text-gray-600 dark:text-gray-400">{selectedSymptom.description}</div>
          
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Severity:
            </label>
            <div className="flex space-x-2">
              <button
                type="button"
                className={`rounded px-3 py-1 text-xs ${
                  selectedSeverity === "mild"
                    ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                    : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                }`}
                onClick={() => setSelectedSeverity("mild")}
              >
                Mild
              </button>
              <button
                type="button"
                className={`rounded px-3 py-1 text-xs ${
                  selectedSeverity === "moderate"
                    ? "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
                    : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                }`}
                onClick={() => setSelectedSeverity("moderate")}
              >
                Moderate
              </button>
              <button
                type="button"
                className={`rounded px-3 py-1 text-xs ${
                  selectedSeverity === "severe"
                    ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                    : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                }`}
                onClick={() => setSelectedSeverity("severe")}
              >
                Severe
              </button>
            </div>
          </div>
          
          <div className="mt-4 flex justify-end">
            <button
              type="button"
              className="rounded-md bg-teal-500 px-4 py-2 text-sm font-medium text-white hover:bg-teal-600 dark:bg-teal-600 dark:hover:bg-teal-700"
              onClick={handleAddSymptom}
            >
              Add Symptom
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SymptomSearch; 