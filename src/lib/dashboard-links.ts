import { normalizeDashboardRole } from "@/lib/roleUtils";

export type DashboardSearchTarget = "project" | "task";

export const getRoleDashboardHref = (role?: string | null, target?: DashboardSearchTarget) => {
	const normalizedRole = role ? normalizeDashboardRole(role) : "TEAM_MEMBER";

	if (target === "project") {
		switch (normalizedRole) {
			case "ADMIN":
				return "/dashboard/AdminProjects";
			case "PROJECT_MANAGER":
				return "/dashboard/projects";
			default:
				return "/dashboard/my-projects";
		}
	}

	switch (normalizedRole) {
		case "ADMIN":
			return "/dashboard/AdminTasks";
		case "PROJECT_MANAGER":
			return "/dashboard/tasks";
		default:
			return "/dashboard/my-tasks";
	}
};

export const getProjectDetailsHref = (projectId: string, returnTo?: string) => {
	if (!projectId.trim()) {
		return "/dashboard/projects";
	}

	void returnTo;
	return "/dashboard/projects";
};

export const getTaskDetailsHref = (taskId: string, returnTo?: string) => {
	if (!taskId.trim()) {
		return "/dashboard/tasks";
	}

	void returnTo;
	return "/dashboard/projects";
};
