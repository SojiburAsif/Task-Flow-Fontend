import React from "react";
import { ActivityTimeline } from "@/components/Dashboard/ActivityTimeline";
import { getCurrentUser } from "@/lib/currentUser";
import { getLatestActivities } from "@/services/activity.service";

export default async function TeamMemberActivitiesPage() {
  const [activities, user] = await Promise.all([getLatestActivities(), getCurrentUser()]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-zinc-50 dark:bg-black min-h-screen transition-colors duration-300 pt-20">
      <div className="max-w-7xl mx-auto w-full">
        <ActivityTimeline
          activities={activities ?? []}
          title="My Activity Feed"
          description="Follow updates related to your assigned projects and tasks in one clean timeline."
          roleLabel={user?.role ? `${user.role.replace(/_/g, " ")} Panel` : "Team Member Panel"}
        />
      </div>
    </div>
  );
}