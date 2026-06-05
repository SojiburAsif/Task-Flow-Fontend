import { DashboardOverview } from "@/components/Dashboard/dashboard-overview";
import { TeamMemberDashboardCharts } from "../../../../components/Dashboard/team-member-dashboard-charts";
import { getDashboardStats } from "@/services/dashboard.service";

export default async function TeamMemberDashboardPage() {
  const stats = await getDashboardStats();

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(168,85,247,0.08),transparent_32%),linear-gradient(180deg,#fafafa_0%,#ffffff_52%,#f4f4f5_100%)] text-zinc-950 dark:bg-[radial-gradient(circle_at_top,rgba(168,85,247,0.18),transparent_28%),linear-gradient(180deg,#09090b_0%,#111114_52%,#18181b_100%)] dark:text-zinc-50">
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
            href: "#priority-overview",
            description: "Check how your workload is distributed by priority.",
          },
          {
            label: "Status mix",
            href: "#status-mix",
            description: "Review how much work is pending, active, completed, or overdue.",
          },
        ]}
      />

      <section className="mx-auto w-full max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
        <TeamMemberDashboardCharts stats={stats} />
      </section>
    </main>
  );
}
