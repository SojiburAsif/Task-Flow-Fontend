"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import type { DashboardStats } from "@/services/dashboard.service";
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, XAxis, YAxis } from "recharts";

type TeamMemberDashboardChartsProps = {
	stats: DashboardStats | null;
};

const priorityChartConfig = {
	high: {
		label: "High",
		color: "hsl(var(--chart-1))",
	},
	medium: {
		label: "Medium",
		color: "hsl(var(--chart-2))",
	},
	low: {
		label: "Low",
		color: "hsl(var(--chart-3))",
	},
} satisfies ChartConfig;

const statusChartConfig = {
	todo: {
		label: "Todo",
		color: "hsl(var(--chart-4))",
	},
	inProgress: {
		label: "In progress",
		color: "hsl(var(--chart-1))",
	},
	completed: {
		label: "Completed",
		color: "hsl(var(--chart-2))",
	},
	overdue: {
		label: "Overdue",
		color: "hsl(var(--chart-5))",
	},
} satisfies ChartConfig;

const buildPriorityData = (stats: DashboardStats | null) => [
	{ label: "High", value: stats?.priorityDistribution.high ?? 0, key: "high" },
	{ label: "Medium", value: stats?.priorityDistribution.medium ?? 0, key: "medium" },
	{ label: "Low", value: stats?.priorityDistribution.low ?? 0, key: "low" },
];

const buildStatusData = (stats: DashboardStats | null) => {
	const counts = stats?.counts ?? {
		totalProjects: 0,
		totalTasks: 0,
		completedTasks: 0,
		pendingTasks: 0,
		overdueTasks: 0,
	};

	return [
		{ label: "Todo", value: counts.pendingTasks, key: "todo" },
		{
			label: "In progress",
			value: Math.max(0, counts.totalTasks - counts.completedTasks - counts.pendingTasks - counts.overdueTasks),
			key: "inProgress",
		},
		{ label: "Completed", value: counts.completedTasks, key: "completed" },
		{ label: "Overdue", value: counts.overdueTasks, key: "overdue" },
	];
};

const buildProjectChartData = (stats: DashboardStats | null) =>
	(stats?.projectProgress ?? []).slice(0, 6).map((project, index) => ({
		project: project.name.length > 12 ? `${project.name.slice(0, 12)}…` : project.name,
		progress: project.progressPercentage,
		fill: `hsl(var(--chart-${Math.min(index + 1, 5)}))`,
	}));

export function TeamMemberDashboardCharts({ stats }: TeamMemberDashboardChartsProps) {
	const priorityData = buildPriorityData(stats);
	const statusData = buildStatusData(stats);
	const projectData = buildProjectChartData(stats);

	const chartFallback = [
		{ project: "No data", progress: 0, fill: "hsl(var(--chart-1))" },
	];

	return (
		<>
			<div className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
				<Card
					id="priority-overview"
					className="overflow-hidden border border-zinc-200/80 bg-white/85 shadow-[0_24px_80px_rgba(91,33,182,0.10)] backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/90 dark:shadow-black/30"
				>
					<CardHeader className="border-b border-zinc-200/70 bg-linear-to-r from-violet-500/8 via-transparent to-fuchsia-500/8 dark:border-zinc-800">
						<CardTitle className="text-xl text-zinc-950 dark:text-zinc-50">Priority distribution</CardTitle>
						<CardDescription className="text-zinc-600 dark:text-zinc-400">
							A clean snapshot of where the urgent work is concentrated.
						</CardDescription>
					</CardHeader>
					<CardContent className="px-4 pb-5 pt-4 sm:px-6">
						<ChartContainer config={priorityChartConfig} className="min-h-80 w-full">
							<PieChart>
								<ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
								<Pie
									data={priorityData}
									dataKey="value"
									nameKey="label"
									innerRadius={72}
									outerRadius={118}
									paddingAngle={4}
									strokeWidth={2}
								>
									{priorityData.map((entry) => (
										<Cell key={entry.key} fill={`var(--color-${entry.key})`} />
									))}
								</Pie>
							</PieChart>
						</ChartContainer>
					</CardContent>
				</Card>

				<Card
					id="status-mix"
					className="overflow-hidden border border-zinc-200/80 bg-white/85 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/90 dark:shadow-black/30"
				>
					<CardHeader className="border-b border-zinc-200/70 bg-linear-to-r from-sky-500/8 via-transparent to-emerald-500/8 dark:border-zinc-800">
						<CardTitle className="text-xl text-zinc-950 dark:text-zinc-50">Task status mix</CardTitle>
						<CardDescription className="text-zinc-600 dark:text-zinc-400">
							See how your workload is split across todo, active, done, and overdue work.
						</CardDescription>
					</CardHeader>
					<CardContent className="px-4 pb-5 pt-4 sm:px-6">
						<ChartContainer config={statusChartConfig} className="min-h-80 w-full">
							<BarChart data={statusData} layout="vertical" margin={{ left: 12, right: 18, top: 8, bottom: 8 }} barSize={22}>
								<CartesianGrid horizontal={false} strokeOpacity={0.18} />
								<XAxis type="number" hide />
								<YAxis type="category" dataKey="label" tickLine={false} axisLine={false} width={92} />
								<ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
								<Bar dataKey="value" radius={[0, 14, 14, 0]}>
									{statusData.map((entry) => (
										<Cell key={entry.key} fill={`var(--color-${entry.key})`} />
									))}
								</Bar>
							</BarChart>
						</ChartContainer>
					</CardContent>
				</Card>
			</div>

			<Card className="mt-6 overflow-hidden border border-zinc-200/80 bg-white/85 shadow-[0_20px_60px_rgba(14,165,233,0.08)] backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/90 dark:shadow-black/30">
				<CardHeader className="border-b border-zinc-200/70 bg-linear-to-r from-cyan-500/8 via-transparent to-violet-500/8 dark:border-zinc-800">
					<CardTitle className="text-xl text-zinc-950 dark:text-zinc-50">Project progress pulse</CardTitle>
					<CardDescription className="text-zinc-600 dark:text-zinc-400">
						A quick view of the latest project delivery momentum across active work.
					</CardDescription>
				</CardHeader>
				<CardContent className="px-4 pb-5 pt-4 sm:px-6">
					<ChartContainer
						config={{
							progress: { label: "Progress", color: "hsl(var(--chart-1))" },
						}}
						className="min-h-80 w-full"
					>
						<BarChart data={projectData.length > 0 ? projectData : chartFallback} margin={{ left: -8, right: 10, top: 8, bottom: 0 }}>
							<CartesianGrid vertical={false} strokeOpacity={0.18} />
							<XAxis dataKey="project" tickLine={false} axisLine={false} tickMargin={10} />
							<YAxis tickLine={false} axisLine={false} tickMargin={10} domain={[0, 100]} tickCount={6} />
							<ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
							<Bar dataKey="progress" radius={[14, 14, 0, 0]} fill="var(--color-progress)" />
						</BarChart>
					</ChartContainer>
				</CardContent>
			</Card>
		</>
	);
}
