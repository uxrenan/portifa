"use client";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { NOTE_MODELS, NOTE_SECTIONS, type Note } from "./data";
import { useI18n } from "@/i18n/I18nProvider";
import styles from "./mini.module.css";

export function MiniDialog({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
 const { t } = useI18n();
 const ref = useRef<HTMLDialogElement>(null);
 useEffect(() => {
  const element = ref.current!;
  const previous = document.activeElement as HTMLElement | null;
  const overflow = document.body.style.overflow;
  element.showModal(); document.body.style.overflow = "hidden";
  return () => { element.close(); document.body.style.overflow = overflow; if (previous?.isConnected && !previous.matches("body, html")) previous.focus(); else document.querySelector<HTMLButtonElement>("button[data-mini-avatar]")?.focus(); };
 }, []);
 return <dialog ref={ref} className={styles.dialog} aria-label={title} onCancel={e => { e.preventDefault(); onClose(); }}><div className={styles.dialogHeader}><h2>{title}</h2><button type="button" onClick={onClose} aria-label={t.mini.composer.close}>×</button></div>{children}</dialog>;
}

export function NoteComposer({ onSave, onClose }: { onSave: (note: Note) => string | null; onClose: () => void }) {
 const { t } = useI18n();
 const [step, setStep] = useState(1);
 const [section, setSection] = useState<string>(NOTE_SECTIONS[0].label);
 const [model, setModel] = useState<Note["model"]>("Post-it");
 const [name, setName] = useState("");
 const [comment, setComment] = useState("");
 const [error, setError] = useState("");
 return <MiniDialog title={t.mini.composer.title} onClose={onClose}>
  <p className={styles.step}>0{step} / 03 · {t.mini.composer.steps[step - 1]}</p>
  <form onSubmit={e => { e.preventDefault(); if (step < 3) { setStep(step + 1); return; } if (!name.trim() || !comment.trim()) { setError(t.mini.composer.required); return; } setError(onSave({ id: crypto.randomUUID(), section, model, name: name.trim(), comment: comment.trim() }) || ""); }}>
   {step === 1 && <label>{t.mini.composer.section}<select autoFocus value={section} onChange={e => setSection(e.target.value)}>{NOTE_SECTIONS.map(s => <option key={s.label} value={s.label}>{t.mini.sections[s.label]}</option>)}</select></label>}
   {step === 2 && <fieldset><legend>{t.mini.composer.model}</legend><div className={styles.modelChoices}>{NOTE_MODELS.map(m => <label key={m} data-model={m}><input type="radio" name="model" value={m} checked={model === m} onChange={() => setModel(m)} />{t.mini.models[m]}</label>)}</div></fieldset>}
   {step === 3 && <><label>{t.mini.composer.name}<input autoFocus required maxLength={48} value={name} onChange={e => setName(e.target.value)} autoComplete="name" /></label><label>{t.mini.composer.comment}<textarea required maxLength={600} rows={5} value={comment} onChange={e => setComment(e.target.value)} /></label><p className={styles.localHint}>{t.mini.composer.localHint}</p></>}
   {error && <p role="alert">{error}</p>}
   <div className={styles.formActions}>{step > 1 && <button type="button" onClick={() => setStep(step - 1)}>{t.mini.composer.back}</button>}<button type="submit">{step < 3 ? t.mini.composer.next : t.mini.composer.submit}</button></div>
  </form>
 </MiniDialog>;
}
