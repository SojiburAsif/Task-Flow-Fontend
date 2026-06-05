import { notFound } from "next/navigation";

import { getCurrentUser } from "@/lib/currentUser";
import { getTaskById } from "@/services/task.service";
import { TaskEditForm } from "@/components/Dashboard/TaskEditForm";

type Props = {
	params: Promise<{ id: string }>;
	searchParams?: Promise<{ returnTo?: string | string[] }>;
};

export default async function EditTaskPage({ params, searchParams }: Props) {
	const resolvedParams = await params;
	const resolvedSearchParams = searchParams ? await searchParams : undefined;
	const [task, user] = await Promise.all([getTaskById(resolvedParams.id), getCurrentUser()]);

	if (!task) {
		notFound();
	}

	const returnTo = typeof resolvedSearchParams?.returnTo === "string" && resolvedSearchParams.returnTo.startsWith("/dashboard")
		? resolvedSearchParams.returnTo
		: `/dashboard/tasks/${task.id}`;
	const mode = user?.role === "Admin" || user?.role === "ProjectManager" ? "full" : "status";

	return (
		<div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
			<TaskEditForm task={task} mode={mode} returnTo={returnTo} />
		</div>
	);
}
