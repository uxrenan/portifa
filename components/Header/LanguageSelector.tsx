export function LanguageSelector({ englishHref }: { englishHref?: string }) {
  return <div className="language-selector" role="group" aria-label="Idioma">
    <span lang="pt-BR" aria-current="true" aria-label="Português, idioma atual">PT</span>
    <span aria-hidden="true">/</span>
    {englishHref ? <a href={englishHref} lang="en" hrefLang="en">EN</a> : <button type="button" disabled aria-label="English, ainda indisponível" title="Versão em inglês em breve">EN</button>}
  </div>;
}
