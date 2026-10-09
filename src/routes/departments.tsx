import { createFileRoute } from "@tanstack/react-router";
import { OfficeWorkspace } from "@/components/office-workspace";
export const Route = createFileRoute("/departments")({
head:()=>({meta:[{title:"Departments — GetCryptoDomains.com"},{name:"description",content:"Departments in your GetCryptoDomains.com virtual headquarters."},{property:"og:title",content:"Departments — GetCryptoDomains.com"},{property:"og:description",content:"Owner-controlled departments for your AI company."},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary_large_image"}]}),
component:()=> <OfficeWorkspace view="Departments"/>,
});
