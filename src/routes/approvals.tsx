import { createFileRoute } from "@tanstack/react-router";
import { OfficeWorkspace } from "@/components/office-workspace";
export const Route = createFileRoute("/approvals")({
head:()=>({meta:[{title:"Approvals — GetCryptoDomains.com"},{name:"description",content:"Approvals in your GetCryptoDomains.com virtual headquarters."},{property:"og:title",content:"Approvals — GetCryptoDomains.com"},{property:"og:description",content:"Owner-controlled approvals for your AI company."},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary_large_image"}]}),
component:()=> <OfficeWorkspace view="Approvals"/>,
});
