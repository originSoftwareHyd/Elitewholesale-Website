import { siteConfig } from "@/lib/site";
import EnquiryPageClient from "./EnquiryPageClient";

export default function EnquiryPage() {
  return <EnquiryPageClient recipientEmail={siteConfig.email} />;
}
