"use client";

import { useEffect, useRef, useState } from "react";
import "./pixel-reveal.css";

const cache = new Map<string, number[]>();

/** Each cell's delay in ms: a diagonal wave from the top-left, scattered by a fixed hash so the wave dissolves instead
 * of stepping. Deterministic, so every render agrees. */
function delays(columns: number, rows: number) {
  const key = `${columns}x${rows}`;
  let list = cache.get(key);
  if (!list) {
    // Keep the wave's length the same whatever the grid size.
    const step = 520 / (columns + rows - 2);
    list = Array.from({ length: columns * rows }, (_, index) => {
      const x = index % columns, y = Math.floor(index / columns);
      const jitter = (Math.imul(index + 1, 2654435761) >>> 0) % 1000 / 1000;
      return Math.round((x + y) * step + jitter * 260);
    });
    cache.set(key, list);
  }
  return list;
}

type PixelRevealProps = {
  /** Grid size; pick it so the cells come out square on the frame. */
  columns: number;
  rows: number;
  /** Starts the reveal; until then the cover hides the frame. */
  shown: boolean;
  /** The surface the image appears from (any CSS colour, variables included). */
  color: string;
  /** Milliseconds before the wave starts. */
  delay?: number;
};

/**
 * Covers its positioned parent with `color`, then clears it square by square (one step each, no fade) when `shown`
 * turns true, so the content beneath arrives in pixels. One canvas instead of a node per square; it removes itself
 * when the wave is over. Leave it out when motion is reduced.
 */
export function PixelReveal({ columns, rows, shown, color, delay = 0 }: PixelRevealProps) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const element = canvas.current;
    const context = element?.getContext("2d");
    if (!shown || !element || !context) return;
    const { width, height } = element.getBoundingClientRect();
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    element.width = Math.ceil(width * ratio);
    element.height = Math.ceil(height * ratio);
    // Paint the cover into the canvas, then drop the CSS background that stood in for it before this ran.
    context.fillStyle = getComputedStyle(element).backgroundColor;
    context.fillRect(0, 0, element.width, element.height);
    element.dataset.painted = "true";

    const cells = delays(columns, rows);
    const cellWidth = element.width / columns, cellHeight = element.height / rows;
    const cleared = new Uint8Array(cells.length);
    let remaining = cells.length;
    let frame = 0;
    const start = performance.now() + delay;
    const tick = (now: number) => {
      const elapsed = now - start;
      for (let index = 0; index < cells.length; index++) {
        if (cleared[index] || cells[index] > elapsed) continue;
        cleared[index] = 1; remaining--;
        const x = index % columns, y = Math.floor(index / columns);
        // Whole device pixels, a hair wide, so no seam is left between neighbours.
        context.clearRect(Math.floor(x * cellWidth) - 1, Math.floor(y * cellHeight) - 1, Math.ceil(cellWidth) + 2, Math.ceil(cellHeight) + 2);
      }
      if (remaining > 0) frame = requestAnimationFrame(tick);
      else setDone(true);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [shown, columns, rows, delay]);

  if (done) return null;
  return <canvas ref={canvas} className="pixel-reveal" style={{ backgroundColor: color }} aria-hidden="true" />;
}
