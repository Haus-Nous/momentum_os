"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Loader2, WifiOff } from 'lucide-react';

interface VoiceRecorderButtonProps {
  onTranscribeComplete: (transcribedText: string) => void;
  className?: string;
  compact?: boolean;
  buttonText?: string;
}

export const VoiceRecorderButton: React.FC<VoiceRecorderButtonProps> = ({
  onTranscribeComplete,
  className = '',
  compact = false,
  buttonText = 'Voice Note',
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [isOnline, setIsOnline] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setIsOnline(navigator.onLine);
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const startRecording = async () => {
    setErrorMsg(null);
    if (!isOnline) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        stream.getTracks().forEach((track) => track.stop());
        await handleUploadAudio(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingSeconds(0);

      timerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err: any) {
      setErrorMsg('Mic access denied');
    }
  };

  const stopRecording = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleUploadAudio = async (blob: Blob) => {
    setIsTranscribing(true);
    try {
      const formData = new FormData();
      formData.append('file', blob, 'voicenote.webm');

      const res = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        setErrorMsg(data.error || 'Failed to transcribe voice note.');
      } else if (data.text) {
        onTranscribeComplete(data.text);
      }
    } catch (err: any) {
      setErrorMsg('Transcription failed. Please check connection.');
    } finally {
      setIsTranscribing(false);
    }
  };

  const formatSeconds = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (!isOnline) {
    return (
      <div className="relative group inline-block">
        <button
          type="button"
          disabled
          className={`p-2 rounded-xl bg-gray-800 text-gray-500 cursor-not-allowed opacity-60 flex items-center space-x-1 text-xs ${className}`}
          title="Voice transcription requires an active internet connection"
        >
          <WifiOff className="w-4 h-4 text-amber-500" />
          {!compact && <span>Offline</span>}
        </button>
      </div>
    );
  }

  if (isTranscribing) {
    return (
      <div className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-[#D85A2A]/20 border border-[#D85A2A]/30 text-[#D85A2A] dark:text-[#E56B3A] text-xs font-semibold animate-pulse ${className}`}>
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
        <span>Transcribing...</span>
      </div>
    );
  }

  if (isRecording) {
    return (
      <div className="flex items-center space-x-2">
        <button
          type="button"
          onClick={stopRecording}
          className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg shadow-rose-500/30 animate-pulse cursor-pointer ${className}`}
          title="Click to stop recording"
        >
          <Square className="w-3.5 h-3.5 fill-white" />
          <span>Stop ({formatSeconds(recordingSeconds)})</span>
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      <button
        type="button"
        onClick={startRecording}
        className={
          compact
            ? `p-2 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-[#D85A2A]/15 border border-black/10 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:text-[#D85A2A] dark:hover:text-[#E56B3A] transition-all cursor-pointer ${className}`
            : `flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-[#D85A2A]/10 hover:bg-[#D85A2A]/20 border border-[#D85A2A]/30 text-[#D85A2A] dark:text-[#E56B3A] text-xs font-bold transition-all cursor-pointer ${className}`
        }
        title="Dictate with Groq Whisper Voice"
      >
        <Mic className="w-4 h-4 text-[#D85A2A] dark:text-[#E56B3A]" />
        {!compact && <span>{buttonText}</span>}
      </button>
      {errorMsg && <span className="text-[10px] text-rose-500 font-medium">{errorMsg}</span>}
    </div>
  );
};
