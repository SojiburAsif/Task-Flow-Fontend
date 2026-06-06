"use server";

import "server-only";

import { cookies } from "next/headers";

import { authCookieNames } from "@/lib/authUtils";
import { getProxyEnv } from "@/lib/env";
import type { NotificationRecord } from "@/types/notification";

type BackendResponse<T> = {
	success?: boolean;
	message?: string;
	data?: T;
};

type NotificationListResponse = {
	success?: boolean;
	data?: NotificationRecord[];
};

type NotificationSingleResponse = {
	success?: boolean;
	data?: NotificationRecord;
};

type NotificationCountResponse = {
	success?: boolean;
	data?: { count: number };
};

const buildCookieHeader = (accessToken?: string, refreshToken?: string, sessionToken?: string) => {
	const parts = [
		accessToken ? `${authCookieNames.accessToken}=${accessToken}` : "",
		refreshToken ? `${authCookieNames.refreshToken}=${refreshToken}` : "",
		sessionToken ? `${authCookieNames.sessionToken}=${sessionToken}` : "",
	].filter(Boolean);

	return parts.join("; ");
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

const requestNotifications = async <T>(path: string, init?: RequestInit): Promise<T | null> => {
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

export const getMyNotifications = async (query?: Record<string, string | number | undefined>): Promise<NotificationRecord[] | null> => {
	const searchParams = new URLSearchParams();

	if (query) {
		for (const [key, value] of Object.entries(query)) {
			if (value !== undefined && value !== null && String(value).trim()) {
				searchParams.set(key, String(value));
			}
		}
	}

	const queryString = searchParams.toString();
	const payload = await requestNotifications<NotificationListResponse>(`/notifications${queryString ? `?${queryString}` : ""}`);
	return payload?.success && Array.isArray(payload.data) ? payload.data : null;
};

export const markNotificationAsRead = async (id: string): Promise<NotificationRecord | null> => {
	if (!id.trim()) {
		return null;
	}

	const payload = await requestNotifications<NotificationSingleResponse>(`/notifications/${id}/read`, {
		method: "PATCH",
	});

	return payload?.success ? payload.data ?? null : null;
};

export const markAllNotificationsAsRead = async (): Promise<number> => {
	const payload = await requestNotifications<NotificationCountResponse>("/notifications/read-all", {
		method: "PATCH",
	});

	return payload?.success ? payload.data?.count ?? 0 : 0;
};
