import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";
import { UserDetailsType } from "../../components/UserDetails";
import { generatePDF } from "../../components/pdfGenerator"; // Utility for creating PDFs.

const groq = new Groq();

interface ChatRequest {
  userDetails: UserDetailsType;
  message: string;
  chatHistory: Array<{ role: "user" | "assistant"; content: string }>;
  generateSchedule?: boolean;
}

export async function POST(req: NextRequest) {
  try {
    const { userDetails, message, chatHistory, generateSchedule } = 
      (await req.json()) as ChatRequest;

    if (!message || !userDetails) {
      return NextResponse.json(
        { error: "Invalid request: Missing required fields." },
        { status: 400 }
      );
    }

    const systemMessage = `
      You are an AI tutor specialized in creating personalized education plans.
      If asked, generate AI-optimized study schedules and learning paths based on:
      - Subject, topic, and level of education (e.g., Primary, Secondary, University).
      - Preferred time commitment per day and other learning preferences.

      Student Details:
      - Name: ${userDetails.name || userDetails.nickname || "Anonymous"}
      - Age: ${userDetails.age || "Not specified"}
      - Role: ${userDetails.role || "Student"}

      Be clear, engaging, and adaptive to the student's needs. Provide instructions in simple terms.
    `;

    const messages = [
      { role: "system", content: systemMessage },
      ...chatHistory,
      { role: "user", content: message },
    ];

    // Generate AI response.
    const completion = await groq.chat.completions.create({
      messages: messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
      model: "llama3-8b-8192",
      temperature: 0.7,
      max_tokens: 1024,
      top_p: 1,
      stream: false,
    });

    const aiResponse =
      completion.choices[0]?.message?.content ||
      "I apologize, but I couldn't generate a response. Please try again.";

    // Handle schedule generation if requested.
    if (generateSchedule) {
      const studyPlan = await generateStudyPlan(userDetails, message);

      // Generate a PDF for the study plan.
      const pdfLink = await generatePDF(studyPlan);

      return NextResponse.json({ 
        message: aiResponse, 
        studyPlan, 
        pdfLink 
      });
    }

    return NextResponse.json({ message: aiResponse });

  } catch (error) {
    console.error("Chat API error:", error);

    return NextResponse.json(
      { error: "Failed to process your request." },
      { status: 500 }
    );
  }
}

// Helper function to generate study plans.
async function generateStudyPlan(userDetails: UserDetailsType, topic: string) {
  const level = userDetails.role || "General";
  const subject = topic || "General Knowledge";

  return {
    title: `Study Plan for ${subject}`,
    level,
    schedule: [
      { day: 1, activity: "Introduction to key concepts" },
      { day: 2, activity: "Deep dive into foundational topics" },
      { day: 3, activity: "Practice problems and case studies" },
      { day: 4, activity: "Review and clarify doubts" },
      { day: 5, activity: "Assessment and feedback" },
    ],
    tips: ["Stay consistent", "Take breaks", "Review your progress weekly"],
  };
}
