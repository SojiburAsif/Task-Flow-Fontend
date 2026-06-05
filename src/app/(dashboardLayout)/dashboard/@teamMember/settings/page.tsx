import React from "react";

import { SettingsPanel } from "@/components/Dashboard/SettingsPanel";
import { getCurrentUser } from "@/lib/currentUser";

export default async function TeamMemberSettingsPage() {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  return (
    <SettingsPanel
      user={user}
      title="Profile Settings"
      description="Update your profile details and account security in one place."
      roleLabel={user.role ? `${user.role} panel` : "Team member panel"}
    />
  );
}
