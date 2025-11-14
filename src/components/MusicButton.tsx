import { type CSSProperties, useEffect, useRef, useState } from "react";
import { Music, Pause } from "lucide-react";

import { cn } from "./ui/utils";
import musicFile from "./ui/relaxing-krishna-flute-music-deep-sleep-relaxing-music-292793.mp3";

type MusicButtonProps = {
  variant?: "hero" | "floating";
  className?: string;
  style?: CSSProperties;
};

export function MusicButton({ variant = "floating", className, style }: MusicButtonProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio(musicFile);
    audio.loop = true;
    audio.volume = 0.3;
    audioRef.current = audio;

    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  const toggleMusic = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch((error) => console.error("Audio playback failed:", error));
    }

    setIsPlaying((prev) => !prev);
  };

  const variantClasses = variant === "hero" ? "w-14 h-14" : "w-12 h-12";

  const variantInlineStyle: CSSProperties =
    variant === "hero"
      ? { position: "absolute", top: "2rem", right: "2rem", zIndex: 20 }
      : { position: "fixed", bottom: "2rem", right: "1.5rem", zIndex: 50 };

  return (
    <button
      type="button"
      onClick={toggleMusic}
      style={{ ...variantInlineStyle, ...style }}
      className={cn(
        "rounded-full bg-[#D4AF37] shadow-lg shadow-[#D4AF37]/40 hover:shadow-2xl transition-transform duration-300 hover:scale-110 flex items-center justify-center",
        variantClasses,
        className
      )}
      aria-label={isPlaying ? "Pause music" : "Play music"}
    >
      {isPlaying ? (
        <Pause className="w-6 h-6 text-white" />
      ) : (
        <Music className="w-6 h-6 text-white" />
      )}
    </button>
  );
}
