"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Verify token on page load
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setIsValid(false);
        setErrorMessage("Invalid or missing reset token");
        return;
      }
      
      try {
        const response = await fetch(`/api/auth/verify-reset-token?token=${token}`);
        const data = await response.json();
        
        if (!response.ok) {
          setIsValid(false);
          setErrorMessage(data.message || "Invalid or expired token");
        } else {
          setIsValid(true);
        }
      } catch (error) {
        console.error("Error verifying token:", error);
        setIsValid(false);
        setErrorMessage("An error occurred while verifying your token");
      }
    };
    
    verifyToken();
  }, [token]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    
    // Validate passwords match
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      setIsLoading(false);
      return;
    }
    
    // Validate password strength
    if (password.length < 8) {
      setErrorMessage("Password must be at least 8 characters");
      setIsLoading(false);
      return;
    }
    
    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Failed to reset password");
      }
      
      setIsSuccess(true);
      
      // Redirect to sign in page after 3 seconds
      setTimeout(() => {
        router.push("/auth/signin");
      }, 3000);
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("An error occurred during password reset");
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  // Render loading state
  if (isValid === null) {
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
            <p className="mt-4 text-gray-600 dark:text-gray-300">Verifying reset token...</p>
          </div>
        </div>
      </div>
    );
  }
  
  // Render invalid token state
  if (!isValid) {
    return (
      <div className="mx-auto max-w-md px-4 py-8">
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
              Invalid Reset Link
            </h2>
          </div>
          
          <p className="mb-6 text-center text-gray-600 dark:text-gray-300">
            {errorMessage || "This password reset link is invalid or has expired."}
          </p>
          
          <div className="text-center">
            <Link
              href="/auth/forgot-password"
              className="rounded-md bg-teal-500 px-4 py-2 text-center text-sm font-medium text-white hover:bg-teal-600 dark:bg-teal-600 dark:hover:bg-teal-700"
            >
              Request New Reset Link
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  // Render success state
  if (isSuccess) {
    return (
      <div className="mx-auto max-w-md px-4 py-8">
        <div className="rounded-lg bg-white p-8 shadow-lg dark:bg-gray-800">
          <div className="mb-6 flex flex-col items-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-500 dark:bg-green-900/50 dark:text-green-300">
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
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Password Reset Complete
            </h2>
          </div>
          
          <p className="mb-6 text-center text-gray-600 dark:text-gray-300">
            Your password has been successfully reset. You will be redirected to the sign in page in a moment.
          </p>
          
          <div className="text-center">
            <Link
              href="/auth/signin"
              className="rounded-md bg-teal-500 px-4 py-2 text-center text-sm font-medium text-white hover:bg-teal-600 dark:bg-teal-600 dark:hover:bg-teal-700"
            >
              Sign In Now
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  // Render reset password form
  return (
    <div className="mx-auto max-w-md px-4 py-8">
      <h1 className="mb-2 text-center text-3xl font-bold text-gray-800 dark:text-white">
        Reset Your Password
      </h1>
      <p className="mb-8 text-center text-lg text-teal-600 dark:text-teal-400">
        Please enter a new password for your account
      </p>
      
      {errorMessage && (
        <div className="mb-4 rounded-md bg-red-50 p-4 text-red-800 dark:bg-red-900/30 dark:text-red-300">
          <p>{errorMessage}</p>
        </div>
      )}
      
      <div className="rounded-lg bg-white p-8 shadow-lg dark:bg-gray-800">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              New Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className="w-full rounded-md border border-gray-300 p-3 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              placeholder="••••••••"
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Password must be at least 8 characters
            </p>
          </div>
          
          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Confirm New Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full rounded-md border border-gray-300 p-3 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              placeholder="••••••••"
            />
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-md bg-teal-500 px-4 py-3 text-center font-medium text-white hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 disabled:opacity-70 dark:bg-teal-600 dark:hover:bg-teal-700"
          >
            {isLoading ? "Resetting Password..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
} 