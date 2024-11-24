import React, { useState, useRef, useEffect } from 'react';
import { Mic, Send, X, Play, Pause } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  audio?: string;
  timestamp?: number;
}

interface ChatButtonProps {
  show: boolean;
}

const STORAGE_KEY = 'chat_messages';
const OPACITY_KEY = 'chat_opacity';

const AudioMessage = ({ audioData }: { audioData: string }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.addEventListener('loadedmetadata', () => {
        setDuration(audioRef.current?.duration || 0);
      });
      audioRef.current.addEventListener('timeupdate', () => {
        setCurrentTime(audioRef.current?.currentTime || 0);
      });
      audioRef.current.addEventListener('ended', () => {
        setIsPlaying(false);
        setCurrentTime(0);
      });
      audioRef.current.play().catch(e => console.error('Auto-play failed:', e));
      setIsPlaying(true);
    }
  }, []);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center gap-2 min-w-[200px]">
      <audio ref={audioRef} src={`data:audio/mp3;base64,${audioData}`} />
      <button
        onClick={togglePlay}
        className="p-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white"
      >
        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
      </button>
      <div className="flex-1">
        <div className="bg-blue-200 h-1 rounded-full w-full">
          <div 
            className="bg-blue-500 h-1 rounded-full"
            style={{ width: `${(currentTime / duration) * 100}%` }}
          />
        </div>
      </div>
      <span className="text-xs text-gray-500">
        {formatTime(currentTime)}/{formatTime(duration)}
      </span>
    </div>
  );
};

const ChatButton = ({ show }: ChatButtonProps) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [opacity, setOpacity] = useState(1);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isClient, setIsClient] = useState(false);

  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Initialize client-side state
  useEffect(() => {
    setIsClient(true);
    const savedMessages = localStorage.getItem(STORAGE_KEY);
    const savedOpacity = localStorage.getItem(OPACITY_KEY);
    
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }
    if (savedOpacity) {
      setOpacity(parseFloat(savedOpacity));
    }
  }, []);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (isClient) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    }
  }, [messages, isClient]);

  // Save opacity setting to localStorage whenever it changes
  useEffect(() => {
    if (isClient) {
      localStorage.setItem(OPACITY_KEY, opacity.toString());
    }
  }, [opacity, isClient]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Rest of the component code remains the same...
  // (Previous handleVoiceInteraction, stopRecording, handleTextSubmit, clearHistory functions)

  const handleVoiceInteraction = async () => {
    if (isRecording) {
      stopRecording();
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          sampleRate: 44100,
          channelCount: 1
        } 
      });
      
      streamRef.current = stream;
      const mimeType = MediaRecorder.isTypeSupported('audio/webm') 
        ? 'audio/webm' 
        : 'audio/mp4';

      mediaRecorder.current = new MediaRecorder(stream, {
        mimeType,
        audioBitsPerSecond: 128000
      });

      chunksRef.current = [];
      
      mediaRecorder.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.current.onstop = async () => {
        setIsLoading(true);
        const audioBlob = new Blob(chunksRef.current, { type: mimeType });
        const formData = new FormData();
        formData.append('audio', audioBlob, `recording.${mimeType.split('/')[1]}`);

        try {
          const response = await fetch('/api/aimode', {
            method: 'POST',
            body: formData,
          });

          if (!response.ok) throw new Error('Server error');

          const data = await response.json();
          
          if (data.transcription) {
            const newMessages = [
              { role: 'user', content: data.transcription, timestamp: Date.now() },
              { role: 'assistant', content: data.message, audio: data.audio, timestamp: Date.now() + 1 }
            ];
            setMessages(prev => [...prev, ...newMessages]);
          }
        } catch (error) {
          console.error('Error:', error);
          setMessages(prev => [...prev, { 
            role: 'assistant', 
            content: 'Sorry, there was an error processing your voice message.',
            timestamp: Date.now()
          }]);
        }
        setIsLoading(false);
      };

      mediaRecorder.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Microphone error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Unable to access microphone. Please check your permissions.',
        timestamp: Date.now()
      }]);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && mediaRecorder.current.state !== 'inactive') {
      mediaRecorder.current.stop();
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      setIsRecording(false);
    }
  };

  const handleTextSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const messageText = inputMessage;
    setInputMessage('');
    const userMessage = { 
      role: 'user' as const, 
      content: messageText, 
      timestamp: Date.now() 
    };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/aimode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: messageText }),
      });

      if (!response.ok) throw new Error('Server error');

      const data = await response.json();
      const assistantMessage = { 
        role: 'assistant' as const, 
        content: data.message, 
        audio: data.audio,
        timestamp: Date.now() 
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, there was an error processing your message.',
        timestamp: Date.now()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Add clear history function
  const clearHistory = () => {
    if (window.confirm('Are you sure you want to clear chat history?')) {
      setMessages([]);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 flex flex-col items-center">
      {isChatOpen && (
        <div 
          className="fixed bottom-24 w-96 h-[32rem] bg-white rounded-lg shadow-xl flex flex-col"
          style={{ opacity }}
        >
          <div className="p-4 border-b flex justify-between items-center">
            <div className="flex items-center gap-4">
              <h3 className="font-semibold">Chat with AI Assistant</h3>
              <button
                onClick={clearHistory}
                className="text-xs text-red-500 hover:text-red-700"
              >
                Clear History
              </button>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">Opacity</span>
                <input
                  type="range"
                  min="0.2"
                  max="1"
                  step="0.1"
                  value={opacity}
                  onChange={(e) => setOpacity(parseFloat(e.target.value))}
                  className="w-24"
                />
              </div>
              <button
                onClick={() => setIsChatOpen(false)}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <div className="mb-2">{message.content}</div>
                  {message.audio && <AudioMessage audioData={message.audio} />}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 p-3 rounded-lg">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t flex gap-2">
            <form onSubmit={handleTextSubmit} className="flex-1 flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              />
              <button
                type="submit"
                className="p-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
                disabled={!inputMessage.trim() || isLoading}
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
            <button
              onClick={handleVoiceInteraction}
              className={`p-2 rounded-lg ${
                isRecording ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'
              } text-white`}
              disabled={isLoading}
            >
              <Mic className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsChatOpen(true)}
        className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-200 shadow-lg"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M7.5 3.75h9a3 3 0 013 3v10.5a3 3 0 01-3 3h-9a3 3 0 01-3-3V6.75a3 3 0 013-3z"
          />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6M9 12h6" />
        </svg>
        <span>Open Chat</span>
      </button>
    </div>
  );
};

export default ChatButton;