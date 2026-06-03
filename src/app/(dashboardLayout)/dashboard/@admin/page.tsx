import { DashboardOverview } from "@/components/Dashboard/dashboard-overview";
import { getDashboardStats } from "@/services/dashboard.service";

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  return (
    <DashboardOverview
      title="Administration tools"
      description="Review system health, control permissions, and oversee the full workspace from one place."
      roleLabel="Admin panel"
      stats={stats}
      links={[
        {
          label: "Summary overview",
          href: "#summary",
          description: "Open the live counters for projects, tasks, and overdue items.",
        },
        {
          label: "Priority report",
          href: "#priority",
          description: "Review whether urgent work is growing or stable.",
        },
        {
          label: "Project progress",
          href: "#progress",
          description: "Inspect the chart for the latest delivery movement.",
        },
        {
          label: "Team member view",
          href: "/dashboard/my-tasks",
          description: "Open the task-centric screen used by contributors.",
        },
      ]}
    />
  );
}
