import { useState, useEffect, useCallback } from "react";
import { Helmet } from "react-helmet";
import FallingLeaves from "@/components/FallingLeaves";
import MusicPlayer, { type Track, type RepeatMode } from "@/components/MusicPlayer";
import TrackList from "@/components/TrackList";

const tracks: Track[] = [
  { id: 1, title: "Spring", movement: "I. Allegro", season: "spring", file: "/music/spring-allegro.mp3" },
  { id: 2, title: "Spring", movement: "II. Largo", season: "spring", file: "/music/spring-largo.mp3" },
  { id: 3, title: "Spring", movement: "III. Allegro Pastorale", season: "spring", file: "/music/spring-allegro-pastorale.mp3" },
  { id: 4, title: "Spring", movement: "II. Largo (Guitar)", season: "spring", file: "/music/spring-largo-guitar.mp3" },
  { id: 5, title: "Summer", movement: "I. Allegro non molto", season: "summer", file: "/music/summer-allegro.mp3" },
  { id: 6, title: "Summer", movement: "III. Presto", season: "summer", file: "/music/summer-presto.mp3" },
  { id: 7, title: "Autumn", movement: "Violin Concerto in F major", season: "autumn", file: "/music/autumn-violin-concerto.mp3" },
  { id: 8, title: "Autumn", movement: "II. Adagio molto", season: "autumn", file: "/music/autumn-adagio.mp3" },
  { id: 9, title: "Winter", movement: "III. Allegro", season: "winter", file: "/music/winter-allegro.mp3" },
  { id: 10, title: "Winter", movement: "Solo Piano", season: "winter", file: "/music/winter-piano.mp3" },
];

const seasonBg = {
  spring: "from-emerald-100/60 via-green-50/30 to-background",
  summer: "from-amber-100/60 via-yellow-50/30 to-background",
  autumn: "from-orange-100/60 via-amber-50/30 to-background",
  winter: "from-sky-100/60 via-blue-50/20 to-background",
};

const Index = () => {
  const [currentTrack, setCurrentTrack] = useState<Track>(tracks[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>("none");
  const [favorites, setFavorites] = useState<Set<number>>(new Set());

  const handleTrackChange = useCallback((track: Track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  }, []);

  const handlePlayPause = useCallback(() => {
    setIsPlaying((p) => !p);
  }, []);

  const handleShuffleToggle = useCallback(() => {
    setShuffle((s) => !s);
  }, []);

  const handleRepeatToggle = useCallback(() => {
    setRepeatMode((r) => {
      if (r === "none") return "all";
      if (r === "all") return "one";
      return "none";
    });
  }, []);

  const handleToggleFavorite = useCallback((id: number) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;

      if (e.code === "Space") {
        e.preventDefault();
        setIsPlaying((p) => !p);
      } else if (e.code === "ArrowRight") {
        e.preventDefault();
        const idx = tracks.findIndex((t) => t.id === currentTrack.id);
        if (idx < tracks.length - 1) handleTrackChange(tracks[idx + 1]);
      } else if (e.code === "ArrowLeft") {
        e.preventDefault();
        const idx = tracks.findIndex((t) => t.id === currentTrack.id);
        if (idx > 0) handleTrackChange(tracks[idx - 1]);
      } else if (e.key === "s" || e.key === "S") {
        setShuffle((s) => !s);
      } else if (e.key === "r" || e.key === "R") {
        handleRepeatToggle();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [currentTrack, handleTrackChange, handleRepeatToggle]);

  return (
    <>
      <Helmet>
        <title>On Repeat | Vivaldi's Four Seasons</title>
        <meta
          name="description"
          content="A serene listening experience celebrating Vivaldi's Four Seasons - the classical music that plays on repeat."
        />
      </Helmet>

      <div className="min-h-screen relative overflow-hidden">
        {/* Falling Leaves Background */}
        <FallingLeaves season={currentTrack.season} />

        {/* Dynamic seasonal background gradient */}
        <div
          className={`fixed inset-0 bg-gradient-to-b transition-all duration-1000 z-0 ${seasonBg[currentTrack.season]}`}
        />

        {/* Content */}
        <main className="relative z-10">
          {/* Hero Section */}
          <section className="min-h-[40vh] flex flex-col items-center justify-center px-6 pt-16 pb-8">
            <div className="text-center animate-fade-in-up">
              <p className="text-sm font-body uppercase tracking-[0.3em] text-muted-foreground mb-4">
                A Personal Collection
              </p>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-semibold text-foreground mb-6">
                On Repeat
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground font-body max-w-md mx-auto leading-relaxed">
                The timeless beauty of Vivaldi's Four Seasons, celebrating nature's eternal cycle.
              </p>
            </div>
          </section>

          {/* Player Section */}
          <section className="px-6 pb-12">
            <div className="animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
              <MusicPlayer
                tracks={tracks}
                currentTrack={currentTrack}
                onTrackChange={handleTrackChange}
                isPlaying={isPlaying}
                onPlayPause={handlePlayPause}
                shuffle={shuffle}
                onShuffleToggle={handleShuffleToggle}
                repeatMode={repeatMode}
                onRepeatToggle={handleRepeatToggle}
              />
            </div>
          </section>

          {/* Track List Section */}
          <section className="px-6 pb-24">
            <div className="animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
              <TrackList
                tracks={tracks}
                currentTrack={currentTrack}
                onTrackSelect={handleTrackChange}
                isPlaying={isPlaying}
                favorites={favorites}
                onToggleFavorite={handleToggleFavorite}
              />
            </div>
          </section>

          {/* Footer */}
          <footer className="text-center pb-8 text-sm text-muted-foreground font-body">
            <p>Antonio Vivaldi • Le quattro stagioni</p>
          </footer>
        </main>
      </div>
    </>
  );
};

export default Index;
