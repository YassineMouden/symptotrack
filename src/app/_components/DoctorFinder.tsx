"use client";

import { useState } from 'react';

interface DoctorFinderProps {
  conditionName: string;
}

interface Facility {
  id: string;
  name: string;
  specialty: string;
  distance: number;
  address: string;
  phone: string;
  rating: number;
}

// Demo data for medical facilities
const DEMO_FACILITIES: Facility[] = [
  {
    id: "1",
    name: "City Medical Center",
    specialty: "General Practice",
    distance: 1.2,
    address: "123 Main St, Anytown, USA",
    phone: "(555) 123-4567",
    rating: 4.8
  },
  {
    id: "2",
    name: "University Hospital",
    specialty: "Specialized Care",
    distance: 3.5,
    address: "456 College Ave, Anytown, USA",
    phone: "(555) 987-6543",
    rating: 4.9
  },
  {
    id: "3",
    name: "Community Health Clinic",
    specialty: "Family Medicine",
    distance: 0.8,
    address: "789 Oak St, Anytown, USA",
    phone: "(555) 456-7890",
    rating: 4.6
  }
];

export default function DoctorFinder({ conditionName }: DoctorFinderProps) {
  const [zipCode, setZipCode] = useState('');
  const [distance, setDistance] = useState('10');
  const [specialty, setSpecialty] = useState('');
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  
  // Handle search submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would call an API to find medical facilities
    // For demo purposes, we'll just show the demo data
    setSearchPerformed(true);
    setFacilities(DEMO_FACILITIES);
  };
  
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white">
        Find Medical Help Near You
      </h3>
      
      <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">
        Search for healthcare providers who can help with <span className="font-medium">{conditionName}</span> in your area.
      </p>
      
      <form onSubmit={handleSearch} className="mb-6">
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label htmlFor="zipCode" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Your ZIP/Postal Code
            </label>
            <input
              type="text"
              id="zipCode"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              className="w-full rounded-md border border-gray-300 p-2 text-gray-800 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              placeholder="Enter ZIP code"
              required
            />
          </div>
          
          <div>
            <label htmlFor="distance" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Distance (miles)
            </label>
            <select
              id="distance"
              value={distance}
              onChange={(e) => setDistance(e.target.value)}
              className="w-full rounded-md border border-gray-300 p-2 text-gray-800 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              <option value="5">5 miles</option>
              <option value="10">10 miles</option>
              <option value="25">25 miles</option>
              <option value="50">50 miles</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="specialty" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Specialty (optional)
            </label>
            <input
              type="text"
              id="specialty"
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              className="w-full rounded-md border border-gray-300 p-2 text-gray-800 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              placeholder="e.g., Dermatology"
            />
          </div>
        </div>
        
        <button
          type="submit"
          className="mt-4 inline-flex items-center rounded-md bg-teal-500 px-4 py-2 text-sm font-medium text-white hover:bg-teal-600 dark:bg-teal-600 dark:hover:bg-teal-700"
        >
          <svg className="mr-2 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
          </svg>
          Find Healthcare Providers
        </button>
      </form>
      
      {searchPerformed && (
        <div>
          <h4 className="mb-3 font-medium text-gray-800 dark:text-white">
            Medical Facilities Near {zipCode}
          </h4>
          
          {facilities.length > 0 ? (
            <div className="space-y-4">
              {facilities.map(facility => (
                <div key={facility.id} className="rounded-md border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-750">
                  <div className="flex items-start justify-between">
                    <div>
                      <h5 className="font-medium text-gray-800 dark:text-white">
                        {facility.name}
                      </h5>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {facility.specialty} • {facility.distance} miles away
                      </p>
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        {facility.address}
                      </p>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="flex items-center">
                        <svg className="mr-1 h-4 w-4 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="text-sm font-medium">{facility.rating}/5.0</span>
                      </div>
                      <a 
                        href={`tel:${facility.phone}`}
                        className="mt-2 inline-flex items-center rounded-md bg-teal-50 px-2 py-1 text-xs font-medium text-teal-700 dark:bg-teal-900/30 dark:text-teal-300"
                      >
                        <svg className="mr-1 h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                        </svg>
                        {facility.phone}
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">No facilities found in your area. Try expanding your search radius.</p>
          )}
          
          <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">
            <strong>Note:</strong> This is a demonstration only. In a complete implementation, this would connect to a real healthcare provider database.
          </p>
        </div>
      )}
    </div>
  );
} 