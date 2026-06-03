export const normalizeRoleLabel = (role: string) => {
	const normalized = role.replace(/[_\s-]+/g, " ").trim().toLowerCase();

	if (normalized === "admin") return "Admin";
	if (normalized === "project manager") return "Project Manager";
	if (normalized === "team member") return "Team Member";

	return normalized
		.split(" ")
		.filter(Boolean)
		.map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
		.join(" ");
};

export const normalizeDashboardRole = (role: string) => {
	const normalized = role.replace(/[_\s-]+/g, "").toLowerCase();

	if (normalized === "admin") return "ADMIN";
	if (normalized === "projectmanager") return "PROJECT_MANAGER";
	if (normalized === "teammember") return "TEAM_MEMBER";

	return "TEAM_MEMBER";
};