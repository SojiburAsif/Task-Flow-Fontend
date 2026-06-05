import React from "react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { CalendarDays, Users2, ArrowLeft } from "lucide-react";

import { Role } from "@/app/constants/role";
import { getCurrentUser } from "@/lib/currentUser";
import { getProjectById } from "@/services/project.service";
import { getUsers } from "@/services/user.service";
import { updateProjectAction } from "@/services/project.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type Props = {
	params: Promise<{ id: string }>;
};

export default async function ProjectEditPage({ params }: Props) {
	const { id } = await params;
	const currentUser = await getCurrentUser();

	if (!currentUser) {
		redirect("/login");
	}

	const allowedRole = currentUser.role === Role.ADMIN || currentUser.role === Role.ProjectManager;

	if (!allowedRole) {
		redirect(`/dashboard/projects?view=${id}`);
	}

	const [project, users] = await Promise.all([getProjectById(id), getUsers()]);

	if (!project) {
		notFound();
	}

	const teamMembers = (users ?? []).filter(user => {
		const normalizedRole = user.role.replace(/[_\s-]+/g, "").toLowerCase();
		return normalizedRole === "teammember";
	});

	return (
		<div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
			<div className="mb-6 flex items-center justify-between gap-4">
				<Link href={`/dashboard/projects?view=${project.id}`} className="inline-flex items-center gap-2 text-sm font-medium text-zinc-500 transition hover:text-purple-600">
					<ArrowLeft size={16} />
					Back to project
				</Link>
				<p className="text-sm text-zinc-500">{currentUser?.role ? `${currentUser.role} editing mode` : "Editing mode"}</p>
			</div>

			<form action={updateProjectAction} className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
				<input type="hidden" name="id" value={project.id} />

				<Card className="border-zinc-200/70 shadow-sm dark:border-zinc-800">
					<CardHeader>
						<CardTitle className="text-2xl font-black tracking-tight text-zinc-950 dark:text-zinc-50">Edit project</CardTitle>
						<CardDescription>Update project details and member assignment in one place.</CardDescription>
					</CardHeader>
					<CardContent className="space-y-5">
						<div className="space-y-2">
							<Label htmlFor="name">Project Name</Label>
							<Input id="name" name="name" defaultValue={project.name} required />
						</div>

						<div className="space-y-2">
							<Label htmlFor="description">Description</Label>
							<Textarea id="description" name="description" defaultValue={project.description} rows={8} required />
						</div>

						<div className="grid gap-4 sm:grid-cols-2">
							<div className="space-y-2">
								<Label htmlFor="deadline">Deadline</Label>
								<div className="relative">
									<Input id="deadline" name="deadline" type="date" defaultValue={project.deadline ? new Date(project.deadline).toISOString().slice(0, 10) : ""} />
									<CalendarDays className="pointer-events-none absolute right-3 top-2.5 text-zinc-400" size={18} />
								</div>
							</div>

							<div className="space-y-2">
								<Label htmlFor="status">Status</Label>
								<select id="status" name="status" defaultValue={project.status ?? "Active"} className="flex h-10 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm dark:border-zinc-800 dark:bg-zinc-950">
									<option value="Active">Active</option>
									<option value="Completed">Completed</option>
									<option value="OnHold">On Hold</option>
								</select>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card className="border-zinc-200/70 shadow-sm dark:border-zinc-800">
					<CardHeader>
						<CardTitle className="flex items-center gap-2 text-lg"><Users2 size={18} className="text-purple-500" />Assign members</CardTitle>
						<CardDescription>Team members who should be attached to this project.</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="max-h-104 space-y-3 overflow-y-auto pr-2">
							{teamMembers.length > 0 ? teamMembers.map(user => {
								const isChecked = project.members?.some(member => member.id === user.id) ?? false;

								return (
									<label key={user.id} className="flex cursor-pointer items-center gap-3 rounded-2xl border border-zinc-100 p-3 transition hover:border-purple-200 hover:bg-purple-50/50 dark:border-zinc-800 dark:hover:border-purple-500/40 dark:hover:bg-purple-500/5">
										<input type="checkbox" name={`member-${user.id}`} defaultChecked={isChecked} className="h-4 w-4 rounded border-zinc-300 text-purple-600 focus:ring-purple-500" />
										<div className="min-w-0 flex-1">
											<p className="truncate text-sm font-semibold text-zinc-950 dark:text-zinc-50">{user.name || "Unnamed User"}</p>
											<p className="truncate text-xs uppercase tracking-[0.2em] text-zinc-500">{user.role}</p>
										</div>
									</label>
								);
							}) : (
								<div className="rounded-2xl border border-dashed border-zinc-200 p-6 text-sm text-zinc-500 dark:border-zinc-800">No team members available.</div>
							)}
						</div>

						<div className="mt-6">
							<Button type="submit" className="h-11 w-full rounded-xl bg-purple-600 text-white hover:bg-purple-700">Save changes</Button>
						</div>
					</CardContent>
				</Card>
			</form>
		</div>
	);
}