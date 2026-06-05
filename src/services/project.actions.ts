"use server";

import { redirect } from "next/navigation";

import { createProject, updateProject } from "@/services/project.service";

const readFormValue = (formData: FormData, key: string) => {
	const value = formData.get(key);
	return typeof value === "string" ? value.trim() : "";
};

const readMemberIds = (formData: FormData) => {
	const memberIds: string[] = [];

	for (const [key, value] of formData.entries()) {
		if (key.startsWith("member-") && value === "on") {
			memberIds.push(key.replace("member-", ""));
		}
	}

	return memberIds;
};

export const createProjectAction = async (formData: FormData) => {
	const name = readFormValue(formData, "name");
	const description = readFormValue(formData, "description");
	const deadline = readFormValue(formData, "deadline");
	const status = readFormValue(formData, "status") || undefined;
	const memberIds = readMemberIds(formData);

	if (!name || !description || !deadline) {
		throw new Error("Please provide project name, description and deadline.");
	}

	const created = await createProject({
		name,
		description,
		deadline: new Date(deadline).toISOString(),
		status,
		memberIds: memberIds.length > 0 ? memberIds : undefined,
	});

	redirect(`/dashboard/projects?view=${created.id}`);
};

export const updateProjectAction = async (formData: FormData) => {
	const id = readFormValue(formData, "id");
	const name = readFormValue(formData, "name") || undefined;
	const description = readFormValue(formData, "description") || undefined;
	const deadline = readFormValue(formData, "deadline") || undefined;
	const status = readFormValue(formData, "status") || undefined;
	const memberIds = readMemberIds(formData);

	if (!id) {
		throw new Error("Project ID is required.");
	}

	await updateProject(id, {
		...(name ? { name } : {}),
		...(description ? { description } : {}),
		...(deadline ? { deadline: new Date(deadline).toISOString() } : {}),
		...(status ? { status } : {}),
		memberIds,
	});

	redirect(`/dashboard/projects?view=${id}`);
};
