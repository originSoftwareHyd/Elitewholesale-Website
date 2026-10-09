import AdminHeader from "@/components/admin/AdminHeader";
import { siteConfig } from "@/lib/site";

export default function AdminSettingsPage() {
  return (
    <div>
      <AdminHeader title="Email Settings" />
      <div className="p-4 sm:p-7">
        <div className="glass max-w-lg rounded-xl p-6">
          <h2 className="font-semibold">Enquiry Notification Email</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            All website enquiry and contact forms are addressed to this email.
          </p>
          <p className="mt-3 font-medium text-foreground">{siteConfig.email}</p>
        </div>
      </div>
    </div>
  );
}
