"use client";

import { useState } from 'react';
import type { ConditionPrediction } from '~/utils/ai';
import type { SelectedSymptom } from '~/app/_components/BodyModel';

interface TreatmentActionsProps {
  conditions: ConditionPrediction[];
  symptoms: SelectedSymptom[];
  userInfo: {
    age?: number;
    sex?: string;
  };
}

export default function TreatmentActions({ conditions, symptoms, userInfo }: TreatmentActionsProps) {
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  
  // Generate treatment report text
  const generateReportText = (): string => {
    if (conditions.length === 0) {
      return "No conditions to report.";
    }
    
    const topCondition = conditions[0];
    // Validate that topCondition exists and has all required properties
    if (!topCondition?.name || !topCondition?.description || 
        !topCondition?.treatmentApproaches || !topCondition?.whenToSeeDoctor) {
      return "Incomplete condition data.";
    }
    
    let report = `TREATMENT REPORT\n\n`;
    report += `Patient Information:\n`;
    report += `Age: ${userInfo.age ?? 'Not specified'}\n`;
    report += `Sex: ${userInfo.sex ? userInfo.sex.charAt(0).toUpperCase() + userInfo.sex.slice(1) : 'Not specified'}\n\n`;
    
    report += `Reported Symptoms (${symptoms.length}):\n`;
    symptoms.forEach(symptom => {
      report += `- ${symptom.name} (${symptom.severity})\n`;
    });
    report += `\n`;
    
    report += `Primary Condition: ${topCondition.name}\n`;
    report += `Confidence: ${Math.round(topCondition.confidence * 100)}%\n`;
    report += `Description: ${topCondition.description}\n\n`;
    
    report += `Treatment Approaches:\n`;
    topCondition.treatmentApproaches.forEach(treatment => {
      report += `- ${treatment}\n`;
    });
    report += `\n`;
    
    report += `When to See a Doctor:\n`;
    topCondition.whenToSeeDoctor.forEach(advice => {
      report += `- ${advice}\n`;
    });
    report += `\n`;
    
    report += `MEDICAL DISCLAIMER: This information is provided for educational purposes only and is not intended as medical advice. Always consult with a healthcare professional for diagnosis and treatment of medical conditions.`;
    
    return report;
  };
  
  // Handle print report
  const handlePrint = () => {
    if (conditions.length === 0) return;
    
    const reportContent = generateReportText();
    const printWindow = window.open('', '_blank');
    
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>SymptoTrack Treatment Report</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                margin: 20px;
              }
              h1 {
                color: #0d9488;
                border-bottom: 1px solid #ccc;
                padding-bottom: 10px;
              }
              .section {
                margin-bottom: 20px;
              }
              .section-title {
                font-weight: bold;
                margin-bottom: 5px;
              }
              .disclaimer {
                background-color: #f0f9ff;
                padding: 10px;
                border-radius: 5px;
                font-size: 12px;
                margin-top: 30px;
              }
            </style>
          </head>
          <body>
            <h1>SymptoTrack Treatment Report</h1>
            
            <div class="section">
              <div class="section-title">Patient Information:</div>
              <div>Age: ${userInfo.age ?? 'Not specified'}</div>
              <div>Sex: ${userInfo.sex ? userInfo.sex.charAt(0).toUpperCase() + userInfo.sex.slice(1) : 'Not specified'}</div>
            </div>
            
            <div class="section">
              <div class="section-title">Reported Symptoms (${symptoms.length}):</div>
              <ul>
                ${symptoms.map(s => `<li>${s.name} (${s.severity})</li>`).join('')}
              </ul>
            </div>
            
            <div class="section">
              <div class="section-title">Primary Condition: ${conditions[0]?.name ?? 'Unknown'}</div>
              <div>Confidence: ${Math.round(conditions[0]?.confidence ?? 0 * 100)}%</div>
              <div>Description: ${conditions[0]?.description ?? 'No description available'}</div>
            </div>
            
            <div class="section">
              <div class="section-title">Treatment Approaches:</div>
              <ul>
                ${conditions[0]?.treatmentApproaches.map(t => `<li>${t}</li>`).join('') ?? '<li>No treatment approaches available</li>'}
              </ul>
            </div>
            
            <div class="section">
              <div class="section-title">When to See a Doctor:</div>
              <ul>
                ${conditions[0]?.whenToSeeDoctor.map(a => `<li>${a}</li>`).join('') ?? '<li>Consult with a healthcare professional</li>'}
              </ul>
            </div>
            
            <div class="disclaimer">
              <strong>MEDICAL DISCLAIMER:</strong> This information is provided for educational purposes only and is not intended as medical advice. 
              Always consult with a healthcare professional for diagnosis and treatment of medical conditions.
            </div>
          </body>
        </html>
      `);
      
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    }
  };
  
  // Handle download report
  const handleDownload = () => {
    const reportContent = generateReportText();
    const filename = `symptotrack_report_${new Date().toISOString().split('T')[0]}.txt`;
    
    const element = document.createElement('a');
    const file = new Blob([reportContent], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };
  
  // Handle email form submission
  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real application, this would send the report via an API
    // For demo purposes, we'll just simulate sending
    setTimeout(() => {
      setEmailSent(true);
      setTimeout(() => {
        setShowEmailForm(false);
        setEmailSent(false);
      }, 3000);
    }, 1000);
  };
  
  // Handle share report
  const handleShare = async () => {
    if (conditions.length === 0) return;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'SymptoTrack Treatment Report',
          text: `Check out my SymptoTrack treatment report for ${conditions[0]?.name ?? 'my condition'}.`,
          url: window.location.href,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback if Web Share API is not available
      setShowEmailForm(true);
    }
  };
  
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="mb-4 flex items-center text-teal-600 dark:text-teal-400">
        <svg className="mr-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
        </svg>
        <h3 className="text-lg font-semibold">
          Save or Share Your Treatment Report
        </h3>
      </div>
      
      {showEmailForm ? (
        <div className="mb-4 rounded-md bg-gray-50 p-4 dark:bg-gray-750">
          {emailSent ? (
            <div className="text-center text-green-600 dark:text-green-400">
              <svg className="mx-auto mb-2 h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <p>Report sent to {email}!</p>
            </div>
          ) : (
            <form onSubmit={handleEmailSubmit}>
              <p className="mb-3 text-sm text-gray-600 dark:text-gray-300">
                Enter an email address to send your treatment report:
              </p>
              <div className="flex">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 rounded-l-md border border-gray-300 p-2 text-gray-800 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  placeholder="your@email.com"
                  required
                />
                <button
                  type="submit"
                  className="rounded-r-md bg-teal-500 px-4 py-2 text-sm font-medium text-white hover:bg-teal-600 dark:bg-teal-600 dark:hover:bg-teal-700"
                >
                  Send
                </button>
              </div>
              <div className="mt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowEmailForm(false)}
                  className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <button
            onClick={handlePrint}
            className="flex flex-col items-center rounded-md border border-gray-200 p-3 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-750"
          >
            <svg className="mb-1 h-6 w-6 text-gray-600 dark:text-gray-300" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clipRule="evenodd" />
            </svg>
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Print</span>
          </button>
          
          <button
            onClick={handleDownload}
            className="flex flex-col items-center rounded-md border border-gray-200 p-3 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-750"
          >
            <svg className="mb-1 h-6 w-6 text-gray-600 dark:text-gray-300" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Download</span>
          </button>
          
          <button
            onClick={handleShare}
            className="flex flex-col items-center rounded-md border border-gray-200 p-3 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-750"
          >
            <svg className="mb-1 h-6 w-6 text-gray-600 dark:text-gray-300" viewBox="0 0 20 20" fill="currentColor">
              <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
            </svg>
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Share</span>
          </button>
          
          <button
            onClick={() => setShowEmailForm(true)}
            className="flex flex-col items-center rounded-md border border-gray-200 p-3 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-750"
          >
            <svg className="mb-1 h-6 w-6 text-gray-600 dark:text-gray-300" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
            </svg>
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Email</span>
          </button>
        </div>
      )}
      
      <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">
        You can save this information for your records or share it with your healthcare provider. Remember that this is not a medical diagnosis.
      </p>
    </div>
  );
} 