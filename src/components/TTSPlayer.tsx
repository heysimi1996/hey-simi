import React, { useState, useEffect, useRef } from 'react';
import { Volume2, Pause, Play, Square, Gauge } from 'lucide-react';

interface TTSPlayerProps {
  text: string;
  className?: string;
  defaultRate?: number;
}

const SPEED_OPTIONS = [1.35, 1.5, 1.75, 2.0, 1.0, 1.2];

export function TTSPlayer({ text, className = '', defaultRate = 1.35 }: TTSPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(defaultRate);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Load available voices
  useEffect(() => {
    const updateVoices = () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        const availableVoices = window.speechSynthesis.getVoices();
        setVoices(availableVoices);
      }
    };

    updateVoices();
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }

    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const cleanText = (rawText: string) => {
    return rawText
      .replace(/[*#_`~>]/g, '')
      .replace(/-\s+/g, '')
      .replace(/\n+/g, '. ')
      .trim();
  };

  const getBestVietnameseVoice = (): SpeechSynthesisVoice | null => {
    if (!voices || voices.length === 0) return null;
    
    // Priority: Vietnamese specific voices
    const viVoices = voices.filter(v => v.lang.includes('vi-VN') || v.lang.startsWith('vi'));
    if (viVoices.length === 0) return null;

    // Prefer high quality / neural / natural voices if available
    const premiumVoice = viVoices.find(v => 
      v.name.toLowerCase().includes('natural') || 
      v.name.toLowerCase().includes('neural') ||
      v.name.toLowerCase().includes('online') ||
      v.name.toLowerCase().includes('google')
    );
    if (premiumVoice) return premiumVoice;

    // Next prefer male/nam or standard
    const maleVoice = viVoices.find(v => v.name.toLowerCase().includes('nam') || v.name.toLowerCase().includes('male'));
    if (maleVoice) return maleVoice;

    return viVoices[0];
  };

  const startSpeaking = (currentSpeed: number) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    window.speechSynthesis.cancel();

    const cleaned = cleanText(text);
    if (!cleaned) return;

    const utterance = new SpeechSynthesisUtterance(cleaned);
    utterance.lang = 'vi-VN';
    utterance.rate = currentSpeed; // Tăng tốc độ đọc mượt mà
    utterance.pitch = 0.95; // Tông giọng tự nhiên, rõ ràng

    const bestVoice = getBestVietnameseVoice();
    if (bestVoice) {
      utterance.voice = bestVoice;
    }

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    utterance.onerror = (e) => {
      // Speech cancel can trigger error event
      if (e.error !== 'canceled' && e.error !== 'interrupted') {
        console.warn('TTS playback issue:', e.error);
      }
      setIsPlaying(false);
      setIsPaused(false);
    };

    utteranceRef.current = utterance;
    setIsPlaying(true);
    setIsPaused(false);
    window.speechSynthesis.speak(utterance);
  };

  const handleTogglePlay = () => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      return;
    }

    if (isPlaying) {
      if (isPaused) {
        window.speechSynthesis.resume();
        setIsPaused(false);
      } else {
        window.speechSynthesis.pause();
        setIsPaused(true);
      }
    } else {
      startSpeaking(speed);
    }
  };

  const handleStop = () => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
    setIsPaused(false);
  };

  const cycleSpeed = () => {
    const currentIndex = SPEED_OPTIONS.indexOf(speed);
    const nextIndex = (currentIndex + 1) % SPEED_OPTIONS.length;
    const newSpeed = SPEED_OPTIONS[nextIndex];
    setSpeed(newSpeed);

    // If already playing, restart with new speed seamlessly
    if (isPlaying && !isPaused) {
      startSpeaking(newSpeed);
    }
  };

  return (
    <div className={`inline-flex items-center gap-2 bg-brand-gold/5 hover:bg-brand-gold/10 border border-brand-gold/20 hover:border-brand-gold/30 px-3.5 py-1.5 rounded-xl transition-all select-none shadow-sm ${className}`}>
      {/* Play/Pause Button */}
      <button 
        type="button"
        onClick={handleTogglePlay}
        className="flex items-center gap-2 text-xs font-display font-bold uppercase tracking-wider text-brand-gold hover:text-white transition-colors"
        title={isPlaying ? (isPaused ? "Tiếp tục đọc" : "Tạm dừng") : "Nghe đọc AI"}
      >
        {isPlaying && !isPaused ? (
          <div className="flex items-center gap-1.5">
            <div className="flex items-end gap-0.5 h-3.5 w-3.5">
              <span className="w-0.5 bg-brand-gold rounded-full animate-[soundWave_0.8s_ease-in-out_infinite]" style={{ animationDelay: '0.1s', height: '60%' }} />
              <span className="w-0.5 bg-brand-gold rounded-full animate-[soundWave_0.8s_ease-in-out_infinite]" style={{ animationDelay: '0.3s', height: '100%' }} />
              <span className="w-0.5 bg-brand-gold rounded-full animate-[soundWave_0.8s_ease-in-out_infinite]" style={{ animationDelay: '0.2s', height: '40%' }} />
              <span className="w-0.5 bg-brand-gold rounded-full animate-[soundWave_0.8s_ease-in-out_infinite]" style={{ animationDelay: '0.4s', height: '80%' }} />
            </div>
            <span className="text-[11px]">Đang Đọc</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5">
            {isPaused ? (
              <Play className="w-3.5 h-3.5 fill-current text-brand-gold" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 text-brand-gold" />
            )}
            <span className="text-[11px]">{isPaused ? "Tiếp Tục" : "Nghe Đọc AI"}</span>
          </div>
        )}
      </button>

      {/* Speed Multiplier Badge Button */}
      <button
        type="button"
        onClick={cycleSpeed}
        className="px-2 py-0.5 bg-brand-gold/15 hover:bg-brand-gold/30 border border-brand-gold/30 rounded-md text-[10px] font-mono font-bold text-brand-gold hover:text-white transition-colors flex items-center gap-1"
        title="Bấm để đổi tốc độ đọc (1.0x - 2.0x)"
      >
        <Gauge className="w-2.5 h-2.5 opacity-70" />
        <span>{speed}x</span>
      </button>

      {/* Stop Button */}
      {isPlaying && (
        <>
          <div className="h-3 w-px bg-brand-gold/20" />
          <button 
            type="button"
            onClick={handleStop}
            className="text-white/60 hover:text-rose-400 p-0.5 transition-colors"
            title="Dừng đọc"
          >
            <Square className="w-3 h-3 fill-current" />
          </button>
        </>
      )}
    </div>
  );
}
