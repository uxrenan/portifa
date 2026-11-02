// Mini Renan's structure. Its lines and labels live in i18n/dictionaries (mini); section and model names below are the
// values saved with each note in the browser, so they stay fixed whatever the language.
export const NOTE_SECTIONS = [
 { label: "Hero", selector: ".hero-poster" }, { label: "Projetos", selector: "#projetos" },
 { label: "Serviços", selector: "#servicos" }, { label: "Sobre", selector: "#sobre" }, { label: "Renan Labz", selector: "#labz" },
] as const;
export const NOTE_MODELS = ["Post-it", "Ticket", "Papel", "Sticker"] as const;
export type AvatarState = "neutral" | "talking" | "judging" | "happy" | "panic" | "hidden";
export type Note = { id: string; section: string; model: typeof NOTE_MODELS[number]; name: string; comment: string };
export const NOTE_KEY = "renan:notes:v1";
export const SESSION_KEY = "renan:mini:v1";
/** Sections that get a contextual line, by selector → key in mini.context. */
export const CONTEXT_KEYS = { ".hero-poster": "hero", "#projetos": "projects", "#labz": "labz", "#sobre": "about", "#contato": "contact" } as const;
