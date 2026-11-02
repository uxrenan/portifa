import type { CSSProperties } from "react";
import "./pixel-constellation.css";

// A small star built on a 7×5 pixel grid, used as the section marker instead of numbers.
// Each pixel is [column, row, resting intensity]: the star itself is near solid, the satellites stay faint for depth.
type Pixel = readonly [number, number, number];

const CONSTELLATIONS = {
  north: [
    [3, 2, 1], [2, 2, .9], [4, 2, .9], [3, 1, .9], [3, 3, .9],
    [1, 2, .45], [5, 2, .45], [3, 0, .45], [3, 4, .45],
    [6, 0, .6], [0, 4, .3], [6, 4, .25],
  ],
  drift: [
    [2, 2, 1], [1, 2, .9], [3, 2, .9], [2, 1, .9], [2, 3, .9],
    [0, 2, .45], [4, 2, .45], [2, 0, .45], [2, 4, .45],
    [5, 1, .6], [6, 3, .35], [4, 4, .25],
  ],
  spark: [
    [4, 2, 1], [3, 2, .9], [5, 2, .9], [4, 1, .9], [4, 3, .9],
    [5, 1, .45], [3, 3, .45], [6, 2, .35], [4, 0, .45],
    [0, 1, .55], [1, 3, .3], [6, 4, .35],
  ],
} satisfies Record<string, readonly Pixel[]>;

/** Seconds for the light wave to move one column across the grid. */
const WAVE = .11;
const CELL = 3, PIXEL = 2.4;

export function PixelConstellation({ variant = "north" }: { variant?: keyof typeof CONSTELLATIONS }) {
  return <svg className="pixel-constellation" viewBox="0 0 20.4 14.4" aria-hidden="true" focusable="false">
    {CONSTELLATIONS[variant].map(([x, y, level]) =>
      // The wave sweeps diagonally (left to right, top to bottom), so neighbours light one after another.
      <rect key={`${x}-${y}`} x={x * CELL} y={y * CELL} width={PIXEL} height={PIXEL}
        style={{ "--level": level, "--delay": `${((x + y * .6) * WAVE).toFixed(2)}s` } as CSSProperties} />)}
  </svg>;
}
