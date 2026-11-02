import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SITE_URL } from "@/config/site";
import { RootDocument } from "@/components/Document/RootDocument";

// Root layout of the English pages: sets <html lang="en">.
// Base for absolute URLs (share images) on every page of this root, including the 404.
export const metadata: Metadata = { metadataBase: new URL(SITE_URL) };

export default function Layout({ children }: { children: ReactNode }) {
 return <RootDocument locale="en">{children}</RootDocument>;
}
