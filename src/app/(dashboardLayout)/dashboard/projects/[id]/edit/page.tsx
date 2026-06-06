import React from "react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { Role } from "@/app/constants/role";
import { getCurrentUser } from "@/lib/currentUser";
import { getProjectById } from "@/services/project.service";
import { getUsers } from "@/services/user.service";
import ProjectEditForm from "@/components/Dashboard/ProjectEditForm";

type Props = {
	params: Promise<{ id: string }>;
	searchParams?: Promise<{ returnTo?: string | string[] }>;
};

export default async function ProjectEditPage({ params, searchParams }: Props) {
	const { id } = await params;
	const resolvedSearchParams = searchParams ? await searchParams : undefined;
	const currentUser = await getCurrentUser();

	if (!currentUser) {
		redirect("/login");
	}

	const allowedRole = currentUser.role === Role.ADMIN || currentUser.role === Role.ProjectManager;

	if (!allowedRole) {
		redirect(`/dashboard/projects/${id}`);
	}

	const [project, users] = await Promise.all([getProjectById(id), getUsers()]);

	if (!project) {
		notFound();
	}

	const teamMembers = (users ?? []).filter(user => {
		const normalizedRole = user.role.replace(/[_\s-]+/g, "").toLowerCase();
		return normalizedRole === "teammember";
	});
	const returnTo = typeof resolvedSearchParams?.returnTo === "string" && resolvedSearchParams.returnTo.startsWith("/dashboard")
		? resolvedSearchParams.returnTo
		: `/dashboard/projects/${project.id}`;

	return (
		<div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
			<div className="mb-6 flex items-center justify-between gap-4">
				<Link href={returnTo} className="inline-flex items-center gap-2 text-sm font-medium text-zinc-500 transition hover:text-purple-600">
					Back to project
				</Link>
				<p className="text-sm text-zinc-500">{currentUser?.role ? `${currentUser.role} editing mode` : "Editing mode"}</p>
			</div>
			<ProjectEditForm project={project} teamMembers={teamMembers} returnTo={returnTo} />
		</div>
	);
}