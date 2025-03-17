import { useState, useCallback } from 'react';

interface UseSpeechProps {
  text: string;
  lang: 'en-US' | 'ja-JP' | 'es-ES';
}

export function useSpeech({ text, lang }: UseSpeechProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const speak = useCallback(() => {
    if (!text) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };
    utterance.onpause = () => setIsPaused(true);
    utterance.onresume = () => setIsPaused(false);

    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    } else {
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    }
  }, [text, lang, isPaused]);

  const pause = useCallback(() => {
    window.speechSynthesis.pause();
    setIsPaused(true);
  }, []);

  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
  }, []);

  return {
    isPlaying,
    isPaused,
    speak,
    pause,
    stop
  };
} 