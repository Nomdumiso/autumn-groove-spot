import { useEffect, useState } from "react";

interface Particle {
  id: number;
  x: number;
  delay: number;
  duration: number;
  size: number;
  type: number;
}

interface FallingLeavesProps {
  season?: "spring" | "summer" | "autumn" | "winter";
}

const seasonConfig = {
  spring: {
    colors: ["text-pink-300", "text-rose-300", "text-pink-400", "text-emerald-300"],
    // Petals / blossoms
    paths: [
      "M12 2C10 5 8 8 10 11C12 14 14 11 12 2Z",
      "M12 2C14 5 16 8 14 11C12 14 10 11 12 2Z",
      "M12 4C9 6 7 10 9 13C11 16 13 13 12 4Z",
      "M12 3C10 6 11 10 13 12C15 10 13 6 12 3Z",
    ],
  },
  summer: {
    colors: ["text-yellow-300", "text-amber-300", "text-green-400", "text-lime-300"],
    // Stars / sparkles
    paths: [
      "M12 2L13.5 8H20L14.5 12L16.5 18L12 14L7.5 18L9.5 12L4 8H10.5L12 2Z",
      "M12 4C8 4 4 8 4 12C4 16 8 20 12 20C16 20 20 16 20 12C20 8 16 4 12 4Z",
      "M12 2L14 9H21L15.5 13.5L17.5 20.5L12 16L6.5 20.5L8.5 13.5L3 9H10L12 2Z",
      "M12 3C9 7 9 11 12 15C15 11 15 7 12 3Z",
    ],
  },
  autumn: {
    colors: ["text-amber-500", "text-orange-500", "text-red-500", "text-yellow-500"],
    paths: [
      "M12 2C12 2 8 6 8 10C8 12 10 14 12 14C14 14 16 12 16 10C16 6 12 2 12 2ZM12 14V22M8 18L12 14L16 18",
      "M12 2C9 5 7 8 7 11C7 14 9 16 12 16C15 16 17 14 17 11C17 8 15 5 12 2ZM12 16V22",
      "M12 2C8 6 6 10 6 14C6 18 9 20 12 20C15 20 18 18 18 14C18 10 16 6 12 2Z",
      "M12 4C8 4 4 8 4 12C4 16 8 20 12 20C16 20 20 16 20 12C20 8 16 4 12 4Z",
    ],
  },
  winter: {
    colors: ["text-sky-200", "text-blue-200", "text-slate-200", "text-cyan-200"],
    // Snowflake-ish shapes
    paths: [
      "M12 2V22M2 12H22M5 5L19 19M19 5L5 19",
      "M12 2V22M2 12H22M6.3 6.3L17.7 17.7M17.7 6.3L6.3 17.7",
      "M12 3L12 21M3 12L21 12M6 6L18 18M18 6L6 18",
      "M12 4C10 8 8 10 4 12C8 14 10 16 12 20C14 16 16 14 20 12C16 10 14 8 12 4Z",
    ],
  },
};

const FallingLeaves = ({ season = "autumn" }: FallingLeavesProps) => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [activeSeason, setActiveSeason] = useState(season);

  useEffect(() => {
    // Delay regenerating so transition feels smooth
    const timer = setTimeout(() => setActiveSeason(season), 300);
    return () => clearTimeout(timer);
  }, [season]);

  useEffect(() => {
    const config = seasonConfig[activeSeason];
    const count = activeSeason === "winter" ? 15 : 20;
    const newParticles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 15,
        duration: 15 + Math.random() * 20,
        size: activeSeason === "winter" ? 10 + Math.random() * 10 : 12 + Math.random() * 16,
        type: Math.floor(Math.random() * config.paths.length),
      });
    }
    setParticles(newParticles);
  }, [activeSeason]);

  const config = seasonConfig[activeSeason];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((p) => (
        <div
          key={`${activeSeason}-${p.id}`}
          className={`absolute animate-fall ${config.colors[p.type % config.colors.length]}`}
          style={{
            left: `${p.x}%`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        >
          <svg
            width={p.size}
            height={p.size}
            viewBox="0 0 24 24"
            fill="currentColor"
            className="animate-sway opacity-60"
            style={{
              animationDuration: `${3 + Math.random() * 2}s`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          >
            <path d={config.paths[p.type % config.paths.length]} />
          </svg>
        </div>
      ))}
    </div>
  );
};

export default FallingLeaves;
