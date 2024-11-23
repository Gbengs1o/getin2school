import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import axios from 'axios';
import fs from 'fs';
import path from 'path';

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Chat history (note: this will reset on server restart)
let chatHistory: { role: string; content: string }[] = [];

// Function to read system role from file
function getSystemRole(): string {
  try {
    // Assuming the role file is in the same directory as this API route
    const rolePath = path.join(process.cwd(), 'system-role.txt');
    return fs.readFileSync(rolePath, 'utf-8').trim();
  } catch (error) {
    console.error('Error reading system role file:', error);
    // Fallback to a default role if file reading fails
    return 'You are a helpful AI assistant.';
  }
}

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get('content-type') || '';
    
    if (contentType.includes('multipart/form-data')) {
      console.log('Handling voice mode...');
      
      const formData = await request.formData();
      const audioFile = formData.get('audio') as File;
      
      if (!audioFile) {
        console.error('No audio file provided');
        return NextResponse.json({ error: 'No audio file provided' }, { status: 400 });
      }

      // Verify file type
      if (!audioFile.type.match(/(mp3|wav|m4a|ogg|opus|webm)/)) {
        return NextResponse.json({ 
          error: 'Unsupported audio format. Please use MP3, WAV, M4A, OGG, OPUS, or WebM' 
        }, { status: 400 });
      }

      // Convert File to buffer
      const arrayBuffer = await audioFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Save temporarily with proper extension based on mime type
      const extension = audioFile.type.split('/')[1];
      const tempPath = `/tmp/${Date.now()}.${extension}`;
      
      try {
        fs.writeFileSync(tempPath, buffer);
        console.log('Temporary audio file saved at:', tempPath);
      } catch (fsError) {
        console.error('Failed to write temporary audio file:', fsError.message);
        return NextResponse.json({ error: 'File system error' }, { status: 500 });
      }

      let transcriptionResponse;
      try {
        transcriptionResponse = await groq.audio.transcriptions.create({
          file: fs.createReadStream(tempPath),
          model: 'whisper-large-v3-turbo',
          language: 'en',
          response_format: 'json',
          temperature: 0.0,
        });
        console.log('Groq transcription response:', transcriptionResponse);
      } catch (groqError) {
        console.error('Groq transcription error:', groqError.response?.data || groqError.message);
        fs.unlinkSync(tempPath);
        return NextResponse.json({ 
          error: `Audio transcription failed: ${groqError.message}` 
        }, { status: 500 });
      }

      // Clean up temp file
      fs.unlinkSync(tempPath);

      const userMessage = transcriptionResponse.text;
      console.log('User transcription:', userMessage);
      chatHistory.push({ role: 'user', content: userMessage });

      let completion;
      try {
        // Get AI response using role from file
        completion = await groq.chat.completions.create({
          messages: [
            { role: 'system', content: getSystemRole() },
            ...chatHistory,
          ],
          model: 'llama3-8b-8192',
          temperature: 0.7,
          max_tokens: 1024,
        });
        console.log('Groq AI completion response:', completion);
      } catch (completionError) {
        console.error('Groq AI completion error:', completionError.response?.data || completionError.message);
        return NextResponse.json({ error: 'AI response generation failed' }, { status: 500 });
      }

      const botMessage = completion.choices[0]?.message?.content;
      if (botMessage) {
        chatHistory.push({ role: 'assistant', content: botMessage });
      } else {
        console.error('No AI response received');
        return NextResponse.json({ error: 'No AI response received' }, { status: 500 });
      }

      let speechResponse;
      try {
        // Generate speech from response
        speechResponse = await axios({
          method: 'post',
          url: 'https://api.v7.unrealspeech.com/stream',
          headers: {
            Authorization: `Bearer ${process.env.UNREALSPEECH_API_KEY}`,
            'Content-Type': 'application/json',
          },
          data: {
            Text: botMessage,
            VoiceId: 'Dan',
            Bitrate: '192k',
            Speed: '0',
            Pitch: '1',
            Codec: 'libmp3lame',
          },
          responseType: 'arraybuffer',
        });
        console.log('UnrealSpeech response status:', speechResponse.status);
      } catch (speechError) {
        console.error('UnrealSpeech error:', speechError.response?.data || speechError.message);
        return NextResponse.json({ error: 'Speech generation failed' }, { status: 500 });
      }

      const audioBase64 = Buffer.from(speechResponse.data).toString('base64');

      return NextResponse.json({
        message: botMessage,
        audio: audioBase64,
        transcription: userMessage,
      });
    } else {
      console.log('Handling text mode...');
      
      // Handle text mode
      const data = await request.json();
      chatHistory.push({ role: 'user', content: data.text });

      let completion;
      try {
        completion = await groq.chat.completions.create({
          messages: [
            { role: 'system', content: getSystemRole() },
            ...chatHistory,
          ],
          model: 'llama3-8b-8192',
          temperature: 0.7,
          max_tokens: 1024,
        });
        console.log('Groq AI completion response:', completion);
      } catch (completionError) {
        console.error('Groq AI completion error:', completionError.response?.data || completionError.message);
        return NextResponse.json({ error: 'AI response generation failed' }, { status: 500 });
      }

      const botMessage = completion.choices[0]?.message?.content;
      if (botMessage) {
        chatHistory.push({ role: 'assistant', content: botMessage });
      } else {
        console.error('No AI response received');
        return NextResponse.json({ error: 'No AI response received' }, { status: 500 });
      }

      return NextResponse.json({ message: botMessage });
    }
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};