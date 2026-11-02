/** Renders the **bold** spans of a dictionary string as <strong>. */
export function Emphasis({ text }: { text: string }) {
 return text.split(/(\*\*[^*]+\*\*)/).map((part, index) => part.startsWith("**") ? <strong key={index}>{part.slice(2, -2)}</strong> : part);
}

/** Splits a dictionary string on its line breaks, as <br /> separated lines. */
export function Lines({ text }: { text: string }) {
 return text.split("\n").map((line, index) => <span key={index}>{index > 0 && <br />}{line}</span>);
}
