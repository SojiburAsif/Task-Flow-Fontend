"use client";

import type { ComponentType } from "react";
import Link from "next/link";
import { ArrowUpRight, CalendarDays, CircleDashed, FolderGit2, Users2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { ProjectRecord } from "@/services/project.service";

type TeamBoardProps = {
	projects: ProjectRecord[];
	title: string;
	description: string;
	roleLabel: string;
};

const formatDate = (value?: string | null) => {
	if (!value) return "No deadline";
	return new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

const getStatusStyles = (status?: string | null) => {
	switch ((status || "").toLowerCase()) {
		case "completed":
			return "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300";
		case "active":
			return "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-300";
		case "onhold":
			return "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300";
		default:
			return "border-zinc-200 bg-zinc-50 text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-300";
	}
};

export function TeamBoard({ projects, title, description, roleLabel }: TeamBoardProps) {
	const stats = {
		total: projects.length,
		members: projects.reduce((count, project) => count + (project.members?.length ?? 0), 0),
		active: projects.filter(project => (project.status || "").toLowerCase() === "active").length,
		completed: projects.filter(project => (project.status || "").toLowerCase() === "completed").length,
	};

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
					{stats.total} team project{stats.total === 1 ? "" : "s"}
				</div>
			</div>

			<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
				{[
					{ label: "Projects", value: stats.total, icon: FolderGit2 as ComponentType<{ className?: string }>, tone: "from-purple-500 to-fuchsia-500" },
					{ label: "Members", value: stats.members, icon: Users2 as ComponentType<{ className?: string }>, tone: "from-sky-500 to-blue-500" },
					{ label: "Active", value: stats.active, icon: CircleDashed as ComponentType<{ className?: string }>, tone: "from-emerald-500 to-teal-500" },
					{ label: "Completed", value: stats.completed, icon: CalendarDays as ComponentType<{ className?: string }>, tone: "from-amber-500 to-orange-500" },
				].map(item => (
					<Card key={item.label} className="border border-zinc-200/80 bg-white/90 shadow-sm dark:border-zinc-800 dark:bg-zinc-950/90">
						<CardContent className="flex items-center gap-3 p-4">
							<div className={`flex h-11 w-11 items-center justify-center rounded-2xl bg-linear-to-br ${item.tone} text-white shadow-lg shadow-purple-500/20`}>
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

			<Card className="mt-6 border border-zinc-200/80 bg-white/90 shadow-[0_24px_80px_rgba(91,33,182,0.10)] backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/90">
				<CardHeader className="border-b border-zinc-200/70 dark:border-zinc-800">
					<CardTitle className="flex items-center gap-2 text-xl text-zinc-950 dark:text-zinc-50">
						<Users2 className="h-5 w-5 text-purple-500" />
						Project teams
					</CardTitle>
					<CardDescription className="text-zinc-600 dark:text-zinc-400">A visual summary of the projects you lead and the people attached to them.</CardDescription>
				</CardHeader>
				<CardContent className="p-4 sm:p-6">
					{projects.length === 0 ? (
						<div className="flex min-h-[320px] flex-col items-center justify-center rounded-3xl border border-dashed border-zinc-300 bg-zinc-50/40 p-10 text-center dark:border-zinc-800 dark:bg-zinc-950/20">
							<div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-900">
								<FolderGit2 size={26} className="text-zinc-400 dark:text-zinc-500" />
							</div>
							<h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">No project teams found</h3>
							<p className="mt-2 max-w-sm text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">When you create or join projects, the team structure will appear here with member counts and quick access links.</p>
						</div>
					) : (
						<div className="grid gap-4 xl:grid-cols-2">
							{projects.map(project => (
								<article key={project.id} className="rounded-3xl border border-zinc-200/80 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950/40">
									<div className="flex flex-wrap items-start justify-between gap-3">
										<div className="space-y-2">
											<Badge className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] ${getStatusStyles(project.status)}`}>
												{project.status || "N/A"}
											</Badge>
											<h2 className="text-lg font-black tracking-tight text-zinc-950 dark:text-zinc-50 sm:text-xl">{project.name}</h2>
											<p className="max-w-2xl text-sm leading-6 text-zinc-600 dark:text-zinc-400">{project.description || "No project description provided."}</p>
										</div>
										<Link href={`/dashboard/projects/${project.id}`} className="inline-flex items-center gap-1 text-sm font-semibold text-purple-600 transition hover:text-purple-500 dark:text-purple-300">Open project <ArrowUpRight className="h-4 w-4" /></Link>
									</div>

									<div className="mt-5 grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
										<div className="space-y-3 rounded-2xl border border-zinc-100 bg-zinc-50/70 p-4 dark:border-zinc-800 dark:bg-zinc-900/40">
											<div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400"><CalendarDays className="h-4 w-4 text-purple-500" />Deadline: {formatDate(project.deadline)}</div>
											<div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400"><Users2 className="h-4 w-4 text-purple-500" />{project.members?.length ?? 0} team member{(project.members?.length ?? 0) === 1 ? "" : "s"}</div>
											<div className="text-xs font-medium uppercase tracking-[0.22em] text-zinc-500 dark:text-zinc-400">Owner: <span className="text-zinc-950 dark:text-zinc-100">{project.createdBy?.name ?? "System"}</span></div>
										</div>

										<div className="rounded-2xl border border-zinc-100 p-4 dark:border-zinc-800">
											<div className="mb-3 flex items-center justify-between">
												<p className="text-xs font-bold uppercase tracking-[0.22em] text-zinc-500 dark:text-zinc-400">Team roster</p>
												<p className="text-xs text-zinc-500 dark:text-zinc-400">{project.members?.length ?? 0} people</p>
											</div>
											{project.members && project.members.length > 0 ? (
												<div className="flex flex-wrap gap-2">
													{project.members.slice(0, 6).map(member => (
														<div key={member.id} className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-2 text-sm shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
															<div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 font-bold text-purple-700 dark:bg-purple-500/10 dark:text-purple-300">{(member.name || "U").charAt(0)}</div>
															<span className="max-w-28 truncate text-zinc-700 dark:text-zinc-300">{member.name ?? "Unnamed User"}</span>
														</div>
													))}
													{project.members.length > 6 ? <div className="inline-flex items-center rounded-full border border-dashed border-zinc-300 px-3 py-2 text-sm text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">+{project.members.length - 6} more</div> : null}
												</div>
											) : (
												<div className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50/60 p-4 text-sm text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950/20 dark:text-zinc-400">No members assigned yet.</div>
											)}
										</div>
									</div>
									<div className="mt-4 flex items-center justify-end">
										<Button asChild variant="outline" className="rounded-xl gap-2">
											<Link href={`/dashboard/projects/${project.id}`}>View project <ArrowUpRight className="h-4 w-4" /></Link>
										</Button>
									</div>
								</article>
							))}
						</div>
					)}
				</CardContent>
			</Card>
		</section>
	);
}