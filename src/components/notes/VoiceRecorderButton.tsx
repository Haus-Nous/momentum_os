"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Loader2, WifiOff } from 'lucide-react';

interface VoiceRecorderButtonProps {
  onTranscribeComplete: (transcribedText: string) => void;
}

export const VoiceRecorderButton: React.FC<VoiceRecorderButtonProps> = ({ onTranscribeComplete }) => {
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
      setErrorMsg('Microphone access denied or unsupported.');
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
      setErrorMsg('Transcription failed. Please check network connection.');
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
          disabled
          className="p-2 rounded-xl bg-gray-800 text-gray-500 cursor-not-allowed opacity-60 flex items-center space-x-1 text-xs"
          title="Voice transcription requires an active internet connection"
        >
          <WifiOff className="w-4 h-4 text-amber-500" />
          <span className="hidden sm:inline">Offline</span>
        </button>
        <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 hidden group-hover:block bg-gray-900 text-white text-[10px] py-1 px-2 rounded shadow-lg whitespace-nowrap z-50">
          Voice transcription requires an active internet connection
        </div>
      </div>
    );
  }

  if (isTranscribing) {
    return (
      <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 text-xs font-semibold animate-pulse">
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
          className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg shadow-rose-500/30 animate-pulse cursor-pointer"
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
        className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 text-indigo-300 text-xs font-bold transition-all cursor-pointer"
        title="Record Voice Note via Groq Whisper"
      >
        <Mic className="w-3.5 h-3.5 text-indigo-400" />
        <span>Voice Note</span>
      </button>
      {errorMsg && <span className="text-[10px] text-rose-400 font-mono">{errorMsg}</span>}
    </div>
  );
};
