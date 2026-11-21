import type { Metadata } from "next";
import { CasePage } from "@/components/Pages/CasePage";
import { pageMetadata } from "@/i18n/metadata";

export const metadata: Metadata = pageMetadata("pt-BR", "waldemar");

export default function Page() {
 return <CasePage locale="pt-BR" caseKey="waldemar" />;
}
