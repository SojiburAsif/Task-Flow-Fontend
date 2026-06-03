import { DashboardOverview } from "@/components/Dashboard/dashboard-overview";
import { getDashboardStats } from "@/services/dashboard.service";

export default async function ProjectManagerDashboardPage() {
  const stats = await getDashboardStats();

  return (
    <DashboardOverview
      title="Delivery control"
      description="Plan milestones, balance workloads, and keep execution aligned with deadlines."
      roleLabel="Project manager panel"
      stats={stats}
      links={[
        {
          label: "Progress chart",
          href: "#progress",
          description: "See how each project is moving in the current cycle.",
        },
        {
          label: "Priority breakdown",
          href: "#priority",
          description: "Review where the urgent work is concentrated.",
        },
        {
          label: "Live counters",
          href: "#summary",
          description: "Check totals for projects, tasks, completed, and overdue items.",
        },
        {
          label: "My tasks",
          href: "/dashboard/my-tasks",
          description: "Jump to the task list view for execution details.",
        },
      ]}
    />
  );
}
