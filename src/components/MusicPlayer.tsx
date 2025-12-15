import { useState, useRef, useEffect } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

export interface Track {
  id: number;
  title: string;
  movement: string;
  season: "spring" | "summer" | "autumn" | "winter";
  file: string;
}

interface MusicPlayerProps {
  tracks: Track[];
  currentTrack: Track;
  onTrackChange: (track: Track) => void;
  isPlaying: boolean;
  onPlayPause: () => void;
}

const MusicPlayer = ({
  tracks,
  currentTrack,
  onTrackChange,
  isPlaying,
  onPlayPause,
}: MusicPlayerProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play();
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
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
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
    const currentIndex = tracks.findIndex((t) => t.id === currentTrack.id);
    if (currentIndex < tracks.length - 1) {
      onTrackChange(tracks[currentIndex + 1]);
    }
  };

  const skipPrevious = () => {
    const currentIndex = tracks.findIndex((t) => t.id === currentTrack.id);
    if (currentIndex > 0) {
      onTrackChange(tracks[currentIndex - 1]);
    }
  };

  const skipNext = () => {
    const currentIndex = tracks.findIndex((t) => t.id === currentTrack.id);
    if (currentIndex < tracks.length - 1) {
      onTrackChange(tracks[currentIndex + 1]);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const seasonColors = {
    spring: "from-season-spring/20 to-season-spring/5",
    summer: "from-season-summer/20 to-season-summer/5",
    autumn: "from-season-autumn/20 to-season-autumn/5",
    winter: "from-season-winter/20 to-season-winter/5",
  };

  return (
    <div
      className={cn(
        "w-full max-w-2xl mx-auto rounded-2xl p-6 md:p-8 backdrop-blur-sm border border-border/50 shadow-xl",
        "bg-gradient-to-br",
        seasonColors[currentTrack.season]
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
      <div className="text-center mb-6">
        <p className="text-sm font-body uppercase tracking-widest text-muted-foreground mb-2">
          {currentTrack.season}
        </p>
        <h2 className="text-2xl md:text-3xl font-display font-semibold text-foreground mb-1">
          {currentTrack.title}
        </h2>
        <p className="text-muted-foreground font-body">
          {currentTrack.movement}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
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
      <div className="flex items-center justify-center gap-4 md:gap-6 mb-6">
        <button
          onClick={skipPrevious}
          className="p-2 rounded-full text-foreground/70 hover:text-foreground hover:bg-secondary/50 transition-all"
        >
          <SkipBack size={24} />
        </button>

        <button
          onClick={onPlayPause}
          className="p-4 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl hover:scale-105"
        >
          {isPlaying ? <Pause size={28} /> : <Play size={28} className="ml-1" />}
        </button>

        <button
          onClick={skipNext}
          className="p-2 rounded-full text-foreground/70 hover:text-foreground hover:bg-secondary/50 transition-all"
        >
          <SkipForward size={24} />
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
    </div>
  );
};

export default MusicPlayer;
