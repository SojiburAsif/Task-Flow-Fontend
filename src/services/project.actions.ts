"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createProject, deleteProject, updateProject } from "@/services/project.service";

type ActionState = {
	success: boolean;
	message: string;
 	data?: Record<string, unknown> | null;
};

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

export const createProjectAction = async (
	prevState: ActionState = { success: false, message: "" },
	formData?: FormData,
) => {
	void prevState;

	if (!formData) {
		return { success: false, message: "No form data provided.", data: null };
	}

	const name = readFormValue(formData, "name");
	const description = readFormValue(formData, "description");
	const deadline = readFormValue(formData, "deadline");
	const status = readFormValue(formData, "status") || undefined;
	const memberIds = readMemberIds(formData);

	if (!name || !description || !deadline) {
		return { success: false, message: "Please provide project name, description and deadline.", data: null };
	}

	// Require at least one member when creating a project
	if (memberIds.length === 0) {
		return { success: false, message: "Please assign at least one member to the project.", data: null };
	}

	try {
		const created = await createProject({
			name,
			description,
			deadline: new Date(deadline).toISOString(),
			status,
			memberIds: memberIds.length > 0 ? memberIds : undefined,
		});

		revalidateProjectViews(created.id);
		return { success: true, message: "Project created successfully.", data: { id: created.id } };
	} catch (error) {
		return { success: false, message: error instanceof Error ? error.message : "Failed to create project.", data: null };
	}
};

const revalidateProjectViews = (id: string, returnTo?: string | null) => {
	revalidatePath("/dashboard/projects");
	revalidatePath("/dashboard/AdminProjects");
	revalidatePath("/dashboard/@projectManager/projects");
	revalidatePath(`/dashboard/projects/${id}`);
	revalidatePath(`/dashboard/projects/${id}/edit`);

	if (returnTo?.startsWith("/dashboard")) {
		revalidatePath(returnTo);
	}
};

export const updateProjectAction = async (
	prevState: ActionState = { success: false, message: "" },
	formData?: FormData,
) => {
	void prevState;

	if (!formData) {
		return { success: false, message: "No form data provided." };
	}

	const id = readFormValue(formData, "id");
	const name = readFormValue(formData, "name") || undefined;
	const description = readFormValue(formData, "description") || undefined;
	const deadline = readFormValue(formData, "deadline") || undefined;
	const status = readFormValue(formData, "status") || undefined;
	const memberIds = readMemberIds(formData);
	const returnTo = readFormValue(formData, "returnTo") || null;

	if (!id) {
		return { success: false, message: "Project ID is required." };
	}

	try {
		await updateProject(id, {
			...(name ? { name } : {}),
			...(description ? { description } : {}),
			...(deadline ? { deadline: new Date(deadline).toISOString() } : {}),
			...(status ? { status } : {}),
			memberIds,
		});
		revalidateProjectViews(id, returnTo);
		return { success: true, message: "Project updated successfully." };
	} catch (error) {
		return { success: false, message: error instanceof Error ? error.message : "Failed to update project." };
	}
};

export const deleteProjectAction = async (
	prevState: ActionState = { success: false, message: "" },
	formData?: FormData,
) => {
	void prevState;

	if (!formData) {
		return { success: false, message: "No form data provided." };
	}

	const id = readFormValue(formData, "id");
	const returnTo = readFormValue(formData, "returnTo") || "/dashboard/projects";

	if (!id) {
		return { success: false, message: "Project ID is required." };
	}

	try {
		await deleteProject(id);
		revalidateProjectViews(id, returnTo);
		return { success: true, message: "Project deleted successfully." };
	} catch (error) {
		return { success: false, message: error instanceof Error ? error.message : "Failed to delete project." };
	}
};
