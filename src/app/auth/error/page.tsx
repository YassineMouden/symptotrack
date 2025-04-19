"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function AuthError() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const errorMessages: Record<string, string> = {
    Configuration: 
      "There is a problem with the server configuration. Please contact support.",
    AccessDenied: 
      "You do not have permission to sign in.",
    Verification: 
      "The verification link may have been used or has expired.",
    Default: 
      "An error occurred during authentication. Please try again.",
  };

  const errorMessage = error ? (errorMessages[error] || errorMessages.Default) : errorMessages.Default;

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <div className="rounded-lg bg-white p-8 shadow-lg dark:bg-gray-800">
        <div className="mb-6 flex flex-col items-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-500 dark:bg-red-900/50 dark:text-red-300">
            <svg
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Authentication Error
          </h2>
        </div>
        
        <p className="mb-6 text-center text-gray-600 dark:text-gray-300">
          {errorMessage}
        </p>
        
        <div className="flex justify-center space-x-4">
          <Link
            href="/auth/signin"
            className="rounded-md bg-teal-500 px-4 py-2 text-center text-sm font-medium text-white hover:bg-teal-600 dark:bg-teal-600 dark:hover:bg-teal-700"
          >
            Back to Sign In
          </Link>
          <Link
            href="/"
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-center text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
          >
            Go to Home
          </Link>
        </div>
      </div>
    </div>
  );
} 