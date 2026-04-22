import { useState } from "react";
import { Leaf, Sun, Snowflake, Flower2, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Track } from "./MusicPlayer";

interface TrackListProps {
  tracks: Track[];
  currentTrack: Track;
  onTrackSelect: (track: Track) => void;
  isPlaying: boolean;
  favorites: Set<number>;
  onToggleFavorite: (id: number) => void;
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

const filterTabStyles = {
  all: "border-foreground/20 text-foreground",
  spring: "border-season-spring text-season-spring",
  summer: "border-season-summer text-season-summer",
  autumn: "border-season-autumn text-season-autumn",
  winter: "border-season-winter text-season-winter",
};

type FilterSeason = "all" | "spring" | "summer" | "autumn" | "winter";

const TrackList = ({ tracks, currentTrack, onTrackSelect, isPlaying, favorites, onToggleFavorite }: TrackListProps) => {
  const [filter, setFilter] = useState<FilterSeason>("all");

  const filtered = filter === "all" ? tracks : tracks.filter((t) => t.season === filter);

  const filterOptions: { label: string; value: FilterSeason; Icon?: React.ElementType }[] = [
    { label: "All", value: "all" },
    { label: "Spring", value: "spring", Icon: Flower2 },
    { label: "Summer", value: "summer", Icon: Sun },
    { label: "Autumn", value: "autumn", Icon: Leaf },
    { label: "Winter", value: "winter", Icon: Snowflake },
  ];

  return (
    <div className="w-full max-w-2xl mx-auto">
      <h3 className="text-xl font-display font-semibold text-foreground mb-5 text-center">
        The Collection
      </h3>

      {/* Season Filter Tabs */}
      <div className="flex items-center justify-center gap-2 mb-6 flex-wrap">
        {filterOptions.map(({ label, value, Icon }) => (
          <button
            key={value}
            onClick={() => setFilter(value)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-body font-medium border transition-all duration-200",
              filter === value
                ? cn(filterTabStyles[value], "bg-current/10 shadow-sm scale-105")
                : "border-border/50 text-muted-foreground hover:border-border hover:text-foreground"
            )}
            style={filter === value ? { backgroundColor: "currentcolor", color: "inherit" } : undefined}
          >
            {Icon && <Icon size={12} />}
            {label}
          </button>
        ))}
      </div>

      {/* Track rows */}
      <div className="space-y-2">
        {filtered.map((track, index) => {
          const Icon = seasonIcons[track.season];
          const isActive = currentTrack.id === track.id;
          const isFav = favorites.has(track.id);

          return (
            <div
              key={track.id}
              className={cn(
                "w-full flex items-center gap-4 p-4 rounded-xl transition-all duration-300 group",
                "hover:bg-card/80 hover:shadow-md",
                isActive ? "bg-card shadow-lg ring-1 ring-accent/30" : "bg-transparent"
              )}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              {/* Season Icon — click to play */}
              <button
                onClick={() => onTrackSelect(track)}
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center border transition-transform group-hover:scale-110 flex-shrink-0",
                  seasonStyles[track.season],
                  isActive && isPlaying && "animate-pulse-soft"
                )}
              >
                <Icon size={18} />
              </button>

              {/* Track Info — click to play */}
              <button
                onClick={() => onTrackSelect(track)}
                className="flex-1 min-w-0 text-left"
              >
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
              </button>

              {/* Playing Indicator */}
              {isActive && isPlaying && (
                <div className="flex items-end gap-0.5 h-5">
                  <span className="w-1 bg-accent rounded-full animate-[visualizer_0.8s_ease-in-out_infinite]" style={{ height: "60%", animationDelay: "0s" }} />
                  <span className="w-1 bg-accent rounded-full animate-[visualizer_0.8s_ease-in-out_infinite]" style={{ height: "100%", animationDelay: "0.15s" }} />
                  <span className="w-1 bg-accent rounded-full animate-[visualizer_0.8s_ease-in-out_infinite]" style={{ height: "40%", animationDelay: "0.3s" }} />
                </div>
              )}

              {/* Favorite Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite(track.id);
                }}
                className={cn(
                  "p-1.5 rounded-full transition-all duration-200 flex-shrink-0",
                  isFav
                    ? "text-rose-500 scale-110"
                    : "text-muted-foreground/40 hover:text-rose-400 opacity-0 group-hover:opacity-100"
                )}
                aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
              >
                <Heart size={16} fill={isFav ? "currentColor" : "none"} />
              </button>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <p className="text-center text-muted-foreground font-body py-8">No tracks found.</p>
        )}
      </div>
    </div>
  );
};

export default TrackList;
