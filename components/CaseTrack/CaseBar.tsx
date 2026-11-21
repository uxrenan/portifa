"use client";

import { LanguageSelector } from "@/components/Header/LanguageSelector";
import type { CaseKey } from "@/i18n/config";
import { useI18n } from "@/i18n/I18nProvider";
import "@/components/Header/header.css";

/** The case's own top bar: its name, the language selector and a way back to the projects. */
export function CaseBar({ caseKey }: { caseKey: CaseKey }) {
 const { t, path } = useI18n();
 return <header className="case-bar">
  <p className="case-bar-name">{t.cases[caseKey].name}</p>
  <div className="case-bar-actions">
   <LanguageSelector />
   <a className="case-close" href={`${path("home")}#projetos`} aria-label={t.cases.labels.backLabel}>
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M6 6l12 12M18 6 6 18" /></svg>
   </a>
  </div>
 </header>;
}
