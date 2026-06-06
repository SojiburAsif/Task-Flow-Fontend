"use client";

import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

import ProjectEditForm from "@/components/Dashboard/ProjectEditForm";
import type { ProjectRecord } from "@/services/project.service";
import type { UserProfile } from "@/services/user.service";

type ProjectEditModalProps = {
	open: boolean;
	project: ProjectRecord | null;
	teamMembers: UserProfile[];
	returnTo: string;
	onOpenChange: (open: boolean) => void;
};

export default function ProjectEditModal({ open, project, teamMembers, returnTo, onOpenChange }: ProjectEditModalProps) {
	useEffect(() => {
		if (!open) return undefined;

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				onOpenChange(false);
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [open, onOpenChange]);

	if (!open || !project || typeof window === "undefined") {
		return null;
	}

	return createPortal(
		<div className="fixed inset-0 z-60 overflow-y-auto bg-black/60 px-4 py-6 backdrop-blur-sm sm:px-6">
			<button
				type="button"
				aria-label="Close project edit modal"
				className="absolute inset-0 cursor-default"
				onClick={() => onOpenChange(false)}
			/>
			<div className="relative z-10 mx-auto w-full max-w-6xl rounded-none border border-zinc-200 bg-white p-4 shadow-2xl dark:border-zinc-800 dark:bg-zinc-950 sm:p-6">
				<div className="mb-4 flex items-center justify-between gap-3 border-b border-zinc-200 pb-4 dark:border-zinc-800">
					<div>
						<p className="text-[10px] font-black uppercase tracking-[0.28em] text-purple-600 dark:text-purple-400">Edit project</p>
						<h2 className="mt-1 text-xl font-black tracking-tight text-zinc-950 dark:text-zinc-50">{project.name}</h2>
					</div>
					<button
						type="button"
						aria-label="Close"
						onClick={() => onOpenChange(false)}
						className="inline-flex h-10 w-10 items-center justify-center border border-zinc-200 bg-white text-zinc-500 transition hover:border-purple-300 hover:text-purple-600 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-purple-500/60 dark:hover:text-purple-300"
					>
						<X size={18} />
					</button>
				</div>
				<div className="max-h-[calc(100vh-10rem)] overflow-y-auto pr-1">
					<ProjectEditForm project={project} teamMembers={teamMembers} returnTo={returnTo} onClose={() => onOpenChange(false)} />
				</div>
			</div>
		</div>,
		document.body,
	);
}
