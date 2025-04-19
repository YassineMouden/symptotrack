"use client";

import { useState, useRef, useEffect } from "react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import type { Session } from "next-auth";

interface AuthNavProps {
  user: Session["user"];
}

export default function AuthNav({ user }: AuthNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close the dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSignOut = async () => {
    await signOut({ redirect: true, callbackUrl: "/" });
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
      >
        <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-teal-100 text-sm font-medium text-teal-800 dark:bg-teal-900/50 dark:text-teal-300">
          {user.image ? (
            <img
              src={user.image}
              alt={user.name ?? "User"}
              className="h-full w-full object-cover"
            />
          ) : (
            user.name?.charAt(0) ?? "U"
          )}
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 dark:bg-gray-800 dark:ring-gray-700">
          <div className="border-b border-gray-100 px-4 py-2 dark:border-gray-700">
            <p className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
          </div>

          <Link
            href="/profile"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
            onClick={() => setIsOpen(false)}
          >
            Your Profile
          </Link>

          <Link
            href="/"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
            onClick={() => setIsOpen(false)}
          >
            New Symptom Check
          </Link>

          <button
            onClick={handleSignOut}
            className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100 dark:text-red-400 dark:hover:bg-gray-700"
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
} 