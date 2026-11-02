"use client";
import { animate, motion, useMotionTemplate, useMotionValue, type MotionValue, type ValueAnimationTransition } from "framer-motion";
import { useEffect, useRef, useState } from "react";

// Narrow vertical beams of light in the intro's name palette (INTRO_FONTS accents), modelled on the BoardUI hero:
// the page starts white and the light comes in pulses. In each pulse every beam drops in from the top on its own beat,
// its light running downward as its blur tightens, then the top goes out first and the light leaves downward, back to
// white before the next pulse. Only transparency changes, never the hue.
type Tone = "blue" | "purple" | "orange" | "green" | "yellow";
type Beam = {
  left: number; width: number; min: number; height: number; tone: Tone;
  /** Opacity at the height of a pulse, and when motion is reduced. */ peak: number; still: number;
  /** Seconds after the pulse starts. */ delay: number;
  blur: number; sway: number;
};

const BEAMS: Beam[] = [
  { left: 7, width: 1.6, min: 12, height: 30, tone: "blue", peak: .62, still: .46, blur: 12, delay: 0.06, sway: 10 },
  { left: 9.4, width: 2.6, min: 18, height: 24, tone: "purple", peak: .52, still: .38, blur: 16, delay: 0.2, sway: -12 },
  { left: 22, width: 1.2, min: 10, height: 19, tone: "orange", peak: .46, still: .32, blur: 10, delay: 0.31, sway: 8 },
  { left: 31, width: 1.4, min: 10, height: 18, tone: "green", peak: .3, still: .2, blur: 12, delay: 0.41, sway: -6 },
  { left: 41, width: 3.2, min: 22, height: 35, tone: "blue", peak: .58, still: .43, blur: 18, delay: 0, sway: 14 },
  { left: 44.6, width: 1.4, min: 10, height: 27, tone: "purple", peak: .54, still: .39, blur: 10, delay: 0.14, sway: -8 },
  { left: 58, width: 4.6, min: 30, height: 32, tone: "blue", peak: .5, still: .36, blur: 22, delay: 0.1, sway: 12 },
  { left: 63.4, width: 1.6, min: 12, height: 22, tone: "orange", peak: .5, still: .34, blur: 12, delay: 0.24, sway: -10 },
  { left: 66, width: 1.2, min: 10, height: 26, tone: "purple", peak: .56, still: .41, blur: 10, delay: 0.35, sway: 6 },
  { left: 76, width: 2, min: 14, height: 21, tone: "yellow", peak: .5, still: .35, blur: 14, delay: 0.27, sway: -12 },
  { left: 88, width: 2.4, min: 16, height: 29, tone: "purple", peak: .54, still: .4, blur: 16, delay: 0.15, sway: 10 },
];

/**
 * Timings measured frame by frame from the reference: a pulse every ~3.3s; light builds at the top for ~1s, runs down
 * the page at ~300px/s, the top goes out before the bottom, and the page is white again for ~.4s before the next pulse.
 */
const PULSE = { period: 3.3, rise: 1.45, reveal: 1.5, sharpen: 1.6, fade: 1.05, jitter: .1, ease: [.6, 0, .25, 1] as const };
const random = (min: number, max: number) => min + Math.random() * (max - min);

function LightBeam({ beam, pulse, reduced, mobile }: { beam: Beam; pulse: number; reduced: boolean; mobile: boolean }) {
  const opacity = useMotionValue(0);
  const x = useMotionValue(0);
  const scaleY = useMotionValue(1);
  const blur = useMotionValue(beam.blur);
  // The lit stretch of the beam, in % of its height: `front` is how far down the light has reached, `tail` how far
  // the top has already gone out.
  const front = useMotionValue(140);
  const tail = useMotionValue(-40);
  const filter = useMotionTemplate`blur(${blur}px)`;
  const mask = useMotionTemplate`linear-gradient(to bottom, transparent ${tail}%, #000 calc(${tail}% + 30%), #000 ${front}%, transparent calc(${front}% + 40%))`;

  useEffect(() => {
    if (reduced) {
      if (pulse < 1) return;
      const fade = animate(opacity, beam.still, { duration: .6 });
      return () => fade.stop();
    }
    if (pulse < 1) return;
    // Each pulse starts dark, and varies a little so the repetition never feels mechanical.
    opacity.set(0); front.set(0); tail.set(-40); scaleY.set(.72); blur.set(beam.blur * 2.4);
    const delay = Math.max(0, beam.delay + random(-PULSE.jitter, PULSE.jitter));
    const peak = beam.peak * random(.82, 1.1);
    const running: { stop: () => void }[] = [];
    const run = (value: MotionValue<number>, target: number, options: ValueAnimationTransition<number>) => {
      const control = animate(value, target, options); running.push(control); return control;
    };
    run(front, 140, { duration: PULSE.reveal, delay, ease: [.3, 0, .2, 1] });
    run(scaleY, 1, { duration: PULSE.reveal, delay, ease: PULSE.ease });
    run(blur, beam.blur, { duration: PULSE.sharpen, delay, ease: "easeOut" });
    run(x, random(-1, 1) * beam.sway, { duration: PULSE.period, ease: "easeInOut" });
    run(opacity, peak, { duration: PULSE.rise, delay, ease: PULSE.ease }).then(() => {
      run(tail, 140, { duration: PULSE.fade, ease: [.4, 0, .6, 1] });
      run(opacity, 0, { duration: PULSE.fade, ease: [.4, 0, 1, 1] });
    });
    return () => running.forEach(control => control.stop());
  }, [pulse, reduced, beam, opacity, x, scaleY, blur, front, tail]);

  const geometry: Record<string, string> = { "--left": `${beam.left}%`, "--width": `${beam.width}%`, "--min": `${beam.min}px`, "--height": `${beam.height}%`, "--tone": `var(--accent-${beam.tone})` };
  return <motion.span className="hero-beam" data-mobile={mobile} style={{ ...geometry, opacity, x, scaleY, filter, maskImage: mask, WebkitMaskImage: mask }} />;
}

/** Beams left out on small screens, where the narrow Hero would crowd them. */
const DESKTOP_ONLY = new Set([3, 7]);

export function HeroLightBeams({ play, reduced }: { play: boolean; reduced: boolean }) {
  // One shared clock keeps every beam in the same pulse, as in the reference; 0 means not started yet.
  const [repeats, setRepeats] = useState(0);
  // The pulses only repeat while the Hero is on screen and the tab is visible; the pulse in flight always finishes.
  const glow = useRef<HTMLDivElement>(null);
  const [awake, setAwake] = useState(true);
  const wasAwake = useRef(true);
  useEffect(() => {
    const element = glow.current;
    if (!element) return;
    let inView = true;
    const update = () => {
      const next = inView && !document.hidden;
      // Coming back into view starts a pulse at once instead of waiting a whole period on a dark page.
      if (next && !wasAwake.current) setRepeats(count => count + 1);
      wasAwake.current = next;
      setAwake(next);
    };
    const observer = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; update(); });
    observer.observe(element);
    document.addEventListener("visibilitychange", update);
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", update); };
  }, []);
  useEffect(() => {
    if (!play || reduced || !awake) return;
    const clock = setInterval(() => setRepeats(count => count + 1), PULSE.period * 1000);
    return () => clearInterval(clock);
  }, [play, reduced, awake]);
  const pulse = play ? repeats + 1 : 0;
  return <div ref={glow} className="hero-glow" aria-hidden="true">
    {BEAMS.map((beam, index) => <LightBeam key={index} beam={beam} pulse={pulse} reduced={reduced} mobile={!DESKTOP_ONLY.has(index)} />)}
  </div>;
}
