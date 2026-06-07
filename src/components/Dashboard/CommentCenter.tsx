"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { CalendarDays, MessageSquare, Search, Trash2, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";

import { getTaskDetailsHref } from "@/lib/dashboard-links";
import type { CurrentUser } from "@/lib/currentUser";

export type CommentUser = {
	id: string;
	name?: string | null;
	email?: string | null;
	image?: string | null;
	role?: string | null;
};

export type TaskCommentItem = {
	id: string;
	taskId: string;
	text: string;
	createdAt: string;
	user: CommentUser;
	task?: {
		id: string;
		title: string;
		status?: string | null;
		project: {
			id: string;
			name: string;
		};
	};
};

type CommentCenterProps = {
	mode: "task" | "feed";
	title: string;
	description?: string;
	taskId?: string;
	taskContext?: {
		id: string;
		title: string;
		status?: string | null;
		project?: {
			id: string;
			name: string;
		};
	};
	initialComments?: TaskCommentItem[];
	currentUser?: CurrentUser | null;
	allowCompose?: boolean;
	allowDeleteAny?: boolean;
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

const getTaskHref = (comment: TaskCommentItem) => (comment.task?.id ? getTaskDetailsHref(comment.task.id) : null);

export default function CommentCenter({
	mode,
	title,
	description,
	taskId,
	taskContext,
	initialComments = [],
	currentUser,
	allowCompose = mode === "task",
	allowDeleteAny = false,
}: CommentCenterProps) {
	const [comments, setComments] = useState<TaskCommentItem[]>(initialComments);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [text, setText] = useState("");
	const [saving, setSaving] = useState(false);
	const [selectedComment, setSelectedComment] = useState<TaskCommentItem | null>(null);
	const [searchTerm, setSearchTerm] = useState("");

	const endpoint = useMemo(() => {
		if (mode === "task") {
			if (!taskId) return null;
			return `/api/tasks/${taskId}/comments`;
		}

		return "/api/comments";
	}, [mode, taskId]);

	useEffect(() => {
		const loadComments = async () => {
			if (!endpoint) {
				setComments([]);
				setLoading(false);
				return;
			}

			setLoading(true);
			setError(null);

			try {
				const response = await fetch(endpoint, { cache: "no-store", credentials: "include" });
				const payload = await response.json().catch(() => null) as { success?: boolean; message?: string; data?: TaskCommentItem[] | { items?: TaskCommentItem[] } } | null;

				if (!response.ok || !payload?.success) {
					throw new Error(payload?.message || `Failed to load comments (${response.status})`);
				}

				const items = Array.isArray(payload.data)
					? payload.data
					: payload.data && Array.isArray(payload.data.items)
						? payload.data.items
						: [];
				setComments(items);
			} catch (fetchError) {
				setError(fetchError instanceof Error ? fetchError.message : "Failed to load comments");
			} finally {
				setLoading(false);
			}
		};

		void loadComments();
	}, [endpoint]);

	const filteredComments = useMemo(() => {
		const query = searchTerm.trim().toLowerCase();
		if (!query) return comments;
		return comments.filter((comment) => {
			const haystack = [comment.text, comment.user.name, comment.user.email, comment.task?.title, comment.task?.project.name].filter(Boolean).join(" ").toLowerCase();
			return haystack.includes(query);
		});
	}, [comments, searchTerm]);

	const canDeleteComment = (comment: TaskCommentItem) => {
		if (allowDeleteAny) return true;
		if (!currentUser) return false;
		return currentUser.id === comment.user.id || currentUser.role === "Admin" || currentUser.role === "ProjectManager";
	};

	const handleCreateComment = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (mode !== "task" || !taskId) return;

		const value = text.trim();
		if (!value) {
			toast.error("Comment text is required.");
			return;
		}

		setSaving(true);
		try {
			const response = await fetch(`/api/tasks/${taskId}/comments`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				credentials: "include",
				body: JSON.stringify({ text: value }),
			});
			const payload = await response.json().catch(() => null) as { success?: boolean; data?: TaskCommentItem; message?: string } | null;

			if (!response.ok || !payload?.success || !payload.data) {
				throw new Error(payload?.message || "Failed to create comment");
			}

			setComments((current) => [payload.data!, ...current]);
			setText("");
			toast.success("Comment added successfully.");
		} catch (createError) {
			toast.error(createError instanceof Error ? createError.message : "Failed to create comment");
		} finally {
			setSaving(false);
		}
	};

	const handleDeleteComment = async (comment: TaskCommentItem) => {
		const taskTargetId = comment.task?.id ?? taskId;
		if (!taskTargetId) return;

		try {
			const response = await fetch(`/api/tasks/${taskTargetId}/comments/${comment.id}`, { method: "DELETE", credentials: "include" });
			const payload = await response.json().catch(() => null) as { success?: boolean; message?: string } | null;

			if (!response.ok || !payload?.success) {
				throw new Error(payload?.message || "Failed to delete comment");
			}

			setComments((current) => current.filter((item) => item.id !== comment.id));
			if (selectedComment?.id === comment.id) {
				setSelectedComment(null);
			}
			toast.success("Comment deleted successfully.");
		} catch (deleteError) {
			toast.error(deleteError instanceof Error ? deleteError.message : "Failed to delete comment");
		}
	};

	const activeTask = selectedComment?.task ?? taskContext;

	return (
		<section className="rounded-none border border-zinc-200 bg-white p-5 shadow-[0_18px_60px_-34px_rgba(0,0,0,0.35)] dark:border-zinc-800 dark:bg-zinc-950">
			<div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
				<div className="space-y-1">
					<p className="text-[10px] font-black uppercase tracking-[0.22em] text-purple-600 dark:text-purple-400">Comments</p>
					<h3 className="text-lg font-black text-zinc-950 dark:text-white">{title}</h3>
					{description ? <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-400">{description}</p> : null}
				</div>
				<div className="inline-flex items-center gap-2 border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs font-bold text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
					<MessageSquare className="h-4 w-4 text-purple-500" />
					{filteredComments.length} comment{filteredComments.length === 1 ? "" : "s"}
				</div>
			</div>

			{mode === "feed" ? (
				<div className="mb-4 flex items-center gap-2 border border-zinc-200 bg-zinc-50 px-3 py-2 dark:border-zinc-800 dark:bg-zinc-900/40">
					<Search className="h-4 w-4 text-zinc-400" />
					<input
						value={searchTerm}
						onChange={(event) => setSearchTerm(event.target.value)}
						placeholder="Search text, user, project, or task"
						className="w-full bg-transparent text-sm text-zinc-900 outline-none placeholder:text-zinc-400 dark:text-zinc-100"
					/>
				</div>
			) : null}

			{mode === "task" && allowCompose ? (
				<form onSubmit={handleCreateComment} className="mb-5 space-y-3">
					<label className="block text-xs font-bold uppercase tracking-[0.22em] text-zinc-500 dark:text-zinc-400">Add a comment</label>
					<textarea
						value={text}
						onChange={(event) => setText(event.target.value)}
						rows={3}
						placeholder="Share progress, feedback, or a blocker..."
						className="w-full border border-zinc-200 bg-white px-3 py-3 text-sm text-zinc-950 outline-none transition focus:border-purple-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50"
					/>
					<div className="flex items-center justify-between gap-3">
						<p className="text-xs text-zinc-500 dark:text-zinc-400">Keep it short and tied to task progress.</p>
						<button type="submit" disabled={saving} className="inline-flex items-center gap-2 border border-purple-600 bg-purple-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-purple-700 disabled:opacity-50">
							{saving ? "Posting..." : "Post comment"}
						</button>
					</div>
				</form>
			) : null}

			{loading ? (
				<div className="border border-dashed border-zinc-300 bg-zinc-50 px-4 py-6 text-sm text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
					Loading comments...
				</div>
			) : error ? (
				<div className="border border-rose-200 bg-rose-50 px-4 py-6 text-sm text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-300">
					{error}
				</div>
			) : filteredComments.length === 0 ? (
				<div className="border border-dashed border-zinc-300 bg-zinc-50 px-4 py-8 text-sm text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
					No comments found.
				</div>
			) : (
				<div className="space-y-3">
					{filteredComments.map((comment) => {
						const taskHref = getTaskHref(comment);
						return (
							<div
								key={comment.id}
								role="button"
								tabIndex={0}
								onClick={() => setSelectedComment(comment)}
								onKeyDown={(event) => {
									if (event.key === "Enter" || event.key === " ") {
										event.preventDefault();
										setSelectedComment(comment);
									}
								}}
								className="group w-full border border-zinc-200 bg-white p-4 text-left transition hover:-translate-y-0.5 hover:border-purple-300 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-purple-500/50"
							>
								<div className="flex items-start justify-between gap-4">
									<div className="min-w-0 flex-1 space-y-2">
										<div className="flex flex-wrap items-center gap-2">
											<span className="text-sm font-bold text-zinc-950 dark:text-zinc-50">{comment.user.name || comment.user.email || "Unknown user"}</span>
											<span className="text-[10px] font-black uppercase tracking-[0.22em] text-zinc-400">{formatRelativeTime(comment.createdAt)}</span>
											{comment.user.role ? <span className="border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">{comment.user.role}</span> : null}
										</div>
										<p className="line-clamp-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400">{comment.text}</p>
										{comment.task ? (
											<div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
												<span className="inline-flex items-center gap-1 border border-blue-200 bg-blue-50 px-2 py-1 text-blue-700 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-300">Task: {comment.task.title}</span>
												<span className="inline-flex items-center gap-1 border border-zinc-200 bg-zinc-50 px-2 py-1 dark:border-zinc-800 dark:bg-zinc-900">Project: {comment.task.project.name}</span>
												{taskHref ? <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-purple-600 dark:text-purple-400">Open in task view</span> : null}
											</div>
										) : null}
									</div>
									<div className="flex shrink-0 items-center gap-2">
										{canDeleteComment(comment) ? (
											<button
												type="button"
												onClick={(event) => {
													event.stopPropagation();
													void handleDeleteComment(comment);
												}}
												className="inline-flex items-center gap-1 border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-bold text-rose-700 transition hover:bg-rose-100 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-300 dark:hover:bg-rose-500/20"
											>
												<Trash2 className="h-3.5 w-3.5" /> Delete
											</button>
										) : null}
										{taskHref ? (
											<Link href={taskHref} onClick={(event) => event.stopPropagation()} className="inline-flex items-center gap-1 border border-zinc-200 bg-white px-3 py-2 text-xs font-bold text-zinc-600 transition hover:border-purple-300 hover:text-purple-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:border-purple-500/60 dark:hover:text-purple-300">
												Task
											</Link>
										) : null}
									</div>
								</div>
							</div>
						);
					})}
				</div>
			)}

			<AnimatePresence>
				{selectedComment ? (
					<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm" onClick={() => setSelectedComment(null)}>
						<motion.div initial={{ scale: 0.96, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.96, y: 20 }} className="flex w-full max-w-2xl flex-col overflow-hidden border border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-950" onClick={(event) => event.stopPropagation()}>
							<div className="flex items-start justify-between gap-4 border-b border-zinc-100 bg-zinc-50/70 px-5 py-4 dark:border-zinc-800 dark:bg-zinc-900/40">
								<div className="space-y-1">
									<p className="text-[10px] font-black uppercase tracking-[0.22em] text-purple-600 dark:text-purple-400">Comment details</p>
									<h4 className="text-xl font-black text-zinc-950 dark:text-zinc-50">{selectedComment.user.name || selectedComment.user.email || "Comment"}</h4>
								</div>
								<button type="button" onClick={() => setSelectedComment(null)} className="border border-zinc-200 bg-white p-2 text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-white">
									<X size={18} />
								</button>
							</div>

							<div className="space-y-5 p-5">
								<div className="grid gap-3 sm:grid-cols-2">
									<div className="border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/30">
										<p className="text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-500 dark:text-zinc-400">Author</p>
										<p className="mt-2 text-sm font-bold text-zinc-950 dark:text-zinc-50">{selectedComment.user.name || selectedComment.user.email || "Unknown user"}</p>
										<p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">{selectedComment.user.role || "No role"}</p>
									</div>
									<div className="border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/30">
										<p className="text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-500 dark:text-zinc-400">Created</p>
										<p className="mt-2 inline-flex items-center gap-2 text-sm font-bold text-zinc-950 dark:text-zinc-50"><CalendarDays className="h-4 w-4 text-purple-500" />{formatRelativeTime(selectedComment.createdAt)}</p>
									</div>
								</div>

								<div className="border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950/70">
									<p className="text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-500 dark:text-zinc-400">Comment text</p>
									<p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-zinc-700 dark:text-zinc-300">{selectedComment.text}</p>
								</div>

								{activeTask ? (
									<div className="border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/30">
										<p className="text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-500 dark:text-zinc-400">Task context</p>
										<div className="mt-3 flex flex-wrap items-center gap-2">
											<span className="border border-blue-200 bg-blue-50 px-2 py-1 text-xs font-bold text-blue-700 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-300">{activeTask.title}</span>
											{activeTask.project?.name ? <span className="border border-zinc-200 bg-white px-2 py-1 text-xs font-bold text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300">{activeTask.project.name}</span> : null}
											{activeTask.id ? <Link href={getTaskDetailsHref(activeTask.id)} className="text-xs font-bold uppercase tracking-[0.22em] text-purple-600 dark:text-purple-400">Open task</Link> : null}
										</div>
									</div>
								) : null}

								<div className="flex items-center justify-between gap-3">
									<div className="text-xs text-zinc-500 dark:text-zinc-400">Click outside the modal to close it.</div>
									<div className="flex items-center gap-2">
										{canDeleteComment(selectedComment) ? (
											<button type="button" onClick={() => void handleDeleteComment(selectedComment)} className="inline-flex items-center gap-2 border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-bold text-rose-700 transition hover:bg-rose-100 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-300 dark:hover:bg-rose-500/20">
												<Trash2 className="h-4 w-4" /> Delete
											</button>
										) : null}
										<button type="button" onClick={() => setSelectedComment(null)} className="border border-zinc-200 bg-white px-4 py-2 text-sm font-bold text-zinc-700 transition hover:border-purple-300 hover:text-purple-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:border-purple-500/60 dark:hover:text-purple-300">
											Close
										</button>
									</div>
								</div>
							</div>
						</motion.div>
					</motion.div>
				) : null}
			</AnimatePresence>
		</section>
	);
}