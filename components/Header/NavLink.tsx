import type { ComponentProps } from "react";

export function NavLink({ children, ...props }: ComponentProps<"a">) {
 return <a {...props} className="nav-link"><span className="link-window"><span className="link-copy">{children}</span><span className="link-copy link-duplicate" aria-hidden="true">{children}</span></span></a>;
}
