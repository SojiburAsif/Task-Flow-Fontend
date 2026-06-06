import { NextRequest, NextResponse } from "next/server";

import { getMyNotifications, markAllNotificationsAsRead, markNotificationAsRead } from "@/services/notification.service";

export async function GET(req: NextRequest) {
	const searchParams = req.nextUrl.searchParams;
	const payload = await getMyNotifications({
		page: searchParams.get("page") ?? undefined,
		limit: searchParams.get("limit") ?? undefined,
		read: searchParams.get("read") ?? undefined,
	});

	if (!payload) {
		return NextResponse.json({ success: false, message: "Failed to load notifications" }, { status: 400 });
	}

	return NextResponse.json({ success: true, data: payload });
}

export async function PATCH(req: NextRequest) {
	try {
		const body = (await req.json().catch(() => null)) as { id?: string; readAll?: boolean } | null;

		if (body?.id) {
			const updated = await markNotificationAsRead(body.id);

			if (!updated) {
				return NextResponse.json({ success: false, message: "Notification not found" }, { status: 400 });
			}

			return NextResponse.json({ success: true, data: updated });
		}

		const count = await markAllNotificationsAsRead();
		return NextResponse.json({ success: true, data: { count } });
	} catch (error) {
		const message = error instanceof Error ? error.message : "Failed to update notifications";
		return NextResponse.json({ success: false, message }, { status: 400 });
	}
}
