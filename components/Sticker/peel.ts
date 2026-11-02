// Geometry for a corner peeled along a 45° fold. Works on any sticker shape: the face loses the corner
// and a copy of the artwork, reflected over the fold, becomes the back of the lifted flap.

export type Corner = { sx: -1 | 1; sy: -1 | 1 };
/**
 * The sticker's box, the box of what is actually drawn inside it (artwork often has transparent margins), and for
 * each corner how far along the diagonal the drawing's outermost point sits (round or die-cut stickers have empty corners).
 */
export type Frame = { w: number; h: number; x0: number; y0: number; x1: number; y1: number; inset: [number, number, number, number] };

/** How far the folded flap is foreshortened as it lifts off the page (1 = flat). */
const LIFT = .86;
/** Room kept around the artwork so strokes and overflow are never clipped. */
const BLEED = 6;
const px = (value: number) => `${value.toFixed(2)}px`;
const point = ([x, y]: number[]) => `${px(x)} ${px(y)}`;
const cornerIndex = ({ sx, sy }: Corner) => (sy > 0 ? 2 : 0) + (sx > 0 ? 1 : 0);

export function peelGeometry(length: number, corner: Corner, { w, h, x0, y0, x1, y1, inset }: Frame) {
  const { sx, sy } = corner;
  const cw = x1 - x0, ch = y1 - y0;
  if (length < .5 || cw <= 0 || ch <= 0) return null;
  const L = Math.min(length, cw, ch);
  // The tip: the drawing's outermost point towards this corner, so the fold only lifts a small cap of it.
  const i = inset[cornerIndex(corner)];
  const cx = (sx > 0 ? x1 : x0) - sx * i, cy = (sy > 0 ? y1 : y0) - sy * i;
  const n = [sx / Math.SQRT2, sy / Math.SQRT2];
  const c = n[0] * (cx - sx * L) + n[1] * cy;

  // Face: the artwork box plus bleed, with everything beyond the fold line cut off.
  const [l, t, r, b] = [x0 - BLEED, y0 - BLEED, x1 + BLEED, y1 + BLEED];
  const ex = sx > 0 ? r : l, ey = sy > 0 ? b : t;
  const onSide = [ex, (c - n[0] * ex) / n[1]], onEnd = [(c - n[1] * ey) / n[0], ey];
  const cut = sx * sy > 0 ? [onSide, onEnd] : [onEnd, onSide];
  const box: [number, number, number, number][] = [[l, t, -1, -1], [r, t, 1, -1], [r, b, 1, 1], [l, b, -1, 1]];
  const face = box.flatMap(([x, y, kx, ky]) => kx === sx && ky === sy ? cut : [[x, y]]);

  // Reflect over the fold, then pull the flap back towards it as if it were lifting: p' = p - (1 + LIFT)·n·(n·p - c).
  const k = 1 + LIFT;
  const a = 1 - k * n[0] * n[0], skew = -k * n[0] * n[1], d = 1 - k * n[1] * n[1];

  // Shade runs across the element box in the corner's direction: darkest at the crease, fading towards the tip.
  const span = (w + h) / Math.SQRT2;
  const from = Math.min(0, sx * w, sy * h, sx * w + sy * h) / Math.SQRT2;
  const at = (p: number) => (100 * (p - from) / span).toFixed(2);
  const tip = n[0] * cx + n[1] * cy;
  const angle = sx > 0 ? (sy > 0 ? 135 : 45) : (sy > 0 ? 225 : 315);
  const progress = L / Math.min(cw, ch);
  return {
    face: `polygon(${face.map(point).join(", ")})`,
    flapClip: `polygon(${point(cut[0])}, ${point([ex, ey])}, ${point(cut[1])})`,
    flapTransform: `matrix(${a}, ${skew}, ${skew}, ${d}, ${k * n[0] * c}, ${k * n[1] * c})`,
    shade: `linear-gradient(${angle}deg, transparent ${at(c)}%, #000 ${at(c)}%, transparent ${at(c + (tip - c) * .75)}%)`,
    flapShadow: `drop-shadow(0 0 ${(2 + 10 * progress).toFixed(2)}px rgb(0 0 0 / ${(.12 + .45 * progress).toFixed(3)}))`,
  };
}

/** Rotates a vector from screen space into the sticker's own frame. */
export function toLocal(dx: number, dy: number, rotation: number) {
  const r = -rotation * Math.PI / 180;
  return [dx * Math.cos(r) - dy * Math.sin(r), dx * Math.sin(r) + dy * Math.cos(r)];
}

type Box = Omit<Frame, "inset">;

/** For each corner, how far the drawing's outermost point in that diagonal direction sits behind the drawn box's corner. */
function insets(box: Box, painted: (x: number, y: number) => boolean): Frame["inset"] {
  const steps = 48, support = [-Infinity, -Infinity, -Infinity, -Infinity];
  const directions = [[-1, -1], [1, -1], [-1, 1], [1, 1]] as const;
  for (let row = 0; row <= steps; row++) for (let col = 0; col <= steps; col++) {
    const x = box.x0 + (box.x1 - box.x0) * col / steps, y = box.y0 + (box.y1 - box.y0) * row / steps;
    if (!painted(x, y)) continue;
    directions.forEach(([sx, sy], i) => { support[i] = Math.max(support[i], sx * x + sy * y); });
  }
  return directions.map(([sx, sy], i) => {
    const corner = sx * (sx > 0 ? box.x1 : box.x0) + sy * (sy > 0 ? box.y1 : box.y0);
    return Number.isFinite(support[i]) ? Math.max(0, (corner - support[i]) / 2) : 0;
  }) as Frame["inset"];
}

/** Measures where the artwork is drawn inside a layer: an SVG's painted shapes, or an image's opaque pixels. */
export function measureFrame(layer: HTMLElement): Frame {
  const w = layer.offsetWidth, h = layer.offsetHeight;
  const full: Box = { w, h, x0: 0, y0: 0, x1: w, y1: h };
  const svg = layer.querySelector("svg");
  const view = svg?.viewBox.baseVal;
  if (svg && view?.width && view.height) {
    const bbox = svg.getBBox();
    const sw = svg.clientWidth || w, sh = svg.clientHeight || h;
    const scale = Math.min(sw / view.width, sh / view.height);
    const ox = (sw - view.width * scale) / 2 - view.x * scale;
    const oy = (sh - view.height * scale) / 2 - view.y * scale;
    const box: Box = { w, h, x0: ox + bbox.x * scale, y0: oy + bbox.y * scale, x1: ox + (bbox.x + bbox.width) * scale, y1: oy + (bbox.y + bbox.height) * scale };
    const shapes = [...svg.querySelectorAll<SVGGeometryElement>("path, rect, circle, ellipse, polygon, polyline")];
    const at = new DOMPoint();
    return { ...box, inset: insets(box, (x, y) => {
      at.x = (x - ox) / scale; at.y = (y - oy) / scale;
      return shapes.some(shape => shape.isPointInFill(at));
    }) };
  }
  const img = layer.querySelector("img");
  if (img?.complete && img.naturalWidth) {
    try {
      const size = 160, canvas = document.createElement("canvas");
      canvas.width = canvas.height = size;
      const context = canvas.getContext("2d", { willReadFrequently: true });
      if (context) {
        context.drawImage(img, 0, 0, size, size);
        const { data } = context.getImageData(0, 0, size, size);
        return { ...full, inset: insets(full, (x, y) => data[(Math.min(size - 1, Math.floor(y / h * size)) * size + Math.min(size - 1, Math.floor(x / w * size))) * 4 + 3] > 128) };
      }
    } catch { /* an unreadable image keeps its box corners */ }
  }
  return { ...full, inset: [0, 0, 0, 0] };
}
