import { CaseBar } from "@/components/CaseTrack/CaseBar";
import { CaseTrack } from "@/components/CaseTrack/CaseTrack";
import { CASES } from "@/config/cases";
import { type CaseKey, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { I18nProvider } from "@/i18n/I18nProvider";

/** A project case study, in either language: its own top bar over the horizontal track. */
export function CasePage({ locale, caseKey }: { locale: Locale; caseKey: CaseKey }) {
 return <I18nProvider locale={locale} route={caseKey} dictionary={getDictionary(locale)}>
  <CaseBar caseKey={caseKey} />
  <main className="case-page"><CaseTrack study={CASES[caseKey]} /></main>
 </I18nProvider>;
}
