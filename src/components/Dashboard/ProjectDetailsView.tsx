"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Bell, CalendarDays, CheckCheck, FolderGit2, Users2 } from "lucide-react";

import ProjectEditModal from "@/components/Dashboard/ProjectEditModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { ProjectRecord } from "@/services/project.service";
import type { UserProfile } from "@/services/user.service";
import type { NotificationRecord } from "@/types/notification";

type ProjectDetailsViewProps = {
	project: ProjectRecord;
	teamMembers: UserProfile[];
	relatedNotifications: NotificationRecord[];
	canEdit: boolean;
	returnTo: string;
};

const formatDate = (value?: string | null) => {
	if (!value) return "No deadline";
	return new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

const formatRelativeTime = (value: string) => {
	const createdAt = new Date(value).getTime();
	const diff = Date.now() - createdAt;
	const minutes = Math.max(1, Math.floor(diff / 60000));
	if (minutes < 60) return `${minutes}m ago`;
	const hours = Math.floor(minutes / 60);
	if (hours < 24) return `${hours}h ago`;
	return `${Math.floor(hours / 24)}d ago`;
};

const getStatusStyles = (status?: string | null) => {
	switch ((status || "").toLowerCase()) {
		case "completed":
			return "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-500/10 dark:text-emerald-400";
		case "active":
			return "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900/50 dark:bg-blue-500/10 dark:text-blue-400";
		case "onhold":
			return "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/50 dark:bg-amber-500/10 dark:text-amber-400";
		default:
			return "border-zinc-200 bg-zinc-50 text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-300";
	}
};

export default function ProjectDetailsView({ project, teamMembers, relatedNotifications, canEdit, returnTo }: ProjectDetailsViewProps) {
	const [editOpen, setEditOpen] = useState(false);
	const memberCount = useMemo(() => project.members?.length ?? 0, [project.members]);

	return (
		<div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
			<div className="mb-8 flex flex-col gap-4 border-b border-zinc-200 pb-6 dark:border-zinc-800 md:flex-row md:items-end md:justify-between">
				<div className="space-y-3">
					<Link href={returnTo} className="inline-flex items-center gap-2 text-sm font-medium text-zinc-500 transition hover:text-purple-600 dark:text-zinc-400 dark:hover:text-purple-300">
						<ArrowLeft size={16} />
						Back
					</Link>
					<div className="flex flex-wrap items-center gap-3">
						<h1 className="text-3xl font-black tracking-tight text-zinc-950 dark:text-zinc-50">{project.name}</h1>
						<Badge className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] ${getStatusStyles(project.status)}`}>
							{project.status || "Active"}
						</Badge>
					</div>
					<p className="max-w-3xl text-base leading-7 text-zinc-600 dark:text-zinc-400">{project.description || "No project description available."}</p>
				</div>
				<div className="flex flex-wrap gap-3">
					{canEdit ? (
						<Button type="button" onClick={() => setEditOpen(true)} className="gap-2 rounded-xl bg-purple-600 text-white hover:bg-purple-700">
							Edit project
							<ArrowUpRight size={16} />
						</Button>
					) : null}
				</div>
			</div>

			<div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
				<Card className="border-zinc-200/70 shadow-sm dark:border-zinc-800">
					<CardHeader className="border-b border-zinc-100 dark:border-zinc-800">
						<CardTitle className="flex items-center gap-2 text-xl text-zinc-950 dark:text-zinc-50">
							<FolderGit2 className="h-5 w-5 text-purple-500" />
							Project overview
						</CardTitle>
						<CardDescription className="text-zinc-600 dark:text-zinc-400">Project details, ownership, and member assignment.</CardDescription>
					</CardHeader>
					<CardContent className="grid gap-4 p-4 sm:grid-cols-2">
						<div className="rounded-2xl border border-zinc-100 bg-zinc-50/70 p-4 dark:border-zinc-800 dark:bg-zinc-900/30">
							<p className="text-xs font-bold uppercase tracking-[0.22em] text-zinc-500 dark:text-zinc-400">Project ID</p>
							<p className="mt-2 text-sm font-semibold text-zinc-900 dark:text-zinc-100">{project.id}</p>
						</div>
						<div className="rounded-2xl border border-zinc-100 bg-zinc-50/70 p-4 dark:border-zinc-800 dark:bg-zinc-900/30">
							<p className="text-xs font-bold uppercase tracking-[0.22em] text-zinc-500 dark:text-zinc-400">Deadline</p>
							<p className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
								<CalendarDays className="h-4 w-4 text-purple-500" />
								{formatDate(project.deadline)}
							</p>
						</div>
						<div className="rounded-2xl border border-zinc-100 bg-zinc-50/70 p-4 dark:border-zinc-800 dark:bg-zinc-900/30">
							<p className="text-xs font-bold uppercase tracking-[0.22em] text-zinc-500 dark:text-zinc-400">Members</p>
							<p className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
								<Users2 className="h-4 w-4 text-purple-500" />
								{memberCount}
							</p>
						</div>
						<div className="rounded-2xl border border-zinc-100 bg-zinc-50/70 p-4 dark:border-zinc-800 dark:bg-zinc-900/30">
							<p className="text-xs font-bold uppercase tracking-[0.22em] text-zinc-500 dark:text-zinc-400">Created by</p>
							<p className="mt-2 text-sm font-semibold text-zinc-900 dark:text-zinc-100">{project.createdBy?.name || project.createdBy?.email || "Unknown"}</p>
						</div>
					</CardContent>
				</Card>

				<Card className="border-zinc-200/70 shadow-sm dark:border-zinc-800">
					<CardHeader className="border-b border-zinc-100 dark:border-zinc-800">
						<CardTitle className="flex items-center gap-2 text-xl text-zinc-950 dark:text-zinc-50">
							<Users2 className="h-5 w-5 text-purple-500" />
							Team members
						</CardTitle>
						<CardDescription className="text-zinc-600 dark:text-zinc-400">People attached to this project.</CardDescription>
					</CardHeader>
					<CardContent className="space-y-3 p-4">
						{project.members && project.members.length > 0 ? project.members.map((member) => (
							<div key={member.id} className="flex items-center gap-3 rounded-2xl border border-zinc-100 bg-zinc-50/70 p-3 dark:border-zinc-800 dark:bg-zinc-900/30">
								<div className="flex h-10 w-10 shrink-0 items-center justify-center border border-purple-200 bg-purple-50 font-bold text-purple-700 dark:border-purple-900/50 dark:bg-purple-900/20 dark:text-purple-300">
									{(member.name || member.email || "U").charAt(0).toUpperCase()}
								</div>
								<div className="min-w-0">
									<p className="truncate text-sm font-semibold text-zinc-950 dark:text-zinc-50">{member.name || "Unnamed User"}</p>
									<p className="truncate text-xs text-zinc-500 dark:text-zinc-400">{member.email || "No email available"}</p>
								</div>
							</div>
						)) : (
							<div className="rounded-2xl border border-dashed border-zinc-200 p-6 text-sm text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">No team members assigned.</div>
						)}
					</CardContent>
				</Card>

				<Card className="border-zinc-200/70 shadow-sm dark:border-zinc-800 lg:col-span-2">
					<CardHeader className="border-b border-zinc-100 dark:border-zinc-800">
						<CardTitle className="flex items-center gap-2 text-xl text-zinc-950 dark:text-zinc-50">
							<Bell className="h-5 w-5 text-purple-500" />
							Project notifications
						</CardTitle>
						<CardDescription className="text-zinc-600 dark:text-zinc-400">Recent updates that mention this project.</CardDescription>
					</CardHeader>
					<CardContent className="space-y-3 p-4">
						{relatedNotifications.length > 0 ? relatedNotifications.map((notification) => (
							<div key={notification.id} className="flex flex-col gap-3 rounded-2xl border border-zinc-100 bg-zinc-50/70 p-4 dark:border-zinc-800 dark:bg-zinc-900/30 sm:flex-row sm:items-center sm:justify-between">
								<div className="min-w-0">
									<p className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">{notification.title}</p>
									<p className="mt-1 text-sm leading-6 text-zinc-600 dark:text-zinc-400">{notification.message}</p>
								</div>
								<div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-400">
									<CheckCheck size={12} />
									{formatRelativeTime(notification.createdAt)}
								</div>
							</div>
						)) : (
							<div className="rounded-2xl border border-dashed border-zinc-200 p-6 text-sm text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">No related notifications found for this project.</div>
						)}
					</CardContent>
				</Card>
			</div>

			<ProjectEditModal
				open={editOpen}
				project={project}
				teamMembers={teamMembers}
				returnTo={returnTo}
				onOpenChange={setEditOpen}
			/>
		</div>
	);
}
