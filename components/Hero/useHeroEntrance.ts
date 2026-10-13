"use client";

import { useEffect, useState } from "react";
import { HERO_MOTION } from "@/config/hero";

// Read the existing intro's completion marker without changing its choreography.
export function useHeroEntrance(reduced: boolean | null) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const header = document.querySelector(".site-header");
    if (!header) return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const reveal = () => {
      if (header.getAttribute("data-phase") !== "ready") return;
      observer.disconnect();
      timer = setTimeout(() => setReady(true), reduced ? 0 : HERO_MOTION.afterMenu);
    };
    const observer = new MutationObserver(reveal);
    observer.observe(header, { attributes: true, attributeFilter: ["data-phase"] });
    reveal();
    return () => { observer.disconnect(); clearTimeout(timer); };
  }, [reduced]);

  return ready;
}
