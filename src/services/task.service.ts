import "server-only";

import { cookies } from "next/headers";

import { authCookieNames } from "@/lib/authUtils";
import { getProxyEnv } from "@/lib/env";

export type TaskStatusValue = "Todo" | "InProgress" | "Completed";
export type TaskPriorityValue = "High" | "Medium" | "Low";

export type TaskProject = {
  id: string;
  name: string;
  description?: string | null;
  status?: string | null;
  deadline?: string | null;
  createdBy?: { id: string; name?: string | null } | null;
  members?: Array<{ id: string; name?: string | null }> | null;
};

export type TaskRecord = {
  id: string;
  title: string;
  description?: string | null;
  dueDate: string;
  priority?: TaskPriorityValue | null;
  status?: TaskStatusValue | null;
  attachments?: string[] | null;
  project: TaskProject;
  assignedTo?: { id: string; name?: string | null; email?: string | null; image?: string | null } | null;
  createdAt?: string;
  updatedAt?: string;
};

export type TaskUpdatePayload = Partial<{
  title: string;
  description: string | null;
  assignedToId: string | null;
  dueDate: string;
  priority: TaskPriorityValue;
  status: TaskStatusValue;
  attachments: string[];
}>;

type TasksResponse = {
  success?: boolean;
  data?: TaskRecord[];
};

type TaskResponse = {
  success?: boolean;
  data?: TaskRecord;
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
  if (!query) return "";

  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== null && String(value).trim()) {
      searchParams.set(key, String(value));
    }
  }

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : "";
};

const fetchTasks = async (path: string): Promise<TaskRecord[] | null> => {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get(authCookieNames.accessToken)?.value;
    const refreshToken = cookieStore.get(authCookieNames.refreshToken)?.value;
    const sessionToken = cookieStore.get(authCookieNames.sessionToken)?.value;

    const proxyEnv = getProxyEnv();
    const res = await fetch(`${proxyEnv.BASE_API_URL}${path}`, {
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

    const payload = (await res.json()) as TasksResponse;
    return payload?.success && Array.isArray(payload.data) ? payload.data : null;
  } catch {
    return null;
  }
};

export const getTasks = async (query?: Record<string, string | number | undefined>): Promise<TaskRecord[] | null> => {
  return fetchTasks(`/tasks${buildQueryString({ page: 1, limit: 100, ...query })}`);
};

export const getMyTasks = async (query?: Record<string, string | number | undefined>): Promise<TaskRecord[] | null> => {
  return fetchTasks(`/tasks/my${buildQueryString({ page: 1, limit: 100, ...query })}`);
};

export const getTaskById = async (id: string): Promise<TaskRecord | null> => {
  if (!id.trim()) return null;

  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get(authCookieNames.accessToken)?.value;
    const refreshToken = cookieStore.get(authCookieNames.refreshToken)?.value;
    const sessionToken = cookieStore.get(authCookieNames.sessionToken)?.value;

    const proxyEnv = getProxyEnv();
    const res = await fetch(`${proxyEnv.BASE_API_URL}/tasks/${id}`, {
      method: "GET",
      headers: {
        Cookie: buildCookieHeader(accessToken, refreshToken, sessionToken),
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        ...(sessionToken ? { "x-session-token": sessionToken } : {}),
      },
      cache: "no-store",
    });

    if (!res.ok) return null;

    const payload = (await res.json()) as { success?: boolean; data?: TaskRecord };
    return payload?.success ? payload.data ?? null : null;
  } catch {
    return null;
  }
};

export const updateTask = async (id: string, payload: TaskUpdatePayload): Promise<TaskRecord> => {
  if (!id.trim()) {
    throw new Error("Task ID is required.");
  }

  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get(authCookieNames.accessToken)?.value;
    const refreshToken = cookieStore.get(authCookieNames.refreshToken)?.value;
    const sessionToken = cookieStore.get(authCookieNames.sessionToken)?.value;

    const proxyEnv = getProxyEnv();
    const res = await fetch(`${proxyEnv.BASE_API_URL}/tasks/${id}`, {
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
      throw new Error(bodyMessage ? `${statusInfo}: ${bodyMessage}` : `${statusInfo}: Failed to update task`);
    }

    const payloadData = (await res.json()) as TaskResponse;
    if (!payloadData?.success || !payloadData.data) {
      throw new Error("Failed to update task");
    }

    return payloadData.data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Failed to update task");
  }
};
