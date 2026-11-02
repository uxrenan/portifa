"use client";
import Image from "next/image";
import { useEffect, useState, type RefObject } from "react";
import { HERO_ASSETS, HERO_MOTION } from "@/config/hero";
import { Sticker } from "@/components/Sticker/Sticker";
import { useI18n } from "@/i18n/I18nProvider";
import { MiniRenanAvatar } from "@/components/MiniRenan/MiniRenanAvatar";

type Asset = typeof HERO_ASSETS[number];
type Geometry = { left: number; top: number; width: number; height: number; bounds: { left: number; right: number; top: number; bottom: number } };

/** Draws a pixel shape from rows of "#" on a square grid, crisp at any size. */
function Pixels({ rows, x, y, size, fill }: { rows: readonly string[]; x: number; y: number; size: number; fill: string }) {
  return <g fill={fill} shapeRendering="crispEdges">{rows.flatMap((row, r) => [...row].map((cell, c) => cell === "#" ? <rect key={`${r}-${c}`} x={x + c * size} y={y + r * size} width={size} height={size} /> : null))}</g>;
}

const CURSOR = ["#", "##", "###", "####", "#####", "######", "##", "#  #", "    #"] as const;
const CURSOR_EDGE = ["###", "####", "#####", "######", "#######", "########", "########", "#######", "## ####", "    ###", "     ##"] as const;
const ARROW = ["  ####", "     #", "    ##", "   # #", "  #  #", " #", "#"] as const;

// The hero's stickers are drawn for the site: its intro palette, its pixel cursor and arrow, Rio Grande and Mini Renan.
function Artwork({ kind }: { kind: Asset["id"] }) {
  if (kind === "personal") return <Image src="/hero/renan-sticker.webp" alt="" width={640} height={907} sizes="(max-width: 767px) 72px, 128px" priority draggable={false} />;
  // A site in the making: a browser window built from the intro's five colours, with the pixel cursor at work.
  if (kind === "ui") return <svg viewBox="0 0 120 90" aria-hidden="true"><rect x="2" y="2" width="116" height="86" rx="14" fill="#242623" /><rect x="6" y="16" width="108" height="68" rx="9" fill="#f2f3f0" /><circle cx="14" cy="9" r="2.6" fill="#ff6433" /><circle cx="22" cy="9" r="2.6" fill="#e9bb3f" /><circle cx="30" cy="9" r="2.6" fill="#4f7355" /><rect x="13" y="23" width="54" height="27" rx="5" fill="#3f5fff" /><path d="M19 32h30M19 39h20" stroke="#f2f3f0" strokeWidth="3.5" strokeLinecap="round" /><circle cx="88" cy="36" r="13" fill="#e9bb3f" /><path d="M80 40.5 86 33l4 5 3-3 4 5.5Z" fill="#242623" /><rect x="13" y="56" width="27" height="20" rx="4" fill="#8a63d2" /><rect x="45" y="56" width="27" height="20" rx="4" fill="#4f7355" /><rect x="77" y="56" width="16" height="8" rx="4" fill="#ff6433" /><Pixels rows={CURSOR_EDGE} x={86} y={52} size={2.6} fill="#f2f3f0" /><Pixels rows={CURSOR} x={88.6} y={54.6} size={2.6} fill="#242623" /></svg>;
  // A stamp from home: the lighthouse at the end of the breakwater, Rio Grande, RS.
  if (kind === "place") return <svg viewBox="0 0 90 100" aria-hidden="true"><rect x="2" y="2" width="86" height="96" rx="3" fill="#f7f1e3" /><g fill="#f2f3f0">{Array.from({ length: 8 }, (_, i) => <g key={i}><circle cx={9 + i * 10.3} cy="2" r="3" /><circle cx={9 + i * 10.3} cy="98" r="3" /><circle cx="2" cy={9 + i * 11.7} r="3" /><circle cx="88" cy={9 + i * 11.7} r="3" /></g>)}</g><rect x="10" y="10" width="70" height="66" rx="2" fill="#c9d3ff" /><circle cx="21" cy="22" r="6" fill="#e9bb3f" /><path d="M10 62q9-5 18 0t17 0 18 0 17 0v14H10Z" fill="#3f5fff" /><path d="M10 69q9-4 18 0t17 0 18 0 17 0" stroke="#f2f3f0" strokeWidth="1.6" fill="none" /><path d="M23 64h36l-5-6H28Z" fill="#242623" /><path d="M36 58l2-30h6l2 30Z" fill="#f2f3f0" /><path d="M36.9 44h8.2l.5 7h-9.2ZM37.7 32h6.6l.4 5h-7.4Z" fill="#ff6433" /><rect x="36.5" y="22" width="9" height="6" rx="1" fill="#242623" /><path d="M41 18l5.5 4h-11Z" fill="#ff6433" /><path d="M46 25l26-8v16Z" fill="#f2f3f0" opacity=".75" /><text x="45" y="88" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="7.4" letterSpacing=".6" fill="#242623">RIO GRANDE · RS</text></svg>;
  // The site's own mascot, in his Labz shirt.
  if (kind === "mini") return <svg viewBox="0 0 90 100" aria-hidden="true"><rect x="2" y="2" width="86" height="96" rx="6" fill="#8a63d2" /><path d="M2 20h86M2 38h86M2 56h86M2 74h86M20 2v96M38 2v96M56 2v96M74 2v96" stroke="#9d7be0" strokeWidth=".8" /><circle cx="45" cy="44" r="27" fill="#a989e6" /><g transform="translate(13.5 6) scale(.7)"><MiniRenanAvatar state="happy" variant="labz" /></g><rect x="14" y="80" width="62" height="12" rx="6" fill="#d0ef79" /><text x="45" y="88.6" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="6.6" letterSpacing=".6" fill="#242623">MINI RENAN</text></svg>;
  // Growth, in pixels: bars climbing towards the site's arrow.
  return <svg viewBox="0 0 90 100" aria-hidden="true"><rect x="2" y="2" width="86" height="96" rx="6" fill="#e9bb3f" /><path d="M12 84h66" stroke="#242623" strokeWidth="2" /><g shapeRendering="crispEdges"><rect x="14" y="70" width="12" height="13" fill="#3f5fff" /><rect x="30" y="58" width="12" height="25" fill="#8a63d2" /><rect x="46" y="46" width="12" height="37" fill="#4f7355" /><rect x="62" y="32" width="12" height="51" fill="#ff6433" /></g><Pixels rows={ARROW} x={48} y={10} size={4} fill="#242623" /><text x="13" y="94" fontFamily="var(--font-mono)" fontSize="6.4" letterSpacing=".6" fill="#242623">+ CRESCER</text></svg>;
}

export function HeroObject({ asset, index, section, slots, ready }: {
  asset: Asset; index: number; section: RefObject<HTMLElement | null>;
  slots: RefObject<(HTMLSpanElement | null)[]>; ready: boolean;
}) {
  const { t } = useI18n();
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
  return <Sticker className={`hero-object hero-object--${asset.id}`} label={t.hero.stickers[asset.id]} rotation={asset.rotation} shadow={asset.id === "personal" ? 1.2 : .8}
    style={{ left: geometry.left, top: geometry.top, width: geometry.width, height: geometry.height }} constraints={geometry.bounds}
    play={ready} delay={.65 + asset.slot * HERO_MOTION.lineStagger + (asset.slot === 2 ? (index - 2) * .07 : 0)}><Artwork kind={asset.id} /></Sticker>;
}
