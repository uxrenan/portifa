"use client";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";

type Language = "pt" | "en";

function BrazilFlag() {
  return <svg viewBox="0 0 20 14" aria-hidden="true" focusable="false">
    <rect width="20" height="14" fill="#009c3b" />
    <path d="M10 1.6 18.2 7 10 12.4 1.8 7Z" fill="#ffdf00" />
    <circle cx="10" cy="7" r="3.3" fill="#002776" />
    <path d="M6.8 6.3q3.4-.9 6.3 1" fill="none" stroke="#fff" strokeWidth=".7" />
  </svg>;
}

function UnitedStatesFlag() {
  return <svg viewBox="0 0 20 14" aria-hidden="true" focusable="false">
    <rect width="20" height="14" fill="#fff" />
    {[0, 2, 4, 6, 8, 10, 12].map(row => <rect key={row} y={row * 14 / 13} width="20" height={14 / 13} fill="#b22234" />)}
    <rect width="9" height={14 * 7 / 13} fill="#3c3b6e" />
    {[[1.5, 1.4], [4.5, 1.4], [7.5, 1.4], [3, 3.2], [6, 3.2], [1.5, 5], [4.5, 5], [7.5, 5]].map(([cx, cy]) => <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r=".45" fill="#fff" />)}
  </svg>;
}

const LANGUAGES = [
  { code: "pt", lang: "pt-BR", short: "PT-BR", name: "Português (BR)", Flag: BrazilFlag },
  { code: "en", lang: "en", short: "EN", name: "English", Flag: UnitedStatesFlag },
] as const;

/**
 * The site only exists in Portuguese for now: English stays listed but unavailable until a page is passed in
 * `englishHref`, at which point it becomes a real link.
 */
export function LanguageSelector({ englishHref, current = "pt", placement = "bottom" }: { englishHref?: string; current?: Language; placement?: "bottom" | "top" }) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const items = useRef<(HTMLElement | null)[]>([]);
  const menuId = useId();
  const reduced = useReducedMotion();
  const active = LANGUAGES.find(language => language.code === current) ?? LANGUAGES[0];
  const hrefs: Record<Language, string | undefined> = { pt: current === "pt" ? undefined : "/", en: englishHref };

  const close = (returnFocus: boolean) => { setOpen(false); if (returnFocus) trigger.current?.focus(); };

  useEffect(() => {
    if (!open) return;
    items.current[LANGUAGES.indexOf(active)]?.focus();
    const outside = (event: PointerEvent) => { if (!root.current?.contains(event.target as Node)) setOpen(false); };
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, [open, active]);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape" && open) {
      // Close only this menu, not a dialog it sits in.
      event.preventDefault(); event.stopPropagation(); close(true); return;
    }
    if (!open) {
      if (event.target === trigger.current && (event.key === "ArrowDown" || event.key === "ArrowUp")) { event.preventDefault(); setOpen(true); }
      return;
    }
    if (event.key === "Tab") { setOpen(false); return; }
    const index = items.current.indexOf(document.activeElement as HTMLElement);
    const last = LANGUAGES.length - 1;
    const next = event.key === "ArrowDown" ? (index + 1) % (last + 1) : event.key === "ArrowUp" ? (index <= 0 ? last : index - 1) : event.key === "Home" ? 0 : event.key === "End" ? last : -1;
    if (next >= 0) { event.preventDefault(); items.current[next]?.focus(); }
  };

  return <div ref={root} className="language-selector" data-open={open} data-placement={placement} onKeyDown={onKeyDown}>
    <button ref={trigger} type="button" className="language-trigger" aria-haspopup="menu" aria-expanded={open} aria-controls={open ? menuId : undefined}
      aria-label={`Idioma: ${active.name}`} onClick={() => setOpen(value => !value)}>
      <svg className="language-trigger-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="m5 8 6 6M4 14l6-6 2-3M2 5h12M7 2h1m14 20-5-10-5 10m2-4h6" /></svg>
      <span lang={active.lang}>{active.short}</span>
      <svg className="language-trigger-chevron" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="m6 9 6 6 6-6" /></svg>
    </button>
    <AnimatePresence>
      {open && <motion.div id={menuId} role="menu" aria-label="Escolher idioma" className="language-menu"
        initial={reduced ? { opacity: 0 } : { opacity: 0, y: placement === "top" ? 6 : -6, scale: .97 }} animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={reduced ? { opacity: 0 } : { opacity: 0, y: placement === "top" ? 4 : -4, scale: .98 }} transition={{ duration: reduced ? .1 : .18, ease: [.22, 1, .36, 1] }}>
        {LANGUAGES.map(({ code, lang, name, Flag }, index) => {
          const selected = code === current;
          const href = hrefs[code];
          const content = <><span className="language-flag"><Flag /></span><span className="language-name">{name}</span>
            {selected ? <svg className="language-check" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M20 6 9 17l-5-5" /></svg>
              : !href && <span className="language-soon" aria-hidden="true">em breve</span>}</>;
          const shared = { ref: (element: HTMLElement | null) => { items.current[index] = element; }, role: "menuitemradio", "aria-checked": selected, lang, tabIndex: -1, className: "language-item" } as const;
          if (selected) return <button key={code} type="button" {...shared} onClick={() => close(true)}>{content}</button>;
          if (href) return <a key={code} href={href} hrefLang={lang} {...shared} onClick={() => setOpen(false)}>{content}</a>;
          return <button key={code} type="button" {...shared} aria-disabled="true" aria-label={`${name}, em breve`}>{content}</button>;
        })}
      </motion.div>}
    </AnimatePresence>
  </div>;
}
