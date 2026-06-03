import { cookies } from "next/headers";

import { authCookieNames } from "@/lib/authUtils";
import { getProxyEnv } from "@/lib/env";

export type CurrentUser = {
	id: string;
	name: string;
	email: string;
	role: string;
	image?: string | null;
};

type AuthMeResponse = {
	success?: boolean;
	data?: CurrentUser;
};

const buildCookieHeader = (accessToken?: string, refreshToken?: string, sessionToken?: string) => {
	const parts = [
		accessToken ? `${authCookieNames.accessToken}=${accessToken}` : "",
		refreshToken ? `${authCookieNames.refreshToken}=${refreshToken}` : "",
		sessionToken ? `${authCookieNames.sessionToken}=${sessionToken}` : "",
	].filter(Boolean);

	return parts.join("; ");
};

const normalizeUser = (user: CurrentUser | null | undefined): CurrentUser | null => {
	if (!user) {
		return null;
	}

	return {
		...user,
		role: String(user.role),
	};
};

export const getCurrentUser = async (): Promise<CurrentUser | null> => {
	try {
		const cookieStore = await cookies();
		const accessToken = cookieStore.get(authCookieNames.accessToken)?.value;
		const refreshToken = cookieStore.get(authCookieNames.refreshToken)?.value;
		const sessionToken = cookieStore.get(authCookieNames.sessionToken)?.value;

		if (!accessToken && !refreshToken && !sessionToken) {
			return null;
		}

		const proxyEnv = getProxyEnv();
		const response = await fetch(`${proxyEnv.BASE_API_URL}/auth/me`, {
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

		const payload = (await response.json()) as AuthMeResponse;
		return normalizeUser(payload?.data);
	} catch {
		return null;
	}
};