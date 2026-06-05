"use server";

import React from "react";
import { getCurrentUser } from "@/lib/currentUser";
import { getDashboardStats } from "@/services/dashboard.service";
import { DashboardOverview } from "@/components/Dashboard/dashboard-overview";

export default async function AnalyticsPage() {
  const [user, stats] = await Promise.all([getCurrentUser(), getDashboardStats()]);

  const links = [
    { label: "Projects", href: "/dashboard/projects", description: "Manage projects" },
    { label: "Tasks", href: "/dashboard/tasks", description: "View all tasks" },
    { label: "Activities", href: "/activities", description: "Recent activity" },
    { label: "Settings", href: "/dashboard/settings", description: "Workspace settings" },
  ];

  return (
    <div className="p-6 sm:p-8 lg:p-10 mt-14">
      <DashboardOverview
        title="Analytics"
        description="Workspace analytics and trends"
        roleLabel={user?.role ? `${user.role} analytics` : "Workspace analytics"}
        stats={stats}
        links={links}
      />
    </div>
  );
}
