import { createFileRoute } from "@tanstack/react-router";
import { OfficeWorkspace } from '@/components/office-workspace';
export const Route = createFileRoute("/")({
  head:()=>({meta:[{title:'GetCryptoDomains.com — Virtual Headquarters'},{name:'description',content:'Your virtual headquarters for real AI managers, employees, and owner-controlled work.'},{property:'og:title',content:'GetCryptoDomains.com — Virtual Headquarters'},{property:'og:description',content:'A lively virtual office with real AI work and human control.'},{property:'og:type',content:'website'},{name:'twitter:card',content:'summary_large_image'}]}),
  component: OfficeWorkspace,
});
