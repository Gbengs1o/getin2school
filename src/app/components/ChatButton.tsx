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
    const audio = audioRef.current;
    if (audio) {
      const setMetadata = () => setDuration(audio.duration || 0);
      const updateTime = () => setCurrentTime(audio.currentTime || 0);
      const resetOnEnd = () => {
        setIsPlaying(false);
        setCurrentTime(0);
      };

      audio.addEventListener('loadedmetadata', setMetadata);
      audio.addEventListener('timeupdate', updateTime);
      audio.addEventListener('ended', resetOnEnd);

      return () => {
        audio.removeEventListener('loadedmetadata', setMetadata);
        audio.removeEventListener('timeupdate', updateTime);
        audio.removeEventListener('ended', resetOnEnd);
      };
    }
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (audio) {
      isPlaying ? audio.pause() : audio.play();
      setIsPlaying(!isPlaying);
    }
  };

  const formatTime = (time: number) =>
    `${Math.floor(time / 60)}:${String(Math.floor(time % 60)).padStart(2, '0')}`;

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
  const [messages, setMessages] = useState<Message[]>(() => {
    if (typeof window !== 'undefined') {
      const savedMessages = localStorage.getItem(STORAGE_KEY);
      return savedMessages ? JSON.parse(savedMessages) : [];
    }
    return [];
  });
  const [opacity, setOpacity] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedOpacity = localStorage.getItem(OPACITY_KEY);
      return savedOpacity ? parseFloat(savedOpacity) : 1;
    }
    return 1;
  });
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    }
  }, [messages]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(OPACITY_KEY, opacity.toString());
    }
  }, [opacity]);

  useEffect(() => {
    chatContainerRef.current?.scrollTo({ top: chatContainerRef.current.scrollHeight });
  }, [messages]);

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  const handleVoiceInteraction = async () => {
    if (isRecording) {
      stopRecording();
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm'
        : 'audio/mp4';

      mediaRecorder.current = new MediaRecorder(stream, { mimeType });
      chunksRef.current = [];

      mediaRecorder.current.ondataavailable = (e) => e.data.size > 0 && chunksRef.current.push(e.data);
      mediaRecorder.current.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: mimeType });
        const formData = new FormData();
        formData.append('audio', audioBlob);

        setIsLoading(true);
        try {
          const response = await fetch('/api/aimode', { method: 'POST', body: formData });
          if (!response.ok) throw new Error('Server error');
          const data = await response.json();
          setMessages((prev) => [
            ...prev,
            { role: 'user', content: data.transcription, timestamp: Date.now() },
            { role: 'assistant', content: data.message, audio: data.audio, timestamp: Date.now() + 1 },
          ]);
        } catch (error) {
          console.error('Error processing voice input:', error);
        } finally {
          setIsLoading(false);
        }
      };

      mediaRecorder.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Microphone error:', error);
    }
  };

  const stopRecording = () => {
    mediaRecorder.current?.stop();
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setIsRecording(false);
  };

  const handleTextSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    setMessages((prev) => [...prev, { role: 'user', content: inputMessage, timestamp: Date.now() }]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/aimode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputMessage }),
      });
      if (!response.ok) throw new Error('Server error');
      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: data.message, audio: data.audio, timestamp: Date.now() },
      ]);
    } catch (error) {
      console.error('Error sending text message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 flex flex-col items-center">
      {/* Rest of your component code */}
    </div>
  );
};

export default ChatButton;
