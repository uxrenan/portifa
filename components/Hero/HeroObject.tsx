"use client";
import Image from "next/image";
import { useEffect, useState, type RefObject } from "react";
import { HERO_ASSETS, HERO_MOTION } from "@/config/hero";
import { Sticker } from "@/components/Sticker/Sticker";

type Asset = typeof HERO_ASSETS[number];
type Geometry = { left: number; top: number; width: number; height: number; bounds: { left: number; right: number; top: number; bottom: number } };

function Artwork({ kind }: { kind: Asset["id"] }) {
  if (kind === "personal") return <Image src="/hero/renan-sticker.webp" alt="" width={640} height={907} priority draggable={false} />;
  if (kind === "ui") return <svg viewBox="0 0 120 90" aria-hidden="true"><rect x="2" y="2" width="116" height="86" rx="18" fill="#adc1d0" /><rect x="14" y="16" width="92" height="18" rx="9" fill="#f2f3f0" /><circle cx="25" cy="25" r="5" fill="#547184" /><path d="M18 46h84M18 57h62" stroke="#547184" strokeWidth="5" strokeLinecap="round" /><rect x="17" y="69" width="41" height="8" rx="4" fill="#354c5c" /><path d="m83 51 2 27 7-8 8 8 5-5-8-8 10-3z" fill="#f2f3f0" stroke="#354c5c" strokeWidth="1.5" /></svg>;
  if (kind === "print") return <svg viewBox="0 0 90 100" aria-hidden="true"><rect x="2" y="2" width="86" height="96" rx="5" fill="#e6b458" /><path d="M16 19h58M16 27h40" stroke="#453d2d" strokeWidth="2" /><text x="9" y="76" fontFamily="var(--font-wordmark)" fontSize="47" letterSpacing="-4" fill="#453d2d">UX</text><path d="M16 87h58" stroke="#453d2d" strokeWidth="2" /></svg>;
  if (kind === "landscape") return <svg viewBox="0 0 90 100" aria-hidden="true"><rect x="2" y="2" width="86" height="96" rx="5" fill="#f7f4e9" /><path d="M7 7h76v78H7z" fill="#aabcb0" /><circle cx="66" cy="26" r="10" fill="#f0d18b" /><path d="M7 75 29 36l29 39V85H7" fill="#4b6b57" /><path d="m35 85 28-36 20 29v7" fill="#80947c" /><path d="M12 92h26" stroke="#5d6b60" strokeWidth="1.5" /></svg>;
  return <svg viewBox="0 0 90 100" aria-hidden="true"><rect x="2" y="2" width="86" height="96" rx="5" fill="#d3a39c" /><path d="M47 83V39m0 33c-18 0-22-15-22-15 20-1 22 15 22 15m0-9c17 0 22-13 22-13-18-2-22 13-22 13" fill="#496a50" stroke="#496a50" strokeWidth="3" /><path d="M44 18c-4-15-19-4-12 7-16-2-16 17 0 18-7 13 8 22 15 9 6 13 21 2 14-9 16-4 9-21-3-18 6-14-10-19-14-7" fill="#f4dfb9" /><circle cx="46" cy="35" r="8" fill="#b87a41" /></svg>;
}

export function HeroObject({ asset, index, section, slots, ready }: {
  asset: Asset; index: number; section: RefObject<HTMLElement | null>;
  slots: RefObject<(HTMLSpanElement | null)[]>; ready: boolean;
}) {
  const [geometry, setGeometry] = useState<Geometry>();
  useEffect(() => {
    const root = section.current;
    const slot = slots.current[asset.slot];
    if (!root || !slot) return;
    const measure = () => {
      const rect = root.getBoundingClientRect();
      const anchor = slot.getBoundingClientRect();
      const height = anchor.height * (asset.slot === 2 ? .9 : asset.id === "ui" ? .96 : asset.id === "personal" ? 1.24 : 1);
      const width = height * (asset.id === "ui" ? 1.33 : asset.slot === 2 ? .9 : asset.id === "personal" ? 640 / 907 : 1);
      const left = anchor.left - rect.left + (anchor.width - width) / 2 + asset.offset * anchor.width;
      const top = anchor.top - rect.top + (anchor.height - height) / 2 + anchor.height * .025;
      const margin = Math.max(width, height) * .28;
      const bounds = { left: margin - left, right: root.clientWidth - left - width - margin, top: 98 + margin - top, bottom: root.clientHeight - top - height - margin };
      setGeometry({ left, top, width, height, bounds });
    };
    let active = true;
    measure();
    void document.fonts.ready.then(() => { if (active) measure(); });
    const observer = new ResizeObserver(measure);
    observer.observe(root); observer.observe(slot);
    return () => { active = false; observer.disconnect(); };
  }, [asset, section, slots]);
  if (!geometry) return null;
  return <Sticker className={`hero-object hero-object--${asset.id}`} label={asset.label} rotation={asset.rotation} shadow={asset.id === "personal" ? 1.2 : .8}
    style={{ left: geometry.left, top: geometry.top, width: geometry.width, height: geometry.height }} constraints={geometry.bounds}
    play={ready} delay={.65 + asset.slot * HERO_MOTION.lineStagger + (asset.slot === 2 ? (index - 2) * .07 : 0)}><Artwork kind={asset.id} /></Sticker>;
}
