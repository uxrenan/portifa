import { type CaseKey, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { I18nProvider } from "@/i18n/I18nProvider";

/** A project case study, in either language. */
export function CasePage({ locale, caseKey }: { locale: Locale; caseKey: CaseKey }) {
 const dictionary = getDictionary(locale);
 const t = dictionary.cases[caseKey];
 const labels = dictionary.cases.labels;
 return <I18nProvider locale={locale} route={caseKey} dictionary={dictionary}>
  <main>
   <h1>{t.title.join(" ")}</h1>
   <p>{labels.context}</p><p>{t.context}</p>
   <p>{labels.goal}</p><p>{t.goal}</p>
   <p>{labels.role}</p><p>{t.role}</p>
  </main>
 </I18nProvider>;
}
