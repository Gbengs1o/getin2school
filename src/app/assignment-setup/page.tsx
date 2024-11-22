"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function AssignmentSetupPage() {
  const router = useRouter();
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [deadline, setDeadline] = useState("");
  const [assignmentType, setAssignmentType] = useState("");
  const [error, setError] = useState("");

  const assignmentTypes = [
    "Essay", 
    "Research Paper", 
    "Presentation", 
    "Problem Set", 
    "Lab Report", 
    "Case Study", 
    "Other"
  ];

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validation
    if (!subject.trim()) {
      setError("Please enter the subject");
      return;
    }
    if (!topic.trim()) {
      setError("Please enter the assignment topic");
      return;
    }
    if (!deadline) {
      setError("Please select a deadline");
      return;
    }
    if (!assignmentType) {
      setError("Please select an assignment type");
      return;
    }

    // Prepare assignment details
    const assignmentDetails = {
      subject: subject.trim(),
      topic: topic.trim(),
      deadline: new Date(deadline).toLocaleDateString(),
      assignmentType
    };

    // Store in localStorage
    localStorage.setItem('assignmentDetails', JSON.stringify(assignmentDetails));

    // Navigate to Assignment Assistant
    router.push('/assignmentassistant');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6 text-blue-600">
          Set Up Your Assignment
        </h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
              Subject
            </label>
            <input
              type="text"
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g., Mathematics, History, Biology"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="topic" className="block text-sm font-medium text-gray-700">
              Assignment Topic
            </label>
            <input
              type="text"
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., Calculus Derivatives, World War II, Cell Biology"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="assignmentType" className="block text-sm font-medium text-gray-700">
              Assignment Type
            </label>
            <select
              id="assignmentType"
              value={assignmentType}
              onChange={(e) => setAssignmentType(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Assignment Type</option>
              {assignmentTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="deadline" className="block text-sm font-medium text-gray-700">
              Deadline
            </label>
            <input
              type="date"
              id="deadline"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Start Assignment Assistant
          </button>
        </form>
      </div>
    </div>
  );
}