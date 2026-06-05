"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, CalendarDays, CheckCircle2, LayoutGrid, ListTodo, TrendingUp, BarChart3, Activity } from "lucide-react";
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
    <section className="relative w-full space-y-8">
      
      {/* =========================================
          HEADER SECTION (Sharp Design)
      ============================================= */}
      <div className="relative overflow-hidden border border-zinc-200 bg-white/90 p-6 shadow-none backdrop-blur rounded-none dark:border-zinc-800 dark:bg-zinc-950/90 sm:p-8">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-zinc-500/5 dark:from-purple-500/10 dark:to-transparent" />
        
        <div className="relative flex flex-col gap-4 border-b border-zinc-200 pb-6 dark:border-zinc-800 md:flex-row md:items-end md:justify-between">
          <div className="space-y-3">
            <span className="inline-flex border border-purple-500/30 bg-purple-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.28em] text-purple-700 rounded-none dark:border-purple-500/40 dark:bg-purple-500/10 dark:text-purple-400">
              {roleLabel}
            </span>
            <h1 className="text-3xl font-black tracking-tight text-zinc-950 dark:text-white sm:text-4xl">
              {title}
            </h1>
            <p className="max-w-2xl text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              {description}
            </p>
          </div>

          <div className="inline-flex items-center gap-3 border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-xs font-bold text-zinc-700 rounded-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 shrink-0">
            <Activity className="h-4 w-4 text-purple-500" />
            {completionRate}% Workspace Completion
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
        
        {/* =========================================
            CHART CARD (Project Progress)
        ============================================= */}
        <Card className="border border-zinc-200 bg-white shadow-none rounded-none dark:border-zinc-800 dark:bg-zinc-950">
          <CardHeader className="border-b border-zinc-200 bg-zinc-50/50 rounded-none dark:border-zinc-800 dark:bg-zinc-900/30">
            <CardTitle className="flex items-center gap-2 text-lg font-bold text-zinc-950 dark:text-white">
              <LayoutGrid className="h-5 w-5 text-purple-500" />
              Project Progress Curve
            </CardTitle>
            <CardDescription className="text-zinc-600 dark:text-zinc-400 mt-1 text-xs">
              Your latest project completion snapshot across active work.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-4 pb-0 pt-6 sm:px-6">
            <ChartContainer config={chartConfig} className="min-h-80 w-full">
              <AreaChart data={chartData} margin={{ left: -12, right: 12, top: 8, bottom: 0 }}>
                <CartesianGrid vertical={false} strokeOpacity={0.2} strokeDasharray="3 3" />
                <XAxis dataKey="project" tickLine={false} axisLine={false} tickMargin={10} fontSize={12} fill="var(--color-foreground)" />
                <YAxis tickLine={false} axisLine={false} tickMargin={10} domain={[0, 100]} tickCount={6} fontSize={12} fill="var(--color-foreground)" />
                <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
                <Area dataKey="progress" type="step" fill="var(--color-progress)" fillOpacity={0.25} stroke="var(--color-progress)" strokeWidth={2.2} />
                <Area dataKey="completed" type="step" fill="var(--color-completed)" fillOpacity={0.16} stroke="var(--color-completed)" strokeWidth={1.6} />
              </AreaChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex flex-wrap items-center justify-between gap-3 border-t border-zinc-200 bg-zinc-50/80 p-4 dark:border-zinc-800 dark:bg-zinc-900/40">
            <div className="flex items-center gap-2 text-xs font-semibold text-zinc-600 dark:text-zinc-400">
              <TrendingUp className="h-4 w-4 text-emerald-500" />
              Trending up by {completionRate >= 50 ? "strong" : "early"} momentum this cycle
            </div>
            <Link href="#progress" className="inline-flex items-center gap-1 text-xs font-bold text-purple-600 transition hover:text-purple-500 dark:text-purple-400">
              View Analytics <ArrowRight className="h-4 w-4" />
            </Link>
          </CardFooter>
        </Card>

        {/* =========================================
            RIGHT COLUMN: KPI STATS & PRIORITY
        ============================================= */}
        <div className="grid gap-6">
          <div id="summary" className="grid grid-cols-2 gap-4">
            {[
              { label: "Projects", value: counts.totalProjects, icon: LayoutGrid, tone: "text-purple-600 bg-purple-50 dark:bg-purple-900/20" },
              { label: "Tasks", value: counts.totalTasks, icon: ListTodo, tone: "text-blue-600 bg-blue-50 dark:bg-blue-900/20" },
              { label: "Completed", value: counts.completedTasks, icon: CheckCircle2, tone: "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20" },
              { label: "Overdue", value: counts.overdueTasks, icon: CalendarDays, tone: "text-rose-600 bg-rose-50 dark:bg-rose-900/20" },
            ].map((item) => (
              <Card key={item.label} className="border border-zinc-200 bg-white shadow-none rounded-none dark:border-zinc-800 dark:bg-zinc-950 transition-all hover:border-purple-300 dark:hover:border-purple-900/50">
                <CardContent className="p-5">
                  <div className={`mb-4 flex h-12 w-12 items-center justify-center border border-zinc-100 rounded-none dark:border-zinc-800 ${item.tone}`}>
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">{item.label}</p>
                    <p className="mt-1 text-3xl font-black text-zinc-950 dark:text-white">{item.value}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card id="priority" className="border border-zinc-200 bg-white shadow-none rounded-none dark:border-zinc-800 dark:bg-zinc-950">
            <CardHeader className="border-b border-zinc-200 bg-zinc-50/50 p-5 rounded-none dark:border-zinc-800 dark:bg-zinc-900/30">
              <CardTitle className="flex items-center gap-2 text-lg font-bold text-zinc-950 dark:text-white">
                <BarChart3 className="h-5 w-5 text-purple-500" />
                Priority Distribution
              </CardTitle>
              <CardDescription className="text-zinc-600 dark:text-zinc-400 mt-1 text-xs">
                A quick look at how work is spread across priority levels.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-5 p-6">
              {[
                { label: "High", value: stats?.priorityDistribution?.high ?? 0, accent: "bg-rose-500" },
                { label: "Medium", value: stats?.priorityDistribution?.medium ?? 0, accent: "bg-amber-500" },
                { label: "Low", value: stats?.priorityDistribution?.low ?? 0, accent: "bg-emerald-500" },
              ].map((item) => {
                const total = Math.max(1, counts.totalTasks);
                const width = Math.max(6, Math.round((item.value / total) * 100));

                return (
                  <div key={item.label} className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="uppercase tracking-wider text-zinc-700 dark:text-zinc-300">{item.label}</span>
                      <span className="text-zinc-500 dark:text-zinc-400">{item.value} Tasks</span>
                    </div>
                    {/* Sharp Progress Bar */}
                    <div className="h-2 w-full overflow-hidden bg-zinc-100 rounded-none dark:bg-zinc-800">
                      <div className={`h-full rounded-none ${item.accent}`} style={{ width: `${width}%` }} />
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* =========================================
          QUICK LINKS SECTION (Sharp Grid)
      ============================================= */}
      <div id="links" className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="group flex flex-col justify-between border border-zinc-200 bg-white p-5 shadow-none transition-all hover:-translate-y-1 hover:border-purple-500 hover:shadow-xl rounded-none dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-purple-500/50"
          >
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-purple-500 dark:text-purple-400 mb-2">
                Quick Link
              </p>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                {link.label}
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
                {link.description}
              </p>
            </div>
            <div className="mt-5 flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-zinc-400 transition-colors group-hover:text-purple-600 dark:text-zinc-500 dark:group-hover:text-purple-400">
              Access Page <ArrowUpRight className="h-3 w-3" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}