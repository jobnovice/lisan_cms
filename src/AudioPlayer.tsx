// src/components/AudioPlayer.tsx
import React, { useRef, useEffect } from "react";
import { Play, Pause, Volume2 } from "lucide-react";

interface AudioPlayerProps {
  audioUrl: string;
  onAudioUrlChange: (url: string) => void;
  onTextToAudio: (text: string) => Promise<void>;
  generating: boolean;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  audioUrl,
  onAudioUrlChange,
  onTextToAudio,
  generating
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [audioText, setAudioText] = React.useState("");

  const togglePlayback = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  useEffect(() => {
    const audioElement = audioRef.current;
    if (audioElement) {
      const handleEnded = () => setIsPlaying(false);
      audioElement.addEventListener('ended', handleEnded);
      
      return () => {
        audioElement.removeEventListener('ended', handleEnded);
      };
    }
  }, [audioUrl]);

  const handleConvertTextToAudio = async () => {
    if (audioText.trim()) {
      await onTextToAudio(audioText);
    }
  };

  return (
    <div>
      <p className="text-gray-700 text-sm font-medium leading-normal pb-2">
        Generate Audio from Text
      </p>
      <div className="flex flex-col space-y-3">
        <textarea
          className="w-full rounded-md border border-gray-300 bg-white min-h-20 p-3 text-sm placeholder:text-gray-400"
          placeholder="Enter Amharic text to convert to audio..."
          value={audioText}
          onChange={(e) => setAudioText(e.target.value)}
        />
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={handleConvertTextToAudio}
            disabled={generating || !audioText.trim()}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <Volume2 size={16} />
            {generating ? "Generating..." : "Convert to Audio"}
          </button>

          {audioUrl && (
            <div className="flex items-center space-x-2 bg-gray-100 rounded-md px-3 py-2">
              <button
                type="button"
                onClick={togglePlayback}
                className="p-1 rounded-full bg-blue-500 text-white hover:bg-blue-600"
              >
                {isPlaying ? <Pause size={16} /> : <Play size={16} />}
              </button>
              <span className="text-sm text-gray-600">
                {isPlaying ? "Playing..." : "Play audio"}
              </span>
              <audio
                ref={audioRef}
                src={audioUrl}
                className="hidden"
              />
            </div>
          )}
        </div>
      </div>

      <div className="mt-4">
        <label className="flex flex-col">
          <p className="text-gray-700 text-sm font-medium leading-normal pb-2">
            Or Enter Audio URL Manually <span className="text-gray-400">(Optional)</span>
          </p>
          <input
            type="text"
            className="w-full rounded-md border border-gray-300 bg-white p-3 text-sm"
            placeholder="https://cdn.example.com/audio/prompt.mp3"
            value={audioUrl}
            onChange={(e) => onAudioUrlChange(e.target.value)}
          />
        </label>
      </div>
    </div>
  );
};