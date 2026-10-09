import { createFileRoute } from "@tanstack/react-router";
import { OfficeWorkspace } from "@/components/office-workspace";
export const Route = createFileRoute("/settings")({
head:()=>({meta:[{title:"Settings — GetCryptoDomains.com"},{name:"description",content:"Settings in your GetCryptoDomains.com virtual headquarters."},{property:"og:title",content:"Settings — GetCryptoDomains.com"},{property:"og:description",content:"Owner-controlled settings for your AI company."},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary_large_image"}]}),
component:()=> <OfficeWorkspace view="Settings"/>,
});
