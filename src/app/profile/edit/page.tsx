"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";

interface ApiResponse {
  message: string;
  user?: {
    id: string;
    name: string | null;
    email: string | null;
    age?: number;
    sex?: string;
    image?: string | null;
  };
}

export default function ProfileEditPage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  
  const [name, setName] = useState("");
  const [age, setAge] = useState<string>("");
  const [sex, setSex] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Load user data when session is available
  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      setName(session.user.name ?? "");
      setAge(session.user.age?.toString() ?? "");
      setSex(session.user.sex ?? "");
    } else if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [session, status, router]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setIsSaved(false);
    setErrorMessage(null);
    
    try {
      // Convert age to number if provided
      const ageNumber = age ? parseInt(age, 10) : undefined;
      
      // Call API to update user profile
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name, 
          age: ageNumber, 
          sex 
        }),
      });
      
      if (!response.ok) {
        const data: ApiResponse = await response.json();
        throw new Error(data.message ?? "Failed to update profile");
      }
      
      // Update session with new user data
      await update({
        ...session,
        user: {
          ...session?.user,
          name,
          age: ageNumber,
          sex,
        },
      });
      
      setIsSaved(true);
      
      // Reset saved message after 3 seconds
      setTimeout(() => {
        setIsSaved(false);
      }, 3000);
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("An error occurred while updating your profile");
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  if (status === "loading") {
    return (
      <div className="mx-auto max-w-md px-4 py-8">
        <div className="flex h-64 items-center justify-center">
          <div className="text-center">
            <svg
              className="mx-auto h-12 w-12 animate-spin text-teal-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <p className="mt-4 text-gray-600 dark:text-gray-300">Loading your profile...</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="mx-auto max-w-md px-4 py-8">
      <h1 className="mb-2 text-center text-3xl font-bold text-gray-800 dark:text-white">
        Edit Your Profile
      </h1>
      <p className="mb-8 text-center text-lg text-teal-600 dark:text-teal-400">
        Update your personal information
      </p>
      
      {errorMessage && (
        <div className="mb-4 rounded-md bg-red-50 p-4 text-red-800 dark:bg-red-900/30 dark:text-red-300">
          <p>{errorMessage}</p>
        </div>
      )}
      
      {isSaved && (
        <div className="mb-4 rounded-md bg-green-50 p-4 text-green-800 dark:bg-green-900/30 dark:text-green-300">
          <p>Your profile has been updated successfully!</p>
        </div>
      )}
      
      <div className="rounded-lg bg-white p-8 shadow-lg dark:bg-gray-800">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="name"
              className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Full Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-md border border-gray-300 p-3 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              placeholder="John Doe"
            />
          </div>
          
          <div>
            <label
              htmlFor="age"
              className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Age
            </label>
            <input
              id="age"
              type="number"
              min="1"
              max="120"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="w-full rounded-md border border-gray-300 p-3 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              placeholder="30"
            />
          </div>
          
          <div>
            <label
              htmlFor="sex"
              className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Sex
            </label>
            <select
              id="sex"
              value={sex}
              onChange={(e) => setSex(e.target.value)}
              className="w-full rounded-md border border-gray-300 p-3 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              <option value="">Prefer not to say</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 rounded-md bg-teal-500 px-4 py-3 text-center font-medium text-white hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 disabled:opacity-70 dark:bg-teal-600 dark:hover:bg-teal-700"
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </button>
            
            <Link
              href="/profile"
              className="flex-1 rounded-md border border-gray-300 bg-white px-4 py-3 text-center font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
} 