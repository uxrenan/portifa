import type { Metadata } from "next";
import { HomePage } from "@/components/Pages/HomePage";
import { pageMetadata } from "@/i18n/metadata";

export const metadata: Metadata = pageMetadata("en", "home");

export default function Page() {
 return <HomePage locale="en" />;
}
