import React from "react";

import { getCurrentUser } from "@/lib/currentUser";
import { getProjects } from "@/services/project.service";
import { getTasks } from "@/services/task.service";
import { getUsers } from "@/services/user.service";
import { TeamBoard } from "@/components/Dashboard/TeamBoard";

type ProjectsPageProps = {
	searchParams?: Promise<{
		returnTo?: string;
	}>;
};

export default async function ProjectsPage({ searchParams }: ProjectsPageProps) {
	void searchParams;
	const [projects, user, users] = await Promise.all([
		getProjects({ page: 1, limit: 100 }),
		getCurrentUser(),
		getUsers(),
	]);
	const tasks = await getTasks({ page: 1, limit: 100 });
	const canEdit = user?.role === "Admin" || user?.role === "ProjectManager";

	return (
		<div className="p-4 sm:p-6 lg:p-8">
			<TeamBoard
				projects={projects ?? []}
				tasks={tasks ?? []}
				users={users ?? []}
				title="Projects"
				description="Open a project to review its members, deadline, and status. This page now reads from the dedicated project API helpers."
				roleLabel={user?.role ? `${user.role} workspace` : "Projects workspace"}
				canEdit={canEdit}
			/>
		</div>
	);
}