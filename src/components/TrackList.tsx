import { Leaf, Sun, Snowflake, Flower2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Track } from "./MusicPlayer";

interface TrackListProps {
  tracks: Track[];
  currentTrack: Track;
  onTrackSelect: (track: Track) => void;
  isPlaying: boolean;
}

const seasonIcons = {
  spring: Flower2,
  summer: Sun,
  autumn: Leaf,
  winter: Snowflake,
};

const seasonStyles = {
  spring: "text-season-spring bg-season-spring/10 border-season-spring/30",
  summer: "text-season-summer bg-season-summer/10 border-season-summer/30",
  autumn: "text-season-autumn bg-season-autumn/10 border-season-autumn/30",
  winter: "text-season-winter bg-season-winter/10 border-season-winter/30",
};

const TrackList = ({ tracks, currentTrack, onTrackSelect, isPlaying }: TrackListProps) => {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <h3 className="text-xl font-display font-semibold text-foreground mb-6 text-center">
        The Collection
      </h3>
      <div className="space-y-2">
        {tracks.map((track, index) => {
          const Icon = seasonIcons[track.season];
          const isActive = currentTrack.id === track.id;

          return (
            <button
              key={track.id}
              onClick={() => onTrackSelect(track)}
              className={cn(
                "w-full flex items-center gap-4 p-4 rounded-xl transition-all duration-300 text-left group",
                "hover:bg-card/80 hover:shadow-md",
                isActive
                  ? "bg-card shadow-lg ring-1 ring-accent/30"
                  : "bg-transparent"
              )}
              style={{
                animationDelay: `${index * 0.1}s`,
              }}
            >
              {/* Season Icon */}
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center border transition-transform group-hover:scale-110",
                  seasonStyles[track.season],
                  isActive && isPlaying && "animate-pulse-soft"
                )}
              >
                <Icon size={18} />
              </div>

              {/* Track Info */}
              <div className="flex-1 min-w-0">
                <h4
                  className={cn(
                    "font-display text-lg truncate transition-colors",
                    isActive ? "text-foreground font-semibold" : "text-foreground/80"
                  )}
                >
                  {track.title}
                </h4>
                <p className="text-sm text-muted-foreground font-body truncate">
                  {track.movement}
                </p>
              </div>

              {/* Playing Indicator */}
              {isActive && isPlaying && (
                <div className="flex items-center gap-0.5">
                  <span className="w-1 h-3 bg-accent rounded-full animate-pulse" style={{ animationDelay: "0s" }} />
                  <span className="w-1 h-4 bg-accent rounded-full animate-pulse" style={{ animationDelay: "0.15s" }} />
                  <span className="w-1 h-2 bg-accent rounded-full animate-pulse" style={{ animationDelay: "0.3s" }} />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TrackList;
