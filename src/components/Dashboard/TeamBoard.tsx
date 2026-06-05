"use client";

import type { ComponentType } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
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
	canEdit?: boolean;
	initialProjectId?: string | null;
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

export function TeamBoard({ projects, title, description, roleLabel, canEdit = false, initialProjectId = null }: TeamBoardProps) {
	const stats = {
		total: projects.length,
		members: projects.reduce((count, project) => count + (project.members?.length ?? 0), 0),
		active: projects.filter(project => (project.status || "").toLowerCase() === "active").length,
		completed: projects.filter(project => (project.status || "").toLowerCase() === "completed").length,
	};

	const [open, setOpen] = useState(Boolean(initialProjectId));
	const [selectedProjectId, setSelectedProjectId] = useState<string | null>(initialProjectId);
	const [editOpen, setEditOpen] = useState(false);
	const [isSaving, setIsSaving] = useState(false);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const router = useRouter();

	const selectedProject = selectedProjectId ? projects.find(project => project.id === selectedProjectId) ?? null : null;

	const openProject = (projectId: string) => {
		setSelectedProjectId(projectId);
		setOpen(true);
	};

	const closeProject = () => {
		setOpen(false);
	};

	const openEdit = () => {
		setErrorMessage(null);
		setEditOpen(true);
	};

	const closeEdit = () => {
		setEditOpen(false);
		setErrorMessage(null);
	};

	const submitEdit = async (formData: FormData) => {
		if (!selectedProject) return;

		const name = (formData.get("name")?.toString() ?? "").trim();
		const description = (formData.get("description")?.toString() ?? "").trim();
		const deadline = (formData.get("deadline")?.toString() ?? "").trim();
		const status = (formData.get("status")?.toString() ?? "").trim();

		if (!name || !description || !deadline) {
			setErrorMessage("Project name, description and deadline are required.");
			return;
		}

		setIsSaving(true);
		setErrorMessage(null);

		try {
			const response = await fetch(`/api/projects/${selectedProject.id}`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					name,
					description,
					deadline: new Date(deadline).toISOString(),
					status: status || undefined,
				}),
			});

			if (!response.ok) {
				const payload = (await response.json().catch(() => null)) as { error?: string } | null;
				throw new Error(payload?.error || "Failed to update project");
			}

			setEditOpen(false);
			setOpen(false);
			router.refresh();
		} catch (error) {
			setErrorMessage(error instanceof Error ? error.message : "Failed to update project");
		} finally {
			setIsSaving(false);
		}
	};

	return (
		<>
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
							<div style={{ minHeight: "320px" }} className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-zinc-300 bg-zinc-50/40 p-10 text-center dark:border-zinc-800 dark:bg-zinc-950/20">
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
											<button type="button" onClick={() => openProject(project.id)} className="inline-flex items-center gap-1 text-sm font-semibold text-purple-600 transition hover:text-purple-500 dark:text-purple-300">Open project <ArrowUpRight className="h-4 w-4" /></button>
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
											<Button type="button" variant="outline" className="rounded-xl gap-2" onClick={() => openProject(project.id)}>
												View project <ArrowUpRight className="h-4 w-4" />
											</Button>
										</div>
									</article>
								))}
							</div>
						)}
					</CardContent>
				</Card>
			</section>

			{open && selectedProject ? (
				<div className="modal modal-open">
					<div className="modal-box max-w-4xl rounded-4xl border border-zinc-200 bg-white p-0 shadow-2xl dark:border-zinc-800 dark:bg-zinc-950">
						<div className="border-b border-zinc-200/70 px-6 py-5 dark:border-zinc-800">
							<div className="flex items-center justify-between gap-4">
								<div>
									<p className="text-xs font-semibold uppercase tracking-[0.24em] text-purple-500">Project preview</p>
									<h3 className="mt-1 text-2xl font-black tracking-tight text-zinc-950 dark:text-zinc-50">{selectedProject.name}</h3>
								</div>
								<button type="button" onClick={closeProject} className="btn btn-ghost btn-sm rounded-full">Close</button>
							</div>
						</div>

						<div className="grid gap-6 p-6 lg:grid-cols-[1.25fr_0.75fr]">
							<div className="space-y-5">
								<div className="flex flex-wrap items-center gap-3">
									<Badge className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] ${getStatusStyles(selectedProject.status)}`}>{selectedProject.status || "N/A"}</Badge>
									<div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
										<CalendarDays className="h-4 w-4 text-purple-500" />
										{formatDate(selectedProject.deadline)}
									</div>
								</div>
								<p className="text-sm leading-7 text-zinc-600 dark:text-zinc-400">{selectedProject.description || "No project description provided."}</p>
								<div className="grid gap-4 sm:grid-cols-2">
									<div className="rounded-3xl border border-zinc-200 bg-zinc-50/70 p-4 dark:border-zinc-800 dark:bg-zinc-900/40">
										<p className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500 dark:text-zinc-400">Owner</p>
										<p className="mt-2 text-lg font-bold text-zinc-950 dark:text-zinc-50">{selectedProject.createdBy?.name ?? "System"}</p>
									</div>
									<div className="rounded-3xl border border-zinc-200 bg-zinc-50/70 p-4 dark:border-zinc-800 dark:bg-zinc-900/40">
										<p className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500 dark:text-zinc-400">Members</p>
										<p className="mt-2 text-lg font-bold text-zinc-950 dark:text-zinc-50">{selectedProject.members?.length ?? 0}</p>
									</div>
								</div>
							</div>

							<div className="space-y-4 rounded-3xl border border-zinc-200 bg-zinc-50/70 p-4 dark:border-zinc-800 dark:bg-zinc-900/40">
								<div>
									<p className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500 dark:text-zinc-400">Team roster</p>
									<p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">People assigned to this project.</p>
								</div>
								<div className="max-h-80 space-y-2 overflow-auto pr-1">
									{selectedProject.members && selectedProject.members.length > 0 ? selectedProject.members.map(member => (
										<div key={member.id} className="flex items-center gap-3 rounded-2xl border border-white bg-white px-3 py-2 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
											<div className="flex h-9 w-9 items-center justify-center rounded-full bg-purple-100 font-bold text-purple-700 dark:bg-purple-500/10 dark:text-purple-300">{(member.name || "U").charAt(0)}</div>
											<div className="min-w-0">
												<p className="truncate text-sm font-semibold text-zinc-950 dark:text-zinc-50">{member.name ?? "Unnamed User"}</p>
												<p className="truncate text-xs text-zinc-500">{member.email ?? member.id}</p>
											</div>
										</div>
									)) : (
										<div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-4 text-sm text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950/40 dark:text-zinc-400">No members assigned yet.</div>
									)}
								</div>
								<div className="flex items-center gap-3 pt-2">
									{canEdit ? (
										<Button type="button" className="rounded-xl bg-purple-600 text-white hover:bg-purple-700" onClick={openEdit}>
											Edit project
										</Button>
									) : null}
									<Button type="button" variant="outline" className="rounded-xl" onClick={closeProject}>Close</Button>
								</div>
							</div>
						</div>
					</div>
					<label className="modal-backdrop" onClick={closeProject}>Close</label>
				</div>
			) : null}

			{editOpen && selectedProject ? (
				<div className="modal modal-open">
					<div className="modal-box max-w-3xl rounded-4xl border border-zinc-200 bg-white p-0 shadow-2xl dark:border-zinc-800 dark:bg-zinc-950">
						<div className="border-b border-zinc-200/70 px-6 py-5 dark:border-zinc-800">
							<div className="flex items-center justify-between gap-4">
								<div>
									<p className="text-xs font-semibold uppercase tracking-[0.24em] text-purple-500">Edit project</p>
									<h3 className="mt-1 text-2xl font-black tracking-tight text-zinc-950 dark:text-zinc-50">{selectedProject.name}</h3>
								</div>
								<button type="button" onClick={closeEdit} className="btn btn-ghost btn-sm rounded-full">Close</button>
							</div>
						</div>

						<form action={submitEdit} className="space-y-5 p-6">
							<div className="space-y-2">
								<label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300" htmlFor="edit-name">Project name</label>
								<input id="edit-name" name="name" defaultValue={selectedProject.name} className="input input-bordered w-full" required />
							</div>

							<div className="space-y-2">
								<label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300" htmlFor="edit-description">Description</label>
								<textarea id="edit-description" name="description" defaultValue={selectedProject.description || ""} className="textarea textarea-bordered w-full" rows={5} required />
							</div>

							<div className="grid gap-4 sm:grid-cols-2">
								<div className="space-y-2">
									<label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300" htmlFor="edit-deadline">Deadline</label>
									<input id="edit-deadline" name="deadline" type="date" defaultValue={selectedProject.deadline ? new Date(selectedProject.deadline).toISOString().slice(0, 10) : ""} className="input input-bordered w-full" required />
								</div>

								<div className="space-y-2">
									<label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300" htmlFor="edit-status">Status</label>
									<select id="edit-status" name="status" defaultValue={selectedProject.status || "Active"} className="select select-bordered w-full">
										<option value="Active">Active</option>
										<option value="Completed">Completed</option>
										<option value="OnHold">On Hold</option>
									</select>
								</div>
							</div>

							{errorMessage ? <p className="text-sm font-medium text-red-500">{errorMessage}</p> : null}

							<div className="flex items-center justify-end gap-3">
								<Button type="button" variant="outline" className="rounded-xl" onClick={closeEdit} disabled={isSaving}>Cancel</Button>
								<Button type="submit" className="rounded-xl bg-purple-600 text-white hover:bg-purple-700" disabled={isSaving}>
									{isSaving ? "Saving..." : "Save changes"}
								</Button>
							</div>
						</form>
					</div>
					<label className="modal-backdrop" onClick={closeEdit}>Close</label>
				</div>
			) : null}
		</>
	);
}