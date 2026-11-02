import Link from "next/link";
import { Header } from "@/components/Header/Header";
import { Footer } from "@/components/Footer/Footer";
import { Contact } from "@/components/Contact/Contact";
import { Button } from "@/components/Button/Button";
import { PixelConstellation } from "@/components/PixelConstellation/PixelConstellation";
import { JsonLd, sitesJsonLd } from "@/components/Seo/JsonLd";
import { quoteHref } from "@/config/identity";
import { SITE_TYPE_IDS } from "@/config/sites-page";
import { pathFor, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { I18nProvider } from "@/i18n/I18nProvider";
import "./sites-page.css";

/** The website design service page, in either language. */
export function SitesPage({ locale }: { locale: Locale }) {
 const dictionary = getDictionary(locale);
 const t = dictionary.sitesPage;
 const home = pathFor(locale, "home");
 return <I18nProvider locale={locale} route="sites" dictionary={dictionary}>
  <JsonLd data={sitesJsonLd(locale)} />
  <Header intro={false} />
  <main className="sites-page">
   <section className="site-container sites-hero" aria-labelledby="sites-title">
    <nav className="sites-breadcrumb" aria-label={t.breadcrumb}><Link href={home}>{dictionary.meta.breadcrumbHome}</Link><span aria-hidden="true">/</span><span aria-current="page">{t.breadcrumbCurrent}</span></nav>
    <span className="sites-label"><span className="pixel-marker"><PixelConstellation variant="north" />{t.label}</span></span>
    <h1 id="sites-title">{t.title}</h1>
    <p className="sites-lead">{t.lead}</p>
    <div className="sites-actions">
     <Button href={quoteHref(dictionary.contact.quoteMessage)} external aria-label={dictionary.contact.quoteLabel}>{dictionary.contact.quote}</Button>
     <Button variant="secondary" href={`${home}#projetos`}>{dictionary.hero.projects}</Button>
    </div>
    <p className="sites-reach">{t.reach}</p>
   </section>

   <section className="site-container sites-block" aria-labelledby="sites-types">
    <header className="sites-block-head">
     <span className="sites-label"><span className="pixel-marker"><PixelConstellation variant="drift" />{t.typesLabel}</span></span>
     <h2 id="sites-types">{t.typesTitle}</h2>
    </header>
    <div className="sites-grid">{t.types.map((type, index) => <article key={SITE_TYPE_IDS[index]} id={SITE_TYPE_IDS[index]} className="sites-card">
     <h3>{type.title}</h3>
     <p>{type.text}</p>
     <p className="sites-fit">{type.fit}</p>
    </article>)}</div>
   </section>

   <section className="site-container sites-block" aria-labelledby="sites-principles">
    <header className="sites-block-head">
     <span className="sites-label"><span className="pixel-marker"><PixelConstellation variant="spark" />{t.principlesLabel}</span></span>
     <h2 id="sites-principles">{t.principlesTitle}</h2>
     <p>{t.principlesText}</p>
    </header>
    <ul className="sites-list">{t.principles.map(item => <li key={item.title}><h3>{item.title}</h3><p>{item.text}</p></li>)}</ul>
   </section>

   <section className="site-container sites-block" aria-labelledby="sites-process">
    <header className="sites-block-head">
     <span className="sites-label"><span className="pixel-marker"><PixelConstellation variant="north" />{t.processLabel}</span></span>
     <h2 id="sites-process">{t.processTitle}</h2>
    </header>
    <ol className="sites-steps">{t.process.map((step, index) => <li key={step.title}><span className="sites-step-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span><h3>{step.title}</h3><p>{step.text}</p></li>)}</ol>
   </section>

   <section className="site-container sites-block" aria-labelledby="sites-faq">
    <header className="sites-block-head">
     <span className="sites-label"><span className="pixel-marker"><PixelConstellation variant="drift" />{t.faqLabel}</span></span>
     <h2 id="sites-faq">{t.faqTitle}</h2>
    </header>
    <div className="sites-faq">{t.faq.map(item => <details key={item.question}><summary><h3>{item.question}</h3><span aria-hidden="true" /></summary><p>{item.answer}</p></details>)}</div>
   </section>

   <Contact />
  </main>
  <Footer />
 </I18nProvider>;
}
