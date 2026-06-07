import { NextRequest, NextResponse } from "next/server";

import { createTaskComment, getTaskComments, requestCommentsDetailed } from "@/services/comment.service";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ taskId: string }> }) {
	const { taskId } = await params;
	const payload = await requestCommentsDetailed<unknown[]>(`/tasks/${taskId}/comments`);

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

export async function POST(req: NextRequest, { params }: { params: Promise<{ taskId: string }> }) {
	const { taskId } = await params;
	const body = (await req.json().catch(() => null)) as { text?: string } | null;
	const created = await requestCommentsDetailed<unknown>(`/tasks/${taskId}/comments`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ text: body?.text ?? "" }),
	});

	if (!created) {
		return NextResponse.json({ success: false, message: "Failed to create comment" }, { status: 500 });
	}

	return NextResponse.json(
		created.ok
			? { success: true, data: created.data }
			: { success: false, message: created.message ?? "Failed to create comment" },
		{ status: created.status },
	);
}