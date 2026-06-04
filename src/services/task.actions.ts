"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

import { authCookieNames } from "@/lib/authUtils";
import { getProxyEnv } from "@/lib/env";
import { uploadToImgbb } from "@/lib/imageUpload.utils";

const buildCookieHeader = (accessToken?: string, refreshToken?: string, sessionToken?: string) => {
	const parts = [
		accessToken ? `${authCookieNames.accessToken}=${accessToken}` : "",
		refreshToken ? `${authCookieNames.refreshToken}=${refreshToken}` : "",
		sessionToken ? `${authCookieNames.sessionToken}=${sessionToken}` : "",
	].filter(Boolean);

	return parts.join("; ");
};

const allowedStatuses = ["Todo", "InProgress", "Completed"] as const;

export const updateTaskStatusAction = async (
	prevState: { success: boolean; message: string } = { success: false, message: "" },
	formData?: FormData,
) => {
	void prevState;

	if (!formData) {
		return { success: false, message: "No form data provided" };
	}

	const id = formData.get("id")?.toString().trim();
	const status = formData.get("status")?.toString().trim();
	const assignedToId = formData.get("assignedToId")?.toString().trim() || undefined;

	if (!id) {
		return { success: false, message: "Task ID is required." };
	}

	if (!status || !allowedStatuses.includes(status as (typeof allowedStatuses)[number])) {
		return { success: false, message: "Please select a valid task status." };
	}

	const cookieStore = await cookies();
	const accessToken = cookieStore.get(authCookieNames.accessToken)?.value;
	const refreshToken = cookieStore.get(authCookieNames.refreshToken)?.value;
	const sessionToken = cookieStore.get(authCookieNames.sessionToken)?.value;

	const proxyEnv = getProxyEnv();
	const bodyPayload: Record<string, unknown> = { status };
	if (assignedToId) bodyPayload.assignedToId = assignedToId;

	const res = await fetch(`${proxyEnv.BASE_API_URL}/tasks/${id}`, {
		method: "PATCH",
		headers: {
			"Content-Type": "application/json",
			Cookie: buildCookieHeader(accessToken, refreshToken, sessionToken),
			...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
			...(sessionToken ? { "x-session-token": sessionToken } : {}),
		},
		body: JSON.stringify(bodyPayload),
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
		return { success: false, message: bodyMessage ? `${statusInfo}: ${bodyMessage}` : `${statusInfo}: Failed to update task` };
	}

	revalidatePath("/dashboard/my-tasks");
	revalidatePath("/dashboard/tasks");
	revalidatePath("/dashboard/AdminTasks");
	return { success: true, message: "Task updated successfully" };
};

export const createTaskAction = async (prevState: { success: boolean; message: string } = { success: false, message: "" }, formData: FormData) => {
	void prevState;
	const title = formData.get("title")?.toString().trim() || "";
	const description = formData.get("description")?.toString().trim() || "";
	const dueDateRaw = formData.get("dueDate")?.toString().trim() || "";
	const priority = formData.get("priority")?.toString().trim() || undefined;
	const projectId = formData.get("projectId")?.toString().trim() || undefined;
	const assignedToId = formData.get("assignedToId")?.toString().trim() || undefined;

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

	// Handle file attachments (optional) - upload to image host and include URLs
	const attachmentsValues = formData.getAll("attachments") || [];
	const uploadedUrls: string[] = [];
	for (const entry of attachmentsValues) {
		if (entry instanceof File) {
			try {
				const url = await uploadToImgbb(entry);
				uploadedUrls.push(url);
			} catch (err) {
				// don't block task creation if upload fails; log for visibility
				if (process.env.NODE_ENV !== "production") console.error("attachment upload failed", err);
			}
		}
	}
	if (uploadedUrls.length > 0) payload.attachments = uploadedUrls;

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