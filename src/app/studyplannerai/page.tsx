"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import UserDetails, { UserDetailsType } from "../components/UserDetails";

export default function StudyPlanner() {
  const router = useRouter();
  const [userDetails, setUserDetails] = useState<UserDetailsType | null>(() => {
    try {
      return UserDetails.getUserDetails();
    } catch {
      return null;
    }
  });
  const [topic, setTopic] = useState("");
  const [subject, setSubject] = useState("");
  const [educationLevel, setEducationLevel] = useState("");
  const [studyHabits, setStudyHabits] = useState("");
  const [studyGuide, setStudyGuide] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Effect to check user authentication on mount
  useEffect(() => {
    if (!userDetails) {
      router.push("/auth");
    }
  }, [userDetails, router]);

  const handleGenerateGuide = async () => {
    if (!topic || !subject || !educationLevel || !studyHabits) {
      setError("Please fill out all fields.");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/generate-study-guide", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userDetails,
          topic,
          subject,
          educationLevel,
          studyHabits,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate study guide");
      }

      const data = await response.json();
      setStudyGuide(data.studyGuide);
    } catch (error) {
      console.error("Error generating study guide:", error);
      setError("Failed to generate study guide. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    UserDetails.clearUserDetails();
    setUserDetails(null);
    router.push("/auth");
  };

  return (
    <div className="container mx-auto max-w-4xl p-4 min-h-screen bg-background">
      <div className="bg-card rounded-lg shadow-lg p-6">
        <div className="bg-primary text-primary-foreground p-4 flex justify-between items-center rounded-t-lg">
          <h1 className="text-xl font-bold">Personalized Study Planner</h1>
          <button
            onClick={handleLogout}
            className="px-3 py-1 rounded bg-secondary hover:bg-secondary/80 text-secondary-foreground text-sm transition-colors"
          >
            Logout
          </button>
        </div>

        <div className="p-4 space-y-4">
          {error && (
            <div className="bg-red-100 text-red-800 p-4 rounded">
              <p>{error}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium">Topic</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full px-4 py-2 border rounded bg-background text-foreground focus:ring-2 focus:ring-primary"
              placeholder="Enter your study topic"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Subject</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-4 py-2 border rounded bg-background text-foreground focus:ring-2 focus:ring-primary"
              placeholder="Enter the subject"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">
              Level of Education
            </label>
            <input
              type="text"
              value={educationLevel}
              onChange={(e) => setEducationLevel(e.target.value)}
              className="w-full px-4 py-2 border rounded bg-background text-foreground focus:ring-2 focus:ring-primary"
              placeholder="e.g., High School, University, etc."
            />
          </div>

          <div>
            <label className="block text-sm font-medium">
              Describe Your Study Habits
            </label>
            <textarea
              value={studyHabits}
              onChange={(e) => setStudyHabits(e.target.value)}
              className="w-full px-4 py-2 border rounded bg-background text-foreground focus:ring-2 focus:ring-primary"
              placeholder="Describe how you prefer to study..."
              rows={4}
            />
          </div>

          <button
            onClick={handleGenerateGuide}
            disabled={isLoading}
            className={`w-full px-4 py-2 rounded bg-primary text-primary-foreground hover:bg-primary/90 transition ${
              isLoading && "opacity-50 cursor-not-allowed"
            }`}
          >
            {isLoading ? "Generating..." : "Generate Study Guide"}
          </button>
        </div>

        {studyGuide && (
          <div className="mt-6 p-4 bg-secondary rounded text-secondary-foreground">
            <h2 className="font-bold text-lg mb-2">Your Personalized Study Guide</h2>
            <div className="whitespace-pre-wrap prose prose-sm max-w-none">
              {studyGuide}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}