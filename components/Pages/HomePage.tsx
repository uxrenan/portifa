import { Header } from "@/components/Header/Header";
import { Hero } from "@/components/Hero/Hero";
import { Projects } from "@/components/Projects/Projects";
import { Services } from "@/components/Services/Services";
import { About } from "@/components/About/About";
import { Contact } from "@/components/Contact/Contact";
import { Footer } from "@/components/Footer/Footer";
import { EditorialPause } from "@/components/EditorialPause/EditorialPause";
import { MiniRenanLazy } from "@/components/MiniRenan/MiniRenanLazy";
import { JsonLd, homeJsonLd } from "@/components/Seo/JsonLd";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { I18nProvider } from "@/i18n/I18nProvider";

/** The home, in either language. */
export function HomePage({ locale }: { locale: Locale }) {
 return <I18nProvider locale={locale} route="home" dictionary={getDictionary(locale)}>
  <JsonLd data={homeJsonLd(locale)} />
  <Header />
  <main><Hero /><Projects /><Services /><EditorialPause /><About /><Contact /></main>
  <Footer /><MiniRenanLazy />
 </I18nProvider>;
}
