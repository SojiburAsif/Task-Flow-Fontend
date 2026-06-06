import React from "react";
import { notFound } from "next/navigation";

import ProjectDetailsView from "@/components/Dashboard/ProjectDetailsView";
import { getCurrentUser } from "@/lib/currentUser";
import { getProjectById } from "@/services/project.service";
import { getMyNotifications } from "@/services/notification.service";
import { getUsers } from "@/services/user.service";

type Props = {
	params: Promise<{ id: string }>;
	searchParams?: Promise<{ returnTo?: string | string[] }>;
};

export default async function ProjectDetailsPage({ params, searchParams }: Props) {
	const { id } = await params;
	const resolvedSearchParams = searchParams ? await searchParams : undefined;
	const [project, currentUser, notifications] = await Promise.all([
		getProjectById(id),
		getCurrentUser(),
		getMyNotifications({ limit: 100 }),
	]);

	if (!project) {
		notFound();
	}

	const canEdit = currentUser?.role === "Admin" || currentUser?.role === "ProjectManager";
	const users = canEdit ? (await getUsers()) ?? [] : [];
	const teamMembers = users.filter(user => {
		const normalizedRole = user.role.replace(/[_\s-]+/g, "").toLowerCase();
		return normalizedRole === "teammember";
	});
	const relatedNotifications = (notifications ?? [])
		.filter(notification => notification.project?.id === project.id)
		.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
		.slice(0, 5);
	const returnTo = typeof resolvedSearchParams?.returnTo === "string" && resolvedSearchParams.returnTo.startsWith("/dashboard")
		? resolvedSearchParams.returnTo
		: "/dashboard/projects";

	return (
		<ProjectDetailsView
			project={project}
			teamMembers={teamMembers}
			relatedNotifications={relatedNotifications}
			canEdit={canEdit}
			returnTo={returnTo}
		/>
	);
}
