import { NextRequest, NextResponse } from "next/server";

import { requestCommentsDetailed } from "@/services/comment.service";

export async function GET(req: NextRequest) {
	const searchParams = req.nextUrl.searchParams;
	const query = new URLSearchParams();

	for (const [key, value] of searchParams.entries()) {
		if (value.trim()) {
			query.set(key, value);
		}
	}

	const payload = await requestCommentsDetailed<{ items: unknown[]; total: number; page: number; limit: number }>(`/tasks/comments${query.toString() ? `?${query.toString()}` : ""}`);

	if (!payload) {
		return NextResponse.json({ success: false, message: "Failed to load comments" }, { status: 500 });
	}

	return NextResponse.json(
		payload.ok
			? { success: true, data: payload.data }
			: { success: false, message: payload.message ?? "Failed to load comments" },
		{ status: payload.status },
	);
}