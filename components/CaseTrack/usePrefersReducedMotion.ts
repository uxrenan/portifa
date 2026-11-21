"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";
const subscribe = (onChange: () => void) => {
 const media = window.matchMedia(QUERY);
 media.addEventListener("change", onChange);
 return () => media.removeEventListener("change", onChange);
};

/** The visitor's reduced-motion preference. Unlike Framer's useReducedMotion it reads `false` while hydrating, as the
 * server did, and switches right after — so the server HTML and the first client render always agree. */
export function usePrefersReducedMotion() {
 return useSyncExternalStore(subscribe, () => window.matchMedia(QUERY).matches, () => false);
}
