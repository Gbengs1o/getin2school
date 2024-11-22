import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";
import { UserDetailsType } from "../../components/UserDetails";

const groq = new Groq();

interface ChatRequest {
  userDetails: UserDetailsType;
  message: string;
  chatHistory: Array<{ role: "user" | "assistant"; content: string }>;
}

interface LearningSessionRequest {
  subject: string;
  description: string;
  educationLevel: string;
  studyTime: number; // In minutes
  userId: string;
}

// Helper: Create a personalized system message
const createSystemMessage = (userDetails: UserDetailsType) => `
  You are an AI assistant specialized in education. 
  User Details:
  - Name: ${userDetails.name || userDetails.nickname || "Anonymous"}
  - Role: ${userDetails.role || "Learner"}

  For students: provide simplified, clear, and engaging responses. 
  For teachers: focus on professional and detailed explanations.
  Always address the user by their name or nickname to make communication personal.
`;

// POST handler
export async function POST(req: NextRequest) {
  try {
    const { userDetails, message, chatHistory, subject, description, educationLevel, studyTime, userId } =
      await req.json();

    if (subject && description && educationLevel && studyTime) {
      // Learning session initialization
      const sessionData = {
        subject,
        description,
        educationLevel,
        studyTime,
        userId,
        startTime: new Date(),
      };

      console.log("Learning Session Started:", sessionData);

      // AI-generated notes for the subject
      const notesPrompt = `
        Create an engaging study note on the following:
        Subject: ${subject}
        Topic: ${description}
        Education Level: ${educationLevel}
        Study Time: ${studyTime} minutes.

        Provide detailed and easy-to-understand explanations, examples, and a summary.
      `;

      const notesCompletion = await groq.chat.completions.create({
        messages: [{ role: "system", content: notesPrompt }],
        model: "llama3-8b-8192",
        temperature: 0.7,
        max_tokens: 1024,
        top_p: 1,
        stream: false,
      });

      const notes = notesCompletion.choices[0]?.message?.content || "Unable to generate notes at the moment.";

      return NextResponse.json({
        message: "Learning session initialized successfully",
        status: "success",
        notes,
      });
    }

    if (userDetails && message && chatHistory) {
      // Chat functionality
      const systemMessage = createSystemMessage(userDetails);

      const messages = [
        { role: "system", content: systemMessage },
        ...chatHistory,
        { role: "user", content: message },
      ];

      const chatCompletion = await groq.chat.completions.create({
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

      const response =
        chatCompletion.choices[0]?.message?.content ||
        "I apologize, but I couldn't generate a response. Please try again.";

      return NextResponse.json({ message: response });
    }

    // If study time is up, generate questions for testing understanding
    if (req.headers.get("X-Session-End") === "true") {
      const questionsPrompt = `
        Based on the notes provided earlier on the subject "${subject}" and topic "${description}", 
        create five questions to test the user's understanding. Include answers for reference.
      `;

      const questionsCompletion = await groq.chat.completions.create({
        messages: [{ role: "system", content: questionsPrompt }],
        model: "llama3-8b-8192",
        temperature: 0.7,
        max_tokens: 1024,
        top_p: 1,
        stream: false,
      });

      const questions =
        questionsCompletion.choices[0]?.message?.content || "Unable to generate questions at the moment.";

      return NextResponse.json({
        message: "Study session completed. Questions generated.",
        status: "success",
        questions,
      });
    }

    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  } catch (error) {
    console.error("Backend API error:", error);
    return NextResponse.json(
      { error: "Failed to process your request" },
      { status: 500 }
    );
  }
}