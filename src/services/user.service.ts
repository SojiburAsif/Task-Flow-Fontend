"use server";

import { cookies } from "next/headers";
import { authCookieNames } from "@/lib/authUtils";
import { getProxyEnv } from "@/lib/env";

export type UserProfile = {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  role: string;
  status: string;
};

const buildCookieHeader = (accessToken?: string, refreshToken?: string, sessionToken?: string) => {
  const parts = [
    accessToken ? `${authCookieNames.accessToken}=${accessToken}` : "",
    refreshToken ? `${authCookieNames.refreshToken}=${refreshToken}` : "",
    sessionToken ? `${authCookieNames.sessionToken}=${sessionToken}` : "",
  ].filter(Boolean);

  return parts.join("; ");
};

export const getUsers = async (): Promise<UserProfile[] | null> => {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get(authCookieNames.accessToken)?.value;
    const refreshToken = cookieStore.get(authCookieNames.refreshToken)?.value;
    const sessionToken = cookieStore.get(authCookieNames.sessionToken)?.value;

    const proxyEnv = getProxyEnv();
    const res = await fetch(`${proxyEnv.BASE_API_URL}/auth/users`, {
      method: "GET",
      headers: {
        Cookie: buildCookieHeader(accessToken, refreshToken, sessionToken),
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        ...(sessionToken ? { "x-session-token": sessionToken } : {}),
      },
      cache: "no-store",
    });

    if (!res.ok) return null;

    const payload = (await res.json());
    return payload?.success && Array.isArray(payload.data) ? payload.data : null;
  } catch {
    return null;
  }
};
