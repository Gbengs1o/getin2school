import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Mic, Send, X, Play, Pause } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  audio?: string;
  timestamp: number; // Made timestamp required
}

interface ChatButtonProps {
  show: boolean;
}

const AudioMessage = ({ audioData }: { audioData: string }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleMetadata = () => setDuration(audio.duration || 0);
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime || 0);
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener('loadedmetadata', handleMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('loadedmetadata', handleMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
    };
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

  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Auto-scroll to the latest message
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Clean up streams when unmounting
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const handleVoiceInteraction = useCallback(async () => {
    if (isRecording) {
      stopRecording();
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mimeType = MediaRecorder.isTypeSupported('audio/webm')
        ? 'audio/webm'
        : 'audio/mp4';

      mediaRecorder.current = new MediaRecorder(stream, { mimeType });
      chunksRef.current = [];

      mediaRecorder.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.current.onstop = async () => {
        setIsLoading(true);
        const audioBlob = new Blob(chunksRef.current, { type: mimeType });

        // Simulate API request
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            {
              role: 'user',
              content: 'Voice message sent.',
              timestamp: Date.now(),
            },
          ]);
          setIsLoading(false);
        }, 2000);
      };

      mediaRecorder.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  }, [isRecording]);

  const stopRecording = useCallback(() => {
    if (mediaRecorder.current) {
      mediaRecorder.current.stop();
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    }
    setIsRecording(false);
  }, []);

  const handleTextSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    setMessages((prev) => [
      ...prev,
      { role: 'user', content: inputMessage, timestamp: Date.now() },
    ]);
    setInputMessage('');
    setIsLoading(true);

    // Simulate an API response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'This is a response from the assistant.',
          timestamp: Date.now(),
        },
      ]);
      setIsLoading(false);
    }, 1500);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 flex flex-col items-center">
      {isChatOpen && (
        <div
          className="flex flex-col shadow-lg bg-white dark:bg-gray-800 rounded-lg w-80"
          style={{ opacity }}
        >
          <div className="flex items-center justify-between px-4 py-3 border-b dark:border-gray-700">
            <h2 className="font-bold text-gray-800 dark:text-gray-200">Chat</h2>
            <button
              onClick={() => setIsChatOpen(false)}
              className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <X className="w-5 h-5 text-gray-800 dark:text-gray-200" />
            </button>
          </div>
          <div
            className="flex-1 overflow-y-auto p-4 space-y-2"
            ref={chatContainerRef}
          >
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`px-4 py-2 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 dark:text-gray-200'
                  }`}
                >
                  {message.content}
                  {message.audio && <AudioMessage audioData={message.audio} />}
                </div>
              </div>
            ))}
          </div>
          <form
            onSubmit={handleTextSubmit}
            className="flex items-center border-t dark:border-gray-700 p-2"
          >
            <button
              type="button"
              onClick={handleVoiceInteraction}
              className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600"
            >
              {isRecording ? (
                <X className="w-5 h-5" />
              ) : (
                <Mic className="w-5 h-5" />
              )}
            </button>
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 focus:outline-none"
            />
            <button
              type="submit"
              className="ml-2 p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      )}
      <button
        onClick={() => setIsChatOpen((prev) => !prev)}
        className="p-3 rounded-full bg-blue-500 text-white hover:bg-blue-600"
      >
        Chat
      </button>
    </div>
  );
};

export default ChatButton;
