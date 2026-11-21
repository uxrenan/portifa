import type { Metadata } from "next";
import { CasePage } from "@/components/Pages/CasePage";
import { pageMetadata } from "@/i18n/metadata";

export const metadata: Metadata = pageMetadata("en", "waldemar");

export default function Page() {
 return <CasePage locale="en" caseKey="waldemar" />;
}
