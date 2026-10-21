// Explicit allowlist: sections, roots and layout wrappers are never targets.
export const TARGET_SELECTOR = ".hero-poster h1, section h2, section h3, section p, .project-visual, .hero-sticker, .site-header a, .site-footer a, .contact-action, .projects-filters button";

export function prepareTargets() {
 const targets = [...document.querySelectorAll<HTMLElement>(TARGET_SELECTOR)].filter(element => !element.closest("[data-mini-game],dialog") && !element.querySelector(TARGET_SELECTOR));
 const originals = targets.map(element => ({ element, hadStyle: element.hasAttribute("style"), attribute: element.getAttribute("data-destructible"), visibility: element.style.getPropertyValue("visibility"), priority: element.style.getPropertyPriority("visibility"), destroyed: element.getAttribute("data-destroyed") }));
 targets.forEach(element => element.setAttribute("data-destructible", ""));
 return { targets, restore: () => originals.forEach(({ element, hadStyle, attribute, visibility, priority, destroyed }) => {
  if (attribute === null) element.removeAttribute("data-destructible"); else element.setAttribute("data-destructible", attribute);
  if (destroyed === null) element.removeAttribute("data-destroyed"); else element.setAttribute("data-destroyed", destroyed);
  if (visibility) element.style.setProperty("visibility", visibility, priority); else element.style.removeProperty("visibility");
  if (!hadStyle && !element.getAttribute("style")) element.removeAttribute("style");
 }) };
}
