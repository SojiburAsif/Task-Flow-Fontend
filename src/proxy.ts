import { NextRequest, NextResponse } from "next/server";
import { getServerEnv } from "./lib/env"; 
import { jwtUtils } from "./lib/jwtUtils";   


export type ProjectRole = "Admin" | "ProjectManager" | "TeamMember";

type AuthUserInfo = {
    email: string;
    role?: string;
    name?: string;
};


const normalizeRole = (role: unknown): ProjectRole | null => {
    if (role === "Admin" || role === "ADMIN") return "Admin";
    if (role === "ProjectManager") return "ProjectManager";
    if (role === "TeamMember") return "TeamMember";
    return null;
};

// ৩. কোনো রোল মিসিং থাকলে বা আন-অথরাইজড হলে ফলব্যাক ড্যাশবোর্ড রুট
const getFallbackDashboardRoute = (role: ProjectRole | null) => {
    void role;
    return "/dashboard";
};

// ৪. লেগাসি বা ওল্ড রোল-প্রিফিক্সড ইউআরএল হ্যান্ডেল করার জন্য
const resolveDashboardAliasOwner = (pathname: string): ProjectRole | null => {
    if (pathname.startsWith("/admin/dashboard")) return "Admin";
    if (pathname.startsWith("/manager/dashboard")) return "ProjectManager";
    if (pathname.startsWith("/member/dashboard")) return "TeamMember";
    return null;
};

// ৫. রাউটের মালিকানা বা প্রটেকশন টাইপ ডিটেক্ট করা (কাস্টম বা সিম্পল চেকিং)
const getRouteType = (pathname: string) => {
    const authRoutes = ["/login", "/signup"];
    const publicRoutes = ["/", "/favicon.ico"];
    
    if (authRoutes.includes(pathname)) return "AUTH";
    if (publicRoutes.some(route => pathname === route || pathname.startsWith("/_next"))) return "PUBLIC";
    return "PROTECTED"; // বাকি সব রুট যেমন /dashboard, /projects, /tasks প্রটেক্টেড
};

// ৬. ব্যাকএন্ড থেকে কারেন্ট ইউজারের সেশন ভেরিফাই করার ফাংশন
const getUserInfoFromApi = async (
    cookieHeader?: string,
    accessToken?: string,
    sessionToken?: string
): Promise<AuthUserInfo | null> => {
    try {
        const serverEnv = getServerEnv();
        const fallbackCookieParts: string[] = [];
        if (accessToken) fallbackCookieParts.push(`accessToken=${accessToken}`);
        if (sessionToken) fallbackCookieParts.push(`better-auth.session_token=${sessionToken}`);

        const finalCookieHeader = cookieHeader || fallbackCookieParts.join("; ");

        if (!finalCookieHeader) return null;

        // আপনার পোস্টম্যান গাইড অনুযায়ী সেন্ট্রাল অথ এপিআই বেস (/api/auth/profile বা /api/auth/me)
        const response = await fetch(`${serverEnv.BASE_API_URL}/auth/me`, {
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
        return payload?.data ?? null; // ব্যাকএন্ড রেসপন্স স্ট্রাকচার অনুযায়ী ডাটা রিটার্ন
    } catch {
        return null;
    }
};

export async function proxy(request: NextRequest) {
    try {
        const serverEnv = getServerEnv();
        const { pathname } = request.nextUrl;
        
        // কুকি থেকে টোকেন রিড করা
        const accessToken = request.cookies.get("accessToken")?.value;
        const sessionToken = request.cookies.get("better-auth.session_token")?.value;
        const rawCookieHeader = request.headers.get("cookie") || undefined;

        // এক্সেস টোকেন ভেরিফাই করা
        const verifiedAccessToken = accessToken
            ? jwtUtils.verifyToken(accessToken, serverEnv.JWT_ACCESS_SECRET)
            : { success: false as const, data: null };

        const isValidAccessToken = Boolean(verifiedAccessToken.success);
        const decodedAccessToken = verifiedAccessToken.success ? verifiedAccessToken.data : null;
        
        // এপিআই থেকে ইউজার ডেটা আনা
        const authUserInfo = (accessToken || sessionToken)
            ? await getUserInfoFromApi(rawCookieHeader, accessToken, sessionToken)
            : null;

        // রোল ডিটেক্ট করা
        const userRole =
            normalizeRole(decodedAccessToken?.role) ||
            normalizeRole(authUserInfo?.role) ||
            (sessionToken ? "TeamMember" : null);

        const isAuthenticated = isValidAccessToken || Boolean(authUserInfo) || Boolean(sessionToken);
        const routeType = getRouteType(pathname);
        const dashboardAliasOwner = resolveDashboardAliasOwner(pathname);

        // রুল ১: লগইন থাকা অবস্থায় কোনো ইউজার যেন আবার /login বা /signup পেজে না যেতে পারে
        if (routeType === "AUTH" && isAuthenticated) {
            return NextResponse.redirect(new URL(getFallbackDashboardRoute(userRole), request.url));
        }

        // রুল ২: ওল্ড রোল-ভিত্তিক ড্যাশবোর্ড ইউআরএলগুলোকে ইউনিফাইড /dashboard রুটে রিডাইরেক্ট করা
        if (dashboardAliasOwner) {
            if (!isAuthenticated || !userRole) {
                return NextResponse.redirect(new URL("/login", request.url));
            }
            return NextResponse.redirect(new URL("/dashboard", request.url));
        }

        // রুল ৩: পাবলিক রুট হলে সরাসরি অ্যাক্সেস দেওয়া
        if (routeType === "PUBLIC") {
            return NextResponse.next();
        }

        // রুল ৪: প্রটেক্টেড রুট (যেমন ড্যাশবোর্ড) কিন্তু ইউজার লগইন নেই -> রিডাইরেক্ট টু লগইন
        if (routeType === "PROTECTED" && !isAuthenticated) {
            return NextResponse.redirect(new URL("/login", request.url));
        }

        return NextResponse.next();
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