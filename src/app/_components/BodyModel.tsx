"use client";

import { useEffect, useState } from "react";
import { BodyComponent, type PartsInput } from "reactjs-human-body";
import Modal from "react-modal";

// Define the structure for body parts and their corresponding symptoms
export interface BodyPartSymptoms {
  id: string;
  name: string;
  commonSymptoms: Symptom[];
  allSymptoms: Symptom[];
}

export interface Symptom {
  id: string;
  name: string;
  description: string;
  severity?: "mild" | "moderate" | "severe";
}

export interface SelectedSymptom extends Symptom {
  severity: "mild" | "moderate" | "severe";
  bodyPartId: string;
}

interface BodyModelProps {
  onSymptomSelect: (symptoms: SelectedSymptom[]) => void;
  selectedSymptoms?: SelectedSymptom[];
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
};

// Define symptoms for each body part
const bodyPartSymptoms: Record<string, BodyPartSymptoms> = {
  head: {
    id: "head",
    name: "Head",
    commonSymptoms: [
      { id: "headache", name: "Headache", description: "Pain in the head or upper neck" },
      { id: "dizziness", name: "Dizziness", description: "Feeling faint, woozy, or unsteady" },
      { id: "blurred-vision", name: "Blurred vision", description: "Inability to see fine details" },
    ],
    allSymptoms: [
      { id: "headache", name: "Headache", description: "Pain in the head or upper neck" },
      { id: "dizziness", name: "Dizziness", description: "Feeling faint, woozy, or unsteady" },
      { id: "blurred-vision", name: "Blurred vision", description: "Inability to see fine details" },
      { id: "ear-pain", name: "Ear pain", description: "Pain in or around the ear" },
      { id: "tinnitus", name: "Tinnitus", description: "Ringing or buzzing sounds in the ears" },
      { id: "sinus-pressure", name: "Sinus pressure", description: "Pressure or pain in the sinuses" },
      { id: "facial-pain", name: "Facial pain", description: "Pain in the face" },
    ],
  },
  chest: {
    id: "chest",
    name: "Chest",
    commonSymptoms: [
      { id: "chest-pain", name: "Chest pain", description: "Pain or discomfort in the chest" },
      { id: "shortness-of-breath", name: "Shortness of breath", description: "Difficulty breathing or catching your breath" },
      { id: "heart-palpitations", name: "Heart palpitations", description: "Feeling of having a fast-beating or pounding heart" },
    ],
    allSymptoms: [
      { id: "chest-pain", name: "Chest pain", description: "Pain or discomfort in the chest" },
      { id: "shortness-of-breath", name: "Shortness of breath", description: "Difficulty breathing or catching your breath" },
      { id: "heart-palpitations", name: "Heart palpitations", description: "Feeling of having a fast-beating or pounding heart" },
      { id: "cough", name: "Cough", description: "Sudden expulsion of air from the lungs" },
      { id: "wheezing", name: "Wheezing", description: "High-pitched whistling sound when breathing" },
      { id: "chest-tightness", name: "Chest tightness", description: "Feeling of tightness or pressure in the chest" },
    ],
  },
  stomach: {
    id: "stomach",
    name: "Stomach",
    commonSymptoms: [
      { id: "abdominal-pain", name: "Abdominal pain", description: "Pain in the area between the chest and groin" },
      { id: "nausea", name: "Nausea", description: "Feeling of sickness with an inclination to vomit" },
      { id: "bloating", name: "Bloating", description: "Feeling of fullness or swelling in the abdomen" },
    ],
    allSymptoms: [
      { id: "abdominal-pain", name: "Abdominal pain", description: "Pain in the area between the chest and groin" },
      { id: "nausea", name: "Nausea", description: "Feeling of sickness with an inclination to vomit" },
      { id: "bloating", name: "Bloating", description: "Feeling of fullness or swelling in the abdomen" },
      { id: "diarrhea", name: "Diarrhea", description: "Loose, watery bowel movements" },
      { id: "constipation", name: "Constipation", description: "Infrequent or difficult bowel movements" },
      { id: "vomiting", name: "Vomiting", description: "Forcible expulsion of stomach contents through the mouth" },
      { id: "acid-reflux", name: "Acid reflux", description: "Backward flow of stomach acid into the esophagus" },
    ],
  },
  left_arm: {
    id: "left_arm",
    name: "Left Arm",
    commonSymptoms: [
      { id: "arm-pain", name: "Arm pain", description: "Pain in the arm" },
      { id: "numbness", name: "Numbness", description: "Loss of sensation in the arm" },
      { id: "weakness", name: "Weakness", description: "Lack of strength in the arm" },
    ],
    allSymptoms: [
      { id: "arm-pain", name: "Arm pain", description: "Pain in the arm" },
      { id: "numbness", name: "Numbness", description: "Loss of sensation in the arm" },
      { id: "weakness", name: "Weakness", description: "Lack of strength in the arm" },
      { id: "tingling", name: "Tingling", description: "A pins and needles sensation in the arm" },
      { id: "stiffness", name: "Stiffness", description: "Difficulty moving the arm" },
      { id: "swelling", name: "Swelling", description: "Enlargement of the arm due to fluid accumulation" },
    ],
  },
  right_arm: {
    id: "right_arm",
    name: "Right Arm",
    commonSymptoms: [
      { id: "arm-pain", name: "Arm pain", description: "Pain in the arm" },
      { id: "numbness", name: "Numbness", description: "Loss of sensation in the arm" },
      { id: "weakness", name: "Weakness", description: "Lack of strength in the arm" },
    ],
    allSymptoms: [
      { id: "arm-pain", name: "Arm pain", description: "Pain in the arm" },
      { id: "numbness", name: "Numbness", description: "Loss of sensation in the arm" },
      { id: "weakness", name: "Weakness", description: "Lack of strength in the arm" },
      { id: "tingling", name: "Tingling", description: "A pins and needles sensation in the arm" },
      { id: "stiffness", name: "Stiffness", description: "Difficulty moving the arm" },
      { id: "swelling", name: "Swelling", description: "Enlargement of the arm due to fluid accumulation" },
    ],
  },
  left_leg: {
    id: "left_leg",
    name: "Left Leg",
    commonSymptoms: [
      { id: "leg-pain", name: "Leg pain", description: "Pain in the leg" },
      { id: "numbness", name: "Numbness", description: "Loss of sensation in the leg" },
      { id: "weakness", name: "Weakness", description: "Lack of strength in the leg" },
    ],
    allSymptoms: [
      { id: "leg-pain", name: "Leg pain", description: "Pain in the leg" },
      { id: "numbness", name: "Numbness", description: "Loss of sensation in the leg" },
      { id: "weakness", name: "Weakness", description: "Lack of strength in the leg" },
      { id: "swelling", name: "Swelling", description: "Enlargement of the leg due to fluid accumulation" },
      { id: "cramps", name: "Cramps", description: "Sudden, involuntary muscle contractions" },
      { id: "joint-pain", name: "Joint pain", description: "Pain in the knee or ankle joints" },
    ],
  },
  right_leg: {
    id: "right_leg",
    name: "Right Leg",
    commonSymptoms: [
      { id: "leg-pain", name: "Leg pain", description: "Pain in the leg" },
      { id: "numbness", name: "Numbness", description: "Loss of sensation in the leg" },
      { id: "weakness", name: "Weakness", description: "Lack of strength in the leg" },
    ],
    allSymptoms: [
      { id: "leg-pain", name: "Leg pain", description: "Pain in the leg" },
      { id: "numbness", name: "Numbness", description: "Loss of sensation in the leg" },
      { id: "weakness", name: "Weakness", description: "Lack of strength in the leg" },
      { id: "swelling", name: "Swelling", description: "Enlargement of the leg due to fluid accumulation" },
      { id: "cramps", name: "Cramps", description: "Sudden, involuntary muscle contractions" },
      { id: "joint-pain", name: "Joint pain", description: "Pain in the knee or ankle joints" },
    ],
  },
  // Add more body parts and their symptoms as needed
};

// Default symptoms for body parts not explicitly defined
const defaultSymptoms: BodyPartSymptoms = {
  id: "default",
  name: "Body Part",
  commonSymptoms: [
    { id: "pain", name: "Pain", description: "General pain in this area" },
    { id: "swelling", name: "Swelling", description: "Enlargement due to fluid accumulation" },
  ],
  allSymptoms: [
    { id: "pain", name: "Pain", description: "General pain in this area" },
    { id: "swelling", name: "Swelling", description: "Enlargement due to fluid accumulation" },
    { id: "redness", name: "Redness", description: "Reddening of the skin" },
    { id: "numbness", name: "Numbness", description: "Loss of sensation" },
    { id: "tingling", name: "Tingling", description: "A pins and needles sensation" },
  ],
};

const BodyModel: React.FC<BodyModelProps> = ({ onSymptomSelect, selectedSymptoms = [] }) => {
  const [partsInput, setPartsInput] = useState<PartsInput>({});
  const [selectedBodyPart, setSelectedBodyPart] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"common" | "all">("common");
  const [tempSelectedSymptoms, setTempSelectedSymptoms] = useState<SelectedSymptom[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Initialize with any previously selected symptoms
  useEffect(() => {
    if (selectedSymptoms.length > 0) {
      setTempSelectedSymptoms(selectedSymptoms);
      
      // Update body parts to show which ones have selected symptoms
      const parts: PartsInput = {};
      selectedSymptoms.forEach((symptom) => {
        if (symptom.bodyPartId) {
          parts[symptom.bodyPartId] = { selected: true };
        }
      });
      setPartsInput(parts);
    }
  }, [selectedSymptoms]);

  // Handle body part click
  const handleBodyPartClick = (id: string) => {
    setSelectedBodyPart(id);
    setIsModalOpen(true);
    
    // Pre-select symptoms for this body part
    const currentSymptoms = tempSelectedSymptoms.filter(
      (symptom) => symptom.bodyPartId === id
    );
    
    if (currentSymptoms.length > 0) {
      // If there are symptoms already selected for this body part, highlight the body part
      const updatedParts = { ...partsInput };
      updatedParts[id] = { selected: true };
      setPartsInput(updatedParts);
    }
  };

  // Handle symptom selection
  const handleSymptomSelect = (
    symptom: Symptom,
    isChecked: boolean,
    severity: "mild" | "moderate" | "severe" = "moderate"
  ) => {
    if (isChecked && selectedBodyPart) {
      // Add symptom if not already in the list
      if (
        !tempSelectedSymptoms.some(
          (s) => s.id === symptom.id && s.bodyPartId === selectedBodyPart
        )
      ) {
        setTempSelectedSymptoms([
          ...tempSelectedSymptoms,
          {
            ...symptom,
            severity,
            bodyPartId: selectedBodyPart,
          },
        ]);
      }
    } else {
      // Remove symptom
      setTempSelectedSymptoms(
        tempSelectedSymptoms.filter(
          (s) => !(s.id === symptom.id && s.bodyPartId === selectedBodyPart)
        )
      );
    }
  };

  // Handle symptom severity change
  const handleSeverityChange = (symptomId: string, severity: "mild" | "moderate" | "severe") => {
    setTempSelectedSymptoms(
      tempSelectedSymptoms.map((s) =>
        s.id === symptomId && s.bodyPartId === selectedBodyPart
          ? { ...s, severity }
          : s
      )
    );
  };

  // Handle saving symptoms
  const handleSaveSymptoms = () => {
    // Update the body parts input to show selected parts
    const updatedParts: PartsInput = {};
    
    tempSelectedSymptoms.forEach((symptom) => {
      if (symptom.bodyPartId) {
        updatedParts[symptom.bodyPartId] = { selected: true };
      }
    });
    
    setPartsInput(updatedParts);
    onSymptomSelect(tempSelectedSymptoms);
    setIsModalOpen(false);
  };

  // Check if a symptom is selected
  const isSymptomSelected = (symptomId: string) => {
    return tempSelectedSymptoms.some(
      (s) => s.id === symptomId && s.bodyPartId === selectedBodyPart
    );
  };

  // Get symptom severity
  const getSymptomSeverity = (symptomId: string) => {
    const symptom = tempSelectedSymptoms.find(
      (s) => s.id === symptomId && s.bodyPartId === selectedBodyPart
    );
    return symptom ? symptom.severity : "moderate";
  };

  // Filter symptoms based on search query
  const filterSymptoms = (symptoms: Symptom[]) => {
    if (!searchQuery) return symptoms;
    return symptoms.filter((s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  // Get the current body part's symptoms
  const getCurrentBodyPartSymptoms = () => {
    if (!selectedBodyPart) return defaultSymptoms;
    return bodyPartSymptoms[selectedBodyPart] ?? defaultSymptoms;
  };

  // Get the name of the currently selected body part
  const getSelectedBodyPartName = () => {
    if (!selectedBodyPart) return "Body Part";
    return bodyPartNames[selectedBodyPart] ?? selectedBodyPart;
  };

  return (
    <div className="flex flex-col items-center">
      <div className="mb-4 text-center text-sm text-gray-500 dark:text-gray-400">
        Click on a body part to select symptoms
      </div>
      
      <div className={`relative w-full max-w-md ${isModalOpen ? 'opacity-0' : 'opacity-100'}`}>
        <div className="flex justify-center">
          <div className="w-64 sm:w-80 relative">
            <BodyComponent
              partsInput={partsInput}
              onClick={handleBodyPartClick}
            />
          </div>
        </div>
      </div>
      
      {tempSelectedSymptoms.length > 0 && (
        <div className="mt-6 w-full max-w-md rounded-md bg-white p-4 shadow-md dark:bg-gray-800">
          <h3 className="mb-2 text-lg font-semibold text-gray-800 dark:text-white">
            Selected Symptoms
          </h3>
          <ul className="space-y-2">
            {tempSelectedSymptoms.map((symptom) => (
              <li 
                key={`${symptom.bodyPartId}-${symptom.id}`}
                className="flex items-center justify-between rounded-md bg-gray-50 p-2 dark:bg-gray-700"
              >
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    {symptom.name}
                  </span>
                  <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                    ({bodyPartNames[symptom.bodyPartId] ?? symptom.bodyPartId})
                  </span>
                </div>
                <span className={`text-sm rounded-full px-2 py-1 
                  ${symptom.severity === 'mild' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' : 
                   symptom.severity === 'moderate' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' : 
                   'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}>
                  {symptom.severity}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Symptom Selection Modal */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Select Symptoms"
        ariaHideApp={false}
        style={{
          overlay: {
            zIndex: 9999,
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.85)'
          },
          content: {
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            maxWidth: '500px',
            width: '90%',
            maxHeight: '90vh',
            overflow: 'auto',
            padding: '0',
            border: 'none',
            borderRadius: '0.5rem',
            backgroundColor: 'transparent'
          }
        }}
      >
        <div className="relative mx-auto max-h-[90vh] w-full max-w-md overflow-y-auto rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
          <button
            className="absolute right-4 top-4 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
            onClick={() => setIsModalOpen(false)}
          >
            <svg
              className="h-6 w-6"
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
          
          <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
            {getSelectedBodyPartName()} Symptoms
          </h2>
          
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search symptoms..."
              className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="mb-4">
            <div className="flex border-b border-gray-200 dark:border-gray-700">
              <button
                className={`py-2 px-4 font-medium ${
                  activeTab === "common"
                    ? "border-b-2 border-teal-500 text-teal-500 dark:border-teal-400 dark:text-teal-400"
                    : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                }`}
                onClick={() => setActiveTab("common")}
              >
                Common
              </button>
              <button
                className={`py-2 px-4 font-medium ${
                  activeTab === "all"
                    ? "border-b-2 border-teal-500 text-teal-500 dark:border-teal-400 dark:text-teal-400"
                    : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                }`}
                onClick={() => setActiveTab("all")}
              >
                All
              </button>
            </div>
          </div>
          
          <div className="space-y-4">
            {filterSymptoms(
              activeTab === "common"
                ? getCurrentBodyPartSymptoms().commonSymptoms
                : getCurrentBodyPartSymptoms().allSymptoms
            ).map((symptom) => (
              <div
                key={symptom.id}
                className="rounded-md border border-gray-200 p-3 dark:border-gray-700"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center">
                    <input
                      id={`symptom-${symptom.id}`}
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500 dark:border-gray-600 dark:focus:ring-teal-600"
                      checked={isSymptomSelected(symptom.id)}
                      onChange={(e) =>
                        handleSymptomSelect(symptom, e.target.checked)
                      }
                    />
                    <label
                      htmlFor={`symptom-${symptom.id}`}
                      className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100"
                    >
                      {symptom.name}
                    </label>
                  </div>
                </div>
                
                <p className="mt-1 ml-6 text-xs text-gray-500 dark:text-gray-400">
                  {symptom.description}
                </p>
                
                {isSymptomSelected(symptom.id) && (
                  <div className="mt-2 ml-6">
                    <p className="mb-1 text-xs font-medium text-gray-700 dark:text-gray-300">
                      Severity:
                    </p>
                    <div className="flex space-x-2">
                      <button
                        className={`rounded px-2 py-1 text-xs ${
                          getSymptomSeverity(symptom.id) === "mild"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                        }`}
                        onClick={() => handleSeverityChange(symptom.id, "mild")}
                      >
                        Mild
                      </button>
                      <button
                        className={`rounded px-2 py-1 text-xs ${
                          getSymptomSeverity(symptom.id) === "moderate"
                            ? "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                        }`}
                        onClick={() => handleSeverityChange(symptom.id, "moderate")}
                      >
                        Moderate
                      </button>
                      <button
                        className={`rounded px-2 py-1 text-xs ${
                          getSymptomSeverity(symptom.id) === "severe"
                            ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                        }`}
                        onClick={() => handleSeverityChange(symptom.id, "severe")}
                      >
                        Severe
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
            
            {filterSymptoms(
              activeTab === "common"
                ? getCurrentBodyPartSymptoms().commonSymptoms
                : getCurrentBodyPartSymptoms().allSymptoms
            ).length === 0 && (
              <div className="text-center text-gray-500 dark:text-gray-400">
                No symptoms match your search.
              </div>
            )}
          </div>
          
          <div className="mt-6 flex justify-end">
            <button
              className="mr-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </button>
            <button
              className="rounded-md bg-teal-500 px-4 py-2 text-sm font-medium text-white hover:bg-teal-600 dark:bg-teal-600 dark:hover:bg-teal-700"
              onClick={handleSaveSymptoms}
            >
              Add Symptoms
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default BodyModel; 