import { DashboardOverview } from "@/components/Dashboard/dashboard-overview";
import { getDashboardStats } from "@/services/dashboard.service";

export default async function ProjectManagerDashboardPage() {
  const stats = await getDashboardStats();

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(168,85,247,0.08),transparent_32%),linear-gradient(180deg,#fafafa_0%,#ffffff_52%,#f4f4f5_100%)] text-zinc-950 dark:bg-[radial-gradient(circle_at_top,rgba(168,85,247,0.18),transparent_28%),linear-gradient(180deg,#09090b_0%,#111114_52%,#18181b_100%)] dark:text-zinc-50">
      <section className="mx-auto w-full max-w-7xl px-4 pt-20 sm:px-6 lg:px-8">
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
              label: "Task board",
              href: "/dashboard/tasks",
              description: "Jump to the task management board for execution details.",
            },
            {
              label: "Project console",
              href: "/dashboard/projects",
              description: "Open the project list and member view.",
            },
            {
              label: "Team activity",
              href: "/dashboard/activities",
              description: "Review the latest project and task activity.",
            },
          ]}
        />
      </section>
    </main>
  );
}
