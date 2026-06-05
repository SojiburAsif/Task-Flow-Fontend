import React from "react";

import { TaskBoard } from "../../../../../components/Dashboard/TaskBoard";
import { getCurrentUser } from "../../../../../lib/currentUser";
import { getTasks } from "../../../../../services/task.service";
import { getMyProjects } from "../../../../../services/project.service";

export default async function ProjectManagerTasksPage() {
	const [tasks, user, projects] = await Promise.all([
		getTasks({ sortBy: "priority", order: "asc" }),
		getCurrentUser(),
		getMyProjects(),
	]);

	return (
		<div className="p-4 sm:p-6 lg:p-8">
			<TaskBoard
				tasks={tasks ?? []}
				title="Task Management"
				description="Monitor every active task across the workspace, keep an eye on deadlines, and push updates directly from the board."
				roleLabel={user?.role ? `${user.role} panel` : "Project manager workspace"}
				returnTo="/dashboard/tasks"
				canCreateTask
				statusEditable
				allowAssignmentEdit
				allowTaskEdit
				projects={projects ?? []}
			/>
		</div>
	);
}
