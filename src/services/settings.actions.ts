"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

import { authCookieNames } from "@/lib/authUtils";
import { getProxyEnv } from "@/lib/env";
import { uploadToImgbb } from "@/lib/imageUpload.utils";

export type SettingsActionState = {
  success: boolean;
  message: string;
};

const buildCookieHeader = (accessToken?: string, refreshToken?: string, sessionToken?: string) => {
  const parts = [
    accessToken ? `${authCookieNames.accessToken}=${accessToken}` : "",
    refreshToken ? `${authCookieNames.refreshToken}=${refreshToken}` : "",
    sessionToken ? `${authCookieNames.sessionToken}=${sessionToken}` : "",
  ].filter(Boolean);

  return parts.join("; ");
};

const revalidateSettingsViews = () => {
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/settings");
  revalidatePath("/dashboard/AdminSettings");
};

export const updateSettingsProfileAction = async (
  _prevState: SettingsActionState = { success: false, message: "" },
  formData?: FormData,
): Promise<SettingsActionState> => {
  if (!formData) {
    return { success: false, message: "No form data provided" };
  }

  const name = formData.get("name")?.toString().trim() ?? "";
  const image = formData.get("image")?.toString().trim() ?? "";
  const avatarFile = formData.get("avatar");

  if (!name) {
    return { success: false, message: "Name is required." };
  }

  if (image) {
    try {
      new URL(image);
    } catch {
      return { success: false, message: "Image URL must be a valid URL." };
    }
  }

  let uploadedImageUrl = image || null;
  if (avatarFile instanceof File && avatarFile.size > 0) {
    try {
      uploadedImageUrl = await uploadToImgbb(avatarFile);
    } catch {
      return { success: false, message: "Avatar upload failed. Please try another image." };
    }
  }

  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get(authCookieNames.accessToken)?.value;
    const refreshToken = cookieStore.get(authCookieNames.refreshToken)?.value;
    const sessionToken = cookieStore.get(authCookieNames.sessionToken)?.value;

    const proxyEnv = getProxyEnv();
    const res = await fetch(`${proxyEnv.BASE_API_URL}/auth/profile`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Cookie: buildCookieHeader(accessToken, refreshToken, sessionToken),
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        ...(sessionToken ? { "x-session-token": sessionToken } : {}),
      },
      body: JSON.stringify({
        name,
        image: uploadedImageUrl,
      }),
      cache: "no-store",
    });

    if (!res.ok) {
      const payload = (await res.json().catch(() => null)) as { message?: string } | null;
      return { success: false, message: payload?.message || "Failed to update profile." };
    }

    revalidateSettingsViews();
    return { success: true, message: "Profile updated successfully." };
  } catch {
    return { success: false, message: "Failed to update profile." };
  }
};

export const changeSettingsPasswordAction = async (
  _prevState: SettingsActionState = { success: false, message: "" },
  formData?: FormData,
): Promise<SettingsActionState> => {
  if (!formData) {
    return { success: false, message: "No form data provided" };
  }

  const currentPassword = formData.get("currentPassword")?.toString().trim() ?? "";
  const newPassword = formData.get("newPassword")?.toString().trim() ?? "";
  const confirmPassword = formData.get("confirmPassword")?.toString().trim() ?? "";
  const revokeOtherSessions = formData.get("revokeOtherSessions") === "on";

  if (!currentPassword || !newPassword || !confirmPassword) {
    return { success: false, message: "All password fields are required." };
  }

  if (newPassword.length < 8) {
    return { success: false, message: "New password must be at least 8 characters." };
  }

  if (newPassword !== confirmPassword) {
    return { success: false, message: "Confirm password does not match." };
  }

  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get(authCookieNames.accessToken)?.value;
    const refreshToken = cookieStore.get(authCookieNames.refreshToken)?.value;
    const sessionToken = cookieStore.get(authCookieNames.sessionToken)?.value;

    const proxyEnv = getProxyEnv();
    const res = await fetch(`${proxyEnv.BASE_API_URL}/auth/change-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: buildCookieHeader(accessToken, refreshToken, sessionToken),
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        ...(sessionToken ? { "x-session-token": sessionToken } : {}),
      },
      body: JSON.stringify({
        currentPassword,
        newPassword,
        revokeOtherSessions,
      }),
      cache: "no-store",
    });

    if (!res.ok) {
      const payload = (await res.json().catch(() => null)) as { message?: string } | null;
      return { success: false, message: payload?.message || "Failed to change password." };
    }

    revalidateSettingsViews();
    return { success: true, message: "Password changed successfully." };
  } catch {
    return { success: false, message: "Failed to change password." };
  }
};
