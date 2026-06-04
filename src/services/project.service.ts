/* eslint-disable @typescript-eslint/no-explicit-any */
import "server-only";
import { cookies } from "next/headers";

import { authCookieNames } from "@/lib/authUtils";
import { getProxyEnv } from "@/lib/env";

export type ProjectMember = {
  id: string;
  name?: string | null;
};

export type ProjectRecord = {
  id: string;
  name: string;
  description?: string | null;
  deadline?: string | null;
  status?: string | null;
  createdBy?: { id: string; name?: string | null } | null;
  members?: ProjectMember[] | null;
};

type ProjectsResponse = {
  success?: boolean;
  data?: ProjectRecord[];
};

const buildCookieHeader = (accessToken?: string, refreshToken?: string, sessionToken?: string) => {
  const parts = [
    accessToken ? `${authCookieNames.accessToken}=${accessToken}` : "",
    refreshToken ? `${authCookieNames.refreshToken}=${refreshToken}` : "",
    sessionToken ? `${authCookieNames.sessionToken}=${sessionToken}` : "",
  ].filter(Boolean);

  return parts.join("; ");
};

export const getProjects = async (): Promise<ProjectRecord[] | null> => {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get(authCookieNames.accessToken)?.value;
    const refreshToken = cookieStore.get(authCookieNames.refreshToken)?.value;
    const sessionToken = cookieStore.get(authCookieNames.sessionToken)?.value;

    const proxyEnv = getProxyEnv();
    const res = await fetch(`${proxyEnv.BASE_API_URL}/projects`, {
      method: "GET",
      headers: {
        Cookie: buildCookieHeader(accessToken, refreshToken, sessionToken),
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        ...(sessionToken ? { "x-session-token": sessionToken } : {}),
      },
      cache: "no-store",
    });

    if (!res.ok) return null;

    const payload = (await res.json()) as ProjectsResponse;
    return payload?.success && Array.isArray(payload.data) ? payload.data : null;
  } catch {
    return null;
  }
};

export const createProject = async (payload: {
  name: string;
  description: string;
  deadline?: string | null;
  status?: string | null;
  memberIds?: string[] | null;
}) => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(authCookieNames.accessToken)?.value;
  const refreshToken = cookieStore.get(authCookieNames.refreshToken)?.value;
  const sessionToken = cookieStore.get(authCookieNames.sessionToken)?.value;

  const proxyEnv = getProxyEnv();
  const res = await fetch(`${proxyEnv.BASE_API_URL}/projects`, {
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
    // Try to extract JSON error body, fallback to plain text for full visibility
    let body: any = null;
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
    const message = bodyMessage ? `${statusInfo}: ${bodyMessage}` : `${statusInfo}: Failed to create project`;
    throw new Error(message);
  }

  return (await res.json()).data as ProjectRecord;
};

export const updateProject = async (id: string, payload: Partial<{ name: string; description: string; deadline?: string | null; status?: string | null; memberIds?: string[] | null }>) => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(authCookieNames.accessToken)?.value;
  const refreshToken = cookieStore.get(authCookieNames.refreshToken)?.value;
  const sessionToken = cookieStore.get(authCookieNames.sessionToken)?.value;

  const proxyEnv = getProxyEnv();
  const res = await fetch(`${proxyEnv.BASE_API_URL}/projects/${id}`, {
    method: "PATCH",
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
    let body: any = null;
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
    const message = bodyMessage ? `${statusInfo}: ${bodyMessage}` : `${statusInfo}: Failed to update project`;
    throw new Error(message);
  }

  return (await res.json()).data as ProjectRecord;
};

export const deleteProject = async (id: string) => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(authCookieNames.accessToken)?.value;
  const refreshToken = cookieStore.get(authCookieNames.refreshToken)?.value;
  const sessionToken = cookieStore.get(authCookieNames.sessionToken)?.value;

  const proxyEnv = getProxyEnv();
  const res = await fetch(`${proxyEnv.BASE_API_URL}/projects/${id}`, {
    method: "DELETE",
    headers: {
      Cookie: buildCookieHeader(accessToken, refreshToken, sessionToken),
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...(sessionToken ? { "x-session-token": sessionToken } : {}),
    },
    cache: "no-store",
  });

  if (!res.ok) {
    let body: any = null;
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
    const message = bodyMessage ? `${statusInfo}: ${bodyMessage}` : `${statusInfo}: Failed to delete project`;
    throw new Error(message);
  }

  return true;
};
