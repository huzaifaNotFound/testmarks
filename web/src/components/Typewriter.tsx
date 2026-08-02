"use client";

import { useEffect, useRef, useState } from "react";

export default function Typewriter({
  text,
  speed = 18,
  className,
}: {
  text: string;
  speed?: number;
  className?: string;
}) {
  const [count, setCount] = useState(0);
  const countRef = useRef(0);

  useEffect(() => {
    countRef.current = 0;
    const interval = setInterval(() => {
      countRef.current += 1;
      setCount(countRef.current);
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);

  return (
    <span className={className}>
      {text.slice(0, count)}
      {count < text.length && (
        <span className="ml-0.5 inline-block h-[1em] w-[2px] animate-pulse bg-crimson align-middle" />
      )}
    </span>
  );
}
