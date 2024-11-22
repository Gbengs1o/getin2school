"use client";

import { useState } from "react";
import { db } from "../../firebase-config";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { getAuth } from "firebase/auth";

export default function CongratsPage() {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    sex: "",
    dob: "",
    nickname: "",
    role: "",
  });

  const router = useRouter();
  const auth = getAuth();
  const user = auth.currentUser;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("User not authenticated. Please log in.");
      return;
    }

    try {
      await setDoc(doc(db, "users", user.uid), {
        name: formData.name,
        age: formData.age,
        sex: formData.sex,
        dob: formData.dob,
        nickname: formData.nickname,
        role: formData.role,
        email: user.email,
      });

      alert("Details saved successfully!");
      router.push("/account");
    } catch (error) {
      console.error("Error saving details: ", error);
      alert("Failed to save details. Please try again.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border-2 border-gray-200 dark:border-gray-700">
        <div className="p-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
            Welcome Aboard!
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mt-2">
            Let&apos;s get to know you better
          </p>
        </div>
        
        <div className="mx-6 mb-6 p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
          <div className="flex items-center gap-2">
            <svg
              className="h-5 w-5 text-blue-500"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
            <p className="text-sm text-blue-500 dark:text-blue-400">
              Please provide accurate information. This helps us personalize your experience and provide better recommendations throughout the platform.
            </p>
          </div>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="name" className="block text-base font-medium text-gray-700 dark:text-gray-200">
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full h-11 px-3 rounded-md border border-gray-300 dark:border-gray-600 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="nickname" className="block text-base font-medium text-gray-700 dark:text-gray-200">
                  Nickname
                </label>
                <input
                  id="nickname"
                  name="nickname"
                  value={formData.nickname}
                  onChange={handleInputChange}
                  className="w-full h-11 px-3 rounded-md border border-gray-300 dark:border-gray-600 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="What should we call you?"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="age" className="block text-base font-medium text-gray-700 dark:text-gray-200">
                  Age
                </label>
                <input
                  id="age"
                  name="age"
                  type="number"
                  value={formData.age}
                  onChange={handleInputChange}
                  className="w-full h-11 px-3 rounded-md border border-gray-300 dark:border-gray-600 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Your age"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="dob" className="block text-base font-medium text-gray-700 dark:text-gray-200">
                  Date of Birth
                </label>
                <input
                  id="dob"
                  name="dob"
                  type="date"
                  value={formData.dob}
                  onChange={handleInputChange}
                  className="w-full h-11 px-3 rounded-md border border-gray-300 dark:border-gray-600 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="sex" className="block text-base font-medium text-gray-700 dark:text-gray-200">
                  Sex
                </label>
                <select
                  id="sex"
                  name="sex"
                  value={formData.sex}
                  onChange={handleInputChange}
                  className="w-full h-11 px-3 rounded-md border border-gray-300 dark:border-gray-600 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select sex</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="role" className="block text-base font-medium text-gray-700 dark:text-gray-200">
                  Role
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full h-11 px-3 rounded-md border border-gray-300 dark:border-gray-600 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select role</option>
                  <option value="Student">Student</option>
                  <option value="Teacher">Teacher</option>
                </select>
              </div>
            </div>
          
            <div className="pt-6">
              <button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-semibold 
                          hover:from-blue-600 hover:to-purple-600 transition-all duration-200 
                          focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Complete Profile
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}