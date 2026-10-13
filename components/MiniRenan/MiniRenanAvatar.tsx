import type { AvatarState } from "./data";

// Replace only this artwork with final sprites; interaction states stay independent.
export function MiniRenanAvatar({ state, variant }: { state: AvatarState; variant: "default" | "labz" }) {
 const eyes = state === "judging" ? 1 : 2;
 return <svg viewBox="0 0 32 48" shapeRendering="crispEdges" aria-hidden="true">
  <path d="M11 2h10v2h3v12h-3v3H11v-3H8V4h3Z" fill="#443b33" />
  <path d="M11 7h10v3h2v6h-3v4h-8v-4H9v-6h2Z" fill="#d8b28d" />
  <path d="M11 5h10v3h-5v2h-5Z" fill="#443b33" />
  <path d={`M12 12h2v${eyes}h-2Zm6 0h2v${eyes}h-2Z`} fill="#242623" />
  <path d={state === "happy" ? "M13 16h2v1h2v-1h2v2h-6Z" : state === "panic" ? "M15 16h3v3h-3Z" : "M14 17h4v1h-4Z"} fill="#694b3b" />
  <path d="M13 20h6v3h-6Z" fill="#d8b28d" />
  <path d="M10 22h12v3h3v13h-4V27h-1v11h-8V27h-1v11H7V25h3Z" fill={variant === "labz" ? "#d0ef79" : "#4f7355"} />
  <path d="M7 36h4v4H7Zm14 0h4v4h-4Z" fill="#d8b28d" />
  <path d="M12 36h8v9h-3v-7h-2v7h-3Z" fill="#353d46" />
  <path d="M10 44h5v3h-5Zm7 0h5v3h-5Z" fill="#242623" />
 </svg>;
}
