export const NOTE_SECTIONS = [
 { label: "Hero", selector: ".hero-poster" }, { label: "Projetos", selector: "#projetos" },
 { label: "Serviços", selector: "#servicos" }, { label: "Sobre", selector: "#sobre" }, { label: "Renan Labz", selector: "#labz" },
] as const;
export const NOTE_MODELS = ["Post-it", "Ticket", "Papel", "Sticker"] as const;
export type AvatarState = "neutral" | "talking" | "judging" | "happy" | "panic" | "hidden";
export type Note = { id: string; section: string; model: typeof NOTE_MODELS[number]; name: string; comment: string };
export const NOTE_KEY = "renan:notes:v1";
export const SESSION_KEY = "renan:mini:v1";
export const LINES = {
 greeting: "Ei, pessoa 👀",
 invitation: "Se você me conhece, já trabalhou comigo ou só quer deixar sua marca por aqui… clica em mim.",
 saved: "Boa. Agora tem um pedaço seu aqui também.",
 more: "Achou que eu era um chatbot? Chatbot tá fora de moda. Lê o site todo que tu já vai encontrar tudo que precisa.",
 hide: ["Pera.", "Me esconder?", "A gente mal se conheceu."],
 cancel: "Sabia.", returned: "Sentiu minha falta?",
} as const;
export const CONTEXT_LINES = {
 ".hero-poster": "Oi. Sim, eu também estou nesse site.",
 "#projetos": "Essa é a parte em que eu tento parecer profissional.",
 "#labz": "Ok. Daqui pra frente eu não me responsabilizo.",
 "#sobre": "Chegou na parte de conhecer o cidadão.",
 "#contato": "Você chegou até aqui. Agora falar comigo já não custa nada.",
} as const;
