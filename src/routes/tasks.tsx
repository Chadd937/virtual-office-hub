import { createFileRoute } from "@tanstack/react-router";
import { OfficeWorkspace } from "@/components/office-workspace";
export const Route = createFileRoute("/tasks")({
head:()=>({meta:[{title:"Tasks & workflows — GetCryptoDomains.com"},{name:"description",content:"Tasks & workflows in your GetCryptoDomains.com virtual headquarters."},{property:"og:title",content:"Tasks & workflows — GetCryptoDomains.com"},{property:"og:description",content:"Owner-controlled tasks & workflows for your AI company."},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary_large_image"}]}),
component:()=> <OfficeWorkspace view="Tasks & workflows"/>,
});
