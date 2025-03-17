import { Play, Pause, Square } from 'lucide-react';
import { Button } from './button';
import { useSpeech } from '@/hooks/useSpeech';

interface SpeechButtonProps {
  text: string;
  lang: 'en-US' | 'ja-JP' | 'es-ES';
  className?: string;
}

export function SpeechButton({ text, lang, className }: SpeechButtonProps) {
  const { isPlaying, isPaused, speak, pause, stop } = useSpeech({ text, lang });

  return (
    <div className={`flex gap-2 ${className || ''}`}>
      <Button
        variant="outline"
        size="icon"
        onClick={() => (isPlaying && !isPaused ? pause() : speak())}
        title={isPlaying && !isPaused ? '一時停止' : '読み上げ'}
      >
        {isPlaying && !isPaused ? (
          <Pause className="h-4 w-4" />
        ) : (
          <Play className="h-4 w-4" />
        )}
      </Button>
      {isPlaying && (
        <Button
          variant="outline"
          size="icon"
          onClick={stop}
          title="停止"
        >
          <Square className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
} 