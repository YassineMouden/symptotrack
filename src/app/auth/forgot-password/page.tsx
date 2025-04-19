"use client";

import { useState } from "react";
import Link from "next/link";

interface ApiErrorResponse {
  message: string;
}

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    
    try {
      // Call API to send password reset email
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      
      if (!response.ok) {
        const data = await response.json() as ApiErrorResponse;
        throw new Error(data.message ?? "Something went wrong");
      }
      
      setIsSubmitted(true);
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("An error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="mx-auto max-w-md px-4 py-8">
      <h1 className="mb-2 text-center text-3xl font-bold text-gray-800 dark:text-white">
        Reset Your Password
      </h1>
      <p className="mb-8 text-center text-lg text-teal-600 dark:text-teal-400">
        We&apos;ll send you a link to reset your password
      </p>
      
      {errorMessage && (
        <div className="mb-4 rounded-md bg-red-50 p-4 text-red-800 dark:bg-red-900/30 dark:text-red-300">
          <p>{errorMessage}</p>
        </div>
      )}
      
      <div className="mb-6 rounded-lg bg-white p-8 shadow-lg dark:bg-gray-800">
        {isSubmitted ? (
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-500 dark:bg-green-900/50 dark:text-green-300">
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
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="mb-2 text-xl font-semibold text-gray-800 dark:text-white">
              Check your email
            </h2>
            <p className="mb-4 text-gray-600 dark:text-gray-300">
              We sent an email to <span className="font-medium">{email}</span> with a link to reset your password.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              If you don&apos;t see it, please check your spam folder.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-md border border-gray-300 p-3 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                placeholder="your@email.com"
              />
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-md bg-teal-500 px-4 py-3 text-center font-medium text-white hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 disabled:opacity-70 dark:bg-teal-600 dark:hover:bg-teal-700"
            >
              {isLoading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        )}
      </div>
      
      <div className="text-center">
        <Link
          href="/auth/signin"
          className="text-sm font-medium text-teal-600 hover:text-teal-500 dark:text-teal-400 dark:hover:text-teal-300"
        >
          Back to Sign In
        </Link>
      </div>
    </div>
  );
} 