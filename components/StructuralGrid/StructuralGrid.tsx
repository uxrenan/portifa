import "./structural-grid.css";

type Props = { tone?: "light" | "dark"; variant?: "standard" | "minimal" | "hero" };

/** Decorative, inert guides. Content and section dimensions remain independent. */
export function StructuralGrid({ tone = "light", variant = "standard" }: Props) {
 return <div className="structural-grid" data-tone={tone} data-variant={variant} aria-hidden="true"><span className="structural-rail" /><span className="structural-rail" /></div>;
}
