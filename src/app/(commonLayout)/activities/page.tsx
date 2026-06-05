"use server";

import React from "react";
import { getCurrentUser } from "@/lib/currentUser";
import { getLatestActivities } from "@/services/activity.service";
import { ActivityTimeline } from "@/components/Dashboard/ActivityTimeline";

export default async function ActivitiesPage() {
  const [user, activities] = await Promise.all([getCurrentUser(), getLatestActivities()]);

  return (
    <div className="p-6 sm:p-8 lg:p-10 mt-14" >
      <ActivityTimeline
        activities={activities ?? []}
        title="Activities"
        description="Recent activity across your workspace — useful for audits and quick status checks."
        roleLabel={user?.role ? `${user.role} feed` : "Workspace"}
      />
    </div>
  );
}
