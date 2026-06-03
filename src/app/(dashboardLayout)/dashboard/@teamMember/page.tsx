import { DashboardOverview } from "@/components/Dashboard/dashboard-overview";
import { getDashboardStats } from "@/services/dashboard.service";

export default async function TeamMemberDashboardPage() {
  const stats = await getDashboardStats();

  return (
    <DashboardOverview
      title="Your work queue"
      description="Focus on assigned tasks, check updates, and close work items without extra noise."
      roleLabel="Team member panel"
      stats={stats}
      links={[
        {
          label: "My tasks",
          href: "/dashboard/my-tasks",
          description: "Jump directly to the task list assigned to you.",
        },
        {
          label: "Project progress",
          href: "#progress",
          description: "See the latest project completion chart and status.",
        },
        {
          label: "Priority breakdown",
          href: "#priority",
          description: "Check how your workload is distributed by priority.",
        },
        {
          label: "Overview stats",
          href: "#summary",
          description: "Open the live counters for projects, tasks, and overdue items.",
        },
      ]}
    />
  );
}
