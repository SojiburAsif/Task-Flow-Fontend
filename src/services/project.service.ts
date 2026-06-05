"use server";

import "server-only";

import { cookies } from "next/headers";

import { authCookieNames } from "@/lib/authUtils";
import { getProxyEnv } from "@/lib/env";

export type ProjectMember = {
	id: string;
	name?: string | null;
	email?: string | null;
	image?: string | null;
};

export type ProjectOwner = {
	id: string;
	name?: string | null;
	email?: string | null;
	image?: string | null;
};

export type ProjectRecord = {
	id: string;
	name: string;
	description: string;
	deadline: string;
	status?: string | null;
	createdAt?: string;
	updatedAt?: string;
	createdBy?: ProjectOwner | null;
	members?: ProjectMember[] | null;
};

export type ProjectPayload = Partial<{
	name: string;
	description: string;
	deadline: string;
	status: string | null;
	memberIds: string[];
}>;

type BackendResponse<T> = {
	success?: boolean;
	message?: string;
	data?: T;
};

type ProjectListResponse = {
	success?: boolean;
	data?: ProjectRecord[];
};

type ProjectResponse = {
	success?: boolean;
	data?: ProjectRecord;
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

const requestProjects = async <T>(path: string, init?: RequestInit): Promise<T | null> => {
	try {
		const proxyEnv = getProxyEnv();
		const response = await fetch(`${proxyEnv.BASE_API_URL}${path}`, {
			cache: "no-store",
			...init,
			headers: {
				...(await getAuthHeaders()),
				...(init?.headers ?? {}),
			},
		});

		if (!response.ok) {
			return null;
		}

		return (await response.json()) as T;
	} catch {
		return null;
	}
};

export const getProjects = async (query?: Record<string, string | number | undefined>): Promise<ProjectRecord[] | null> => {
	const payload = await requestProjects<ProjectListResponse>(`/projects${buildQueryString(query)}`);
	return payload?.success && Array.isArray(payload.data) ? payload.data : null;
};

export const getMyProjects = async (query?: Record<string, string | number | undefined>): Promise<ProjectRecord[] | null> => {
	const payload = await requestProjects<ProjectListResponse>(`/projects/my${buildQueryString(query)}`);
	return payload?.success && Array.isArray(payload.data) ? payload.data : null;
};

export const getProjectById = async (id: string): Promise<ProjectRecord | null> => {
	if (typeof id !== "string" || !id.trim()) {
		return null;
	}

	const payload = await requestProjects<ProjectResponse>(`/projects/${id}`);
	return payload?.success ? payload.data ?? null : null;
};

export const createProject = async (payload: ProjectPayload): Promise<ProjectRecord> => {
	const response = await requestProjects<BackendResponse<ProjectRecord>>("/projects", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(payload),
	});

	if (!response?.success || !response.data) {
		throw new Error("Failed to create project");
	}

	return response.data;
};

export const updateProject = async (id: string, payload: ProjectPayload): Promise<ProjectRecord> => {
	if (typeof id !== "string" || !id.trim()) {
		throw new Error("Project ID is required");
	}

	const response = await requestProjects<BackendResponse<ProjectRecord>>(`/projects/${id}`, {
		method: "PATCH",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(payload),
	});

	if (!response?.success || !response.data) {
		throw new Error("Failed to update project");
	}

	return response.data;
};

export const deleteProject = async (id: string): Promise<void> => {
	if (typeof id !== "string" || !id.trim()) {
		throw new Error("Project ID is required");
	}

	const response = await requestProjects<BackendResponse<ProjectRecord>>(`/projects/${id}`, {
		method: "DELETE",
	});

	if (!response?.success) {
		throw new Error("Failed to delete project");
	}
};
