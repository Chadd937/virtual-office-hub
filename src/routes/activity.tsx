import { createFileRoute } from "@tanstack/react-router";
import { OfficeWorkspace } from "@/components/office-workspace";
export const Route = createFileRoute("/activity")({
head:()=>({meta:[{title:"Activity & logs — GetCryptoDomains.com"},{name:"description",content:"Activity & logs in your GetCryptoDomains.com virtual headquarters."},{property:"og:title",content:"Activity & logs — GetCryptoDomains.com"},{property:"og:description",content:"Owner-controlled activity & logs for your AI company."},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary_large_image"}]}),
component:()=> <OfficeWorkspace view="Activity & logs"/>,
});
