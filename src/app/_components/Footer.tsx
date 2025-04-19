"use client";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white py-6 text-center text-sm text-gray-500 shadow-inner dark:bg-gray-800 dark:text-gray-400">
      <div className="container mx-auto px-4">
        <p className="mb-2">
          <strong>Medical Disclaimer:</strong> The information provided by SymptoTrack is not medical advice and should not replace consultation with healthcare professionals.
        </p>
        <p>
          © {currentYear} SymptoTrack. All rights reserved.
        </p>
      </div>
    </footer>
  );
} 