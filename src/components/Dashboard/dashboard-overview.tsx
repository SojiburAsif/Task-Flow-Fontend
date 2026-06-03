"use client";

import Link from "next/link";
import { ArrowRight, CalendarDays, CheckCircle2, LayoutGrid, ListTodo, TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import type { DashboardStats } from "@/services/dashboard.service";

export const description = "Dashboard overview with area chart and linked summary cards";

type DashboardOverviewProps = {
  title: string;
  description: string;
  roleLabel: string;
  stats: DashboardStats | null;
  links: Array<{
    label: string;
    href: string;
    description: string;
  }>;
};

const chartConfig = {
  progress: {
    label: "Progress",
    color: "hsl(var(--chart-1))",
  },
  completed: {
    label: "Completed",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

const buildChartData = (stats: DashboardStats | null) => {
  const projects = stats?.projectProgress ?? [];
  if (projects.length === 0) {
    return [
      { project: "No data", progress: 0, completed: 0 },
    ];
  }

  return projects.slice(0, 6).map((project, index) => ({
    project: project.name.length > 12 ? `${project.name.slice(0, 12)}…` : project.name,
    progress: project.progressPercentage,
    completed: Math.max(0, Math.min(100, project.progressPercentage - index * 2)),
  }));
};

export function DashboardOverview({ title, description, roleLabel, stats, links }: DashboardOverviewProps) {
  const chartData = buildChartData(stats);
  const counts = stats?.counts ?? {
    totalProjects: 0,
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    overdueTasks: 0,
  };

  const completionRate = counts.totalTasks > 0 ? Math.round((counts.completedTasks / counts.totalTasks) * 100) : 0;

  return (
    <section className="relative mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="absolute inset-x-4 top-0 h-px bg-linear-to-r from-transparent via-purple-400/80 to-transparent" />

      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-purple-500 dark:text-purple-400">{roleLabel}</p>
          <h1 className="text-3xl font-black tracking-tight text-zinc-950 dark:text-zinc-50 sm:text-4xl">{title}</h1>
          <p className="max-w-2xl text-sm leading-6 text-zinc-600 dark:text-zinc-400">{description}</p>
        </div>
        <div className="rounded-full border border-purple-500/20 bg-purple-500/10 px-4 py-2 text-sm font-semibold text-purple-700 dark:text-purple-300">
          {completionRate}% completion rate
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
        <Card className="border border-zinc-200/80 bg-white/90 shadow-[0_24px_80px_rgba(91,33,182,0.10)] backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/90 dark:shadow-black/30">
          <CardHeader className="border-b border-zinc-200/70 dark:border-zinc-800">
            <CardTitle className="flex items-center gap-2 text-xl text-zinc-950 dark:text-zinc-50">
              <LayoutGrid className="h-5 w-5 text-purple-500" />
              Project progress
            </CardTitle>
            <CardDescription className="text-zinc-600 dark:text-zinc-400">Your latest project completion snapshot across active work.</CardDescription>
          </CardHeader>
          <CardContent className="px-4 pb-0 pt-4 sm:px-6">
            <ChartContainer config={chartConfig} className="min-h-80 w-full">
              <AreaChart data={chartData} margin={{ left: -12, right: 12, top: 8, bottom: 0 }}>
                <CartesianGrid vertical={false} strokeOpacity={0.2} />
                <XAxis dataKey="project" tickLine={false} axisLine={false} tickMargin={10} />
                <YAxis tickLine={false} axisLine={false} tickMargin={10} domain={[0, 100]} tickCount={6} />
                <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
                <Area dataKey="progress" type="natural" fill="var(--color-progress)" fillOpacity={0.25} stroke="var(--color-progress)" strokeWidth={2.2} />
                <Area dataKey="completed" type="natural" fill="var(--color-completed)" fillOpacity={0.16} stroke="var(--color-completed)" strokeWidth={1.6} />
              </AreaChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex flex-wrap items-center justify-between gap-3 border-t border-zinc-200/70 bg-zinc-50/80 dark:border-zinc-800 dark:bg-zinc-900/40">
            <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
              <TrendingUp className="h-4 w-4 text-emerald-500" />
              Trending up by {completionRate >= 50 ? "strong" : "early"} momentum this cycle
            </div>
            <Link href="#progress" className="inline-flex items-center gap-1 text-sm font-semibold text-purple-600 transition hover:text-purple-500 dark:text-purple-300">
              View progress <ArrowRight className="h-4 w-4" />
            </Link>
          </CardFooter>
        </Card>

        <div className="grid gap-6">
          <div id="summary" className="grid grid-cols-2 gap-4">
            {[
              { label: "Projects", value: counts.totalProjects, icon: LayoutGrid },
              { label: "Tasks", value: counts.totalTasks, icon: ListTodo },
              { label: "Completed", value: counts.completedTasks, icon: CheckCircle2 },
              { label: "Overdue", value: counts.overdueTasks, icon: CalendarDays },
            ].map((item) => (
              <Card key={item.label} className="border border-zinc-200/80 bg-white/90 shadow-sm dark:border-zinc-800 dark:bg-zinc-950/90">
                <CardContent className="flex items-center gap-3 p-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-linear-to-br from-purple-500 to-fuchsia-500 text-white shadow-lg shadow-purple-500/20">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500 dark:text-zinc-400">{item.label}</p>
                    <p className="text-2xl font-black text-zinc-950 dark:text-zinc-50">{item.value}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card id="priority" className="border border-zinc-200/80 bg-white/90 shadow-sm dark:border-zinc-800 dark:bg-zinc-950/90">
            <CardHeader>
              <CardTitle className="text-zinc-950 dark:text-zinc-50">Priority distribution</CardTitle>
              <CardDescription className="text-zinc-600 dark:text-zinc-400">A quick look at how work is spread across priority levels.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 px-4 pb-5 sm:px-6">
              {[
                { label: "High", value: stats?.priorityDistribution.high ?? 0, accent: "from-rose-500 to-red-500" },
                { label: "Medium", value: stats?.priorityDistribution.medium ?? 0, accent: "from-amber-500 to-orange-500" },
                { label: "Low", value: stats?.priorityDistribution.low ?? 0, accent: "from-emerald-500 to-teal-500" },
              ].map((item) => {
                const total = Math.max(1, counts.totalTasks);
                const width = Math.max(6, Math.round((item.value / total) * 100));

                return (
                  <div key={item.label} className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-zinc-800 dark:text-zinc-200">{item.label}</span>
                      <span className="text-zinc-500 dark:text-zinc-400">{item.value}</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-zinc-200/70 dark:bg-zinc-800">
                      <div className={`h-full rounded-full bg-linear-to-r ${item.accent}`} style={{ width: `${width}%` }} />
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>

      <div id="progress" className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="group rounded-3xl border border-zinc-200/80 bg-white/90 p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-950/90"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-purple-500 dark:text-purple-400">Quick link</p>
            <h3 className="mt-2 text-lg font-bold text-zinc-950 dark:text-zinc-50">{link.label}</h3>
            <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">{link.description}</p>
            <div className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-purple-600 transition group-hover:gap-2 group-hover:text-purple-500 dark:text-purple-300">
              Open <ArrowRight className="h-4 w-4" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
