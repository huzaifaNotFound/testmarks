"use client";

import { useState, type DragEvent } from "react";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export default function QuestionPalette({
  order,
  currentIdx,
  answered,
  flagged,
  saved,
  onJump,
  onReorder,
  onToggleSaved,
}: {
  order: number[];
  currentIdx: number;
  answered: boolean[];
  flagged: boolean[];
  saved: boolean[];
  onJump: (displayIdx: number) => void;
  onReorder: (fromDisplay: number, toDisplay: number) => void;
  onToggleSaved: (questionIdx: number) => void;
}) {
  const [dragging, setDragging] = useState<number | null>(null);
  const [over, setOver] = useState<number | null>(null);

  const main = order.map((qIdx, dIdx) => ({ qIdx, dIdx })).filter((x) => !saved[x.qIdx]);
  const savedItems = order.map((qIdx, dIdx) => ({ qIdx, dIdx })).filter((x) => saved[x.qIdx]);

  const tileClass = (qIdx: number, dIdx: number) =>
    cn(
      "relative flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xs font-bold transition-all select-none focus-visible:ring-2",
      dIdx === currentIdx
        ? "bg-crimson text-white font-extrabold shadow-sm ring-2 ring-crimson/30"
        : answered[qIdx]
          ? "bg-success text-white"
          : flagged[qIdx]
            ? "bg-warning text-white"
            : "bg-black/[0.05] text-black/60 hover:bg-black/10 dark:bg-white/5 dark:text-white/70 dark:hover:bg-white/10",
      dragging === dIdx && "opacity-40",
      over === dIdx && dragging !== null && dragging !== dIdx && "scale-105 ring-2 ring-crimson/40",
    );

  const dragStart = (e: DragEvent, dIdx: number) => {
    setDragging(dIdx);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", String(dIdx));
  };

  const drop = (e: DragEvent, toDIdx: number) => {
    e.preventDefault();
    const from = Number(e.dataTransfer.getData("text/plain"));
    if (!Number.isNaN(from) && from !== toDIdx) onReorder(from, toDIdx);
    setDragging(null);
    setOver(null);
  };

  const dropOnBucket = (e: DragEvent) => {
    e.preventDefault();
    const from = Number(e.dataTransfer.getData("text/plain"));
    if (!Number.isNaN(from)) onToggleSaved(order[from]);
    setDragging(null);
    setOver(null);
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <div className="label mb-3 text-black/50 dark:text-white/40">Question palette · {order.length}</div>
        <div
          className="grid grid-cols-6 gap-1.5 sm:grid-cols-8 lg:grid-cols-6"
          onDragOver={(e) => e.preventDefault()}
        >
          {main.map(({ qIdx, dIdx }) => (
            <button
              key={dIdx}
              draggable
              onDragStart={(e) => dragStart(e, dIdx)}
              onDragOver={(e) => {
                e.preventDefault();
                setOver(dIdx);
              }}
              onDragLeave={() => setOver((v) => (v === dIdx ? null : v))}
              onDrop={(e) => drop(e, dIdx)}
              onClick={() => onJump(dIdx)}
              className={tileClass(qIdx, dIdx)}
            >
              {dIdx + 1}
            </button>
          ))}
        </div>
      </div>

      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={dropOnBucket}
        className={cn(
          "rounded-lg border-2 border-dashed p-4 transition-colors",
          dragging !== null
            ? "border-crimson bg-crimson-soft/30 dark:bg-crimson/10"
            : "border-black/5 dark:border-white/5",
        )}
      >
        <div className="label mb-2 flex items-center gap-1.5 text-black/50 dark:text-white/40">
          <Bookmark size={12} /> Save for later · drop here
        </div>
        {savedItems.length === 0 ? (
          <p className="text-xs text-black/40 dark:text-white/40 leading-relaxed">
            Drag any question tile here to park it and solve it later.
          </p>
        ) : (
          <div className="grid grid-cols-6 gap-1.5 sm:grid-cols-8">
            {savedItems.map(({ qIdx, dIdx }) => (
              <button
                key={dIdx}
                onClick={() => onJump(dIdx)}
                onDragOver={(e) => {
                  e.preventDefault();
                  setOver(dIdx);
                }}
                onDrop={(e) => drop(e, dIdx)}
                className={tileClass(qIdx, dIdx)}
              >
                {dIdx + 1}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2 text-[10px] font-semibold text-black/50 dark:text-white/45 border-t border-black/5 dark:border-white/5 pt-3">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-success" /> Answered
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-warning" /> Flagged
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-black/10 dark:bg-white/20" /> Unanswered
        </span>
        <button
          onClick={() => {
            const q = order[currentIdx];
            onToggleSaved(q);
          }}
          className="flex items-center gap-1 font-bold text-crimson hover:underline"
        >
          <BookmarkCheck size={12} />
          {saved[order[currentIdx]] ? "Remove Saved" : "Save Current"}
        </button>
      </div>
    </div>
  );
}
