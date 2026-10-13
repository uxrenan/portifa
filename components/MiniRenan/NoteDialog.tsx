"use client";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { NOTE_MODELS, NOTE_SECTIONS, type Note } from "./data";
import styles from "./mini.module.css";

export function MiniDialog({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
 const ref = useRef<HTMLDialogElement>(null);
 useEffect(() => {
  const element = ref.current!;
  const previous = document.activeElement as HTMLElement | null;
  const overflow = document.body.style.overflow;
  element.showModal(); document.body.style.overflow = "hidden";
  return () => { element.close(); document.body.style.overflow = overflow; if (previous?.isConnected && !previous.matches("body, html")) previous.focus(); else document.querySelector<HTMLButtonElement>('button[aria-label="Mini Renan — abrir menu"]')?.focus(); };
 }, []);
 return <dialog ref={ref} className={styles.dialog} aria-label={title} onCancel={e => { e.preventDefault(); onClose(); }}><div className={styles.dialogHeader}><h2>{title}</h2><button type="button" onClick={onClose} aria-label="Fechar">×</button></div>{children}</dialog>;
}

export function NoteComposer({ onSave, onClose }: { onSave: (note: Note) => string | null; onClose: () => void }) {
 const [step, setStep] = useState(1);
 const [section, setSection] = useState<string>(NOTE_SECTIONS[0].label);
 const [model, setModel] = useState<Note["model"]>("Post-it");
 const [name, setName] = useState("");
 const [comment, setComment] = useState("");
 const [error, setError] = useState("");
 return <MiniDialog title="Deixar um recado" onClose={onClose}>
  <p className={styles.step}>0{step} / 03 · {step === 1 ? "Onde?" : step === 2 ? "Qual formato?" : "Sua marca."}</p>
  <form onSubmit={e => { e.preventDefault(); if (step < 3) { setStep(step + 1); return; } if (!name.trim() || !comment.trim()) { setError("Preencha seu nome e comentário."); return; } setError(onSave({ id: crypto.randomUUID(), section, model, name: name.trim(), comment: comment.trim() }) || ""); }}>
   {step === 1 && <label>Seção<select autoFocus value={section} onChange={e => setSection(e.target.value)}>{NOTE_SECTIONS.map(s => <option key={s.label}>{s.label}</option>)}</select></label>}
   {step === 2 && <fieldset><legend>Modelo</legend><div className={styles.modelChoices}>{NOTE_MODELS.map(m => <label key={m} data-model={m}><input type="radio" name="model" value={m} checked={model === m} onChange={() => setModel(m)} />{m}</label>)}</div></fieldset>}
   {step === 3 && <><label>Nome<input autoFocus required maxLength={48} value={name} onChange={e => setName(e.target.value)} autoComplete="name" /></label><label>Comentário<textarea required maxLength={600} rows={5} value={comment} onChange={e => setComment(e.target.value)} /></label><p className={styles.localHint}>Protótipo local: este recado fica apenas neste navegador.</p></>}
   {error && <p role="alert">{error}</p>}
   <div className={styles.formActions}>{step > 1 && <button type="button" onClick={() => setStep(step - 1)}>Voltar</button>}<button type="submit">{step < 3 ? "Continuar →" : "Colar no site ↗"}</button></div>
  </form>
 </MiniDialog>;
}
