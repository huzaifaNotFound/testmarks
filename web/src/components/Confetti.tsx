"use client";

import { useEffect, useState } from "react";

const COLORS = ["#DC143C", "#FF4D6D", "#F59E0B", "#10B981", "#8B5CF6", "#0EA5E9", "#FFFFFF"];

interface Piece {
  id: number;
  x: number;
  delay: number;
  color: string;
  rotate: number;
  size: number;
}

function makePieces(): Piece[] {
  return Array.from({ length: 90 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 0.8,
    color: COLORS[i % COLORS.length],
    rotate: Math.random() * 360,
    size: 6 + Math.random() * 8,
  }));
}

export default function Confetti({ active }: { active: boolean }) {
  const [pieces, setPieces] = useState<Piece[]>([]);

  useEffect(() => {
    if (!active) return;
    const start = setTimeout(() => setPieces(makePieces()), 60);
    const end = setTimeout(() => setPieces([]), 4500);
    return () => {
      clearTimeout(start);
      clearTimeout(end);
    };
  }, [active]);

  if (!active || pieces.length === 0) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[70] overflow-hidden">
      {pieces.map((p) => (
        <span
          key={p.id}
          className="absolute rounded-sm"
          style={{
            left: `${p.x}%`,
            top: "-5%",
            width: p.size,
            height: p.size * 0.6,
            background: p.color,
            animation: `confetti-fall 3.2s ease-in ${p.delay}s forwards`,
            transform: `rotate(${p.rotate}deg)`,
            opacity: 0,
          }}
        />
      ))}
    </div>
  );
}
