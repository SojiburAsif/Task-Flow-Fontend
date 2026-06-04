"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { authCookieNames } from "@/lib/authUtils";
import { getProxyEnv } from "@/lib/env";

const buildCookieHeader = (accessToken?: string, refreshToken?: string, sessionToken?: string) => {
  const parts = [
    accessToken ? `${authCookieNames.accessToken}=${accessToken}` : "",
    refreshToken ? `${authCookieNames.refreshToken}=${refreshToken}` : "",
    sessionToken ? `${authCookieNames.sessionToken}=${sessionToken}` : "",
  ].filter(Boolean);

  return parts.join("; ");
};

const readMemberIds = (formData: FormData) => {
  const memberIds: string[] = [];

  for (const [key, value] of formData.entries()) {
    if (key.startsWith("member-") && value === "on") {
      memberIds.push(key.replace("member-", ""));
    }
  }

  return memberIds;
};

const parseProjectFormData = (formData: FormData) => {
  const id = formData.get("id")?.toString();
  const name = formData.get("name")?.toString() ?? "";
  const description = formData.get("description")?.toString() ?? "";
  const deadline = formData.get("deadline")?.toString() ?? undefined;
  const status = formData.get("status")?.toString() ?? undefined;
  const memberIds = readMemberIds(formData);

  if (!id) {
    throw new Error("Project ID is required.");
  }

  if (!name.trim() || !description.trim() || !deadline) {
    throw new Error("Please provide project name, description and a valid deadline.");
  }

  const parsedDeadline = new Date(deadline);
  if (Number.isNaN(parsedDeadline.getTime())) {
    throw new Error("Deadline must be a valid date.");
  }

  return {
    id,
    payload: {
      name: name.trim(),
      description: description.trim(),
      deadline: parsedDeadline.toISOString(),
      status: status || null,
      memberIds,
    },
  };
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
    const message = bodyMessage ? `${statusInfo}: ${bodyMessage}` : `${statusInfo}: Failed to delete project`;
    throw new Error(message);
  }

  return;
};

export const updateProjectAction = async (formData: FormData) => {
  const { id, payload } = parseProjectFormData(formData);
  const returnTo = formData.get("returnTo")?.toString();

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
    const message = bodyMessage ? `${statusInfo}: ${bodyMessage}` : `${statusInfo}: Failed to update project`;
    throw new Error(message);
  }

  revalidatePath(`/dashboard/projects/${id}`);
  revalidatePath("/dashboard/projects");
  // Redirect to caller-specified return URL (e.g. projects list) if provided
  redirect(returnTo || `/dashboard/projects/${id}`);
};