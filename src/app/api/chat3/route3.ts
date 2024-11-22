import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

// Enable CORS
export const dynamic = 'force-dynamic'

interface AssignmentDetails {
  subject: string;
  topic: string;
  deadline: string;
  assignmentType: string;
}

interface ChatRequest {
  assignmentDetails: AssignmentDetails;
  message: string;
  chatHistory: Array<{ role: "user" | "assistant"; content: string }>;
}

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

export async function POST(req: NextRequest) {
  // Enable CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return NextResponse.json(null, {
      headers: corsHeaders
    });
  }

  try {
    // Parse request body
    const requestBody = await req.json();
    const { assignmentDetails, message, chatHistory } = requestBody as ChatRequest;

    // Validate input
    if (!message) {
      return NextResponse.json(
        { error: "Message is required" }, 
        { 
          status: 400,
          headers: corsHeaders 
        }
      );
    }

    // Create a specialized system message for assignment assistance
    const systemMessage = `You are an AI Assignment Assistant specialized in providing academic support. 
    Assignment Details:
    - Subject: ${assignmentDetails?.subject || 'Not Specified'}
    - Topic: ${assignmentDetails?.topic || 'Not Specified'}
    - Assignment Type: ${assignmentDetails?.assignmentType || 'Not Specified'}
    - Deadline: ${assignmentDetails?.deadline || 'Not Specified'}

    Your goal is to:
    1. Provide helpful guidance without doing the student's work
    2. Break down complex topics
    3. Offer research suggestions
    4. Help with understanding assignment requirements
    5. Provide constructive feedback
    6. Suggest study strategies`;

    // Prepare messages for the Groq API
    const messages = [
      { role: "system", content: systemMessage },
      ...chatHistory.map(msg => ({
        role: msg.role,
        content: msg.content
      })),
      { role: "user", content: message }
    ];

    // Fallback to a default model if environment variable is not set
    const model = process.env.GROQ_MODEL || "llama3-8b-8192";

    const completion = await groq.chat.completions.create({
      messages: messages,
      model: model,
      temperature: 0.7,
      max_tokens: 1024,
      top_p: 1,
      stream: false
    });

    const response = completion.choices[0]?.message?.content || 
      "I apologize, but I couldn't generate a response. Please try again.";

    return NextResponse.json({ message: response }, { 
      headers: corsHeaders 
    });
  } catch (error) {
    console.error("Assignment Chat API error:", error);
    return NextResponse.json(
      { error: "Failed to process your assignment request" },
      { 
        status: 500,
        headers: corsHeaders 
      }
    );
  }
}