"use server";

import { cookies } from "next/headers";
import { authCookieNames } from "@/lib/authUtils";
import { getProxyEnv } from "@/lib/env";
import { revalidatePath } from "next/cache";

const buildCookieHeader = (accessToken?: string, refreshToken?: string, sessionToken?: string) => {
  const parts = [
    accessToken ? `${authCookieNames.accessToken}=${accessToken}` : "",
    refreshToken ? `${authCookieNames.refreshToken}=${refreshToken}` : "",
    sessionToken ? `${authCookieNames.sessionToken}=${sessionToken}` : "",
  ].filter(Boolean);

  return parts.join("; ");
};

export async function updateUserByAdminAction(formData: FormData) {
  try {
    const id = String(formData.get("id") || "");
    const role = formData.get("role");
    const status = formData.get("status");

    if (!id) {
      return { success: false, message: "Missing user id" };
    }

    const cookieStore = await cookies();
    const accessToken = cookieStore.get(authCookieNames.accessToken)?.value;
    const refreshToken = cookieStore.get(authCookieNames.refreshToken)?.value;
    const sessionToken = cookieStore.get(authCookieNames.sessionToken)?.value;

    const proxyEnv = getProxyEnv();
    const body: Record<string, unknown> = {};
    if (role) body.role = String(role);
    if (status) body.status = String(status);

    const res = await fetch(`${proxyEnv.BASE_API_URL}/auth/users/${id}`, {
      method: "PATCH",
      headers: {
        Cookie: buildCookieHeader(accessToken, refreshToken, sessionToken),
        "Content-Type": "application/json",
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const payload = await res.json().catch(() => null);
      const message = payload?.message || `Failed to update user (${res.status})`;
      return { success: false, message };
    }

    revalidatePath("/dashboard/members");
    return { success: true, message: "User updated" };
  } catch (err) {
    return { success: false, message: String(err) };
  }
}

export async function deleteUserByAdminAction(formData: FormData) {
  try {
    const id = String(formData.get("id") || "");
    if (!id) return { success: false, message: "Missing user id" };

    const cookieStore = await cookies();
    const accessToken = cookieStore.get(authCookieNames.accessToken)?.value;
    const refreshToken = cookieStore.get(authCookieNames.refreshToken)?.value;
    const sessionToken = cookieStore.get(authCookieNames.sessionToken)?.value;

    const proxyEnv = getProxyEnv();
    const res = await fetch(`${proxyEnv.BASE_API_URL}/auth/users/${id}`, {
      method: "DELETE",
      headers: {
        Cookie: buildCookieHeader(accessToken, refreshToken, sessionToken),
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
    });

    if (!res.ok) {
      const payload = await res.json().catch(() => null);
      const message = payload?.message || `Failed to delete user (${res.status})`;
      return { success: false, message };
    }

    revalidatePath("/dashboard/members");
    return { success: true, message: "User deleted" };
  } catch (err) {
    return { success: false, message: String(err) };
  }
}
