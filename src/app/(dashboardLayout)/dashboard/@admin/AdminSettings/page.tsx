import React from "react";

import { SettingsPanel } from "@/components/Dashboard/SettingsPanel";
import { getCurrentUser } from "@/lib/currentUser";

export default async function AdminSettingsPage() {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  return (
    <SettingsPanel
      user={user}
      title="Settings"
      description="Manage your admin account profile and security preferences for this workspace."
      roleLabel={user.role ? `${user.role} panel` : "Admin panel"}
    />
  );
}
