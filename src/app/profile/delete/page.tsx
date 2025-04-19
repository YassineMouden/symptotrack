"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

interface ApiErrorResponse {
  message: string;
}

export default function DeleteAccountPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [confirmText, setConfirmText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Redirect to login if not authenticated
  if (status === "unauthenticated") {
    router.push("/auth/signin");
    return null;
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    
    if (confirmText !== "DELETE") {
      setErrorMessage("Please type DELETE to confirm account deletion");
      setIsLoading(false);
      return;
    }
    
    try {
      const response = await fetch("/api/user/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ confirmText }),
      });
      
      if (!response.ok) {
        const data = await response.json() as ApiErrorResponse;
        throw new Error(data.message ?? "Failed to delete account");
      }
      
      // Sign out the user after successful deletion
      await signOut({ redirect: false });
      
      // Redirect to home page with deletion message
      router.push("/?deleted=true");
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("An error occurred during account deletion");
      }
      setIsLoading(false);
    }
  };
  
  // Loading state
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
            <p className="mt-4 text-gray-600 dark:text-gray-300">Loading...</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="mx-auto max-w-md px-4 py-8">
      <h1 className="mb-2 text-center text-3xl font-bold text-gray-800 dark:text-white">
        Delete Your Account
      </h1>
      <p className="mb-8 text-center text-lg text-red-600 dark:text-red-400">
        This action cannot be undone
      </p>
      
      {errorMessage && (
        <div className="mb-4 rounded-md bg-red-50 p-4 text-red-800 dark:bg-red-900/30 dark:text-red-300">
          <p>{errorMessage}</p>
        </div>
      )}
      
      <div className="rounded-lg bg-white p-8 shadow-lg dark:bg-gray-800">
        <div className="mb-6 rounded-md bg-amber-50 p-4 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
          <h2 className="mb-2 font-bold">Warning:</h2>
          <ul className="list-inside list-disc space-y-1">
            <li>All your personal data will be permanently deleted</li>
            <li>All your tracking history will be lost</li>
            <li>Your symptom records cannot be recovered</li>
            <li>All connected accounts will be unlinked</li>
          </ul>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="confirmText"
              className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Type <span className="font-bold">DELETE</span> to confirm
            </label>
            <input
              id="confirmText"
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              required
              className="w-full rounded-md border border-gray-300 p-3 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              placeholder="DELETE"
            />
          </div>
          
          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={isLoading || confirmText !== "DELETE"}
              className="flex-1 rounded-md bg-red-600 px-4 py-3 text-center font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-70 dark:bg-red-700 dark:hover:bg-red-800"
            >
              {isLoading ? "Deleting..." : "Delete Account"}
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