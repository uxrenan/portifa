import type { AnchorHTMLAttributes, CSSProperties, ReactNode } from "react";
import "./button.css";

/**
 * The arrow drawn in pixels on a 5×5 grid, like the section markers. Each pixel carries its place along the arrow
 * (`--step`, 0 at the tail, 8 at the tip), so hover can send it out of the corner tip-first and bring it back.
 */
const ARROW = [[0, 4], [1, 3], [2, 2], [3, 1], [1, 0], [2, 0], [3, 0], [4, 0], [4, 1], [4, 2], [4, 3]] as const;
const CELL = 3;
const PIXEL = 2;
/** The icon box: one pixel wider than the 15px grid, which sits one pixel down so the box stays square on whole pixels. */
const BOX = 16;

export function PixelArrow({ className = "pixel-arrow" }: { className?: string }) {
 return <svg className={className} viewBox={`0 -1 ${BOX} ${BOX}`} aria-hidden="true" focusable="false">
  {ARROW.map(([x, y]) => <rect key={`${x}-${y}`} x={x * CELL} y={y * CELL} width={PIXEL} height={PIXEL} style={{ "--step": x - y + 4 } as CSSProperties} />)}
 </svg>;
}

type ButtonProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "children"> & {
 href: string;
 children: ReactNode;
 /** Primary: the main action of a block. Secondary: an alternative beside it. */
 variant?: "primary" | "secondary";
 /** `dark` for buttons sitting on the site's dark panels. */
 tone?: "light" | "dark";
 size?: "md" | "sm";
 /** Opens in a new tab. */
 external?: boolean;
 /** Shown but not yet usable: the link is dropped until its destination exists. */
 disabled?: boolean;
};

/** The site's one call-to-action: a pill with its label and the pixel arrow. */
export function Button({ variant = "primary", tone = "light", size = "md", external, disabled, className, children, href, ...props }: ButtonProps) {
 return <a {...props} {...(disabled ? { "aria-disabled": true, role: "link" } : { href })} {...(external && !disabled ? { target: "_blank", rel: "noopener noreferrer" } : {})} className={className ? `button ${className}` : "button"} data-variant={variant} data-tone={tone} data-size={size}>
  <span className="button-label">{children}</span>
  <PixelArrow />
 </a>;
}
