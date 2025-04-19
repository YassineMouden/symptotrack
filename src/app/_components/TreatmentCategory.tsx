"use client";

import type { ReactNode } from 'react';

interface TreatmentItem {
  title: string;
  description: string;
}

interface TreatmentCategoryProps {
  icon: ReactNode;
  title: string;
  items: TreatmentItem[];
  colorClass: string;
  iconBgClass: string;
}

export default function TreatmentCategory({
  icon,
  title,
  items,
  colorClass,
  iconBgClass
}: TreatmentCategoryProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="mb-4 flex items-center">
        <div className={`mr-3 flex h-10 w-10 items-center justify-center rounded-full ${iconBgClass}`}>
          {icon}
        </div>
        <h3 className={`text-lg font-semibold ${colorClass}`}>
          {title}
        </h3>
      </div>
      
      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={index} className="rounded-md bg-gray-50 p-3 transition-all hover:bg-gray-100 dark:bg-gray-700/50 dark:hover:bg-gray-700">
            <p className="font-medium text-gray-700 dark:text-gray-200">{item.title}</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">{item.description}</p>
          </div>
        ))}
        
        {items.length === 0 && (
          <div className="rounded-md bg-gray-50 p-3 text-center dark:bg-gray-700/50">
            <p className="text-sm text-gray-500 dark:text-gray-400">No specific recommendations available</p>
          </div>
        )}
      </div>
    </div>
  );
} 