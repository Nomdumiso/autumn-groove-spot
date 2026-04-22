import { useState, useRef, useEffect } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Shuffle, Repeat, Repeat1 } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

export interface Track {
  id: number;
  title: string;
  movement: string;
  season: "spring" | "summer" | "autumn" | "winter";
  file: string;
}

export type RepeatMode = "none" | "all" | "one";

interface MusicPlayerProps {
  tracks: Track[];
  currentTrack: Track;
  onTrackChange: (track: Track) => void;
  isPlaying: boolean;
  onPlayPause: () => void;
  shuffle: boolean;
  onShuffleToggle: () => void;
  repeatMode: RepeatMode;
  onRepeatToggle: () => void;
}

const BAR_COUNT = 28;

const MusicPlayer = ({
  tracks,
  currentTrack,
  onTrackChange,
  isPlaying,
  onPlayPause,
  shuffle,
  onShuffleToggle,
  repeatMode,
  onRepeatToggle,
}: MusicPlayerProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => {});
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrack]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const handleTimeUpdate = () => {
    if (audioRef.current) setCurrentTime(audioRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) setDuration(audioRef.current.duration);
  };

  const handleSeek = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
    setIsMuted(false);
  };

  const handleTrackEnd = () => {
    if (repeatMode === "one") {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => {});
      }
      return;
    }
    const currentIndex = tracks.findIndex((t) => t.id === currentTrack.id);
    if (shuffle) {
      let next: number;
      do { next = Math.floor(Math.random() * tracks.length); } while (next === currentIndex && tracks.length > 1);
      onTrackChange(tracks[next]);
    } else if (currentIndex < tracks.length - 1) {
      onTrackChange(tracks[currentIndex + 1]);
    } else if (repeatMode === "all") {
      onTrackChange(tracks[0]);
    }
  };

  const skipPrevious = () => {
    if (currentTime > 3 && audioRef.current) {
      audioRef.current.currentTime = 0;
      return;
    }
    const currentIndex = tracks.findIndex((t) => t.id === currentTrack.id);
    if (shuffle) {
      let prev: number;
      do { prev = Math.floor(Math.random() * tracks.length); } while (prev === currentIndex && tracks.length > 1);
      onTrackChange(tracks[prev]);
    } else if (currentIndex > 0) {
      onTrackChange(tracks[currentIndex - 1]);
    }
  };

  const skipNext = () => {
    const currentIndex = tracks.findIndex((t) => t.id === currentTrack.id);
    if (shuffle) {
      let next: number;
      do { next = Math.floor(Math.random() * tracks.length); } while (next === currentIndex && tracks.length > 1);
      onTrackChange(tracks[next]);
    } else if (currentIndex < tracks.length - 1) {
      onTrackChange(tracks[currentIndex + 1]);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const seasonGradients = {
    spring: "from-season-spring/20 to-season-spring/5",
    summer: "from-season-summer/20 to-season-summer/5",
    autumn: "from-season-autumn/20 to-season-autumn/5",
    winter: "from-season-winter/20 to-season-winter/5",
  };

  const seasonAccents = {
    spring: "bg-season-spring",
    summer: "bg-season-summer",
    autumn: "bg-season-autumn",
    winter: "bg-season-winter",
  };

  // Pre-generate stable bar heights for the visualizer
  const barHeights = useRef(
    Array.from({ length: BAR_COUNT }, (_, i) => {
      const wave = Math.sin((i / BAR_COUNT) * Math.PI);
      return 0.2 + wave * 0.7 + Math.random() * 0.1;
    })
  );

  return (
    <div
      className={cn(
        "w-full max-w-2xl mx-auto rounded-2xl p-6 md:p-8 backdrop-blur-sm border border-border/50 shadow-xl transition-all duration-700",
        "bg-gradient-to-br",
        seasonGradients[currentTrack.season]
      )}
    >
      <audio
        ref={audioRef}
        src={currentTrack.file}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleTrackEnd}
      />

      {/* Track Info */}
      <div className="text-center mb-5">
        <p className="text-sm font-body uppercase tracking-widest text-muted-foreground mb-2">
          {currentTrack.season}
        </p>
        <h2 className="text-2xl md:text-3xl font-display font-semibold text-foreground mb-1 transition-all duration-300">
          {currentTrack.title}
        </h2>
        <p className="text-muted-foreground font-body transition-all duration-300">
          {currentTrack.movement}
        </p>
      </div>

      {/* Visualizer */}
      <div className="flex items-end justify-center gap-[2px] h-10 mb-5 px-4">
        {barHeights.current.map((h, i) => (
          <div
            key={i}
            className={cn(
              "flex-1 rounded-full transition-all duration-300",
              isPlaying ? seasonAccents[currentTrack.season] : "bg-border/60"
            )}
            style={{
              height: isPlaying ? `${h * 100}%` : "15%",
              animation: isPlaying
                ? `visualizer ${0.6 + (i % 5) * 0.15}s ease-in-out ${(i * 0.04) % 0.6}s infinite alternate`
                : "none",
              opacity: isPlaying ? 0.7 + h * 0.3 : 0.3,
            }}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="mb-5">
        <Slider
          value={[currentTime]}
          max={duration || 100}
          step={0.1}
          onValueChange={handleSeek}
          className="w-full cursor-pointer"
        />
        <div className="flex justify-between mt-2 text-xs text-muted-foreground font-body">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-3 md:gap-5 mb-5">
        {/* Shuffle */}
        <button
          onClick={onShuffleToggle}
          title="Shuffle (S)"
          className={cn(
            "p-2 rounded-full transition-all",
            shuffle
              ? "text-accent"
              : "text-foreground/40 hover:text-foreground/70"
          )}
        >
          <Shuffle size={18} />
        </button>

        <button
          onClick={skipPrevious}
          title="Previous (←)"
          className="p-2 rounded-full text-foreground/70 hover:text-foreground hover:bg-secondary/50 transition-all"
        >
          <SkipBack size={24} />
        </button>

        <button
          onClick={onPlayPause}
          title="Play/Pause (Space)"
          className="p-4 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
        >
          {isPlaying ? <Pause size={28} /> : <Play size={28} className="ml-1" />}
        </button>

        <button
          onClick={skipNext}
          title="Next (→)"
          className="p-2 rounded-full text-foreground/70 hover:text-foreground hover:bg-secondary/50 transition-all"
        >
          <SkipForward size={24} />
        </button>

        {/* Repeat */}
        <button
          onClick={onRepeatToggle}
          title="Repeat (R)"
          className={cn(
            "p-2 rounded-full transition-all",
            repeatMode !== "none"
              ? "text-accent"
              : "text-foreground/40 hover:text-foreground/70"
          )}
        >
          {repeatMode === "one" ? <Repeat1 size={18} /> : <Repeat size={18} />}
        </button>
      </div>

      {/* Volume */}
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={() => setIsMuted(!isMuted)}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
        <Slider
          value={[isMuted ? 0 : volume]}
          max={1}
          step={0.01}
          onValueChange={handleVolumeChange}
          className="w-24"
        />
      </div>

      {/* Keyboard hint */}
      <p className="text-center text-xs text-muted-foreground/50 font-body mt-4">
        Space · ← → · S · R
      </p>
    </div>
  );
};

export default MusicPlayer;
