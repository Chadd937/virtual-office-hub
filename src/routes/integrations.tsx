import { createFileRoute } from "@tanstack/react-router";
import { OfficeWorkspace } from "@/components/office-workspace";
export const Route = createFileRoute("/integrations")({
head:()=>({meta:[{title:"Integrations — GetCryptoDomains.com"},{name:"description",content:"Integrations in your GetCryptoDomains.com virtual headquarters."},{property:"og:title",content:"Integrations — GetCryptoDomains.com"},{property:"og:description",content:"Owner-controlled integrations for your AI company."},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary_large_image"}]}),
component:()=> <OfficeWorkspace view="Integrations"/>,
});
