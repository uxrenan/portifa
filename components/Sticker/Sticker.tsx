"use client";
import { animate, motion, useInView, useMotionValue, useReducedMotion, useSpring, useTransform, type BoundingBox } from "framer-motion";
import { useEffect, useRef, useState, type CSSProperties, type ReactNode, type RefObject } from "react";
import { measureFrame, peelGeometry, toLocal, type Corner, type Frame } from "./peel";
import "./sticker.css";

// One motion language for every sticker: placed by hand, peeled at a corner on hover, pressed on tap, dragged on desktop.
export const STICKER_MOTION = {
  drop: { y: -14, scale: .82, tilt: 9 },
  place: { type: "spring", stiffness: 480, damping: 20 },
  settle: { type: "spring", stiffness: 260, damping: 15 },
  hand: { type: "spring", stiffness: 380, damping: 28 },
  depth: { rest: 0, hover: .6, press: -.6, drag: 1.4 },
  lift: 3, grow: .035, cursorTilt: 1.5,
  // Peel length as a share of the artwork's shorter side: a little on hover, more as the cursor nears the corner.
  peel: { base: .16, reach: .14, spring: { stiffness: 260, damping: 26 } },
} as const;

const DRAG_QUERY = "(hover: hover) and (pointer: fine)";
const MOVE_HINT = "Use as setas para mover; Home para reposicionar.";
const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

type Bounds = Required<Pick<BoundingBox, "left" | "right" | "top" | "bottom">>;

export type StickerProps = {
  children: ReactNode;
  label: string;
  className?: string;
  style?: CSSProperties;
  /** Resting rotation in degrees. */
  rotation?: number;
  /** Visual scale on top of the element's own size. */
  scale?: number;
  /** Seconds before the placing animation starts. */
  delay?: number;
  /** Multiplies the shadow opacity (1 = default). */
  shadow?: number;
  /** Strength of the corner peel on hover (0 turns it off). */
  peel?: number;
  /** Desktop drag; touch devices never drag so the page keeps scrolling. */
  drag?: boolean;
  /** Area the sticker may be dragged within: the section element, or offsets from its resting place. */
  constraints?: RefObject<Element | null> | Bounds;
  /** Plays the placing animation once this turns true; without it the sticker is placed when it scrolls into view. */
  play?: boolean;
};

function useFinePointer() {
  const [fine, setFine] = useState(false);
  useEffect(() => {
    const media = matchMedia(DRAG_QUERY);
    const update = () => setFine(media.matches);
    update(); media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  return fine;
}

export function Sticker({ children, label, className = "", style, rotation = 0, scale = 1, delay = 0, shadow = 1, peel = 1, drag = true, constraints, play }: StickerProps) {
  const reduced = !!useReducedMotion();
  const ref = useRef<HTMLButtonElement>(null);
  const inView = useInView(ref, { once: true, amount: .1 });
  const placed = useRef(false);
  const hovered = useRef(false);
  const [dragging, setDragging] = useState(false);
  const finePointer = useFinePointer();
  const draggable = finePointer && drag;
  const canPeel = finePointer && !reduced && peel > 0;
  const motionScale = reduced ? 0 : 1;

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const opacity = useMotionValue(0);
  const depth = useMotionValue(0);
  const tilt = useMotionValue(reduced ? 0 : STICKER_MOTION.drop.tilt * Math.sign(rotation || 1));
  const dropY = useMotionValue(reduced ? 0 : STICKER_MOTION.drop.y);
  const dropScale = useMotionValue(reduced ? 1 : STICKER_MOTION.drop.scale);
  const peelLength = useSpring(0, STICKER_MOTION.peel.spring);
  const corner = useMotionValue<Corner>({ sx: 1, sy: 1 });
  const frame = useMotionValue<Frame>({ w: 0, h: 0, x0: 0, y0: 0, x1: 0, y1: 0, inset: [0, 0, 0, 0] });
  const face = useRef<HTMLSpanElement>(null);

  const bodyY = useTransform(() => dropY.get() - depth.get() * STICKER_MOTION.lift * motionScale);
  const bodyScale = useTransform(() => scale * dropScale.get() * (1 + depth.get() * STICKER_MOTION.grow * motionScale));
  const bodyRotate = useTransform(() => rotation + tilt.get() * motionScale);
  const filter = useTransform(() => {
    const d = Math.max(depth.get(), -.8);
    return `drop-shadow(0 ${Math.max(.5, 2 + 3.5 * d).toFixed(2)}px ${Math.max(1, 3 + 7 * d).toFixed(2)}px rgb(0 0 0 / ${Math.max(.02, (.1 + .07 * d) * shadow).toFixed(3)}))`;
  });

  const geometry = () => peelGeometry(peelLength.get(), corner.get(), frame.get());
  const faceClip = useTransform(() => geometry()?.face ?? "none");
  const flapClip = useTransform(() => geometry()?.flapClip ?? "none");
  const flapTransform = useTransform(() => geometry()?.flapTransform ?? "none");
  const flapVisibility = useTransform(() => geometry() ? "visible" : "hidden");
  const flapFilter = useTransform(() => `brightness(0) invert(.93) ${geometry()?.flapShadow ?? ""}`);
  const shadeMask = useTransform(() => geometry()?.shade ?? "none");

  useEffect(() => {
    const element = face.current;
    if (!canPeel || !element) return;
    const measure = () => frame.set(measureFrame(element));
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    // Photos are measured from their pixels, which exist only once loaded.
    const img = element.querySelector("img");
    img?.addEventListener("load", measure);
    return () => { observer.disconnect(); img?.removeEventListener("load", measure); };
  }, [canPeel, frame]);

  // Lifts the corner of the artwork on the cursor's side, more as the cursor nears it.
  const peelTowards = (clientX: number, clientY: number, box: DOMRect) => {
    if (!canPeel || dragging || !placed.current) return;
    const { w, h, x0, y0, x1, y1 } = frame.get();
    const [lx, ly] = toLocal(clientX - (box.left + box.width / 2), clientY - (box.top + box.height / 2), rotation).map((v, i) => v + (i ? h : w) / 2);
    const side: Corner = { sx: lx < (x0 + x1) / 2 ? -1 : 1, sy: ly < (y0 + y1) / 2 ? -1 : 1 };
    const current = corner.get();
    if (side.sx !== current.sx || side.sy !== current.sy) {
      // Lay the current corner down before lifting another one, so the flap never jumps.
      if (peelLength.get() > 1) { peelLength.set(0); return; }
      corner.set(side);
    }
    const near = 1 - Math.min(1, Math.hypot((side.sx > 0 ? x1 : x0) - lx, (side.sy > 0 ? y1 : y0) - ly) / Math.hypot(x1 - x0, y1 - y0));
    peelLength.set(Math.min(x1 - x0, y1 - y0) * peel * (STICKER_MOTION.peel.base + STICKER_MOTION.peel.reach * near * near));
  };

  const start = play ?? inView;
  useEffect(() => {
    if (!start || placed.current) return;
    placed.current = true;
    if (reduced) { animate(opacity, 1, { duration: .12, delay }); return; }
    // In the air with a wide shadow, then pressed flat against the page, then a small settle.
    // Not stopped on cleanup: it plays once, and a remount must not freeze it halfway.
    depth.set(2.2);
    animate(opacity, 1, { duration: .18, delay });
    animate(dropY, 0, { ...STICKER_MOTION.place, delay });
    animate(dropScale, 1, { ...STICKER_MOTION.place, delay });
    animate(tilt, 0, { ...STICKER_MOTION.settle, delay });
    animate(depth, STICKER_MOTION.depth.press, { duration: .26, delay, ease: [.5, 0, .9, .5] })
      .then(() => animate(depth, hovered.current ? STICKER_MOTION.depth.hover : 0, STICKER_MOTION.settle));
  }, [start, reduced, delay, opacity, dropY, dropScale, tilt, depth]);

  const toDepth = (state: keyof typeof STICKER_MOTION.depth) => { if (placed.current && opacity.get() > .9) animate(depth, STICKER_MOTION.depth[state], STICKER_MOTION.hand); };
  const toTilt = (value: number) => animate(tilt, value, STICKER_MOTION.hand);

  const bounds = (): Bounds | undefined => {
    if (!constraints) return undefined;
    if (!("current" in constraints)) return constraints;
    const area = constraints.current?.getBoundingClientRect();
    const own = ref.current?.getBoundingClientRect();
    if (!area || !own) return undefined;
    return { left: x.get() - (own.left - area.left), right: x.get() + (area.right - own.right), top: y.get() - (own.top - area.top), bottom: y.get() + (area.bottom - own.bottom) };
  };

  // Keep a dropped sticker inside its area when the layout changes; return it home when drag turns off.
  useEffect(() => {
    if (!draggable) { x.set(0); y.set(0); return; }
    const box = constraints && !("current" in constraints) ? constraints : undefined;
    if (box) { x.set(clamp(x.get(), box.left, box.right)); y.set(clamp(y.get(), box.top, box.bottom)); }
  }, [draggable, constraints, x, y]);

  return <motion.button ref={ref} type="button" className={`sticker ${className}`} data-drag={draggable} data-dragging={dragging}
    aria-label={draggable ? `${label} ${MOVE_HINT}` : label} tabIndex={draggable ? 0 : -1}
    style={{ ...style, x, y }}
    drag={draggable} dragConstraints={constraints} dragElastic={0} dragMomentum={false}
    onHoverStart={() => { hovered.current = true; toDepth("hover"); }}
    onHoverEnd={() => { hovered.current = false; toDepth("rest"); toTilt(0); peelLength.set(0); }}
    onPointerMove={event => {
      if (event.pointerType !== "mouse" || dragging) return;
      const box = event.currentTarget.getBoundingClientRect();
      tilt.set(clamp((event.clientX - box.left) / box.width * 2 - 1, -1, 1) * STICKER_MOTION.cursorTilt);
      peelTowards(event.clientX, event.clientY, box);
    }}
    onTapStart={() => toDepth("press")}
    onTap={() => toDepth(hovered.current ? "hover" : "rest")}
    onTapCancel={() => { if (!dragging) toDepth(hovered.current ? "hover" : "rest"); }}
    onDragStart={() => { setDragging(true); toDepth("drag"); peelLength.set(0); }}
    onDrag={(_, info) => tilt.set(clamp(info.velocity.x * .002, -4, 4))}
    onDragEnd={() => { setDragging(false); toTilt(0); toDepth(hovered.current ? "hover" : "rest"); }}
    onKeyDown={event => {
      if (!draggable) return;
      if (event.key === "Home") { event.preventDefault(); x.set(0); y.set(0); return; }
      if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) return;
      event.preventDefault();
      const step = event.shiftKey ? 24 : 8;
      const box = bounds();
      const nextX = x.get() + (event.key === "ArrowRight" ? step : event.key === "ArrowLeft" ? -step : 0);
      const nextY = y.get() + (event.key === "ArrowDown" ? step : event.key === "ArrowUp" ? -step : 0);
      x.set(box ? clamp(nextX, box.left, Math.max(box.left, box.right)) : nextX);
      y.set(box ? clamp(nextY, box.top, Math.max(box.top, box.bottom)) : nextY);
    }}>
    <motion.span className="sticker-body" style={{ opacity, y: bodyY, scale: bodyScale, rotate: bodyRotate, filter }}>
      <motion.span ref={face} className="sticker-layer sticker-face" style={{ clipPath: faceClip }}>{children}</motion.span>
      {canPeel && <>
        <motion.span className="sticker-layer sticker-flap" aria-hidden="true" style={{ clipPath: flapClip, transform: flapTransform, visibility: flapVisibility, filter: flapFilter }}>{children}</motion.span>
        <motion.span className="sticker-layer sticker-flap sticker-flap-shade" aria-hidden="true" style={{ clipPath: flapClip, transform: flapTransform, visibility: flapVisibility, maskImage: shadeMask, WebkitMaskImage: shadeMask }}>{children}</motion.span>
      </>}
    </motion.span>
  </motion.button>;
}
