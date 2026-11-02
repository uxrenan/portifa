import type { Locale } from "../config";
import { en } from "./en";
import { ptBR, type Dictionary } from "./pt-BR";

export type { Dictionary };
const DICTIONARIES: Record<Locale, Dictionary> = { "pt-BR": ptBR, en };

/** For Server Components and metadata. Client components read the active dictionary through useI18n(). */
export const getDictionary = (locale: Locale) => DICTIONARIES[locale];
