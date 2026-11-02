import type { Metadata } from "next";
import { SitesPage } from "@/components/Pages/SitesPage";
import { pageMetadata } from "@/i18n/metadata";

export const metadata: Metadata = pageMetadata("pt-BR", "sites");

export default function Page() {
 return <SitesPage locale="pt-BR" />;
}
