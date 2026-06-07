"use server";

import "server-only";

import { cookies } from "next/headers";

import { authCookieNames } from "@/lib/authUtils";
import { getProxyEnv } from "@/lib/env";

export type CommentUser = {
	id: string;
	name?: string | null;
	email?: string | null;
	image?: string | null;
	role?: string | null;
};

export type TaskCommentRecord = {
	id: string;
	taskId: string;
	text: string;
	createdAt: string;
	user: CommentUser;
};

export type TaskCommentFeedRecord = TaskCommentRecord & {
	task: {
		id: string;
		title: string;
		status?: string | null;
		project: {
			id: string;
			name: string;
		};
	};
};

export type TaskCommentFeedResponse = {
	items: TaskCommentFeedRecord[];
	total: number;
	page: number;
	limit: number;
};

type BackendResponse<T> = {
	success?: boolean;
	message?: string;
	data?: T;
};

type BackendResult<T> = {
	ok: boolean;
	status: number;
	message?: string;
	data?: T;
};

const buildCookieHeader = (accessToken?: string, refreshToken?: string, sessionToken?: string) => {
	const parts = [
		accessToken ? `${authCookieNames.accessToken}=${accessToken}` : "",
		refreshToken ? `${authCookieNames.refreshToken}=${refreshToken}` : "",
		sessionToken ? `${authCookieNames.sessionToken}=${sessionToken}` : "",
	].filter(Boolean);

	return parts.join("; ");
};

const buildQueryString = (query?: Record<string, string | number | undefined>) => {
	if (!query) {
		return "";
	}

	const searchParams = new URLSearchParams();
	for (const [key, value] of Object.entries(query)) {
		if (value !== undefined && value !== null && String(value).trim()) {
			searchParams.set(key, String(value));
		}
	}

	const queryString = searchParams.toString();
	return queryString ? `?${queryString}` : "";
};

const getAuthHeaders = async () => {
	const cookieStore = await cookies();
	const accessToken = cookieStore.get(authCookieNames.accessToken)?.value;
	const refreshToken = cookieStore.get(authCookieNames.refreshToken)?.value;
	const sessionToken = cookieStore.get(authCookieNames.sessionToken)?.value;

	return {
		Cookie: buildCookieHeader(accessToken, refreshToken, sessionToken),
		...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
		...(sessionToken ? { "x-session-token": sessionToken } : {}),
	};
};

const getCommentBaseUrls = () => {
	const proxyEnv = getProxyEnv();
	const baseUrls = [proxyEnv.BASE_API_URL.replace(/\/$/, "")];
	const liveBaseUrl = "https://taskflowbackend-phi.vercel.app/api";

	if (!baseUrls.includes(liveBaseUrl)) {
		baseUrls.push(liveBaseUrl);
	}

	if (!baseUrls[0].includes("localhost:5000")) {
		baseUrls.push("http://localhost:5000/api");
	}

	return baseUrls;
};

const requestComments = async <T>(path: string, init?: RequestInit): Promise<T | null> => {
	try {
		for (const baseUrl of getCommentBaseUrls()) {
			const response = await fetch(`${baseUrl}${path}`, {
				cache: "no-store",
				...init,
				headers: {
					...(await getAuthHeaders()),
					...(init?.headers ?? {}),
				},
			});

			if (!response.ok) {
				continue;
			}

			return (await response.json()) as T;
		}
	} catch {
		return null;
	}

	return null;
};

export const requestCommentsDetailed = async <T>(path: string, init?: RequestInit): Promise<BackendResult<T> | null> => {
	try {
		for (const baseUrl of getCommentBaseUrls()) {
			const response = await fetch(`${baseUrl}${path}`, {
				cache: "no-store",
				...init,
				headers: {
					...(await getAuthHeaders()),
					...(init?.headers ?? {}),
				},
			});

			const payload = (await response.json().catch(() => null)) as BackendResponse<T> | null;

			if (!response.ok) {
				const message = payload?.message ?? "";
				if (response.status === 404 && /route not found/i.test(message)) {
					continue;
				}
			}

			return {
				ok: response.ok && Boolean(payload?.success),
				status: response.status,
				message: payload?.message,
				data: payload?.data,
			};
		}

		return null;
	} catch {
		return null;
	}
};

export const getTaskComments = async (taskId: string): Promise<TaskCommentRecord[] | null> => {
	if (!taskId.trim()) {
		return null;
	}

	const payload = await requestComments<BackendResponse<TaskCommentRecord[]>>(`/tasks/${taskId}/comments`);
	return payload?.success && Array.isArray(payload.data) ? payload.data : null;
};

export const createTaskComment = async (taskId: string, text: string): Promise<TaskCommentRecord | null> => {
	if (!taskId.trim() || !text.trim()) {
		return null;
	}

	const payload = await requestComments<BackendResponse<TaskCommentRecord>>(`/tasks/${taskId}/comments`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ text }),
	});

	return payload?.success ? payload.data ?? null : null;
};

export const deleteTaskComment = async (taskId: string, commentId: string): Promise<boolean> => {
	if (!taskId.trim() || !commentId.trim()) {
		return false;
	}

	const payload = await requestComments<BackendResponse<null>>(`/tasks/${taskId}/comments/${commentId}`, {
		method: "DELETE",
	});

	return Boolean(payload?.success);
};

export const getAllTaskComments = async (query?: Record<string, string | number | undefined>): Promise<TaskCommentFeedResponse | null> => {
	const payload = await requestComments<BackendResponse<TaskCommentFeedResponse>>(`/tasks/comments${buildQueryString(query)}`);
	return payload?.success && payload.data ? payload.data : null;
};