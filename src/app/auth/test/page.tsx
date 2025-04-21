"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function AuthTestPage() {
  const { data: session, status } = useSession();
  const [cookies, setCookies] = useState<string[]>([]);
  const [localStorageItems, setLocalStorageItems] = useState<Record<string, string>>({});
  
  useEffect(() => {
    // Get cookies
    if (typeof document !== "undefined") {
      setCookies(document.cookie.split(";").map(cookie => cookie.trim()));
    
      // Get localStorage items related to auth
      const items: Record<string, string> = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.includes("auth") || key.includes("next"))) {
          items[key] = localStorage.getItem(key) || "";
        }
      }
      setLocalStorageItems(items);
    }
  }, []);
  
  return (
    <div className="container mx-auto p-6">
      <h1 className="mb-6 text-2xl font-bold">Authentication Diagnostic</h1>
      
      <div className="mb-6 rounded-md bg-white p-6 shadow-md dark:bg-gray-800">
        <h2 className="mb-4 text-xl font-semibold">Session Status: <span className="font-mono">{status}</span></h2>
        
        {status === "authenticated" ? (
          <div className="rounded-md bg-green-50 p-4 dark:bg-green-900/30">
            <p className="text-green-800 dark:text-green-300">
              ✅ You are authenticated!
            </p>
          </div>
        ) : status === "loading" ? (
          <div className="rounded-md bg-blue-50 p-4 dark:bg-blue-900/30">
            <p className="text-blue-800 dark:text-blue-300">
              ⏳ Loading authentication state...
            </p>
          </div>
        ) : (
          <div className="rounded-md bg-yellow-50 p-4 dark:bg-yellow-900/30">
            <p className="text-yellow-800 dark:text-yellow-300">
              ⚠️ You are not authenticated
            </p>
          </div>
        )}
        
        {session && (
          <div className="mt-4">
            <h3 className="mb-2 text-lg font-medium">Session Data:</h3>
            <pre className="max-h-60 overflow-auto rounded-md bg-gray-100 p-4 text-xs dark:bg-gray-900">
              {JSON.stringify(session, null, 2)}
            </pre>
          </div>
        )}
      </div>
      
      <div className="mb-6 rounded-md bg-white p-6 shadow-md dark:bg-gray-800">
        <h2 className="mb-4 text-xl font-semibold">Cookies</h2>
        {cookies.length > 0 ? (
          <ul className="list-inside list-disc space-y-1">
            {cookies.map((cookie, index) => (
              <li key={index} className="text-sm">
                <code>{cookie}</code>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-red-600 dark:text-red-400">No cookies found. This may indicate a problem.</p>
        )}
      </div>
      
      <div className="mb-6 rounded-md bg-white p-6 shadow-md dark:bg-gray-800">
        <h2 className="mb-4 text-xl font-semibold">Local Storage (Auth-related)</h2>
        {Object.keys(localStorageItems).length > 0 ? (
          <ul className="list-inside list-disc space-y-1">
            {Object.entries(localStorageItems).map(([key, value]) => (
              <li key={key} className="text-sm">
                <strong>{key}:</strong> <code>{value.substring(0, 50)}{value.length > 50 ? '...' : ''}</code>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600 dark:text-gray-400">No auth-related items in localStorage.</p>
        )}
      </div>
      
      <div className="mt-8 space-y-4">
        <div className="rounded-md bg-teal-50 p-4 dark:bg-teal-900/30">
          <h3 className="text-lg font-medium text-teal-800 dark:text-teal-300">Next Steps</h3>
          <p className="mt-2 text-teal-700 dark:text-teal-400">
            Try these actions to diagnose your authentication issues:
          </p>
          <ul className="mt-2 list-inside list-disc space-y-2 text-teal-700 dark:text-teal-400">
            <li>
              <Link href="/auth/signin" className="underline hover:text-teal-500">
                Sign in with test credentials
              </Link>
            </li>
            <li>
              <Link href="/api/auth/session" className="underline hover:text-teal-500" target="_blank">
                View raw session data
              </Link>
            </li>
            <li>Clear cookies and try again</li>
            <li>Try in incognito/private browsing mode</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 