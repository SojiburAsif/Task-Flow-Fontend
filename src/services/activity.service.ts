import "server-only";

import { cookies } from "next/headers";

import { authCookieNames } from "@/lib/authUtils";
import { getProxyEnv } from "@/lib/env";

export type ActivityRecord = {
  id: string;
  text: string;
  createdAt: string;
  project: {
    id: string;
    name: string;
  };
  performedBy: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
    role: string;
  };
};

type ActivitiesResponse = {
  success?: boolean;
  data?: ActivityRecord[];
};

const buildCookieHeader = (accessToken?: string, refreshToken?: string, sessionToken?: string) => {
  const parts = [
    accessToken ? `${authCookieNames.accessToken}=${accessToken}` : "",
    refreshToken ? `${authCookieNames.refreshToken}=${refreshToken}` : "",
    sessionToken ? `${authCookieNames.sessionToken}=${sessionToken}` : "",
  ].filter(Boolean);

  return parts.join("; ");
};

export const getLatestActivities = async (): Promise<ActivityRecord[] | null> => {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get(authCookieNames.accessToken)?.value;
    const refreshToken = cookieStore.get(authCookieNames.refreshToken)?.value;
    const sessionToken = cookieStore.get(authCookieNames.sessionToken)?.value;

    const proxyEnv = getProxyEnv();
    const res = await fetch(`${proxyEnv.BASE_API_URL}/activities/latest`, {
      method: "GET",
      headers: {
        Cookie: buildCookieHeader(accessToken, refreshToken, sessionToken),
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        ...(sessionToken ? { "x-session-token": sessionToken } : {}),
      },
      cache: "no-store",
    });

    if (!res.ok) {
      return null;
    }

    const payload = (await res.json()) as ActivitiesResponse;
    return payload?.success && Array.isArray(payload.data) ? payload.data : null;
  } catch {
    return null;
  }
};
