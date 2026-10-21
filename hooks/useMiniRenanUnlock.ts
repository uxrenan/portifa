"use client";
import { useEffect, useState } from "react";

export function useMiniRenanUnlock(enabled: boolean) {
 const [unlocked, setUnlocked] = useState(false);
 const [firstUnlock, setFirstUnlock] = useState(false);
 const [onHero, setOnHero] = useState(true);
 useEffect(() => {
  if (!enabled) return;
  const reset = process.env.NODE_ENV === "development" && new URLSearchParams(location.search).has("resetMiniRenan");
  let previouslyUnlocked = false;
  try {
   if (reset) { localStorage.removeItem("miniRenanUnlocked"); sessionStorage.removeItem("renan:mini:v1"); }
   previouslyUnlocked = localStorage.getItem("miniRenanUnlocked") === "true";
  } catch { /* Unlock remains available without storage. */ }
  const target = document.querySelector("#sobre");
  if (!target) return;
  // On tall mobile sections observe the introduction, rather than requiring
  // half of a section taller than the viewport to fit on screen.
  const observed = target.getBoundingClientRect().height > innerHeight * 2 ? target.querySelector("h2") || target : target;
  let sequenceTimer: ReturnType<typeof setTimeout>;
  const observer = new IntersectionObserver(entries => {
   if (!entries.some(entry => entry.isIntersecting && entry.intersectionRatio >= .35)) return;
   try { localStorage.setItem("miniRenanUnlocked", "true"); } catch { /* Memory-only fallback. */ }
   setFirstUnlock(!previouslyUnlocked); setUnlocked(true); observer.disconnect();
   if (!previouslyUnlocked) sequenceTimer = setTimeout(() => setFirstUnlock(false), 6500);
  }, { threshold: .35 });
  observer.observe(observed);
  // Reaching About gates this visit too. Returning to Hero always hides the layer,
  // while localStorage still prevents replaying the first-unlock sequence.
  const hero = document.querySelector(".hero-poster");
  const heroObserver = new IntersectionObserver(entries => {
   setOnHero(entries.some(entry => entry.isIntersecting));
  });
  if (hero) heroObserver.observe(hero);
  return () => { observer.disconnect(); heroObserver.disconnect(); clearTimeout(sequenceTimer); };
 }, [enabled]);
 return { unlocked: unlocked && !onHero, firstUnlock };
}
