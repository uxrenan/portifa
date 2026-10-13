"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

export function SmoothScroll() {
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let dispose = () => {};

    function setup() {
      dispose();
      if (preference.matches) return;

      // Match dataportifa's Lenis version and wheel response.
      const lenis = new Lenis({
        lerp: 0.09,
        smoothWheel: true,
        wheelMultiplier: 0.9,
        prevent: node => !!node.closest("dialog"),
      });
      let frame = 0;
      function tick(time: number) {
        lenis.raf(time);
        frame = requestAnimationFrame(tick);
      }
      frame = requestAnimationFrame(tick);

      function navigate(event: MouseEvent) {
        if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        const anchor = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('a[href^="#"]') : null;
        const hash = anchor?.getAttribute("href");
        if (!hash || hash === "#") return;
        const target = document.getElementById(decodeURIComponent(hash.slice(1)));
        if (!target) return;
        event.preventDefault();
        lenis.scrollTo(target, { offset: -72, duration: 1.1 });
      }
      document.addEventListener("click", navigate);
      dispose = () => {
        cancelAnimationFrame(frame);
        document.removeEventListener("click", navigate);
        lenis.destroy();
      };
    }

    setup();
    preference.addEventListener("change", setup);
    return () => {
      preference.removeEventListener("change", setup);
      dispose();
    };
  }, []);

  return null;
}
