import React from "react";
import { DashboardOverview } from "@/components/Dashboard/dashboard-overview";
import { getDashboardStats } from "@/services/dashboard.service";

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  return (
    <div className="min-h-screen bg-zinc-50 p-4 pt-20 transition-colors duration-300 dark:bg-black sm:p-6 lg:p-8">
      <div className="mx-auto w-full max-w-7xl">
        <DashboardOverview
          title="Administration Tools"
          description="Review system health, control permissions, and oversee the full workspace from one central hub."
          roleLabel="Admin Panel"
          stats={stats}
          links={[
          
            {
              label: "Admin Tasks",
              href: "/dashboard/AdminTasks",
              description: "Open the full task queue for workspace administration.",
            },
            {
              label: "Admin Projects",
              href: "/dashboard/AdminProjects",
              description: "Inspect every project in the workspace.",
            },
            {
              label: "Admin Activities",
              href: "/dashboard/AdminActivities",
              description: "Review recent system activity logs.",
            },
            {
              label: "Admin Settings",
              href: "/dashboard/AdminSettings",
              description: "Open account and security preferences.",
            },
          ]}
        />
      </div>
    </div>
  );
}