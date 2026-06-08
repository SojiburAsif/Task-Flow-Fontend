"use server";

import React from "react";
import { getCurrentUser } from "@/lib/currentUser";
import { getLatestActivities } from "@/services/activity.service";
import { ActivityTimeline } from "@/components/Dashboard/ActivityTimeline";

export default async function ActivitiesPage() {
  const [user, activities] = await Promise.all([getCurrentUser(), getLatestActivities()]);

  return (
    <div className="mt-14 bg-background px-4 py-6 text-foreground transition-colors sm:px-8 lg:px-10 lg:py-10" >
      <ActivityTimeline
        activities={activities ?? []}
        title="Activities"
        description="Recent activity across your workspace — useful for audits and quick status checks."
        roleLabel={user?.role ? `${user.role} feed` : "Workspace"}
      />
    </div>
  );
}
