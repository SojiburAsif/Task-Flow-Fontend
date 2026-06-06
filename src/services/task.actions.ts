"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

import { authCookieNames } from "@/lib/authUtils";
import { getProxyEnv } from "@/lib/env";
import { deleteTask, updateTask } from "@/services/task.service";

type ActionState = {
	success: boolean;
	message: string;
};

const buildCookieHeader = (accessToken?: string, refreshToken?: string, sessionToken?: string) => {
	const parts = [
		accessToken ? `${authCookieNames.accessToken}=${accessToken}` : "",
		refreshToken ? `${authCookieNames.refreshToken}=${refreshToken}` : "",
		sessionToken ? `${authCookieNames.sessionToken}=${sessionToken}` : "",
	].filter(Boolean);

	return parts.join("; ");
};

const allowedStatuses = ["Todo", "InProgress", "Completed"] as const;

const revalidateTaskViews = (taskId: string, returnTo?: string | null) => {
	revalidatePath("/dashboard/my-tasks");
	revalidatePath("/dashboard/tasks");
	revalidatePath("/dashboard/AdminTasks");
	revalidatePath(`/dashboard/tasks/${taskId}`);
	revalidatePath("/dashboard/projects");
	revalidatePath(`/dashboard/tasks/${taskId}/edit`);

	if (returnTo?.startsWith("/dashboard")) {
		revalidatePath(returnTo);
	}
};

export const updateTaskStatusAction = async (
	prevState: ActionState = { success: false, message: "" },
	formData?: FormData,
) => {
	void prevState;

	if (!formData) {
		return { success: false, message: "No form data provided" };
	}

	const id = formData.get("id")?.toString().trim();
	const status = formData.get("status")?.toString().trim();
	const assignedToId = formData.has("assignedToId") ? formData.get("assignedToId")?.toString().trim() || null : undefined;

	if (!id) {
		return { success: false, message: "Task ID is required." };
	}

	if (!status || !allowedStatuses.includes(status as (typeof allowedStatuses)[number])) {
		return { success: false, message: "Please select a valid task status." };
	}

	try {
		await updateTask(id, {
			status: status as "Todo" | "InProgress" | "Completed",
			...(assignedToId !== undefined ? { assignedToId } : {}),
		});
		revalidateTaskViews(id, formData.get("returnTo")?.toString() ?? null);
		return { success: true, message: "Task updated successfully" };
	} catch (error) {
		return { success: false, message: error instanceof Error ? error.message : "Failed to update task" };
	}
};

export const updateTaskAction = async (
	prevState: ActionState = { success: false, message: "" },
	formData?: FormData,
) => {
	void prevState;

	if (!formData) {
		return { success: false, message: "No form data provided" };
	}

	const id = formData.get("id")?.toString().trim();
	const returnTo = formData.get("returnTo")?.toString().trim() || undefined;
	const title = formData.has("title") ? formData.get("title")?.toString().trim() || "" : undefined;
	const description = formData.has("description") ? formData.get("description")?.toString().trim() || null : undefined;
	const dueDateRaw = formData.has("dueDate") ? formData.get("dueDate")?.toString().trim() || "" : undefined;
	const priority = formData.has("priority") ? formData.get("priority")?.toString().trim() || undefined : undefined;
	const status = formData.has("status") ? formData.get("status")?.toString().trim() || undefined : undefined;
	const assignedToId = formData.has("assignedToId") ? formData.get("assignedToId")?.toString().trim() || null : undefined;

	if (!id) {
		return { success: false, message: "Task ID is required." };
	}

	const payload: Record<string, unknown> = {};

	if (title !== undefined) {
		if (!title) {
			return { success: false, message: "Task title is required." };
		}

		payload.title = title;
	}

	if (description !== undefined) {
		payload.description = description || null;
	}

	if (dueDateRaw !== undefined) {
		if (!dueDateRaw) {
			return { success: false, message: "Please select a valid deadline." };
		}

		const parsedDueDate = new Date(dueDateRaw);
		if (Number.isNaN(parsedDueDate.getTime())) {
			return { success: false, message: "Please select a valid deadline." };
		}

		payload.dueDate = parsedDueDate.toISOString();
	}

	if (priority !== undefined) {
		payload.priority = priority;
	}

	if (status !== undefined) {
		if (!allowedStatuses.includes(status as (typeof allowedStatuses)[number])) {
			return { success: false, message: "Please select a valid task status." };
		}

		payload.status = status;
	}

	if (assignedToId !== undefined) {
		payload.assignedToId = assignedToId;
	}

	if (Object.keys(payload).length === 0) {
		return { success: false, message: "At least one field is required." };
	}

	try {
		await updateTask(id, payload as Parameters<typeof updateTask>[1]);
		revalidateTaskViews(id, returnTo);
		return { success: true, message: "Task updated successfully" };
	} catch (error) {
		return { success: false, message: error instanceof Error ? error.message : "Failed to update task" };
	}
};

export const deleteTaskAction = async (
	prevState: ActionState = { success: false, message: "" },
	formData?: FormData,
) => {
	void prevState;

	if (!formData) {
		return { success: false, message: "No form data provided" };
	}

	const id = formData.get("id")?.toString().trim();
	const returnTo = formData.get("returnTo")?.toString().trim() || "/dashboard/tasks";

	if (!id) {
		return { success: false, message: "Task ID is required." };
	}

	try {
		await deleteTask(id);
		revalidateTaskViews(id, returnTo);
		return { success: true, message: "Task deleted successfully" };
	} catch (error) {
		return { success: false, message: error instanceof Error ? error.message : "Failed to delete task" };
	}
};

export const createTaskAction = async (prevState: { success: boolean; message: string } = { success: false, message: "" }, formData: FormData) => {
	void prevState;
	const title = formData.get("title")?.toString().trim() || "";
	const description = formData.get("description")?.toString().trim() || "";
	const dueDateRaw = formData.get("dueDate")?.toString().trim() || "";
	const priority = formData.get("priority")?.toString().trim() || undefined;
	const projectId = formData.get("projectId")?.toString().trim() || undefined;
	const assignedToId = formData.get("assignedToId")?.toString().trim() || undefined;
	const attachmentLinksRaw = formData.get("attachmentLinks")?.toString().trim() || "";

	if (!title) throw new Error("Task title is required.");
	if (!projectId) throw new Error("Project ID is required.");

	// Validate and convert due date to ISO
	if (!dueDateRaw) throw new Error("Please select a valid deadline.");
	const dueDateParsed = new Date(dueDateRaw);
	if (Number.isNaN(dueDateParsed.getTime())) throw new Error("Please select a valid deadline.");
	const dueDate = dueDateParsed.toISOString();

	const cookieStore = await cookies();
	const accessToken = cookieStore.get(authCookieNames.accessToken)?.value;
	const refreshToken = cookieStore.get(authCookieNames.refreshToken)?.value;
	const sessionToken = cookieStore.get(authCookieNames.sessionToken)?.value;

	const payload: Record<string, unknown> = {
		title,
		description: description || undefined,
		dueDate,
		priority: priority || undefined,
		projectId,
		assignedToId: assignedToId || undefined,
	};

	const attachments: string[] = [];

	if (attachmentLinksRaw) {
		for (const link of attachmentLinksRaw.split(/\r?\n|,/)) {
			const trimmedLink = link.trim();
			if (trimmedLink) {
				attachments.push(trimmedLink);
			}
		}
	}

	if (attachments.length > 0) payload.attachments = attachments;

	const proxyEnv = getProxyEnv();
	const res = await fetch(`${proxyEnv.BASE_API_URL}/tasks`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Cookie: buildCookieHeader(accessToken, refreshToken, sessionToken),
			...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
			...(sessionToken ? { "x-session-token": sessionToken } : {}),
		},
		body: JSON.stringify(payload),
		cache: "no-store",
	});

	if (!res.ok) {
		let body: unknown = null;
		try {
			body = await res.json();
		} catch {
			try {
				body = await res.text();
			} catch {
				body = null;
			}
		}

		const statusInfo = `HTTP ${res.status} ${res.statusText}`;
		const bodyMessage = body && typeof body === "object" ? JSON.stringify(body) : String(body ?? "");
		return { success: false, message: bodyMessage ? `${statusInfo}: ${bodyMessage}` : `${statusInfo}: Failed to create task` };
	}

	revalidatePath("/dashboard/my-tasks");
	revalidatePath("/dashboard/tasks");
	revalidatePath("/dashboard/AdminTasks");
	return { success: true, message: "Task created successfully" };
};