import React from "react";

import { ActivityTimeline } from "@/components/Dashboard/ActivityTimeline";
import { getCurrentUser } from "@/lib/currentUser";
import { getLatestActivities } from "@/services/activity.service";

export default async function AdminActivitiesPage() {
  const [activities, user] = await Promise.all([getLatestActivities(), getCurrentUser()]);

  return (
    <ActivityTimeline
      activities={activities ?? []}
      title="Activity Logs"
      description="Track all recent workspace operations, including project and task updates across teams."
      roleLabel={user?.role ? `${user.role} panel` : "Admin panel"}
    />
  );
}
