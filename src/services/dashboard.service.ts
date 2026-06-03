import { cookies } from "next/headers";

import { authCookieNames } from "@/lib/authUtils";
import { getProxyEnv } from "@/lib/env";

export type DashboardStats = {
	counts: {
		totalProjects: number;
		totalTasks: number;
		completedTasks: number;
		pendingTasks: number;
		overdueTasks: number;
	};
	priorityDistribution: {
		high: number;
		medium: number;
		low: number;
	};
	projectProgress: Array<{
		id: string;
		name: string;
		progressPercentage: number;
	}>;
};

type DashboardStatsResponse = {
	success?: boolean;
	data?: DashboardStats;
};

const buildCookieHeader = (accessToken?: string, refreshToken?: string, sessionToken?: string) => {
	const parts = [
		accessToken ? `${authCookieNames.accessToken}=${accessToken}` : "",
		refreshToken ? `${authCookieNames.refreshToken}=${refreshToken}` : "",
		sessionToken ? `${authCookieNames.sessionToken}=${sessionToken}` : "",
	].filter(Boolean);

	return parts.join("; ");
};

export const getDashboardStats = async (): Promise<DashboardStats | null> => {
	try {
		const cookieStore = await cookies();
		const accessToken = cookieStore.get(authCookieNames.accessToken)?.value;
		const refreshToken = cookieStore.get(authCookieNames.refreshToken)?.value;
		const sessionToken = cookieStore.get(authCookieNames.sessionToken)?.value;

		if (!accessToken && !refreshToken && !sessionToken) {
			return null;
		}

		const proxyEnv = getProxyEnv();
		const response = await fetch(`${proxyEnv.BASE_API_URL}/dashboard/stats`, {
			method: "GET",
			headers: {
				Cookie: buildCookieHeader(accessToken, refreshToken, sessionToken),
				...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
				...(sessionToken ? { "x-session-token": sessionToken } : {}),
			},
			cache: "no-store",
		});

		if (!response.ok) {
			return null;
		}

		const payload = (await response.json()) as DashboardStatsResponse;
		return payload?.success ? payload.data ?? null : null;
	} catch {
		return null;
	}
};
