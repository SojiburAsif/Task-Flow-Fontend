"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { publicEnv } from "@/lib/env";
import { authCookieNames, buildAuthErrorMessage, getJwtMaxAgeInSeconds } from "@/lib/authUtils";
import { changePasswordSchema, demoLoginSchema, loginSchema, registerSchema } from "@/zod/AuthValidation";
import { uploadToImgbb } from "@/lib/imageUpload.utils";

type BackendResponse<T> = {
	success?: boolean;
	message?: string;
	data?: T;
};

type AuthResponseUser = {
	name: string;
	email: string;
	role: string;
};

type AuthResponse = {
	token: string | null;
	sessionToken: string | null;
	accessToken: string;
	refreshToken: string;
	user: AuthResponseUser;
};

export type AuthActionState = {
	success: boolean;
	message: string;
};

const initialAuthState: AuthActionState = {
	success: false,
	message: "",
};

const authBaseUrl = publicEnv.NEXT_PUBLIC_API_BASE_URL.replace(/\/$/, "");

const readFormValue = (formData: FormData, key: string) => {
	const value = formData.get(key);

	return typeof value === "string" ? value.trim() : "";
};

const readRememberMe = (formData: FormData) => formData.get("rememberMe") === "on";

const requestAuth = async (endpoint: string, payload: Record<string, unknown>) => {
	const response = await fetch(`${authBaseUrl}/auth${endpoint}`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(payload),
		cache: "no-store",
	});

	const body = (await response.json().catch(() => null)) as BackendResponse<AuthResponse> | null;

	if (!response.ok || !body?.success || !body.data) {
		throw new Error(buildAuthErrorMessage(body?.message, "Authentication request failed"));
	}

	return body.data;
};

const requestProtectedAuth = async (
	endpoint: string,
	payload: Record<string, unknown>,
	method: "POST" | "PATCH" = "POST",
) => {
	const cookieStore = await cookies();
	const cookieParts = [
		cookieStore.get(authCookieNames.accessToken)?.value ? `${authCookieNames.accessToken}=${cookieStore.get(authCookieNames.accessToken)?.value}` : "",
		cookieStore.get(authCookieNames.refreshToken)?.value ? `${authCookieNames.refreshToken}=${cookieStore.get(authCookieNames.refreshToken)?.value}` : "",
		cookieStore.get(authCookieNames.sessionToken)?.value ? `${authCookieNames.sessionToken}=${cookieStore.get(authCookieNames.sessionToken)?.value}` : "",
	].filter(Boolean);

	const response = await fetch(`${authBaseUrl}/auth${endpoint}`, {
		method,
		headers: {
			"Content-Type": "application/json",
			...(cookieParts.length > 0 ? { Cookie: cookieParts.join("; ") } : {}),
		},
		body: JSON.stringify(payload),
		cache: "no-store",
	});

	const body = (await response.json().catch(() => null)) as BackendResponse<AuthResponse> | null;

	if (!response.ok || !body?.success || !body.data) {
		throw new Error(buildAuthErrorMessage(body?.message, "Authentication request failed"));
	}

	return body.data;
};

const authCookieOptions = (maxAge?: number) => ({
	httpOnly: true,
	path: "/",
	sameSite: "lax" as const,
	secure: process.env.NODE_ENV === "production",
	...(typeof maxAge === "number" ? { maxAge } : {}),
});

const setAuthCookies = async (payload: AuthResponse, rememberMe: boolean) => {
	const cookieStore = await cookies();
	const accessTokenMaxAge = rememberMe ? getJwtMaxAgeInSeconds(payload.accessToken) : undefined;
	const refreshTokenMaxAge = rememberMe ? getJwtMaxAgeInSeconds(payload.refreshToken) : undefined;

	cookieStore.set(authCookieNames.accessToken, payload.accessToken, authCookieOptions(accessTokenMaxAge));
	cookieStore.set(authCookieNames.refreshToken, payload.refreshToken, authCookieOptions(refreshTokenMaxAge));

	if (payload.sessionToken) {
		cookieStore.set(authCookieNames.sessionToken, payload.sessionToken, authCookieOptions());
	}
};

const clearAuthCookies = async () => {
	const cookieStore = await cookies();
	const expiredOptions = authCookieOptions(0);

	cookieStore.set(authCookieNames.accessToken, "", expiredOptions);
	cookieStore.set(authCookieNames.refreshToken, "", expiredOptions);
	cookieStore.set(authCookieNames.sessionToken, "", expiredOptions);
};

const revokeBackendSession = async () => {
	const cookieStore = await cookies();
	const cookieParts = [
		cookieStore.get(authCookieNames.accessToken)?.value ? `${authCookieNames.accessToken}=${cookieStore.get(authCookieNames.accessToken)?.value}` : "",
		cookieStore.get(authCookieNames.refreshToken)?.value ? `${authCookieNames.refreshToken}=${cookieStore.get(authCookieNames.refreshToken)?.value}` : "",
		cookieStore.get(authCookieNames.sessionToken)?.value ? `${authCookieNames.sessionToken}=${cookieStore.get(authCookieNames.sessionToken)?.value}` : "",
	].filter(Boolean);

	if (cookieParts.length === 0) {
		return;
	}

	await fetch(`${authBaseUrl}/auth/logout`, {
		method: "POST",
		headers: {
			Cookie: cookieParts.join("; "),
		},
		cache: "no-store",
	}).catch(() => undefined);
};

const getErrorState = (message: string): AuthActionState => ({
	success: false,
	message,
});

export const loginAction = async (prevState: AuthActionState = initialAuthState, formData: FormData) => {
	void prevState;
	const parsed = loginSchema.safeParse({
		email: readFormValue(formData, "email"),
		password: readFormValue(formData, "password"),
		rememberMe: readRememberMe(formData),
	});

	if (!parsed.success) {
		return getErrorState(parsed.error.issues[0]?.message ?? "Please provide valid login details");
	}

	try {
		const result = await requestAuth("/login", parsed.data);
		await setAuthCookies(result, parsed.data.rememberMe);
	} catch (error) {
		return getErrorState(error instanceof Error ? error.message : "Unable to sign in");
	}

	redirect("/dashboard");
};

export const registerAction = async (prevState: AuthActionState = initialAuthState, formData: FormData) => {
	void prevState;
	const parsed = registerSchema.safeParse({
		name: readFormValue(formData, "name"),
		email: readFormValue(formData, "email"),
		password: readFormValue(formData, "password"),
		confirmPassword: readFormValue(formData, "confirmPassword"),
		role: readFormValue(formData, "role") || "TeamMember",
		image: readFormValue(formData, "image") || undefined,
		rememberMe: readRememberMe(formData),
	});

	if (!parsed.success) {
		return getErrorState(parsed.error.issues[0]?.message ?? "Please provide valid account details");
	}

	const buildRegisterPayload = (data: typeof parsed.data) => {
		const payload = { ...(data as Record<string, unknown>) };
		delete payload.confirmPassword;

		return payload;
	};

	try {
		const result = await requestAuth("/register", buildRegisterPayload(parsed.data));
		await setAuthCookies(result, parsed.data.rememberMe);
	} catch (error) {
		return getErrorState(error instanceof Error ? error.message : "Unable to create account");
	}

	redirect("/dashboard");
};

export const demoLoginAction = async (prevState: AuthActionState = initialAuthState, formData: FormData) => {
	void prevState;
	const parsed = demoLoginSchema.safeParse({
		role: readFormValue(formData, "role") || "member",
	});

	if (!parsed.success) {
		return getErrorState("Please choose a valid demo role");
	}

	try {
		const result = await requestAuth(`/demo-login/${parsed.data.role}`, {});
		await setAuthCookies(result, true);
	} catch (error) {
		return getErrorState(error instanceof Error ? error.message : "Unable to sign in as demo user");
	}

	redirect("/dashboard");
};

export const changePasswordAction = async (prevState: AuthActionState = initialAuthState, formData: FormData) => {
	void prevState;
	const parsed = changePasswordSchema.safeParse({
		currentPassword: readFormValue(formData, "currentPassword"),
		newPassword: readFormValue(formData, "newPassword"),
		confirmPassword: readFormValue(formData, "confirmPassword"),
		revokeOtherSessions: formData.get("revokeOtherSessions") === "on",
	});

	if (!parsed.success) {
		return getErrorState(parsed.error.issues[0]?.message ?? "Please provide valid password details");
	}

	try {
		const result = await requestProtectedAuth("/change-password", {
			currentPassword: parsed.data.currentPassword,
			newPassword: parsed.data.newPassword,
			revokeOtherSessions: parsed.data.revokeOtherSessions,
		});
		await setAuthCookies(result, true);
		return {
			success: true,
			message: "Password updated successfully",
		};
	} catch (error) {
		return getErrorState(error instanceof Error ? error.message : "Unable to change password");
	}
};

export const updateProfileAction = async (prevState: AuthActionState = initialAuthState, formData: FormData) => {
	void prevState;

	const name = readFormValue(formData, "name");
	const email = readFormValue(formData, "email");

	let avatarUrl: string | undefined = undefined;
	const avatar = formData.get("avatar");
	try {
		if (avatar && avatar instanceof File && avatar.size > 0) {
			avatarUrl = await uploadToImgbb(avatar);
		}
	} catch (err) {
		return getErrorState(err instanceof Error ? err.message : "Image upload failed");
	}

	try {
		const result = await requestProtectedAuth("/profile", {
			name,
			email,
			image: avatarUrl,
		}, "PATCH");

		// If backend returns new tokens/session, refresh cookies to keep session
		await setAuthCookies(result, true);

		return {
			success: true,
			message: "Profile updated successfully",
		};
	} catch (error) {
		return getErrorState(error instanceof Error ? error.message : "Unable to update profile");
	}
};

export const logoutAction = async () => {
	await revokeBackendSession();
	await clearAuthCookies();
	redirect("/login");
};
