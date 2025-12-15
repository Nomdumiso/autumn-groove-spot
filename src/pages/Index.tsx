import { useState } from "react";
import { Helmet } from "react-helmet";
import FallingLeaves from "@/components/FallingLeaves";
import MusicPlayer, { type Track } from "@/components/MusicPlayer";
import TrackList from "@/components/TrackList";

const tracks: Track[] = [
  {
    id: 1,
    title: "Spring",
    movement: "I. Allegro",
    season: "spring",
    file: "/music/spring-allegro.mp3",
  },
  {
    id: 2,
    title: "Spring",
    movement: "II. Largo",
    season: "spring",
    file: "/music/spring-largo.mp3",
  },
  {
    id: 3,
    title: "Spring",
    movement: "III. Allegro Pastorale",
    season: "spring",
    file: "/music/spring-allegro-pastorale.mp3",
  },
  {
    id: 4,
    title: "Spring",
    movement: "II. Largo (Guitar)",
    season: "spring",
    file: "/music/spring-largo-guitar.mp3",
  },
  {
    id: 5,
    title: "Summer",
    movement: "I. Allegro non molto",
    season: "summer",
    file: "/music/summer-allegro.mp3",
  },
  {
    id: 6,
    title: "Summer",
    movement: "III. Presto",
    season: "summer",
    file: "/music/summer-presto.mp3",
  },
  {
    id: 7,
    title: "Autumn",
    movement: "Violin Concerto in F major",
    season: "autumn",
    file: "/music/autumn-violin-concerto.mp3",
  },
  {
    id: 8,
    title: "Autumn",
    movement: "II. Adagio molto",
    season: "autumn",
    file: "/music/autumn-adagio.mp3",
  },
  {
    id: 9,
    title: "Winter",
    movement: "III. Allegro",
    season: "winter",
    file: "/music/winter-allegro.mp3",
  },
  {
    id: 10,
    title: "Winter",
    movement: "Solo Piano",
    season: "winter",
    file: "/music/winter-piano.mp3",
  },
];

const Index = () => {
  const [currentTrack, setCurrentTrack] = useState<Track>(tracks[0]);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleTrackChange = (track: Track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

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
        <FallingLeaves />

        {/* Background Gradient */}
        <div className="fixed inset-0 bg-gradient-to-b from-background via-secondary/20 to-background z-0" />

        {/* Content */}
        <main className="relative z-10">
          {/* Hero Section */}
          <section className="min-h-[50vh] flex flex-col items-center justify-center px-6 pt-16 pb-8">
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
            <div
              className="animate-fade-in-up"
              style={{ animationDelay: "0.2s" }}
            >
              <MusicPlayer
                tracks={tracks}
                currentTrack={currentTrack}
                onTrackChange={handleTrackChange}
                isPlaying={isPlaying}
                onPlayPause={handlePlayPause}
              />
            </div>
          </section>

          {/* Track List Section */}
          <section className="px-6 pb-24">
            <div
              className="animate-fade-in-up"
              style={{ animationDelay: "0.4s" }}
            >
              <TrackList
                tracks={tracks}
                currentTrack={currentTrack}
                onTrackSelect={handleTrackChange}
                isPlaying={isPlaying}
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
