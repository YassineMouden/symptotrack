"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { format } from "date-fns";

interface SymptomHistory {
  id: string;
  date: Date;
  completed: boolean;
  symptoms: { name: string; severity: string }[];
  conditions: { name: string; confidence: number }[];
}

interface HistoryResponse {
  history: SymptomHistory[];
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState<SymptomHistory[]>([]);
  const [recentSymptoms, setRecentSymptoms] = useState<Record<string, number>>({});

  // Fetch user's symptom history
  useEffect(() => {
    const fetchHistory = async () => {
      if (status === "authenticated" && session?.user) {
        try {
          const response = await fetch("/api/user/history");
          if (response.ok) {
            const data = await response.json() as HistoryResponse;
            setHistory(data.history);
            
            // Calculate most frequent symptoms
            const symptomCounts: Record<string, number> = {};
            data.history.forEach((check) => {
              check.symptoms.forEach(symptom => {
                symptomCounts[symptom.name] = (symptomCounts[symptom.name] ?? 0) + 1;
              });
            });
            setRecentSymptoms(symptomCounts);
          }
        } catch (error) {
          console.error("Failed to fetch history:", error instanceof Error ? error.message : String(error));
        } finally {
          setLoading(false);
        }
      } else if (status === "unauthenticated") {
        // Redirect to sign-in page if user is not authenticated
        router.push("/auth/signin?callbackUrl=/profile");
      } else if (status === "loading") {
        // Do nothing while loading
        return;
      }
    };

    void fetchHistory();
  }, [status, router, session]);

  // Handle sign out
  const handleSignOut = async () => {
    await signOut({ redirect: true, callbackUrl: "/" });
  };

  if (status === "loading" || loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8">
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

  // Get the top 5 most frequent symptoms
  const topSymptoms = Object.entries(recentSymptoms)
    .sort(([, countA], [, countB]) => countB - countA)
    .slice(0, 5);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-2 text-center text-3xl font-bold text-gray-800 dark:text-white">
        Your Profile
      </h1>
      <p className="mb-8 text-center text-xl text-teal-600 dark:text-teal-400">
        Track your symptoms, understand your health
      </p>

      <div className="grid gap-8 md:grid-cols-3">
        {/* Profile Info */}
        <div className="col-span-1 rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 h-24 w-24 overflow-hidden rounded-full bg-teal-100 dark:bg-teal-900/50">
              {session?.user?.image ? (
                <img
                  src={session.user.image}
                  alt={session.user.name ?? "User"}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-3xl font-bold text-teal-500">
                  {session?.user?.name?.substring(0, 1) ?? "U"}
                </div>
              )}
            </div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
              {session?.user?.name ?? "User"}
            </h2>
            <p className="text-gray-600 dark:text-gray-300">{session?.user?.email}</p>
          </div>

          <div className="mb-6 space-y-3">
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Age</h3>
              <p className="text-gray-800 dark:text-white">{session?.user?.age ?? "Not specified"}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Sex</h3>
              <p className="text-gray-800 dark:text-white">
                {session?.user?.sex 
                  ? session.user.sex.charAt(0).toUpperCase() + session.user.sex.slice(1)
                  : "Not specified"}
              </p>
            </div>
          </div>

          {/* Frequent Symptoms Section */}
          {topSymptoms.length > 0 && (
            <div className="mb-6">
              <h3 className="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                Your Most Frequent Symptoms
              </h3>
              <div className="space-y-2">
                {topSymptoms.map(([name, count]) => (
                  <div key={name} className="flex items-center justify-between">
                    <span className="text-gray-800 dark:text-white">{name}</span>
                    <span className="rounded-full bg-teal-100 px-2 py-1 text-xs font-medium text-teal-800 dark:bg-teal-900/50 dark:text-teal-300">
                      {count} {count === 1 ? "time" : "times"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-3">
            <Link
              href="/profile/edit"
              className="block w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-center text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            >
              Edit Profile
            </Link>
            
            <Link
              href="/profile/export"
              className="block w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-center text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            >
              Export Health Data
            </Link>
            
            <button
              onClick={handleSignOut}
              className="block w-full rounded-md bg-red-500 px-4 py-2 text-center text-sm font-medium text-white hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Health Summary and History */}
        <div className="col-span-2">
          {/* Health Summary Card */}
          <div className="mb-6 rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
            <h2 className="mb-4 text-xl font-semibold text-gray-800 dark:text-white">
              Health Summary
            </h2>
            
            <div className="rounded-md bg-teal-50 p-4 dark:bg-teal-900/30">
              <div className="flex items-start">
                <div className="mr-3 flex-shrink-0">
                  <svg 
                    className="h-6 w-6 text-teal-500" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth="2" 
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-md font-medium text-teal-800 dark:text-teal-300">
                    Your Health Overview
                  </h3>
                  <div className="mt-2 text-sm text-teal-700 dark:text-teal-300">
                    <p className="mb-1">
                      Total symptom checks: <strong>{history.length}</strong>
                    </p>
                    <p className="mb-1">
                      Completed assessments: <strong>{history.filter(h => h.completed).length}</strong>
                    </p>
                    <p>
                      Unique symptoms reported: <strong>{Object.keys(recentSymptoms).length}</strong>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Symptom History */}
          <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                Symptom History
              </h2>
              <Link
                href="/"
                className="rounded-md bg-teal-500 px-4 py-2 text-sm font-medium text-white hover:bg-teal-600 dark:bg-teal-600 dark:hover:bg-teal-700"
              >
                New Check
              </Link>
            </div>

            {history.length === 0 ? (
              <div className="mt-8 rounded-md bg-gray-50 p-8 text-center dark:bg-gray-700">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  You don&apos;t have any symptom checks yet
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500">
                  Start a new check to track your symptoms
                </p>
              </div>
            ) : (
              <div className="mt-4 space-y-4">
                {history.map((check) => (
                  <div
                    key={check.id}
                    className="rounded-md border border-gray-200 p-4 dark:border-gray-700"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <div>
                        <span className="font-medium text-gray-800 dark:text-white">
                          {format(new Date(check.date), "MMM d, yyyy")}
                        </span>
                        <span className="ml-2 text-xs text-gray-500">
                          {format(new Date(check.date), "h:mm a")}
                        </span>
                      </div>
                      <span
                        className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${
                          check.completed
                            ? "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300"
                            : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300"
                        }`}
                      >
                        {check.completed ? "Completed" : "In Progress"}
                      </span>
                    </div>

                    <div className="mb-3">
                      <h4 className="text-sm font-medium text-gray-500">Symptoms:</h4>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {check.symptoms.map((symptom, index) => (
                          <span
                            key={index}
                            className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                              symptom.severity === "severe"
                                ? "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300"
                                : symptom.severity === "moderate"
                                ? "bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300"
                                : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300"
                            }`}
                          >
                            {symptom.name} ({symptom.severity})
                          </span>
                        ))}
                      </div>
                    </div>

                    {check.conditions.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Possible Conditions:</h4>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {check.conditions.map((condition, index) => (
                            <span
                              key={index}
                              className="inline-block rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900/50 dark:text-blue-300"
                            >
                              {condition.name} ({Math.round(condition.confidence * 100)}%)
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="mt-3 text-right">
                      <Link
                        href={`/history/${check.id}`}
                        className="text-sm font-medium text-teal-600 hover:text-teal-500 dark:text-teal-400 dark:hover:text-teal-300"
                      >
                        View Details →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 