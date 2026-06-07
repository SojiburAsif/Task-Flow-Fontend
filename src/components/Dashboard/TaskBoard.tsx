"use client";

import React, { useActionState, useEffect, useMemo, useState } from "react";
import { CircleCheckBig, CircleDashed, Clock3, LayoutList, Plus, TriangleAlert, Users2, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";

import { TaskTable } from "./TaskTable";
import { createTaskAction } from "../../services/task.actions";
import type { ProjectRecord } from "../../services/project.service";
import type { TaskRecord, TaskStatusValue } from "../../services/task.service";
import type { CurrentUser } from "@/lib/currentUser";
import { clearDashboardModalTarget, readDashboardModalTarget } from "@/components/shared/DashboardModalLink";

type TaskBoardProps = {
	tasks: TaskRecord[];
	title: string;
	description: string;
	roleLabel: string;
	returnTo: string;
	statusEditable?: boolean;
	canCreateTask?: boolean;
	hideTaskSection?: boolean;
	projects?: ProjectRecord[];
	allowAssignmentEdit?: boolean;
	allowTaskEdit?: boolean;
	currentUser?: CurrentUser | null;
};

const normalizeStatus = (status?: string | null): TaskStatusValue => {
	if (status === "InProgress" || status === "Completed") return status;
	return "Todo";
};

const formatDate = (value?: string | null) => {
	if (!value) return "No deadline";
	return new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

export function TaskBoard({
	tasks,
	title,
	description,
	roleLabel,
	returnTo,
	statusEditable = false,
	canCreateTask = false,
	hideTaskSection = false,
	projects,
	allowAssignmentEdit = false,
	allowTaskEdit = false,
	currentUser = null,
}: TaskBoardProps) {
	const [openProjectModal, setOpenProjectModal] = useState<ProjectRecord | null>(null);
	const [createTaskOpen, setCreateTaskOpen] = useState(false);
	const [createTaskProjectId, setCreateTaskProjectId] = useState<string | null>(null);
	const [initialTaskId, setInitialTaskId] = useState<string | null>(null);
	const [now, setNow] = useState(() => Date.now());

	useEffect(() => {
		const timerId = window.setInterval(() => {
			setNow(Date.now());
		}, 60000);

		return () => window.clearInterval(timerId);
	}, []);

	const stats = useMemo(() => ({
		total: tasks.length,
		todo: tasks.filter((task) => normalizeStatus(task.status) === "Todo").length,
		inProgress: tasks.filter((task) => normalizeStatus(task.status) === "InProgress").length,
		completed: tasks.filter((task) => normalizeStatus(task.status) === "Completed").length,
		overdue: tasks.filter((task) => normalizeStatus(task.status) !== "Completed" && new Date(task.dueDate).getTime() < now).length,
	}), [tasks, now]);

	const projectStats = useMemo(() => {
		if (!projects?.length) return { total: 0, members: 0 };
		return {
			total: projects.length,
			members: projects.reduce((count, project) => count + (project.members?.length ?? 0), 0),
		};
	}, [projects]);

	const openTaskCreator = (projectId?: string | null) => {
		setCreateTaskProjectId(projectId ?? null);
		setCreateTaskOpen(true);
	};

	useEffect(() => {
		const queuedTarget = readDashboardModalTarget();
		if (!queuedTarget || queuedTarget.type !== "task") return;

		const found = tasks.find((task) => task.id === queuedTarget.id);
		if (!found) return;

		clearDashboardModalTarget();
		const rafId = window.requestAnimationFrame(() => {
			setCreateTaskOpen(false);
			setCreateTaskProjectId(null);
			setInitialTaskId(found.id);
		});

		return () => window.cancelAnimationFrame(rafId);
	}, [tasks]);

	return (
		<>
			<section className="relative w-full overflow-hidden space-y-8">
				<div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(168,85,247,0.14),transparent_32%),radial-gradient(circle_at_top_right,rgba(37,99,235,0.10),transparent_26%),linear-gradient(to_bottom,rgba(255,255,255,0.94),rgba(248,248,248,0.76))] dark:bg-[radial-gradient(circle_at_top_left,rgba(168,85,247,0.12),transparent_32%),radial-gradient(circle_at_top_right,rgba(37,99,235,0.10),transparent_26%),linear-gradient(to_bottom,rgba(9,9,11,0.98),rgba(24,24,27,0.94))]" />
				<div className="pointer-events-none absolute -left-24 top-16 h-64 w-64 bg-fuchsia-500/10 blur-3xl dark:bg-fuchsia-500/12" />
				<div className="pointer-events-none absolute -right-20 top-28 h-72 w-72 bg-sky-500/10 blur-3xl dark:bg-sky-500/12" />

				<div className="flex flex-col justify-between gap-6 border-b border-zinc-200 pb-8 dark:border-zinc-800 md:flex-row md:items-end">
					<div className="space-y-2 border border-white/60 bg-white/75 p-6 shadow-[0_18px_60px_-34px_rgba(0,0,0,0.35)] backdrop-blur dark:border-white/10 dark:bg-zinc-950/70">
						<div className="inline-flex items-center gap-2 border border-purple-500/15 bg-purple-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.22em] text-purple-700 dark:bg-purple-500/10 dark:text-purple-300">
							{roleLabel}
						</div>
						<h1 className="text-3xl font-extrabold tracking-tight text-zinc-950 dark:text-white sm:text-4xl">{title}</h1>
						<p className="max-w-2xl text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{description}</p>
					</div>

					<div className="flex shrink-0 flex-wrap items-center gap-3 border border-zinc-200/80 bg-white/80 p-3 shadow-[0_18px_60px_-34px_rgba(0,0,0,0.35)] backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/70">
						<div className="inline-flex items-center justify-center border border-purple-500/15 bg-purple-50 px-5 py-3 text-xs font-bold text-purple-700 dark:bg-purple-500/10 dark:text-purple-300">
							{stats.total} Task{stats.total !== 1 ? "s" : ""} Tracked
						</div>
					</div>
				</div>

					<div className="grid gap-4 lg:grid-cols-2">
					<div className="flex items-center justify-between border border-zinc-200/80 bg-white p-5 shadow-[0_18px_60px_-34px_rgba(0,0,0,0.35)] dark:border-zinc-800/80 dark:bg-zinc-950">
						<div className="flex items-center gap-4">
							<div className="flex h-12 w-12 items-center justify-center border border-blue-500/15 bg-blue-500/10 text-blue-600 dark:bg-blue-500/15 dark:text-blue-300">
								<Users2 className="h-5 w-5" />
							</div>
							<div>
								<p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Project Members</p>
								<p className="text-2xl font-black text-zinc-950 dark:text-white">{projectStats.members}</p>
							</div>
						</div>
					</div>
				</div>

				{canCreateTask ? (
					<NewTaskModal
						key={`${createTaskOpen ? "open" : "closed"}-${createTaskProjectId ?? "none"}`}
						open={createTaskOpen}
						projectId={createTaskProjectId}
						projects={projects}
						onOpenChange={setCreateTaskOpen}
					/>
				) : null}

				{projects && projects.length > 0 ? (
					<div className="space-y-4">
						<div className="flex items-center justify-between">
							<div>
								<h3 className="text-sm font-black uppercase tracking-[0.22em] text-zinc-600 dark:text-zinc-300">Projects</h3>
								<p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">Create a task directly from the project card.</p>
							</div>
							<div className="inline-flex items-center justify-center border border-zinc-200 bg-white px-4 py-2 text-xs font-bold text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300">{projectStats.total} Total</div>
						</div>

						<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
							{projects.map((project) => (
								<div key={project.id} className="group relative border border-zinc-200/80 bg-white p-5 shadow-[0_18px_60px_-34px_rgba(0,0,0,0.35)] transition hover:-translate-y-0.5 hover:border-purple-300 dark:border-zinc-800/80 dark:bg-zinc-950 dark:hover:border-purple-900/50">
									<div className="flex items-start justify-between gap-3">
										<div className="min-w-0">
											<p className="text-[10px] font-black uppercase tracking-[0.22em] text-zinc-500 dark:text-zinc-400">Project</p>
											<h4 className="mt-2 truncate text-base font-extrabold text-zinc-950 dark:text-white">{project.name}</h4>
											<p className="mt-1 line-clamp-2 text-xs leading-5 text-zinc-500 dark:text-zinc-400">{project.description || "No project description available."}</p>
										</div>
										{canCreateTask ? (
											<button type="button" onClick={() => openTaskCreator(project.id)} className="inline-flex shrink-0 items-center gap-2 border border-purple-600 bg-purple-600 px-3 py-2 text-[11px] font-bold text-white transition hover:bg-purple-700">
												<Plus className="h-3.5 w-3.5" /> Create
											</button>
										) : null}
									</div>

									<div className="mt-5 grid grid-cols-2 gap-3 text-xs">
										<div className="border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900/30">
											<p className="font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Members</p>
											<p className="mt-2 text-base font-black text-zinc-950 dark:text-white">{project.members?.length ?? 0}</p>
										</div>
										<div className="border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900/30">
											<p className="font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Deadline</p>
											<p className="mt-2 text-sm font-bold text-zinc-950 dark:text-white">{formatDate(project.deadline)}</p>
										</div>
								</div>

								<div className="mt-4 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
									<span>{project.status || "Active"}</span>
									<button type="button" onClick={() => setOpenProjectModal(project)} className="font-bold text-purple-600 transition hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300">
										View details
									</button>
								</div>
							</div>
						))}
					</div>
				</div>
				) : null}

				<div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
					{[
						{ label: "To Do", value: stats.todo, icon: CircleDashed, tone: "text-purple-600 bg-purple-50 dark:bg-purple-900/20" },
						{ label: "In Progress", value: stats.inProgress, icon: Clock3, tone: "text-blue-600 bg-blue-50 dark:bg-blue-900/20" },
						{ label: "Completed", value: stats.completed, icon: CircleCheckBig, tone: "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20" },
						{ label: "Overdue", value: stats.overdue, icon: TriangleAlert, tone: "text-rose-600 bg-rose-50 dark:bg-rose-900/20" },
					].map((item) => (
						<div key={item.label} className="border border-zinc-200/80 bg-white p-5 shadow-[0_18px_60px_-34px_rgba(0,0,0,0.35)] dark:border-zinc-800/80 dark:bg-zinc-950">
							<div className="flex items-center gap-4">
								<div className={`flex h-12 w-12 shrink-0 items-center justify-center border ${item.tone}`}>
									<item.icon className="h-5 w-5" />
								</div>
								<div>
									<p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">{item.label}</p>
									<p className="text-2xl font-black text-zinc-950 dark:text-white">{item.value}</p>
								</div>
							</div>
						</div>
					))}
				</div>

				{!hideTaskSection ? (
				<div className="border border-zinc-200/80 bg-white p-6 shadow-[0_18px_60px_-34px_rgba(0,0,0,0.35)] dark:border-zinc-800/80 dark:bg-zinc-950 sm:p-8">
					<div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
						<div className="flex items-center gap-3">
							<div className="flex h-10 w-10 items-center justify-center border border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900">
								<LayoutList className="h-5 w-5 text-zinc-700 dark:text-zinc-300" />
							</div>
							<div>
								<h2 className="text-lg font-bold text-zinc-900 dark:text-white">Task Management</h2>
								<p className="text-xs text-zinc-500 dark:text-zinc-400">Manage and update your tasks below.</p>
							</div>
						</div>
					</div>

					<TaskTable
						tasks={tasks}
						returnTo={returnTo}
						initialTaskId={initialTaskId}
						statusEditable={statusEditable}
						allowAssignmentEdit={allowAssignmentEdit}
						allowTaskEdit={allowTaskEdit}
						currentUser={currentUser}
					/>
					</div>
				) : null}
			</section>

			<AnimatePresence>
				{openProjectModal && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm sm:p-6"
						onClick={() => setOpenProjectModal(null)}
					>
						<motion.div
							initial={{ scale: 0.95, y: 20 }}
							animate={{ scale: 1, y: 0 }}
							exit={{ scale: 0.95, y: 20 }}
							className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden border border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-950"
							onClick={(e) => e.stopPropagation()}
						>
							<div className="flex items-center justify-between border-b border-zinc-100 bg-zinc-50/60 px-6 py-5 dark:border-zinc-900 dark:bg-zinc-900/20 md:px-8">
								<div className="space-y-1">
									<p className="text-[10px] font-black uppercase tracking-[0.28em] text-purple-600 dark:text-purple-400">Project Details</p>
									<h2 className="text-2xl font-black tracking-tight text-zinc-950 dark:text-white">{openProjectModal.name}</h2>
									<p className="text-sm text-zinc-600 dark:text-zinc-400">Overview of the selected project and assigned members.</p>
								</div>
								<div className="flex items-center gap-2">
									{canCreateTask ? (
										<button type="button" onClick={() => openTaskCreator(openProjectModal.id)} className="border border-purple-600 bg-purple-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-purple-700">
											<Plus className="h-4 w-4" /> Add Task
										</button>
									) : null}
									<button onClick={() => setOpenProjectModal(null)} className="border border-zinc-200 bg-white p-2 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-white">
										<X size={20} />
									</button>
								</div>
							</div>

							<div className="custom-scrollbar flex-1 space-y-6 overflow-y-auto p-6 md:p-8">
								<div className="grid gap-4 sm:grid-cols-3">
									<div className="border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/30">
										<p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Status</p>
										<p className="mt-2 text-sm font-bold text-zinc-950 dark:text-white">{openProjectModal.status || "Active"}</p>
									</div>
									<div className="border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/30">
										<p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Deadline</p>
										<p className="mt-2 text-sm font-bold text-zinc-950 dark:text-white">{formatDate(openProjectModal.deadline)}</p>
									</div>
									<div className="border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/30">
										<p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Members</p>
										<p className="mt-2 text-sm font-bold text-zinc-950 dark:text-white">{openProjectModal.members?.length ?? 0}</p>
									</div>
								</div>

								<div className="border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950/80">
									<h3 className="text-xs font-bold uppercase tracking-[0.22em] text-zinc-500 dark:text-zinc-400">Description</h3>
									<p className="mt-3 text-sm leading-6 text-zinc-700 dark:text-zinc-300">{openProjectModal.description || "No project description available."}</p>
								</div>

								<div className="border border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-zinc-900/20">
									<div className="mb-4 flex items-center justify-between">
										<h3 className="text-xs font-bold uppercase tracking-[0.22em] text-zinc-500 dark:text-zinc-400">Team Members</h3>
										<span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">{openProjectModal.members?.length ?? 0} total</span>
									</div>
									{openProjectModal.members && openProjectModal.members.length > 0 ? (
										<div className="grid gap-3 sm:grid-cols-2">
											{openProjectModal.members.map((member: NonNullable<ProjectRecord["members"]>[number]) => (
												<div key={member.id} className="flex items-center gap-3 border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-950">
													<div className="flex h-10 w-10 items-center justify-center border border-purple-500/15 bg-purple-500/10 font-bold text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">{(member.name || "U").charAt(0).toUpperCase()}</div>
													<div className="min-w-0">
														<p className="truncate text-sm font-bold text-zinc-950 dark:text-zinc-100">{member.name || "Unnamed User"}</p>
														<p className="truncate text-xs text-zinc-500 dark:text-zinc-400">{member.email}</p>
													</div>
												</div>
											))}
										</div>
									) : (
										<div className="border border-dashed border-zinc-300 bg-white p-4 text-sm text-zinc-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-400">No team members assigned to this project.</div>
									)}
								</div>

								{canCreateTask ? (
									<div className="flex justify-end">
										<button type="button" onClick={() => openTaskCreator(openProjectModal.id)} className="border border-purple-600 bg-purple-600 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-purple-700">
											<Plus className="h-4 w-4" /> Add Task for This Project
										</button>
									</div>
								) : null}
							</div>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>
		</>
	);
}

function NewTaskModal({
	open,
	projectId,
	projects,
	onOpenChange,
}: {
	open: boolean;
	projectId: string | null;
	projects?: ProjectRecord[];
	onOpenChange: (open: boolean) => void;
}) {
	const [selectedProjectId, setSelectedProjectId] = useState<string | null>(projectId ?? (projects && projects.length > 0 ? projects[0].id : null));
	const [selectedAssignee, setSelectedAssignee] = useState<string | null>(null);
	const [actionState, formAction, isPending] = useActionState(createTaskAction, { success: false, message: "" });

	useEffect(() => {
		if (!actionState) return;
		if (actionState.success) {
			toast.success(actionState.message || "Task created successfully!");
			onOpenChange(false);
		} else if (actionState.message) {
			toast.error(actionState.message);
		}
	}, [actionState, onOpenChange]);

	return (
		<AnimatePresence>
			{open && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm sm:p-6"
					onClick={() => onOpenChange(false)}
				>
					<motion.div
						initial={{ scale: 0.95, y: 20 }}
						animate={{ scale: 1, y: 0 }}
						exit={{ scale: 0.95, y: 20 }}
						className="flex max-h-[90vh] w-full max-w-xl flex-col overflow-hidden border border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-950"
						onClick={(e) => e.stopPropagation()}
					>
						<div className="flex items-center justify-between border-b border-zinc-100 bg-zinc-50/50 px-6 py-5 dark:border-zinc-900 dark:bg-zinc-900/20">
							<div>
								<h2 className="text-xl font-black tracking-tight text-zinc-900 dark:text-white">Create New Task</h2>
								<p className="mt-1 text-xs text-zinc-500">Assign a task to a project member</p>
							</div>
							<button type="button" onClick={() => onOpenChange(false)} className="bg-zinc-100 p-2 text-zinc-500 transition-colors hover:bg-zinc-200 hover:text-zinc-900 dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-white">
								<X size={20} />
							</button>
						</div>

						<form action={formAction} className="flex flex-1 flex-col overflow-hidden">
							<div className="custom-scrollbar flex-1 space-y-5 overflow-y-auto p-6">
								<div className="space-y-2">
									<label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Task Title</label>
									<input name="title" placeholder="e.g. Design Homepage" required className="w-full border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-purple-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white" />
								</div>

								<div className="space-y-2">
									<label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Project Selection</label>
									{projects && projects.length > 0 ? (
										<select name="projectId" value={selectedProjectId ?? ""} onChange={(e) => { setSelectedProjectId(e.target.value || null); setSelectedAssignee(null); }} required className="w-full cursor-pointer appearance-none border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-purple-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white">
											<option value="">Select project</option>
											{projects.map((project) => <option key={project.id} value={project.id}>{project.name}</option>)}
										</select>
									) : (
										<input name="projectId" placeholder="Project ID" required className="w-full border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-purple-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white" />
									)}
								</div>

								<div className="space-y-2">
									<label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Description</label>
									<textarea name="description" placeholder="Short description" rows={3} className="w-full resize-none border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-purple-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white" />
								</div>

								<div className="space-y-2">
									<label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Attachment Links</label>
									<textarea name="attachmentLinks" placeholder="Paste PDF links, image links, or any file URL - one per line" rows={3} className="w-full resize-none border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-purple-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white" />
									<p className="text-[11px] leading-5 text-zinc-500 dark:text-zinc-400">Use this for PDF uploads and any shared file links.</p>
								</div>

								<div className="grid gap-5 sm:grid-cols-2">
									<div className="space-y-2">
										<label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Due Date</label>
										<input name="dueDate" type="date" required className="w-full appearance-none border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-purple-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white" />
									</div>
									<div className="space-y-2">
										<label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Priority</label>
										<select name="priority" className="w-full cursor-pointer appearance-none border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-purple-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white">
											<option value="Medium">Medium</option>
											<option value="High">High</option>
											<option value="Low">Low</option>
										</select>
									</div>
								</div>

								<div className="space-y-2 pt-2">
									<label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Assign Member</label>
									<input type="hidden" name="assignedToId" value={selectedAssignee ?? ""} />
										{projects && selectedProjectId ? (() => {
											const members = projects.find((project) => project.id === selectedProjectId)?.members ?? [];
											if (members.length > 0) {
												return (
													<div className="grid max-h-32 grid-cols-1 gap-2 overflow-y-auto pr-1 sm:grid-cols-2">
														{members.map((member: NonNullable<ProjectRecord["members"]>[number]) => (
														<button key={member.id} type="button" onClick={() => setSelectedAssignee(member.id)} className={`flex items-center gap-2 border p-2 text-left transition-all ${selectedAssignee === member.id ? "border-purple-500 bg-purple-50 dark:bg-purple-900/30" : "border-zinc-200 bg-white hover:border-purple-300 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-purple-700"}`}>
															<div className="flex h-6 w-6 shrink-0 items-center justify-center border border-zinc-200 bg-zinc-50 text-[10px] font-bold text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">{(member.name || "U").charAt(0)}</div>
															<span className="truncate text-xs font-semibold text-zinc-900 dark:text-zinc-100">{member.name || member.id}</span>
														</button>
													))}
												</div>
											);
										}
										return <p className="text-xs italic text-zinc-500">No members found in this project.</p>;
									})() : (
										<p className="text-xs italic text-zinc-500">Select a project first to view members.</p>
									)}
								</div>
							</div>

							<div className="flex items-center justify-end gap-3 border-t border-zinc-100 bg-zinc-50/50 px-6 py-4 dark:border-zinc-900 dark:bg-zinc-900/20">
								<button type="button" onClick={() => onOpenChange(false)} disabled={isPending} className="px-5 py-2.5 text-sm font-bold text-zinc-600 transition hover:bg-zinc-100 disabled:opacity-50 dark:text-zinc-300 dark:hover:bg-zinc-800">Cancel</button>
								<button type="submit" disabled={isPending} className="inline-flex items-center gap-2 border border-purple-600 bg-purple-600 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50">{isPending ? "Creating..." : "Create Task"}</button>
							</div>
						</form>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
