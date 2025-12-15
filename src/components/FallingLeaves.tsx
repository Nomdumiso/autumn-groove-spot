import { useEffect, useState } from "react";

interface Leaf {
  id: number;
  x: number;
  delay: number;
  duration: number;
  size: number;
  type: number;
}

const FallingLeaves = () => {
  const [leaves, setLeaves] = useState<Leaf[]>([]);

  useEffect(() => {
    const generateLeaves = () => {
      const newLeaves: Leaf[] = [];
      for (let i = 0; i < 20; i++) {
        newLeaves.push({
          id: i,
          x: Math.random() * 100,
          delay: Math.random() * 15,
          duration: 15 + Math.random() * 20,
          size: 12 + Math.random() * 16,
          type: Math.floor(Math.random() * 4),
        });
      }
      setLeaves(newLeaves);
    };

    generateLeaves();
  }, []);

  const leafColors = [
    "text-autumn-amber",
    "text-autumn-orange",
    "text-autumn-rust",
    "text-autumn-gold",
  ];

  const leafPaths = [
    // Maple leaf
    "M12 2C12 2 8 6 8 10C8 12 10 14 12 14C14 14 16 12 16 10C16 6 12 2 12 2ZM12 14V22M8 18L12 14L16 18",
    // Oak leaf
    "M12 2C9 5 7 8 7 11C7 14 9 16 12 16C15 16 17 14 17 11C17 8 15 5 12 2ZM12 16V22",
    // Simple leaf
    "M12 2C8 6 6 10 6 14C6 18 9 20 12 20C15 20 18 18 18 14C18 10 16 6 12 2Z",
    // Round leaf
    "M12 4C8 4 4 8 4 12C4 16 8 20 12 20C16 20 20 16 20 12C20 8 16 4 12 4Z",
  ];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {leaves.map((leaf) => (
        <div
          key={leaf.id}
          className={`absolute animate-fall ${leafColors[leaf.type]}`}
          style={{
            left: `${leaf.x}%`,
            animationDelay: `${leaf.delay}s`,
            animationDuration: `${leaf.duration}s`,
          }}
        >
          <svg
            width={leaf.size}
            height={leaf.size}
            viewBox="0 0 24 24"
            fill="currentColor"
            className="animate-sway opacity-60"
            style={{
              animationDuration: `${3 + Math.random() * 2}s`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          >
            <path d={leafPaths[leaf.type]} />
          </svg>
        </div>
      ))}
    </div>
  );
};

export default FallingLeaves;
