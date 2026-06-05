import React from "react";

import { getCurrentUser } from "@/lib/currentUser";
import { getProjectById, getProjects } from "@/services/project.service";
import { TeamBoard } from "@/components/Dashboard/TeamBoard";

type ProjectsPageProps = {
	searchParams?: Promise<{
		view?: string;
	}>;
};

export default async function ProjectsPage({ searchParams }: ProjectsPageProps) {
	const resolvedSearchParams = searchParams ? await searchParams : undefined;
	const initialProjectId = typeof resolvedSearchParams?.view === "string" && resolvedSearchParams.view.trim() ? resolvedSearchParams.view.trim() : null;
	const [projects, user, selectedProject] = await Promise.all([
		getProjects({ page: 1, limit: 100 }),
		getCurrentUser(),
		initialProjectId ? getProjectById(initialProjectId) : Promise.resolve(null),
	]);
	const mergedProjects = selectedProject
		? [selectedProject, ...(projects ?? []).filter(project => project.id !== selectedProject.id)]
		: projects ?? [];
	const canEdit = user?.role === "Admin" || user?.role === "ProjectManager";

	return (
		<div className="p-4 sm:p-6 lg:p-8">
			<TeamBoard
				projects={mergedProjects}
				title="Projects"
				description="Open a project to review its members, deadline, and status. This page now reads from the dedicated project API helpers."
				roleLabel={user?.role ? `${user.role} workspace` : "Projects workspace"}
				canEdit={canEdit}
				initialProjectId={initialProjectId}
			/>
		</div>
	);
}