"use client";

import dynamic from "next/dynamic";

// Mini Renan only appears after the intro and once the visitor reaches About, so its code loads on the client after
// the page, instead of being part of the first bundle and the server HTML.
export const MiniRenanLazy = dynamic(() => import("./MiniRenan").then(module => module.MiniRenan), { ssr: false });
