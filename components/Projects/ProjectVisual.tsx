"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { motion, useSpring } from "framer-motion";
import { PixelArrow } from "@/components/Button/Button";
import { useI18n } from "@/i18n/I18nProvider";

const pointerQuery = "(min-width: 768px) and (hover: hover) and (pointer: fine)";
const spring = { stiffness: 550, damping: 42, mass: .45 };

export function ProjectVisual({ children, title }: { children: ReactNode; title: string }) {
  const { t } = useI18n();
  return <a className="project-visual" aria-disabled="true" tabIndex={-1} aria-label={`${t.projects.viewProject}: ${title} — ${t.projects.pending}`}>{children}</a>;
}

/** Labels that lead somewhere get the site's pixel arrow; the "coming soon" label stays plain. */
export function ProjectCursor({ reduced }: { reduced: boolean }) {
  const { t } = useI18n();
  const SOON = t.projects.soon;
  const fallback = t.projects.cursor;
  const [label, setLabel] = useState<string | null>(null);
  const pill = useRef<HTMLSpanElement>(null);
  const x = useSpring(0, spring);
  const y = useSpring(0, spring);

  useEffect(() => {
    const media = window.matchMedia(pointerQuery);
    let point: { x: number; y: number } | null = null;
    let active: HTMLElement | null = null;
    let activeLabel: string | null = null;
    let frame = 0;
    let moved = false;

    const hide = () => {
      active?.removeAttribute("data-cursor");
      active = null;
      if (activeLabel !== null) { activeLabel = null; setLabel(null); }
    };
    const reset = () => { point = null; hide(); };
    const check = () => {
      frame = 0;
      if (!point || !media.matches) { hide(); return; }
      const card = document.elementFromPoint(point.x, point.y)?.closest<HTMLElement>("[data-project-card]") ?? null;
      if (!card) { hide(); moved = false; return; }
      const changed = active !== card;
      const nextLabel = card.dataset.projectCard || fallback;
      if (changed) {
        active?.removeAttribute("data-cursor");
        active = card;
        card.setAttribute("data-cursor", "true");
      }
      if (activeLabel !== nextLabel) { activeLabel = nextLabel; setLabel(nextLabel); }
      if (moved || changed) {
        // The pill sizes to its label; before its first paint, an estimate keeps it inside the card.
        const width = pill.current?.offsetWidth || (nextLabel === SOON ? 96 : 150);
        const rect = card.getBoundingClientRect();
        const left = Math.max(8, Math.min(Math.max(point.x + 12, rect.left + 8), Math.min(rect.right, document.documentElement.clientWidth) - width - 8));
        const top = Math.max(8, Math.min(Math.max(point.y + 12, rect.top + 8), Math.min(rect.bottom, window.innerHeight) - 52));
        if (changed || reduced) { x.jump(left); y.jump(top); } else { x.set(left); y.set(top); }
      }
      moved = false;
    };
    const schedule = () => { if (point && !frame) frame = requestAnimationFrame(check); };
    const move = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") { reset(); return; }
      point = { x: event.clientX, y: event.clientY };
      moved = true;
      schedule();
    };
    const leave = (event: PointerEvent) => { if (!event.relatedTarget) reset(); };
    const detach = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("scroll", schedule, true);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("blur", reset);
      window.removeEventListener("keydown", reset);
      document.removeEventListener("pointerout", leave);
      cancelAnimationFrame(frame); frame = 0; reset();
    };
    const sync = () => {
      detach();
      if (!media.matches) return;
      window.addEventListener("pointermove", move, { passive: true });
      window.addEventListener("scroll", schedule, { passive: true, capture: true });
      window.addEventListener("resize", schedule, { passive: true });
      window.addEventListener("blur", reset);
      window.addEventListener("keydown", reset);
      document.addEventListener("pointerout", leave);
    };
    sync();
    media.addEventListener("change", sync);
    return () => { media.removeEventListener("change", sync); detach(); };
  }, [reduced, x, y, SOON, fallback]);

  return label && createPortal(<motion.span className="project-pointer" aria-hidden="true" ref={pill} style={{ x, y }} initial={{ opacity: 0, scale: .9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: reduced ? 0 : .16, ease: [.22, 1, .36, 1] }}>{label}{label !== SOON && <PixelArrow />}</motion.span>, document.body);
}
