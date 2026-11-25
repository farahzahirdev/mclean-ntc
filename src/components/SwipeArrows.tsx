"use client";

import { useCallback, useEffect, useState } from "react";
import { ArrowIcon } from "@/components/Icons";

/**
 * Previous / next buttons for a horizontally swipeable row (phones only).
 * `targetId` is the id of the scrolling element; it moves one item at a time.
 */
export default function SwipeArrows({
  targetId,
  label,
}: {
  targetId: string;
  label: string;
}) {
  const [edge, setEdge] = useState({ start: true, end: false });

  const update = useCallback(() => {
    const row = document.getElementById(targetId);
    if (!row) return;
    setEdge({
      start: row.scrollLeft <= 4,
      end: row.scrollLeft + row.clientWidth >= row.scrollWidth - 4,
    });
  }, [targetId]);

  useEffect(() => {
    const row = document.getElementById(targetId);
    if (!row) return;
    update();
    row.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      row.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [targetId, update]);

  const move = (direction: 1 | -1) => {
    const row = document.getElementById(targetId);
    if (!row) return;
    const item = row.firstElementChild as HTMLElement | null;
    const step = item ? item.offsetWidth + 12 : row.clientWidth;
    row.scrollBy({ left: direction * step, behavior: "smooth" });
  };

  return (
    <div className="swipe-arrows">
      <button
        type="button"
        onClick={() => move(-1)}
        disabled={edge.start}
        aria-label={`Previous ${label}`}
      >
        <ArrowIcon className="icon-sm swipe-arrow-back" />
      </button>
      <button
        type="button"
        onClick={() => move(1)}
        disabled={edge.end}
        aria-label={`Next ${label}`}
      >
        <ArrowIcon className="icon-sm" />
      </button>
    </div>
  );
}
