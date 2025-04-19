"use client";

import Link from "next/link";
import UserMenu from "./UserMenu";
import { useSession } from "next-auth/react";

export default function NavBar() {
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <header className="bg-white shadow-sm dark:bg-gray-800">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <svg
              className="h-8 w-8 text-teal-500"
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
            <h1 className="ml-2 text-xl font-bold text-gray-900 dark:text-white">
              SymptoTrack
            </h1>
          </Link>
        </div>
        <nav className="flex items-center space-x-4">
          <Link 
            href="/" 
            className="text-sm font-medium text-gray-700 hover:text-teal-500 dark:text-gray-200 dark:hover:text-teal-400"
          >
            Home
          </Link>
          {user ? (
            <>
              <Link 
                href="/profile" 
                className="text-sm font-medium text-gray-700 hover:text-teal-500 dark:text-gray-200 dark:hover:text-teal-400"
              >
                My Profile
              </Link>
              <UserMenu user={user} />
            </>
          ) : (
            <>
              <Link 
                href="/auth/signin" 
                className="rounded-md bg-teal-500 px-4 py-2 text-sm font-medium text-white hover:bg-teal-600 dark:bg-teal-600 dark:hover:bg-teal-700"
              >
                Sign In
              </Link>
              <Link 
                href="/auth/signup" 
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              >
                Sign Up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
} 