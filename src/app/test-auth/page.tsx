"use client";

import { useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";

export default function TestAuthPage() {
  const { data: session, status, update } = useSession();
  const [name, setName] = useState("");
  const [age, setAge] = useState<string>("");
  const [sex, setSex] = useState<string>("");
  const [message, setMessage] = useState<string | null>(null);

  const handleSignIn = async () => {
    await signIn("credentials", {
      email: "test@example.com",
      password: "password",
      redirect: false,
    });
  };

  const handleSignOut = async () => {
    await signOut({ redirect: false });
  };

  const handleUpdateProfile = async () => {
    try {
      setMessage("Updating profile...");
      
      // Convert age to number if provided
      const ageNumber = age ? parseInt(age, 10) : undefined;
      
      // Update session directly
      await update({
        ...session,
        user: {
          ...session?.user,
          name: name || session?.user?.name,
          age: ageNumber || session?.user?.age,
          sex: sex || session?.user?.sex,
        },
      });
      
      setMessage("Profile updated successfully!");
    } catch (error) {
      setMessage("Error updating profile: " + (error instanceof Error ? error.message : String(error)));
    }
  };

  return (
    <div className="container mx-auto max-w-2xl p-6">
      <h1 className="mb-6 text-2xl font-bold">Authentication Test Page</h1>
      
      <div className="mb-6 rounded-md bg-white p-6 shadow-md dark:bg-gray-800">
        <h2 className="mb-4 text-xl font-semibold">Status: <span className="font-mono">{status}</span></h2>
        
        {status === "authenticated" ? (
          <div className="rounded-md bg-green-50 p-4 dark:bg-green-900/30">
            <p className="text-green-800 dark:text-green-300">
              ✅ You are authenticated as {session.user.name} ({session.user.email})
            </p>
            {session.user.age && <p className="text-green-800 dark:text-green-300">Age: {session.user.age}</p>}
            {session.user.sex && <p className="text-green-800 dark:text-green-300">Sex: {session.user.sex}</p>}
          </div>
        ) : (
          <div className="rounded-md bg-yellow-50 p-4 dark:bg-yellow-900/30">
            <p className="text-yellow-800 dark:text-yellow-300">
              You are not authenticated
            </p>
          </div>
        )}
        
        <div className="mt-4 flex space-x-4">
          <button
            onClick={handleSignIn}
            className="rounded-md bg-teal-500 px-4 py-2 text-white hover:bg-teal-600 dark:bg-teal-600 dark:hover:bg-teal-700"
          >
            Sign In (Test User)
          </button>
          
          <button
            onClick={handleSignOut}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
          >
            Sign Out
          </button>
        </div>
      </div>
      
      {status === "authenticated" && (
        <div className="rounded-md bg-white p-6 shadow-md dark:bg-gray-800">
          <h2 className="mb-4 text-xl font-semibold">Update Profile</h2>
          
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={session.user.name || "Enter name"}
                className="w-full rounded-md border border-gray-300 p-2 dark:border-gray-600 dark:bg-gray-700"
              />
            </div>
            
            <div>
              <label className="mb-1 block text-sm font-medium">Age</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder={session.user.age?.toString() || "Enter age"}
                className="w-full rounded-md border border-gray-300 p-2 dark:border-gray-600 dark:bg-gray-700"
              />
            </div>
            
            <div>
              <label className="mb-1 block text-sm font-medium">Sex</label>
              <select
                value={sex}
                onChange={(e) => setSex(e.target.value)}
                className="w-full rounded-md border border-gray-300 p-2 dark:border-gray-600 dark:bg-gray-700"
              >
                <option value="">Select sex</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <button
              onClick={handleUpdateProfile}
              className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            >
              Update Profile
            </button>
            
            {message && (
              <div className="mt-4 rounded-md bg-blue-50 p-4 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                <p>{message}</p>
              </div>
            )}
          </div>
        </div>
      )}
      
      <div className="mt-6">
        <Link href="/auth/test" className="text-teal-600 underline hover:text-teal-500">
          Go to Diagnostic Page
        </Link>
      </div>
    </div>
  );
} 