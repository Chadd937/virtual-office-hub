import { createFileRoute } from "@tanstack/react-router";
import { OfficeWorkspace } from "@/components/office-workspace";
export const Route = createFileRoute("/workforce")({
head:()=>({meta:[{title:"AI workforce — GetCryptoDomains.com"},{name:"description",content:"AI workforce in your GetCryptoDomains.com virtual headquarters."},{property:"og:title",content:"AI workforce — GetCryptoDomains.com"},{property:"og:description",content:"Owner-controlled ai workforce for your AI company."},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary_large_image"}]}),
component:()=> <OfficeWorkspace view="AI workforce"/>,
});
