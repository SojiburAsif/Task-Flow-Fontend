import { NextRequest, NextResponse } from "next/server";

import { getRoleDashboardHref } from "@/lib/dashboard-links";
import { getCurrentUser } from "@/lib/currentUser";
import { normalizeDashboardRole } from "@/lib/roleUtils";
import { getProjects } from "@/services/project.service";
import { getTasks } from "@/services/task.service";
import type { SearchResultItem } from "@/types/search";

const normalize = (value?: string | null) => (value ?? "").trim().toLowerCase();

export async function GET(request: NextRequest) {
	const { searchParams } = request.nextUrl;
	const query = normalize(searchParams.get("q"));
	const limitValue = Number(searchParams.get("limit") ?? 8);
	const limit = Number.isFinite(limitValue) ? Math.max(1, Math.min(limitValue, 20)) : 8;
	const currentUser = await getCurrentUser();
	const role = normalizeDashboardRole(currentUser?.role ?? "TeamMember");
	const isAdmin = role === "ADMIN";
	const isManager = role === "PROJECT_MANAGER";
	const isMember = role === "TEAM_MEMBER";

	if (!query) {
		return NextResponse.json({ success: true, data: [] satisfies SearchResultItem[] });
	}

	const [projects, tasks] = await Promise.all([
		isMember ? Promise.resolve(null) : isManager ? getProjects({ page: 1, limit: 100 }) : getProjects({ page: 1, limit: 100 }),
		getTasks({ page: 1, limit: 100 }),
	]);

	const results: SearchResultItem[] = [];

	for (const project of projects ?? []) {
		if (isMember) {
			continue;
		}

		if (isManager && project.createdBy?.id !== currentUser?.id) {
			continue;
		}

		const title = normalize(project.name);
		const description = normalize(project.description);
		if (title.includes(query) || description.includes(query) || normalize(project.status).includes(query)) {
			results.push({
				id: project.id,
				type: "project",
				title: project.name,
				subtitle: project.description,
				status: project.status,
				link: getRoleDashboardHref(currentUser?.role, "project"),
				target: "_self",
			});
		}
	}

	for (const task of tasks ?? []) {
		const taskOwnerId = task.assignedTo?.id;
		const taskProjectOwnerId = task.project?.createdBy?.id;
		const canSeeTask = isAdmin
			? true
			: isManager
				? taskOwnerId === currentUser?.id || taskProjectOwnerId === currentUser?.id
				: taskOwnerId === currentUser?.id;

		if (!canSeeTask) {
			continue;
		}

		const title = normalize(task.title);
		const description = normalize(task.description);
		const projectName = normalize(task.project?.name);
		if (title.includes(query) || description.includes(query) || projectName.includes(query) || normalize(task.status).includes(query)) {
			results.push({
				id: task.id,
				type: "task",
				title: task.title,
				subtitle: task.project?.name ?? null,
				status: task.status,
				link: getRoleDashboardHref(currentUser?.role, "task"),
				target: "_self",
			});
		}
	}

	const deduped = Array.from(new Map(results.map(result => [`${result.type}:${result.id}`, result])).values()).slice(0, limit);

	return NextResponse.json({ success: true, data: deduped });
}
