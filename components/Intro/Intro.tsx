import { motion } from "framer-motion";
import { INTRO_FONTS } from "@/config/identity";

export function Intro({ index }: { index: number }) {
 const state = INTRO_FONTS[index];
 return <div className="intro-stage" aria-hidden="true">{state && <div className="intro-mask"><motion.span key={index} className="intro-type" style={{ fontFamily: state.family, fontWeight: state.weight, fontStyle: state.style, color: state.color }} initial={state.reveal ? { y: "9%", opacity: 0.65, clipPath: "inset(12% 0 0 0)" } : false} animate={{ y: 0, opacity: 1, clipPath: "inset(0% 0 0% 0)" }} transition={{ duration: 0.09, ease: [0.22, 1, 0.36, 1] }}>Renan</motion.span></div>}</div>;
}
