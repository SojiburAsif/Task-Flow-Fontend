import { NextRequest, NextResponse } from "next/server";

import { getProxyEnv } from "./lib/env";
import { jwtUtils } from "./lib/jwtUtils";

export type ProjectRole = "Admin" | "ProjectManager" | "TeamMember";

type AuthUserInfo = {
    email: string;
    role?: string;
    name?: string;
};

type AuthTokens = {
    accessToken?: string;
    refreshToken?: string;
    sessionToken?: string;
};

const normalizeRole = (role: unknown): ProjectRole | null => {
    if (role === "Admin" || role === "ADMIN") return "Admin";
    if (role === "ProjectManager") return "ProjectManager";
    if (role === "TeamMember") return "TeamMember";
    return null;
};

const getFallbackDashboardRoute = (role: ProjectRole | null) => {
    void role;
    return "/dashboard";
};

const resolveDashboardAliasOwner = (pathname: string): ProjectRole | null => {
    if (pathname.startsWith("/admin/dashboard")) return "Admin";
    if (pathname.startsWith("/manager/dashboard")) return "ProjectManager";
    if (pathname.startsWith("/member/dashboard")) return "TeamMember";
    return null;
};

const getRouteType = (pathname: string) => {
    const authRoutes = ["/login", "/register", "/signup"];
    const publicRoutes = ["/", "/favicon.ico", "/logo.png"];
    const staticAssets = [".svg", ".png", ".jpg", ".jpeg", ".gif", ".ico", ".webp"];

    if (authRoutes.includes(pathname)) return "AUTH";
    if (
        publicRoutes.includes(pathname) ||
        pathname.startsWith("/_next") ||
        staticAssets.some(ext => pathname.endsWith(ext))
    ) {
        return "PUBLIC";
    }
    return "PROTECTED";
};

const buildCookieHeader = (tokens: AuthTokens) => {
    const cookieParts = [
        tokens.accessToken ? `accessToken=${tokens.accessToken}` : "",
        tokens.refreshToken ? `refreshToken=${tokens.refreshToken}` : "",
        tokens.sessionToken ? `sessionToken=${tokens.sessionToken}` : "",
    ].filter(Boolean);

    return cookieParts.join("; ");
};

const applyAuthCookies = (response: NextResponse, tokens?: AuthTokens | null) => {
    if (!tokens) {
        return response;
    }

    if (tokens.accessToken) {
        response.cookies.set("accessToken", tokens.accessToken, { httpOnly: true, path: "/", sameSite: "lax" });
    }

    if (tokens.refreshToken) {
        response.cookies.set("refreshToken", tokens.refreshToken, { httpOnly: true, path: "/", sameSite: "lax" });
    }

    if (tokens.sessionToken) {
        response.cookies.set("sessionToken", tokens.sessionToken, { httpOnly: true, path: "/", sameSite: "lax" });
    }

    return response;
};

const refreshAuthTokensFromApi = async (
    refreshToken?: string,
    sessionToken?: string
): Promise<AuthTokens | null> => {
    if (!refreshToken) {
        return null;
    }

    try {
        const proxyEnv = getProxyEnv();
        const response = await fetch(`${proxyEnv.BASE_API_URL}/auth/refresh-token`, {
            method: "GET",
            headers: {
                Cookie: buildCookieHeader({ refreshToken, sessionToken }),
            },
            cache: "no-store",
        });

        if (!response.ok) {
            return null;
        }

        const payload = await response.json();

        if (!payload?.success || !payload?.data?.accessToken || !payload?.data?.refreshToken) {
            return null;
        }

        return {
            accessToken: payload.data.accessToken,
            refreshToken: payload.data.refreshToken,
            sessionToken: payload.data.sessionToken ?? sessionToken,
        };
    } catch {
        return null;
    }
};

const getUserInfoFromApi = async (
    accessToken?: string,
    refreshToken?: string,
    sessionToken?: string
): Promise<AuthUserInfo | null> => {
    try {
        const proxyEnv = getProxyEnv();
        const finalCookieHeader = buildCookieHeader({ accessToken, refreshToken, sessionToken });

        if (!finalCookieHeader) return null;

        const response = await fetch(`${proxyEnv.BASE_API_URL}/auth/me`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Cookie: finalCookieHeader,
                ...(!sessionToken && accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
                ...(sessionToken ? { "x-session-token": sessionToken } : {}),
            },
            cache: "no-store",
        });

        if (!response.ok) return null;

        const payload = await response.json();
        return payload?.data ?? null;
    } catch {
        return null;
    }
};

export async function proxy(request: NextRequest) {
    try {
        const proxyEnv = getProxyEnv();
        const { pathname } = request.nextUrl;

        let accessToken = request.cookies.get("accessToken")?.value;
        let refreshToken = request.cookies.get("refreshToken")?.value;
        let sessionToken = request.cookies.get("sessionToken")?.value;
        let refreshedTokens: AuthTokens | null = null;

        let verifiedAccessToken = accessToken
            ? jwtUtils.verifyToken(accessToken, proxyEnv.JWT_ACCESS_SECRET)
            : { success: false as const, data: null };

        if (!verifiedAccessToken.success && refreshToken) {
            refreshedTokens = await refreshAuthTokensFromApi(refreshToken, sessionToken);

            if (refreshedTokens?.accessToken && refreshedTokens.refreshToken) {
                accessToken = refreshedTokens.accessToken;
                refreshToken = refreshedTokens.refreshToken;
                sessionToken = refreshedTokens.sessionToken ?? sessionToken;
                verifiedAccessToken = jwtUtils.verifyToken(accessToken, proxyEnv.JWT_ACCESS_SECRET);
            }
        }

        const isValidAccessToken = Boolean(verifiedAccessToken.success);
        const decodedAccessToken = verifiedAccessToken.success ? verifiedAccessToken.data : null;

        const authUserInfo = (accessToken || sessionToken)
            ? await getUserInfoFromApi(accessToken, refreshToken, sessionToken)
            : null;

        const userRole =
            normalizeRole(decodedAccessToken?.role) ||
            normalizeRole(authUserInfo?.role) ||
            (sessionToken ? "TeamMember" : null);

        const isAuthenticated = isValidAccessToken || Boolean(authUserInfo) || Boolean(sessionToken);
        const routeType = getRouteType(pathname);
        const dashboardAliasOwner = resolveDashboardAliasOwner(pathname);
        const withAuthCookies = (response: NextResponse) => applyAuthCookies(response, refreshedTokens);

        if (routeType === "AUTH" && isAuthenticated) {
            return withAuthCookies(NextResponse.redirect(new URL(getFallbackDashboardRoute(userRole), request.url)));
        }

        if (dashboardAliasOwner) {
            if (!isAuthenticated || !userRole) {
                return withAuthCookies(NextResponse.redirect(new URL("/login", request.url)));
            }

            return withAuthCookies(NextResponse.redirect(new URL("/dashboard", request.url)));
        }

        if (routeType === "PUBLIC") {
            return withAuthCookies(NextResponse.next());
        }

        if (routeType === "PROTECTED" && !isAuthenticated) {
            return withAuthCookies(NextResponse.redirect(new URL("/login", request.url)));
        }

        return withAuthCookies(NextResponse.next());
    } catch (error) {
        console.error("Error in proxy middleware:", error);
        return NextResponse.next();
    }
}

export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.well-known).*)",
    ],
};