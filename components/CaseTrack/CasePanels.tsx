"use client";

import Image from "next/image";
import type { CSSProperties } from "react";
import { Button } from "@/components/Button/Button";
import type { CasePanel, CaseShot, CaseStudy } from "@/config/cases";
import { quoteHref } from "@/config/identity";
import { useI18n } from "@/i18n/I18nProvider";

const ratio = (shot: CaseShot) => ({ "--ratio": `${shot.width} / ${shot.height}` }) as CSSProperties;

function Opening({ study }: { study: CaseStudy }) {
 const { t } = useI18n();
 const copy = t.cases[study.key];
 return <div className="case-panel case-panel-opening" data-kind="opening">
  <h1 className="case-title">{copy.title.map(line => <span key={line} className="case-title-line"><span>{line}</span> </span>)}</h1>
  <ul className="case-tags">{copy.tags.map(tag => <li key={tag}>{tag}</li>)}</ul>
 </div>;
}

function About({ study }: { study: CaseStudy }) {
 const { t } = useI18n();
 const copy = t.cases[study.key];
 const labels = t.cases.labels;
 return <div className="case-panel case-panel-about" data-kind="about">
  {([[labels.context, copy.context], [labels.goal, copy.goal], [labels.role, copy.role]] as const).map(([label, text]) => <div key={label} className="case-about-block">
   <h2>{label}</h2>
   <p>{text}</p>
  </div>)}
 </div>;
}

function Statement({ study }: { study: CaseStudy }) {
 const { t } = useI18n();
 return <div className="case-panel case-panel-statement" data-kind="statement">
  <p className="case-statement">{t.cases[study.key].statement}</p>
 </div>;
}

function Shot({ study, shot, sizes }: { study: CaseStudy; shot: CaseShot; sizes: string }) {
 const { t } = useI18n();
 return <div className="case-shot" style={ratio(shot)}>
  <Image src={shot.src} alt={t.cases[study.key].alts[shot.id] ?? ""} fill sizes={sizes} className="case-shot-image" />
 </div>;
}

function End({ study }: { study: CaseStudy }) {
 const { t, path } = useI18n();
 const labels = t.cases.labels;
 return <div className="case-panel case-panel-end" data-kind="end">
  <p className="case-end-heading">{t.contact.heading}</p>
  <div className="case-end-actions">
   <Button tone="dark" href={study.site} external aria-label={labels.visitLabel}>{labels.visit}</Button>
   <Button tone="dark" href={quoteHref(t.contact.quoteMessage)} external aria-label={t.contact.talkLabel}>{t.contact.talk}</Button>
   <Button tone="dark" variant="secondary" href={`${path("home")}#projetos`}>{labels.backToProjects}</Button>
  </div>
 </div>;
}

export function CasePanelView({ panel, study }: { panel: CasePanel; study: CaseStudy }) {
 switch (panel.kind) {
  case "opening": return <Opening study={study} />;
  case "about": return <About study={study} />;
  case "statement": return <Statement study={study} />;
  case "end": return <End study={study} />;
  case "image": return <figure className="case-panel case-panel-image" data-kind="image" data-id={panel.id} style={ratio(panel.shot)}>
   <Shot study={study} shot={panel.shot} sizes="(min-width: 768px) 80vw, 100vw" />
  </figure>;
  case "phones": return <figure className="case-panel case-panel-phones" data-kind="phones" data-id={panel.id}>
   {panel.shots.map(shot => <Shot key={shot.id} study={study} shot={shot} sizes="(min-width: 768px) 24vw, 33vw" />)}
  </figure>;
 }
}
