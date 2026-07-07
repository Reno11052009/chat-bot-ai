import { Sidebar } from "@/components/layout/sidebar";
import { SettingsClient } from "@/components/settings/settings-client";

export default function SettingsPage() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-2xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
            <p className="text-muted-foreground mt-2">Manage your account settings and preferences.</p>
          </div>
          <SettingsClient />
        </div>
      </div>
    </div>
  );
}
