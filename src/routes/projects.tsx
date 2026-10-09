import { createFileRoute } from "@tanstack/react-router";
import { OfficeWorkspace } from "@/components/office-workspace";
export const Route = createFileRoute("/projects")({
head:()=>({meta:[{title:"Projects — GetCryptoDomains.com"},{name:"description",content:"Projects in your GetCryptoDomains.com virtual headquarters."},{property:"og:title",content:"Projects — GetCryptoDomains.com"},{property:"og:description",content:"Owner-controlled projects for your AI company."},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary_large_image"}]}),
component:()=> <OfficeWorkspace view="Projects"/>,
});
