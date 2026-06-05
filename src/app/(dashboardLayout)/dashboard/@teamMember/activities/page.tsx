import React from "react";

import { ActivityTimeline } from "@/components/Dashboard/ActivityTimeline";
import { getCurrentUser } from "@/lib/currentUser";
import { getLatestActivities } from "@/services/activity.service";

export default async function TeamMemberActivitiesPage() {
  const [activities, user] = await Promise.all([getLatestActivities(), getCurrentUser()]);

  return (
    <ActivityTimeline
      activities={activities ?? []}
      title="My Activity Feed"
      description="Follow updates related to your assigned projects and tasks in one clean timeline."
      roleLabel={user?.role ? `${user.role} panel` : "Team member panel"}
    />
  );
}
